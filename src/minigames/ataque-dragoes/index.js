import { registerMinigame } from '../engine/index.js';
import { AtaqueDragoesGame } from './AtaqueDragoesGame.js';

let _cssLoaded = false;

function loadCSS() {
  if (_cssLoaded) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL('./ataque-dragoes.css', import.meta.url).href;
  document.head.appendChild(link);
  _cssLoaded = true;
}

const ATAQUE_DRAGOES_CONFIG = Object.freeze({
  id: 'ataque-dragoes',
  name: 'Ataque dos Drag\u00F5es',
  description: 'Proteja o castelo dos drag\u00F5es travessos!',
  icon: '\uD83D\uDC09',
  minPlayers: 1,
  maxPlayers: 1,
  botSuccessRate: 0.55,
  autoReturnSeconds: 5,
  presentation: {
    title: 'Ataque dos Drag\u00F5es',
    instruction: 'Toque nos drag\u00F5es antes que alcancem o castelo!',
    botMessage: '\uD83E\uDD16 A M\u00E1quina est\u00E1 protegendo o castelo...',
    successIcon: '\uD83C\uDFF0',
    successTitle: 'Castelo protegido!',
    successMessage: 'Voc\u00EA afastou todos os drag\u00F5es!',
    failureIcon: '\uD83D\uDC09',
    failureTitle: 'Os drag\u00F5es foram r\u00E1pidos',
    failureMessage: 'Tente novamente para proteger o castelo!',
  },
  rewards: {
    successBoardDelta: 3,
    failureBoardDelta: 0,
  },
  create(options) {
    loadCSS();
    const { container, onComplete } = options;
    const game = new AtaqueDragoesGame(container, onComplete);
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
    },
  },
});

registerMinigame(ATAQUE_DRAGOES_CONFIG);
