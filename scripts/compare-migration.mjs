import { bancoQuestoes } from '../src/data/questions.js';
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

console.log('=== Migration Comparison: Legacy → New Bank ===\n');

// 1. Count comparison
console.log('--- Count ---');
const legacyCats = Object.keys(bancoQuestoes);
const legacyCounts = {};
let legacyTotal = 0;
for (const cat of legacyCats) {
  legacyCounts[cat] = bancoQuestoes[cat].length;
  legacyTotal += bancoQuestoes[cat].length;
}
assert(legacyTotal === 128, `Legacy total: ${legacyTotal} (expected 128)`);

const stats = QuestionEngine.getStatistics();
assert(stats.totalQuestions === 128, `New total: ${stats.totalQuestions} (expected 128)`);

// 2. Per-category count
console.log('\n--- Per-category count ---');
const categoryMap = {
  Matematica: 'matematica',
  Portugues: 'portugues',
  Animais: 'animais',
  Espaco: 'espaco',
  Natureza: 'natureza',
  Dinossauros: 'dinossauros',
  Logica: 'logica',
  CoresEFormas: 'cores_e_formas',
  ConhecimentosGerais: 'conhecimentos_gerais',
};

for (const [legacyCat, newCat] of Object.entries(categoryMap)) {
  const legacyCount = legacyCounts[legacyCat] || 0;
  const newCount = stats.byCategory[newCat] || 0;
  assert(legacyCount === newCount, `${legacyCat}: legacy=${legacyCount}, new=${newCount}`);
}

// 3. Content migration: match by question text
console.log('\n--- Content migration ---');
let migrated = 0;
let missing = 0;
let wrongAnswer = 0;
let wrongOptions = 0;

for (const [legacyCat, questions] of Object.entries(bancoQuestoes)) {
  for (const lq of questions) {
    // Find matching question in new bank by question text
    const allNew = QuestionEngine.selectMany({}, 200);
    const match = allNew.find(nq => nq.question === lq.pergunta);
    if (!match) {
      console.error(`  MISSING: "${lq.pergunta}" (${legacyCat})`);
      missing++;
      continue;
    }
    migrated++;

    // Verify correct answer matches
    const legacyAnswerIdx = lq.opcoes.indexOf(lq.resposta);
    if (match.correctOption !== legacyAnswerIdx) {
      console.error(`  WRONG ANSWER: "${lq.pergunta}" — legacy idx=${legacyAnswerIdx}, new idx=${match.correctOption}`);
      wrongAnswer++;
    }

    // Verify options match
    const optionsMatch = lq.opcoes.every((opt, i) => opt === match.options[i]);
    if (!optionsMatch) {
      console.error(`  WRONG OPTIONS: "${lq.pergunta}"`);
      console.error(`    legacy: ${JSON.stringify(lq.opcoes)}`);
      console.error(`    new:    ${JSON.stringify(match.options)}`);
      wrongOptions++;
    }
  }
}

assert(migrated === 128, `Questions migrated: ${migrated}/128`);
assert(missing === 0, `Missing questions: ${missing}`);
assert(wrongAnswer === 0, `Wrong answers: ${wrongAnswer}`);
assert(wrongOptions === 0, `Wrong options: ${wrongOptions}`);

// 4. All new IDs unique
console.log('\n--- ID uniqueness ---');
const allNew = QuestionEngine.selectMany({}, 200);
const ids = allNew.map(q => q.id);
const uniqueIds = new Set(ids);
assert(uniqueIds.size === ids.length, `All IDs unique: ${uniqueIds.size}/${ids.length}`);

// 5. Schema completeness
console.log('\n--- Schema completeness ---');
const requiredFields = ['id', 'category', 'subcategory', 'question', 'options', 'correctOption', 'explanation', 'level', 'tags', 'active'];
let schemaErrors = 0;
for (const q of allNew) {
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

console.log('\n========================================');
console.log(`Results: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('Migration comparison passed!');
}
