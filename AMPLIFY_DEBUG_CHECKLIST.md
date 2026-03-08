# Amplify Callback Error - Debug Checklist

## Current Issue
After Cognito login, redirecting to: `https://main.d1nwc5irmrsaaj.amplifyapp.com/login?error=internal_server_error`

## Step 1: Verify ALL Environment Variables in Amplify Console

Go to **AWS Amplify Console** → Your App → **Hosting** → **Environment variables**

### Required Variables (Check each one):

#### AWS Credentials (NEW - with CREO_ prefix):
```
✓ CREO_AWS_REGION=us-east-1
✓ CREO_AWS_ACCESS_KEY_ID=<your-access-key>
✓ CREO_AWS_SECRET_ACCESS_KEY=<your-secret-key>
```

#### Cognito Configuration (CRITICAL for callback):
```
✓ COGNITO_DOMAIN=us-east-1k82zi1ywn.auth.us-east-1.amazoncognito.com
✓ COGNITO_CLIENT_ID=4b9em2599sm42256qpnork0817
✓ COGNITO_CLIENT_SECRET=12s5l4fsmsb7qukitla0c608c41sot80g27qh7te4a67aagdtj5s
✓ COGNITO_USER_POOL_ID=us-east-1_K82ZI1YWn
```

#### Public Variables:
```
✓ NEXT_PUBLIC_BASE_URL=https://main.d1nwc5irmrsaaj.amplifyapp.com
✓ NEXT_PUBLIC_COGNITO_DOMAIN=us-east-1k82zi1ywn.auth.us-east-1.amazoncognito.com
✓ NEXT_PUBLIC_COGNITO_CLIENT_ID=4b9em2599sm42256qpnork0817
```

#### DynamoDB & Bedrock:
```
✓ POSTS_TABLE=Posts
✓ OPTIMIZATIONS_TABLE=Optimizations
✓ BEDROCK_MODEL_ID=amazon.nova-lite-v1:0
✓ IMAGE_MODEL_ID=amazon.nova-canvas-v1:0
✓ VISION_MODEL_PRIORITY=nova-pro,claude-sonnet,claude-haiku
✓ S3_BUCKET_NAME=creo-ai-images-800c9f5e
```

## Step 2: Check Cognito Redirect URI

Go to **AWS Cognito Console** → User Pools → Your Pool → App Integration → App clients

### Verify Callback URLs include:
```
https://main.d1nwc5irmrsaaj.amplifyapp.com/api/auth/callback
http://localhost:3000/api/auth/callback (for local dev)
```

### Verify Sign-out URLs include:
```
https://main.d1nwc5irmrsaaj.amplifyapp.com/login
http://localhost:3000/login
```

## Step 3: Check CloudWatch Logs

After the next deployment completes, try logging in again and check:

**AWS CloudWatch** → Log groups → Look for logs containing:
- `/aws/lambda/` (if using SSR)
- Search for `[/api/auth/callback]` to see the detailed logs

### What to look for:
```
[/api/auth/callback] Environment check: { hasDomain: true, hasClientId: true, ... }
[/api/auth/callback] Token response status: 200
[/api/auth/callback] Token exchange successful
```

### Common Error Messages:
- `COGNITO_DOMAIN not configured` → Missing env var in Amplify
- `Token exchange failed: invalid_client` → Wrong CLIENT_SECRET or CLIENT_ID
- `Token exchange failed: invalid_grant` → Redirect URI mismatch
- `Token exchange failed: unauthorized_client` → OAuth flow not enabled in Cognito

## Step 4: Verify Cognito App Client Settings

Go to **AWS Cognito Console** → User Pools → Your Pool → App Integration → App clients → Your App Client

### Required Settings:
- ✓ OAuth 2.0 grant types: **Authorization code grant** (enabled)
- ✓ OAuth scopes: **openid**, **email**, **profile** (enabled)
- ✓ Identity providers: **Google** (enabled)
- ✓ App client secret: **Generated** (should exist)

## Step 5: Test Locally First

Before debugging in Amplify, test locally:

```bash
cd CREO-AI/creo-ai
npm run dev
```

Then visit: `http://localhost:3000/login`

Try logging in with Google. If it works locally but not in Amplify, the issue is environment variables.

## Step 6: Force Redeploy in Amplify

Sometimes Amplify needs a manual redeploy to pick up new environment variables:

1. Go to Amplify Console → Your App
2. Click **Redeploy this version** on the latest build
3. Wait for build to complete
4. Try logging in again

## Step 7: Check Build Logs

In Amplify Console → Your App → Build history → Latest build

Look for:
- ✓ Build succeeded
- ✓ No environment variable warnings
- ✓ All routes deployed successfully

## Common Issues & Solutions

### Issue: "COGNITO_DOMAIN not configured"
**Solution:** Add `COGNITO_DOMAIN` to Amplify environment variables (without https://)

### Issue: "invalid_client"
**Solution:** 
1. Verify `COGNITO_CLIENT_SECRET` matches the one in AWS Cognito Console
2. Check that the app client has a secret generated

### Issue: "invalid_grant" or "redirect_uri_mismatch"
**Solution:**
1. Verify `NEXT_PUBLIC_BASE_URL` is set correctly in Amplify
2. Add the exact callback URL to Cognito's allowed callback URLs
3. Make sure there are no trailing slashes

### Issue: Still getting internal_server_error
**Solution:**
1. Check CloudWatch logs for the actual error
2. Verify all environment variables are set (no typos)
3. Try a manual redeploy in Amplify
4. Check if Google OAuth is properly configured in Cognito

## Next Steps

1. ✓ Verify all environment variables are set in Amplify Console
2. ✓ Wait for the latest build to complete (with improved logging)
3. ✓ Try logging in again
4. ✓ Check CloudWatch logs for detailed error messages
5. ✓ Share the CloudWatch logs if issue persists

## Quick Test Command

After setting environment variables, you can test if they're accessible:

Create a test API route at `pages/api/test-env.ts`:
```typescript
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    hasCognitoDomain: !!process.env.COGNITO_DOMAIN,
    hasClientId: !!process.env.COGNITO_CLIENT_ID,
    hasClientSecret: !!process.env.COGNITO_CLIENT_SECRET,
    hasBaseUrl: !!process.env.NEXT_PUBLIC_BASE_URL,
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  });
}
```

Then visit: `https://main.d1nwc5irmrsaaj.amplifyapp.com/api/test-env`
