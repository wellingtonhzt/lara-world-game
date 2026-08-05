import { QuestionEngine } from '../src/data/questions/index.js';
import { select as selectFromPool } from '../src/data/questions/question-selector.js';
import { normalizeQuestionText, validateBank, validateQuestion } from '../src/data/questions/question-validator.js';
import { florestaEncantada } from '../src/worlds/floresta/config.js';
import { valeDosDinossauros } from '../src/worlds/dinossauros/config.js';
import { galaxiaEstelar } from '../src/worlds/galaxia/config.js';
import { reinoOceanos } from '../src/worlds/oceanos/config.js';
import { casteloDosDragoes } from '../src/worlds/castelo/config.js';
import { register as registerWorld, InvalidWorldConfigError } from '../src/engine/world-registry.js';

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

console.log('=== Question Engine — Sprint 2 Validation ===\n');

// --- Bank ---
console.log('--- Bank ---');
const stats = QuestionEngine.getStatistics();
assert(stats.totalQuestions === 228, `Total questions: ${stats.totalQuestions} (expected 228)`);
assert(stats.activeQuestions === 228, `Active questions: ${stats.activeQuestions} (expected 228)`);

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
assert(validation.stats.total === 228, `Validation total: ${validation.stats.total}`);
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
assert(statsCheck.totalQuestions === 228, `getStatistics().totalQuestions`);
assert(typeof statsCheck.byCategory === 'object', `getStatistics().byCategory is object`);
assert(typeof statsCheck.byLevel === 'object', `getStatistics().byLevel is object`);

console.log('\n--- Level distribution ---');
const allNew = QuestionEngine.selectMany({}, 228);
const ORIGINAL_IDS = new Set([
  'mat-adicao-001','mat-subtracao-001','mat-adicao-002','mat-subtracao-002','mat-multiplicacao-001','mat-adicao-003','mat-adicao-004','mat-subtracao-003','mat-adicao-005','mat-subtracao-004','mat-adicao-006','mat-subtracao-005','mat-operacoes-001','mat-divisao-001','mat-multiplicacao-002',
  'por-alfabeto-001','por-alfabeto-002','por-palavras-001','por-frases-001','por-alfabeto-003','por-palavras-002','por-alfabeto-004','por-alfabeto-005','por-silabas-001','por-palavras-003','por-alfabeto-006','por-palavras-004','por-palavras-005','por-alfabeto-007','por-palavras-006','por-palavras-007','por-alfabeto-008',
  'ani-sons-001','ani-caracteristicas-001','ani-habitats-001','ani-caracteristicas-002','ani-sons-002','ani-caracteristicas-003','ani-habitats-002','ani-geral-001','ani-caracteristicas-004','ani-caracteristicas-005','ani-classificacao-001','ani-habitats-003','ani-caracteristicas-006','ani-geral-002','ani-sons-003','ani-habitats-004','ani-caracteristicas-007',
  'esp-planetas-001','esp-estrelas-001','esp-planetas-002','esp-satelites-001','esp-planetas-003','esp-planetas-004','esp-estrelas-002','esp-exploracao-001','esp-planetas-005','esp-estrelas-003','esp-planetas-006','esp-galaxias-001','esp-galaxias-002','esp-planetas-007','esp-exploracao-002','esp-universo-001',
  'nat-cores-001','nat-plantas-001','nat-estacoes-001','nat-habitats-001','nat-animais-001','nat-estados-001','nat-plantas-002','nat-clima-001','nat-plantas-003','nat-geografia-001','nat-animais-002','nat-clima-002','nat-geografia-002','nat-animais-003','nat-clima-003',
  'din-tipos-001','din-tipos-002','din-tipos-003','din-historia-001','din-tipos-004','din-tipos-005','din-tipos-006','din-historia-002','din-tipos-007','din-historia-003','din-alimentacao-001','din-tipos-008',
  'log-operacoes-001','log-sequencias-001','log-formas-001','log-raciocinio-001','log-comparacao-001','log-contagem-001','log-operacoes-002','log-raciocinio-002','log-opostos-001','log-contagem-002','log-sequencias-002','log-sequencias-003',
  'cef-cores-001','cef-formas-001','cef-mistura-001','cef-cores-002','cef-formas-002','cef-cores-003','cef-formas-003','cef-cores-004','cef-formas-004','cef-mistura-002','cef-formas-005','cef-cores-005',
  'cge-brasil-001','cge-brasil-002','cge-cultura-001','cge-tempo-001','cge-esportes-001','cge-objetos-001','cge-cultura-002','cge-tempo-002','cge-objetos-002','cge-objetos-003','cge-animais-001','cge-tempo-003',
]);
const newQuestions = allNew.filter(q => !ORIGINAL_IDS.has(q.id));
assert(newQuestions.length === 100, `Exactly 100 new questions identified (${newQuestions.length})`);
const newByLevel = { 1: 0, 2: 0, 3: 0 };
for (const q of newQuestions) newByLevel[q.level]++;
assert(newByLevel[1] >= 10 && newByLevel[1] <= 15, `New questions L1: ${newByLevel[1]} (target 10-15)`);
assert(newByLevel[2] >= 40 && newByLevel[2] <= 45, `New questions L2: ${newByLevel[2]} (target 40-45)`);
assert(newByLevel[3] >= 40 && newByLevel[3] <= 45, `New questions L3: ${newByLevel[3]} (target 40-45)`);
const perCatLevel = {};
for (const q of newQuestions) {
  if (!perCatLevel[q.category]) perCatLevel[q.category] = { 1: 0, 2: 0, 3: 0 };
  perCatLevel[q.category][q.level]++;
}
for (const [cat, counts] of Object.entries(perCatLevel)) {
  assert(counts[2] >= 1 && counts[3] >= 1, `${cat}: has at least one L2 and one L3 (${JSON.stringify(counts)})`);
}

