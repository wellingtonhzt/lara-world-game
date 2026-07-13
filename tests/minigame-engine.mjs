import { registerMinigame, getMinigame, hasMinigame, listMinigames, MinigameNotFoundError } from '../src/minigames/engine/minigame-registry.js';
import { normalizeMinigameResult } from '../src/minigames/engine/minigame-result.js';

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

/* ── Summary ── */

console.log(`\n📊 Resultado: ${passed} passaram, ${failed} falharam\n`);
process.exit(failed > 0 ? 1 : 0);
