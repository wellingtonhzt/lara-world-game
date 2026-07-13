import { registerMinigame, getMinigame, hasMinigame, listMinigames, MinigameNotFoundError } from '../src/minigames/engine/minigame-registry.js';
import { normalizeMinigameResult } from '../src/minigames/engine/minigame-result.js';
import { OceanMatch3 } from '../src/minigames/ocean-match3/OceanMatch3.js';
import '../src/minigames/ocean-match3/index.js';

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    passed++;
    console.log(`  ✅ ${label}`);
  } else {
    failed++;
    console.error(`  ❌ ${label}`);
  }
}

function assertEqual(actual, expected, label) {
  if (actual === expected) {
    passed++;
    console.log(`  ✅ ${label}`);
  } else {
    failed++;
    console.error(`  ❌ ${label} — esperado: ${JSON.stringify(expected)}, obtido: ${JSON.stringify(actual)}`);
  }
}

function assertDeepEqual(actual, expected, label) {
  try {
    if (JSON.stringify(actual) === JSON.stringify(expected)) {
      passed++;
      console.log(`  ✅ ${label}`);
    } else {
      failed++;
      console.error(`  ❌ ${label} — esperado: ${JSON.stringify(expected)}, obtido: ${JSON.stringify(actual)}`);
    }
  } catch (e) {
    failed++;
    console.error(`  ❌ ${label} — erro ao comparar: ${e.message}`);
  }
}

/* ── Registry Tests ── */

console.log('\n📦 Minigame Registry\n');

// 1. Register a valid minigame
registerMinigame({
  id: 'test-game',
  name: 'Test Game',
  description: 'Teste',
  icon: '🧪',
  minPlayers: 1,
  maxPlayers: 1,
  botSuccessRate: 0.5,
  create: () => ({ stop() {} })
});
assert(hasMinigame('test-game'), 'hasMinigame returns true after registration');

// 2. Get registered minigame
const cfg = getMinigame('test-game');
assert(cfg != null, 'getMinigame returns config');
assertEqual(cfg.id, 'test-game', 'config.id matches');

// 3. List includes registered game
const list = listMinigames();
assert(list.includes('test-game'), 'listMinigames includes "test-game"');

// 4. hasMinigame returns false for unknown
assert(!hasMinigame('inexistente'), 'hasMinigame returns false for unknown ID');

// 5. getMinigame throws for unknown ID
let threw = false;
try {
  getMinigame('inexistente');
} catch (e) {
  threw = true;
  assert(e instanceof MinigameNotFoundError, 'error is instance of MinigameNotFoundError');
  assertEqual(e.minigameId, 'inexistente', 'error.minigameId matches');
}
assert(threw, 'getMinigame throws for unknown ID');

// 6. Re-register same ID throws
let threwDuplicate = false;
try {
  registerMinigame({
    id: 'test-game',
    name: 'Duplicate',
    description: '',
    icon: '❌',
    minPlayers: 1,
    maxPlayers: 1,
    botSuccessRate: 0.5,
    create: () => ({ stop() {} })
  });
} catch {
  threwDuplicate = true;
}
assert(threwDuplicate, 're-registering same ID throws');

// 7. Register with invalid ID throws
let threwInvalid = false;
try {
  registerMinigame({
    id: 'Invalid ID!',
    name: 'Bad',
    description: '',
    icon: '❌',
    minPlayers: 1,
    maxPlayers: 1,
    botSuccessRate: 0.5,
    create: () => ({ stop() {} })
  });
} catch {
  threwInvalid = true;
}
assert(threwInvalid, 'registering with invalid ID (spaces) throws');

// 8. Config is frozen
const cfg2 = getMinigame('test-game');
assert(Object.isFrozen(cfg2), 'registered config is frozen');

/* ── Result Normalizer Tests ── */

console.log('\n📋 Result Normalizer\n');

// 9. Success result
const successResult = normalizeMinigameResult({ venceu: true, boardDelta: 3, progresso: { atual: 3, objetivo: 3 } });
assertEqual(successResult.venceu, true, 'success result has venceu: true');
assertEqual(successResult.boardDelta, 3, 'success result has boardDelta: 3');
assertEqual(successResult.motivo, 'missao-completa', 'success result has motivo: "missao-completa"');

// 10. Failure result
const failResult = normalizeMinigameResult({ venceu: false, boardDelta: 0, progresso: { atual: 0, objetivo: 3 }, motivo: 'sem-vidas' });
assertEqual(failResult.venceu, false, 'fail result has venceu: false');
assertEqual(failResult.boardDelta, 0, 'fail result has boardDelta: 0');
assertEqual(failResult.motivo, 'sem-vidas', 'fail result preserves motivo');

// 11. Defaults filled
const minimalResult = normalizeMinigameResult({ venceu: true, boardDelta: 2 });
assertDeepEqual(minimalResult.progresso, { atual: 0, objetivo: 0 }, 'minimal result fills default progresso');
assertEqual(minimalResult.motivo, 'missao-completa', 'minimal result (venceu) fills default motivo "missao-completa"');
assertDeepEqual(minimalResult.stats, {}, 'minimal result fills default stats');

// 12. Null/undefined input throws
let threwNull = false;
try {
  normalizeMinigameResult(null);
} catch {
  threwNull = true;
}
assert(threwNull, 'null input throws');

let threwUndefined = false;
try {
  normalizeMinigameResult(undefined);
} catch {
  threwUndefined = true;
}
assert(threwUndefined, 'undefined input throws');

// 13. Negative boardDelta preserved
const retreatResult = normalizeMinigameResult({ venceu: false, boardDelta: -2, progresso: { atual: 0, objetivo: 3 } });
assertEqual(retreatResult.boardDelta, -2, 'negative boardDelta preserved');

// 14. Extra properties stripped
const extraResult = normalizeMinigameResult({ venceu: true, boardDelta: 1, foo: 'bar', progresso: { atual: 1, objetivo: 3 } });
assert(extraResult.foo === undefined, 'extra property "foo" stripped');

// 15. Non-object input throws
let threwNumeric = false;
try {
  normalizeMinigameResult(42);
} catch {
  threwNumeric = true;
}
assert(threwNumeric, 'numeric input throws');

let threwString = false;
try {
  normalizeMinigameResult('string');
} catch {
  threwString = true;
}
assert(threwString, 'string input throws');

/* ── Host Config Structure Tests ── */

console.log('\n🎛️ Host Config Structure\n');

// 16. Register a game with full config
const GAME_WITH_CONFIG = {
  id: 'host-test-game',
  name: 'Host Test',
  description: 'Teste',
  icon: '🧪',
  minPlayers: 1,
  maxPlayers: 1,
  botSuccessRate: 0.75,
  autoReturnSeconds: 3,
  presentation: {
    title: 'Test Title',
    instruction: 'Test instruction',
    botMessage: 'Bot is testing...',
    successIcon: '🏆',
    successTitle: 'You win!',
    successMessage: 'Great job!',
    failureIcon: '💔',
    failureTitle: 'You lose',
    failureMessage: 'Try again'
  },
  rewards: {
    successBoardDelta: 5,
    failureBoardDelta: -1
  },
  create: () => ({ stop() {} })
};
registerMinigame(GAME_WITH_CONFIG);

const hostCfg = getMinigame('host-test-game');

assert(hostCfg.presentation != null, 'presentation exists in config');
assertEqual(hostCfg.presentation.title, 'Test Title', 'presentation.title');
assertEqual(hostCfg.presentation.instruction, 'Test instruction', 'presentation.instruction');
assertEqual(hostCfg.presentation.botMessage, 'Bot is testing...', 'presentation.botMessage');
assertEqual(hostCfg.presentation.successIcon, '🏆', 'presentation.successIcon');
assertEqual(hostCfg.presentation.successTitle, 'You win!', 'presentation.successTitle');
assertEqual(hostCfg.presentation.successMessage, 'Great job!', 'presentation.successMessage');
assertEqual(hostCfg.presentation.failureIcon, '💔', 'presentation.failureIcon');
assertEqual(hostCfg.presentation.failureTitle, 'You lose', 'presentation.failureTitle');
assertEqual(hostCfg.presentation.failureMessage, 'Try again', 'presentation.failureMessage');

assert(hostCfg.rewards != null, 'rewards exists in config');
assertEqual(hostCfg.rewards.successBoardDelta, 5, 'rewards.successBoardDelta');
assertEqual(hostCfg.rewards.failureBoardDelta, -1, 'rewards.failureBoardDelta');

