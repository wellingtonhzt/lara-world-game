import assert from 'node:assert/strict';

import { getMinigame, getProfile } from '../src/minigames/engine/index.js';
import { DinoRunnerGame } from '../src/minigames/dino-runner/DinoRunnerGame.js';
import '../src/minigames/dino-runner/index.js';

let passed = 0;
function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  PASS  ${name}`);
  } catch (err) {
    console.error(`  FAIL  ${name}`);
    throw err;
  }
}

/* ── DOM mocks for the canvas game ── */

function makeMockCtx() {
  const target = {};
  return new Proxy(target, {
    get(obj, prop) {
      if (prop === 'canvas') return null;
      if (!(prop in obj)) obj[prop] = () => {};
      return obj[prop];
    },
    set(obj, prop, value) {
      obj[prop] = value;
      return true;
    }
  });
}

const sharedCtx = makeMockCtx();

function createMockEl(tagName) {
  const el = {
    tagName: tagName || 'div',
    className: '',
    children: [],
    parentNode: null,
    style: {},
    width: 0,
    height: 0,
    classList: { add() {}, remove() {}, contains() { return false; }, toggle() {} },
    getContext() { return sharedCtx; },
    getBoundingClientRect() { return { top: 0, left: 0, width: 600, height: 350 }; },
    addEventListener() {},
    removeEventListener() {},
    contains() { return false; },
    appendChild(child) { child.parentNode = el; el.children.push(child); },
    removeChild(child) {
      const idx = el.children.indexOf(child);
      if (idx >= 0) el.children.splice(idx, 1);
      child.parentNode = null;
    }
  };
  return el;
}

class MockImage {
  constructor() {
    this.complete = true;
    this.naturalWidth = 1;
    this.naturalHeight = 1;
    this._src = '';
  }
  set src(value) {
    this._src = value;
    if (typeof this.onload === 'function') this.onload();
  }
  get src() { return this._src; }
}

const prevDocument = globalThis.document;
const prevImage = globalThis.Image;
const prevRaf = globalThis.requestAnimationFrame;
const prevCaf = globalThis.cancelAnimationFrame;

globalThis.document = {
  createElement: (tag) => createMockEl(tag),
  addEventListener() {},
  removeEventListener() {}
};
globalThis.Image = MockImage;
globalThis.requestAnimationFrame = () => 1;
globalThis.cancelAnimationFrame = () => {};

function makeArcadeGame(onComplete) {
  return new DinoRunnerGame(createMockEl('div'), onComplete, {
    mode: 'arcade',
    params: getProfile('dino-runner', 'arcade')
  });
}

function makeBoardGame(onComplete) {
  return new DinoRunnerGame(createMockEl('div'), onComplete, { mode: 'board' });
}

function putCollisionObstacle(game) {
  game.obstacles = [{
    x: game.dino.x - 5,
    y: game.groundLevel - 42,
    w: 22,
    h: 42,
    type: 'cactus',
    dodged: false
  }];
}

console.log('\nDino Runner modo Arcade\n');

test('arcade: sem limite de tempo, nao vence ao passar de 30s', () => {
  const game = makeArcadeGame(() => {});
  game.start();
  game.obstacles = [];
  game._update(35);
  assert.equal(game.state, 'PLAYING', 'continua jogando apos 30s');
  assert.ok(game.elapsed >= 35, 'elapsed acumula');
  assert.equal(game._bonusAwarded, false, 'arcade nao ativa bonus do tabuleiro apos 20s');
  game.stop();
});

test('arcade: score acumula 10 pontos por segundo', () => {
  const game = makeArcadeGame(() => {});
  game.start();
  game.obstacles = [];
  game._update(1);
  game._update(1);
  game._update(1);
  assert.equal(game.score, 30, 'score = 3 x perSecond');
  game.stop();
});

test('arcade: dificuldade progressiva por estagios', () => {
  const game = makeArcadeGame(() => {});
  game.start();
  game.elapsed = 10;
  assert.equal(game._getArcadeStage().name, 'Inicial');
  game.elapsed = 30;
  assert.equal(game._getArcadeStage().name, 'R\u00e1pido');
  game.elapsed = 55;
  assert.equal(game._getArcadeStage().name, 'Acelerado');
  game.elapsed = 85;
  assert.equal(game._getArcadeStage().name, 'Intenso');
  game.elapsed = 120;
  assert.equal(game._getArcadeStage().name, 'Insano', 'ultimo estagio sem limite');
  game.stop();
});

test('arcade: obstaculo desviado soma bonus de score', () => {
  const game = makeArcadeGame(() => {});
  game.start();
  game.spawnInterval = 1000;
  game.obstacles = [{
    x: game.dino.x + 200,
    y: game.groundLevel - 42,
    w: 22,
    h: 42,
    type: 'cactus',
    dodged: false
  }];
  const before = game.score;
  game._update(0.5);
  assert.equal(game.dodgedObstacles, 0, 'ainda nao passou pelo dino');
  game._update(2);
  assert.equal(game.dodgedObstacles, 1, 'obstaculo contado como desviado');
  assert.ok(game.score > before, 'score aumentou');
  assert.equal(game.state, 'PLAYING', 'sem colisao');
  game.stop();
});

test('arcade: colisao completa com stats tempo/pontuacao/obstaculosDesviados', () => {
  let completed = null;
  const game = makeArcadeGame((r) => { completed = r; });
  game.start();
  game._update(12);
  game.score = 135;
  game.dodgedObstacles = 9;
  putCollisionObstacle(game);
  game._update(0.016);
  assert.equal(game.state, 'FAIL');
  assert.ok(completed, 'onComplete chamado');
  assert.equal(completed.venceu, false);
  assert.equal(completed.motivo, 'colisao');
  assert.equal(completed.boardDelta, 0, 'arcade nao move casas do tabuleiro');
  assert.equal(completed.stats.pontuacao, 135);
  assert.equal(completed.stats.obstaculosDesviados, 9);
  assert.ok(completed.stats.tempo >= 12, 'tempo sobrevivido registrado');
  assert.deepEqual(Object.keys(completed.stats).sort(), ['obstaculosDesviados', 'pontuacao', 'tempo']);
});

test('arcade: stopEarly gera stats do modo arcade', () => {
  let completed = null;
  const game = makeArcadeGame((r) => { completed = r; });
  game.start();
  game._update(7);
  game.score = 80;
  game.stopEarly();
  assert.ok(completed, 'onComplete chamado');
  assert.equal(completed.venceu, false);
  assert.equal(completed.motivo, 'interrompido');
  assert.equal(completed.boardDelta, 0);
  assert.equal(completed.stats.pontuacao, 80);
  assert.ok(completed.stats.tempo >= 7);
});

test('board: mantem limite de 30s e vitoria no fim', () => {
  let completed = null;
  const game = makeBoardGame((r) => { completed = r; });
  game.start();
  game.obstacles = [];
  game._update(29);
  assert.equal(game.state, 'PLAYING', 'ainda jogando aos 29s');
  game._update(2);
  assert.equal(game.state, 'SUCCESS');
  assert.ok(completed, 'onComplete chamado');
  assert.equal(completed.venceu, true);
  assert.equal(completed.boardDelta, 3);
  assert.equal(completed.stats.tempo, 30);
});

test('board: colisao apos 20s mantem bonus boardDelta 3', () => {
  let completed = null;
  const game = makeBoardGame((r) => { completed = r; });
  game.start();
  game._update(21);
  assert.equal(game._bonusAwarded, true, 'bonus garantido aos 20s');
  putCollisionObstacle(game);
  game._update(0.016);
  assert.equal(completed.venceu, false);
  assert.equal(completed.boardDelta, 3);
  assert.equal(completed.motivo, 'colisao');
  assert.equal(completed.stats.tempo, Math.round(30 - game.timeLeft), 'stats board usam timeLeft');
});

test('board: colisao antes dos 20s sem bonus', () => {
  let completed = null;
  const game = makeBoardGame((r) => { completed = r; });
  game.start();
  game._update(1);
  assert.equal(game._bonusAwarded, false);
  putCollisionObstacle(game);
  game._update(0.016);
  assert.equal(completed.venceu, false);
  assert.equal(completed.boardDelta, 0);
});

test('create() do config conecta context arcade ao modo arcade', () => {
  const config = getMinigame('dino-runner');
  let completed = null;
  const arcadeInstance = config.create({
    container: createMockEl('div'),
    context: 'arcade',
    onComplete: (r) => { completed = r; }
  });
  assert.equal(arcadeInstance.mode, 'arcade', 'create arcade usa modo arcade');
  assert.ok(arcadeInstance.params, 'create arcade recebe params do profile');
  assert.equal(arcadeInstance.params.hasTimeLimit, false);
  arcadeInstance.stop();
  assert.equal(completed, null, 'stop nao completa');
});

test('create() do config com board usa modo board', () => {
  const config = getMinigame('dino-runner');
  const boardInstance = config.create({
    container: createMockEl('div'),
    onComplete: () => {}
  });
  assert.equal(boardInstance.mode, 'board');
  assert.equal(boardInstance.params, null);
  boardInstance.stop();
});

test('host/launch ainda resolve com normalizeMinigameResult para stats arcade', async () => {
  const { normalizeMinigameResult } = await import('../src/minigames/engine/index.js');
  const normalized = normalizeMinigameResult({
    venceu: false,
    boardDelta: 0,
    progresso: { atual: 0, objetivo: 1 },
    motivo: 'colisao',
    stats: { tempo: 20, pontuacao: 215, obstaculosDesviados: 14 }
  });
  assert.deepEqual(normalized.stats, { tempo: 20, pontuacao: 215, obstaculosDesviados: 14 });
  assert.equal(normalized.venceu, false);
});

/* restore globals */
globalThis.document = prevDocument;
globalThis.Image = prevImage;
globalThis.requestAnimationFrame = prevRaf;
globalThis.cancelAnimationFrame = prevCaf;

console.log(`\n${passed} testes passaram`);
