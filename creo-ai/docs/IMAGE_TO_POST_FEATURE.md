# Image-to-Social-Post Feature (Multimodal AI)

## Overview
The Image-to-Post feature leverages Amazon Bedrock's Vision capabilities (Claude 3 Sonnet) to analyze uploaded images and automatically generate compelling social media content based on the visual content.

## The Problem
Users often have photos of their products, shops, or events but struggle to write engaging captions or posts. This creates a barrier to entry for digital marketing, especially for small businesses and individual sellers.

## The Solution
Allow users to upload an image and let AI:
- Analyze the visual content (products, people, settings, emotions, colors, branding)
- Generate platform-optimized social media posts
- Suggest relevant hashtags
- Adapt content to target language and cultural context

## Technical Implementation

### Architecture
```
User Upload Image → Frontend (Base64 Encoding) → API Route (/api/vision-generate)
→ Vision Service (Claude 3 Sonnet) → Content Generation → Scoring → DynamoDB Storage
```

### Key Components

#### 1. API Endpoint: `/api/vision-generate`
- **Location**: `pages/api/vision-generate.ts`
- **Method**: POST
- **Authentication**: Required (JWT token)
- **Input**:
  ```typescript
  {
    image_base64: string,        // Base64-encoded image
    platform: Platform,          // Twitter | LinkedIn | Instagram
    target_language: IndicLanguage,
    cultural_context?: CulturalContext,
    additional_context?: string  // Optional user-provided context
  }
  ```
- **Output**:
  ```typescript
  {
    post_id: string,
    content: string,
    suggested_hashtags: string[],
    image_description: string,
    hook_score: number,
    clarity_score: number,
    cta_score: number,
    final_score: number,
    // ... other post metadata
  }
  ```

#### 2. Vision Service
- **Location**: `services/visionService.ts`
- **Model**: `anthropic.claude-3-sonnet-20240229-v1:0`
- **Capabilities**:
  - Image analysis and understanding
  - Visual element detection (products, people, settings, colors, text)
  - Context-aware content generation
  - Multi-language support
  - Cultural context integration

#### 3. Frontend UI
- **Location**: `app/create/page.tsx`
- **Mode**: `vision` (Image-to-Post)
- **Features**:
  - Drag-and-drop image upload
  - Image preview
  - Platform selection
  - Language selection
  - Cultural context selection
  - Optional additional context input
  - Real-time generation status

### Supported Image Formats
- PNG
- JPEG/JPG
- WebP
- Maximum size: 10MB

### Supported Platforms
- Twitter (X) - Short, punchy content (280 chars)
- LinkedIn - Professional, storytelling approach
- Instagram - Visual, conversational, emotive

### Supported Languages
- English
- Hindi (हिन्दी)
- Marathi (मराठी)
- Tamil (தமிழ்)
- Bengali (বাংলা)
- Telugu (తెలుగు)
- Gujarati (ગુજરાતી)
- Kannada (ಕನ್ನಡ)
- Malayalam (മലയാളം)
- Punjabi (ਪੰਜਾਬੀ)

### Cultural Contexts
- Festivals: Diwali, Holi, Eid, Christmas, Pongal, Onam, etc.
- Events: IPL Season, Cricket World Cup, Wedding Season
- Seasons: Monsoon, Summer, Winter
- National Days: Independence Day, Republic Day

## Use Cases

### 1. Product Marketing
Upload a product photo → AI generates compelling product description with benefits and CTA

### 2. Shop/Store Promotion
Upload shop interior/exterior → AI creates inviting post highlighting ambiance and offerings

### 3. Event Coverage
Upload event photos → AI crafts engaging recap posts with emotional appeal

### 4. Food & Beverage
Upload food photos → AI writes mouth-watering descriptions with sensory details

### 5. Fashion & Lifestyle
Upload outfit/lifestyle photos → AI creates trendy, aspirational content

## Hackathon Alignment

### AWS Generative AI Features Utilized
1. **Amazon Bedrock Vision** - Claude 3 Sonnet for multimodal understanding
2. **Advanced Prompt Engineering** - Platform-specific, culturally-aware prompts
3. **Multi-language Support** - Indic language generation
4. **Cultural Context Integration** - Festival and event-aware content

### Innovation Points
- Lowers barrier to entry for digital marketing
- Enables non-technical users to create professional content
- Supports regional languages and cultural contexts
- Combines vision AI with content generation
- Platform-optimized output

## Example Workflow

1. User selects "Image-to-Post" mode
2. User uploads product image (e.g., handmade terracotta diyas)
3. User selects:
   - Platform: Instagram
   - Language: Hindi
   - Cultural Context: Diwali
4. User optionally adds context: "Handmade by local artisans"
5. AI analyzes image and generates:
   ```
   Content: "✨ इस दिवाली, अपने घर को रोशन करें हमारे हस्तनिर्मित मिट्टी के दीयों से! 
   🪔 स्थानीय कारीगरों द्वारा प्यार से बनाए गए, हर दीया एक कहानी कहता है। 
   
   अभी ऑर्डर करें और त्योहार को और खास बनाएं! 🎉
   
   #Diwali2024 #HandmadeDiyas #SupportLocal #FestivalOfLights #दिवाली"
   
   Hashtags: ["Diwali2024", "HandmadeDiyas", "SupportLocal", "FestivalOfLights", "दिवाली"]
   ```

## Performance Considerations

- Image processing time: 3-8 seconds (depending on image size)
- Model: Claude 3 Sonnet (balanced speed and quality)
- Base64 encoding handled client-side
- Async processing with loading states

## Future Enhancements

1. Batch image processing
2. Image editing suggestions
3. A/B testing different captions
4. Style transfer options
5. Video-to-post support
6. Real-time preview of post with image

## Environment Variables Required

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
POSTS_TABLE=your_dynamodb_table
```

## Testing

### Manual Testing Steps
1. Navigate to `/create` page
2. Select "Image-to-Post" mode
3. Upload a test image (product, shop, or event photo)
4. Select platform, language, and cultural context
5. Optionally add additional context
6. Click "Generate Post from Image"
7. Verify generated content is relevant and well-formatted
8. Check hashtags are appropriate
9. Verify content is in selected language
10. Test with different platforms and languages

### Test Images
- Product photos (clear, well-lit)
- Shop/store images
- Food items
- Fashion/clothing
- Event photos
- Landscape/scenery

## Error Handling

- Invalid image format → User-friendly error message
- Image too large → Size limit warning
- API failures → Retry mechanism with error display
- Empty response → Fallback error handling
- Network issues → Timeout handling

## Security Considerations

- JWT authentication required
- Image size limits enforced
- Base64 validation
- User-specific data isolation
- No image storage (processed in-memory)

## Conclusion

The Image-to-Post feature democratizes social media marketing by enabling anyone with a smartphone camera to create professional, engaging content. By leveraging AWS Bedrock's Vision capabilities, we've created a powerful tool that understands visual content and generates culturally-aware, platform-optimized posts in multiple languages.
