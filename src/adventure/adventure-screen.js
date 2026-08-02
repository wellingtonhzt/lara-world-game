import { getCacheBust } from '../version.js';

const STATUS_LABELS = Object.freeze({
  completed: 'Concluído',
  current: 'Mundo atual',
  locked: 'Bloqueado',
});

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function cleanWorldName(name) {
  return String(name || '').replace(/^\p{Extended_Pictographic}\uFE0F?\s*/u, '').trim();
}

function getOfficialWorldImage(worldId) {
  return globalThis.document
    ?.querySelector(`.world-card[data-world="${worldId}"] .world-card-img`)
    ?.getAttribute('src') || '';
}

export function summarizeBreakdown(entries, participantId) {
  const own = (entries || []).filter(entry => entry.participantId === participantId);
  return {
    challenges: own.filter(entry => entry.type === 'challenge-correct').length,
    minigames: own.filter(entry => entry.type === 'minigame-win').length,
    worldWins: own.filter(entry => entry.type === 'world-win').length,
    points: own.reduce((total, entry) => total + entry.points, 0),
  };
}

export function buildCampaignSummary(data) {
  return data.participants.map(participant => {
    const entries = data.worldResults.flatMap(result => result.eventBreakdown);
    return {
      ...participant,
      score: data.totalScores[participant.id] || 0,
      worldsWon: data.worldResults.filter(result => result.winnerId === participant.id).length,
      ...summarizeBreakdown(entries, participant.id),
    };
  });
}

export function buildAdventureMapModel(data) {
  const scores = (data.participants || []).map(item => data.totalScores[item.id] || 0);
  const topScore = scores.length ? Math.max(...scores) : 0;
  const tied = scores.length > 1 && scores.every(score => score === scores[0]);
  return {
    worlds: data.progress.map(world => ({
      ...world,
      statusLabel: STATUS_LABELS[world.status],
      actionable: world.status === 'current' && !!data.currentWorldId,
    })),
    scoreboard: (data.participants || []).map(participant => ({
      ...participant,
      score: data.totalScores[participant.id] || 0,
      leadLabel: tied ? 'Empate' : ((data.totalScores[participant.id] || 0) === topScore ? 'Na frente' : ''),
    })),
  };
}

export function getFinalCampaignMessage(data, winner) {
  if (data.finalResult.isTie) return 'Vocês completaram toda a aventura e terminaram empatados!';
  if (!winner.isBot && winner.slot === 0) return 'Você completou todos os mundos e zerou o Lara World!';
  if (winner.isBot) return 'Aventura concluída! Que tal tentar superar a Máquina na próxima?';
  return 'Aventura concluída! Desta vez, seu amigo fez mais pontos.';
}

