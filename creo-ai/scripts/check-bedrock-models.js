/**
 * Script to check available Bedrock models in your AWS account
 * Run with: node scripts/check-bedrock-models.js
 */
const { BedrockClient, ListFoundationModelsCommand } = require('@aws-sdk/client-bedrock');
require('dotenv').config();

const client = new BedrockClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

async function checkModels() {
    try {
        console.log('Checking available Bedrock models...\n');
        
        const command = new ListFoundationModelsCommand({});
        const response = await client.send(command);
        
        // Filter for vision-capable models (Claude with multimodal support)
        const visionModels = response.modelSummaries?.filter(model => 
            model.modelId?.includes('claude') && 
            model.inputModalities?.includes('IMAGE')
        ) || [];
        
        console.log('=== VISION-CAPABLE MODELS (Claude with Image Support) ===\n');
        visionModels.forEach(model => {
            console.log(`Model ID: ${model.modelId}`);
            console.log(`  Name: ${model.modelName}`);
            console.log(`  Status: ${model.modelLifecycle?.status || 'ACTIVE'}`);
            console.log(`  Input: ${model.inputModalities?.join(', ')}`);
            console.log(`  Output: ${model.outputModalities?.join(', ')}`);
            console.log('');
        });
        
        if (visionModels.length === 0) {
            console.log('⚠️  No vision-capable models found!');
            console.log('You may need to request access to Claude models in AWS Bedrock console.');
            console.log('Visit: https://console.aws.amazon.com/bedrock/home#/modelaccess\n');
        }
        
        // Also show all Claude models
        const allClaude = response.modelSummaries?.filter(model => 
            model.modelId?.includes('claude')
        ) || [];
        
        console.log('=== ALL CLAUDE MODELS ===\n');
        allClaude.forEach(model => {
            console.log(`${model.modelId} - ${model.modelLifecycle?.status || 'ACTIVE'}`);
        });
        
    } catch (error) {
        console.error('Error checking models:', error.message);
        if (error.name === 'UnrecognizedClientException') {
            console.error('\n⚠️  AWS credentials are invalid. Check your .env file.');
        }
    }
}

checkModels();