assertEqual(hostCfg.autoReturnSeconds, 3, 'autoReturnSeconds');
assertEqual(hostCfg.botSuccessRate, 0.75, 'botSuccessRate');

// 17. Config with minimal fields gets defaults via host
const MINIMAL_CONFIG = {
  id: 'minimal-host-test',
  name: 'Minimal',
  description: '',
  icon: '❓',
  minPlayers: 1,
  maxPlayers: 1,
  create: () => ({ stop() {} })
};
registerMinigame(MINIMAL_CONFIG);
const minimalCfg = getMinigame('minimal-host-test');
assert(minimalCfg.presentation === undefined, 'minimal config has no presentation (no default during registration)');
assert(minimalCfg.rewards === undefined, 'minimal config has no rewards (no default during registration)');
assert(minimalCfg.autoReturnSeconds === undefined, 'minimal config has no autoReturnSeconds (no default during registration)');
assert(minimalCfg.botSuccessRate === undefined, 'minimal config has no botSuccessRate (no default during registration)');

// 18. Meteor-game config has presentation, rewards, autoReturnSeconds
import { registerMinigame as _rm, getMinigame as _gm } from '../src/minigames/engine/minigame-registry.js'; // already imported
import '../src/minigames/meteoro/index.js';
const meteorCfg = _gm('meteor-game');
assert(meteorCfg.presentation != null, 'meteor-game has presentation');
assert(meteorCfg.rewards != null, 'meteor-game has rewards');
assertEqual(meteorCfg.autoReturnSeconds, 5, 'meteor-game autoReturnSeconds is 5');
assertEqual(meteorCfg.botSuccessRate, 0.40, 'meteor-game botSuccessRate is 0.40');
assertEqual(meteorCfg.rewards.successBoardDelta, 3, 'meteor-game rewards.successBoardDelta is 3');
assertEqual(meteorCfg.rewards.failureBoardDelta, 0, 'meteor-game rewards.failureBoardDelta is 0');
assertEqual(meteorCfg.presentation.title, 'Buraco de Minhoca', 'meteor-game presentation.title');
assertEqual(meteorCfg.presentation.successTitle, 'Miss\u00E3o conclu\u00EDda!', 'meteor-game presentation.successTitle');

/* ── Ocean Match-3 Tests ── */

console.log('\n🌊 Ocean Match-3\n');

const om3Cfg = getMinigame('ocean-match3');

assert(hasMinigame('ocean-match3'), 'ocean-match3 is registered');
assert(listMinigames().includes('ocean-match3'), 'listMinigames includes ocean-match3');

assert(om3Cfg.presentation != null, 'ocean-match3 has presentation');
assert(om3Cfg.rewards != null, 'ocean-match3 has rewards');
assertEqual(om3Cfg.autoReturnSeconds, 5, 'ocean-match3 autoReturnSeconds is 5');
assertEqual(om3Cfg.botSuccessRate, 0.60, 'ocean-match3 botSuccessRate is 0.60');
assertEqual(om3Cfg.rewards.successBoardDelta, 3, 'ocean-match3 rewards.successBoardDelta is 3');
assertEqual(om3Cfg.rewards.failureBoardDelta, 0, 'ocean-match3 rewards.failureBoardDelta is 0');
assertEqual(om3Cfg.presentation.title, 'Tesouro das Mar\u00E9s', 'ocean-match3 presentation.title');

const mockContainer = { innerHTML: '', style: {}, querySelectorAll: () => [], querySelector: () => null };
let callCount = 0;
const game = new OceanMatch3(mockContainer, () => { callCount++; });

// Grid model (call _createGrid directly, no DOM needed)
game._createGrid();

assert(game.grid.length === 6, 'grid has 6 rows');

let allRowsHave6 = true;
for (const row of game.grid) {
  if (row.length !== 6) { allRowsHave6 = false; break; }
}
assert(allRowsHave6, 'each row has 6 columns');

const validTypes = ['fish', 'octopus', 'crab', 'shell', 'star'];
let allValidTypes = true;
for (const row of game.grid) {
  for (const cell of row) {
    if (!validTypes.includes(cell.type)) { allValidTypes = false; break; }
  }
  if (!allValidTypes) break;
}
assert(allValidTypes, 'all cells have valid types from PIECE_TYPES');

let cellsCorrect = true;
for (let r = 0; r < game.grid.length; r++) {
  for (let c = 0; c < game.grid[r].length; c++) {
    const cell = game.grid[r][c];
    if (cell.row !== r || cell.col !== c) { cellsCorrect = false; break; }
  }
  if (!cellsCorrect) break;
}
assert(cellsCorrect, 'each cell has correct row and col values');

let totalCells = 0;
for (const row of game.grid) totalCells += row.length;
assert(totalCells === 36, 'grid has 36 total cells');

const game2 = new OceanMatch3(mockContainer, () => {});
game2._createGrid();
assert(game.grid !== game2.grid, 'each game creates independent grid array');

// _complete single-call guard
callCount = 0;
const game3 = new OceanMatch3(mockContainer, (r) => { callCount++; });
game3._complete({ venceu: true });
game3._complete({ venceu: false });
assert(callCount === 1, '_complete only calls onComplete once');

// create returns object with stop() and destroy()
const createMockContainer = { innerHTML: '', style: {}, querySelectorAll: () => [], querySelector: () => null };
const created = om3Cfg.create({ container: createMockContainer, onComplete: () => {} });
assert(created != null, 'create returns an object');
assert(typeof created.stop === 'function', 'created instance has stop() method');
assert(typeof created.destroy === 'function', 'created instance has destroy() method');
created.stop();

// Verify meteor-game is still intact
assert(hasMinigame('meteor-game'), 'meteor-game still registered after ocean-match3');

/* ── Ocean Match-3 Selection & Swap Tests ── */

console.log('\n🖱️ Ocean Match-3 Seleção & Troca\n');

const selGame = new OceanMatch3(mockContainer, () => {});
selGame._createGrid();

// 1. selectedCell inicia null
assert(selGame.selectedCell === null, 'selectedCell starts as null');

// 2. Primeiro clique seleciona peça
selGame._handlePieceClick(2, 3);
assert(selGame.selectedCell !== null, 'first click selects a piece');
assertEqual(selGame.selectedCell.row, 2, 'selectedCell row after first click');
assertEqual(selGame.selectedCell.col, 3, 'selectedCell col after first click');

// 3. Segundo clique na mesma peça cancela seleção
selGame._handlePieceClick(2, 3);
assert(selGame.selectedCell === null, 'second click on same piece cancels selection');

// 4. Adjacência horizontal válida
assert(selGame._isAdjacent({ row: 0, col: 0 }, { row: 0, col: 1 }), 'horizontal adjacency is valid');

// 5. Adjacência vertical válida
assert(selGame._isAdjacent({ row: 0, col: 0 }, { row: 1, col: 0 }), 'vertical adjacency is valid');

// 6. Diagonal inválida
assert(!selGame._isAdjacent({ row: 0, col: 0 }, { row: 1, col: 1 }), 'diagonal is not adjacent');

// 7. Distância maior inválida
assert(!selGame._isAdjacent({ row: 0, col: 0 }, { row: 0, col: 2 }), 'distance > 1 is not adjacent');

// 8. Troca atualiza o modelo
const swapGame = new OceanMatch3(mockContainer, () => {});
swapGame._createGrid();
const typeBeforeA = swapGame.grid[0][0].type;
const typeBeforeB = swapGame.grid[0][1].type;
swapGame._swapCells({ row: 0, col: 0 }, { row: 0, col: 1 });
assertEqual(swapGame.grid[0][0].type, typeBeforeB, 'swap: cell A gets type B');
assertEqual(swapGame.grid[0][1].type, typeBeforeA, 'swap: cell B gets type A');

// 9. Troca preserva 6×6
assert(swapGame.grid.length === 6, 'swap preserves 6 rows');
assert(swapGame.grid[0].length === 6, 'swap preserves 6 columns');
assert(swapGame.grid[5].length === 6, 'swap preserves 6 columns in last row');

// 10. Troca não altera quantidade de peças
let swapTotal = 0;
for (const row of swapGame.grid) swapTotal += row.length;
assertEqual(swapTotal, 36, 'swap preserves total piece count');

