import assert from 'node:assert/strict';
import {
  InvalidCampaignError,
  MAIN_CAMPAIGN_ID,
  getCampaign,
  listCampaigns,
  projectCampaignWorldOrder,
  validateCampaign,
} from '../src/data/campaigns.js';
import {
  MAX_SCORE_PER_WORLD,
  SCORE_EVENT_TYPES,
  getFinalResult,
  hasZeroedLaraWorld,
} from '../src/adventure/adventure-scoring.js';
import {
  InvalidAdventureError,
  completeCurrentWorld,
  createAdventure,
  endAdventure,
  getAdventureMapProgress,
  getStarterForWorld,
  openCurrentWorld,
  registerScoreEvent,
  restartAdventure,
  resetCurrentWorld,
} from '../src/adventure/adventure-state.js';

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

function participants({ bot = false, sameNames = false } = {}) {
  return [
    { id: 'p1', slot: 0, name: sameNames ? 'Lara' : 'Lara', emoji: '🧒', tokenId: 'lara', isBot: false },
    { id: 'p2', slot: 1, name: sameNames ? 'Lara' : (bot ? 'Máquina' : 'Léo'), emoji: bot ? '🤖' : '🧑', tokenId: bot ? '' : 'leo', isBot: bot },
  ];
}

function adventure(options = {}) {
  return createAdventure({ campaign, participants: participants(options), initialStarterId: 'p1' });
}

function event(run, participantId, type, suffix) {
  return {
    eventId: `${run.id}:${participantId}:${suffix}`,
    worldRunId: run.id,
    worldId: run.worldId,
    participantId,
    type,
    source: { ref: suffix },
  };
}

function awardMaximum(state, run, participantId) {
  registerScoreEvent(state, event(run, participantId, SCORE_EVENT_TYPES.CHALLENGE_CORRECT, 'challenge-1'));
  registerScoreEvent(state, event(run, participantId, SCORE_EVENT_TYPES.CHALLENGE_CORRECT, 'challenge-2'));
  registerScoreEvent(state, event(run, participantId, SCORE_EVENT_TYPES.MINIGAME_WIN, 'minigame-1'));
  registerScoreEvent(state, event(run, participantId, SCORE_EVENT_TYPES.WORLD_WIN, 'world-win'));
}

console.log('\nCampaign\n');

test('main campaign has the five official worlds in order', () => {
  assert.deepEqual(campaign.worldOrder, [
    'floresta-encantada', 'dinossauros', 'galaxia-estelar', 'reino-oceanos', 'castelo-dragoes',
  ]);
  assert.equal(listCampaigns().length, 1);
  assert.equal(projectCampaignWorldOrder(campaign).at(-1).order, 5);
});

test('campaign configuration is immutable', () => {
  assert.equal(Object.isFrozen(campaign), true);
  assert.equal(Object.isFrozen(campaign.worldOrder), true);
});

test('empty, duplicate and unknown worlds are rejected', () => {
  assert.throws(() => validateCampaign({ id: 'empty', name: 'Empty', worldOrder: [] }), InvalidCampaignError);
  assert.throws(() => validateCampaign({ id: 'dup', name: 'Dup', worldOrder: ['dinossauros', 'dinossauros'] }), InvalidCampaignError);
  assert.throws(() => validateCampaign({ id: 'bad', name: 'Bad', worldOrder: ['inexistente'] }), InvalidCampaignError);
});

console.log('\nState and participants\n');

test('valid state starts at world zero with separate zero scores', () => {
  const state = adventure();
  assert.equal(state.currentWorldIndex, 0);
  assert.deepEqual(state.totalScores, { p1: 0, p2: 0 });
  assert.deepEqual(state.currentWorldScore, { p1: 0, p2: 0 });
  assert.notEqual(state.totalScores, state.currentWorldScore);
});

test('requires exactly two distinct ids and slots', () => {
  assert.throws(() => createAdventure({ campaign, participants: participants().slice(0, 1), initialStarterId: 'p1' }), InvalidAdventureError);
  const duplicateId = participants(); duplicateId[1].id = 'p1';
  assert.throws(() => createAdventure({ campaign, participants: duplicateId, initialStarterId: 'p1' }), InvalidAdventureError);
  const duplicateSlot = participants(); duplicateSlot[1].slot = 0;
  assert.throws(() => createAdventure({ campaign, participants: duplicateSlot, initialStarterId: 'p1' }), InvalidAdventureError);
  const unexpectedIds = participants(); unexpectedIds[0].id = 'player-one';
  assert.throws(() => createAdventure({ campaign, participants: unexpectedIds, initialStarterId: 'player-one' }), InvalidAdventureError);
});

