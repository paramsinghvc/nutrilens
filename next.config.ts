import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  reactStrictMode: false,
  reactCompiler: true,
  allowedDevOrigins: ['witty-cougars-smell.loca.lt'],
};

export default nextConfig;
