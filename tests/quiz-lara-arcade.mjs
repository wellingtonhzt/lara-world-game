import assert from 'node:assert/strict';
import fs from 'node:fs';

const STORE = new Map();
globalThis.localStorage = {
  getItem: key => (STORE.has(key) ? STORE.get(key) : null),
  setItem: (key, value) => STORE.set(key, String(value)),
  removeItem: key => STORE.delete(key)
};

import {
  getMinigame,
  getProfile,
  getEffectiveConfig,
  hasMinigame,
  hasProfile,
  listMinigames,
  normalizeMinigameResult
} from '../src/minigames/engine/index.js';
import { QuestionEngine } from '../src/data/questions/index.js';
import { getCategories, getCategoryLabel, hasCategory } from '../src/data/questions/category-catalog.js';
import {
  QUIZ_MODES,
  DEFAULT_MODE_ID,
  getMode,
  streakBonus,
  MIX_ALL_CATEGORY,
  SCORE_PER_CORRECT,
  STREAK_BONUS_CAP
} from '../src/minigames/quiz-lara/quiz-config.js';
import { pickQuizQuestions, QuizSession } from '../src/minigames/quiz-lara/quiz-session.js';
import { recordGame, getMinigameStats, loadStats } from '../src/arcade/arcade-stats.js';
import { renderStatsHtml } from '../src/arcade/arcade-card.js';
import '../src/minigames/meteoro/index.js';
import '../src/minigames/ocean-match3/index.js';
import '../src/minigames/dino-runner/index.js';
import '../src/minigames/memoria-floresta/index.js';
import '../src/minigames/ataque-dragoes/index.js';
import '../src/minigames/quiz-lara/index.js';

let passed = 0;
function test(name, fn) {
  fn();
  passed++;
  console.log(`  PASS  ${name}`);
}

function makeQuestion(id, category = 'matematica', correctOption = 0, level = 1) {
  return {
    id,
    category,
    subcategory: 'generica',
    question: `Pergunta ${id}?`,
    options: ['A', 'B', 'C'],
    correctOption,
    explanation: `Explicacao ${id}.`,
    level,
    tags: [],
    active: true
  };
}

function makeStubSource() {
  const calls = [];
  const pool = Array.from({ length: 40 }, (_, i) => makeQuestion(`q-${i}`, i < 20 ? 'matematica' : 'portugues'));
  return {
    calls,
    selectMany(context, amount) {
      calls.push({ context: { ...context }, amount });
      return pool.slice(0, Math.min(amount, pool.length));
    }
  };
}

function makeShortSource() {
  const calls = [];
  const pool = Array.from({ length: 3 }, (_, i) => makeQuestion(`s-${i}`, 'dinossauros'));
  return {
    calls,
    selectMany(context, amount) {
      calls.push({ context: { ...context }, amount });
      return pool.slice(0, Math.min(amount, pool.length));
    }
  };
}

function playSession(count, answers) {
  const mode = getMode(count === 5 ? 'rapido' : count === 10 ? 'normal' : 'desafio');
  const questions = Array.from({ length: count }, (_, i) => makeQuestion(`p-${i}`, 'matematica', 0));
  const session = new QuizSession({ questions, mode, category: 'matematica', categoryLabel: 'Matem\u00e1tica' });
  for (const index of answers) session.answer(index);
  return session;
}

console.log('\nQuiz Lara World - Config\n');

test('modos: 5 (Rapido), 10 (Normal padrao) e 15 (Desafio) perguntas', () => {
  assert.equal(getMode('rapido').questionCount, 5);
  assert.equal(getMode('rapido').minCorrect, 4);
  assert.equal(getMode('normal').questionCount, 10);
  assert.equal(getMode('normal').minCorrect, 7);
  assert.equal(getMode('desafio').questionCount, 15);
  assert.equal(getMode('desafio').minCorrect, 10);
  assert.equal(DEFAULT_MODE_ID, 'normal');
  assert.equal(QUIZ_MODES.length, 3);
});

