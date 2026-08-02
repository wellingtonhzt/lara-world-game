import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createAdventureRuntime } from '../src/adventure/adventure-runtime.js';
import { createAdventureScoreEvents } from '../src/adventure/adventure-score-events.js';
import {
  buildAdventureMapModel,
  buildCampaignSummary,
  getFinalCampaignMessage,
  summarizeBreakdown,
} from '../src/adventure/adventure-screen.js';
import { MAIN_CAMPAIGN_ID, getCampaign } from '../src/data/campaigns.js';

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
const metadata = Object.freeze({
  'floresta-encantada': ['🌳', 'Floresta Encantada'],
  dinossauros: ['🦖', 'Vale dos Dinossauros'],
  'galaxia-estelar': ['🚀', 'Galáxia Estelar'],
  'reino-oceanos': ['🌊', 'Reino dos Oceanos'],
  'castelo-dragoes': ['🐉', 'Castelo dos Dragões'],
});
const resolveWorld = id => metadata[id] ? { id, icon: metadata[id][0], name: metadata[id][1] } : null;
const people = ({ bot = false } = {}) => [
  { id: 'p1', slot: 0, name: 'Lara', emoji: '🧒', tokenId: 'lara', isBot: false },
  { id: 'p2', slot: 1, name: bot ? 'Máquina' : 'Léo', emoji: bot ? '🤖' : '🧑', tokenId: bot ? '' : 'leo', isBot: bot },
];

function setup(options = {}) {
  const runtime = createAdventureRuntime({ resolveWorld });
  const events = createAdventureScoreEvents(runtime);
  runtime.startAdventure({ participants: people(options), initialStarterId: 'p1' });
  return { runtime, events };
}

function completeWorld(runtime, events, winnerId = 'p1') {
  const world = runtime.getCurrentWorld();
  const context = events.beginWorldWin({ participantId: winnerId, position: 20, turnCount: 8 });
  return events.completeWorldVictory(context).completion;
}

console.log('\nAdventure screen and flow\n');

test('initial preview contains the five official worlds in order', () => {
  const runtime = createAdventureRuntime({ resolveWorld });
  const preview = runtime.getCampaignPreview();
  assert.deepEqual(preview.progress.map(item => item.worldId), campaign.worldOrder);
  assert.deepEqual(preview.progress.map(item => item.name), Object.values(metadata).map(item => item[1]));
});

test('initial preview cannot start a world before participant setup', () => {
  const runtime = createAdventureRuntime({ resolveWorld });
  const model = buildAdventureMapModel(runtime.getCampaignPreview());
  assert.equal(model.worlds.some(world => world.actionable), false);
  assert.equal(runtime.hasActiveAdventure(), false);
});

test('active map exposes only the official current world as actionable', () => {
  const { runtime } = setup();
  const model = buildAdventureMapModel(runtime.getMapData());
  assert.deepEqual(model.worlds.filter(world => world.actionable).map(world => world.worldId), ['floresta-encantada']);
  assert.equal(model.worlds.slice(1).every(world => world.status === 'locked'), true);
});

test('completed world and next current world come from runtime projection', () => {
  const { runtime, events } = setup();
  completeWorld(runtime, events);
  const betweenWorlds = runtime.getMapData();
  assert.equal(betweenWorlds.progress[0].status, 'completed');
  assert.equal(betweenWorlds.progress[1].status, 'current');
  assert.equal(betweenWorlds.nextWorldId, 'dinossauros');
  assert.equal(betweenWorlds.nextStarterId, 'p2');
});

test('world result uses immutable score snapshot and accumulated score', () => {
  const { runtime, events } = setup();
  const completion = completeWorld(runtime, events);
  assert.equal(Object.isFrozen(completion.result), true);
  assert.equal(completion.result.scoresEarned.p1, 30);
  assert.equal(runtime.getMapData().totalScores.p1, 30);
});

test('breakdown summary is derived from accepted snapshot events', () => {
  const entries = [
    { participantId: 'p1', type: 'challenge-correct', points: 10 },
    { participantId: 'p1', type: 'minigame-win', points: 20 },
    { participantId: 'p1', type: 'world-win', points: 30 },
    { participantId: 'p2', type: 'world-win', points: 30 },
  ];
  assert.deepEqual(summarizeBreakdown(entries, 'p1'), { challenges: 1, minigames: 1, worldWins: 1, points: 60 });
});

test('map scoreboard identifies leader and explicit tie without color alone', () => {
  const { runtime } = setup();
  let data = runtime.getMapData();
  assert.equal(buildAdventureMapModel(data).scoreboard.every(item => item.leadLabel === 'Empate'), true);
  data = { ...data, totalScores: { p1: 20, p2: 0 } };
  assert.equal(buildAdventureMapModel(data).scoreboard[0].leadLabel, 'Na frente');
});

test('double advance is rejected and starter alternation remains official', () => {
  const { runtime, events } = setup();
  completeWorld(runtime, events);
  const second = runtime.advanceWorld();
  assert.equal(second.worldId, 'dinossauros');
  assert.equal(second.starterId, 'p2');
  assert.throws(() => runtime.advanceWorld());
});

test('final map has all worlds completed and never loads a sixth', () => {
  const { runtime, events } = setup();
  for (let index = 0; index < 5; index++) {
    completeWorld(runtime, events, index % 2 ? 'p2' : 'p1');
    if (index < 4) runtime.advanceWorld();
  }
  const data = runtime.getMapData();
  assert.equal(data.progress.every(world => world.status === 'completed'), true);
  assert.equal(data.nextWorldId, null);
  assert.throws(() => runtime.advanceWorld());
});

