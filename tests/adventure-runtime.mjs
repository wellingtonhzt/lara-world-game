import assert from 'node:assert/strict';
import fs from 'node:fs';
import { MAIN_CAMPAIGN_ID, getCampaign } from '../src/data/campaigns.js';
import { SCORE_EVENT_TYPES } from '../src/adventure/adventure-scoring.js';
import { InvalidAdventureError } from '../src/adventure/adventure-state.js';
import {
  GAME_MODES,
  StaleWorldOperationError,
  createAdventureRuntime,
  isAdventureGame,
  isQuickGame,
  toAdventureParticipants,
} from '../src/adventure/adventure-runtime.js';

let passed = 0;
function test(label, fn) {
  try {
    fn();
    passed++;
    console.log(`  PASS  ${label}`);
  } catch (error) {
    console.error(`  FAIL  ${label}`);
    throw error;
  }
}

const campaign = getCampaign(MAIN_CAMPAIGN_ID);
const resolveWorld = id => campaign.worldOrder.includes(id) ? { id, name: id } : null;
const boardPlayers = () => [
  { id: 1, name: 'Lara', emoji: '🧒', tokenId: 'lara', isBot: false, posicao: 17 },
  { id: 2, name: 'Máquina', emoji: '🤖', tokenId: '', isBot: true, posicao: 9 },
];
const participants = () => toAdventureParticipants(boardPlayers());
const start = (runtime, starter = 'p1') => runtime.startAdventure({ participants: participants(), initialStarterId: starter });

function scoringEvent(descriptor, participantId, type, suffix) {
  return {
    eventId: `${descriptor.worldRunId}:${suffix}`,
    worldRunId: descriptor.worldRunId,
    worldId: descriptor.worldId,
    participantId,
    type,
    source: { ref: suffix },
  };
}

console.log('\nAdventure runtime\n');

test('quick mode remains the default and mode predicates are explicit', () => {
  const runtime = createAdventureRuntime({ resolveWorld });
  assert.equal(runtime.getMode(), GAME_MODES.QUICK);
  assert.equal(runtime.isQuickGame(), true);
  assert.equal(isQuickGame('rapido'), true);
  assert.equal(isAdventureGame('aventura'), true);
});

test('board participants become stable adventure identities without mutating input', () => {
  const source = boardPlayers();
  const result = toAdventureParticipants(source);
  assert.deepEqual(result.map(({ id, slot, isBot }) => ({ id, slot, isBot })), [
    { id: 'p1', slot: 0, isBot: false }, { id: 'p2', slot: 1, isBot: true },
  ]);
  assert.equal(source[0].id, 1);
  assert.equal(source[0].posicao, 17);
});

test('adventure opens only the first official world and preserves selected starter', () => {
  const runtime = createAdventureRuntime({ resolveWorld });
  const descriptor = start(runtime, 'p2');
  assert.equal(descriptor.worldId, campaign.worldOrder[0]);
  assert.equal(descriptor.starterId, 'p2');
  assert.equal(descriptor.starterIndex, 1);
  assert.deepEqual(descriptor.participants.map(p => p.posicao), [0, 0]);
  assert.equal(runtime.getMapData().progress.filter(item => item.status === 'current').length, 1);
});

test('separate runtime instances do not change quick game state', () => {
  const quickRuntime = createAdventureRuntime({ resolveWorld });
  const adventureRuntime = createAdventureRuntime({ resolveWorld });
  start(adventureRuntime);
  assert.equal(quickRuntime.getMode(), GAME_MODES.QUICK);
  assert.equal(quickRuntime.hasActiveAdventure(), false);
});

test('world completion does not award implicit points', () => {
  const runtime = createAdventureRuntime({ resolveWorld });
  start(runtime);
  const completion = runtime.completeWorld({ winnerId: 'p1' });
  assert.deepEqual(completion.result.scoresEarned, { p1: 0, p2: 0 });
  assert.deepEqual(runtime.getMapData().totalScores, { p1: 0, p2: 0 });
});

test('reset removes only current-world earnings and creates a fresh run', () => {
  const runtime = createAdventureRuntime({ resolveWorld });
  let descriptor = start(runtime);
  runtime.recordScoreEvent(scoringEvent(descriptor, 'p1', SCORE_EVENT_TYPES.WORLD_WIN, 'first-win'));
  runtime.completeWorld({ winnerId: 'p1' });
  descriptor = runtime.advanceWorld();
  runtime.recordScoreEvent(scoringEvent(descriptor, 'p2', SCORE_EVENT_TYPES.CHALLENGE_CORRECT, 'temporary'));
  const replacement = runtime.resetWorld();
  assert.notEqual(replacement.worldRunId, descriptor.worldRunId);
  assert.deepEqual(runtime.getMapData().totalScores, { p1: 30, p2: 0 });
});

