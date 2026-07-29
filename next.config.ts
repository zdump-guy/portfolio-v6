import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // Serve modern formats (WebP/AVIF) automatically
    formats: ['image/avif', 'image/webp'],
    // Cache images for 7 days
    minimumCacheTTL: 604800,
  },

  // Compress responses
  compress: true,

  // Enable experimental optimizations
  experimental: {
    // Optimize packages that ship large barrel imports
    optimizePackageImports: ['framer-motion', 'lucide-react', 'react-icons'],
  },
};

export default nextConfig;
