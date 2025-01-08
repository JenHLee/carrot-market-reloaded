//route 파일로 URL의 특정 HTTP method handler를 만들 수 있음
//API route
//react.js나 HTML을 리턴하고 싶지 않을때 route.ts를 사용

export function GET() {
    const baseURL = "https://github.com/login/oauth/authorize"
    const params = {
        client_id: process.env.GITHUB_CLIENT_ID!,
        
        scope: "read:user, user:email", // scope: 우리가 user로부터 원하는 data (facebook = permission)
        allow_signup: "true",
    }
    const formattedParams = new URLSearchParams(params).toString();
    const finalUrl = `${baseURL}?${formattedParams}`
    return Response.redirect(finalUrl); // http://localhost:3000/github/complete?code=f1a8b7c143bf3d84d6e1
}