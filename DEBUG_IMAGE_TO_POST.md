# Debug Guide: Image-to-Post Feature Not Working

## Quick Diagnosis Steps

### 1. Check Browser Console (Most Important!)
Open browser DevTools (F12) and check the Console tab for errors when clicking "Ready":
- Look for network errors (401, 403, 500)
- Look for JavaScript errors
- Check the Network tab for the `/api/vision-generate` request

### 2. Check Server Logs
If running locally, check the terminal where `npm run dev` is running for:
```
[vision-generate] Processing image for user: ...
[visionService] Trying model: ...
```

### 3. Common Issues & Solutions

#### Issue A: AWS Bedrock Model Access Denied
**Symptoms:** Error message contains "access denied" or "Access Denied"
**Solution:**
1. Go to AWS Console → Bedrock → Model Access (us-east-1 region)
2. Enable these models:
   - Amazon Nova Pro (us.amazon.nova-pro-v1:0)
   - Claude 3.5 Sonnet (us.anthropic.claude-3-5-sonnet-20241022-v2:0)
   - Claude 3.5 Haiku (us.anthropic.claude-3-5-haiku-20241022-v1:0)

#### Issue B: Image Too Large
**Symptoms:** Request fails silently or "payload too large"
**Solution:** The API supports up to 10MB. Try with a smaller image (<2MB recommended)

#### Issue C: Invalid Image Format
**Symptoms:** Error about image format or base64 encoding
**Solution:** Ensure image is JPEG, PNG, GIF, or WebP format

#### Issue D: Missing Environment Variables
**Symptoms:** Error about credentials or configuration
**Check these in .env:**
```bash
CREO_AWS_REGION=us-east-1
CREO_AWS_ACCESS_KEY_ID=your_key
CREO_AWS_SECRET_ACCESS_KEY=your_secret
VISION_MODEL_PRIORITY=nova-pro,claude-sonnet,claude-haiku
BEDROCK_MODEL_ID=amazon.nova-lite-v1:0
S3_BUCKET_NAME=your_bucket
POSTS_TABLE=your_posts_table
```

#### Issue E: Authentication Token Expired
**Symptoms:** Redirects to login or 401 error
**Solution:** Log out and log back in

### 4. Test Vision API Directly

Create a test file to isolate the issue:

```bash
# Test if vision API is accessible
curl -X POST http://localhost:3000/api/vision-generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "image_base64": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "platform": "Twitter",
    "target_language": "English",
    "cultural_context": "None"
  }'
```

### 5. Enable Detailed Logging

Add this to your `.env` to see more details:
```bash
NODE_ENV=development
```

Then check server logs for:
- `[vision-generate]` - API route logs
- `[visionService]` - Vision service logs
- `[tryGenerateWithModel]` - Model-specific logs

### 6. Check Model Availability

Run this script to verify which models are available:
```bash
node CREO-AI/creo-ai/scripts/check-bedrock-models.js
```

## Most Likely Issues (Based on Screenshot)

Looking at your screenshot, the UI shows:
1. ✅ Image uploaded successfully (Halloween.png visible)
2. ✅ Platform, language, and context selected
3. ✅ "Ready" button is enabled

**This suggests the issue happens when clicking "Ready".**

### Next Steps:
1. **Open browser console (F12) before clicking "Ready"**
2. **Click "Ready" and watch for errors**
3. **Check the Network tab for the API call**
4. **Look for red error messages in the console**

### Expected Behavior:
When you click "Ready", you should see:
- Loading spinner appears
- Network request to `/api/vision-generate`
- Response with generated post content
- Post appears below with scores

### If You See Network Error:
- **401**: Authentication issue - try logging out/in
- **403**: AWS permissions issue - check Bedrock model access
- **500**: Server error - check server logs
- **Timeout**: Model taking too long - try different model priority

## Quick Fix Commands

### Restart Development Server
```bash
cd CREO-AI/creo-ai
npm run dev
```

### Clear Next.js Cache
```bash
cd CREO-AI/creo-ai
rm -rf .next
npm run dev
```

### Verify Environment Variables Loaded
```bash
cd CREO-AI/creo-ai
node -e "console.log(require('dotenv').config())"
```

## Contact Points for Help

If still stuck, provide:
1. Browser console error messages (screenshot or text)
2. Server terminal logs (last 50 lines)
3. Network tab details for `/api/vision-generate` request
4. Which step in this guide you've completed