console.log('\n--- Isolation check ---');
assert(typeof QuestionEngine.select === 'function', 'select is a function');
assert(typeof QuestionEngine.selectMany === 'function', 'selectMany is a function');
assert(typeof QuestionEngine.findById === 'function', 'findById is a function');
assert(typeof QuestionEngine.getCategories === 'function', 'getCategories is a function');
assert(typeof QuestionEngine.getSubcategories === 'function', 'getSubcategories is a function');
assert(typeof QuestionEngine.validate === 'function', 'validate is a function');
assert(typeof QuestionEngine.getStatistics === 'function', 'getStatistics is a function');

console.log('\n--- Edge cases: weight handling ---');
// Invalid or non-positive-only weights fall back to the unweighted active pool.
const weightZero = QuestionEngine.select({ categoryWeights: { matematica: 0 } });
assert(weightZero !== null, 'Weight 0 falls back to active pool');

// Negative weight treated as 0
const negWeight = QuestionEngine.select({ categoryWeights: { matematica: -5 } });
assert(negWeight !== null, 'Negative-only weight falls back to active pool');

// NaN weight treated as 0
const nanWeight = QuestionEngine.select({ categoryWeights: { matematica: NaN } });
assert(nanWeight !== null, 'NaN-only weight falls back to active pool');

// String weight treated as 0
const strWeight = QuestionEngine.select({ categoryWeights: { matematica: 'invalid' } });
assert(strWeight !== null, 'String-only weight falls back to active pool');

// Infinity weight — filtered out, falls back to unweighted pool
const infWeight = QuestionEngine.select({ categoryWeights: { matematica: Infinity } });
assert(infWeight !== null, 'Infinity weight falls back to unweighted pool');

console.log('\n--- Edge cases: filters ---');
// Exclude all IDs from a category
const statsCats = QuestionEngine.getStatistics();
const animaisCount = statsCats.byCategory.animais;
const allAnimais = QuestionEngine.selectMany({ categoryWeights: { animais: 100 } }, animaisCount);
const allAnimaisIds = allAnimais.map(q => q.id);
assert(allAnimaisIds.length === animaisCount, `Collected all ${animaisCount} animais questions (got ${allAnimaisIds.length})`);
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
assert(emptyValidation.stats.total === 228, 'Validator reports correct total');
assert(emptyValidation.stats.withErrors === 0, 'No questions with errors');

