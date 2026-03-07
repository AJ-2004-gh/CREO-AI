/**
 * Test script to verify fallback logic
 * Run with: node test-fallback.js
 */

// Simulate the error messages we might get
const testErrors = [
    'This model version has reached the end of its life',
    'This Model is marked by provider as Legacy',
    'Access denied',
    'Model not found',
    'ValidationException: Invalid input',
    'Network error',
];

function shouldTryNext(errorMessage) {
    const msg = errorMessage.toLowerCase();
    
    return (
        msg.includes('legacy') ||
        msg.includes('end of its life') ||
        msg.includes('reached the end') ||
        msg.includes('access denied') ||
        msg.includes('access') ||
        msg.includes('not found') ||
        msg.includes('not available') ||
        msg.includes('no access') ||
        msg.includes('model not enabled')
    );
}

console.log('Testing fallback logic:\n');

testErrors.forEach(error => {
    const shouldFallback = shouldTryNext(error);
    const action = shouldFallback ? '✅ CONTINUE to next model' : '❌ THROW error';
    console.log(`Error: "${error}"`);
    console.log(`Action: ${action}\n`);
});
