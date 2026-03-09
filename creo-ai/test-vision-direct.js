#!/usr/bin/env node
/**
 * Direct test of Bedrock Vision (bypasses authentication)
 */
require('dotenv').config();

const { BedrockRuntimeClient, ConverseCommand } = require('@aws-sdk/client-bedrock-runtime');

// Test image: 1x1 red pixel PNG
const TEST_IMAGE_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';

async function testBedrockVision() {
    console.log('🧪 Testing Bedrock Vision directly...\n');
    
    // Check credentials
    if (!process.env.CREO_AWS_ACCESS_KEY_ID || !process.env.CREO_AWS_SECRET_ACCESS_KEY) {
        console.error('❌ Missing AWS credentials in .env file');
        process.exit(1);
    }
    
    const client = new BedrockRuntimeClient({
        region: process.env.CREO_AWS_REGION || 'us-east-1',
        credentials: {
            accessKeyId: process.env.CREO_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.CREO_AWS_SECRET_ACCESS_KEY,
        },
    });
    
    // Models to try
    const models = [
        'us.amazon.nova-pro-v1:0',
        'us.anthropic.claude-3-5-sonnet-20241022-v2:0',
        'anthropic.claude-3-5-sonnet-20240620-v1:0',
        'us.anthropic.claude-3-5-haiku-20241022-v1:0',
    ];
    
    for (const modelId of models) {
        console.log(`\n📡 Testing model: ${modelId}`);
        
        try {
            const command = new ConverseCommand({
                modelId,
                messages: [{
                    role: 'user',
                    content: [
                        {
                            image: {
                                format: 'png',
                                source: {
                                    bytes: Buffer.from(TEST_IMAGE_BASE64, 'base64'),
                                },
                            },
                        },
                        {
                            text: 'Describe this image in one sentence.',
                        },
                    ],
                }],
                inferenceConfig: {
                    maxTokens: 100,
                    temperature: 0.7,
                },
            });
            
            const response = await client.send(command);
            const text = response.output?.message?.content?.[0]?.text;
            
            console.log(`✅ SUCCESS with ${modelId}`);
            console.log(`   Response: ${text}`);
            break;
            
        } catch (error) {
            console.log(`❌ FAILED with ${modelId}`);
            console.log(`   Error: ${error.message}`);
            
            if (error.message.includes('access denied') || error.message.includes('Access Denied')) {
                console.log('   💡 Enable this model in AWS Bedrock Console → Model Access');
            }
        }
    }
    
    console.log('\n✅ Test complete');
}

testBedrockVision().catch(console.error);
