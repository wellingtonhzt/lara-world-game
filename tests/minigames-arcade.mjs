import assert from 'node:assert/strict';
import fs from 'node:fs';

import { getMinigame, getProfile } from '../src/minigames/engine/index.js';
import { MeteoroGame } from '../src/minigames/meteoro/MeteoroGame.js';
import { OceanMatch3 } from '../src/minigames/ocean-match3/OceanMatch3.js';
import { MemoryGame } from '../src/minigames/memoria-floresta/MemoryGame.js';
import { AtaqueDragoesGame } from '../src/minigames/ataque-dragoes/AtaqueDragoesGame.js';
import { PAIR_KEYS, BOARD_PAIR_KEYS } from '../src/minigames/memoria-floresta/memoryAssets.js';
import '../src/minigames/meteoro/index.js';
import '../src/minigames/ocean-match3/index.js';
import '../src/minigames/memoria-floresta/index.js';
import '../src/minigames/ataque-dragoes/index.js';

globalThis.window = { innerWidth: 1024 };
globalThis.location = { search: '' };

let passed = 0;
function test(name, fn) {
  fn();
  passed++;
  console.log(`  PASS  ${name}`);
}

const container = { style: {}, querySelector() { return null; } };

console.log('\nPerfis Arcade dos minigames\n');

test('os quatro minigames possuem perfil Arcade com pontuacao e estatisticas', () => {
  for (const id of ['meteor-game', 'ocean-match3', 'memory-forest', 'ataque-dragoes']) {
    const profile = getProfile(id, 'arcade');
    assert.ok(profile.score, `${id}: score`);
    assert.ok(profile.presentation?.title.endsWith('Arcade'), `${id}: apresentacao`);
    assert.ok(profile.resultStats.some(item => item.key === 'pontuacao'), `${id}: pontuacao no resultado`);
  }
});

test('Meteoro Arcade e infinito, progride dificuldade e reporta recordes', () => {
  const game = new MeteoroGame(container, () => {}, {
    mode: 'arcade', params: getProfile('meteor-game', 'arcade')
  });
  game.elapsed = 95;
  game.score = 123;
  game.meteorosDesviados = 7;
  assert.equal(game._getArcadeStage().name, 'Insano');
  assert.deepEqual(game._buildArcadeResult('sem-vidas').stats, {
    tempo: 95, pontuacao: 123, meteorosDesviados: 7
  });
});

test('Match-3 Arcade usa tres metas cumulativas e resultado sem mover o tabuleiro', () => {
  const game = new OceanMatch3(container, () => {}, {
    mode: 'arcade', params: getProfile('ocean-match3', 'arcade')
  });
  assert.equal(game.targetCombinations, 5);
  assert.equal(game._advanceArcadeStage(), false);
  assert.equal(game.targetCombinations, 8);
  game.score = 200;
  const result = game._buildResult(true, 'arcade-completo');
  assert.equal(result.boardDelta, 0);
  assert.equal(result.stats.pontuacao, 200);
});

test('Match-3 exige 12 movimentos validos depois de completar as metas', () => {
  let result = null;
  const profile = getProfile('ocean-match3', 'arcade');
  const game = new OceanMatch3(container, value => { result = value; }, { mode: 'arcade', params: profile });
  game._stageIndex = profile.difficulty.stages.length - 1;
  game.targetCombinations = profile.difficulty.stages.at(-1).target;
  game.combinations = game.targetCombinations;
  game._targetReached = true;
  game.validSwapCount = 11;
  assert.equal(game._completeArcadeIfReady(), false);
  assert.equal(result, null, 'nao encerra antes do minimo');
  game.validSwapCount = 12;
  assert.equal(game._completeArcadeIfReady(), true);
  assert.equal(result.venceu, true);
  assert.equal(result.stats.movimentos, 12);
});

