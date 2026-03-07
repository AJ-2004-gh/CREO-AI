# How to Enable Vision Models in AWS Bedrock

If you're getting "Legacy model" or "Access denied" errors, you need to enable model access in AWS Bedrock.

## Recommended Vision Models for Social Media Content

### 🏆 Best Quality: Claude 3 Opus
- **Model ID**: `us.anthropic.claude-3-opus-20240229-v1:0`
- **Why**: Highest quality vision analysis and creative output
- **Pros**: Best understanding, most detailed, excellent creativity
- **Cost**: ~$0.015/image analysis (3x more than Sonnet)

### 🎨 Best Balance: Amazon Nova Pro
- **Model ID**: `us.amazon.nova-pro-v1:0`
- **Why**: AWS's own multimodal model, optimized for production
- **Pros**: Better availability, good quality, balanced cost
- **Cost**: ~$0.0008/image analysis

### 🚀 Creative Choice: Claude 3.5 Sonnet v2
- **Model ID**: `us.anthropic.claude-3-5-sonnet-20241022-v2:0`
- **Why**: Excellent for creative writing and nuanced understanding
- **Pros**: Great at cultural context, engaging content
- **Cost**: ~$0.005/image analysis

### ⚡ Fast Choice: Claude 3.5 Haiku
- **Model ID**: `us.anthropic.claude-3-5-haiku-20241022-v1:0`
- **Why**: 10x cheaper, still very good quality
- **Pros**: Fast response, perfect for high volume
- **Cost**: ~$0.0005/image analysis

## Steps to Enable Model Access

### 1. Go to AWS Bedrock Console
Visit: https://console.aws.amazon.com/bedrock/home?region=us-east-1#/modelaccess

### 2. Request Model Access
1. Click **"Manage model access"** or **"Enable specific models"**
2. Find and enable these models:
   - ✅ **Claude 3 Opus** (highest quality - recommended)
   - ✅ **Amazon Nova Pro** (balanced)
   - ✅ **Claude 3.5 Sonnet v2** (creative)
   - ✅ **Claude 3.5 Haiku** (fast & cheap)

### 3. Enable Cross-Region Inference (Recommended)
Cross-region inference profiles provide better availability:
- `us.anthropic.claude-3-opus-20240229-v1:0`
- `us.amazon.nova-pro-v1:0`
- `us.anthropic.claude-3-5-sonnet-20241022-v2:0`
- `us.anthropic.claude-3-5-haiku-20241022-v1:0`

### 4. Wait for Approval
- Most models are **instantly available**
- Some may require AWS approval (usually within minutes)
- Check the status in the Model Access page

## Current Model Priority

The app tries models in this order:
1. `us.anthropic.claude-3-opus-20240229-v1:0` ⭐ **Claude 3 Opus** (Highest quality)
2. `us.amazon.nova-pro-v1:0` (Best for production)
3. `us.anthropic.claude-3-5-sonnet-20241022-v2:0` (Best for creative content)
4. `anthropic.claude-3-5-sonnet-20240620-v1:0` (Stable fallback)
5. `us.anthropic.claude-3-5-haiku-20241022-v1:0` (Fast & cheap)
6. `anthropic.claude-3-haiku-20240307-v1:0` (Last resort)

## Model Comparison

| Model | Vision Quality | Speed | Cost/Image | Best For |
|-------|---------------|-------|------------|----------|
| **Claude 3 Opus** | ⭐⭐⭐⭐⭐ | Slow | $0.015 | Highest quality, complex scenes |
| **Nova Pro** | ⭐⭐⭐⭐ | Fast | $0.0008 | Production, balanced |
| **Claude 3.5 Sonnet v2** | ⭐⭐⭐⭐⭐ | Medium | $0.005 | Creative content |
| **Claude 3.5 Haiku** | ⭐⭐⭐⭐ | Very Fast | $0.0005 | High volume |

## Verify Model Access

After enabling, test with:
```bash
# Install AWS CLI if not already installed
aws bedrock list-foundation-models --region us-east-1 \
  --query "modelSummaries[?contains(modelId, 'nova') || contains(modelId, 'claude')].[modelId, modelLifecycle.status]" \
  --output table
```

## Troubleshooting

### Error: "This Model is marked by provider as Legacy"
- The old Claude 3 Sonnet model is deprecated
- Enable Claude 3.5 Sonnet v2 or Amazon Nova Pro instead

### Error: "Access denied"
- You haven't enabled the model in Bedrock console
- Follow steps above to enable model access
- Make sure you're in the correct AWS region (us-east-1)

### Error: "Model not found"
- Check your AWS region (should be us-east-1)
- Verify the model ID is correct
- Some models may not be available in all regions
- Try enabling cross-region inference profiles

### All Models Failing?
The app will automatically try 5 different models. If all fail:
1. Check AWS Bedrock console for model access
2. Verify your AWS credentials in `.env` file
3. Check AWS CloudWatch logs for detailed errors
4. Ensure you have sufficient AWS credits/billing enabled

## Cost Optimization Tips

### For Development/Testing:
Use **Claude 3.5 Haiku** - Fast and cheap ($0.0005/image)

### For Production:
Use **Amazon Nova Pro** - Best balance ($0.0008/image)

### For Premium Quality:
Use **Claude 3.5 Sonnet v2** - Best creative output ($0.005/image)

### Expected Costs:
- **1,000 images/month**: $0.50 - $5.00
- **10,000 images/month**: $5.00 - $50.00
- **100,000 images/month**: $50.00 - $500.00

## Additional Resources

- [AWS Bedrock Model Access](https://docs.aws.amazon.com/bedrock/latest/userguide/model-access.html)
- [Amazon Nova Models](https://docs.aws.amazon.com/bedrock/latest/userguide/models-nova.html)
- [Claude Models on Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/models-supported.html)
- [Cross-Region Inference](https://docs.aws.amazon.com/bedrock/latest/userguide/cross-region-inference.html)
- [Bedrock Pricing](https://aws.amazon.com/bedrock/pricing/)