test('getMode com id desconhecido faz fallback seguro para o modo normal', () => {
  assert.equal(getMode(undefined).id, 'normal');
  assert.equal(getMode('').id, 'normal');
  assert.equal(getMode('maratona').id, 'normal');
});

test('bonus de sequencia: 2=>20, 3=>30, 4=>40, crescendo com limite', () => {
  assert.equal(streakBonus(0), 0);
  assert.equal(streakBonus(1), 0);
  assert.equal(streakBonus(2), 20);
  assert.equal(streakBonus(3), 30);
  assert.equal(streakBonus(4), 40);
  assert.equal(streakBonus(10), 100);
  assert.equal(streakBonus(50), 100);
  assert.equal(streakBonus(STREAK_BONUS_CAP), 100);
  assert.equal(streakBonus(NaN), 0);
  assert.equal(streakBonus(-1), 0);
  assert.equal(SCORE_PER_CORRECT, 100);
});

console.log('\nQuiz Lara World - Categorias\n');

test('CategoryCatalog: 9 categorias com labels', () => {
  assert.equal(getCategories().length, 9);
  assert.equal(hasCategory('matematica'), true);
  assert.equal(hasCategory('nao-existe'), false);
  assert.equal(getCategoryLabel('matematica'), 'Matem\u00e1tica');
  assert.equal(getCategoryLabel('dinossauros'), 'Dinossauros');
});

console.log('\nQuiz Lara World - Selecao (source injetavel)\n');

test('pickQuizQuestions: modo rapido com categoria restringe o pool e respeita niveis 1-3', () => {
  const source = makeStubSource();
  const picked = pickQuizQuestions({ mode: 'rapido', category: 'matematica', source });
  assert.equal(picked.requestedCount, 5);
  assert.equal(picked.obtainedCount, 5);
  assert.equal(picked.fallbackUsado, false);
  assert.deepEqual(picked.questions.map(q => q.category), Array(5).fill('matematica'));
  assert.equal(source.calls.length, 1);
  assert.deepEqual(source.calls[0].context.levelRange, { min: 1, max: 3 });
  assert.deepEqual(source.calls[0].context.categoryWeights, { matematica: 1 });
});

test('pickQuizQuestions: "Misturar tudo" nao aplica categoryWeights', () => {
  const source = makeStubSource();
  const picked = pickQuizQuestions({ mode: 'normal', category: MIX_ALL_CATEGORY, source });
  assert.equal(picked.obtainedCount, 10);
  assert.equal(source.calls[0].context.categoryWeights, undefined);
});

test('pickQuizQuestions: defaults seguros usam modo normal e Misturar tudo', () => {
  const source = makeStubSource();
  const picked = pickQuizQuestions({ source });
  assert.equal(picked.mode.id, 'normal');
  assert.equal(picked.requestedCount, 10);
  assert.equal(picked.category, MIX_ALL_CATEGORY);
  assert.equal(source.calls[0].context.categoryWeights, undefined);
});

test('anti-repeticao: fallback reinicia o pool da PRÓPRIA categoria sem trocar de categoria', () => {
  const source = makeShortSource();
  const picked = pickQuizQuestions({ mode: 'desafio', category: 'dinossauros', source });
  assert.equal(picked.requestedCount, 15);
  assert.equal(picked.obtainedCount, 6);
  assert.equal(picked.fallbackUsado, true);
  assert.equal(source.calls.length, 2);
  assert.deepEqual(source.calls[0].context.categoryWeights, { dinossauros: 1 });
  assert.deepEqual(source.calls[1].context.categoryWeights, { dinossauros: 1 }, 'segunda passada mantem a mesma categoria');
  assert.deepEqual(source.calls[1].context.excludeIds, [], 'segunda passada reinicia o pool (sem exclusao)');
  for (const q of picked.questions) {
    assert.equal(q.category, 'dinossauros');
  }
});

