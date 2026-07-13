import { getMinigame } from './minigame-registry.js';
import { normalizeMinigameResult } from './minigame-result.js';

const DEFAULT_AUTO_RETURN = 5;
const DEFAULT_BOT_DELAY = 6000;

export function launchMinigameHost(id, options = {}) {
  const { isBot = false, playerName = 'Jogador' } = options;

  const config = getMinigame(id);
  const pres = config.presentation || {};
  const rewards = config.rewards || {};
  const autoReturn = config.autoReturnSeconds ?? DEFAULT_AUTO_RETURN;
  const botRate = config.botSuccessRate ?? 0.5;
  const successDelta = rewards.successBoardDelta ?? 3;
  const failureDelta = rewards.failureBoardDelta ?? 0;

  const overlay = document.getElementById('minigame-overlay');
  const container = document.getElementById('minigame-container');
  const playPhase = document.getElementById('minigame-phase-play');
  const header = document.querySelector('#minigame-phase-play .minigame-header');
  const titleEl = document.getElementById('minigame-title');
  const instrEl = document.getElementById('minigame-instructions');
  const botBar = document.getElementById('minigame-bot-bar');
  const botText = document.getElementById('minigame-bot-text');
  const skipBtn = document.getElementById('minigame-skip-btn');
  const card = document.getElementById('minigame-result-card');
  const cardIcon = document.getElementById('minigame-card-icon');
  const cardTitle = document.getElementById('minigame-card-title');
  const cardDesc = document.getElementById('minigame-card-desc');
  const bonusEl = document.getElementById('minigame-card-bonus');
  const bonusValue = document.getElementById('minigame-card-bonus-value');
  const cardBtn = document.getElementById('minigame-card-btn');
  const countdownEl = document.getElementById('minigame-card-countdown');

  if (!card) {
    throw new Error('[MinigameHost] #minigame-result-card n\u00E3o encontrado no DOM. Um minigame pode t\u00EA-lo destru\u00EDdo.');
  }

  titleEl.textContent = pres.title || config.name || 'Minigame';
  instrEl.textContent = pres.instruction || '';

  playPhase.classList.remove('hidden');
  header.classList.remove('hidden');
  botBar.classList.add('hidden');
  card.classList.add('hidden');
  bonusEl.classList.add('hidden');
  overlay.classList.remove('hidden');
  container.innerHTML = '';
  container.appendChild(card);

  return new Promise((resolve) => {
    let gameInstance = null;
    let resolved = false;
    let autoTimer = null;
    let countdownInterval = null;

    function cleanup() {
      if (autoTimer) { clearTimeout(autoTimer); autoTimer = null; }
      if (countdownInterval) { clearInterval(countdownInterval); countdownInterval = null; }
      if (gameInstance && typeof gameInstance.stop === 'function') { gameInstance.stop(); }
      gameInstance = null;
    }

    function resolveWith(result) {
      if (resolved) return;
      resolved = true;
      cleanup();
      card.classList.add('hidden');
      header.classList.remove('hidden');
      overlay.classList.add('hidden');
      resolve(result);
    }

    function showResult(result) {
      if (result.venceu) {
        cardIcon.textContent = pres.successIcon || '\uD83D\uDE80';
        cardTitle.textContent = pres.successTitle || 'Miss\u00E3o conclu\u00EDda!';
        cardDesc.textContent = pres.successMessage || '';
        if (result.boardDelta > 0) {
          bonusEl.classList.remove('hidden');
          bonusValue.textContent = `+${result.boardDelta} ${result.boardDelta > 1 ? 'casas' : 'casa'}`;
        }
      } else {
        cardIcon.textContent = pres.failureIcon || '\uD83D\uDCA5';
        cardTitle.textContent = pres.failureTitle || 'Fim da miss\u00E3o';
        cardDesc.textContent = pres.failureMessage || '';
      }
      card.classList.remove('hidden');
    }

    function startReturnCountdown(result) {
      let count = autoReturn;
      countdownEl.textContent = `Voltando ao tabuleiro em ${count}...`;
      countdownEl.classList.remove('hidden');
      cardBtn.onclick = () => {
        if (countdownInterval) { clearInterval(countdownInterval); countdownInterval = null; }
        countdownEl.classList.add('hidden');
        resolveWith(result);
      };
      countdownInterval = setInterval(() => {
        count--;
        if (count <= 0) {
          clearInterval(countdownInterval);
          countdownInterval = null;
          countdownEl.classList.add('hidden');
          resolveWith(result);
        } else {
          countdownEl.textContent = `Voltando ao tabuleiro em ${count}...`;
        }
      }, 1000);
    }

    function onGameComplete(rawResult) {
      if (resolved) return;
      header.classList.add('hidden');
      botBar.classList.add('hidden');
      const normalized = normalizeMinigameResult(rawResult);
      showResult(normalized);
      startReturnCountdown(normalized);
    }

    function autoResolveBot() {
      if (resolved) return;
      const sucesso = Math.random() < botRate;
      const delta = sucesso ? successDelta : failureDelta;
      const result = normalizeMinigameResult({
        venceu: sucesso,
        boardDelta: delta,
        progresso: { atual: sucesso ? 3 : 0, objetivo: 3 },
        motivo: sucesso ? 'completo' : 'sem-vidas',
        stats: {}
      });
      cleanup();
      header.classList.add('hidden');
      botBar.classList.add('hidden');
      showResult(result);
      startReturnCountdown(result);
    }

    gameInstance = config.create({
      container,
      onComplete: onGameComplete
    });

    if (isBot) {
      botBar.classList.remove('hidden');
      if (botText && pres.botMessage) {
        botText.textContent = pres.botMessage;
      }
      skipBtn.onclick = () => {
        if (autoTimer) { clearTimeout(autoTimer); autoTimer = null; }
        autoResolveBot();
      };
      autoTimer = setTimeout(() => autoResolveBot(), DEFAULT_BOT_DELAY);
    }
  });
}
