# Quick Start: Vision Feature Setup

## 1. Enable Models in AWS Bedrock (5 minutes)

### Go to AWS Console
https://console.aws.amazon.com/bedrock/home?region=us-east-1#/modelaccess

### Enable These Models:
- ✅ **Claude 3 Opus** (highest quality - recommended)
- ✅ **Amazon Nova Pro** (balanced)
- ✅ **Claude 3.5 Sonnet v2** (creative)
- ✅ **Claude 3.5 Haiku** (fast & cheap)

Click "Manage model access" → Select models → "Request model access"

## 2. Configure Your Preference (Optional)

Edit `.env` file:

```bash
# Choose your preferred model priority
# Options: claude-opus, nova-pro, nova-lite, claude-sonnet, claude-haiku

# Recommended for highest quality (current default):
VISION_MODEL_PRIORITY=claude-opus,nova-pro,claude-sonnet,claude-haiku

# Recommended for production (balanced):
VISION_MODEL_PRIORITY=nova-pro,claude-sonnet,claude-haiku

# Recommended for development:
VISION_MODEL_PRIORITY=claude-haiku,nova-pro

# Recommended for premium quality:
VISION_MODEL_PRIORITY=claude-opus,claude-sonnet,nova-pro

# Recommended for budget:
VISION_MODEL_PRIORITY=claude-haiku,nova-lite
```

## 3. Test It!

1. Start your dev server: `npm run dev`
2. Go to Create page
3. Click "Image-to-Post" mode
4. Upload an image
5. Click "Generate Post from Image"

## Model Recommendations

### 🏆 For Highest Quality (Current): `claude-opus,nova-pro,claude-sonnet,claude-haiku`
- Best possible vision analysis
- Most detailed and accurate
- Excellent for premium content
- Worth the extra cost for quality

### 🎯 For Most Users: `nova-pro,claude-sonnet,claude-haiku`
- Best balance of quality, speed, and cost
- Reliable availability
- Good for production

### 💰 For Budget: `claude-haiku,nova-lite`
- 10x cheaper
- Still good quality
- Perfect for high volume

### 🎨 For Premium Creative: `claude-opus,claude-sonnet`
- Best creative output
- Excellent cultural understanding
- Maximum quality

### ⚡ For Speed: `claude-haiku,nova-pro`
- Fastest response times
- Good for real-time generation

## Troubleshooting

### "Access denied" error?
→ Enable models in AWS Bedrock console (step 1)

### "Legacy model" error?
→ The app will automatically try newer models

### All models failing?
→ Check your AWS credentials in `.env` file

### Slow generation?
→ Try `claude-haiku` for faster results

## Cost Estimates

| Priority Setting | Cost per 1,000 images |
|-----------------|----------------------|
| `claude-opus` | $15.00 |
| `nova-pro` | $0.80 |
| `claude-sonnet` | $5.00 |
| `claude-haiku` | $0.50 |
| `nova-lite` | $0.20 |

**Note**: With the current priority (`claude-opus` first), you'll get the highest quality but at premium cost. If Opus is not available, it will automatically fall back to cheaper models.

## Next Steps

- Read [VISION_MODEL_COMPARISON.md](./VISION_MODEL_COMPARISON.md) for detailed comparison
- Read [ENABLE_BEDROCK_MODELS.md](./ENABLE_BEDROCK_MODELS.md) for troubleshooting
- Monitor your AWS costs in CloudWatch
