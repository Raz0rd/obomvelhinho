/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images-bucket-nvd.s3.amazonaws.com',
      },
    ],
    formats: ['image/webp'], // Usar WebP por padrão (mais leve)
    deviceSizes: [640, 750, 828, 1080, 1200], // Tamanhos responsivos
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Tamanhos de thumbnail
    minimumCacheTTL: 60 * 60 * 24 * 30, // Cache de 30 dias
  },
};

export default nextConfig;
