export async function getAccessToken(code: string) {
    console.log("get Access Token: ", code);

    const accessTokenParams = new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID!,
        client_secret: process.env.GITHUB_CLIENT_SECRET!,
        code,
    }).toString();

    const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`;

    const accessTokenResponse = await fetch(accessTokenURL, {
        method: "POST",
        headers: {
            Accept: "application/json"
        }
    })
    const { error, access_token } = await accessTokenResponse.json();

    if (error) {
        return new Response(null, {
            status: 400,
        })
    }
    return access_token;
}

export async function getGithubProfile(access_token: string) {
    console.log("getGithubProfile: ", access_token);

    // Next.js에서 GET 리퀘스트를 보내면 그 request(DATA)들은 Next.js의 cache에 저장됨
    // 이 리퀘스트가 모든 유저에 대해 동일하게 적용되는 건 원치 않음
    const userProfileResponse = await fetch("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${access_token}`
        },
        cache: "no-cache"
    })

    return userProfileResponse.json();

}

export async function getGithubEmail(access_token: string) {
    console.log("GetGithubEmail: ", access_token);
    const userEmailResponse = await fetch("https://api.github.com/user/emails", {
        headers: {
            Authorization: `Bearer ${access_token}`
        },
        cache: "no-cache"
    })
    const emails = await userEmailResponse.json();

    const primaryEmail = emails[0]?.email;
    return primaryEmail;
}
