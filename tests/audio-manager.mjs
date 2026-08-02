import assert from 'node:assert/strict';
import fs from 'node:fs';

class MockSource {
  constructor() {
    this.loop = false;
    this.started = false;
    this.stopped = false;
  }
  connect() {}
  disconnect() {}
  start() { this.started = true; }
  stop() { this.stopped = true; }
}

class MockGain {
  constructor() { this.gain = { value: 1 }; }
  connect() {}
}

class MockAudioContext {
  static instances = [];
  constructor() {
    this.state = 'running';
    this.currentTime = 0;
    this.destination = {};
    this.sources = [];
    this.resumeCalls = 0;
    MockAudioContext.instances.push(this);
  }
  createGain() { return new MockGain(); }
  createBufferSource() {
    const source = new MockSource();
    this.sources.push(source);
    return source;
  }
  async resume() {
    this.resumeCalls++;
    this.state = 'running';
  }
}

globalThis.window = { AudioContext: MockAudioContext };
globalThis.localStorage = {
  getItem() { return null; },
  setItem() {},
};

const { AudioManager } = await import('../src/audio/AudioManager.js');

let passed = 0;
async function test(label, fn) {
  await fn();
  passed++;
  console.log(`  PASS  ${label}`);
}

function manager() {
  const audio = new AudioManager();
  audio.init();
  audio._decode = async () => ({ duration: 120 });
  return audio;
}

console.log('\nAudio manager adventure recovery\n');

await test('plays effects and music with independent gain paths', async () => {
  const audio = manager();
  await audio.play('diceRoll');
  await audio.playMusic('backgroundMusic');
  assert.equal(audio._ctx.sources.length, 2);
  assert.equal(audio._musicSource.loop, true);
});

await test('recovers a suspended context before idempotent music return', async () => {
  const audio = manager();
  await audio.playMusic('backgroundMusic');
  const source = audio._musicSource;
  audio._ctx.state = 'suspended';
  await audio.playMusic('backgroundMusic');
  assert.equal(audio._ctx.state, 'running');
  assert.equal(audio._ctx.resumeCalls, 1);
  assert.equal(audio._musicSource, source);
});

await test('recovers Safari interrupted state for effects', async () => {
  const audio = manager();
  await audio.play('diceRoll');
  audio._ctx.state = 'interrupted';
  await audio.play('diceResult');
  assert.equal(audio._ctx.state, 'running');
  assert.equal(audio._ctx.resumeCalls, 1);
});

await test('restarts global music across all five adventure worlds', async () => {
  const audio = manager();
  for (let world = 1; world <= 5; world++) {
    if (world === 4) audio._ctx.state = 'suspended';
    await audio.playMusic('backgroundMusic');
    assert.equal(audio._ctx.state, 'running', `world ${world} context`);
    assert.ok(audio._musicSource?.started, `world ${world} source`);
    await audio.play('diceRoll');
    assert.ok(audio._activeEffects.diceRoll?.started, `world ${world} effect`);
    audio.stopMusic();
  }
  assert.equal(audio._ctx.resumeCalls, 1);
});

await test('pauses and resumes music around the fourth-world minigame', async () => {
  const audio = manager();
  await audio.playMusic('backgroundMusic');
  audio._ctx.currentTime = 35;
  audio.pauseMusic();
  assert.equal(audio._musicPaused, true);
  assert.equal(audio._musicSource, null);
  await audio.resumeMusic();
  assert.equal(audio._musicPaused, false);
  assert.ok(audio._musicSource?.started);
  assert.equal(audio._musicOffset, 35);
});

await test('preloads music when Adventure is selected, before opening its intro', async () => {
  const gameSource = fs.readFileSync(new URL('../src/game.js', import.meta.url), 'utf8');
  const handler = gameSource.match(/getElementById\("btn-carreira"\)\.addEventListener\("click", \(\) => \{([\s\S]*?)\n    \}\);/)?.[1] || '';
  const preloadAt = handler.indexOf("audioManager.preloadMusic('backgroundMusic')");
  const introAt = handler.indexOf('adventureScreen.showIntro');
  assert.ok(preloadAt >= 0);
  assert.ok(introAt > preloadAt);
});

console.log(`\n${passed} tests passed.\n`);
