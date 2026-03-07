import {
    BedrockRuntimeClient,
    ConverseCommand,
} from '@aws-sdk/client-bedrock-runtime';

const bedrockClient = new BedrockRuntimeClient({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

/**
 * Invoke a text model via Bedrock (Converse API) and return parsed JSON.
 * @param prompt - The full prompt string telling the model to return JSON
 * @returns Parsed JSON object from model's response
 * @throws Error if model invocation or JSON parsing fails
 */
export async function invokeModel<T>(prompt: string): Promise<T> {
    const modelId = process.env.BEDROCK_MODEL_ID || 'amazon.nova-lite-v1:0';

    try {
        const command = new ConverseCommand({
            modelId,
            messages: [
                {
                    role: 'user',
                    content: [{ text: prompt }],
                },
            ],
            inferenceConfig: {
                maxTokens: 2048,
                temperature: 0.3,
            },
        });

        const response = await bedrockClient.send(command);

        if (!response.output?.message?.content?.[0]?.text) {
            throw new Error('Empty response from Bedrock model');
        }

        const textContent = response.output.message.content[0].text;
        console.log('[bedrockClient] Response length:', textContent.length);
        console.log('[bedrockClient] First 200 chars:', textContent.substring(0, 200));

        // Try multiple JSON extraction strategies
        let extractedJson: string | null = null;

        // Strategy 1: Remove markdown code blocks completely
        let cleanedText = textContent;
        
        // Remove ```json and ``` markers
        cleanedText = cleanedText.replace(/```json\s*/g, '');
        cleanedText = cleanedText.replace(/```\s*/g, '');
        cleanedText = cleanedText.trim();
        
        console.log('[bedrockClient] After removing markdown:', cleanedText.substring(0, 200));

        // Strategy 2: Find JSON object boundaries
        const firstBrace = cleanedText.indexOf('{');
        const lastBrace = cleanedText.lastIndexOf('}');
        
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            extractedJson = cleanedText.substring(firstBrace, lastBrace + 1);
            console.log('[bedrockClient] Extracted JSON by braces, length:', extractedJson.length);
        } else {
            // Strategy 3: Try the cleaned text as-is
            extractedJson = cleanedText;
            console.log('[bedrockClient] Using cleaned text as JSON');
        }

        if (!extractedJson || extractedJson.length < 10) {
            console.error('[bedrockClient] No valid JSON found. Response:', textContent.substring(0, 500));
            throw new Error(`No JSON found in model response. Response was: "${textContent.substring(0, 200)}..."`);
        }

        // Clean up the extracted JSON
        extractedJson = extractedJson.trim();

        // Sanitize: escape unescaped control characters inside JSON string values
        try {
            // First attempt: parse as-is
            const parsed = JSON.parse(extractedJson) as T;
            console.log('[bedrockClient] ✅ Successfully parsed JSON');
            return parsed;
        } catch (firstError) {
            console.log('[bedrockClient] First parse failed, trying with sanitization...');
            console.error('[bedrockClient] Parse error:', firstError instanceof Error ? firstError.message : firstError);
            
            // Second attempt: Use a more robust JSON fixer
            try {
                // Strategy: Find the problematic position and fix it
                const errorMatch = firstError instanceof Error && firstError.message.match(/position (\d+)/);
                if (errorMatch) {
                    const errorPos = parseInt(errorMatch[1]);
                    console.log('[bedrockClient] Error at position:', errorPos);
                    console.log('[bedrockClient] Context:', extractedJson.substring(Math.max(0, errorPos - 50), errorPos + 50));
                }
                
                // Try to fix common issues by parsing line-by-line
                let fixed = extractedJson;
                
                // Parse JSON structure manually and fix string values
                const lines = fixed.split('\n');
                const fixedLines: string[] = [];
                let inStringValue = false;
                let currentKey = '';
                let currentValue = '';
                
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
                            // Single-line value
                            const cleaned = currentValue.replace(/",$/, '').replace(/"$/, '');
                            const escaped = cleaned
                                .replace(/\\/g, '\\\\')
                                .replace(/\n/g, '\\n')
                                .replace(/\r/g, '\\r')
                                .replace(/\t/g, '\\t');
                            
                            const ending = currentValue.endsWith(',') ? '",' : '"';
                            fixedLines.push(`  "${currentKey}": "${escaped}${ending}`);
                        } else {
                            // Multi-line value starts
                            inStringValue = true;
                            currentValue = keyMatch[2];
                        }
                    } else if (inStringValue) {
                        // Continue collecting multi-line value
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
                        // Not a string value line
                        fixedLines.push(line);
                    }
                }
                
                fixed = fixedLines.join('\n');
                
                const parsed = JSON.parse(fixed) as T;
                console.log('[bedrockClient] ✅ Successfully parsed JSON after fixing');
                return parsed;
            } catch (secondError) {
                console.error('[bedrockClient] ❌ Second parse also failed:', secondError);
                console.error('[bedrockClient] Original text (first 500):', textContent.substring(0, 500));
                console.error('[bedrockClient] Extracted JSON (first 500):', extractedJson.substring(0, 500));
                
                // Last resort: Try to extract just the content field if it exists
                try {
                    const contentMatch = extractedJson.match(/"content"\s*:\s*"([^"]+)"/);
                    const hashtagsMatch = extractedJson.match(/"suggested_hashtags"\s*:\s*\[(.*?)\]/);
                    
                    if (contentMatch) {
                        const fallbackJson = {
                            content: contentMatch[1],
                            suggested_hashtags: hashtagsMatch ? JSON.parse(`[${hashtagsMatch[1]}]`) : [],
                        };
                        console.log('[bedrockClient] ⚠️ Using fallback extraction');
                        return fallbackJson as T;
                    }
                } catch (fallbackError) {
                    // Ignore fallback errors
                }
                
                throw new Error(`Failed to parse JSON from model response: ${firstError instanceof Error ? firstError.message : 'Unknown error'}`);
            }
        }
    } catch (error) {
        console.error('[bedrockClient] Error:', error);
        throw error;
    }
}

