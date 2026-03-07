/**
 * Test JSON extraction logic
 * Run with: node test-json-extraction.js
 */

// Test cases that models might return
const testCases = [
    {
        name: 'Markdown code block with json tag',
        input: '```json\n{\n  "content": "Test content",\n  "hashtags": ["test"]\n}\n```',
        expected: true
    },
    {
        name: 'Markdown code block without json tag',
        input: '```\n{\n  "content": "Test content",\n  "hashtags": ["test"]\n}\n```',
        expected: true
    },
    {
        name: 'Plain JSON',
        input: '{\n  "content": "Test content",\n  "hashtags": ["test"]\n}',
        expected: true
    },
    {
        name: 'JSON with text before',
        input: 'Here is the result:\n{\n  "content": "Test content",\n  "hashtags": ["test"]\n}',
        expected: true
    },
    {
        name: 'JSON with text after',
        input: '{\n  "content": "Test content",\n  "hashtags": ["test"]\n}\nHope this helps!',
        expected: true
    },
    {
        name: 'JSON with newlines in content',
        input: '{\n  "content": "Line 1\\nLine 2\\nLine 3",\n  "hashtags": ["test"]\n}',
        expected: true
    },
    {
        name: 'Malformed - no JSON',
        input: 'This is just text without any JSON',
        expected: false
    }
];

function extractJSON(textContent) {
    // Remove markdown code blocks
    let cleanedText = textContent;
    cleanedText = cleanedText.replace(/```json\s*/g, '');
    cleanedText = cleanedText.replace(/```\s*/g, '');
    cleanedText = cleanedText.trim();
    
    // Find JSON object boundaries
    const firstBrace = cleanedText.indexOf('{');
    const lastBrace = cleanedText.lastIndexOf('}');
    
    let extractedJson;
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        extractedJson = cleanedText.substring(firstBrace, lastBrace + 1);
    } else {
        extractedJson = cleanedText;
    }
    
    if (!extractedJson || extractedJson.length < 10) {
        throw new Error('No JSON found');
    }
    
    return extractedJson.trim();
}

console.log('Testing JSON Extraction Logic\n');
console.log('='.repeat(60));

let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
    console.log(`\nTest ${index + 1}: ${testCase.name}`);
    console.log('-'.repeat(60));
    
    try {
        const extracted = extractJSON(testCase.input);
        const parsed = JSON.parse(extracted);
        
        if (testCase.expected) {
            console.log('✅ PASS - Successfully extracted and parsed JSON');
            console.log('   Result:', JSON.stringify(parsed, null, 2).substring(0, 100));
            passed++;
        } else {
            console.log('❌ FAIL - Should have failed but succeeded');
            failed++;
        }
    } catch (error) {
        if (!testCase.expected) {
            console.log('✅ PASS - Correctly failed as expected');
            passed++;
        } else {
            console.log('❌ FAIL - Should have succeeded but failed');
            console.log('   Error:', error.message);
            console.log('   Input:', testCase.input.substring(0, 100));
            failed++;
        }
    }
});

console.log('\n' + '='.repeat(60));
console.log(`\nResults: ${passed} passed, ${failed} failed out of ${testCases.length} tests`);

if (failed === 0) {
    console.log('🎉 All tests passed!');
} else {
    console.log('⚠️  Some tests failed. Review the logic.');
}
