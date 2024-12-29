import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Next.js의 Image 는 이미지를 자동으로 최적화하여 성능을 향상시키고 빠른 로딩이 되도록 함
  // 하지만 외부 호스트의 이미지 (다른 사이트의 이미지 링크 등)를 불러올때 보안상의 이유로 이 기능이 허용되지 않음.
  // 즉 에러 발생 
  // 유저가 업로드한 이미지들을 최적화 하는것, 즉 내가 비용을 지불함.
  // 이것을 예방하기 위해서 이곳에서 구체적으로 어떤 url을 Image 컴포넌트로 최적화 할것인지 구분하는 것F
  
  images: {
    remotePatterns: [
      { hostname: "avatars.githubusercontent.com" }
    ]
  }
};

export default nextConfig;
