import { getAccessToken, getGithubEmail, getGithubProfile } from "@/app/(auth)/login/github";
import db from "@/lib/db";
import { notFound } from "next/navigation";
import { NextRequest } from "next/server"
import loginUser from "../../login/login";

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get('code');
    if (!code) {
        return notFound();
    }

    const accessToken = await getAccessToken(code);
    const githubProfileData = await getGithubProfile(accessToken);
    const githubEmailData = await getGithubEmail(accessToken);

    // db에서 해당 github_id를 가진 user 찾기
    const user = await db.user.findUnique({
        where: {
            github_id: githubProfileData.id + "", // change to int => string
        },
        select: {
            id: true
        }
    });
    // 만약 존재한다면 = user 이미 가입했음 => login
    if (user) {
        //1. create login function
        await loginUser(user);
    }
    // 존재 하지 않는다면 = 새로운 유저, db에 create

    // TODO: code challenge
    // 2. check if there is a same username in DB
    // if it is => `${login}-gh` 
    const newUser = await db.user.create({
        data: {
            username: githubProfileData.login,
            github_id: githubProfileData.id + "", // change to int => string
            avatar: githubProfileData.avatar_url,
            email: githubEmailData
        },
        select: {
            id: true
        }
    })
    await loginUser(newUser);

}
