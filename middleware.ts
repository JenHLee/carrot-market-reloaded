import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

interface Routes {
    [key: string]: boolean;
}

//인증되지 않은 user가 갈 수 있는 url
//hash map data구조와 비슷
//object 내부에 item이 있는지 차즌ㄴ 것은 array에서 찾는것보다 빠름
const publicOnlyUrls: Routes = {
    "/": true,
    "/login": true,
    "/sms": true,
    "/create-account": true,
}

// middleware function name has to be same as "middleware" not middleware's'
// config also has to be 'config'
// 1. 특정한 페이지에서만 미들웨어가 사용되게 
// 2. 쿠키 설정
// matcher을 이용하거나 아니면 if로 middleware안에서 url 비교
export async function middleware(request: NextRequest) {
    // console.log("hello")
    const session = await getSession();
    const exists = publicOnlyUrls[request.nextUrl.pathname]

    // user does not log in => only can go public url
    if (!session.id) {
        if (!exists) {
            return NextResponse.redirect(new URL("/", request.url))
        }
    } else {
        // user logged in => can't go public url (이미 로그인한 유저가 로그인, 어카운트 페이지를 가는 것은 이상함)
        if (exists) {
            return NextResponse.redirect(new URL("/products", request.url))
        }
    }
}

export const config = {
    // user로 시작하는 모든 path에서 middleware 사용
    // matcher: ["/", "/profile", "/create-account", "/user/:path*"]
    // 아래의 것으로 시작하는 것을 제외하고 middleware 사용, check next.js 공식문서 
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}