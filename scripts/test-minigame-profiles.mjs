import assert from 'node:assert/strict';
import {
  registerMinigame,
  getMinigame,
  hasMinigame,
  listMinigames,
  MinigameNotFoundError,
  getProfile,
  getEffectiveConfig,
  hasProfile,
  normalizeContext,
  DEFAULT_BOT_RATE,
  DEFAULT_AUTO_RETURN_SECONDS
} from '../src/minigames/engine/index.js';

import '../src/minigames/meteoro/index.js';
import '../src/minigames/ocean-match3/index.js';
import '../src/minigames/dino-runner/index.js';
import '../src/minigames/memoria-floresta/index.js';
import '../src/minigames/ataque-dragoes/index.js';

const MODERN_IDS = [
  'meteor-game',
  'ocean-match3',
  'dino-runner',
  'memory-forest',
  'ataque-dragoes'
];

const EXPECTED_BOT_RATE = {
  'meteor-game': 0.40,
  'ocean-match3': 0.60,
  'dino-runner': 0.40,
  'memory-forest': 0.65,
  'ataque-dragoes': 0.55
};

let passed = 0;
function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`ok - ${name}`);
  } catch (err) {
    console.error(`FAIL - ${name}`);
    throw err;
  }
}

test('normalizeContext: default e valores invalidos viram board', () => {
  assert.equal(normalizeContext(undefined), 'board');
  assert.equal(normalizeContext(''), 'board');
  assert.equal(normalizeContext(null), 'board');
  assert.equal(normalizeContext('arcade'), 'arcade');
  assert.equal(normalizeContext('board'), 'board');
});

test('minigames modernos possuem profiles.board e profiles.arcade', () => {
  for (const id of MODERN_IDS) {
    assert.ok(hasMinigame(id), `${id} registrado`);
    assert.equal(hasProfile(id, 'board'), true, `${id} hasProfile(board)`);
    assert.equal(hasProfile(id, 'arcade'), true, `${id} hasProfile(arcade)`);
    assert.equal(hasProfile(id, 'tutorial'), false, `${id} hasProfile(tutorial)`);
    const board = getProfile(id, 'board');
    assert.ok(board, `${id} profile board presente`);
    assert.ok(getProfile(id, 'arcade'), `${id} profile arcade presente`);
  }
});

test('getProfile retorna os valores exatos atuais de behavior', () => {
  for (const id of MODERN_IDS) {
    const profile = getProfile(id, 'board');
    assert.equal(profile.botSuccessRate, EXPECTED_BOT_RATE[id], `${id} botSuccessRate`);
    assert.equal(profile.autoReturnSeconds, 5, `${id} autoReturnSeconds`);
    assert.deepEqual(profile.rewards, { successBoardDelta: 3, failureBoardDelta: 0 }, `${id} rewards`);
    assert.equal(typeof profile.botPresentation.start, 'function', `${id} botPresentation.start`);
    assert.equal(typeof profile.botPresentation.stop, 'function', `${id} botPresentation.stop`);
  }
});

test('getProfile com contexto desconhecido faz fallback para profiles.board', () => {
  for (const id of MODERN_IDS) {
    const fallback = getProfile(id, 'daily-challenge');
    assert.deepEqual(fallback, getProfile(id, 'board'), `${id} fallback = board`);
  }
});

test('getEffectiveConfig(board) === comportamento legado exato', () => {
  for (const id of MODERN_IDS) {
    const effective = getEffectiveConfig(id, 'board');
    assert.equal(effective.botSuccessRate, EXPECTED_BOT_RATE[id], `${id} botSuccessRate`);
    assert.equal(effective.autoReturnSeconds, 5, `${id} autoReturnSeconds`);
    assert.deepEqual(effective.rewards, { successBoardDelta: 3, failureBoardDelta: 0 }, `${id} rewards`);
    assert.ok(effective.presentation.title, `${id} presentation`);
    assert.equal(typeof effective.botPresentation.start, 'function', `${id} botPresentation.start`);
  }
});

test('getEffectiveConfig(arcade) e (board) sao identicos para os demais minigames', () => {
  const UNCHANGED = MODERN_IDS.filter(id => id !== 'dino-runner');
  for (const id of UNCHANGED) {
    const board = getEffectiveConfig(id, 'board');
    const arcade = getEffectiveConfig(id, 'arcade');
    assert.equal(arcade.botSuccessRate, board.botSuccessRate, `${id} arcade botSuccessRate`);
    assert.equal(arcade.autoReturnSeconds, board.autoReturnSeconds, `${id} arcade autoReturnSeconds`);
    assert.deepEqual(arcade.rewards, board.rewards, `${id} arcade rewards`);
    assert.equal(arcade.presentation.title, board.presentation.title, `${id} arcade presentation`);
    assert.deepEqual(arcade.resultStats, [], `${id} sem resultStats`);
  }
});