test('equal names are allowed and second participant may be a bot', () => {
  const state = adventure({ bot: true, sameNames: true });
  assert.equal(state.participants[0].name, state.participants[1].name);
  assert.equal(state.participants[1].isBot, true);
  assert.equal(Object.isFrozen(state.participants[1]), true);
});

test('first participant cannot be a bot', () => {
  const invalid = participants(); invalid[0].isBot = true;
  assert.throws(() => createAdventure({ campaign, participants: invalid, initialStarterId: 'p1' }), InvalidAdventureError);
});

test('reset current world preserves scores from previous worlds and removes current earnings', () => {
  const state = adventure();
  let run = openCurrentWorld(state);
  registerScoreEvent(state, event(run, 'p1', SCORE_EVENT_TYPES.WORLD_WIN, 'win-1'));
  completeCurrentWorld(state, { winnerId: 'p1' });
  run = openCurrentWorld(state);
  registerScoreEvent(state, event(run, 'p1', SCORE_EVENT_TYPES.CHALLENGE_CORRECT, 'temporary'));
  const replacement = resetCurrentWorld(state);
  assert.deepEqual(state.totalScores, { p1: 30, p2: 0 });
  assert.deepEqual(state.currentWorldScore, { p1: 0, p2: 0 });
  assert.notEqual(replacement.id, run.id);
});

test('ending adventure clears transient world state', () => {
  const state = adventure(); openCurrentWorld(state); endAdventure(state);
  assert.equal(state.active, false);
  assert.equal(state.currentWorldRun, null);
  assert.deepEqual(state.currentWorldScore, { p1: 0, p2: 0 });
});

test('restart adventure clears totals, results and completion', () => {
  const state = adventure();
  const run = openCurrentWorld(state);
  registerScoreEvent(state, event(run, 'p1', SCORE_EVENT_TYPES.WORLD_WIN, 'win'));
  completeCurrentWorld(state, { winnerId: 'p1' });
  restartAdventure(state);
  assert.equal(state.active, true);
  assert.equal(state.currentWorldIndex, 0);
  assert.deepEqual(state.totalScores, { p1: 0, p2: 0 });
  assert.deepEqual(state.worldResults, []);
  assert.equal(state.completed, false);
  const restartedRun = openCurrentWorld(state);
  assert.notEqual(restartedRun.id, run.id);
  assert.equal(registerScoreEvent(state, event(run, 'p1', SCORE_EVENT_TYPES.CHALLENGE_CORRECT, 'late-after-restart')).reason, 'stale-world-run');
});

test('separate adventure states never reuse a world run id', () => {
  const firstState = adventure();
  const secondState = adventure();
  const firstRun = openCurrentWorld(firstState);
  const secondRun = openCurrentWorld(secondState);
  assert.notEqual(firstRun.id, secondRun.id);
  assert.equal(registerScoreEvent(secondState, event(firstRun, 'p1', SCORE_EVENT_TYPES.CHALLENGE_CORRECT, 'late-from-old-state')).reason, 'stale-world-run');
});

console.log('\nScoring and idempotency\n');

test('correct answer awards 10 and third answer reaches category limit', () => {
  const state = adventure(); const run = openCurrentWorld(state);
  assert.deepEqual(registerScoreEvent(state, event(run, 'p1', SCORE_EVENT_TYPES.CHALLENGE_CORRECT, 'q1')), { accepted: true, pointsAwarded: 10, reason: 'awarded' });
  registerScoreEvent(state, event(run, 'p1', SCORE_EVENT_TYPES.CHALLENGE_CORRECT, 'q2'));
  assert.equal(registerScoreEvent(state, event(run, 'p1', SCORE_EVENT_TYPES.CHALLENGE_CORRECT, 'q3')).reason, 'category-limit-reached');
  assert.equal(state.currentWorldScore.p1, 20);
});

