# How to Debug the Image-to-Post Feature

## ✅ Good News: Your Configuration is Correct!

I ran a health check and all environment variables are properly configured:
- ✅ AWS credentials present
- ✅ Vision model priority set
- ✅ S3 bucket configured
- ✅ DynamoDB tables configured
- ✅ Cognito authentication configured

## 🔍 Most Likely Issue: AWS Bedrock Model Access

Since your configuration is correct, the most common issue is that the vision models aren't enabled in AWS Bedrock.

### Quick Fix (5 minutes):

1. **Go to AWS Bedrock Console**
   - URL: https://console.aws.amazon.com/bedrock/
   
2. **Switch to us-east-1 region**
   - Look at top-right corner of AWS Console
   - Click the region dropdown
   - Select "US East (N. Virginia) us-east-1"

3. **Enable Model Access**
   - Click "Model access" in the left sidebar
   - Click "Manage model access" button (orange button)
   - Find and enable these models:
     - ☑️ Amazon Nova Pro
     - ☑️ Anthropic Claude 3.5 Sonnet
     - ☑️ Anthropic Claude 3.5 Haiku
   - Click "Save changes" at the bottom
   - Wait 2-3 minutes for access to be granted

4. **Test Again**
   - Go back to your app
   - Upload an image
   - Click "Ready"
   - Should work now!

## 🐛 If Still Not Working: Debugging Steps

### Step 1: Check Browser Console (MOST IMPORTANT!)

1. Open your browser where the app is running
2. Press `F12` to open Developer Tools
3. Click the "Console" tab
4. Clear any existing messages
5. Try uploading an image and clicking "Ready"
6. **Look for red error messages**

Common errors you might see:
- `401 Unauthorized` → You need to log out and log back in
- `Access Denied` → Follow the AWS Bedrock setup above
- `Failed to fetch` → Development server crashed, restart it
- `Server returned an invalid response` → Check server logs

### Step 2: Check Server Logs

1. Look at the terminal where you ran `npm run dev`
2. When you click "Ready", you should see logs like:
   ```
   [vision-generate] Processing image for user: ...
   [visionService] Trying model: us.amazon.nova-pro-v1:0
   ```

3. If you see errors like:
   ```
   ❌ Failed with us.amazon.nova-pro-v1:0: Access Denied
   ```
   → This confirms you need to enable model access (see Quick Fix above)

### Step 3: Check Network Tab

1. In browser DevTools, click "Network" tab
2. Click "Ready" button
3. Look for `/api/vision-generate` request
4. Click on it
5. Check the "Response" tab to see the actual error message

### Step 4: Run Health Check

```bash
cd CREO-AI/creo-ai
node check-vision-health.js
```

This will verify all environment variables are set correctly.

### Step 5: Test API Directly

First, get your auth token:
1. Open browser console (F12)
2. Type: `localStorage.getItem('creo_token')`
3. Copy the token value (without quotes)

Then test the API:
```bash
cd CREO-AI/creo-ai
node test-vision-api.js YOUR_TOKEN_HERE
```

Replace `YOUR_TOKEN_HERE` with the token you copied.

## 📊 What Should Happen When It Works

1. **Upload image** → Preview shows immediately
2. **Click "Ready"** → Loading spinner appears
3. **Wait 3-5 seconds** → Generated post appears with:
   - Content in your selected language
   - Engagement scores (hook, clarity, CTA, final)
   - Suggested hashtags
   - Image description

## 🔧 Quick Fixes to Try

### Fix 1: Restart Development Server
```bash
# In the terminal where server is running:
# Press Ctrl+C to stop
npm run dev
```

### Fix 2: Clear Next.js Cache
```bash
cd CREO-AI/creo-ai
rm -rf .next
npm run dev
```

### Fix 3: Log Out and Log Back In
Sometimes the authentication token expires. Just log out and log back in.

### Fix 4: Try a Smaller Image
If your image is very large (>5MB), try with a smaller one first.

## 📝 Detailed Documentation

For more detailed troubleshooting, see:
- `TROUBLESHOOT_VISION.md` - Comprehensive debugging guide
- `DEBUG_IMAGE_TO_POST.md` - Step-by-step diagnosis

## 🆘 Still Stuck?

If none of the above works, gather this information:

1. **Browser console error** (screenshot or copy-paste the red error)
2. **Server logs** (last 50 lines from terminal)
3. **Network response** (from DevTools Network tab, click on `/api/vision-generate`, copy Response)
4. **Health check output** (run `node check-vision-health.js`)

With this information, we can pinpoint the exact issue.

## 💡 Pro Tips

- The feature uses a fallback system: Nova Pro → Claude Sonnet → Claude Haiku
- If one model fails, it automatically tries the next
- All models need to be enabled in AWS Bedrock for best reliability
- The us-east-1 region has the best model availability
- Images are automatically resized and optimized before sending to the model

## ✨ Feature Capabilities

When working, the vision feature can:
- Analyze images and understand context
- Generate platform-specific content (Twitter, LinkedIn, Instagram)
- Support 10 Indian languages + English
- Incorporate cultural context (festivals, seasons, events)
- Provide engagement scores
- Suggest relevant hashtags
- Optimize content for better performance
