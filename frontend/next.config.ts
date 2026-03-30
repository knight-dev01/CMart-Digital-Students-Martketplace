import type { NextConfig } from "next";

// Derive the backend hostname from the API URL env var (set on Railway)
// e.g. NEXT_PUBLIC_API_URL = https://cmart-backend.up.railway.app/api
function getBackendHostname(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  try {
    return new URL(apiUrl).hostname;
  } catch {
    return "localhost";
  }
}

const backendHostname = getBackendHostname();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Local development
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/media/**",
      },
      // Production Railway backend (derived from NEXT_PUBLIC_API_URL)
      ...(backendHostname !== "localhost"
        ? [
            {
              protocol: "https" as const,
              hostname: backendHostname,
              pathname: "/media/**",
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