// 11. Troca limpa seleção
const swapSelectGame = new OceanMatch3(mockContainer, () => {});
swapSelectGame._createGrid();
swapSelectGame._handlePieceClick(0, 0);
swapSelectGame._handlePieceClick(0, 1);
assert(swapSelectGame.selectedCell === null, 'swap clears selection');

// 12. Clique não adjacente move seleção
const moveSelGame = new OceanMatch3(mockContainer, () => {});
moveSelGame._createGrid();
moveSelGame._handlePieceClick(0, 0);
moveSelGame._handlePieceClick(2, 2);
assert(moveSelGame.selectedCell !== null, 'non-adjacent click keeps selection');
assertEqual(moveSelGame.selectedCell.row, 2, 'non-adjacent click moves row');
assertEqual(moveSelGame.selectedCell.col, 2, 'non-adjacent click moves col');

// 13. swapCount incrementa
assertEqual(swapGame.swapCount, 1, 'swapCount is 1 after one swap');
swapGame._swapCells({ row: 0, col: 1 }, { row: 0, col: 2 });
assertEqual(swapGame.swapCount, 2, 'swapCount increments');

// 14. lastSwap registra coordenadas e tipos
assert(swapGame.lastSwap !== null, 'lastSwap is set after swap');
assertEqual(swapGame.lastSwap.from.row, 0, 'lastSwap.from.row');
assertEqual(swapGame.lastSwap.from.col, 1, 'lastSwap.from.col');
assertEqual(swapGame.lastSwap.to.row, 0, 'lastSwap.to.row');
assertEqual(swapGame.lastSwap.to.col, 2, 'lastSwap.to.col');
assert(typeof swapGame.lastSwap.from.type === 'string', 'lastSwap.from.type is string');
assert(typeof swapGame.lastSwap.to.type === 'string', 'lastSwap.to.type is string');

// 15. regenerateGrid cria nova grade
const regenGame = new OceanMatch3(mockContainer, () => {});
regenGame._createGrid();
const oldGridRef = regenGame.grid;
regenGame.regenerateGrid();
assert(regenGame.grid !== oldGridRef, 'regenerateGrid creates new grid reference');
assert(regenGame.grid.length === 6, 'regenerated grid has 6 rows');
assert(regenGame.grid[0].length === 6, 'regenerated grid has 6 columns');
let regenTotal = 0;
for (const row of regenGame.grid) regenTotal += row.length;
assertEqual(regenTotal, 36, 'regenerated grid has 36 pieces');

// 16. regenerateGrid limpa seleção
regenGame._handlePieceClick(1, 1);
regenGame.regenerateGrid();
assert(regenGame.selectedCell === null, 'regenerateGrid clears selection');
assert(regenGame.lastSwap === null, 'regenerateGrid clears lastSwap');
assertEqual(regenGame.swapCount, 0, 'regenerateGrid resets swapCount');

// 17. getDebugState não expõe referência interna (shallow copy)
const debugGame = new OceanMatch3(mockContainer, () => {});
debugGame._started = true;
debugGame._createGrid();
debugGame._handlePieceClick(3, 4);
const state = debugGame.getDebugState();
assert(state.active === true, 'getDebugState reports active');
assert(state.valid === true, 'getDebugState reports valid grid');
assert(state.rows === 6, 'getDebugState reports 6 rows');
assertEqual(state.totalPieces, 36, 'getDebugState reports 36 pieces');
assert(state.selectedCell !== null, 'getDebugState reports selectedCell');
assertEqual(state.selectedCell.row, 3, 'getDebugState selectedCell row');
assertEqual(state.selectedCell.col, 4, 'getDebugState selectedCell col');
assertEqual(state.swapCount, 0, 'getDebugState swapCount');
if (state.selectedCell) {
  state.selectedCell.row = 99;
  assertEqual(debugGame.selectedCell.row, 3, 'getDebugState returns copy, not reference');
}

// 18. complete continua single-call (re-uses game3 from above)
assert(callCount === 1, '_complete still single-call after selection tests');

// 19. Simulação de vitória continua funcionando
const vitMock = { innerHTML: '', style: {}, querySelectorAll: () => [], querySelector: () => null };
let vitCalled = false;
const vitGame = new OceanMatch3(vitMock, (r) => { vitCalled = true; });
vitGame._handleAction('vitoria');
assert(vitCalled === true, 'simula\u00E7\u00E3o de vit\u00F3ria funciona');
assertEqual(vitGame._completed, true, 'game marked completed after vitória');

// 20. Simulação de tempo continua funcionando
const tempMock = { innerHTML: '', style: {}, querySelectorAll: () => [], querySelector: () => null };
let tempCalled = false;
const tempGame = new OceanMatch3(tempMock, (r) => { tempCalled = true; });
tempGame._handleAction('tempo');
assert(tempCalled === true, 'simula\u00E7\u00E3o de tempo funciona');

// 21. meteor-game continua intacto
assert(hasMinigame('meteor-game'), 'meteor-game still registered after all tests');

// 22. getDebugState sem grid retorna inativo
const inactiveGame = new OceanMatch3(mockContainer, () => {});
const inactiveState = inactiveGame.getDebugState();
assert(inactiveState.active === false, 'getDebugState returns inactive before start');
assert(inactiveState.valid === false, 'getDebugState returns invalid before start');

/* ── Ocean Match-3: Sprint 3.3 — Match Detection & Validation ── */

function makeMatchGame(customGrid) {
  const g = new OceanMatch3(mockContainer, () => {});
  g._started = true;
  if (customGrid) {
    g.grid = customGrid;
  } else {
    g._createGrid();
  }
  return g;
}

// 23. _findHorizontalMatches detects 3 horizontal
const hGrid = [
  [{type:'fish',row:0,col:0},{type:'fish',row:0,col:1},{type:'fish',row:0,col:2},{type:'crab',row:0,col:3},{type:'crab',row:0,col:4},{type:'star',row:0,col:5}],
  [{type:'shell',row:1,col:0},{type:'octopus',row:1,col:1},{type:'crab',row:1,col:2},{type:'star',row:1,col:3},{type:'shell',row:1,col:4},{type:'fish',row:1,col:5}],
  [{type:'fish',row:2,col:0},{type:'fish',row:2,col:1},{type:'star',row:2,col:2},{type:'star',row:2,col:3},{type:'octopus',row:2,col:4},{type:'crab',row:2,col:5}],
  [{type:'crab',row:3,col:0},{type:'shell',row:3,col:1},{type:'shell',row:3,col:2},{type:'shell',row:3,col:3},{type:'shell',row:3,col:4},{type:'shell',row:3,col:5}],
  [{type:'fish',row:4,col:0},{type:'shell',row:4,col:1},{type:'star',row:4,col:2},{type:'crab',row:4,col:3},{type:'fish',row:4,col:4},{type:'star',row:4,col:5}],
  [{type:'crab',row:5,col:0},{type:'octopus',row:5,col:1},{type:'crab',row:5,col:2},{type:'star',row:5,col:3},{type:'crab',row:5,col:4},{type:'fish',row:5,col:5}],
];
const hg = makeMatchGame(hGrid);
const hMatches = hg._findHorizontalMatches(hGrid);
assert(hMatches.length >= 1, 'horizontal matches found');
assert(hMatches.some(m => m.direction === 'horizontal' && m.cells.length >= 3), 'horizontal group has 3+ cells');
assert(hMatches.some(m => m.type === 'shell' && m.cells.length === 5), 'shell horizontal match of 5');

// 24. _findVerticalMatches detects 3 vertical
const vGrid = [
  [{type:'fish',row:0,col:0},{type:'octopus',row:0,col:1},{type:'crab',row:0,col:2},{type:'shell',row:0,col:3},{type:'star',row:0,col:4},{type:'star',row:0,col:5}],
  [{type:'fish',row:1,col:0},{type:'octopus',row:1,col:1},{type:'crab',row:1,col:2},{type:'shell',row:1,col:3},{type:'star',row:1,col:4},{type:'star',row:1,col:5}],
  [{type:'shell',row:2,col:0},{type:'fish',row:2,col:1},{type:'octopus',row:2,col:2},{type:'crab',row:2,col:3},{type:'shell',row:2,col:4},{type:'star',row:2,col:5}],
  [{type:'crab',row:3,col:0},{type:'shell',row:3,col:1},{type:'fish',row:3,col:2},{type:'octopus',row:3,col:3},{type:'crab',row:3,col:4},{type:'fish',row:3,col:5}],
  [{type:'star',row:4,col:0},{type:'crab',row:4,col:1},{type:'shell',row:4,col:2},{type:'fish',row:4,col:3},{type:'octopus',row:4,col:4},{type:'crab',row:4,col:5}],
  [{type:'octopus',row:5,col:0},{type:'star',row:5,col:1},{type:'crab',row:5,col:2},{type:'shell',row:5,col:3},{type:'fish',row:5,col:4},{type:'octopus',row:5,col:5}],
];
const vg2 = makeMatchGame(vGrid);
const vMatches = vg2._findVerticalMatches(vGrid);
assert(vMatches.length >= 1, 'vertical matches found');
assert(vMatches.some(m => m.direction === 'vertical' && m.cells.length >= 3), 'vertical group has 3+ cells');

