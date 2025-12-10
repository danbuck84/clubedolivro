import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "books.google.com",
      },
      {
        protocol: "http", // Google Books sometimes returns http
        hostname: "books.google.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google Auth avatars
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com", // Avatar placeholders
      },
      {
        protocol: "https",
        hostname: "placehold.co", // Book cover placeholders
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