test('worlds cannot be advanced early, skipped, or loaded twice', () => {
  const runtime = createAdventureRuntime({ resolveWorld });
  start(runtime);
  assert.throws(() => runtime.advanceWorld(), InvalidAdventureError);
  runtime.completeWorld({ winnerId: 'p1' });
  assert.equal(runtime.advanceWorld().worldId, campaign.worldOrder[1]);
  assert.throws(() => runtime.advanceWorld(), InvalidAdventureError);
});

test('starters alternate and all five worlds complete exactly once', () => {
  const runtime = createAdventureRuntime({ resolveWorld });
  const starters = [];
  let descriptor = start(runtime);
  for (let index = 0; index < campaign.worldOrder.length; index++) {
    starters.push(descriptor.starterId);
    const completion = runtime.completeWorld({ winnerId: index % 2 ? 'p2' : 'p1' });
    if (index < campaign.worldOrder.length - 1) descriptor = runtime.advanceWorld();
    else assert.equal(completion.completed, true);
  }
  assert.deepEqual(starters, ['p1', 'p2', 'p1', 'p2', 'p1']);
  assert.equal(runtime.getMapData().progress.every(item => item.status === 'completed'), true);
  assert.throws(() => runtime.advanceWorld(), InvalidAdventureError);
  assert.throws(() => runtime.completeWorld({ winnerId: 'p1' }), InvalidAdventureError);
});

test('stale question or minigame continuations cannot affect the next run', () => {
  const runtime = createAdventureRuntime({ resolveWorld });
  const first = start(runtime);
  runtime.completeWorld({ winnerId: 'p1' });
  runtime.advanceWorld();
  let resumed = false;
  assert.equal(runtime.runIfCurrentWorld(first.worldRunId, () => { resumed = true; }), false);
  assert.equal(resumed, false);
  assert.throws(() => runtime.assertCurrentWorldRun(first.worldRunId), StaleWorldOperationError);
});

test('pending bot callback is cancelled on world reset', () => {
  let scheduled;
  let cancelled = false;
  const runtime = createAdventureRuntime({
    resolveWorld,
    scheduleTimeout(callback) { scheduled = callback; return 42; },
    cancelTimeout(id) { assert.equal(id, 42); cancelled = true; },
  });
  start(runtime);
  let played = false;
  runtime.scheduleBotForCurrentWorld(() => { played = true; }, 1000);
  runtime.resetWorld();
  assert.equal(cancelled, true);
  scheduled();
  assert.equal(played, false);
});

test('abandoning returns to quick mode and invalidates the open world', () => {
  const runtime = createAdventureRuntime({ resolveWorld });
  const descriptor = start(runtime);
  runtime.abandonAdventure();
  assert.equal(runtime.getMode(), GAME_MODES.QUICK);
  assert.equal(runtime.isCurrentWorldRun(descriptor.worldRunId), false);
  assert.throws(() => runtime.getMapData(), InvalidAdventureError);
});

test('runtime module is DOM-free', () => {
  const source = fs.readFileSync(new URL('../src/adventure/adventure-runtime.js', import.meta.url), 'utf8');
  assert.equal(/\b(document|window|localStorage)\b/.test(source), false);
});

test('game integration keeps quick victory overlay while adventure owns its entry', () => {
  const gameSource = fs.readFileSync(new URL('../src/game.js', import.meta.url), 'utf8');
  const htmlSource = fs.readFileSync(new URL('../src/index.html', import.meta.url), 'utf8');
  assert.match(gameSource, /if \(isAdventureGameSession\(\)\)[\s\S]*?completeWorldVictory\(scoreAttempt\)\.completion;[\s\S]*?updateVictoryScreen\(player\);[\s\S]*?showVictoryScreen\(\);/);
  assert.doesNotMatch(htmlSource.match(/<button id="btn-carreira"[^>]*>/)?.[0] || '', /disabled/);
  assert.match(gameSource, /getElementById\(["']btn-carreira["']\)/);
});

test('questions and minigames use the centralized score event adapter', () => {
  const source = fs.readFileSync(new URL('../src/game.js', import.meta.url), 'utf8');
  assert.match(source, /adventureScoreEvents\.resolveChallenge\(/);
  assert.match(source, /adventureScoreEvents\.resolveMinigame\(/);
  assert.doesNotMatch(source, /adventureRuntime\.recordScoreEvent\(/);
});

console.log(`\nAdventure runtime: ${passed} tests passed.\n`);
