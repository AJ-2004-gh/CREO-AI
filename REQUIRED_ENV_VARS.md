# Required Environment Variables for Amplify

## ✅ Authentication (Working - You're logged in!)
```
COGNITO_DOMAIN=us-east-1k82zi1ywn.auth.us-east-1.amazoncognito.com
COGNITO_CLIENT_ID=4b9em2599sm42256qpnork0817
COGNITO_CLIENT_SECRET=12s5l4fsmsb7qukitla0c608c41sot80g27qh7te4a67aagdtj5s
COGNITO_USER_POOL_ID=us-east-1_K82ZI1YWn
NEXT_PUBLIC_BASE_URL=https://main.d1nwc5irmrsaaj.amplifyapp.com
NEXT_PUBLIC_COGNITO_DOMAIN=us-east-1k82zi1ywn.auth.us-east-1.amazoncognito.com
NEXT_PUBLIC_COGNITO_CLIENT_ID=4b9em2599sm42256qpnork0817
```

## ⚠️ AWS Services (Required for Image/Vision Features)
```
CREO_AWS_REGION=us-east-1
CREO_AWS_ACCESS_KEY_ID=<your-aws-access-key-id>
CREO_AWS_SECRET_ACCESS_KEY=<your-aws-secret-access-key>
```

## ⚠️ Database & Storage (Required for Saving Posts)
```
POSTS_TABLE=Posts
OPTIMIZATIONS_TABLE=Optimizations
S3_BUCKET_NAME=creo-ai-images-800c9f5e
```

## ⚠️ AI Models (Required for Content Generation)
```
BEDROCK_MODEL_ID=amazon.nova-lite-v1:0
IMAGE_MODEL_ID=amazon.nova-canvas-v1:0
VISION_MODEL_PRIORITY=nova-pro,claude-sonnet,claude-haiku
```

## How to Add in Amplify Console

1. Go to AWS Amplify Console
2. Select your app
3. Click **Hosting** → **Environment variables**
4. Click **Manage variables**
5. Add each variable above (name and value)
6. Click **Save**
7. Click **Redeploy this version**

## Verify After Deployment

Visit: `https://main.d1nwc5irmrsaaj.amplifyapp.com/api/test-env`

All values should show `true` (except baseUrl which shows the URL).

## Common Issues

### Vision/Image Generation Fails (500 Error)
**Cause:** Missing AWS credentials or Bedrock model access
**Fix:** 
1. Add all CREO_AWS_* variables
2. Ensure your IAM user has Bedrock permissions
3. Enable the vision models in AWS Bedrock Console

### Posts Not Saving
**Cause:** Missing POSTS_TABLE or DynamoDB permissions
**Fix:** Add POSTS_TABLE and OPTIMIZATIONS_TABLE variables

### Image Upload Fails
**Cause:** Missing S3_BUCKET_NAME or S3 permissions
**Fix:** Add S3_BUCKET_NAME variable and ensure IAM user has S3 write permissions
