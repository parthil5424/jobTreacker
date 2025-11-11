/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
    NEXTAUTH_TRUST_HOST: process.env.NEXTAUTH_TRUST_HOST || "true",
  },
};

export default nextConfig;
