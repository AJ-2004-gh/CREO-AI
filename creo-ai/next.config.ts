import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Turbopack disabled to reduce RAM usage and fix tailwindcss resolution issues
    // Use standard webpack dev server instead
    output: 'standalone',
    // Ensure trailing slashes are handled correctly
    trailingSlash: false,
};

export default nextConfig;
