#!/usr/bin/env node
/**
 * Test script for Vision API
 * Usage: node test-vision-api.js [your-auth-token]
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const AUTH_TOKEN = process.argv[2] || 'YOUR_TOKEN_HERE';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Create a tiny 1x1 red pixel PNG for testing
const TEST_IMAGE_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';

async function testVisionAPI() {
    console.log('🧪 Testing Vision API...\n');
    console.log('Configuration:');
    console.log('  API URL:', API_URL);
    console.log('  AWS Region:', process.env.CREO_AWS_REGION);
    console.log('  Vision Model Priority:', process.env.VISION_MODEL_PRIORITY);
    console.log('  Bedrock Model:', process.env.BEDROCK_MODEL_ID);
    console.log('  S3 Bucket:', process.env.S3_BUCKET_NAME);
    console.log('  Posts Table:', process.env.POSTS_TABLE);
    console.log('');

    // Check required environment variables
    const requiredVars = [
        'CREO_AWS_REGION',
        'CREO_AWS_ACCESS_KEY_ID',
        'CREO_AWS_SECRET_ACCESS_KEY',
        'VISION_MODEL_PRIORITY',
        'POSTS_TABLE',
        'S3_BUCKET_NAME'
    ];

    const missing = requiredVars.filter(v => !process.env[v]);
    if (missing.length > 0) {
        console.error('❌ Missing environment variables:', missing.join(', '));
        console.error('   Please check your .env file\n');
        process.exit(1);
    }

    console.log('✅ All required environment variables present\n');

    // Test API endpoint
    console.log('📡 Sending request to /api/vision-generate...\n');

    const payload = {
        image_base64: `data:image/png;base64,${TEST_IMAGE_BASE64}`,
        platform: 'Twitter',
        target_language: 'English',
        cultural_context: 'None',
        additional_context: 'Test image for debugging'
    };

    try {
        const response = await fetch(`${API_URL}/api/vision-generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AUTH_TOKEN}`
            },
            body: JSON.stringify(payload)
        });

        console.log('Response Status:', response.status, response.statusText);
        console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
        console.log('');

        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            
            if (response.ok) {
                console.log('✅ SUCCESS! Vision API is working\n');
                console.log('Generated Post:');
                console.log('  Content:', data.content?.substring(0, 100) + '...');
                console.log('  Platform:', data.platform);
                console.log('  Language:', data.target_language);
                console.log('  Hashtags:', data.suggested_hashtags);
                console.log('  Scores:', {
                    hook: data.hook_score,
                    clarity: data.clarity_score,
                    cta: data.cta_score,
                    final: data.final_score
                });
            } else {
                console.log('❌ API Error:', data.error);
                if (data.details) {
                    console.log('   Details:', data.details);
                }
                
                // Provide specific guidance
                if (data.error?.includes('access denied') || data.error?.includes('Access Denied')) {
                    console.log('\n💡 Solution: Enable Bedrock model access in AWS Console');
                    console.log('   1. Go to AWS Console → Bedrock → Model Access');
                    console.log('   2. Select us-east-1 region');
                    console.log('   3. Enable: Nova Pro, Claude 3.5 Sonnet, Claude 3.5 Haiku');
                } else if (data.error?.includes('credentials')) {
                    console.log('\n💡 Solution: Check AWS credentials in .env file');
                } else if (data.error?.includes('not available')) {
                    console.log('\n💡 Solution: Check VISION_MODEL_PRIORITY setting');
                }
            }
        } else {
            const text = await response.text();
            console.log('❌ Non-JSON Response:', text.substring(0, 500));
        }

    } catch (error) {
        console.error('❌ Request Failed:', error.message);
        
        if (error.message.includes('fetch')) {
            console.log('\n💡 Make sure the development server is running:');
            console.log('   cd CREO-AI/creo-ai && npm run dev');
        }
    }
}

// Run the test
testVisionAPI().catch(console.error);
