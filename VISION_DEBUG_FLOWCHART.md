# 🔍 Vision Feature Debug Flowchart

```
┌─────────────────────────────────────┐
│  Image-to-Post Feature Not Working  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Step 1: Open Browser Console (F12) │
│  Click "Ready" button                │
│  What do you see?                    │
└──────────────┬──────────────────────┘
               │
       ┌───────┴───────┬───────────────┬──────────────┐
       │               │               │              │
       ▼               ▼               ▼              ▼
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│ "Access  │   │   401    │   │ "Failed  │   │   No     │
│ Denied"  │   │Unauthorized│  │to fetch" │   │  Error   │
└────┬─────┘   └────┬─────┘   └────┬─────┘   └────┬─────┘
     │              │              │              │
     ▼              ▼              ▼              ▼
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│ Enable   │   │ Log out  │   │ Restart  │   │  Check   │
│ Bedrock  │   │ and log  │   │   dev    │   │  server  │
│  models  │   │ back in  │   │  server  │   │   logs   │
│          │   │          │   │          │   │          │
│ AWS      │   │          │   │ Ctrl+C   │   │ Terminal │
│ Console  │   │          │   │ npm run  │   │  where   │
│ →Bedrock │   │          │   │   dev    │   │ npm run  │
│ →Model   │   │          │   │          │   │ dev runs │
│  Access  │   │          │   │          │   │          │
│ →Enable: │   │          │   │          │   │          │
│  Nova    │   │          │   │          │   │          │
│  Claude  │   │          │   │          │   │          │
│          │   │          │   │          │   │          │
│ Region:  │   │          │   │          │   │          │
│us-east-1 │   │          │   │          │   │          │
└────┬─────┘   └────┬─────┘   └────┬─────┘   └────┬─────┘
     │              │              │              │
     └──────────────┴──────────────┴──────────────┘
                    │
                    ▼
            ┌──────────────┐
            │  Try Again   │
            └──────┬───────┘
                   │
         ┌─────────┴─────────┐
         │                   │
         ▼                   ▼
    ┌─────────┐         ┌─────────┐
    │ Works!  │         │  Still  │
    │   ✅    │         │ Broken  │
    └─────────┘         └────┬────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Run diagnostics:│
                    │                 │
                    │ node check-     │
                    │ vision-health.js│
                    │                 │
                    │ node test-      │
                    │ vision-api.js   │
                    │ [token]         │
                    │                 │
                    │ See HOW_TO_     │
                    │ DEBUG_VISION_   │
                    │ FEATURE.md      │
                    └─────────────────┘
```

## Quick Reference

| Error Message | Solution | Time |
|--------------|----------|------|
| "Access Denied" | Enable Bedrock models in AWS Console | 5 min |
| 401 Unauthorized | Log out and log back in | 30 sec |
| "Failed to fetch" | Restart dev server | 1 min |
| No error, no response | Check server logs for crash | 2 min |
| "Invalid response" | Server crashed, check logs & restart | 2 min |
| "Payload too large" | Use smaller image (<2MB) | 1 min |

## Diagnostic Tools

```bash
# Quick health check
node check-vision-health.js

# Test API endpoint
node test-vision-api.js [your-token]

# Get your token (in browser console)
localStorage.getItem('creo_token')

# Clean restart
rm -rf .next && npm run dev
```

## AWS Bedrock Model Access (Most Common Fix)

1. **URL:** https://console.aws.amazon.com/bedrock/
2. **Region:** us-east-1 (top-right dropdown)
3. **Navigate:** Model access → Manage model access
4. **Enable:**
   - ☑️ Amazon Nova Pro
   - ☑️ Anthropic Claude 3.5 Sonnet  
   - ☑️ Anthropic Claude 3.5 Haiku
5. **Save** and wait 2-3 minutes

## Expected Working Flow

```
Upload Image → Preview Shows
     ↓
Click "Ready" → Loading Spinner
     ↓
Wait 3-5 sec → Post Generated
     ↓
See Results:
  • Content in selected language
  • Engagement scores
  • Hashtags
  • Image description
```

## Still Stuck?

Gather this info:
1. Browser console error (screenshot)
2. Server logs (last 50 lines)
3. Network tab response (DevTools)
4. Output of `node check-vision-health.js`

Then see: `HOW_TO_DEBUG_VISION_FEATURE.md`