function renderWorldPath(progress, participants) {
  const names = Object.fromEntries((participants || []).map(item => [item.id, item.name]));
  const routeSegments = progress.slice(1).map((world, index) => {
    const previous = progress[index];
    const state = world.status === 'completed'
      ? 'completed'
      : (world.status === 'current' || (index === 0 && previous.status === 'current')) ? 'current' : 'locked';
    const paths = [
      'M 18 34 C 29 31, 38 41, 49 36',
      'M 49 36 C 60 42, 70 29, 82 35',
      'M 82 35 C 88 49, 76 59, 68 72',
      'M 68 72 C 56 79, 43 74, 31 73',
    ];
    const mobilePoints = [[30, 11], [65, 30], [38, 49], [64, 68], [40, 88]];
    const [fromX, fromY] = mobilePoints[index];
    const [toX, toY] = mobilePoints[index + 1];
    return { state, desktopPath: paths[index], mobilePath: `M ${fromX} ${fromY} C ${fromX} ${fromY + 8}, ${toX} ${toY - 8}, ${toX} ${toY}` };
  });
  const desktopRoute = routeSegments.map(segment => `<path class="adventure-route-segment adventure-route-segment--${segment.state}" d="${segment.desktopPath}" pathLength="100" />`).join('');
  const mobileRoute = routeSegments.map(segment => `<path class="adventure-route-segment adventure-route-segment--${segment.state}" d="${segment.mobilePath}" pathLength="100" />`).join('');
  return `<div class="adventure-map-region">
    <picture class="adventure-map-art" aria-hidden="true">
      <source media="(max-width: 760px)" srcset="assets/images/adventure/adventure-map-mobile.webp?${getCacheBust()}">
      <img src="assets/images/adventure/adventure-map-desktop.webp?${getCacheBust()}" alt="" decoding="async" fetchpriority="high">
    </picture>
    <svg class="adventure-route adventure-route--desktop" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">${desktopRoute}</svg>
    <svg class="adventure-route adventure-route--mobile" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">${mobileRoute}</svg>
    <ol class="adventure-path" aria-label="Percurso da aventura">
    ${progress.map((world, index) => {
      const status = STATUS_LABELS[world.status] || world.status;
      const winner = world.winnerId ? `<span class="adventure-world-winner">Venceu: ${escapeHtml(names[world.winnerId] || world.winnerId)}</span>` : '';
      const image = getOfficialWorldImage(world.worldId);
      return `<li class="adventure-world adventure-world--${escapeHtml(world.status)}" aria-label="${escapeHtml(cleanWorldName(world.name))}: ${escapeHtml(status)}">
        <span class="adventure-world-order">${world.order}</span>
        <span class="adventure-world-art" aria-hidden="true">
          <span class="adventure-world-icon">${escapeHtml(world.icon)}</span>
          ${image ? `<img src="${escapeHtml(image)}" alt="" decoding="async" onerror="this.style.display='none'">` : ''}
        </span>
        <strong class="adventure-world-name">${escapeHtml(cleanWorldName(world.name))}</strong>
        <span class="adventure-world-status">${world.status === 'completed' ? '✅ Concluído' : world.status === 'current' ? '📍 Você está aqui' : '🔒 Bloqueado'}</span>
        ${winner}
      </li>`;
    }).join('')}
    </ol>
  </div>`;
}

function renderScoreboard(data) {
  if (!data.participants?.length) return '';
  const scores = data.participants.map(item => data.totalScores[item.id] || 0);
  const top = Math.max(...scores);
  const tied = scores.every(score => score === scores[0]);
  return `<section class="adventure-scoreboard" aria-labelledby="adventure-score-title">
    <h2 id="adventure-score-title">Placar acumulado</h2>
    <div class="adventure-score-list">
      ${data.participants.map(participant => {
        const score = data.totalScores[participant.id] || 0;
        const lead = tied ? 'Empate' : score === top ? 'Na frente' : '';
        return `<article class="adventure-score-card ${lead === 'Na frente' ? 'is-leading' : ''}">
          <span class="adventure-score-avatar" aria-hidden="true">${escapeHtml(participant.emoji)}</span>
          <strong>${escapeHtml(participant.name)}</strong>
          <span class="adventure-score-points">${score} pontos</span>
          ${lead ? `<span class="adventure-score-lead">${lead}</span>` : ''}
        </article>`;
      }).join('')}
    </div>
  </section>`;
}

