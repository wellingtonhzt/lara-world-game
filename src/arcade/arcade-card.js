import { getMinigameStats, getWinRate, formatDurationMs } from './arcade-stats.js';

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderStatsHtml(mg) {
  const winRate = getWinRate(mg._id);
  const avgTime = mg.partidas > 0 ? Math.round(mg.tempoTotalJogado / mg.partidas) : 0;
  return `
    <span class="arcade-stat">🎯 ${mg.partidas} jogos</span>
    <span class="arcade-stat">🏆 ${mg.vitorias} vitórias</span>
    <span class="arcade-stat">📈 ${winRate !== null ? winRate + '%' : '--'}</span>
    <span class="arcade-stat">🔥 ${mg.sequenciaMaxima} melhor sequência</span>
    <span class="arcade-stat">⏱ ${formatDurationMs(avgTime)}</span>
  `;
}

export function createMinigameCard(minigameId, config, onSelect) {
  const icon = config.icon || '🎮';
  const name = escapeHtml(config.name || minigameId);
  const description = escapeHtml(config.description || '');
  const mg = getMinigameStats(minigameId);
  mg._id = minigameId;

  const card = document.createElement('button');
  card.className = 'arcade-card';
  card.setAttribute('data-minigame', minigameId);
  card.setAttribute('type', 'button');

  card.innerHTML = `
    <div class="arcade-card-icon">${icon}</div>
    <div class="arcade-card-name">${name}</div>
    <div class="arcade-card-description">${description}</div>
    <div class="arcade-card-stats">${renderStatsHtml(mg)}</div>
  `;

  card.addEventListener('click', () => {
    if (typeof onSelect === 'function') onSelect(minigameId, config);
  });

  return card;
}

export function updateCardStats(card, minigameId) {
  const mg = getMinigameStats(minigameId);
  mg._id = minigameId;
  const statsEl = card.querySelector('.arcade-card-stats');
  if (!statsEl) return;
  statsEl.innerHTML = renderStatsHtml(mg);
}
