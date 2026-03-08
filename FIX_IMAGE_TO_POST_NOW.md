# Fix Image-to-Post Feature - Step by Step

## Current Error
```
Non-JSON response: Server returned an invalid response
```

This means the API is returning HTML/error page instead of JSON, usually due to:
1. ❌ Authentication token expired
2. ❌ Missing environment variables in Amplify
3. ❌ AWS credentials not configured

## 🚀 Quick Fix (5 minutes)

### Step 1: Check Amplify Environment Variables

1. Go to: **AWS Amplify Console** → Your App
2. Click: **Hosting** → **Environment variables**
3. Verify ALL these variables exist:

```bash
# Authentication
COGNITO_DOMAIN=us-east-1k82zi1ywn.auth.us-east-1.amazoncognito.com
COGNITO_CLIENT_ID=4b9em2599sm42256qpnork0817
COGNITO_CLIENT_SECRET=12s5l4fsmsb7qukitla0c608c41sot80g27qh7te4a67aagdtj5s
COGNITO_USER_POOL_ID=us-east-1_K82ZI1YWn
NEXT_PUBLIC_COGNITO_DOMAIN=us-east-1k82zi1ywn.auth.us-east-1.amazoncognito.com
NEXT_PUBLIC_COGNITO_CLIENT_ID=4b9em2599sm42256qpnork0817

# AWS Credentials (CRITICAL for Vision API)
CREO_AWS_REGION=us-east-1
CREO_AWS_ACCESS_KEY_ID=<your-aws-access-key-id>
CREO_AWS_SECRET_ACCESS_KEY=<your-aws-secret-access-key>

# Database & Storage
POSTS_TABLE=Posts
OPTIMIZATIONS_TABLE=Optimizations
S3_BUCKET_NAME=creo-ai-images-800c9f5e

# AI Models
BEDROCK_MODEL_ID=amazon.nova-lite-v1:0
IMAGE_MODEL_ID=amazon.nova-canvas-v1:0
VISION_MODEL_PRIORITY=nova-pro,claude-sonnet,claude-haiku

# App URL
NEXT_PUBLIC_BASE_URL=https://main.d1nwc5irmrsaaj.amplifyapp.com
```

4. If ANY are missing, click **Manage variables** → Add them → **Save**
5. Click **Redeploy this version**

### Step 2: Enable Bedrock Models

1. Go to: **AWS Console** → **Bedrock** → **Model Access**
2. **IMPORTANT:** Select region **us-east-1** (top right)
3. Click **Manage model access**
4. Enable these models:
   - ✅ Amazon Nova Pro (us.amazon.nova-pro-v1:0)
   - ✅ Claude 3.5 Sonnet (us.anthropic.claude-3-5-sonnet-20241022-v2:0)
   - ✅ Claude 3.5 Haiku (us.anthropic.claude-3-5-haiku-20241022-v1:0)
5. Click **Save changes**
6. Wait 2-3 minutes for activation

### Step 3: Verify IAM Permissions

Your IAM user (AKIA3NYB3D3S6EWMMQGL) needs these permissions:

1. Go to: **AWS Console** → **IAM** → **Users**
2. Find user with access key: AKIA3NYB3D3S6EWMMQGL
3. Click **Add permissions** → **Attach policies directly**
4. Add these policies:
   - `AmazonBedrockFullAccess`
   - `AmazonDynamoDBFullAccess`
   - `AmazonS3FullAccess`
5. Click **Add permissions**

### Step 4: Refresh Your Login

After Amplify redeploys:

1. Go to your app: https://main.d1nwc5irmrsaaj.amplifyapp.com
2. **Logout** (to clear old token)
3. **Login again** (to get fresh token)
4. Try Image-to-Post feature

## 🔍 Debugging

### Check if environment variables are loaded:

Visit: `https://main.d1nwc5irmrsaaj.amplifyapp.com/api/test-env`

Expected response:
```json
{
  "cognito_configured": true,
  "aws_configured": true,
  "tables_configured": true,
  "models_configured": true,
  "s3_configured": true,
  "baseUrl": "https://main.d1nwc5irmrsaaj.amplifyapp.com"
}
```

If any value is `false`, that variable is missing in Amplify.

### Check browser console:

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Try Image-to-Post feature
4. Look for errors:

**If you see "401 Unauthorized":**
- Your auth token expired
- Solution: Logout and login again

**If you see "Access Denied" or "AccessDeniedException":**
- Bedrock models not enabled OR IAM permissions missing
- Solution: Follow Step 2 and Step 3 above

**If you see "Credentials not found":**
- Environment variables not set in Amplify
- Solution: Follow Step 1 above

**If you see "Model not found":**
- Model not enabled in Bedrock
- Solution: Follow Step 2 above

### Check Amplify logs:

1. Go to: **Amplify Console** → Your App → **Monitoring**
2. Click **Logs**
3. Look for errors in the latest deployment
4. Common issues:
   - "Cannot find module" → Build failed, redeploy
   - "Credentials not found" → Environment variables missing
   - "Access Denied" → IAM permissions or Bedrock access

## 🎯 Most Likely Issue

Based on your error, the most likely cause is:

**Authentication token expired**

Solution:
1. Logout from your app
2. Login again
3. Try Image-to-Post feature immediately

The token expires after a certain time (usually 1 hour). You need to refresh it by logging in again.

## 📞 Still Not Working?

If you've done all the above and it still doesn't work:

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Try Image-to-Post feature
4. Click on the failed request (`vision-generate`)
5. Check:
   - **Request Headers** → Is Authorization header present?
   - **Response** → What's the actual error message?
6. Share the error details for more specific help

## ✅ Success Indicators

You'll know it's working when:
- No errors in browser console
- Image uploads successfully
- You see "Generating content..." message
- Post appears with generated content
- No "Non-JSON response" errors