test('integracao com QuestionEngine real: 15 unicas na categoria Dinossauros', () => {
  const picked = pickQuizQuestions({ mode: 'desafio', category: 'dinossauros', source: QuestionEngine });
  assert.equal(picked.obtainedCount, 15);
  assert.equal(picked.fallbackUsado, false);
  const ids = picked.questions.map(q => q.id);
  assert.equal(new Set(ids).size, 15);
  for (const q of picked.questions) {
    assert.equal(q.category, 'dinossauros');
    assert.ok(q.level >= 1 && q.level <= 3);
    assert.equal(q.active, true);
  }
});

test('integracao com QuestionEngine real: Misturar tudo retorna 10 unicas', () => {
  const picked = pickQuizQuestions({ mode: 'normal', category: MIX_ALL_CATEGORY, source: QuestionEngine });
  assert.equal(picked.obtainedCount, 10);
  assert.equal(picked.fallbackUsado, false);
  assert.equal(new Set(picked.questions.map(q => q.id)).size, 10);
});

console.log('\nQuiz Lara World - Sessao\n');

test('sessao: resposta errada nao pontua, nao perde pontos e zera sequencia', () => {
  const session = playSession(5, [1]);
  assert.equal(session.wrongCount, 1);
  assert.equal(session.correctCount, 0);
  assert.equal(session.score, 0);
  assert.equal(session.streak, 0);
  assert.equal(session.lastAnswer.correct, false);
  assert.equal(session.lastAnswer.correctIndex, 0);
});

test('sessao: sequencia soma bonus e score acumula corretamente', () => {
  const session = playSession(5, [0, 0, 0]);
  assert.equal(session.correctCount, 3);
  assert.equal(session.score, 100 + 100 + 20 + 100 + 30);
  assert.equal(session.bestStreak, 3);
  assert.equal(session.lastAnswer.bonus, 30);
});

test('sessao: resposta dupla na mesma pergunta e bloqueada (indice avanca)', () => {
  const questions = [makeQuestion('x', 'matematica', 0)];
  const session = new QuizSession({ questions, mode: getMode('rapido'), category: 'matematica', categoryLabel: 'Mat' });
  const first = session.answer(1);
  const second = session.answer(0);
  assert.equal(first.correct, false);
  assert.equal(session.correctCount, 0);
  assert.equal(second, null, 'segunda resposta nao pode pontuar');
  assert.equal(session.finished, true);
});

test('sessao: responder apos o fim retorna null', () => {
  const session = playSession(5, [0, 0, 0, 0, 0]);
  assert.equal(session.finished, true);
  assert.equal(session.currentQuestion, null);
  assert.equal(session.answer(0), null);
});

console.log('\nQuiz Lara World - Vitoria por quantidade de perguntas\n');

test('Rapido (5): vitoria com 4 acertos, derrota com 3', () => {
  const win = playSession(5, [0, 0, 0, 0, 1]);
  assert.equal(win.correctCount, 4);
  assert.equal(win.accuracy, 80);
  assert.equal(win.isVictory, true);
  const lose = playSession(5, [0, 0, 0, 1, 1]);
  assert.equal(lose.correctCount, 3);
  assert.equal(lose.isVictory, false);
});

test('Normal (10): vitoria com 7 acertos, derrota com 6', () => {
  const win = playSession(10, [0, 0, 0, 0, 0, 0, 0, 1, 1, 1]);
  assert.equal(win.correctCount, 7);
  assert.equal(win.accuracy, 70);
  assert.equal(win.isVictory, true);
  const lose = playSession(10, [0, 0, 0, 0, 0, 0, 1, 1, 1, 1]);
  assert.equal(lose.correctCount, 6);
  assert.equal(lose.isVictory, false);
});

