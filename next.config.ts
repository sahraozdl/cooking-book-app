import { NextConfig } from 'next';

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
    hostname: 'another-cdn.com',
    pathname: '/**',
  },
    ],
  },
};

export default nextConfig;
