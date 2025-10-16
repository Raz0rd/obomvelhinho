/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images-bucket-nvd.s3.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
