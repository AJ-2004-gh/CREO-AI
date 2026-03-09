# Vision Feature Troubleshooting Guide

## Step-by-Step Debugging Process

### Step 1: Open Browser Developer Tools
1. Press `F12` or right-click → "Inspect"
2. Go to the **Console** tab
3. Clear any existing messages
4. Keep it open while testing

### Step 2: Try the Feature Again
1. Upload an image (click the upload area)
2. Select platform, language, and cultural context
3. Click the **"Ready"** button
4. **Watch the Console tab for errors**

### Step 3: Check Network Tab
1. In DevTools, go to **Network** tab
2. Click "Ready" button again
3. Look for `/api/vision-generate` request
4. Click on it to see:
   - **Status code** (should be 200)
   - **Response** tab (see the actual error)
   - **Headers** tab (check Authorization header)

## Common Error Patterns & Solutions

### Error Pattern 1: "Access Denied" or "access denied"
```
Error: AWS Bedrock access denied. Please enable model access in AWS Bedrock Console.
```

**Root Cause:** Vision models not enabled in AWS Bedrock

**Solution:**
1. Go to [AWS Bedrock Console](https://console.aws.amazon.com/bedrock/)
2. **IMPORTANT:** Switch to **us-east-1** region (top-right dropdown)
3. Click "Model access" in left sidebar
4. Click "Manage model access" button
5. Enable these models:
   - ✅ Amazon Nova Pro
   - ✅ Anthropic Claude 3.5 Sonnet
   - ✅ Anthropic Claude 3.5 Haiku
6. Click "Save changes"
7. Wait 2-3 minutes for access to be granted
8. Try the feature again

### Error Pattern 2: "All vision models failed"
```
Error: All vision models failed. Please enable model access in AWS Bedrock Console (us-east-1 region).
```

**Root Cause:** None of the fallback models are available

**Solution:** Same as Error Pattern 1 above

### Error Pattern 3: 401 Unauthorized
```
Status: 401
```

**Root Cause:** Authentication token expired or invalid

**Solution:**
1. Click "Logout" in the navigation
2. Log back in
3. Try the feature again

### Error Pattern 4: Network Error / Failed to Fetch
```
TypeError: Failed to fetch
```

**Root Cause:** Development server not running or crashed

**Solution:**
```bash
cd CREO-AI/creo-ai
npm run dev
```

### Error Pattern 5: "Server returned an invalid response"
```
Error: Server returned an invalid response. Check console for details.
```

**Root Cause:** API returned HTML instead of JSON (usually a server crash)

**Solution:**
1. Check the terminal where `npm run dev` is running
2. Look for error stack traces
3. Restart the server:
   ```bash
   # Press Ctrl+C to stop
   npm run dev
   ```

### Error Pattern 6: Image Too Large
```
Error: Payload too large
```

**Root Cause:** Image file exceeds 10MB limit

**Solution:**
1. Resize the image to under 2MB
2. Use online tools like TinyPNG or ImageOptim
3. Try again with smaller image

### Error Pattern 7: "No valid JSON found"
```
Error: No valid JSON found in vision model response
```

**Root Cause:** Model returned malformed response (rare)

**Solution:**
1. Try again (temporary model issue)
2. If persists, check server logs for the actual model response
3. May need to adjust JSON parsing in `visionService.ts`

## Manual Testing Commands

### Test 1: Check if server is running
```bash
curl http://localhost:3000/api/test-env
```
Should return JSON with environment info.

### Test 2: Test vision API with minimal image
```bash
cd CREO-AI/creo-ai
node test-vision-api.js YOUR_AUTH_TOKEN
```

Replace `YOUR_AUTH_TOKEN` with your actual token from localStorage (see below).

### Test 3: Get your auth token
1. Open browser console
2. Type: `localStorage.getItem('creo_token')`
3. Copy the token (without quotes)
4. Use it in Test 2 above

### Test 4: Check AWS credentials
```bash
cd CREO-AI/creo-ai
node -e "
require('dotenv').config();
console.log('AWS Region:', process.env.CREO_AWS_REGION);
console.log('AWS Key ID:', process.env.CREO_AWS_ACCESS_KEY_ID?.substring(0, 8) + '...');
console.log('Vision Priority:', process.env.VISION_MODEL_PRIORITY);
console.log('S3 Bucket:', process.env.S3_BUCKET_NAME);
console.log('Posts Table:', process.env.POSTS_TABLE);
"
```

All values should be present (not undefined).

## Server Log Analysis

When you click "Ready", you should see these logs in the terminal:

```
[vision-generate] Processing image for user: <user_id>
[vision-generate] Platform: Twitter Language: English
[visionService] Model priority: nova-pro,claude-sonnet,claude-haiku
[visionService] Will try 3 models
[visionService] Trying model: us.amazon.nova-pro-v1:0
```

### Good outcome:
```
[visionService] ✅ Success with model: us.amazon.nova-pro-v1:0
[tryGenerateWithModel] ✅ Successfully parsed JSON
[vision-generate] Content generated successfully
[vision-generate] Post saved to database
```

### Bad outcome (access denied):
```
[visionService] ❌ Failed with us.amazon.nova-pro-v1:0: Access Denied
[visionService] ⚠️ Model us.amazon.nova-pro-v1:0 unavailable, trying next model...
[visionService] Trying model: us.anthropic.claude-3-5-sonnet-20241022-v2:0
[visionService] ❌ Failed with us.anthropic.claude-3-5-sonnet-20241022-v2:0: Access Denied
...
Error: All vision models failed
```

**If you see "Access Denied"** → Follow Error Pattern 1 solution above

## Environment Variable Checklist

Verify these are set in `CREO-AI/creo-ai/.env`:

```bash
# Required for Vision Feature
CREO_AWS_REGION=us-east-1
CREO_AWS_ACCESS_KEY_ID=AKIA...
CREO_AWS_SECRET_ACCESS_KEY=...
VISION_MODEL_PRIORITY=nova-pro,claude-sonnet,claude-haiku
BEDROCK_MODEL_ID=amazon.nova-lite-v1:0
S3_BUCKET_NAME=creo-ai-images-...
POSTS_TABLE=...

# Required for Authentication
COGNITO_DOMAIN=...
COGNITO_CLIENT_ID=...
COGNITO_CLIENT_SECRET=...
COGNITO_USER_POOL_ID=...
```

## Quick Fixes to Try

### Fix 1: Clear Next.js cache
```bash
cd CREO-AI/creo-ai
rm -rf .next
npm run dev
```

### Fix 2: Restart development server
```bash
# In terminal where server is running:
# Press Ctrl+C
npm run dev
```

### Fix 3: Clear browser cache
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

### Fix 4: Check if you're logged in
1. Open browser console
2. Type: `localStorage.getItem('creo_token')`
3. If it returns `null`, you need to log in

## Still Not Working?

Provide these details for further help:

1. **Browser Console Error** (screenshot or copy-paste)
2. **Network Tab Response** (click on `/api/vision-generate` request, copy Response tab)
3. **Server Terminal Logs** (last 50 lines from where you ran `npm run dev`)
4. **Environment Check Output** (from Test 4 above)
5. **Which error pattern** from above matches your issue (if any)

## Expected Working Flow

When everything works correctly:

1. **Upload image** → Preview appears
2. **Click "Ready"** → Loading spinner shows
3. **Wait 3-5 seconds** → Post appears with:
   - Generated content in selected language
   - Engagement scores (hook, clarity, CTA)
   - Suggested hashtags
   - Image description
4. **Can optimize** → Click hook/CTA/hashtag buttons for improvements

If you're not seeing this flow, use the debugging steps above to identify where it breaks.
