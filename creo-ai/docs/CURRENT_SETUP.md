# Current Vision Model Setup

## ✅ Active Configuration

Your app is currently configured to prioritize **highest quality** over cost.

### Model Priority Order:

```
1. 🏆 Claude 3 Opus          → Highest quality (tries first)
2. 🎯 Amazon Nova Pro        → Balanced fallback
3. 🎨 Claude 3.5 Sonnet v2   → Creative fallback
4. ⚡ Claude 3.5 Haiku       → Fast & cheap fallback
```

### What This Means:

**Every image upload will:**
1. First try **Claude 3 Opus** (best quality, $0.015/image)
2. If Opus fails/unavailable → try **Nova Pro** ($0.0008/image)
3. If Nova fails → try **Sonnet** ($0.005/image)
4. If Sonnet fails → try **Haiku** ($0.0005/image)

### Expected Costs:

Assuming Claude 3 Opus is available and working:

| Usage | Monthly Cost |
|-------|-------------|
| 100 images | $1.50 |
| 1,000 images | $15.00 |
| 10,000 images | $150.00 |
| 100,000 images | $1,500.00 |

### Quality vs Cost Trade-off:

```
Claude 3 Opus:     ⭐⭐⭐⭐⭐ Quality | 💰💰💰 Cost
Nova Pro:          ⭐⭐⭐⭐   Quality | 💰     Cost  
Claude Sonnet:     ⭐⭐⭐⭐⭐ Quality | 💰💰   Cost
Claude Haiku:      ⭐⭐⭐⭐   Quality | 💰     Cost
```

## When to Use This Setup:

✅ **Use current setup (Opus first) if:**
- Quality is your top priority
- You're generating <1,000 images/month
- You're working on premium content
- Budget is not a constraint
- You need the best possible output

❌ **Consider changing if:**
- You're generating >10,000 images/month
- Cost is a concern
- You need faster response times
- Simple product images (don't need Opus quality)

## How to Change Priority:

Edit `.env` file:

### For Balanced (Recommended for most):
```bash
VISION_MODEL_PRIORITY=nova-pro,claude-sonnet,claude-haiku
```
**Cost**: ~$0.80 per 1,000 images

### For Budget:
```bash
VISION_MODEL_PRIORITY=claude-haiku,nova-lite
```
**Cost**: ~$0.50 per 1,000 images

### For Speed:
```bash
VISION_MODEL_PRIORITY=claude-haiku,nova-pro
```
**Response**: ~2 seconds

### Keep Current (Highest Quality):
```bash
VISION_MODEL_PRIORITY=claude-opus,nova-pro,claude-sonnet,claude-haiku
```
**Cost**: ~$15.00 per 1,000 images

## Required Setup:

Make sure you've enabled these models in AWS Bedrock:
1. Go to: https://console.aws.amazon.com/bedrock/home?region=us-east-1#/modelaccess
2. Enable:
   - ✅ Claude 3 Opus
   - ✅ Amazon Nova Pro
   - ✅ Claude 3.5 Sonnet v2
   - ✅ Claude 3.5 Haiku

## Monitoring Costs:

Check your AWS Bedrock usage:
```bash
# View costs in AWS Console
https://console.aws.amazon.com/billing/home#/bills

# Or use AWS CLI
aws ce get-cost-and-usage \
  --time-period Start=2024-03-01,End=2024-03-31 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --filter file://bedrock-filter.json
```

## Performance Expectations:

| Model | Response Time | Quality Score | Cost |
|-------|--------------|---------------|------|
| Claude 3 Opus | 5-8 seconds | 10/10 | $$$$ |
| Nova Pro | 2-4 seconds | 8/10 | $ |
| Claude Sonnet | 3-5 seconds | 10/10 | $$$ |
| Claude Haiku | 1-2 seconds | 8/10 | $ |

---

**Current Status**: ✅ Optimized for QUALITY
**Recommendation**: Monitor costs for first month, then adjust if needed
