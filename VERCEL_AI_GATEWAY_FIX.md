# Vercel AI Gateway Authentication Error - FIXED

## The Problem

Your app was showing this error:
```
AI Gateway authentication failed: Invalid OIDC token.
```

This happened because:
1. Your code uses `@ai-sdk/amazon-bedrock` (Vercel's AI SDK)
2. When deployed on AWS Amplify (not Vercel), the SDK tried to use Vercel AI Gateway
3. Vercel AI Gateway requires authentication (API key or OIDC token)
4. Since you're not on Vercel, there's no OIDC token available

## The Fix Applied

Modified `app/api/agent/route.ts` to explicitly provide AWS credentials to the Bedrock client:

```typescript
const bedrock = createAmazonBedrock({
  region: process.env.CREO_AWS_REGION || 'us-east-1',
  // Explicitly provide credentials to bypass Vercel AI Gateway
  credentials: {
    accessKeyId: process.env.CREO_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CREO_AWS_SECRET_ACCESS_KEY!,
  },
});
```

This tells the SDK to connect directly to AWS Bedrock instead of routing through Vercel AI Gateway.

## What You Need to Do

### 1. Commit and Deploy

```bash
cd CREO-AI/creo-ai
git add app/api/agent/route.ts
git commit -m "Fix: Add explicit AWS credentials to bypass Vercel AI Gateway"
git push
```

AWS Amplify will automatically redeploy.

### 2. Verify Environment Variables in Amplify

Make sure these are set in **AWS Amplify Console → Environment variables**:

```
CREO_AWS_REGION=us-east-1
CREO_AWS_ACCESS_KEY_ID=<your-aws-access-key-id>
CREO_AWS_SECRET_ACCESS_KEY=<your-aws-secret-access-key>
```

### 3. Test After Deployment

1. Wait for Amplify deployment to complete
2. Go to your app: https://main.d1nwc5irmrsaaj.amplifyapp.com
3. Logout and login again (to get fresh token)
4. Try the Image-to-Post feature

## Why This Happened

The Vercel AI SDK (`@ai-sdk/amazon-bedrock`) has two modes:
1. **Direct mode**: Connects directly to AWS Bedrock using AWS credentials
2. **Gateway mode**: Routes through Vercel AI Gateway (requires Vercel authentication)

When you don't explicitly provide credentials, it defaults to gateway mode. Since you're on AWS Amplify (not Vercel), gateway mode fails.

By explicitly providing credentials, we force it into direct mode.

## Alternative Solution (Not Recommended)

You could also:
1. Create a Vercel AI Gateway API key
2. Set `AI_GATEWAY_API_KEY` environment variable

But this adds unnecessary complexity and latency since you're already on AWS.

## Verification

After deployment, the error should change from:
```
❌ AI Gateway authentication failed: Invalid OIDC token
```

To either:
```
✅ Success (if everything works)
```

Or a different error like:
```
❌ Access Denied (if Bedrock models not enabled)
```

If you get "Access Denied", follow the steps in `FIX_IMAGE_TO_POST_NOW.md` to enable Bedrock models.