const validFixture = {
  id: 'mat-adicao-999', category: 'matematica', subcategory: 'adicao',
  question: 'Quanto é 1 + 2?', options: ['2', '3', '4'], correctOption: 1,
  explanation: 'Um mais dois é igual a três.', level: 1, tags: ['adicao'], active: true,
};
assert(validateQuestion(validFixture).errors.length === 0, 'Validator accepts valid level 1-3 question');
assert(validateQuestion({ ...validFixture, level: 4 }).errors.some(e => e.includes('1-3')), 'Validator rejects level outside 1-3');
assert(validateQuestion({ ...validFixture, active: 'yes' }).errors.some(e => e.includes('active')), 'Validator rejects non-boolean active');
assert(validateQuestion({ ...validFixture, category: 'inexistente' }).errors.some(e => e.includes('category')), 'Validator rejects invalid category');
assert(validateQuestion({ ...validFixture, subcategory: 'inexistente' }).errors.some(e => e.includes('subcategory')), 'Validator rejects invalid subcategory');
assert(validateQuestion({ ...validFixture, options: ['Ação', 'acao', 'Outra'] }).errors.some(e => e.includes('duplicada')), 'Validator rejects normalized duplicate options');
assert(validateQuestion({ ...validFixture, correctOption: 8 }).errors.some(e => e.includes('correctOption')), 'Validator rejects out-of-range correctOption');
assert(validateQuestion({ ...validFixture, question: '   ' }).errors.some(e => e.includes('question')), 'Validator rejects empty question text');
assert(normalizeQuestionText('  AÇÃO?!  simples ') === 'acao simples', 'Text normalization removes accents, punctuation and extra spaces');
const duplicateBank = validateBank([validFixture, { ...validFixture }]);
assert(duplicateBank.errors.some(e => e.includes('id duplicado')), 'Validator rejects duplicate IDs');
assert(validateBank(null).valid === false, 'Validator safely rejects non-array bank');

console.log('\n--- Inactive questions ---');
const inactiveFixture = { ...validFixture, id: 'mat-adicao-998', active: false };
const inactivePick = selectFromPool([inactiveFixture], {});
assert(inactivePick === null, 'Selector never returns inactive question');
const activePick = selectFromPool([inactiveFixture, validFixture], {});
assert(activePick?.id === validFixture.id, 'Selector returns active question when inactive item is present');

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

console.log('\n--- Integration: Real World Policies ---');
const realWorldConfigs = [florestaEncantada, valeDosDinossauros, galaxiaEstelar, reinoOceanos, casteloDosDragoes];

for (const worldConfig of realWorldConfigs) {
  const worldId = worldConfig.id;
  const { categoryWeights: weights, levelRange } = worldConfig.questionPolicy;
  const cats = Object.keys(weights);
  for (const cat of cats) {
    const exists = QuestionEngine.getCategories().includes(cat);
    assert(exists, `${worldId}: category "${cat}" exists`);
  }
  assert(levelRange.min >= 1 && levelRange.max <= 3, `${worldId}: levelRange stays within 1-3`);
  const ctx = { categoryWeights: weights, levelRange };
  const q = QuestionEngine.select(ctx);
  assert(q !== null, `${worldId}: returns a question`);
  if (q) {
    assert(cats.includes(q.category), `${worldId}: category "${q.category}" is in policy`);
  }
}

const invalidPolicyConfig = structuredClone(florestaEncantada);
invalidPolicyConfig.id = 'test-invalid-question-policy';
invalidPolicyConfig.questionPolicy.categoryWeights = { categoria_inexistente: 100 };
let invalidPolicyRejected = false;
try {
  registerWorld(invalidPolicyConfig);
} catch (error) {
  invalidPolicyRejected = error instanceof InvalidWorldConfigError;
}
assert(invalidPolicyRejected, 'WorldRegistry rejects unregistered question category');

console.log('\n--- Integration: Anti-repetition ---');
const antiRepCtx = { categoryWeights: { matematica: 100 }, levelRange: { min: 1, max: 3 } };
const seen = new Set();
for (let i = 0; i < 10; i++) {
  const q = QuestionEngine.select({ ...antiRepCtx, excludeIds: [...seen] });
  if (q) {
    assert(!seen.has(q.id), `Anti-repetition: question ${q.id} not repeated`);
    seen.add(q.id);
  }
}
assert(seen.size > 0, 'Anti-repetition: collected questions');

console.log('\n--- Integration: Pool reset ---');
const tinyPool = [validFixture, { ...validFixture, id: 'mat-adicao-997', question: 'Quanto é 2 + 2?', options: ['3', '4', '5'] }];
const usedTinyIds = new Set(tinyPool.map(q => q.id));
let resetPick = selectFromPool(tinyPool, { excludeIds: [...usedTinyIds] });
assert(resetPick === null, 'Exhausted compatible pool returns null before reset');
usedTinyIds.clear();
resetPick = selectFromPool(tinyPool, { excludeIds: [...usedTinyIds] });
assert(resetPick !== null, 'Clearing used IDs restores the compatible pool');

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