export function createAdventureScreen({ root, onStartSetup, onStartNextWorld, onExit, onRestart }) {
  if (!root) throw new Error('Adventure screen root is required');
  const content = root.querySelector('#adventure-screen-content') || root;
  let lastView = null;
  let actionLocked = false;

  root.addEventListener('keydown', event => {
    if (event.key !== 'Tab' || root.classList.contains('hidden')) return;
    const buttons = [...content.querySelectorAll('button:not([disabled])')];
    if (!buttons.length) return;
    const first = buttons[0];
    const last = buttons.at(-1);
    if (event.shiftKey && (document.activeElement === first || document.activeElement === content)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  function bindAction(id, callback) {
    const button = content.querySelector(`#${id}`);
    if (!button) return;
    button.addEventListener('click', async () => {
      if (actionLocked) return;
      actionLocked = true;
      button.disabled = true;
      try { await callback(); } finally { actionLocked = false; }
    });
  }

  function open(html, view) {
    lastView = view;
    actionLocked = false;
    content.innerHTML = html;
    root.classList.remove('hidden');
    requestAnimationFrame(() => content.focus());
  }

  function hide() {
    root.classList.add('hidden');
    content.innerHTML = '';
    lastView = null;
    actionLocked = false;
  }

  function showIntro(data) {
    open(`<div class="adventure-panel adventure-panel--map">
      <header class="adventure-heading">
        <span class="adventure-kicker">Uma jornada por Lara World</span>
        <h1 id="adventure-title">🗺️ Modo Aventura</h1>
        <p>Viaje pelos cinco mundos, supere desafios e acumule pontos.</p>
      </header>
      ${renderWorldPath(data.progress, [])}
      <section class="adventure-rules" aria-labelledby="adventure-rules-title">
        <h2 id="adventure-rules-title">Como marcar pontos</h2>
        <ul><li>✅ Resposta correta <strong>+10</strong> <small>(até 2)</small></li><li>🎮 Minigame vencido <strong>+20</strong></li><li>🏆 Vitória no mundo <strong>+30</strong></li></ul>
        <p>São pontuadas até 2 respostas corretas por participante em cada mundo. Complete os cinco mundos e termine com mais pontos para zerar o Lara World.</p>
      </section>
      <div class="adventure-actions"><button id="adventure-start-btn" class="btn btn-primary">Começar aventura</button><button id="adventure-exit-btn" class="btn btn-secondary">Voltar ao menu</button></div>
    </div>`, 'intro');
    bindAction('adventure-start-btn', onStartSetup);
    bindAction('adventure-exit-btn', () => onExit({ needsConfirmation: false }));
  }

  function showMap(data) {
    const next = data.progress.find(item => item.worldId === data.nextWorldId);
    open(`<div class="adventure-panel adventure-panel--map">
      <header class="adventure-heading"><span class="adventure-kicker">A jornada continua</span><h1 id="adventure-title">Mapa da Aventura</h1><p>Escolha continuar quando todos estiverem prontos.</p></header>
      ${renderScoreboard(data)}${renderWorldPath(data.progress, data.participants)}
      <div class="adventure-actions"><button id="adventure-next-btn" class="btn btn-primary">Ir para ${escapeHtml(cleanWorldName(next?.name))}</button><button id="adventure-exit-btn" class="btn btn-secondary">Sair para o menu</button></div>
    </div>`, 'map');
    bindAction('adventure-next-btn', onStartNextWorld);
    bindAction('adventure-exit-btn', () => showExitConfirmation(data));
  }

  function participantResult(result, participant, totalScores) {
    const summary = summarizeBreakdown(result.eventBreakdown, participant.id);
    return `<article class="adventure-result-player">
      <header><span aria-hidden="true">${escapeHtml(participant.emoji)}</span><strong>${escapeHtml(participant.name)}</strong></header>
      <div class="adventure-result-points">+${result.scoresEarned[participant.id] || 0} neste mundo</div>
      <ul><li>✅ Respostas pontuadas: ${summary.challenges}/2</li><li>🎮 Minigames: ${summary.minigames}</li><li>🏆 Vitória: ${summary.worldWins}</li></ul>
      <strong>Total: ${totalScores[participant.id] || 0}</strong>
    </article>`;
  }

  function showWorldResult({ result, data }) {
    const world = data.progress.find(item => item.worldId === result.worldId);
    const winner = data.participants.find(item => item.id === result.winnerId);
    const final = data.completed;
    const next = data.progress.find(item => item.worldId === data.nextWorldId);
    const starter = data.participants.find(item => item.id === data.nextStarterId);
    open(`<div class="adventure-panel adventure-panel--result" aria-live="polite">
      <header class="adventure-heading"><span class="adventure-kicker">Mundo concluído</span><h1 id="adventure-title">${escapeHtml(world?.icon)} ${escapeHtml(cleanWorldName(world?.name))}</h1><p>🏆 ${escapeHtml(winner?.name)} venceu este mundo!</p></header>
      <div class="adventure-result-grid">${data.participants.map(item => participantResult(result, item, data.totalScores)).join('')}</div>
      ${final ? '<p class="adventure-next-note">Os cinco mundos foram concluídos!</p>' : `<p class="adventure-next-note">Próximo: <strong>${escapeHtml(cleanWorldName(next?.name))}</strong>. ${escapeHtml(starter?.name)} começará.</p>`}
      <div class="adventure-actions"><button id="adventure-result-continue" class="btn btn-primary">${final ? 'Ver resultado final' : 'Ver mapa'}</button><button id="adventure-exit-btn" class="btn btn-secondary">Sair para o menu</button></div>
    </div>`, 'world-result');
    bindAction('adventure-result-continue', () => final ? showFinal(data) : showMap(data));
    bindAction('adventure-exit-btn', () => showExitConfirmation(data));
  }

  function showFinal(data) {
    const summaries = buildCampaignSummary(data);
    const winner = summaries.find(item => item.id === data.finalResult.finalWinnerId);
    open(`<div class="adventure-panel adventure-panel--final" aria-live="polite">
      <header class="adventure-heading"><span class="adventure-kicker">Campanha concluída</span><h1 id="adventure-title">🎉 Aventura completa!</h1><p>${escapeHtml(getFinalCampaignMessage(data, winner))}</p></header>
      ${renderWorldPath(data.progress, data.participants)}
      <div class="adventure-final-grid">${summaries.map(item => `<article class="adventure-final-card ${winner?.id === item.id ? 'is-winner' : ''}"><span aria-hidden="true">${escapeHtml(item.emoji)}</span><h2>${escapeHtml(item.name)}</h2><strong>${item.score} pontos</strong><ul><li>Mundos vencidos: ${item.worldsWon}</li><li>Respostas pontuadas: ${item.challenges}/10</li><li>Minigames vencidos: ${item.minigames}</li></ul>${winner?.id === item.id ? '<span class="adventure-final-badge">🏆 Maior pontuação</span>' : ''}</article>`).join('')}</div>
      <div class="adventure-actions"><button id="adventure-restart-btn" class="btn btn-primary">Jogar aventura novamente</button><button id="adventure-exit-btn" class="btn btn-secondary">Voltar ao menu</button></div>
    </div>`, 'final');
    bindAction('adventure-restart-btn', onRestart);
    bindAction('adventure-exit-btn', () => onExit({ needsConfirmation: false }));
  }

  function showExitConfirmation(data, onStay) {
    const returnView = lastView;
    open(`<div class="adventure-panel adventure-panel--confirm" role="dialog" aria-modal="true" aria-labelledby="adventure-title"><span class="adventure-confirm-icon" aria-hidden="true">🧭</span><h1 id="adventure-title">Sair da aventura?</h1><p>O progresso desta campanha será perdido.</p><div class="adventure-actions"><button id="adventure-confirm-stay" class="btn btn-primary">Continuar jogando</button><button id="adventure-confirm-exit" class="btn btn-secondary">Sair para o menu</button></div></div>`, 'confirm');
    bindAction('adventure-confirm-stay', () => onStay ? onStay() : (returnView === 'world-result' ? showWorldResult({ result: data.worldResults.at(-1), data }) : showMap(data)));
    bindAction('adventure-confirm-exit', () => onExit({ needsConfirmation: true }));
  }

  return Object.freeze({
    showIntro,
    showMap,
    showWorldResult,
    showFinal,
    showExitConfirmation,
    hide,
    isVisible: () => !root.classList.contains('hidden'),
    getView: () => lastView,
  });
}