test('incorrect answer and minigame loss award zero', () => {
  const state = adventure(); const run = openCurrentWorld(state);
  assert.equal(registerScoreEvent(state, event(run, 'p1', SCORE_EVENT_TYPES.CHALLENGE_INCORRECT, 'wrong')).pointsAwarded, 0);
  assert.equal(registerScoreEvent(state, event(run, 'p1', SCORE_EVENT_TYPES.MINIGAME_LOSS, 'loss')).pointsAwarded, 0);
  assert.equal(state.totalScores.p1, 0);
});

test('minigame win awards 20 once and world win awards 30 once', () => {
  const state = adventure(); const run = openCurrentWorld(state);
  assert.equal(registerScoreEvent(state, event(run, 'p1', SCORE_EVENT_TYPES.MINIGAME_WIN, 'mg1')).pointsAwarded, 20);
  assert.equal(registerScoreEvent(state, event(run, 'p1', SCORE_EVENT_TYPES.MINIGAME_WIN, 'mg2')).reason, 'category-limit-reached');
  assert.equal(registerScoreEvent(state, event(run, 'p1', SCORE_EVENT_TYPES.WORLD_WIN, 'ww1')).pointsAwarded, 30);
  assert.equal(registerScoreEvent(state, event(run, 'p1', SCORE_EVENT_TYPES.WORLD_WIN, 'ww2')).reason, 'category-limit-reached');
  assert.equal(registerScoreEvent(state, event(run, 'p2', SCORE_EVENT_TYPES.WORLD_WIN, 'ww-other-player')).reason, 'category-limit-reached');
});

test('duplicate, unknown participant and unknown event are rejected', () => {
  const state = adventure(); const run = openCurrentWorld(state);
  const scoreEvent = event(run, 'p1', SCORE_EVENT_TYPES.CHALLENGE_CORRECT, 'same');
  registerScoreEvent(state, scoreEvent);
  assert.equal(registerScoreEvent(state, scoreEvent).reason, 'duplicate-event');
  assert.equal(registerScoreEvent(state, { ...scoreEvent, eventId: 'invalid-player', participantId: 'nobody' }).reason, 'invalid-participant');
  assert.equal(registerScoreEvent(state, { ...scoreEvent, eventId: 'invalid-type', type: 'dice-value' }).reason, 'invalid-event-type');
  assert.equal(registerScoreEvent(state, { ...scoreEvent, eventId: 'invalid-world', worldId: 'inexistente' }).reason, 'invalid-world');
});

test('event from a previous run is rejected', () => {
  const state = adventure(); const oldRun = openCurrentWorld(state);
  completeCurrentWorld(state, { winnerId: 'p1' });
  openCurrentWorld(state);
  assert.equal(registerScoreEvent(state, event(oldRun, 'p1', SCORE_EVENT_TYPES.CHALLENGE_CORRECT, 'late')).reason, 'stale-world-run');
});

test('human and bot use the same scoring function', () => {
  const state = adventure({ bot: true }); const run = openCurrentWorld(state);
  assert.equal(registerScoreEvent(state, event(run, 'p1', SCORE_EVENT_TYPES.MINIGAME_WIN, 'human')).pointsAwarded, 20);
  assert.equal(registerScoreEvent(state, event(run, 'p2', SCORE_EVENT_TYPES.MINIGAME_WIN, 'bot')).pointsAwarded, 20);
});

test('maximum score is 70 per world and 350 across the campaign', () => {
  const state = adventure();
  assert.equal(MAX_SCORE_PER_WORLD, 70);
  for (let index = 0; index < campaign.worldOrder.length; index++) {
    const run = openCurrentWorld(state);
    awardMaximum(state, run, 'p1');
    assert.equal(state.currentWorldScore.p1, 70);
    completeCurrentWorld(state, { winnerId: 'p1' });
  }
  assert.equal(state.totalScores.p1, 350);
});

console.log('\nWorld lifecycle, starter and result\n');

test('world result records before, earned, after and breakdown', () => {
  const state = adventure(); const run = openCurrentWorld(state);
  registerScoreEvent(state, event(run, 'p1', SCORE_EVENT_TYPES.CHALLENGE_CORRECT, 'q1'));
  const result = completeCurrentWorld(state, { winnerId: 'p2' });
  assert.deepEqual(result.scoresBefore, { p1: 0, p2: 0 });
  assert.deepEqual(result.scoresEarned, { p1: 10, p2: 0 });
  assert.deepEqual(result.scoresAfter, { p1: 10, p2: 0 });
  assert.equal(result.eventBreakdown.length, 1);
});

