import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Allow unoptimized images during development to avoid 400 errors
    unoptimized: process.env.NODE_ENV === 'development',
    // Add domains if you need to load images from external sources
    domains: [],
    remotePatterns: [],
    // Reasonable image sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Explicitly set redirects to empty array to ensure no automatic redirects
  async redirects() {
    return []
  },
  // Ensure trailing slash behavior is consistent
  trailingSlash: false
}

export default nextConfig