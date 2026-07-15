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

console.log('=== Question Engine — Sprint 1 Validation ===\n');

// --- Bank ---
console.log('--- Bank ---');
const stats = QuestionEngine.getStatistics();
assert(stats.totalQuestions === 128, `Total questions: ${stats.totalQuestions} (expected 128)`);
assert(stats.activeQuestions === 128, `Active questions: ${stats.activeQuestions} (expected 128)`);

console.log('\n--- Categories ---');
const categories = QuestionEngine.getCategories();
assert(categories.length === 9, `Categories count: ${categories.length} (expected 9)`);

const expectedCats = ['matematica', 'portugues', 'animais', 'espaco', 'natureza', 'dinossauros', 'logica', 'cores_e_formas', 'conhecimentos_gerais'];
for (const cat of expectedCats) {
  assert(categories.includes(cat), `Category "${cat}" exists`);
}

console.log('\n--- Subcategories ---');
const matSubs = QuestionEngine.getSubcategories('matematica');
assert(matSubs.length > 0, `matematica has subcategories (${matSubs.length})`);

const invalidSubs = QuestionEngine.getSubcategories('invalid_category');
assert(invalidSubs.length === 0, `invalid category returns empty subcategories`);

console.log('\n--- Validation ---');
const validation = QuestionEngine.validate();
assert(validation.valid === true, `Bank is valid: ${validation.valid}`);
assert(validation.errors.length === 0, `No errors (found ${validation.errors.length})`);
assert(validation.stats.total === 128, `Validation total: ${validation.stats.total}`);
assert(validation.stats.withErrors === 0, `No questions with errors: ${validation.stats.withErrors}`);

if (validation.warnings.length > 0) {
  console.log(`\n  Warnings (${validation.warnings.length}):`);
  for (const w of validation.warnings.slice(0, 10)) {
    console.log(`    - ${w}`);
  }
  if (validation.warnings.length > 10) {
    console.log(`    ... and ${validation.warnings.length - 10} more`);
  }
}

console.log('\n--- Repository ---');
const byId = QuestionEngine.findById('mat-adicao-001');
assert(byId !== null, `findById("mat-adicao-001") found`);
assert(byId?.category === 'matematica', `Category is matematica`);

const notFound = QuestionEngine.findById('nonexistent-id');
assert(notFound === null, `findById("nonexistent-id") returns null`);

console.log('\n--- Selector: select() ---');
const ctx1 = {
  categoryWeights: { matematica: 100 },
  levelRange: { min: 1, max: 1 },
};
const picked1 = QuestionEngine.select(ctx1);
assert(picked1 !== null, `select() returns a question`);
assert(picked1?.category === 'matematica', `select() respects categoryWeights`);
assert(picked1?.level === 1, `select() respects levelRange`);
assert(picked1?.active === true, `select() returns active question`);

const ctx2 = { levelRange: { min: 99, max: 99 } };
const picked2 = QuestionEngine.select(ctx2);
assert(picked2 === null, `select() returns null when no match`);

console.log('\n--- Selector: selectMany() ---');
const pickedMany = QuestionEngine.selectMany({ categoryWeights: { animais: 100 }, levelRange: { min: 1, max: 1 } }, 5);
assert(pickedMany.length === 5, `selectMany(5) returns 5 questions`);
const ids = pickedMany.map(q => q.id);
const uniqueIds = new Set(ids);
assert(uniqueIds.size === 5, `selectMany() returns unique questions`);

const pickedZero = QuestionEngine.selectMany({}, 0);
assert(pickedZero.length === 0, `selectMany(0) returns empty array`);

const pickedNegative = QuestionEngine.selectMany({}, -1);
assert(pickedNegative.length === 0, `selectMany(-1) returns empty array`);

console.log('\n--- Selector: excludeIds ---');
const first = QuestionEngine.select({ categoryWeights: { logica: 100 } });
assert(first !== null, 'Got a logica question');
const excluded = QuestionEngine.select({ categoryWeights: { logica: 100 }, excludeIds: [first.id] });
assert(excluded !== null, 'Got another logica question');
assert(excluded.id !== first.id, `excludeIds works: ${excluded.id} !== ${first.id}`);

console.log('\n--- Selector: tags ---');
const tagCtx = { tags: ['adicao'] };
const tagPick = QuestionEngine.select(tagCtx);
assert(tagPick !== null, 'select with tags returns a question');
assert(tagPick?.tags?.includes('adicao'), `Tag filter works: ${tagPick?.tags}`);

