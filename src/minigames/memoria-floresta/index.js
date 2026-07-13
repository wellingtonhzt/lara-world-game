import { registerMinigame } from '../engine/index.js';
import { MemoryGame } from './MemoryGame.js';

let _cssLoaded = false;

function loadCSS() {
  if (_cssLoaded) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL('./memoryGame.css', import.meta.url).href;
  document.head.appendChild(link);
  _cssLoaded = true;
}

const MEMORY_FOREST_CONFIG = Object.freeze({
  id: 'memory-forest',
  name: 'Jogo da Mem\u00F3ria da Floresta',
  description: 'Encontre os pares de cartas da floresta!',
  icon: '\uD83C\uDF32',
  minPlayers: 1,
  maxPlayers: 1,
  botSuccessRate: 0.65,
  autoReturnSeconds: 5,
  presentation: {
    title: 'Jogo da Mem\u00F3ria da Floresta',
    instruction: 'Encontre pelo menos 4 dos 6 pares de cartas da floresta!',
    botMessage: '\uD83E\uDD16 A m\u00E1quina est\u00E1 jogando o Jogo da Mem\u00F3ria...',
    successIcon: '\uD83C\uDF1F',
    successTitle: 'Mem\u00F3ria incr\u00EDvel!',
    successMessage: 'Voc\u00EA encontrou pares suficientes na floresta!',
    failureIcon: '\uD83C\uDF32',
    failureTitle: 'Tempo esgotado',
    failureMessage: 'Voc\u00EA encontrou alguns pares pelo caminho.'
  },
  rewards: {
    successBoardDelta: 3,
    failureBoardDelta: 0
  },
  create(options) {
    loadCSS();
    const { container, onComplete } = options;
    const game = new MemoryGame(container, onComplete);
    game.start();
    return game;
  },
  botPresentation: {
    start(instance) {
      if (instance && typeof instance.startBotPreview === 'function') {
        instance.startBotPreview();
      }
    },
    stop(instance) {
      if (instance && typeof instance.stopBotPreview === 'function') {
        instance.stopBotPreview();
      }
    }
  }
});

registerMinigame(MEMORY_FOREST_CONFIG);
