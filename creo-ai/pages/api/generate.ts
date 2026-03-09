/**
 * POST /api/generate
 * Validates auth → generates content → scores it → saves post to DynamoDB → returns result.
 */
import type { NextApiResponse } from 'next';
import { withAuth, AuthenticatedRequest } from '@/lib/authMiddleware';
import { generateContent } from '@/services/aiService';
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

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { idea, platform, target_language, cultural_context } = req.body as {
        idea?: string;
        platform?: string;
        target_language?: string;
        cultural_context?: string;
    };

    // Input validation
    if (!idea || typeof idea !== 'string' || idea.trim().length === 0) {
        return res.status(400).json({ error: 'idea is required and must be a non-empty string' });
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

    try {
        console.log('[/api/generate] ========== REQUEST START =========');
        
        const typedPlatform = platform as Platform;
        const typedLanguage = target_language as IndicLanguage;
        const typedCulturalContext = (cultural_context || 'None') as CulturalContext;
        const userId = req.userId;

        console.log('[/api/generate] Idea:', idea);
        console.log('[/api/generate] Platform:', typedPlatform);
        console.log('[/api/generate] Language:', typedLanguage);
        console.log('[/api/generate] Cultural Context:', typedCulturalContext);
        console.log('[/api/generate] User ID:', userId);

        // 1. Generate content via AI
        console.log('[/api/generate] Calling generateContent...');
        const generated = await generateContent(idea.trim(), typedPlatform, typedLanguage, typedCulturalContext);
        console.log('[/api/generate] ✅ Generated content received');
        console.log('[/api/generate] Content length:', generated.content.length);
        console.log('[/api/generate] First 200 chars:', generated.content.substring(0, 200));

        // 2. Score the generated content
        console.log('[/api/generate] Calling scoreContent...');
        const scores = await scoreContent(generated.content, typedPlatform);
        console.log('[/api/generate] ✅ Scores received:', scores.final_score);

        // 3. Build the post record
        const post = {
            user_id: userId,
            created_at: Date.now(),
            post_id: randomUUID(),
            content: generated.content,
            platform: typedPlatform,
            target_language: typedLanguage,
            cultural_context: typedCulturalContext,
            idea: idea.trim(),
            suggested_hashtags: generated.suggested_hashtags,
            ...scores,
        };

        // 4. Persist to DynamoDB Posts table
        console.log('[/api/generate] Saving post to DynamoDB...');
        await dynamoDb.send(
            new PutCommand({
                TableName: POSTS_TABLE,
                Item: post,
            })
        );
        console.log('[/api/generate] ✅ Post saved successfully');
        console.log('[/api/generate] ========== REQUEST COMPLETE =========');

        return res.status(200).json(post);
    } catch (error) {
        console.error('[/api/generate] ✗ CAUGHT ERROR');
        console.error('[/api/generate] Error:', error instanceof Error ? error.message : String(error));
        if (error instanceof Error && error.stack) {
            console.error('[/api/generate] Stack:', error.stack);
        }
        const message = error instanceof Error ? error.message : 'Internal server error';
        return res.status(500).json({ error: message });
    }
}

export default withAuth(handler);
