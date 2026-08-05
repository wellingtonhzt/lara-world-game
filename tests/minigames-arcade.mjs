import assert from 'node:assert/strict';

import { getMinigame, getProfile } from '../src/minigames/engine/index.js';
import { MeteoroGame } from '../src/minigames/meteoro/MeteoroGame.js';
import { OceanMatch3 } from '../src/minigames/ocean-match3/OceanMatch3.js';
import { MemoryGame } from '../src/minigames/memoria-floresta/MemoryGame.js';
import { AtaqueDragoesGame } from '../src/minigames/ataque-dragoes/AtaqueDragoesGame.js';
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

test('Memoria Arcade exige todos os pares e aplica bonus pelo tempo restante', () => {
  let result;
  const game = new MemoryGame(container, value => { result = value; }, {
    mode: 'arcade', params: getProfile('memory-forest', 'arcade')
  });
  game._matchedPairs = 6;
  game._timeLeft = 12;
  game._endGame();
  assert.equal(result.venceu, true);
  assert.equal(result.boardDelta, 0);
  assert.equal(result.stats.pontuacao, 720);
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

console.log(`\n${passed} testes passaram`);
