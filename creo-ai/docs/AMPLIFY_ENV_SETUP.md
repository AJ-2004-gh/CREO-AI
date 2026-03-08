# AWS Amplify Environment Variables Setup

## Problem
AWS Amplify reserves the `AWS_` prefix for internal system use. When you set environment variables like `AWS_REGION`, `AWS_ACCESS_KEY_ID`, and `AWS_SECRET_ACCESS_KEY` in the Amplify Console, they get overwritten by Amplify's internal values, causing authentication failures.

## Solution
Use a custom prefix (`CREO_`) for your AWS credentials and update all code to reference these new variable names.

## Step 1: Update Amplify Environment Variables

Go to your **Amplify Console** → **Hosting** → **Environment variables** and add:

```
CREO_AWS_REGION=us-east-1
CREO_AWS_ACCESS_KEY_ID=<your-access-key-id>
CREO_AWS_SECRET_ACCESS_KEY=<your-secret-access-key>
```

**Important:** 
- Remove or ignore any existing `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` variables
- Use your IAM user credentials that have permissions for:
  - Amazon Bedrock (model invocation)
  - DynamoDB (read/write to Posts and Optimizations tables)
  - S3 (upload images to your bucket)
  - Cognito (user authentication)

## Step 2: Keep Other Environment Variables

Make sure these are also set in Amplify (they remain unchanged):

```
COGNITO_DOMAIN=<your-cognito-domain>
COGNITO_CLIENT_ID=<your-client-id>
COGNITO_CLIENT_SECRET=<your-client-secret>
COGNITO_USER_POOL_ID=<your-user-pool-id>
NEXT_PUBLIC_BASE_URL=<your-production-url>
NEXT_PUBLIC_COGNITO_DOMAIN=<your-cognito-domain>
NEXT_PUBLIC_COGNITO_CLIENT_ID=<your-client-id>
POSTS_TABLE=Posts
OPTIMIZATIONS_TABLE=Optimizations
BEDROCK_MODEL_ID=amazon.nova-lite-v1:0
IMAGE_MODEL_ID=amazon.nova-canvas-v1:0
VISION_MODEL_PRIORITY=nova-pro,claude-sonnet,claude-haiku
S3_BUCKET_NAME=<your-s3-bucket-name>
```

## Step 3: Code Changes (Already Applied)

All code has been updated to use `CREO_AWS_*` variables instead of `AWS_*`:

### Updated Files:
- ✅ `.env` - Local development environment
- ✅ `lib/bedrockClient.ts` - Bedrock client configuration
- ✅ `lib/dynamoClient.ts` - DynamoDB client configuration
- ✅ `services/imageService.ts` - S3 and Bedrock image generation
- ✅ `services/visionService.ts` - Vision model client
- ✅ `pages/api/auth/login.ts` - Cognito authentication
- ✅ `pages/api/auth/signup.ts` - Cognito user registration
- ✅ `app/api/agent/route.ts` - AI agent endpoint
- ✅ `setup-s3.js` - S3 setup script
- ✅ `scripts/check-bedrock-models.js` - Bedrock model checker

## Step 4: Deploy to Amplify

After setting the environment variables in Amplify Console:

1. Commit and push your code changes
2. Amplify will automatically trigger a new build
3. The new build will use the `CREO_AWS_*` credentials
4. Test the authentication flow at `/login`

## Verification

To verify the fix is working:

1. Try logging in at your production URL
2. Check the Amplify build logs for any credential errors
3. Monitor CloudWatch logs for your Lambda functions (if using SSR)
4. Test content generation to ensure Bedrock access works

## Troubleshooting

If you still see credential errors:

1. **Check IAM permissions**: Ensure your IAM user has all required permissions
2. **Verify variable names**: Make sure you used `CREO_AWS_*` (not `AWS_*`)
3. **Check Amplify logs**: Look for environment variable loading issues
4. **Clear cache**: Sometimes Amplify needs a manual redeploy to pick up new env vars
5. **Test locally**: Run `npm run dev` locally to ensure `.env` works correctly

## Security Notes

- Never commit `.env` file to git (it's in `.gitignore`)
- Rotate your AWS credentials regularly
- Use IAM roles with least-privilege permissions
- Consider using AWS Secrets Manager for production credentials
