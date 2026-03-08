/**
 * Vision Service — Image-to-Content Generation
 * Uses Amazon Bedrock Vision (Claude 3 Sonnet) to analyze images
 * and generate compelling social media content.
 */
import { BedrockRuntimeClient, BedrockRuntimeClientConfig, ConverseCommand } from '@aws-sdk/client-bedrock-runtime';
import { Platform, CulturalContext } from '@/types/post';
import { generateCulturalPrompt } from '@/types/culturalContext';

const config: BedrockRuntimeClientConfig = {
    region: process.env.CREO_AWS_REGION || 'us-east-1',
};

if (process.env.CREO_AWS_ACCESS_KEY_ID && process.env.CREO_AWS_SECRET_ACCESS_KEY) {
    config.credentials = {
        accessKeyId: process.env.CREO_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.CREO_AWS_SECRET_ACCESS_KEY,
    };
}

const bedrockClient = new BedrockRuntimeClient(config);

interface VisionGenerateResult {
    content: string;
    suggested_hashtags: string[];
    image_description: string;
}

/**
 * Analyze an image and generate social media content based on visual content
 */
export async function generateContentFromImage(
    imageBase64: string,
    platform: Platform,
    targetLanguage: string = 'English',
    culturalContext: CulturalContext = 'None',
    additionalContext?: string
): Promise<VisionGenerateResult> {
    // Get model priority from environment or use defaults
    const modelPriority = process.env.VISION_MODEL_PRIORITY || 'nova-pro,claude-sonnet,claude-haiku';
    
    // Model mapping
    const modelMap: Record<string, string[]> = {
        'nova-pro': ['us.amazon.nova-pro-v1:0', 'amazon.nova-pro-v1:0'],
        'nova-lite': ['us.amazon.nova-lite-v1:0', 'amazon.nova-lite-v1:0'],
        'claude-sonnet': [
            'us.anthropic.claude-3-5-sonnet-20241022-v2:0',
            'anthropic.claude-3-5-sonnet-20240620-v1:0',
        ],
        'claude-haiku': [
            'us.anthropic.claude-3-5-haiku-20241022-v1:0',
            'anthropic.claude-3-haiku-20240307-v1:0',
        ],
        'claude-opus': [
            'us.anthropic.claude-3-opus-20240229-v1:0',
            'anthropic.claude-3-opus-20240229-v1:0',
        ],
    };

    // Build list of models to try based on priority
    const modelsToTry: string[] = [];
    const priorities = modelPriority.split(',').map(p => p.trim());
    
    for (const priority of priorities) {
        const models = modelMap[priority];
        if (models) {
            modelsToTry.push(...models);
        }
    }

    // Fallback to all models if none specified
    if (modelsToTry.length === 0) {
        modelsToTry.push(
            'us.amazon.nova-pro-v1:0',
            'us.anthropic.claude-3-5-sonnet-20241022-v2:0',
            'anthropic.claude-3-5-sonnet-20240620-v1:0',
            'us.anthropic.claude-3-5-haiku-20241022-v1:0',
            'anthropic.claude-3-haiku-20240307-v1:0',
        );
    }

    console.log(`[visionService] Model priority: ${modelPriority}`);
    console.log(`[visionService] Will try ${modelsToTry.length} models`);

    let lastError: Error | null = null;

    for (const modelId of modelsToTry) {
        try {
            console.log(`[visionService] Trying model: ${modelId}`);
            const result = await tryGenerateWithModel(
                modelId,
                imageBase64,
                platform,
                targetLanguage,
                culturalContext,
                additionalContext
            );
            console.log(`[visionService] ✅ Success with model: ${modelId}`);
            return result;
        } catch (error) {
            console.error(`[visionService] ❌ Failed with ${modelId}:`, error instanceof Error ? error.message : error);
            lastError = error instanceof Error ? error : new Error(String(error));
            
            const errorMessage = error instanceof Error ? error.message.toLowerCase() : '';
            
            // Check if this is a model availability error (should try next model)
            const shouldTryNext = 
                errorMessage.includes('legacy') ||
                errorMessage.includes('end of its life') ||
                errorMessage.includes('reached the end') ||
                errorMessage.includes('access denied') ||
                errorMessage.includes('access') ||
                errorMessage.includes('not found') ||
                errorMessage.includes('not available') ||
                errorMessage.includes('no access') ||
                errorMessage.includes('model not enabled');
            
            if (shouldTryNext) {
                console.log(`[visionService] ⚠️ Model ${modelId} unavailable, trying next model...`);
                continue;
            }
            
            // For other errors (like network issues, invalid input, etc.), throw immediately
            console.error(`[visionService] 🛑 Non-recoverable error, stopping fallback`);
            throw error;
        }
    }

    // If all models failed, throw the last error
    throw new Error(`All vision models failed. Last error: ${lastError?.message || 'Unknown error'}. Please enable model access in AWS Bedrock console.`);
}

/**
 * Try to generate content with a specific model
 */