console.log('\n--- Selector: subcategories ---');
const subCtx = { subcategories: ['adicao'] };
const subPick = QuestionEngine.select(subCtx);
assert(subPick !== null, 'select with subcategories returns a question');
assert(subPick?.subcategory === 'adicao', `Subcategory filter works: ${subPick?.subcategory}`);

console.log('\n--- Statistics ---');
const statsCheck = QuestionEngine.getStatistics();
assert(statsCheck.totalQuestions === 128, `getStatistics().totalQuestions`);
assert(typeof statsCheck.byCategory === 'object', `getStatistics().byCategory is object`);
assert(typeof statsCheck.byLevel === 'object', `getStatistics().byLevel is object`);

console.log('\n--- Isolation check ---');
assert(typeof QuestionEngine.select === 'function', 'select is a function');
assert(typeof QuestionEngine.selectMany === 'function', 'selectMany is a function');
assert(typeof QuestionEngine.findById === 'function', 'findById is a function');
assert(typeof QuestionEngine.getCategories === 'function', 'getCategories is a function');
assert(typeof QuestionEngine.getSubcategories === 'function', 'getSubcategories is a function');
assert(typeof QuestionEngine.validate === 'function', 'validate is a function');
assert(typeof QuestionEngine.getStatistics === 'function', 'getStatistics is a function');

console.log('\n--- Edge cases: weight handling ---');
// Weight 0 should exclude category
const weightZero = QuestionEngine.select({ categoryWeights: { matematica: 0 } });
assert(weightZero === null || weightZero.category !== 'matematica', 'Weight 0 excludes category');

// Negative weight treated as 0
const negWeight = QuestionEngine.select({ categoryWeights: { matematica: -5 } });
assert(negWeight === null || negWeight.category !== 'matematica', 'Negative weight excluded');

// NaN weight treated as 0
const nanWeight = QuestionEngine.select({ categoryWeights: { matematica: NaN } });
assert(nanWeight === null || nanWeight.category !== 'matematica', 'NaN weight excluded');

// String weight treated as 0
const strWeight = QuestionEngine.select({ categoryWeights: { matematica: 'invalid' } });
assert(strWeight === null || strWeight.category !== 'matematica', 'String weight excluded');

// Infinity weight — filtered out, falls back to unweighted pool
const infWeight = QuestionEngine.select({ categoryWeights: { matematica: Infinity } });
assert(infWeight !== null, 'Infinity weight falls back to unweighted pool');

console.log('\n--- Edge cases: filters ---');
// Exclude all IDs from a category
const allAnimais = QuestionEngine.selectMany({ categoryWeights: { animais: 100 } }, 20);
const allAnimaisIds = allAnimais.map(q => q.id);
const excludedAll = QuestionEngine.select({ categoryWeights: { animais: 100 }, excludeIds: allAnimaisIds });
assert(excludedAll === null, 'Excluding all questions returns null');

// Empty tags array
const emptyTags = QuestionEngine.select({ tags: [] });
assert(emptyTags !== null, 'Empty tags array returns a question');

// Non-matching tags
const nonMatchTags = QuestionEngine.select({ tags: ['nonexistent_tag_xyz'] });
assert(nonMatchTags === null, 'Non-matching tags returns null');

// Empty subcategories array
const emptySubs = QuestionEngine.select({ subcategories: [] });
assert(emptySubs !== null, 'Empty subcategories array returns a question');

// Non-matching subcategories
const nonMatchSubs = QuestionEngine.select({ subcategories: ['nonexistent_sub_xyz'] });
assert(nonMatchSubs === null, 'Non-matching subcategories returns null');

console.log('\n--- Edge cases: selectMany ---');
// Request more than available
const available = QuestionEngine.getStatistics().totalQuestions;
const requestMore = QuestionEngine.selectMany({}, available + 10);
assert(requestMore.length === available, `Requesting more than available: ${requestMore.length}/${available}`);

// selectMany with NaN amount
const nanAmount = QuestionEngine.selectMany({}, NaN);
assert(nanAmount.length === 0, 'NaN amount returns empty');

// selectMany with Infinity amount
const infAmount = QuestionEngine.selectMany({}, Infinity);
assert(infAmount.length === 0, 'Infinity amount returns empty');

// selectMany with undefined amount (defaults to 1)
const undefAmount = QuestionEngine.selectMany({}, undefined);
assert(undefAmount.length === 1, 'undefined amount defaults to 1');

console.log('\n--- Edge cases: context validation ---');
// Null context
const nullCtx = QuestionEngine.select(null);
assert(nullCtx !== null, 'null context returns a question');

