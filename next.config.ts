import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co', // (Optional) Keep this if you still use placeholders
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;