import assert from 'node:assert/strict';
import { MAIN_CAMPAIGN_ID, getCampaign } from '../src/data/campaigns.js';
import { createAdventureRuntime } from '../src/adventure/adventure-runtime.js';
import { createAdventureScoreEvents } from '../src/adventure/adventure-score-events.js';

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
const resolveWorld = id => campaign.worldOrder.includes(id) ? { id } : null;
const participants = ({ bot = false, sameNames = false } = {}) => [
  { id: 'p1', slot: 0, name: 'Lara', emoji: '🧒', tokenId: 'lara', isBot: false },
  { id: 'p2', slot: 1, name: sameNames ? 'Lara' : (bot ? 'Máquina' : 'Léo'), emoji: bot ? '🤖' : '🧑', tokenId: bot ? '' : 'leo', isBot: bot },
];

function setup(options = {}) {
  const runtime = createAdventureRuntime({ resolveWorld });
  const events = createAdventureScoreEvents(runtime);
  const world = runtime.startAdventure({ participants: participants(options), initialStarterId: 'p1' });
  return { runtime, events, world };
}

function challenge(events, participantId, questionId, cell = 4) {
  return events.beginChallenge({ participantId, questionId, cell });
}

function minigame(events, participantId, minigameId = 'meteor-game', cell = 8) {
  return events.beginMinigame({ participantId, minigameId, cell });
}

function winContext(events, participantId, position = 20, turnCount = 9) {
  return events.beginWorldWin({ participantId, position, turnCount });
}

console.log('\nAdventure score events\n');

test('quick mode rejects scoring without creating adventure state', () => {
  const runtime = createAdventureRuntime({ resolveWorld });
  const events = createAdventureScoreEvents(runtime);
  assert.equal(events.beginChallenge({ participantId: 'p1', questionId: 'q1', cell: 1 }), null);
  assert.equal(events.resolveChallenge(null, true).reason, 'not-adventure-mode');
  assert.equal(runtime.hasActiveAdventure(), false);
});

test('first two correct answers award 10 and third distinct answer reaches the cap', () => {
  const { runtime, events } = setup();
  assert.equal(events.resolveChallenge(challenge(events, 'p1', 'q1'), true).pointsAwarded, 10);
  assert.equal(events.resolveChallenge(challenge(events, 'p1', 'q2'), true).pointsAwarded, 10);
  assert.equal(events.resolveChallenge(challenge(events, 'p1', 'q3'), true).reason, 'category-limit-reached');
  assert.equal(runtime.getMapData().currentWorldScore.p1, 20);
});

test('incorrect answer awards zero and is absent from positive breakdown', () => {
  const { runtime, events } = setup();
  const result = events.resolveChallenge(challenge(events, 'p1', 'q1'), false);
  assert.deepEqual(result, { accepted: true, pointsAwarded: 0, reason: 'no-points' });
  assert.deepEqual(runtime.getMapData().currentWorldBreakdown, []);
});

test('repeated challenge callback is credited once', () => {
  const { runtime, events } = setup();
  const attempt = challenge(events, 'p1', 'q1');
  assert.equal(events.resolveChallenge(attempt, true).pointsAwarded, 10);
  assert.equal(events.resolveChallenge(attempt, true).reason, 'duplicate-event');
  assert.equal(runtime.getMapData().currentWorldScore.p1, 10);
});

test('human, bot and equal names remain separated by participant id', () => {
  const { runtime, events } = setup({ bot: true, sameNames: true });
  events.resolveChallenge(challenge(events, 'p1', 'q-human'), true);
  events.resolveChallenge(challenge(events, 'p2', 'q-bot'), true);
  assert.deepEqual(runtime.getMapData().currentWorldScore, { p1: 10, p2: 10 });
});

test('minigame win awards 20 and loss awards zero even with positive board delta', () => {
  const { runtime, events } = setup();
  assert.equal(events.resolveMinigame(minigame(events, 'p1'), { venceu: true }).pointsAwarded, 20);
  assert.equal(events.resolveMinigame(minigame(events, 'p2'), { venceu: false, boardDelta: 3 }).pointsAwarded, 0);
  assert.deepEqual(runtime.getMapData().currentWorldScore, { p1: 20, p2: 0 });
  assert.equal(runtime.getMapData().currentWorldBreakdown.length, 1);
});

test('duplicate minigame callback and second distinct win cannot exceed category cap', () => {
  const { runtime, events } = setup();
  const first = minigame(events, 'p1');
  assert.equal(events.resolveMinigame(first, { venceu: true }).pointsAwarded, 20);
  assert.equal(events.resolveMinigame(first, { venceu: true }).reason, 'duplicate-event');
  assert.equal(events.resolveMinigame(minigame(events, 'p1', 'dino-runner'), { venceu: true }).reason, 'category-limit-reached');
  assert.equal(runtime.getMapData().currentWorldScore.p1, 20);
});

