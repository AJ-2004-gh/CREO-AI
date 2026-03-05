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
        const typedPlatform = platform as Platform;
        const typedLanguage = target_language as IndicLanguage;
        const typedCulturalContext = (cultural_context || 'None') as CulturalContext;
        const userId = req.userId;

        // 1. Generate content via AI
        const generated = await generateContent(idea.trim(), typedPlatform, typedLanguage, typedCulturalContext);

        // 2. Score the generated content
        const scores = await scoreContent(generated.content, typedPlatform);

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
        await dynamoDb.send(
            new PutCommand({
                TableName: POSTS_TABLE,
                Item: post,
            })
        );

        return res.status(200).json(post);
    } catch (error) {
        console.error('[/api/generate] Error:', error);
        const message = error instanceof Error ? error.message : 'Internal server error';
        return res.status(500).json({ error: message });
    }
}

export default withAuth(handler);
