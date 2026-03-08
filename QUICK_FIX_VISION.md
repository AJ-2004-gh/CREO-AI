# 🚀 Quick Fix: Image-to-Post Not Working

## ⚡ 30-Second Diagnosis

Open browser console (F12) → Click "Ready" → Look for error message

## 🎯 Most Common Issues & Instant Fixes

### Issue #1: "Access Denied" or "access denied"
**Fix:** Enable models in AWS Bedrock
1. Go to: https://console.aws.amazon.com/bedrock/
2. Switch to **us-east-1** region (top-right)
3. Click "Model access" → "Manage model access"
4. Enable: Nova Pro, Claude 3.5 Sonnet, Claude 3.5 Haiku
5. Save and wait 2 minutes

### Issue #2: 401 Unauthorized
**Fix:** Log out and log back in

### Issue #3: "Failed to fetch"
**Fix:** Restart dev server
```bash
# Press Ctrl+C in terminal, then:
npm run dev
```

### Issue #4: Nothing happens when clicking "Ready"
**Fix:** Check browser console (F12) for JavaScript errors

### Issue #5: "Server returned an invalid response"
**Fix:** Check server terminal for crash logs, then restart

## 🔍 Quick Diagnostic Commands

```bash
# Check configuration
cd CREO-AI/creo-ai
node check-vision-health.js

# Test API (get token from browser console: localStorage.getItem('creo_token'))
node test-vision-api.js YOUR_TOKEN

# Restart with clean cache
rm -rf .next && npm run dev
```

## 📖 Need More Help?

See `HOW_TO_DEBUG_VISION_FEATURE.md` for detailed guide.
