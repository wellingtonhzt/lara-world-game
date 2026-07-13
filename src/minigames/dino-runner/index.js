import { registerMinigame } from '../engine/index.js';
import { DinoRunnerGame } from './DinoRunnerGame.js';

const DINO_RUNNER_CONFIG = Object.freeze({
  id: 'dino-runner',
  name: 'Dino Runner',
  description: 'Corra com o dinossauro! Desvie dos obst\u00E1culos e sobreviva por 30 segundos.',
  icon: '\uD83E\uDD96',
  minPlayers: 1,
  maxPlayers: 1,
  botSuccessRate: 0.40,
  autoReturnSeconds: 5,
  presentation: {
    title: 'Dino Runner',
    instruction: 'Pressione Espa\u00E7o, Seta para Cima ou clique para pular!',
    botMessage: 'A M\u00E1quina est\u00E1 correndo com o dinossauro...',
    successIcon: '\uD83E\uDD96',
    successTitle: 'Sobreviveu!',
    successMessage: 'O dinossauro escapou de todos os obst\u00E1culos!',
    failureIcon: '\uD83E\uDEA8',
    failureTitle: 'Fim da corrida',
    failureMessage: 'O dinossauro esbarrou em um obst\u00E1culo.'
  },
  rewards: {
    successBoardDelta: 3,
    failureBoardDelta: 0
  },
  create(options) {
    const { container, onComplete } = options;
    const game = new DinoRunnerGame(container, (rawResult) => {
      onComplete(rawResult);
    });
    game.start();
    return game;
  },
  botPresentation: {
    start() {},
    stop() {}
  }
});

registerMinigame(DINO_RUNNER_CONFIG);
