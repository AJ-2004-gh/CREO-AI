# Deployment Checklist - AWS Credentials Fix

## ✅ Code Changes (Completed)

All code has been updated to use `CREO_AWS_*` prefix instead of `AWS_*`:

- [x] Updated `.env` file with new variable names
- [x] Updated `lib/bedrockClient.ts`
- [x] Updated `lib/dynamoClient.ts`
- [x] Updated `services/imageService.ts`
- [x] Updated `services/visionService.ts`
- [x] Updated `pages/api/auth/login.ts`
- [x] Updated `pages/api/auth/signup.ts`
- [x] Updated `app/api/agent/route.ts`
- [x] Updated `setup-s3.js`
- [x] Updated `scripts/check-bedrock-models.js`

## 🔧 Next Steps (Action Required)

### 1. Update Amplify Environment Variables

Go to **AWS Amplify Console** → Your App → **Hosting** → **Environment variables**

Add these new variables:
```
CREO_AWS_REGION=us-east-1
CREO_AWS_ACCESS_KEY_ID=<your-access-key-id>
CREO_AWS_SECRET_ACCESS_KEY=<your-secret-access-key>
```

### 2. Verify All Environment Variables

Ensure these are also set in Amplify:
```
COGNITO_DOMAIN=us-east-1k82zi1ywn.auth.us-east-1.amazoncognito.com
COGNITO_CLIENT_ID=4b9em2599sm42256qpnork0817
COGNITO_CLIENT_SECRET=12s5l4fsmsb7qukitla0c608c41sot80g27qh7te4a67aagdtj5s
COGNITO_USER_POOL_ID=us-east-1_K82ZI1YWn
NEXT_PUBLIC_BASE_URL=<your-production-url>
NEXT_PUBLIC_COGNITO_DOMAIN=us-east-1k82zi1ywn.auth.us-east-1.amazoncognito.com
NEXT_PUBLIC_COGNITO_CLIENT_ID=4b9em2599sm42256qpnork0817
POSTS_TABLE=Posts
OPTIMIZATIONS_TABLE=Optimizations
BEDROCK_MODEL_ID=amazon.nova-lite-v1:0
IMAGE_MODEL_ID=amazon.nova-canvas-v1:0
VISION_MODEL_PRIORITY=nova-pro,claude-sonnet,claude-haiku
S3_BUCKET_NAME=creo-ai-images-800c9f5e
```

### 3. Deploy

```bash
git add .
git commit -m "Fix: Use CREO_ prefix for AWS credentials to avoid Amplify conflicts"
git push origin main
```

### 4. Test

After deployment completes:
- [ ] Visit your production URL
- [ ] Try logging in at `/login`
- [ ] Test content generation
- [ ] Check for any console errors
- [ ] Verify images are uploading to S3

## 📚 Documentation

See `docs/AMPLIFY_ENV_SETUP.md` for detailed setup instructions and troubleshooting.

## 🔒 Security Reminder

- Never commit `.env` file to git
- Rotate AWS credentials regularly
- Use IAM roles with least-privilege permissions
- Monitor CloudWatch logs for unauthorized access attempts
