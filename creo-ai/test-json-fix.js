/**
 * Test JSON fixing logic for unterminated strings
 * Run with: node test-json-fix.js
 */

const testCases = [
    {
        name: 'Unescaped newline in content',
        input: `{
  "content": "Line 1
Line 2
Line 3",
  "hashtags": ["test"]
}`,
        shouldFix: true
    },
    {
        name: 'Unescaped quote in content',
        input: `{
  "content": "He said "hello" to me",
  "hashtags": ["test"]
}`,
        shouldFix: true
    },
    {
        name: 'Malayalam content with newlines',
        input: `{
  "content": "ഇത് ഒരു പരീക്ഷണം ആണ്
രണ്ടാം വരി
മൂന്നാം വരി",
  "hashtags": ["മലയാളം", "test"]
}`,
        shouldFix: true
    },
    {
        name: 'Already valid JSON',
        input: `{
  "content": "This is valid JSON",
  "hashtags": ["test"]
}`,
        shouldFix: false
    }
];

function fixJSON(jsonString) {
    // Fix string values: escape special characters
    const fixed = jsonString.replace(/":\s*"([^"]*)"/g, (match, content) => {
        const escaped = content
            .replace(/\\/g, '\\\\')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\t/g, '\\t')
            .replace(/"/g, '\\"');
        
        return `": "${escaped}"`;
    });
    
    return fixed;
}

console.log('Testing JSON Fixing Logic\n');
console.log('='.repeat(70));

let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
    console.log(`\nTest ${index + 1}: ${testCase.name}`);
    console.log('-'.repeat(70));
    
    // Try parsing original
    let originalWorks = false;
    try {
        JSON.parse(testCase.input);
        originalWorks = true;
        console.log('  Original: ✅ Valid JSON');
    } catch (error) {
        console.log('  Original: ❌ Invalid JSON -', error.message.substring(0, 60));
    }
    
    // Try parsing fixed version
    try {
        const fixed = fixJSON(testCase.input);
        const parsed = JSON.parse(fixed);
        
        if (testCase.shouldFix && !originalWorks) {
            console.log('  Fixed:    ✅ Successfully fixed and parsed');
            console.log('  Content preview:', parsed.content.substring(0, 50));
            passed++;
        } else if (!testCase.shouldFix && originalWorks) {
            console.log('  Fixed:    ✅ Correctly handled valid JSON');
            passed++;
        } else {
            console.log('  Fixed:    ⚠️  Unexpected result');
            failed++;
        }
    } catch (error) {
        console.log('  Fixed:    ❌ Still failed -', error.message.substring(0, 60));
        failed++;
    }
});

console.log('\n' + '='.repeat(70));
console.log(`\nResults: ${passed} passed, ${failed} failed out of ${testCases.length} tests`);

if (failed === 0) {
    console.log('🎉 All tests passed!');
} else {
    console.log('⚠️  Some tests failed.');
}