test('dino-runner arcade: perfil proprio com dificuldade, score, sem limite de tempo', () => {
  const profile = getProfile('dino-runner', 'arcade');
  assert.equal(profile.hasTimeLimit, false, 'hasTimeLimit false');
  assert.ok(profile.score, 'score presente');
  assert.equal(profile.score.perSecond, 10, 'score.perSecond');
  assert.equal(profile.score.perObstacle, 5, 'score.perObstacle');
  assert.ok(profile.difficulty && Array.isArray(profile.difficulty.stages), 'stages presente');
  assert.ok(profile.difficulty.stages.length >= 3, 'ao menos 3 estagios');
  assert.equal(profile.difficulty.stages[0].until, 20, 'primeiro estagio ate 20s');
  assert.equal(profile.difficulty.stages[profile.difficulty.stages.length - 1].until, null, 'ultimo estagio sem limite');
  assert.ok(Array.isArray(profile.resultStats), 'resultStats presente');
  const keys = profile.resultStats.map(s => s.key);
  assert.ok(keys.includes('tempo'), 'resultStats inclui tempo');
  assert.ok(keys.includes('pontuacao'), 'resultStats inclui pontuacao');
  assert.ok(keys.includes('obstaculosDesviados'), 'resultStats inclui obstaculosDesviados');
  assert.equal(profile.presentation.title, 'Dino Runner Arcade', 'apresentacao arcade propria');

  const effective = getEffectiveConfig('dino-runner', 'arcade');
  assert.equal(effective.botSuccessRate, 0.40, 'arcade herda botSuccessRate do board');
  assert.equal(effective.autoReturnSeconds, 5, 'arcade herda autoReturnSeconds do board');
  assert.deepEqual(effective.rewards, { successBoardDelta: 3, failureBoardDelta: 0 }, 'arcade herda rewards do board');
  assert.equal(effective.resultStats, profile.resultStats, 'arcade resultStats do perfil');
  assert.equal(effective.presentation.title, 'Dino Runner Arcade', 'arcade presentation propria');
});

test('top-level botSuccessRate/autoReturnSeconds/rewards continuam no config', () => {
  for (const id of MODERN_IDS) {
    const config = getMinigame(id);
    assert.equal(config.botSuccessRate, EXPECTED_BOT_RATE[id], `${id} top-level botSuccessRate`);
    assert.equal(config.autoReturnSeconds, 5, `${id} top-level autoReturnSeconds`);
    assert.deepEqual(config.rewards, { successBoardDelta: 3, failureBoardDelta: 0 }, `${id} top-level rewards`);
    assert.equal(typeof config.botPresentation.start, 'function', `${id} top-level botPresentation.start`);
    assert.ok(config.profiles, `${id} profiles presente`);
    assert.equal(config.profiles.board.botSuccessRate, config.botSuccessRate, `${id} board profile espelha top-level`);
    assert.equal(config.profiles.board.rewards, config.rewards, `${id} rewards compartilhada por referencia`);
  }
});

registerMinigame({
  id: 'legacy-minigame',
  name: 'Minigame Legado',
  description: 'Config antigo sem profiles.',
  icon: 'X',
  minPlayers: 1,
  maxPlayers: 1,
  botSuccessRate: 0.42,
  autoReturnSeconds: 7,
  presentation: { title: 'Legado', instruction: 'Sem profiles.' },
  rewards: { successBoardDelta: 3, failureBoardDelta: 0 },
  botPresentation: { start() {}, stop() {} },
  create() { return { destroy() {} }; }
});

test('minigame legado (sem profiles): fallback seguro para config de topo', () => {
  assert.equal(hasProfile('legacy-minigame', 'board'), false);
  assert.equal(getProfile('legacy-minigame', 'board'), null);
  assert.equal(getProfile('legacy-minigame', 'arcade'), null);

  const board = getEffectiveConfig('legacy-minigame', 'board');
  assert.equal(board.botSuccessRate, 0.42);
  assert.equal(board.autoReturnSeconds, 7);
  assert.deepEqual(board.rewards, { successBoardDelta: 3, failureBoardDelta: 0 });

  const arcade = getEffectiveConfig('legacy-minigame', 'arcade');
  assert.equal(arcade.botSuccessRate, 0.42, 'arcade herda config de topo');
  assert.equal(arcade.autoReturnSeconds, 7);
});

test('getEffectiveConfig aplica defaults para campos ausentes', () => {
  registerMinigame({
    id: 'bare-minigame',
    name: 'Bare',
    description: 'Sem behavior nenhum.',
    icon: 'B',
    minPlayers: 1,
    maxPlayers: 1,
    create() { return { destroy() {} }; }
  });
  const effective = getEffectiveConfig('bare-minigame', 'board');
  assert.equal(effective.botSuccessRate, DEFAULT_BOT_RATE);
  assert.equal(effective.autoReturnSeconds, DEFAULT_AUTO_RETURN_SECONDS);
  assert.deepEqual(effective.rewards, {});
  assert.equal(DEFAULT_BOT_RATE, 0.5);
  assert.equal(DEFAULT_AUTO_RETURN_SECONDS, 5);
});

test('id desconhecido lanca MinigameNotFoundError', () => {
  for (const fn of [
    () => getProfile('nao-existe', 'board'),
    () => getEffectiveConfig('nao-existe', 'board'),
    () => hasProfile('nao-existe', 'board')
  ]) {
    assert.throws(fn, MinigameNotFoundError);
  }
});

test('lista de minigames inclui todos os 5 modernos', () => {
  for (const id of MODERN_IDS) {
    assert.ok(listMinigames().includes(id), `${id} na lista`);
  }
});

console.log(`\n${passed} testes passaram`);