test('stored world result and nested breakdown are immutable snapshots', () => {
  const state = adventure(); const run = openCurrentWorld(state);
  const source = { question: { id: 'q1' } };
  registerScoreEvent(state, { ...event(run, 'p1', SCORE_EVENT_TYPES.CHALLENGE_CORRECT, 'q1'), source });
  source.question.id = 'changed-outside';
  const result = completeCurrentWorld(state, { winnerId: 'p1' });
  assert.equal(result.eventBreakdown[0].source.question.id, 'q1');
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.scoresAfter), true);
  assert.equal(Object.isFrozen(result.eventBreakdown[0].source.question), true);
  assert.throws(() => { result.scoresAfter.p1 = 999; }, TypeError);
  assert.equal(state.worldResults[0].scoresAfter.p1, 10);
});

test('cannot complete a world twice or skip a world', () => {
  const state = adventure(); openCurrentWorld(state); completeCurrentWorld(state, { winnerId: 'p1' });
  assert.throws(() => completeCurrentWorld(state, { winnerId: 'p1' }), InvalidAdventureError);
  assert.equal(state.currentWorldIndex, 1);
  assert.equal(openCurrentWorld(state).worldId, 'dinossauros');
});

test('starter alternates across all five worlds', () => {
  const people = participants();
  assert.deepEqual([0, 1, 2, 3, 4].map(index => getStarterForWorld('p1', index, people)), ['p1', 'p2', 'p1', 'p2', 'p1']);
  assert.throws(() => getStarterForWorld('missing', 0, people), InvalidAdventureError);
});

test('fifth result completes adventure and determines winner', () => {
  const state = adventure();
  for (let index = 0; index < 5; index++) {
    const run = openCurrentWorld(state);
    if (index === 0) registerScoreEvent(state, event(run, 'p2', SCORE_EVENT_TYPES.CHALLENGE_CORRECT, 'lead'));
    completeCurrentWorld(state, { winnerId: index % 2 ? 'p2' : 'p1' });
  }
  assert.equal(state.completed, true);
  assert.equal(state.active, false);
  assert.equal(state.finalWinnerId, 'p2');
  assert.equal(getFinalResult(state).completed, true);
  assert.equal(hasZeroedLaraWorld(state, 'p2'), true);
  assert.equal(hasZeroedLaraWorld(state, 'p1'), false);
});

test('tie has no hidden tiebreak and defeat still means completion', () => {
  const state = adventure();
  for (let index = 0; index < 5; index++) {
    openCurrentWorld(state);
    completeCurrentWorld(state, { winnerId: index % 2 ? 'p2' : 'p1' });
  }
  const result = getFinalResult(state);
  assert.equal(result.completed, true);
  assert.equal(result.isTie, true);
  assert.equal(result.finalWinnerId, null);
  assert.equal(hasZeroedLaraWorld(state, 'p1'), false);
});

console.log('\nFuture map projection\n');

test('map starts with current then locked worlds', () => {
  const map = getAdventureMapProgress(adventure(), campaign);
  assert.equal(map[0].status, 'current');
  assert.equal(map.slice(1).every(item => item.status === 'locked'), true);
});

test('completed world exposes winner and next world becomes current', () => {
  const state = adventure(); openCurrentWorld(state); completeCurrentWorld(state, { winnerId: 'p2' });
  const map = getAdventureMapProgress(state, campaign);
  assert.deepEqual(map.slice(0, 3).map(item => [item.status, item.winnerId]), [
    ['completed', 'p2'], ['current', null], ['locked', null],
  ]);
});

test('all map worlds are completed at campaign end', () => {
  const state = adventure();
  for (let index = 0; index < 5; index++) {
    openCurrentWorld(state); completeCurrentWorld(state, { winnerId: 'p1' });
  }
  assert.equal(getAdventureMapProgress(state, campaign).every(item => item.status === 'completed'), true);
});

console.log(`\nAdventure foundation: ${passed} tests passed.\n`);
