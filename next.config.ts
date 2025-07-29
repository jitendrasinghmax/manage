import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['img.clerk.com'], // 👈 Add this line
  },
};

export default nextConfig;
