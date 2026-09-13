import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.ltwebstatic.com" },
      { protocol: "https", hostname: "p16-oec-sg.ibyteimg.com" },
      { protocol: "https", hostname: "p16-oec-va.ibyteimg.com" },
      { protocol: "https", hostname: "p19-oec-sg.ibyteimg.com" },
      { protocol: "https", hostname: "http2.mlstatic.com" },
      { protocol: "https", hostname: "http2.mlstatic.com.br" },
      { protocol: "https", hostname: "cea.vtexassets.com" },
      { protocol: "https", hostname: "static.santosstore.com.br" },
      { protocol: "https", hostname: "images.tcdn.com.br" },
      { protocol: "https", hostname: "cdn.awsli.com.br" },
      { protocol: "https", hostname: "placehold.co" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
    ];
  },
};

export default nextConfig;
