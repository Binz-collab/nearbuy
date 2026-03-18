import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactCompiler: true,
    typescript: {
        // 리팩토링 진행 중 빌드 에러 방지용. 추후 any 타입 제거 시 삭제 권장.
        ignoreBuildErrors: true,
    },
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