test('Desafio (15): vitoria com 10 acertos, derrota com 9', () => {
  const win = playSession(15, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1]);
  assert.equal(win.correctCount, 10);
  assert.equal(win.isVictory, true);
  const lose = playSession(15, [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1]);
  assert.equal(lose.correctCount, 9);
  assert.equal(lose.isVictory, false);
});

test('buildResult: resultado normalizado com boardDelta 0 e stats completos', () => {
  const session = playSession(10, [0, 0, 0, 0, 0, 0, 0, 1, 1, 1]);
  const result = session.buildResult();
  const normalized = normalizeMinigameResult(result);
  assert.equal(normalized.venceu, true);
  assert.equal(normalized.boardDelta, 0);
  assert.deepEqual(normalized.progresso, { atual: 7, objetivo: 7 });
  assert.equal(normalized.motivo, 'quiz-completo');
  assert.equal(normalized.stats.score, session.score);
  assert.equal(normalized.stats.correctAnswers, 7);
  assert.equal(normalized.stats.wrongAnswers, 3);
  assert.equal(normalized.stats.accuracy, 70);
  assert.equal(normalized.stats.bestStreak, 7);
  assert.equal(normalized.stats.totalQuestions, 10);
  assert.equal(normalized.stats.category, 'Matem\u00e1tica');
  assert.equal(normalized.stats.mode, 'Normal');
});

test('buildResult: derrota com motivo e progresso zerado em relacao a meta', () => {
  const session = playSession(5, [0, 0, 0, 1, 1]);
  const result = normalizeMinigameResult(session.buildResult());
  assert.equal(result.venceu, false);
  assert.equal(result.motivo, 'quiz-nao-concluido');
  assert.deepEqual(result.progresso, { atual: 3, objetivo: 4 });
  assert.equal(result.boardDelta, 0);
});

console.log('\nQuiz Lara World - Registro e Recordes\n');

test('recordGame registra partida, vitoria e recordes numericos', () => {
  STORE.clear();
  const session = playSession(10, [0, 0, 0, 0, 0, 0, 0, 1, 1, 1]);
  const result = session.buildResult();
  recordGame('quiz-lara', result, 60000);
  const mg = getMinigameStats('quiz-lara');
  assert.equal(mg.partidas, 1);
  assert.equal(mg.vitorias, 1);
  assert.equal(mg.sequenciaAtual, 1);
  assert.equal(mg.sequenciaMaxima, 1);
  assert.equal(mg.records.score, session.score);
  assert.equal(mg.records.accuracy, 70);
  assert.equal(mg.records.bestStreak, 7);
  assert.equal(mg.records.correctAnswers, 7);
  assert.equal(mg.records.totalQuestions, 10);
});

test('recordGame nao diminui recordes existentes e conta derrota', () => {
  STORE.clear();
  const win = playSession(10, [0, 0, 0, 0, 0, 0, 0, 1, 1, 1]).buildResult();
  const lose = playSession(10, [0, 0, 0, 1, 1, 1, 1, 1, 1, 1]).buildResult();
  recordGame('quiz-lara', win, 60000);
  recordGame('quiz-lara', lose, 60000);
  const mg = getMinigameStats('quiz-lara');
  assert.equal(mg.partidas, 2);
  assert.equal(mg.vitorias, 1);
  assert.equal(mg.derrotas, 1);
  assert.equal(mg.sequenciaAtual, 0);
  assert.equal(mg.records.score, win.stats.score, 'recordes nao caem com derrota');
});

test('card da galeria: partidas + 3 metricas principais do Quiz', () => {
  const html = renderStatsHtml({ partidas: 3, records: { score: 500, accuracy: 80, bestStreak: 6 } }, 'quiz-lara');
  assert.ok(html.includes('3 partidas'));
  assert.ok(html.includes('500 pts'));
  assert.ok(html.includes('80% de acerto'));
  assert.ok(html.includes('6 de sequ\u00eancia'));
});

console.log('\nQuiz Lara World - Registro e Perfil Arcade\n');