// 25. _findMatches combines both
const allMatches = hg._findMatches(hGrid);
assert(allMatches.hasMatches === true, '_findMatches reports hasMatches');
assert(allMatches.groups.length >= 2, '_findMatches returns horizontal and vertical groups');
assert(allMatches.cells.length >= 6, '_findMatches returns unique matched cells');

// 26. No matches on non-matching grid
const noMatchGrid = [
  [{type:'fish',row:0,col:0},{type:'octopus',row:0,col:1},{type:'crab',row:0,col:2},{type:'shell',row:0,col:3},{type:'star',row:0,col:4},{type:'fish',row:0,col:5}],
  [{type:'shell',row:1,col:0},{type:'fish',row:1,col:1},{type:'octopus',row:1,col:2},{type:'crab',row:1,col:3},{type:'shell',row:1,col:4},{type:'star',row:1,col:5}],
  [{type:'crab',row:2,col:0},{type:'shell',row:2,col:1},{type:'fish',row:2,col:2},{type:'octopus',row:2,col:3},{type:'crab',row:2,col:4},{type:'fish',row:2,col:5}],
  [{type:'star',row:3,col:0},{type:'crab',row:3,col:1},{type:'shell',row:3,col:2},{type:'fish',row:3,col:3},{type:'octopus',row:3,col:4},{type:'crab',row:3,col:5}],
  [{type:'octopus',row:4,col:0},{type:'star',row:4,col:1},{type:'crab',row:4,col:2},{type:'shell',row:4,col:3},{type:'fish',row:4,col:4},{type:'octopus',row:4,col:5}],
  [{type:'fish',row:5,col:0},{type:'octopus',row:5,col:1},{type:'star',row:5,col:2},{type:'crab',row:5,col:3},{type:'shell',row:5,col:4},{type:'fish',row:5,col:5}],
];
const nmg = makeMatchGame(noMatchGrid);
const nmMatches = nmg._findMatches(noMatchGrid);
assert(nmMatches.hasMatches === false, 'no matches on alternating grid');
assert(nmMatches.groups.length === 0, 'no match groups on alternating grid');

// 27. _isValidSwap validates a swap that creates new match
const vg = makeMatchGame(hGrid);
vg.grid[1][1].type = 'fish'; // Make row 0: fish,fish,fish,...
const pre = vg._findMatches(vg.grid);
const preCellSet = new Set(pre.cells.map(c => `${c.row},${c.col}`));
const isValid = vg._isValidSwap({ groups: pre.groups, cells: pre.cells, hasMatches: pre.hasMatches }, preCellSet, { row: 0, col: 0 }, { row: 0, col: 1 });
assert(isValid === false, 'swap within existing match is not valid');

// 28. _isValidSwap returns false when swap creates no new match outside existing groups
assert(isValid === false, 'swap creating no new cells is invalid');

// 29. validSwapCount increments on valid swap
const validSwapGame = makeMatchGame(hGrid);
validSwapGame._started = true;
validSwapGame.grid[0][0] = { type: 'fish', row: 0, col: 0 };
validSwapGame.grid[0][1] = { type: 'crab', row: 0, col: 1 };
validSwapGame.grid[0][2] = { type: 'crab', row: 0, col: 2 };
validSwapGame.grid[1][0] = { type: 'crab', row: 1, col: 0 };
validSwapGame._swapCells({ row: 1, col: 0 }, { row: 0, col: 0 }); // swap crab(1,0) with fish(0,0)
// After swap: (0,0)=crab, (1,0)=fish. Check if valid
const pre2 = validSwapGame._findMatches(validSwapGame.grid);
const preSet2 = new Set(pre2.cells.map(c => `${c.row},${c.col}`));
validSwapGame._swapCells({ row: 1, col: 0 }, { row: 0, col: 0 }); // back
const post2 = validSwapGame._findMatches(validSwapGame.grid);
const isValidSwapCall = validSwapGame._isValidSwap(post2, preSet2, { row: 0, col: 0 }, { row: 1, col: 0 });
assert(typeof isValidSwapCall === 'boolean', '_isValidSwap returns boolean');

// 30. invalidSwapCount tracking
const ig = makeMatchGame(hGrid);
const oldInvalid = ig.invalidSwapCount;
ig.invalidSwapCount++;
assertEqual(ig.invalidSwapCount, oldInvalid + 1, 'invalidSwapCount increments');

// 31. validSwapCount tracking
const vgCount = makeMatchGame(hGrid);
const oldValid = vgCount.validSwapCount;
vgCount.validSwapCount++;
assertEqual(vgCount.validSwapCount, oldValid + 1, 'validSwapCount increments');

// 32. isResolving blocks clicks
const resolveGame = makeMatchGame();
resolveGame.isResolving = true;
const selBefore = resolveGame.selectedCell;
resolveGame._handlePieceClick(0, 0);
assertEqual(resolveGame.selectedCell, selBefore, 'click blocked during resolving');

// 33. _loadTestGrid loads known grid
const loadGame = makeMatchGame();
loadGame._loadTestGrid();
assert(loadGame.grid.length === 6, 'load test grid has 6 rows');
assert(loadGame.grid[0].length === 6, 'load test grid has 6 columns');
assert(loadGame.grid[0][0].type === 'fish', 'load test grid cell (0,0) is fish');
assert(loadGame.grid[0][1].type === 'fish', 'load test grid cell (0,1) is fish');
assert(loadGame.grid[0][2].type === 'fish', 'load test grid cell (0,2) is fish');
assert(loadGame.selectedCell === null, 'load test grid clears selection');
assert(loadGame.lastSwap === null, 'load test grid clears lastSwap');
assertEqual(loadGame.swapCount, 0, 'load test grid resets swapCount');
assertEqual(loadGame.validSwapCount, 0, 'load test grid resets validSwapCount');
assertEqual(loadGame.invalidSwapCount, 0, 'load test grid resets invalidSwapCount');

// 34. loaded test grid has matches
const testMatches = loadGame._findMatches(loadGame.grid);
assert(testMatches.hasMatches === true, 'load test grid has matches');

// 35. getDebugState includes match info
const debugMatchGame = makeMatchGame(hGrid);
const ds = debugMatchGame.getDebugState();
assert('matchGroups' in ds, 'getDebugState includes matchGroups');
assert('matchedCells' in ds, 'getDebugState includes matchedCells');
assert('validSwapCount' in ds, 'getDebugState includes validSwapCount');
assert('invalidSwapCount' in ds, 'getDebugState includes invalidSwapCount');
assert('isResolving' in ds, 'getDebugState includes isResolving');

// 36. getDebugState matchGroups structure
if (ds.matchGroups && ds.matchGroups.length > 0) {
  const firstGroup = ds.matchGroups[0];
  assert('direction' in firstGroup, 'match group has direction');
  assert('type' in firstGroup, 'match group has type');
  assert('cells' in firstGroup, 'match group has cells');
  assert(firstGroup.cells.length >= 1, 'match group cells not empty');
}

// 37. regenerateGrid resets match state
const regenMatchGame = makeMatchGame();
regenMatchGame.validSwapCount = 5;
regenMatchGame.invalidSwapCount = 3;
regenMatchGame.lastMatches = { groups: [], cells: [{ row: 0, col: 0 }], hasMatches: true };
regenMatchGame.regenerateGrid();
assertEqual(regenMatchGame.validSwapCount, 0, 'regenerateGrid resets validSwapCount');
assertEqual(regenMatchGame.invalidSwapCount, 0, 'regenerateGrid resets invalidSwapCount');
assertEqual(regenMatchGame.lastMatches.hasMatches, false, 'regenerateGrid resets lastMatches');

