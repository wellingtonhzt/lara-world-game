import { registerMinigame } from '../engine/index.js';
import { MeteoroGame } from './MeteoroGame.js';

const METEORO_CONFIG = Object.freeze({
  id: 'meteor-game',
  name: 'Chuva de Meteoros',
  description: 'Desvie dos meteoros coletando estrelas até acumular 3 acertos.',
  icon: '\uD83D\uDE80',
  minPlayers: 1,
  maxPlayers: 1,
  botSuccessRate: 0.40,
  autoReturnSeconds: 5,
  presentation: {
    title: 'Buraco de Minhoca',
    instruction: 'Desvie dos meteoros e sobreviva!',
    botMessage: 'A M\u00E1quina est\u00E1 atravessando a chuva de meteoros...',
    successIcon: '\uD83D\uDE80',
    successTitle: 'Miss\u00E3o conclu\u00EDda!',
    successMessage: 'Voc\u00EA atravessou a chuva de meteoros.',
    failureIcon: '\uD83D\uDCA5',
    failureTitle: 'Fim da miss\u00E3o',
    failureMessage: 'Sua nave sofreu muitos danos.'
  },
  rewards: {
    successBoardDelta: 3,
    failureBoardDelta: 0
  },
  create(options) {
    const { container, onComplete } = options;
    const game = new MeteoroGame(container, (rawResult) => {
      onComplete(adaptResult(rawResult));
    });
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

function adaptResult(raw) {
  const venceu = raw.status === 'success';
  return {
    venceu,
    boardDelta: venceu ? 3 : 0,
    progresso: {
      atual: venceu ? 3 : raw.lives ?? 0,
      objetivo: 3
    },
    motivo: venceu ? 'completo' : 'sem-vidas',
    stats: {
      vidasRestantes: raw.lives ?? 0,
      timeLeft: raw.timeLeft ?? 0,
      statusLegado: raw.status
    }
  };
}

registerMinigame(METEORO_CONFIG);
