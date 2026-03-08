# Amplify Environment Variables Checklist

## ✅ Required Variables for Image-to-Post Feature

Go to: **AWS Amplify Console → Your App → Hosting → Environment variables**

### Authentication (Required)
```
COGNITO_DOMAIN=us-east-1k82zi1ywn.auth.us-east-1.amazoncognito.com
COGNITO_CLIENT_ID=4b9em2599sm42256qpnork0817
COGNITO_CLIENT_SECRET=12s5l4fsmsb7qukitla0c608c41sot80g27qh7te4a67aagdtj5s
COGNITO_USER_POOL_ID=us-east-1_K82ZI1YWn
NEXT_PUBLIC_COGNITO_DOMAIN=us-east-1k82zi1ywn.auth.us-east-1.amazoncognito.com
NEXT_PUBLIC_COGNITO_CLIENT_ID=4b9em2599sm42256qpnork0817
```

### AWS Credentials (Required for Bedrock/DynamoDB/S3)
```
CREO_AWS_REGION=us-east-1
CREO_AWS_ACCESS_KEY_ID=<your-aws-access-key-id>
CREO_AWS_SECRET_ACCESS_KEY=<your-aws-secret-access-key>
```

### Database & Storage (Required)
```
POSTS_TABLE=Posts
OPTIMIZATIONS_TABLE=Optimizations
S3_BUCKET_NAME=creo-ai-images-800c9f5e
```

### AI Models (Required)
```
BEDROCK_MODEL_ID=amazon.nova-lite-v1:0
IMAGE_MODEL_ID=amazon.nova-canvas-v1:0
VISION_MODEL_PRIORITY=nova-pro,claude-sonnet,claude-haiku
```

### App URL (Required)
```
NEXT_PUBLIC_BASE_URL=https://main.d1nwc5irmrsaaj.amplifyapp.com
```

## 🔧 Steps to Fix

1. **Add Missing Variables:**
   - Click "Manage variables"
   - Add each variable above
   - Click "Save"

2. **Verify IAM Permissions:**
   - Your IAM user (AKIA3NYB3D3S6EWMMQGL) needs:
     - Bedrock: `InvokeModel` permission
     - DynamoDB: Read/Write on Posts and Optimizations tables
     - S3: Read/Write on creo-ai-images-800c9f5e bucket

3. **Enable Bedrock Models:**
   - Go to AWS Console → Bedrock → Model Access
   - Select **us-east-1** region
   - Enable these models:
     - ✅ Amazon Nova Pro (us.amazon.nova-pro-v1:0)
     - ✅ Claude 3.5 Sonnet (us.anthropic.claude-3-5-sonnet-20241022-v2:0)
     - ✅ Claude 3.5 Haiku (us.anthropic.claude-3-5-haiku-20241022-v1:0)
   - Wait 2-3 minutes for activation

4. **Redeploy:**
   - Go to Amplify Console
   - Click "Redeploy this version"
   - Wait for deployment to complete

5. **Test:**
   - Visit your app: https://main.d1nwc5irmrsaaj.amplifyapp.com
   - Try the Image-to-Post feature
   - Check browser console for errors

## 🐛 Troubleshooting

### Still getting "AT Gateway authorization failed"?
- This means your Cognito token is invalid/expired
- **Solution:** Logout and login again to get a fresh token

### Getting "Access Denied" for Bedrock?
- Your IAM user doesn't have Bedrock permissions
- **Solution:** Add this IAM policy to your user:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream"
      ],
      "Resource": "*"
    }
  ]
}
```

### Getting "Model not found"?
- The model isn't enabled in Bedrock
- **Solution:** Enable model access in AWS Bedrock Console (step 3 above)

### Getting "Credentials not found"?
- Environment variables aren't set in Amplify
- **Solution:** Double-check all variables are added (step 1 above)

## ✅ Verification

After deployment, visit:
```
https://main.d1nwc5irmrsaaj.amplifyapp.com/api/test-env
```

All values should show `true` (except baseUrl which shows the URL).