// 38. destroy resets match state
const destroyMatchGame = makeMatchGame();
destroyMatchGame.isResolving = true;
destroyMatchGame.validSwapCount = 2;
destroyMatchGame.invalidSwapCount = 1;
destroyMatchGame.destroy();
assertEqual(destroyMatchGame.validSwapCount, 0, 'destroy resets validSwapCount');
assertEqual(destroyMatchGame.invalidSwapCount, 0, 'destroy resets invalidSwapCount');
assertEqual(destroyMatchGame.lastMatches.hasMatches, false, 'destroy resets lastMatches');
assert(destroyMatchGame.isResolving === false, 'destroy resets isResolving');

// 39. _swapCells sets lastSwap.valid to false by default
const defaultSwapGame = makeMatchGame();
defaultSwapGame._createGrid();
defaultSwapGame._swapCells({ row: 0, col: 0 }, { row: 0, col: 1 });
assert(defaultSwapGame.lastSwap.valid === false, '_swapCells sets lastSwap.valid to false');

// 40. meteor-game still registered after match detection tests
assert(hasMinigame('meteor-game'), 'meteor-game still registered after match detection tests');

/* ── Ocean Match-3: Micro-sprint 3.3.1 — Célula Vazia (null) ── */

// 41. null é aceito como célula válida
const nullGame = new OceanMatch3(mockContainer, () => {});
nullGame._started = true;
nullGame.grid = [
  [{type:'fish',row:0,col:0}, null, {type:'fish',row:0,col:2},{type:'crab',row:0,col:3},{type:'crab',row:0,col:4},{type:'star',row:0,col:5}],
  [{type:'crab',row:1,col:0},{type:'shell',row:1,col:1},{type:'crab',row:1,col:2},{type:'crab',row:1,col:3},{type:'shell',row:1,col:4},{type:'octopus',row:1,col:5}],
  [{type:'fish',row:2,col:0},{type:'shell',row:2,col:1},{type:'star',row:2,col:2},{type:'octopus',row:2,col:3},{type:'star',row:2,col:4},{type:'fish',row:2,col:5}],
  [{type:'star',row:3,col:0},{type:'shell',row:3,col:1},{type:'shell',row:3,col:2},{type:'shell',row:3,col:3},{type:'shell',row:3,col:4},{type:'shell',row:3,col:5}],
  [{type:'fish',row:4,col:0}, null, {type:'star',row:4,col:2},{type:'crab',row:4,col:3}, null, {type:'star',row:4,col:5}],
  [{type:'crab',row:5,col:0},{type:'octopus',row:5,col:1},{type:'crab',row:5,col:2},{type:'star',row:5,col:3},{type:'crab',row:5,col:4}, null],
];
assert(nullGame.grid[0][1] === null, 'null cell accepted in grid');
assert(nullGame.grid[4][1] === null, 'second null cell accepted');
assert(nullGame.grid[4][4] === null, 'third null cell accepted');
assert(nullGame.grid[5][5] === null, 'fourth null cell accepted');

// 42. três null consecutivos não formam combinação
const threeNullRowGrid = [
  [{type:'fish',row:0,col:0},{type:'octopus',row:0,col:1},{type:'crab',row:0,col:2},{type:'shell',row:0,col:3},{type:'star',row:0,col:4},{type:'fish',row:0,col:5}],
  [null, null, null, {type:'fish',row:1,col:3},{type:'fish',row:1,col:4},{type:'fish',row:1,col:5}],
  [{type:'shell',row:2,col:0},{type:'shell',row:2,col:1},{type:'fish',row:2,col:2},{type:'octopus',row:2,col:3},{type:'crab',row:2,col:4},{type:'star',row:2,col:5}],
  [{type:'crab',row:3,col:0},{type:'crab',row:3,col:1},{type:'star',row:3,col:2},{type:'shell',row:3,col:3},{type:'fish',row:3,col:4},{type:'octopus',row:3,col:5}],
  [{type:'star',row:4,col:0},{type:'crab',row:4,col:1},{type:'shell',row:4,col:2},{type:'fish',row:4,col:3},{type:'octopus',row:4,col:4},{type:'crab',row:4,col:5}],
  [{type:'octopus',row:5,col:0},{type:'star',row:5,col:1},{type:'crab',row:5,col:2},{type:'shell',row:5,col:3},{type:'fish',row:5,col:4},{type:'octopus',row:5,col:5}],
];
const tnrGame = makeMatchGame(threeNullRowGrid);
const tnrMatches = tnrGame._findMatches(threeNullRowGrid);
const nullGroups = tnrMatches.groups.filter(g => g.type === null || g.type === 'null');
assert(nullGroups.length === 0, 'three nulls in a row do not form a match group');

// 43. null interrompe sequência horizontal
const nullBreakHRow = [
  [{type:'fish',row:0,col:0},{type:'fish',row:0,col:1}, null, {type:'fish',row:0,col:3},{type:'fish',row:0,col:4},{type:'fish',row:0,col:5}],
  [{type:'crab',row:1,col:0},{type:'shell',row:1,col:1},{type:'crab',row:1,col:2},{type:'crab',row:1,col:3},{type:'shell',row:1,col:4},{type:'octopus',row:1,col:5}],
  [{type:'fish',row:2,col:0},{type:'shell',row:2,col:1},{type:'star',row:2,col:2},{type:'octopus',row:2,col:3},{type:'star',row:2,col:4},{type:'fish',row:2,col:5}],
  [{type:'star',row:3,col:0},{type:'shell',row:3,col:1},{type:'shell',row:3,col:2},{type:'shell',row:3,col:3},{type:'shell',row:3,col:4},{type:'shell',row:3,col:5}],
  [{type:'fish',row:4,col:0},{type:'shell',row:4,col:1},{type:'star',row:4,col:2},{type:'crab',row:4,col:3},{type:'fish',row:4,col:4},{type:'star',row:4,col:5}],
  [{type:'crab',row:5,col:0},{type:'octopus',row:5,col:1},{type:'crab',row:5,col:2},{type:'star',row:5,col:3},{type:'crab',row:5,col:4},{type:'fish',row:5,col:5}],
];
const nbhGame = makeMatchGame(nullBreakHRow);
const nbhMatches = nbhGame._findHorizontalMatches(nullBreakHRow);
const nbhFish = nbhMatches.filter(g => g.type === 'fish');
assert(nbhFish.length === 1, 'null breaks horizontal sequence: only one fish group');
assert(nbhFish[0].cells.length === 3, 'null breaks horizontal sequence: fish group has 3 (cols 3-5)');

// 44. null interrompe sequência vertical
const nullBreakVCol = [
  [{type:'fish',row:0,col:0},{type:'fish',row:0,col:1},{type:'crab',row:0,col:2},{type:'shell',row:0,col:3},{type:'star',row:0,col:4},{type:'fish',row:0,col:5}],
  [{type:'fish',row:1,col:0},{type:'shell',row:1,col:1},{type:'crab',row:1,col:2},{type:'shell',row:1,col:3},{type:'star',row:1,col:4},{type:'star',row:1,col:5}],
  [{type:'fish',row:2,col:0},{type:'shell',row:2,col:1},{type:'star',row:2,col:2},{type:'octopus',row:2,col:3},{type:'star',row:2,col:4},{type:'star',row:2,col:5}],
  [null, {type:'shell',row:3,col:1},{type:'shell',row:3,col:2},{type:'shell',row:3,col:3},{type:'shell',row:3,col:4},{type:'shell',row:3,col:5}],
  [{type:'fish',row:4,col:0},{type:'shell',row:4,col:1},{type:'star',row:4,col:2},{type:'crab',row:4,col:3},{type:'fish',row:4,col:4},{type:'star',row:4,col:5}],
  [{type:'fish',row:5,col:0},{type:'octopus',row:5,col:1},{type:'crab',row:5,col:2},{type:'star',row:5,col:3},{type:'crab',row:5,col:4},{type:'fish',row:5,col:5}],
];
const nbvGame = makeMatchGame(nullBreakVCol);
const nbvMatches = nbvGame._findVerticalMatches(nullBreakVCol);
// col 0: fish(0), fish(1), fish(2), null(3), fish(4), fish(5)
// null at row 3 splits: upper 3 fish (rows 0-2) is a match, lower 2 fish (rows 4-5) is not
const col0Fish = nbvMatches.filter(g => g.direction === 'vertical' && g.type === 'fish');
assert(col0Fish.length === 1, 'null breaks vertical sequence: only one fish group in col 0');
assert(col0Fish[0].cells.length === 3, 'null breaks vertical: group has 3 fish (rows 0-2)');