test('bot minigame result uses the same event API', () => {
  const { runtime, events } = setup({ bot: true });
  assert.equal(events.resolveMinigame(minigame(events, 'p2'), { venceu: true, stats: {} }).pointsAwarded, 20);
  assert.equal(runtime.getMapData().currentWorldScore.p2, 20);
});

test('world win awards 30 before immutable world snapshot', () => {
  const { events } = setup();
  const resolved = events.completeWorldVictory(winContext(events, 'p1'));
  assert.equal(resolved.score.pointsAwarded, 30);
  assert.equal(resolved.completion.result.scoresEarned.p1, 30);
  assert.equal(resolved.completion.result.eventBreakdown.at(-1).type, 'world-win');
  assert.equal(Object.isFrozen(resolved.completion.result.eventBreakdown), true);
});

test('duplicate world victory is rejected without another completion', () => {
  const { events } = setup();
  const context = winContext(events, 'p1');
  assert.ok(events.completeWorldVictory(context).completion);
  const duplicate = events.completeWorldVictory(context);
  assert.equal(duplicate.score.reason, 'stale-world-run');
  assert.equal(duplicate.completion, null);
});

test('late challenge and minigame results from previous world award zero', () => {
  const { runtime, events } = setup();
  const oldQuestion = challenge(events, 'p1', 'q-old');
  const oldGame = minigame(events, 'p2');
  events.completeWorldVictory(winContext(events, 'p1'));
  runtime.advanceWorld();
  assert.equal(events.resolveChallenge(oldQuestion, true).reason, 'stale-world-run');
  assert.equal(events.resolveMinigame(oldGame, { venceu: true }).reason, 'stale-world-run');
});

test('return to menu and a new adventure invalidate old callbacks', () => {
  const { runtime, events } = setup();
  const oldAttempt = challenge(events, 'p1', 'q-old');
  runtime.abandonAdventure();
  assert.equal(events.resolveChallenge(oldAttempt, true).reason, 'adventure-not-active');
  runtime.startAdventure({ participants: participants(), initialStarterId: 'p1' });
  assert.equal(events.resolveChallenge(oldAttempt, true).reason, 'stale-world-run');
});

test('late bot timer context cannot score after reset', () => {
  const { runtime, events } = setup({ bot: true });
  const botAttempt = challenge(events, 'p2', 'q-bot');
  runtime.resetWorld();
  assert.equal(events.resolveChallenge(botAttempt, true).reason, 'stale-world-run');
  assert.equal(runtime.getMapData().currentWorldScore.p2, 0);
});

test('maximum is 70 per world and next world starts local score at zero', () => {
  const { runtime, events } = setup();
  events.resolveChallenge(challenge(events, 'p1', 'q1'), true);
  events.resolveChallenge(challenge(events, 'p1', 'q2'), true);
  events.resolveMinigame(minigame(events, 'p1'), { venceu: true });
  const completed = events.completeWorldVictory(winContext(events, 'p1'));
  assert.equal(completed.completion.result.scoresEarned.p1, 70);
  runtime.advanceWorld();
  assert.deepEqual(runtime.getMapData().currentWorldScore, { p1: 0, p2: 0 });
  assert.deepEqual(runtime.getMapData().totalScores, { p1: 70, p2: 0 });
});

test('campaign maximum is 350 and fifth-world win adds no extra final bonus', () => {
  const { runtime, events } = setup();
  let last;
  for (let index = 0; index < campaign.worldOrder.length; index++) {
    events.resolveChallenge(challenge(events, 'p1', `q${index}-1`), true);
    events.resolveChallenge(challenge(events, 'p1', `q${index}-2`), true);
    events.resolveMinigame(minigame(events, 'p1'), { venceu: true });
    last = events.completeWorldVictory(winContext(events, 'p1'));
    if (index < campaign.worldOrder.length - 1) runtime.advanceWorld();
  }
  assert.equal(last.completion.result.scoresAfter.p1, 350);
  assert.equal(last.completion.finalResult.totalScores.p1, 350);
  assert.equal(last.completion.result.eventBreakdown.length, 4);
  assert.equal(events.completeWorldVictory(winContext(events, 'p1')).score.pointsAwarded, 0);
});

test('positive breakdown contains participant, points, source and deterministic event ids only', () => {
  const { runtime, events } = setup();
  const accepted = challenge(events, 'p1', 'q1', 6);
  events.resolveChallenge(accepted, true);
  events.resolveChallenge(challenge(events, 'p1', 'wrong'), false);
  const [entry] = runtime.getMapData().currentWorldBreakdown;
  assert.equal(entry.eventId, `${accepted.worldRunId}:p1:challenge:1`);
  assert.equal(entry.participantId, 'p1');
  assert.equal(entry.points, 10);
  assert.deepEqual(entry.source, { questionId: 'q1', cell: 6, attempt: 1 });
});

console.log(`\nAdventure score events: ${passed} tests passed.\n`);
