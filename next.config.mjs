/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "Alwurts-CMS.s3.us-east-005.backblazeb2.com",
      },
      {
        protocol: "https",
        hostname: "alwurts-cms.s3.us-east-005.backblazeb2.com",
      },
      {
        protocol: "https",
        hostname: "s3.us-east-005.backblazeb2.com",
      },
    ],
  },
};

export default nextConfig;