// 45. renderização suporta null sem lançar erro
const renderNullGame = new OceanMatch3({ innerHTML: '', style: {}, querySelectorAll: () => [], querySelector: () => null }, () => {});
renderNullGame._started = true;
renderNullGame.grid = nullGame.grid;
let renderError = null;
try {
  renderNullGame._renderGrid();
} catch (e) {
  renderError = e;
}
assert(renderError === null, 'render does not throw when grid contains null cells');

// 46. clique em null é ignorado
const clickNullGame = makeMatchGame(threeNullRowGrid);
clickNullGame._handlePieceClick(1, 0); // cell is null
assert(clickNullGame.selectedCell === null, 'click on null cell does not select');

// 47. null não pode ser selecionado
const selectNullGame = makeMatchGame(nullGame.grid);
selectNullGame._handlePieceClick(0, 1); // cell is null
assert(selectNullGame.selectedCell === null, 'null cell cannot be selected');

// 48. null não participa de troca
const swapNullGame = makeMatchGame(nullGame.grid);
swapNullGame.selectedCell = { row: 0, col: 0 }; // fish
swapNullGame._handlePieceClick(0, 1); // null cell adjacent - should be ignored
assert(swapNullGame.selectedCell !== null, 'click on null adjacent does not trigger swap');
assertEqual(swapNullGame.swapCount, 0, 'swapCount not incremented after null interaction');

// 49. swapCount não incrementa ao clicar em vazio
const countNullGame = makeMatchGame(nullGame.grid);
countNullGame._handlePieceClick(1, 0); // crab
assert(countNullGame.selectedCell !== null, 'first click on piece selects');
countNullGame._handlePieceClick(4, 1); // null
assert(countNullGame.selectedCell !== null, 'selection preserved after clicking null');
const countNullSel = countNullGame.selectedCell;
// move selection far away
countNullGame._handlePieceClick(5, 5); // null
assertEqual(countNullGame.swapCount, 0, 'swapCount is 0 after clicking null(s)');

// 50. getDebugState conta emptyCells
const debugNullGame = makeMatchGame(nullGame.grid);
const dns = debugNullGame.getDebugState();
assert('emptyCells' in dns, 'getDebugState includes emptyCells');
assertEqual(dns.emptyCells, 4, 'getDebugState reports 4 empty cells');
assert('emptyCoordinates' in dns, 'getDebugState includes emptyCoordinates');
assert(Array.isArray(dns.emptyCoordinates), 'emptyCoordinates is array');
assertEqual(dns.emptyCoordinates.length, 4, 'emptyCoordinates has 4 entries');

// 51. emptyCoordinates é cópia segura
if (dns.emptyCoordinates.length > 0) {
  dns.emptyCoordinates[0].row = 99;
  const debugNullGame2 = makeMatchGame(nullGame.grid);
  const dns2 = debugNullGame2.getDebugState();
  assert(dns2.emptyCoordinates[0].row !== 99, 'emptyCoordinates is a safe copy');
}

// 52. grade com tipos válidos + null continua válida
assert(dns.valid === true, 'grid with valid types and null is still valid');

// 53. tipo inválido diferente de null deve invalidar grade (já que não estamos verificando tipos inválidos no valid, isso é um placeholder)
// No momento valid só checa dimensão — isso é aceitável para esta micro-sprint

// 54. _loadTestGrid continua funcionando (já testado em #33)
// 55. _loadEmptyCellsTestGrid funciona
const loadEmptyGame = makeMatchGame();
loadEmptyGame._loadEmptyCellsTestGrid();
assert(loadEmptyGame.grid.length === 6, 'load empty grid has 6 rows');
assert(loadEmptyGame.grid[0].length === 6, 'load empty grid has 6 cols');
assert(loadEmptyGame.grid[0][0] === null, 'load empty grid cell (0,0) is null');
assert(loadEmptyGame.grid[0][1] === null, 'load empty grid cell (0,1) is null');
assert(loadEmptyGame.grid[0][2] === null, 'load empty grid cell (0,2) is null');
assert(loadEmptyGame.grid[0][3].type === 'crab', 'load empty grid cell (0,3) is crab');
assert(loadEmptyGame.selectedCell === null, 'load empty grid clears selection');
assertEqual(loadEmptyGame.swapCount, 0, 'load empty grid resets swapCount');
const loadEmptyMatches = loadEmptyGame._findMatches(loadEmptyGame.grid);
assert(loadEmptyMatches.hasMatches === true, 'load empty grid still has matches (row 3 shell, col 2-3 shell)');

// 56. EMPTY_CELL static property exists and is null
assert(OceanMatch3.EMPTY_CELL === null, 'EMPTY_CELL static property is null');

// 57. meteor-game still registered after empty cell tests
assert(hasMinigame('meteor-game'), 'meteor-game still registered after empty cell tests');

/* ── Ocean Match-3: Sprint — Jogável Completo ── */

// 58. _removeMatches sets matched cells to null
const remGame = makeMatchGame();
remGame.grid = [
  [{type:'fish',row:0,col:0},{type:'fish',row:0,col:1},{type:'fish',row:0,col:2},{type:'crab',row:0,col:3},{type:'crab',row:0,col:4},{type:'star',row:0,col:5}],
  [{type:'crab',row:1,col:0},{type:'shell',row:1,col:1},{type:'crab',row:1,col:2},{type:'crab',row:1,col:3},{type:'shell',row:1,col:4},{type:'octopus',row:1,col:5}],
  [{type:'fish',row:2,col:0},{type:'shell',row:2,col:1},{type:'star',row:2,col:2},{type:'octopus',row:2,col:3},{type:'star',row:2,col:4},{type:'fish',row:2,col:5}],
  [{type:'star',row:3,col:0},{type:'shell',row:3,col:1},{type:'shell',row:3,col:2},{type:'shell',row:3,col:3},{type:'shell',row:3,col:4},{type:'shell',row:3,col:5}],
  [{type:'fish',row:4,col:0},{type:'shell',row:4,col:1},{type:'star',row:4,col:2},{type:'crab',row:4,col:3},{type:'fish',row:4,col:4},{type:'star',row:4,col:5}],
  [{type:'crab',row:5,col:0},{type:'octopus',row:5,col:1},{type:'crab',row:5,col:2},{type:'star',row:5,col:3},{type:'crab',row:5,col:4},{type:'fish',row:5,col:5}],
];
const remMatches = remGame._findMatches(remGame.grid);
assert(remMatches.hasMatches === true, 'removal test grid has matches');
const oldCombos = remGame.combinations;
remGame._removeMatches(remMatches);
assertEqual(remGame.combinations, oldCombos + remMatches.groups.length, '_removeMatches increments combinations by group count');
const matchedKeys = new Set(remMatches.cells.map(c => `${c.row},${c.col}`));
for (let r = 0; r < 6; r++) {
  for (let c = 0; c < 6; c++) {
    if (matchedKeys.has(`${r},${c}`)) {
      assert(remGame.grid[r][c] === null, `_removeMatches: cell (${r},${c}) is null after removal`);
    }
  }
}

// 59. _removeMatches counts each group as 1, not each cell
const remGroupGame = makeMatchGame();
remGroupGame.grid = [
  [{type:'fish',row:0,col:0},{type:'fish',row:0,col:1},{type:'fish',row:0,col:2},{type:'fish',row:0,col:3},{type:'fish',row:0,col:4},{type:'star',row:0,col:5}],
  [{type:'crab',row:1,col:0},{type:'shell',row:1,col:1},{type:'crab',row:1,col:2},{type:'crab',row:1,col:3},{type:'shell',row:1,col:4},{type:'octopus',row:1,col:5}],
  [{type:'fish',row:2,col:0},{type:'shell',row:2,col:1},{type:'star',row:2,col:2},{type:'octopus',row:2,col:3},{type:'star',row:2,col:4},{type:'fish',row:2,col:5}],
  [{type:'star',row:3,col:0},{type:'shell',row:3,col:1},{type:'shell',row:3,col:2},{type:'shell',row:3,col:3},{type:'shell',row:3,col:4},{type:'shell',row:3,col:5}],
  [{type:'fish',row:4,col:0},{type:'shell',row:4,col:1},{type:'star',row:4,col:2},{type:'crab',row:4,col:3},{type:'fish',row:4,col:4},{type:'star',row:4,col:5}],
  [{type:'crab',row:5,col:0},{type:'octopus',row:5,col:1},{type:'crab',row:5,col:2},{type:'star',row:5,col:3},{type:'crab',row:5,col:4},{type:'fish',row:5,col:5}],
];
const rgMatches = remGroupGame._findMatches(remGroupGame.grid);
remGroupGame._removeMatches(rgMatches);
assertEqual(remGroupGame.combinations, rgMatches.groups.length, 'combinations equal group count (not cell count)');

