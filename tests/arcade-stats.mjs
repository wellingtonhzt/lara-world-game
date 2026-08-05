import assert from 'node:assert/strict';

const STORE = {};
globalThis.localStorage = {
  getItem(key) { return Object.prototype.hasOwnProperty.call(STORE, key) ? STORE[key] : null; },
  setItem(key, value) { STORE[key] = String(value); },
  removeItem(key) { delete STORE[key]; },
};

const {
  recordGame,
  getMinigameStats,
  getWinRate,
  formatDurationMs,
  loadStats,
} = await import('../src/arcade/arcade-stats.js');

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

function clearStore() {
  for (const key of Object.keys(STORE)) delete STORE[key];
}

console.log('\nArcade stats (records e agregados por minigame)\n');

test('partida nova cria stats zerados + records vazios', () => {
  clearStore();
  const mg = getMinigameStats('dino-runner');
  assert.equal(mg.partidas, 0);
  assert.equal(mg.vitorias, 0);
  assert.deepEqual(mg.records, {});
});

test('recordGame registra partida e ultimoResultado com stats', () => {
  clearStore();
  const result = {
    venceu: false,
    boardDelta: 0,
    progresso: { atual: 0, objetivo: 1 },
    motivo: 'colisao',
    stats: { tempo: 25, pontuacao: 270, obstaculosDesviados: 18 },
  };
  recordGame('dino-runner', result, 26000);
  const mg = getMinigameStats('dino-runner');
  assert.equal(mg.partidas, 1);
  assert.equal(mg.derrotas, 1);
  assert.equal(mg.sequenciaAtual, 0);
  assert.equal(mg.ultimoResultado.stats.pontuacao, 270);
  assert.equal(mg.records.tempo, 25, 'records.tempo = maior tempo');
  assert.equal(mg.records.pontuacao, 270, 'records.pontuacao = melhor pontuacao');
  assert.equal(mg.records.obstaculosDesviados, 18, 'records.obstaculosDesviados');
});

test('records guarda apenas o maior valor por campo', () => {
  clearStore();
  recordGame('dino-runner', { venceu: false, stats: { tempo: 10, pontuacao: 100, obstaculosDesviados: 5 } }, 10000);
  recordGame('dino-runner', { venceu: false, stats: { tempo: 30, pontuacao: 90, obstaculosDesviados: 20 } }, 30000);
  recordGame('dino-runner', { venceu: false, stats: { tempo: 20, pontuacao: 320, obstaculosDesviados: 12 } }, 20000);
  const mg = getMinigameStats('dino-runner');
  assert.equal(mg.records.tempo, 30, 'records.tempo = max(10,30,20)');
  assert.equal(mg.records.pontuacao, 320, 'records.pontuacao = max(100,90,320)');
  assert.equal(mg.records.obstaculosDesviados, 20, 'records.obstaculosDesviados = max(5,20,12)');
  assert.equal(mg.partidas, 3);
});

test('vitorias/sequencia e media de tempo sao acumuladas', () => {
  clearStore();
  recordGame('ocean-match3', { venceu: true, stats: { tempo: 45 } }, 45000);
  recordGame('ocean-match3', { venceu: true, stats: { tempo: 50 } }, 50000);
  recordGame('ocean-match3', { venceu: false, stats: { tempo: 10 } }, 10000);
  const mg = getMinigameStats('ocean-match3');
  assert.equal(mg.vitorias, 2);
  assert.equal(mg.derrotas, 1);
  assert.equal(mg.sequenciaMaxima, 2);
  assert.equal(mg.sequenciaAtual, 0);
  assert.equal(mg.tempoTotalJogado, 105000);
  assert.equal(getWinRate('ocean-match3'), 67);
});

test('recordGame tolera stats ausentes', () => {
  clearStore();
  recordGame('meteor-game', { venceu: true, stats: {} }, 1000);
  const mg = getMinigameStats('meteor-game');
  assert.equal(mg.partidas, 1);
  assert.deepEqual(mg.records, {});
  recordGame('meteor-game', { venceu: true }, 1000);
  assert.equal(getMinigameStats('meteor-game').partidas, 2);
});

test('recordGame ignora valores nao numericos nos records', () => {
  clearStore();
  recordGame('memory-forest', { venceu: false, stats: { pontuacao: 'abc', tempo: NaN, obstaculosDesviados: 3 } }, 1000);
  const mg = getMinigameStats('memory-forest');
  assert.deepEqual(mg.records, { obstaculosDesviados: 3 });
});

test('dados antigos sem records sao normalizados no loadStats', () => {
  clearStore();
  STORE['lara-world-arcade-stats'] = JSON.stringify({
    version: 1,
    games: { 'dino-runner': { partidas: 5, records: undefined } },
  });
  const stats = loadStats();
  assert.deepEqual(stats.games['dino-runner'].records, {});
  const mg = getMinigameStats('dino-runner');
  assert.equal(mg.partidas, 5);
  assert.deepEqual(mg.records, {});
});

test('formatDurationMs formata segundos e minutos', () => {
  assert.equal(formatDurationMs(0), '--');
  assert.equal(formatDurationMs(15000), '15s');
  assert.equal(formatDurationMs(125000), '2m 5s');
  assert.equal(formatDurationMs(-5), '--');
});

test('partidas e estatisticas sao isoladas por minigame', () => {
  clearStore();
  recordGame('dino-runner', { venceu: false, stats: { tempo: 20 } }, 20000);
  recordGame('ataque-dragoes', { venceu: true, stats: { tempo: 5 } }, 5000);
  assert.equal(getMinigameStats('dino-runner').partidas, 1);
  assert.equal(getMinigameStats('ataque-dragoes').partidas, 1);
  assert.equal(getWinRate('dino-runner'), 0);
  assert.equal(getWinRate('ataque-dragoes'), 100);
  assert.equal(getWinRate('nao-existe'), null);
});

console.log(`\n${passed} testes passaram`);
