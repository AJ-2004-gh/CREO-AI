/**
 * POST /api/vision-generate
 * Analyzes an uploaded image using Amazon Bedrock Vision (Claude 3 Sonnet)
 * and generates social media content based on the visual content.
 */
import type { NextApiResponse } from 'next';
import { withAuth, AuthenticatedRequest } from '@/lib/authMiddleware';
import { generateContentFromImage } from '@/services/visionService';
import { scoreContent } from '@/services/scoringService';
import { dynamoDb } from '@/lib/dynamoClient';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import { Platform, IndicLanguage, CulturalContext } from '@/types/post';

const POSTS_TABLE = process.env.POSTS_TABLE!;

const VALID_PLATFORMS: Platform[] = ['Twitter', 'LinkedIn', 'Instagram'];
const VALID_LANGUAGES: IndicLanguage[] = ['English', 'Hindi', 'Marathi', 'Tamil', 'Bengali', 'Telugu', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi'];
const VALID_CULTURAL_CONTEXTS: CulturalContext[] = [
    'Diwali', 'Holi', 'Eid', 'Christmas', 'Pongal', 'Onam', 'Durga Puja', 'Ganesh Chaturthi', 'Navratri',
    'IPL Season', 'Cricket World Cup', 'Monsoon', 'Summer', 'Winter', 'Wedding Season', 'Festival Season',
    'Independence Day', 'Republic Day', 'New Year', 'None'
];

// Increase body size limit for image uploads
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { image_base64, platform, target_language, cultural_context, additional_context } = req.body as {
            image_base64?: string;
            platform?: string;
            target_language?: string;
            cultural_context?: string;
            additional_context?: string;
        };

        // Input validation
        if (!image_base64 || typeof image_base64 !== 'string') {
            return res.status(400).json({ error: 'image_base64 is required and must be a base64-encoded string' });
        }
        if (!platform || !VALID_PLATFORMS.includes(platform as Platform)) {
            return res.status(400).json({ error: `platform must be one of: ${VALID_PLATFORMS.join(', ')}` });
        }
        if (!target_language || !VALID_LANGUAGES.includes(target_language as IndicLanguage)) {
            return res.status(400).json({ error: `target_language must be one of: ${VALID_LANGUAGES.join(', ')}` });
        }
        if (cultural_context && !VALID_CULTURAL_CONTEXTS.includes(cultural_context as CulturalContext)) {
            return res.status(400).json({ error: `cultural_context must be one of: ${VALID_CULTURAL_CONTEXTS.join(', ')}` });
        }

        const typedPlatform = platform as Platform;
        const typedLanguage = target_language as IndicLanguage;
        const typedCulturalContext = (cultural_context || 'None') as CulturalContext;
        const userId = req.userId;

        // Extract base64 data (remove data:image/...;base64, prefix if present)
        const base64Data = image_base64.includes(',') 
            ? image_base64.split(',')[1] 
            : image_base64;

        console.log('[/api/vision-generate] ========== REQUEST START =========');
        console.log('[/api/vision-generate] Processing image for user:', userId);
        console.log('[/api/vision-generate] Platform:', typedPlatform, 'Language:', typedLanguage);
        console.log('[/api/vision-generate] Image size:', base64Data.length);
        console.log('[/api/vision-generate] Calling generateContentFromImage...');

        // 1. Analyze image and generate content via Vision AI
        const generated = await generateContentFromImage(
            base64Data,
            typedPlatform,
            typedLanguage,
            typedCulturalContext,
            additional_context
        );

        console.log('[/api/vision-generate] ✅ Content generated successfully');
        console.log('[/api/vision-generate] Content length:', generated.content.length);
        console.log('[/api/vision-generate] Image description:', generated.image_description.substring(0, 100));

        // 2. Score the generated content
        console.log('[/api/vision-generate] Calling scoreContent...');
        const scores = await scoreContent(generated.content, typedPlatform);
        console.log('[/api/vision-generate] ✅ Scores received:', scores.final_score);

        // 3. Build the post record
        const post = {
            user_id: userId,
            created_at: Date.now(),
            post_id: randomUUID(),
            content: generated.content,
            platform: typedPlatform,
            target_language: typedLanguage,
            cultural_context: typedCulturalContext,
            idea: generated.image_description || 'Generated from image',
            suggested_hashtags: generated.suggested_hashtags,
            generation_type: 'vision',
            ...scores,
        };

        // 4. Persist to DynamoDB Posts table
        console.log('[/api/vision-generate] Saving post to DynamoDB...');
        await dynamoDb.send(
            new PutCommand({
                TableName: POSTS_TABLE,
                Item: post,
            })
        );

        console.log('[/api/vision-generate] ✅ Post saved to database');
        console.log('[/api/vision-generate] ========== REQUEST COMPLETE =========');

        return res.status(200).json({
            ...post,
            image_description: generated.image_description,
        });
    } catch (error) {
        console.error('[/api/vision-generate] ✗ CAUGHT ERROR');
        console.error('[/api/vision-generate] Error type:', error instanceof Error ? error.constructor.name : typeof error);
        console.error('[/api/vision-generate] Error message:', error instanceof Error ? error.message : String(error));
        if (error instanceof Error && error.stack) {
            console.error('[/api/vision-generate] Stack:', error.stack);
        }
        
        const message = error instanceof Error ? error.message : 'Internal server error';
        
        // Provide more helpful error messages
        let userMessage = message;
        if (message.includes('access denied') || message.includes('Access Denied')) {
            userMessage = 'AWS Bedrock access denied. Please enable model access in AWS Bedrock Console.';
        } else if (message.includes('not found') || message.includes('not available')) {
            userMessage = 'Vision model not available. Please check VISION_MODEL_PRIORITY configuration.';
        } else if (message.includes('credentials')) {
            userMessage = 'AWS credentials error. Please check CREO_AWS_* environment variables.';
        } else if (message.includes('All vision models failed')) {
            userMessage = 'All vision models failed. Please enable model access in AWS Bedrock Console (us-east-1 region).';
        }
        
        return res.status(500).json({ 
            error: userMessage,
            details: message,
        });
    }
}

export default withAuth(handler);