test('Match-3 Board nao recebe minimo de movimentos e cascata pontua integralmente', () => {
  const board = new OceanMatch3(container, () => {}, { mode: 'board' });
  assert.equal(board.params, null);
  assert.equal(board._getMinMovesToWin(), 0);

  const arcade = new OceanMatch3(container, () => {}, {
    mode: 'arcade', params: getProfile('ocean-match3', 'arcade')
  });
  arcade.cascadeCycles = 3;
  arcade.grid = [[{ type: 'fish' }, { type: 'fish' }, { type: 'fish' }]];
  arcade._removeMatches({ groups: [{}, {}], cells: [] });
  assert.equal(arcade.score, 80, '2 grupos x 10 pontos x multiplicador 4');
  assert.equal(arcade.maxMultiplicador, 4);
});

test('Memoria Arcade usa 8 pares sorteados de catalogo maior e aplica bonus', () => {
  let result;
  const game = new MemoryGame(container, value => { result = value; }, {
    mode: 'arcade', params: getProfile('memory-forest', 'arcade')
  });
  const deck = game._createDeck();
  assert.ok(PAIR_KEYS.length >= 14);
  assert.equal(game._selectedPairKeys.length, 8);
  assert.equal(new Set(game._selectedPairKeys).size, 8);
  assert.equal(deck.length, 16);
  for (const key of game._selectedPairKeys) {
    assert.equal(deck.filter(item => item === key).length, 2, `${key} aparece duas vezes`);
  }
  game._matchedPairs = 8;
  game._timeLeft = 12;
  game._endGame();
  assert.equal(result.venceu, true);
  assert.equal(result.boardDelta, 0);
  assert.equal(result.stats.pontuacao, 920);
  assert.equal(result.stats.totalPares, undefined, 'resultado Arcade mantem stats curtas');
});

test('Memoria Board preserva os 6 pares oficiais e 12 cartas', () => {
  const board = new MemoryGame(container, () => {}, { mode: 'board' });
  const deck = board._createDeck();
  assert.equal(board._pairCount, 6);
  assert.equal(deck.length, 12);
  assert.deepEqual(new Set(board._selectedPairKeys), new Set(BOARD_PAIR_KEYS));
});

test('Dragoes Arcade progride por estagios e acumula score por tempo', () => {
  const game = new AtaqueDragoesGame(container, () => {}, {
    mode: 'arcade', params: getProfile('ataque-dragoes', 'arcade')
  });
  game.state = 'PLAYING';
  game.interactionLocked = false;
  game.elapsed = 45;
  game.lastSpawn = Number.POSITIVE_INFINITY;
  game.dragons = [];
  assert.equal(game._getTier().name, 'Intenso');
  game._update(1);
  assert.equal(game.score, 5);
  assert.equal(game.timeLeft, 20, 'Arcade nao consome o cronometro do board');
});

test('create conecta o contexto Arcade sem alterar a configuracao de topo', () => {
  for (const id of ['meteor-game', 'ocean-match3', 'memory-forest', 'ataque-dragoes']) {
    const config = getMinigame(id);
    assert.equal(config.rewards.successBoardDelta, 3);
    assert.notEqual(config.profiles.arcade.presentation.title, config.profiles.board.presentation.title);
  }
});

test('card final compartilhado preserva retorno, scroll e contexto Board', () => {
  const html = fs.readFileSync(new URL('../src/index.html', import.meta.url), 'utf8');
  const css = fs.readFileSync(new URL('../src/style.css', import.meta.url), 'utf8');
  const host = fs.readFileSync(new URL('../src/minigames/engine/minigame-host.js', import.meta.url), 'utf8');
  assert.match(html, /id="minigame-result-card"/);
  assert.match(html, /id="minigame-card-btn"/);
  assert.match(css, /\.minigame-result-card[\s\S]*?overflow-y:\s*auto/);
  assert.match(css, /max-height:\s*calc\(100dvh/);
  assert.match(css, /env\(safe-area-inset-bottom\)/);
  assert.match(host, /card\.scrollTop\s*=\s*0/);
  assert.match(host, /cardBtn\.scrollIntoView/);
  assert.match(host, /buttonLabel:\s*'Voltar ao tabuleiro'/);
});

console.log(`\n${passed} testes passaram`);
