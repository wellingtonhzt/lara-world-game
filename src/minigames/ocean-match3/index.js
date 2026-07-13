import { registerMinigame } from '../engine/index.js';
import { OceanMatch3 } from './OceanMatch3.js';

const OCEAN_MATCH3_CONFIG = Object.freeze({
  id: 'ocean-match3',
  name: 'Tesouro das Marés',
  description: 'Combine peças marinhas para encontrar o tesouro!',
  icon: '\uD83C\uDF0A',
  minPlayers: 1,
  maxPlayers: 1,
  botSuccessRate: 0.60,
  autoReturnSeconds: 5,
  presentation: {
    title: 'Tesouro das Marés',
    instruction: 'Clique em uma pe\u00E7a e depois em uma pe\u00E7a ao lado. Forme linhas de 3 iguais!',
    botMessage: 'A M\u00E1quina est\u00E1 procurando combina\u00E7\u00F5es no fundo do mar...',
    successIcon: '\uD83C\uDF1F',
    successTitle: 'Tesouro encontrado!',
    successMessage: 'Voc\u00EA criou combina\u00E7\u00F5es incr\u00EDveis!',
    failureIcon: '\uD83C\uDF0A',
    failureTitle: 'O tempo acabou',
    failureMessage: 'Voc\u00EA encontrou algumas combina\u00E7\u00F5es pelo caminho.'
  },
  rewards: {
    successBoardDelta: 3,
    failureBoardDelta: 0
  },
  create(options) {
    const { container, onComplete } = options;
    const debugTime = OceanMatch3.debugTimeLimit;
    const noTimerLimit = debugTime === Infinity;
    const game = new OceanMatch3(container, onComplete, {
      timeLimit: noTimerLimit ? undefined : (debugTime || undefined),
      noTimerLimit
    });
    game.start();
    return game;
  }
});

registerMinigame(OCEAN_MATCH3_CONFIG);
