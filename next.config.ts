import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.themealdb.com',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.loveandlemons.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