// Undefined context
const undefCtx = QuestionEngine.select(undefined);
assert(undefCtx !== null, 'undefined context returns a question');

// Empty object context
const emptyCtx = QuestionEngine.select({});
assert(emptyCtx !== null, 'empty context returns a question');

console.log('\n--- Validator edge cases ---');
const emptyValidation = QuestionEngine.validate();
assert(emptyValidation.stats.total === 128, 'Validator reports correct total');
assert(emptyValidation.stats.withErrors === 0, 'No questions with errors');

console.log('\n--- Mutation safety ---');
const q1 = QuestionEngine.findById('mat-adicao-001');
if (q1) {
  q1.question = 'MUTATED';
  q1.correctOption = 999;
  q1.options = ['HACKED'];
  q1.tags = ['MUTATED'];
  const q2 = QuestionEngine.findById('mat-adicao-001');
  assert(q2.question !== 'MUTATED', 'findById mutation does not corrupt bank');
  assert(q2.correctOption !== 999, 'findById correctOption mutation does not corrupt bank');
  assert(q2.options.length !== 1, 'findById options mutation does not corrupt bank');
  assert(q2.tags[0] !== 'MUTATED', 'findById tags mutation does not corrupt bank');
}

const allQ = QuestionEngine.selectMany({}, 1);
if (allQ.length > 0) {
  allQ[0].question = 'MUTATED';
  const check = QuestionEngine.findById(allQ[0].id);
  assert(check.question !== 'MUTATED', 'selectMany mutation does not corrupt bank');
}

console.log('\n--- Integration: World Policies ---');
const worldPolicies = {
  'floresta-encantada': { animais: 30, natureza: 25, cores_e_formas: 15, logica: 10, matematica: 10, portugues: 10 },
  'dinossauros': { dinossauros: 35, natureza: 25, animais: 20, matematica: 10, portugues: 10 },
  'galaxia-estelar': { espaco: 40, logica: 20, conhecimentos_gerais: 20, matematica: 10, natureza: 10 },
  'reino-oceanos': { natureza: 30, animais: 25, conhecimentos_gerais: 15, matematica: 15, portugues: 15 },
  'castelo-dragoes': { logica: 30, conhecimentos_gerais: 25, matematica: 20, portugues: 15, dinossauros: 10 },
};

for (const [worldId, weights] of Object.entries(worldPolicies)) {
  const cats = Object.keys(weights);
  for (const cat of cats) {
    const exists = QuestionEngine.getCategories().includes(cat);
    assert(exists, `${worldId}: category "${cat}" exists`);
  }
  const ctx = { categoryWeights: weights, levelRange: { min: 1, max: 3 } };
  const q = QuestionEngine.select(ctx);
  assert(q !== null, `${worldId}: returns a question`);
  if (q) {
    assert(cats.includes(q.category), `${worldId}: category "${q.category}" is in policy`);
  }
}

console.log('\n--- Integration: Anti-repetition ---');
const antiRepCtx = { categoryWeights: { matematica: 100 }, levelRange: { min: 1, max: 5 } };
const seen = new Set();
for (let i = 0; i < 10; i++) {
  const q = QuestionEngine.select({ ...antiRepCtx, excludeIds: [...seen] });
  if (q) {
    assert(!seen.has(q.id), `Anti-repetition: question ${q.id} not repeated`);
    seen.add(q.id);
  }
}
assert(seen.size > 0, 'Anti-repetition: collected questions');

console.log('\n--- Integration: Fallback ---');
const fallbackQ = QuestionEngine.select({ categoryWeights: {}, excludeIds: ['all-ids-excluded-12345'] });
assert(fallbackQ !== null, 'Fallback: returns question when context has no valid weights');

console.log('\n--- Integration: Bot behavior ---');
const botQ = QuestionEngine.select({ categoryWeights: { logica: 100 } });
if (botQ) {
  const correctIdx = botQ.correctOption;
  const wrongIndices = botQ.options.map((_, i) => i).filter(i => i !== correctIdx);
  assert(wrongIndices.length > 0, 'Bot: wrong alternatives exist');
  assert(!wrongIndices.includes(correctIdx), 'Bot: wrong alternatives exclude correctOption');
}

console.log('\n--- Integration: Null question safety ---');
const nullSafety = QuestionEngine.select({ levelRange: { min: 99, max: 99 } });
assert(nullSafety === null, 'Null question: returns null for impossible constraints');

console.log('\n========================================');
console.log(`Results: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('All tests passed!');
}
