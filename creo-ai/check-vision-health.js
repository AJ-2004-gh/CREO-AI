#!/usr/bin/env node
/**
 * Vision Feature Health Check
 * Quickly diagnose common issues with the image-to-post feature
 */

require('dotenv').config();

const checks = [];
let hasErrors = false;

function check(name, condition, errorMsg, fixMsg) {
    if (condition) {
        checks.push({ name, status: '✅', message: 'OK' });
        return true;
    } else {
        checks.push({ name, status: '❌', message: errorMsg, fix: fixMsg });
        hasErrors = true;
        return false;
    }
}

function warn(name, message, recommendation) {
    checks.push({ name, status: '⚠️', message, fix: recommendation });
}

console.log('🔍 CREO-AI Vision Feature Health Check\n');
console.log('=' .repeat(60));

// Check 1: Environment variables
check(
    'AWS Region',
    process.env.CREO_AWS_REGION,
    'CREO_AWS_REGION not set',
    'Add CREO_AWS_REGION=us-east-1 to .env file'
);

check(
    'AWS Access Key',
    process.env.CREO_AWS_ACCESS_KEY_ID,
    'CREO_AWS_ACCESS_KEY_ID not set',
    'Add CREO_AWS_ACCESS_KEY_ID to .env file'
);

check(
    'AWS Secret Key',
    process.env.CREO_AWS_SECRET_ACCESS_KEY,
    'CREO_AWS_SECRET_ACCESS_KEY not set',
    'Add CREO_AWS_SECRET_ACCESS_KEY to .env file'
);

check(
    'Vision Model Priority',
    process.env.VISION_MODEL_PRIORITY,
    'VISION_MODEL_PRIORITY not set',
    'Add VISION_MODEL_PRIORITY=nova-pro,claude-sonnet,claude-haiku to .env'
);

check(
    'S3 Bucket',
    process.env.S3_BUCKET_NAME,
    'S3_BUCKET_NAME not set',
    'Add S3_BUCKET_NAME to .env file'
);

check(
    'Posts Table',
    process.env.POSTS_TABLE,
    'POSTS_TABLE not set',
    'Add POSTS_TABLE to .env file'
);

check(
    'Bedrock Model ID',
    process.env.BEDROCK_MODEL_ID,
    'BEDROCK_MODEL_ID not set',
    'Add BEDROCK_MODEL_ID=amazon.nova-lite-v1:0 to .env'
);

// Check 2: Region validation
if (process.env.CREO_AWS_REGION && process.env.CREO_AWS_REGION !== 'us-east-1') {
    warn(
        'AWS Region',
        `Region is ${process.env.CREO_AWS_REGION}, but vision models work best in us-east-1`,
        'Consider changing CREO_AWS_REGION=us-east-1 for better model availability'
    );
}

// Check 3: Model priority format
if (process.env.VISION_MODEL_PRIORITY) {
    const priority = process.env.VISION_MODEL_PRIORITY;
    const validModels = ['nova-pro', 'nova-lite', 'claude-sonnet', 'claude-haiku', 'claude-opus'];
    const models = priority.split(',').map(m => m.trim());
    const invalidModels = models.filter(m => !validModels.includes(m));
    
    if (invalidModels.length > 0) {
        warn(
            'Model Priority Format',
            `Invalid models in priority: ${invalidModels.join(', ')}`,
            `Valid models: ${validModels.join(', ')}`
        );
    }
}

// Check 4: Cognito (for authentication)
check(
    'Cognito Domain',
    process.env.COGNITO_DOMAIN,
    'COGNITO_DOMAIN not set',
    'Add COGNITO_DOMAIN to .env file'
);

check(
    'Cognito Client ID',
    process.env.COGNITO_CLIENT_ID,
    'COGNITO_CLIENT_ID not set',
    'Add COGNITO_CLIENT_ID to .env file'
);

// Print results
console.log('\n📋 Check Results:\n');
checks.forEach(({ name, status, message, fix }) => {
    console.log(`${status} ${name}`);
    if (message !== 'OK') {
        console.log(`   ${message}`);
        if (fix) {
            console.log(`   💡 Fix: ${fix}`);
        }
    }
});

console.log('\n' + '='.repeat(60));

if (hasErrors) {
    console.log('\n❌ Health check FAILED - Please fix the errors above\n');
    process.exit(1);
} else {
    console.log('\n✅ Health check PASSED - Configuration looks good!\n');
    console.log('📝 Next steps if feature still not working:\n');
    console.log('1. Check browser console for errors (F12)');
    console.log('2. Verify AWS Bedrock model access is enabled:');
    console.log('   - Go to AWS Console → Bedrock → Model Access');
    console.log('   - Region: us-east-1');
    console.log('   - Enable: Nova Pro, Claude 3.5 Sonnet, Claude 3.5 Haiku');
    console.log('3. Check server logs when clicking "Ready" button');
    console.log('4. Run: node test-vision-api.js [your-token]');
    console.log('\n📖 See TROUBLESHOOT_VISION.md for detailed debugging guide\n');
}