test('campaign summary counts worlds, responses and minigames from snapshots', () => {
  const { runtime, events } = setup();
  const question = events.beginChallenge({ participantId: 'p1', questionId: 'q1', cell: 4 });
  events.resolveChallenge(question, true);
  const minigame = events.beginMinigame({ participantId: 'p1', minigameId: 'memory-forest', cell: 11 });
  events.resolveMinigame(minigame, { venceu: true });
  completeWorld(runtime, events);
  const [summary] = buildCampaignSummary(runtime.getMapData());
  assert.deepEqual({ score: summary.score, worldsWon: summary.worldsWon, challenges: summary.challenges, minigames: summary.minigames }, { score: 60, worldsWon: 1, challenges: 1, minigames: 1 });
});

test('final messages cover human victory, friend defeat, bot defeat and tie', () => {
  const base = { finalResult: { isTie: false } };
  assert.match(getFinalCampaignMessage(base, people()[0]), /zerou/);
  assert.match(getFinalCampaignMessage(base, people()[1]), /amigo/);
  assert.match(getFinalCampaignMessage(base, people({ bot: true })[1]), /Máquina/);
  assert.match(getFinalCampaignMessage({ finalResult: { isTie: true } }, null), /empatados/);
});

test('restarting creates fresh scores, results and world run identity', () => {
  const { runtime, events } = setup();
  const oldRun = runtime.getCurrentWorld().worldRunId;
  completeWorld(runtime, events);
  runtime.abandonAdventure();
  runtime.startAdventure({ participants: people(), initialStarterId: 'p1' });
  assert.notEqual(runtime.getCurrentWorld().worldRunId, oldRun);
  assert.deepEqual(runtime.getMapData().totalScores, { p1: 0, p2: 0 });
  assert.deepEqual(runtime.getMapData().worldResults, []);
});

test('HTML enables one adventure button and reuses existing setup', () => {
  const html = fs.readFileSync(new URL('../src/index.html', import.meta.url), 'utf8');
  assert.equal((html.match(/id="btn-carreira"/g) || []).length, 1);
  assert.doesNotMatch(html.match(/<button id="btn-carreira"[^>]*>/)?.[0] || '', /disabled/);
  assert.match(html.match(/<button id="btn-carreira"[^>]*>/)?.[0] || '', /menu-btn-adventure/);
  assert.equal((html.match(/id="setup-screen"/g) || []).length, 1);
  assert.match(html, /Percorra todos os mundos e acumule pontos/);
});

test('game keeps quick and Arcade entry paths separate from adventure', () => {
  const source = fs.readFileSync(new URL('../src/game.js', import.meta.url), 'utf8');
  assert.match(source, /btn-rapido[\s\S]*?GAME_MODES\.QUICK[\s\S]*?showWorldSelector/);
  assert.match(source, /btn-arcade[\s\S]*?enterArcadeMode/);
  assert.match(source, /btn-carreira[\s\S]*?GAME_MODES\.ADVENTURE[\s\S]*?showIntro/);
  assert.match(source, /updateVictoryScreen\(player\);\s*showVictoryScreen\(\);/);
});

test('styles provide illustrated desktop map, vertical mobile path and reduced motion', () => {
  const css = fs.readFileSync(new URL('../src/style.css', import.meta.url), 'utf8');
  assert.match(css, /\.adventure-path\s*\{[^}]*position:\s*absolute/);
  assert.match(css, /\.adventure-world:nth-child\(4\)\s*\{[^}]*--map-x:\s*68%/);
  assert.match(css, /\.adventure-world:nth-child\(5\)\s*\{[^}]*--map-x:\s*31%/);
  assert.match(css, /\.adventure-route-segment--completed/);
  assert.match(css, /\.adventure-route-segment--locked[^}]*stroke-dasharray/);
  assert.match(css, /\.menu-btn-adventure\s*\{[^}]*background:\s*linear-gradient\([^}]*#ffd54f/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*?\.adventure-map-region\s*\{[^}]*aspect-ratio:\s*9\s*\/\s*16/);
  assert.match(css, /prefers-reduced-motion[\s\S]*?\.adventure-screen/);
});

test('map uses responsive clean landscapes with picture art direction', () => {
  const source = fs.readFileSync(new URL('../src/adventure/adventure-screen.js', import.meta.url), 'utf8');
  assert.match(source, /<picture class="adventure-map-art"/);
  assert.match(source, /media="\(max-width: 760px\)"[^>]*adventure-map-mobile\.webp/);
  assert.match(source, /adventure-map-desktop\.webp/);
  assert.match(source, /alt=""[^>]*fetchpriority="high"/);
  assert.match(source, /getCacheBust\(\)/);
});

test('adventure destinations reuse official quick-mode world artwork with safe fallback', () => {
  const source = fs.readFileSync(new URL('../src/adventure/adventure-screen.js', import.meta.url), 'utf8');
  assert.match(source, /\.world-card\[data-world=/);
  assert.match(source, /\.world-card-img/);
  assert.match(source, /decoding="async"/);
  assert.match(source, /onerror="this\.style\.display='none'"/);
  assert.match(source, /aria-hidden="true"[^>]*focusable="false"/);
});

test('scoring copy makes the two-correct-answers-per-world limit explicit', () => {
  const source = fs.readFileSync(new URL('../src/adventure/adventure-screen.js', import.meta.url), 'utf8');
  assert.match(source, /até 2 respostas corretas por participante em cada mundo/);
  assert.match(source, /Respostas pontuadas: \$\{summary\.challenges\}\/2/);
  assert.match(source, /Respostas pontuadas: \$\{item\.challenges\}\/10/);
});

console.log(`\nAdventure screen and flow: ${passed} tests passed.\n`);
