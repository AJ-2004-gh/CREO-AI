/**
 * AI Service — Content Generation
 * Calls Amazon Bedrock (Claude) to generate platform-tailored social media content.
 */
import { invokeModel } from '@/lib/bedrockClient';
import { GenerateResult, Platform, CulturalContext } from '@/types/post';
import { generateCulturalPrompt } from '@/types/culturalContext';

/**
 * Generate social media content for a given idea, platform, target language, and cultural context.
 * Returns structured content and suggested hashtags.
 */
export async function generateContent(
    idea: string,
    platform: Platform,
    targetLanguage: string = 'English',
    culturalContext: CulturalContext = 'None'
): Promise<GenerateResult> {
    const platformGuidelines: Record<Platform, string> = {
        Twitter: 'Keep it under 280 characters, punchy and direct, with strong hook.',
        LinkedIn: 'Professional tone, 150-300 words, storytelling approach, thought leadership.',
        Instagram: 'Visually descriptive, conversational, emotive, 100-200 words.',
    };

    const languageGuidance = targetLanguage === 'English'
        ? 'Generate content in English.'
        : `Generate content in ${targetLanguage} language. Ensure the content is natural, culturally appropriate, and uses common phrases/expressions that native ${targetLanguage} speakers would use. Use proper script and characters for ${targetLanguage}.`;

    const culturalPrompt = generateCulturalPrompt(culturalContext);

    const prompt = `You are an elite social media content strategist and expert copywriter. Your goal is to generate highly engaging, platform-optimized content for a specific social media platform in the target language.

Target Platform: ${platform}
Platform-specific guidelines: ${platformGuidelines[platform]}
Target Language: ${targetLanguage}
Language Guidance: ${languageGuidance}${culturalPrompt}

User's Idea / Topic: "${idea}"

Instructions:
1. Analyze the core message of the user's idea.
2. Adapt the tone, formatting, and structure to perfectly match the target platform's best practices (e.g., use line breaks, emojis where appropriate, professional vs. casual tone).
3. Generate the entire content in ${targetLanguage === 'English' ? 'English' : `${targetLanguage} language using proper ${targetLanguage} script and characters`}.
4. Ensure the opening acts as a strong hook to stop the scroll.
5. Conclude with a clear, subtle or direct call to action (CTA) in ${targetLanguage === 'English' ? 'English' : targetLanguage}.
6. Provide 3-5 highly relevant hashtags that mix broad appeal with niche targeting, in ${targetLanguage === 'English' ? 'English' : targetLanguage}${culturalContext !== 'None' ? ', incorporating culturally relevant hashtags related to ' + culturalContext : ''}.

Return ONLY valid JSON in this exact format (no markdown blocks, no explanation, just the JSON). Ensure that any newlines or quotes inside the string values are properly escaped (e.g., use \\n for line breaks):
{
  "content": "the generated social media post text",
  "suggested_hashtags": ["hashtag1", "hashtag2", "hashtag3"]
}`;

    const result = await invokeModel<GenerateResult>(prompt);

    // Validate response structure
    if (!result.content || !Array.isArray(result.suggested_hashtags)) {
        throw new Error('Invalid response structure from AI model');
    }

    return result;
}
