import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Original
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // FakeStore API
      { protocol: 'https', hostname: 'fakestoreapi.com' },
      // eBay
      { protocol: 'https', hostname: 'i.ebayimg.com' },
      { protocol: 'https', hostname: 'thumbs.ebaystatic.com' },
      // SerpApi / Google Shopping thumbnails
      { protocol: 'https', hostname: '**.gstatic.com' },
      { protocol: 'https', hostname: 'serpapi.com' },
      // Generic fallback for any product image CDN
      { protocol: 'https', hostname: '**.cloudfront.net' },
      { protocol: 'https', hostname: '**.amazonaws.com' },
      // BunnyCDN
      { protocol: 'https', hostname: '**.b-cdn.net' },
    ],
  },
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" },
      ],
    },
  ],
};

export default nextConfig;