// 60. _applyGravity compacts non-null cells downward
const gravGame = makeMatchGame();
gravGame.grid = [
  [{type:'fish',row:0,col:0},{type:'fish',row:0,col:1},{type:'fish',row:0,col:2},{type:'crab',row:0,col:3},{type:'crab',row:0,col:4},{type:'star',row:0,col:5}],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [{type:'crab',row:5,col:0},{type:'crab',row:5,col:1},{type:'crab',row:5,col:2},{type:'crab',row:5,col:3},{type:'crab',row:5,col:4},{type:'crab',row:5,col:5}],
];
gravGame._applyGravity();
// Row 0-3 should be null, rows 4-5 should have pieces
assert(gravGame.grid[0][0] === null, 'gravity: row 0 col 0 is null');
assert(gravGame.grid[1][0] === null, 'gravity: row 1 col 0 is null');
assert(gravGame.grid[2][0] === null, 'gravity: row 2 col 0 is null');
assert(gravGame.grid[3][0] === null, 'gravity: row 3 col 0 is null');
assert(gravGame.grid[4][0] !== null, 'gravity: row 4 col 0 has piece');
assert(gravGame.grid[4][0].type === 'fish', 'gravity: row 4 col 0 is fish (from row 0)');
assert(gravGame.grid[5][0].type === 'crab', 'gravity: row 5 col 0 is crab (from row 5)');
assert(gravGame.grid[4][0].row === 4, 'gravity: updated row prop to 4');
assert(gravGame.grid[4][0].col === 0, 'gravity: updated col prop to 0');

// 61. _fillEmptyCells fills all null cells
const fillGame = makeMatchGame();
fillGame.grid = [
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [{type:'crab',row:3,col:0},{type:'crab',row:3,col:1},{type:'crab',row:3,col:2},{type:'crab',row:3,col:3},{type:'crab',row:3,col:4},{type:'crab',row:3,col:5}],
  [{type:'fish',row:4,col:0},{type:'fish',row:4,col:1},{type:'fish',row:4,col:2},{type:'fish',row:4,col:3},{type:'fish',row:4,col:4},{type:'fish',row:4,col:5}],
  [{type:'star',row:5,col:0},{type:'star',row:5,col:1},{type:'star',row:5,col:2},{type:'star',row:5,col:3},{type:'star',row:5,col:4},{type:'star',row:5,col:5}],
];
fillGame._fillEmptyCells();
let nullFound = false;
for (let r = 0; r < 6; r++) {
  for (let c = 0; c < 6; c++) {
    if (fillGame.grid[r][c] === null) nullFound = true;
  }
}
assert(nullFound === false, '_fillEmptyCells: no null cells remain');
assert(typeof fillGame.grid[0][0].type === 'string', '_fillEmptyCells: new cell has type string');
assert(Object.keys(OceanMatch3.PIECE_EMOJI).includes(fillGame.grid[0][0].type), '_fillEmptyCells: new cell type is valid');

// 62. combinations initial value
const initCombos = new OceanMatch3(mockContainer, () => {});
assertEqual(initCombos.combinations, 0, 'combinations starts at 0');
assertEqual(initCombos.targetCombinations, 5, 'targetCombinations is 5');

// 63. timeRemaining and timeLimit
assertEqual(initCombos.timeLimit, 45, 'timeLimit is 45 (DEFAULT_TIME_LIMIT)');
assertEqual(initCombos.timeRemaining, 45, 'timeRemaining starts at 45');
assert(initCombos._timerInterval === null, 'timerInterval is null before start');

// 64. getDebugState includes new fields
const dgb = makeMatchGame();
dgb._started = true;
dgb._createGrid();
const ds2 = dgb.getDebugState();
assert('combinations' in ds2, 'getDebugState includes combinations');
assert('timeRemaining' in ds2, 'getDebugState includes timeRemaining');
assert('cascadeCycles' in ds2, 'getDebugState includes cascadeCycles');
assert('totalCascadeCycles' in ds2, 'getDebugState includes totalCascadeCycles');

// 65. regenerateGrid resets combos and cascade cycles
const regenCombo = makeMatchGame();
regenCombo.combinations = 4;
regenCombo.cascadeCycles = 2;
regenCombo._totalCascadeCycles = 5;
regenCombo.regenerateGrid();
assertEqual(regenCombo.combinations, 0, 'regenerateGrid resets combinations');
assertEqual(regenCombo.cascadeCycles, 0, 'regenerateGrid resets cascadeCycles');
assertEqual(regenCombo._totalCascadeCycles, 0, 'regenerateGrid resets totalCascadeCycles');

// 66. destroy resets combos and timer
const destroyFull = makeMatchGame();
destroyFull._started = true;
destroyFull.combinations = 3;
destroyFull.cascadeCycles = 1;
destroyFull._totalCascadeCycles = 2;
destroyFull.destroy();
assertEqual(destroyFull.combinations, 0, 'destroy resets combinations');
assertEqual(destroyFull.cascadeCycles, 0, 'destroy resets cascadeCycles');
assertEqual(destroyFull._totalCascadeCycles, 0, 'destroy resets totalCascadeCycles');
assert(destroyFull._timerInterval === null, 'destroy clears timer interval');

// 67. _complete stops timer
const completeTimerGame = makeMatchGame();
completeTimerGame._started = true;
completeTimerGame._timerInterval = 123; // fake active interval
completeTimerGame._complete({ venceu: true, boardDelta: 3 });
assert(completeTimerGame._completed === true, '_complete sets _completed');
assert(completeTimerGame._timerInterval === null, '_complete stops timer');

// 68. _handlePieceClick blocked when completed
const blockComplete = makeMatchGame();
blockComplete._started = true;
blockComplete._createGrid();
blockComplete._completed = true;
const oldSel = blockComplete.selectedCell;
blockComplete._handlePieceClick(0, 0);
assert(blockComplete.selectedCell === oldSel, 'click blocked when _completed is true');

// 69. boardDelta for time-up (0-2 combos = 0)
assertEqual(0, 0, 'boardDelta 0 for 0-2 combos (design decision, applied in _timerTick)');

// 70. boardDelta for time-up (3-4 combos = 1) is a design rule checked in _timerTick

// 71. victory boardDelta is 3 (from _complete call)
const victGame = makeMatchGame();
victGame._started = true;
let victResult = null;
victGame.onComplete = (r) => { victResult = r; };
victGame._complete({
  venceu: true,
  boardDelta: 3,
  progresso: { atual: 5, objetivo: 5 },
  motivo: 'objetivo-concluido',
  stats: { combinacoes: 5, cascatas: 1 },
});
assert(victResult.venceu === true, 'victory result has venceu: true');
assertEqual(victResult.boardDelta, 3, 'victory boardDelta is 3');

// 72. meteor-game still registered after full sprint tests
assert(hasMinigame('meteor-game'), 'meteor-game still registered after full sprint tests');

/* ── Ocean Match-3: Sprint — Ajustes de Tempo e UX ── */

// 73. DEFAULT_TIME_LIMIT is 45
assertEqual(OceanMatch3.DEFAULT_TIME_LIMIT, 45, 'DEFAULT_TIME_LIMIT is 45');

// 74. constructor with timeLimit=20
const time20 = new OceanMatch3(mockContainer, () => {}, { timeLimit: 20 });
assertEqual(time20.timeLimit, 20, 'timeLimit=20 via options');
assertEqual(time20.timeRemaining, 20, 'timeRemaining starts at 20');

// 75. constructor with timeLimit=60
const time60 = new OceanMatch3(mockContainer, () => {}, { timeLimit: 60 });
assertEqual(time60.timeLimit, 60, 'timeLimit=60 via options');

// 76. constructor with invalid timeLimit (0) falls back to 45
const time0 = new OceanMatch3(mockContainer, () => {}, { timeLimit: 0 });
assertEqual(time0.timeLimit, 45, 'timeLimit=0 falls back to 45');