test('quiz-lara registrado e presente em listMinigames', () => {
  assert.equal(hasMinigame('quiz-lara'), true);
  assert.ok(listMinigames().includes('quiz-lara'));
  assert.ok(Object.isFrozen(getMinigame('quiz-lara')));
});

test('perfil arcade exclusivo: sem profiles.board e com fallback vazio', () => {
  assert.equal(hasProfile('quiz-lara', 'arcade'), true);
  assert.equal(hasProfile('quiz-lara', 'board'), false);
  assert.equal(getProfile('quiz-lara', 'board'), null);
});

test('perfil arcade: modos, vitoria, score, presentation e resultStats', () => {
  const profile = getProfile('quiz-lara', 'arcade');
  assert.equal(profile.hasTimeLimit, false);
  assert.equal(profile.modes.length, 3);
  assert.deepEqual(profile.victory, { rapido: 4, normal: 7, desafio: 10 });
  assert.equal(profile.score.perCorrect, 100);
  const keys = profile.resultStats.map(item => item.key);
  assert.ok(keys.includes('score'));
  assert.ok(keys.includes('accuracy'));
  assert.ok(keys.includes('bestStreak'));
  assert.equal(profile.presentation.title, 'Quiz Lara World Arcade');
});

test('getEffectiveConfig(arcade): herda comportamento e usa presentation/rewards proprios', () => {
  const effective = getEffectiveConfig('quiz-lara', 'arcade');
  assert.equal(effective.botSuccessRate, 0.5);
  assert.equal(effective.autoReturnSeconds, 5);
  assert.deepEqual(effective.rewards, { successBoardDelta: 0, failureBoardDelta: 0 });
  assert.equal(effective.presentation.title, 'Quiz Lara World Arcade');
  assert.equal(effective.resultStats.length, 3);
  assert.ok(effective.resultStats.some(item => item.key === 'score'));
});

test('Board e demais minigames permanecem intactos', () => {
  assert.equal(hasProfile('ocean-match3', 'board'), true);
  assert.deepEqual(getMinigame('ocean-match3').rewards, { successBoardDelta: 3, failureBoardDelta: 0 });
  assert.deepEqual(getEffectiveConfig('dino-runner', 'board').rewards, { successBoardDelta: 3, failureBoardDelta: 0 });
  assert.equal(getMinigame('ocean-match3').profiles.board.botSuccessRate, 0.60);
});

test('quiz-lara isolado: recordGame nao toca em outros jogos do Arcade', () => {
  STORE.clear();
  recordGame('quiz-lara', playSession(5, [0, 0, 0, 0, 1]).buildResult(), 30000);
  const stats = loadStats();
  assert.deepEqual(Object.keys(stats.games).sort(), ['quiz-lara']);
  assert.equal(getMinigameStats('meteor-game').partidas, 0);
});

console.log('\nQuiz Lara World - Acessibilidade e Responsividade\n');

test('quiz-lara.css cobre prefers-reduced-motion, safe-area e mobile', () => {
  const css = fs.readFileSync(new URL('../src/minigames/quiz-lara/quiz-lara.css', import.meta.url), 'utf8');
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /env\(safe-area-inset-bottom\)/);
  assert.match(css, /@media \(max-width: 768px\)/);
  assert.match(css, /@media \(max-height: 520px\)/);
});

test('QuizLaraGame usa aria-live, foco e sons do AudioManager', () => {
  const js = fs.readFileSync(new URL('../src/minigames/quiz-lara/QuizLaraGame.js', import.meta.url), 'utf8');
  assert.match(js, /aria-live/);
  assert.match(js, /\.focus\(/);
  assert.match(js, /challengeOpen/);
  assert.match(js, /correctAnswer/);
  assert.match(js, /wrongAnswer/);
  assert.match(js, /buttonClick/);
});

console.log(`\n${passed} testes passaram`);
