import { QuestionEngine } from '../src/data/questions/index.js';

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    passed++;
    console.log(`  PASS  ${label}`);
  } else {
    failed++;
    console.error(`  FAIL  ${label}`);
  }
}

console.log('=== New Bank Validation (post-migration) ===\n');

console.log('--- Count ---');
const stats = QuestionEngine.getStatistics();
assert(stats.totalQuestions === 228, `Total: ${stats.totalQuestions} (expected 228)`);

console.log('\n--- Per-category count ---');
const expectedCounts = {
  matematica: 27,
  portugues: 28,
  animais: 28,
  espaco: 26,
  natureza: 27,
  dinossauros: 22,
  logica: 26,
  cores_e_formas: 22,
  conhecimentos_gerais: 22,
};

for (const [cat, expected] of Object.entries(expectedCounts)) {
  const actual = stats.byCategory[cat] || 0;
  assert(actual === expected, `${cat}: ${actual} (expected ${expected})`);
}

console.log('\n--- All questions accessible ---');
const allQ = QuestionEngine.selectMany({}, 228);
assert(allQ.length === 228, `All questions returned: ${allQ.length}`);

console.log('\n--- ID uniqueness ---');
const ids = allQ.map(q => q.id);
const uniqueIds = new Set(ids);
assert(uniqueIds.size === ids.length, `All IDs unique: ${uniqueIds.size}/${ids.length}`);

console.log('\n--- Schema completeness ---');
const requiredFields = ['id', 'category', 'subcategory', 'question', 'options', 'correctOption', 'explanation', 'level', 'tags', 'active'];
let schemaErrors = 0;
for (const q of allQ) {
  for (const field of requiredFields) {
    if (!(field in q)) {
      console.error(`  Missing field "${field}" in question ${q.id}`);
      schemaErrors++;
    }
  }
  if (!Array.isArray(q.options) || q.options.length < 2) {
    console.error(`  Invalid options in question ${q.id}`);
    schemaErrors++;
  }
  if (typeof q.correctOption !== 'number' || q.correctOption < 0 || q.correctOption >= q.options.length) {
    console.error(`  Invalid correctOption in question ${q.id}: ${q.correctOption}`);
    schemaErrors++;
  }
}
assert(schemaErrors === 0, `Schema errors: ${schemaErrors}`);

console.log('\n--- Level distribution ---');
for (const [level, count] of Object.entries(stats.byLevel)) {
  assert(count > 0, `Level ${level}: ${count} questions`);
}

console.log('\n========================================');
console.log(`Results: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('New bank validation passed!');
}
