/**
 * Test Environment Variables API Route
 * Use this to verify that environment variables are properly set in Amplify
 * Visit: /api/test-env
 */
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const envCheck = {
        // Cognito Configuration
        hasCognitoDomain: !!process.env.COGNITO_DOMAIN,
        hasClientId: !!process.env.COGNITO_CLIENT_ID,
        hasClientSecret: !!process.env.COGNITO_CLIENT_SECRET,
        hasUserPoolId: !!process.env.COGNITO_USER_POOL_ID,
        
        // Public Variables
        hasBaseUrl: !!process.env.NEXT_PUBLIC_BASE_URL,
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'NOT SET',
        
        // AWS Credentials (CREO_ prefix)
        hasCreoAwsRegion: !!process.env.CREO_AWS_REGION,
        hasCreoAwsAccessKey: !!process.env.CREO_AWS_ACCESS_KEY_ID,
        hasCreoAwsSecretKey: !!process.env.CREO_AWS_SECRET_ACCESS_KEY,
        
        // DynamoDB & Bedrock
        hasPostsTable: !!process.env.POSTS_TABLE,
        hasOptimizationsTable: !!process.env.OPTIMIZATIONS_TABLE,
        hasBedrockModelId: !!process.env.BEDROCK_MODEL_ID,
        hasS3Bucket: !!process.env.S3_BUCKET_NAME,
        
        // Partial values (for verification without exposing secrets)
        cognitoDomainPrefix: process.env.COGNITO_DOMAIN?.substring(0, 15) + '...' || 'NOT SET',
        clientIdPrefix: process.env.COGNITO_CLIENT_ID?.substring(0, 10) + '...' || 'NOT SET',
        region: process.env.CREO_AWS_REGION || 'NOT SET',
    };

    // Check if all critical variables are set
    const allCriticalSet = 
        envCheck.hasCognitoDomain &&
        envCheck.hasClientId &&
        envCheck.hasClientSecret &&
        envCheck.hasBaseUrl &&
        envCheck.hasCreoAwsRegion &&
        envCheck.hasCreoAwsAccessKey &&
        envCheck.hasCreoAwsSecretKey;

    res.status(200).json({
        status: allCriticalSet ? 'OK' : 'MISSING_VARIABLES',
        message: allCriticalSet 
            ? 'All critical environment variables are set' 
            : 'Some critical environment variables are missing',
        environment: envCheck,
        timestamp: new Date().toISOString(),
    });
}