async function tryGenerateWithModel(
    modelId: string,
    imageBase64: string,
    platform: Platform,
    targetLanguage: string,
    culturalContext: CulturalContext,
    additionalContext?: string
): Promise<VisionGenerateResult> {
    const platformGuidelines: Record<Platform, string> = {
        Twitter: 'Keep it under 280 characters, punchy and direct, with strong hook.',
        LinkedIn: 'Professional tone, 150-300 words, storytelling approach, thought leadership.',
        Instagram: 'Visually descriptive, conversational, emotive, 100-200 words, perfect for visual content.',
    };

    const languageGuidance = targetLanguage === 'English'
        ? 'Generate content in English.'
        : `Generate content in ${targetLanguage} language. Ensure the content is natural, culturally appropriate, and uses common phrases/expressions that native ${targetLanguage} speakers would use. Use proper script and characters for ${targetLanguage}.`;

    const culturalPrompt = generateCulturalPrompt(culturalContext);

    const contextGuidance = additionalContext 
        ? `\n\nAdditional Context from User: "${additionalContext}"\nUse this context to enhance the post and make it more relevant.`
        : '';

    const prompt = `You are an elite social media content strategist with expertise in visual storytelling. Analyze the provided image and create highly engaging, platform-optimized social media content.

Target Platform: ${platform}
Platform Guidelines: ${platformGuidelines[platform]}
Target Language: ${targetLanguage}
Language Guidance: ${languageGuidance}${culturalPrompt}${contextGuidance}

CRITICAL INSTRUCTIONS:
1. Carefully analyze the image - identify products, people, settings, emotions, colors, text, branding, and key visual elements.
2. Create a compelling narrative or message based on what you see in the image.
3. Adapt the tone, formatting, and structure to match ${platform}'s best practices.
4. Generate the entire content in ${targetLanguage === 'English' ? 'English' : `${targetLanguage} language using proper ${targetLanguage} script`}. Use RICH MARKDOWN formatting (bold, italics, headers, lists) where appropriate to make the text engaging.
5. Start with a strong hook that captures attention and relates to the visual content.
6. Make the content feel authentic and natural, as if a human wrote it while looking at this image.
7. Include a clear call-to-action (CTA) appropriate for the platform.
8. Provide 3-5 highly relevant hashtags based on the image content${culturalContext !== 'None' ? ', incorporating culturally relevant hashtags related to ' + culturalContext : ''}.
9. Also provide a brief description of what you see in the image (in English, for internal use).

CRITICAL: You MUST respond with ONLY a valid JSON object. Do not include any text before or after the JSON. Do not use markdown code blocks. Just pure JSON.

Required JSON format:
{
  "content": "the generated social media post text in ${targetLanguage}",
  "suggested_hashtags": ["hashtag1", "hashtag2", "hashtag3"],
  "image_description": "brief description of the image content in English"
}

Remember: ONLY return the JSON object, nothing else. No explanations, no markdown, no extra text.`;

    try {
        // Detect image format from base64 data
        let imageFormat: 'png' | 'jpeg' | 'gif' | 'webp' = 'jpeg';
        if (imageBase64.startsWith('iVBORw0KGgo')) {
            imageFormat = 'png';
        } else if (imageBase64.startsWith('R0lGOD')) {
            imageFormat = 'gif';
        } else if (imageBase64.startsWith('UklGR')) {
            imageFormat = 'webp';
        }

        const command = new ConverseCommand({
            modelId,
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            image: {
                                format: imageFormat,
                                source: {
                                    bytes: Buffer.from(imageBase64, 'base64'),
                                },
                            },
                        },
                        {
                            text: prompt,
                        },
                    ],
                },
            ],
            inferenceConfig: {
                maxTokens: 2048,
                temperature: 0.7,
            },
        });

        const response = await bedrockClient.send(command);

        if (!response.output?.message?.content?.[0]?.text) {
            throw new Error('Empty response from Bedrock Vision model');
        }

        const textContent = response.output.message.content[0].text;
        console.log('[tryGenerateWithModel] Raw response length:', textContent.length);
        console.log('[tryGenerateWithModel] First 200 chars:', textContent.substring(0, 200));

        // Try multiple JSON extraction strategies
        let extractedJson: string | null = null;

        // Strategy 1: Remove all markdown code block markers
        let cleanedText = textContent;
        
        // Remove ```json, ```, and any other markdown
        cleanedText = cleanedText.replace(/```json\s*/g, '');
        cleanedText = cleanedText.replace(/```\s*/g, '');
        cleanedText = cleanedText.trim();
        
        console.log('[tryGenerateWithModel] After removing markdown:', cleanedText.substring(0, 200));

        // Strategy 2: Extract JSON object by finding first { and last }
        const firstBrace = cleanedText.indexOf('{');
        const lastBrace = cleanedText.lastIndexOf('}');
        
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            extractedJson = cleanedText.substring(firstBrace, lastBrace + 1);
            console.log('[tryGenerateWithModel] Extracted JSON by braces, length:', extractedJson.length);
        } else {
            extractedJson = cleanedText;
            console.log('[tryGenerateWithModel] Using cleaned text as JSON');
        }

        if (!extractedJson || extractedJson.length < 10) {
            console.error('[tryGenerateWithModel] No JSON found in response:', textContent.substring(0, 500));
            throw new Error('No valid JSON found in vision model response');
        }

        // Clean up
        extractedJson = extractedJson.trim();

        console.log('[tryGenerateWithModel] Extracted JSON length:', extractedJson.length);

        // Try parsing with error recovery
        try {
            const result = JSON.parse(extractedJson) as VisionGenerateResult;
            console.log('[tryGenerateWithModel] ✅ Successfully parsed JSON');
            return validateVisionResult(result);
        } catch (firstError) {
            console.log('[tryGenerateWithModel] First parse failed, trying with sanitization...');
            console.error('[tryGenerateWithModel] Parse error:', firstError instanceof Error ? firstError.message : firstError);
            
            // Try to fix common JSON issues
            try {
                let fixed = extractedJson;
                
                // Strategy: Parse JSON structure manually and fix string values
                // This handles multi-line strings and unescaped characters better
                
                // Find the position of each key and its value
                const lines = fixed.split('\n');
                const fixedLines: string[] = [];
                let inStringValue = false;
                let currentKey = '';
                let currentValue = '';
                let braceCount = 0;
                
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    const trimmed = line.trim();
                    
                    // Check if this line starts a new key-value pair
                    const keyMatch = trimmed.match(/^"([^"]+)"\s*:\s*"(.*)$/);
                    
                    if (keyMatch && !inStringValue) {
                        // Start of a string value
                        currentKey = keyMatch[1];
                        currentValue = keyMatch[2];
                        
                        // Check if the value ends on this line
                        if (currentValue.endsWith('"') || currentValue.endsWith('",')) {
                            // Single-line value, just escape it
                            const cleaned = currentValue.replace(/",$/, '').replace(/"$/, '');
                            const escaped = cleaned
                                .replace(/\\/g, '\\\\')
                                .replace(/\n/g, '\\n')
                                .replace(/\r/g, '\\r')
                                .replace(/\t/g, '\\t');
                            
                            const ending = currentValue.endsWith(',') ? '",' : '"';
                            fixedLines.push(`  "${currentKey}": "${escaped}${ending}`);
                        } else {
                            // Multi-line value starts here
                            inStringValue = true;
                            currentValue = keyMatch[2];
                        }
                    } else if (inStringValue) {
                        // Continue collecting the multi-line value
                        currentValue += '\n' + line;
                        
                        // Check if this line ends the value
                        if (trimmed.endsWith('"') || trimmed.endsWith('",')) {
                            // End of multi-line value
                            const cleaned = currentValue.replace(/",$/, '').replace(/"$/, '');
                            const escaped = cleaned
                                .replace(/\\/g, '\\\\')
                                .replace(/\n/g, '\\n')
                                .replace(/\r/g, '\\r')
                                .replace(/\t/g, '\\t');
                            
                            const ending = trimmed.endsWith(',') ? '",' : '"';
                            fixedLines.push(`  "${currentKey}": "${escaped}${ending}`);
                            inStringValue = false;
                            currentKey = '';
                            currentValue = '';
                        }
                    } else {
                        // Not a string value line (braces, brackets, etc.)
                        fixedLines.push(line);
                    }
                }
                
                fixed = fixedLines.join('\n');
                
                const result = JSON.parse(fixed) as VisionGenerateResult;
                console.log('[tryGenerateWithModel] ✅ Successfully parsed JSON after fixing');
                return validateVisionResult(result);
            } catch (secondError) {
                console.error('[tryGenerateWithModel] ❌ All parsing attempts failed');
                console.error('[tryGenerateWithModel] Original response:', textContent.substring(0, 500));
                console.error('[tryGenerateWithModel] Extracted JSON:', extractedJson.substring(0, 500));
                throw new Error('Failed to parse JSON from vision model response');
            }
        }

    } catch (error) {
        console.error('[tryGenerateWithModel] Error:', error);
        // Preserve the original error message for fallback logic
        if (error instanceof Error) {
            throw error;
        }
        throw new Error(`Vision content generation failed: ${String(error)}`);
    }
}

/**
 * Validate the vision generation result
 */
function validateVisionResult(result: any): VisionGenerateResult {
    if (!result.content || typeof result.content !== 'string') {
        throw new Error('Invalid content in vision response');
    }
    if (!Array.isArray(result.suggested_hashtags)) {
        throw new Error('Invalid hashtags in vision response');
    }
    if (!result.image_description || typeof result.image_description !== 'string') {
        throw new Error('Invalid image_description in vision response');
    }
    if (result.content.length < 10) {
        throw new Error('Generated content is too short');
    }

    return result as VisionGenerateResult;
}
