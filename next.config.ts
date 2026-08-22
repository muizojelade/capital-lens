import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.197.32.26"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xjgofrvkhceaofhgpmen.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};



export default nextConfig;