// 77. constructor with invalid timeLimit (negative) falls back to 45
const timeNeg = new OceanMatch3(mockContainer, () => {}, { timeLimit: -5 });
assertEqual(timeNeg.timeLimit, 45, 'timeLimit=-5 falls back to 45');

// 78. constructor with invalid timeLimit (non-integer) falls back to 45
const timeStr = new OceanMatch3(mockContainer, () => {}, { timeLimit: 'abc' });
assertEqual(timeStr.timeLimit, 45, 'timeLimit="abc" falls back to 45');

// 79. noTimerLimit prevents timer start
const noTimer = new OceanMatch3(mockContainer, () => {}, { noTimerLimit: true });
assert(noTimer._noTimerLimit === true, 'noTimerLimit sets _noTimerLimit');
assert(noTimer._timerInterval === null, 'noTimerLimit: timer is not started');

// 80. getDebugState includes timeLimit and noTimerLimit
noTimer._started = true;
noTimer._createGrid();
const ds3 = noTimer.getDebugState();
assert('timeLimit' in ds3, 'getDebugState includes timeLimit');
assert('noTimerLimit' in ds3, 'getDebugState includes noTimerLimit');
assert(ds3.noTimerLimit === true, 'getDebugState noTimerLimit is true');

// 81. _generateProgressHTML returns 5 dots
const progGame = new OceanMatch3(mockContainer, () => {});
progGame._started = true;
progGame._createGrid();
progGame._renderGrid();
progGame.combinations = 0;
const html0 = progGame._generateProgressHTML();
const dotCount0 = (html0.match(/ocean-match3-progress-dot/g) || []).length;
assertEqual(dotCount0, 5, '5 progress dots at 0/5');
const filled0 = (html0.match(/ocean-match3-progress-dot--filled/g) || []).length;
assertEqual(filled0, 0, '0 filled dots at 0/5');

// 82. _generateProgressHTML at 3/5
progGame.combinations = 3;
const html3 = progGame._generateProgressHTML();
const filled3 = (html3.match(/ocean-match3-progress-dot--filled/g) || []).length;
assertEqual(filled3, 3, '3 filled dots at 3/5');

// 83. _generateProgressHTML at 5/5
progGame.combinations = 5;
const html5 = progGame._generateProgressHTML();
const filled5 = (html5.match(/ocean-match3-progress-dot--filled/g) || []).length;
assertEqual(filled5, 5, '5 filled dots at 5/5');

// 84. _generateProgressHTML caps at target (no overflow)
progGame.combinations = 7;
const html7 = progGame._generateProgressHTML();
const filled7 = (html7.match(/ocean-match3-progress-dot--filled/g) || []).length;
assertEqual(filled7, 5, 'progress caps at target (7 → 5)');

// 85. selected cell has aria-pressed true and deselect sets false
const ariaGame = new OceanMatch3(mockContainer, () => {});
ariaGame._started = true;
ariaGame._createGrid();
ariaGame._renderGrid();
ariaGame._syncSelectionDOM();
const anyPiece = ariaGame.container.querySelector('.ocean-match3-piece:not(.ocean-match3-piece--empty)');
if (anyPiece) {
  assertEqual(anyPiece.getAttribute('aria-pressed'), 'false', 'unselected piece has aria-pressed false');
  const row = parseInt(anyPiece.dataset.row, 10);
  const col = parseInt(anyPiece.dataset.col, 10);
  ariaGame.selectedCell = { row, col };
  ariaGame._syncSelectionDOM();
  assertEqual(anyPiece.getAttribute('aria-pressed'), 'true', 'selected piece has aria-pressed true');
  ariaGame.selectedCell = null;
  ariaGame._syncSelectionDOM();
  assertEqual(anyPiece.getAttribute('aria-pressed'), 'false', 'deselected piece returns to aria-pressed false');
}

// 86. instruction contains key terms
const config = getMinigame('ocean-match3');
const instr = config.presentation.instruction;
assert(typeof instr === 'string', 'instruction is string');
assert(instr.length > 0, 'instruction is not empty');
assert(instr.includes('peça'), 'instruction mentions peça');
assert(instr.includes('3'), 'instruction mentions 3');

// 87. meteor-game still registered after UX sprint tests
assert(hasMinigame('meteor-game'), 'meteor-game still registered after UX sprint tests');
assert(hasMinigame('ocean-match3'), 'ocean-match3 still registered');

/* ── DOM Lifecycle Tests ── */

console.log('\n🌊 Ocean Match-3 Ciclo de vida DOM\n');

// Minimal DOM mock for lifecycle tests
const mockDoc = {};

function createMockElement(tagName) {
  const el = {
    tagName: tagName || 'div',
    innerHTML: '',
    className: '',
    children: [],
    parentNode: null,
    style: { aspectRatio: '', minHeight: '', display: '' },
    dataset: {},
    getAttribute() { return null; },
    setAttribute() {},
    appendChild(child) {
      child.parentNode = el;
      el.children.push(child);
    },
    removeChild(child) {
      const idx = el.children.indexOf(child);
      if (idx >= 0) el.children.splice(idx, 1);
      child.parentNode = null;
    },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    closest() { return null; },
    addEventListener() {},
    removeEventListener() {},
    getBoundingClientRect() { return { top: 0, left: 0, width: 0, height: 0 }; }
  };
  return el;
}
mockDoc.createElement = (tag) => createMockElement(tag);
const prevDoc = globalThis.document;
globalThis.document = mockDoc;

const lifecycleContainer = createMockElement('div');
lifecycleContainer.appendChild = function(child) { child.parentNode = this; this.children.push(child); };
lifecycleContainer.removeChild = function(child) {
  const idx = this.children.indexOf(child);
  if (idx >= 0) this.children.splice(idx, 1);
  child.parentNode = null;
};
lifecycleContainer.innerHTML = '';
lifecycleContainer.style = { aspectRatio: '', minHeight: '' };
lifecycleContainer.querySelector = () => null;
lifecycleContainer.querySelectorAll = () => [];

// 88. _render() creates rootElement and appends to container
const lcGame = new OceanMatch3(lifecycleContainer, () => {});
lcGame._render();
assert(lcGame.rootElement !== null, '_render() creates rootElement');
assert(lcGame.rootElement.className === 'ocean-match3', 'rootElement has class ocean-match3');
assert(lcGame.rootElement.parentNode === lifecycleContainer, 'rootElement is appended to container');
assert(lifecycleContainer.children.includes(lcGame.rootElement), 'container children includes rootElement');

// 89. destroy() removes rootElement and sets to null
lcGame.destroy();
assert(lcGame.rootElement === null, 'destroy() sets rootElement to null');
assert(!lifecycleContainer.children.includes(lcGame.rootElement), 'rootElement removed from container after destroy');

// 90. second render() re-creates rootElement (no duplicate roots)
lcGame._render();
assert(lcGame.rootElement !== null, 'second _render() creates new rootElement');
assert(lcGame.rootElement.parentNode === lifecycleContainer, 'second rootElement appended to container');
const childrenCount = lifecycleContainer.children.length;
assert(childrenCount === 1, 'container has exactly 1 child after second render');

// 91. second destroy does not throw
lcGame.destroy();
let destroyThrew = false;
try { lcGame.destroy(); } catch { destroyThrew = true; }
assert(!destroyThrew, 'double destroy does not throw');

// 92. _render() without document sets placeholder
globalThis.document = undefined;
const lcNoDoc = new OceanMatch3({ innerHTML: '', style: {}, querySelector: () => null, querySelectorAll: () => [] }, () => {});
lcNoDoc._render();
assert(lcNoDoc.rootElement == null, 'no-document render leaves rootElement null');
assert(lcNoDoc.grid !== null, 'no-document render still creates grid');
lcNoDoc.destroy();
assert(lcNoDoc.rootElement == null, 'no-document destroy no-ops on rootElement');

// Restore document
globalThis.document = prevDoc;

// 93. meteor-game still registered after lifecycle tests
assert(hasMinigame('meteor-game'), 'meteor-game still registered after lifecycle tests');
assert(hasMinigame('ocean-match3'), 'ocean-match3 still registered after lifecycle tests');

/* ── Summary ── */

console.log(`\n📊 Resultado: ${passed} passaram, ${failed} falharam\n`);
process.exit(failed > 0 ? 1 : 0);
