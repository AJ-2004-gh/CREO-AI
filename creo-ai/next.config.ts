import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // trailingSlash: false is default; no output:'standalone' for Amplify WEB_COMPUTE
    trailingSlash: false,
    // Add empty turbopack config to silence Next.js 16 warning
    turbopack: {},
    // Explicitly expose environment variables for Amplify deployment
    env: {
        COGNITO_DOMAIN: process.env.COGNITO_DOMAIN || '',
        COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID || '',
        COGNITO_CLIENT_SECRET: process.env.COGNITO_CLIENT_SECRET || '',
        COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID || '',
        CREO_AWS_REGION: process.env.CREO_AWS_REGION || '',
        CREO_AWS_ACCESS_KEY_ID: process.env.CREO_AWS_ACCESS_KEY_ID || '',
        CREO_AWS_SECRET_ACCESS_KEY: process.env.CREO_AWS_SECRET_ACCESS_KEY || '',
        POSTS_TABLE: process.env.POSTS_TABLE || '',
        OPTIMIZATIONS_TABLE: process.env.OPTIMIZATIONS_TABLE || '',
        BEDROCK_MODEL_ID: process.env.BEDROCK_MODEL_ID || '',
        IMAGE_MODEL_ID: process.env.IMAGE_MODEL_ID || '',
        VISION_MODEL_PRIORITY: process.env.VISION_MODEL_PRIORITY || '',
        S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || '',
    },
};

export default nextConfig;
