import { get, getDefault, random } from './engine/world-registry.js';
import { loadAllWorlds } from './worlds/loader.js';
// florestaMisteriosa removido — a casa 11 agora usa o minigame memory-forest

import { audioManager } from './audio/index.js';
import { launchMinigameHost } from './minigames/engine/index.js';
import { OceanMatch3 } from './minigames/ocean-match3/OceanMatch3.js';
import './minigames/engine/loader.js';
import { bancoQuestoes, questoesDisponiveis, categoryIndices, worldCategoryMap, getIndicesPorMundo, getCategoriasPorMundo } from './data/questions.js';
import { APP_VERSION } from './version.js';

(function () {
  const TOTAL_CASAS = 20;
  const PLAYER_COUNT = 2;

  /* ── Players ── */
  const players = [
    { id: 1, name: 'Lara', emoji: '🧒', posicao: 0, rodadasPerdidas: 0, element: null, isBot: false, tokenId: 'lara' },
    { id: 2, name: 'Amigo', emoji: '🧑', posicao: 0, rodadasPerdidas: 0, element: null, isBot: false, tokenId: 'leo' },
  ];

  const gameState = {
    currentPlayerIndex: 0,
    jogoAtivo: true,
    jogoFinalizado: false,
    isMoving: false,
    questoesUsadas: new Set(),
    activeSubworldId: null,
    subworldEntry: { 1: null, 2: null },
    entrouNoPortal: false,
  };

  let selectedWorldId = null;
  let currentWorldConfig = null;
  let isSinglePlayer = false;
  let selectedLayoutId = null;
  let botTurnScheduled = false;
  let modoJogo = null;
  let drawState = { rolls: [null, null], drawWinnerIndex: null };

  /* ── Subworld config map ── */

  const subworldConfigs = {
    // Nenhum subworld ativo no momento
  };

  /* ── Subworld helpers ── */

  function getSubworldConfig() {
    return gameState.activeSubworldId ? subworldConfigs[gameState.activeSubworldId] : null;
  }

  function getPortalConfigForCell(cell) {
    const portals = currentWorldConfig?.portals;
    if (!portals) return null;
    return portals.find(p => p.sourceCell === cell) || null;
  }

  /* ── World-aware helpers ── */

  function getTotalCasas() {
    const sw = getSubworldConfig();
    if (sw) return sw.board.totalCells;
    const cfg = currentWorldConfig;
    return (cfg && cfg.board && cfg.board.totalCells) || TOTAL_CASAS;
  }
  function getCasasEspeciais() {
    const sw = getSubworldConfig();
    if (sw) return eventsToSpecialCells(sw.events);
    if (currentWorldConfig && currentWorldConfig.events) {
      return eventsToSpecialCells(currentWorldConfig.events);
    }
    return casasEspeciais;
  }
  function getPosicoes() {
    const sw = getSubworldConfig();
    if (sw) {
      const board = sw.board;
      if (board.cells) {
        const map = {};
        for (const c of board.cells) map[c.id] = { x: c.x, y: c.y };
        return map;
      }
      return board.positions || boardPositions;
    }
    const activeLayout = getActiveBoardLayout();
    if (activeLayout) {
      const map = {};
      for (const c of activeLayout.cells) map[c.id] = { x: c.x, y: c.y };
      return map;
    }
    const board = currentWorldConfig?.board;
    if (!board) return boardPositions;
    if (board.cells) {
      const map = {};
      for (const c of board.cells) map[c.id] = { x: c.x, y: c.y };
      return map;
    }
    return board.positions || boardPositions;
  }
  function getIcones() {
    const sw = getSubworldConfig();
    if (sw) return sw.board.cellIcons;
    const cfg = currentWorldConfig;
    return (cfg && cfg.board && cfg.board.cellIcons) || icons;
  }

  /* ── Board Layout System ── */

  function getActiveBoardLayout() {
    const board = currentWorldConfig?.board;
    if (!board || !board.layouts) return null;
    if (selectedLayoutId && board.layouts[selectedLayoutId]) {
      return board.layouts[selectedLayoutId];
    }
    return board.layouts[board.defaultLayout] || null;
  }

  function loadLayoutPreference(worldId) {
    try {
      const raw = localStorage.getItem('boardLayoutPrefs');
      const prefs = raw ? JSON.parse(raw) : {};
      return prefs[worldId] || null;
    } catch { return null; }
  }

  function saveLayoutPreference(worldId, layoutId) {
    try {
      const raw = localStorage.getItem('boardLayoutPrefs');
      const prefs = raw ? JSON.parse(raw) : {};
      prefs[worldId] = layoutId;
      localStorage.setItem('boardLayoutPrefs', JSON.stringify(prefs));
    } catch { /* silencioso */ }
  }

  function applyLayout(layoutId) {
    const board = currentWorldConfig?.board;
    if (!board || !board.layouts || !board.layouts[layoutId]) return;
    if (gameState.activeSubworldId) return;
    selectedLayoutId = layoutId;
    renderizarTrilha();
    renderSvgPath();
    players.forEach(p => positionPlayerAt(p.posicao, p));
    updateUI();
  }

  function eventsToSpecialCells(events) {
    const result = {};
    if (!events) return result;
    for (const [key, list] of Object.entries(events)) {
      const cell = Number(key);
      if (!Array.isArray(list) || list.length === 0) continue;
      const ev = list[0];
      const d = ev.description || '';
      switch (ev.type) {
        case 'move':
          if (ev.params && ev.params.delta > 0) result[cell] = { tipo: 'avancar', valor: ev.params.delta, descricao: d };
          else if (ev.params && ev.params.delta < 0) result[cell] = { tipo: 'voltar', valor: Math.abs(ev.params.delta), descricao: d };
          break;
        case 'challenge': result[cell] = { tipo: 'desafio', descricao: d }; break;
        case 'extraTurn': result[cell] = { tipo: 'jogar-novamente', valor: 0, descricao: d }; break;
        case 'skipTurn': result[cell] = { tipo: 'perde-rodada', valor: 0, descricao: d }; break;
        case 'portal': result[cell] = { tipo: 'portal', descricao: d }; break;
        case 'resetPosition': result[cell] = { tipo: 'voltar-inicio', valor: 0, descricao: d }; break;
        case 'finishWorld': result[cell] = { tipo: 'vitoria', valor: 0, descricao: d }; break;
        case 'shortcut': result[cell] = { tipo: 'atalho', valor: ev.params?.bonusCells ?? 0, descricao: d }; break;
        case 'worldExit': result[cell] = { tipo: 'saida-mundo', valor: ev.params?.bonusCells ?? 0, descricao: d }; break;
        case 'swap-positions': result[cell] = { tipo: 'swap-positions', descricao: d }; break;
        case 'buraco-minhoca': result[cell] = { tipo: 'buraco-minhoca', descricao: d }; break;
        case 'dino-runner': result[cell] = { tipo: 'dino-runner', descricao: d }; break;
        case 'recife-placeholder': result[cell] = { tipo: 'recife-placeholder', descricao: d }; break;
        case 'memory-forest': result[cell] = { tipo: 'memory-forest', descricao: d }; break;
        case 'ataque-dragoes': result[cell] = { tipo: 'ataque-dragoes', descricao: d }; break;
        case 'placeholder': result[cell] = { tipo: 'placeholder', descricao: d }; break;
      }
    }
    return result;
  }

  const casasEspeciais = {
    3: { tipo: "avancar", valor: 2, descricao: "Avance 2 casas!" },
    4: { tipo: "desafio", descricao: "Desafio!" },
    5: { tipo: "voltar", valor: 1, descricao: "Volte 1 casa!" },
    7: { tipo: "desafio", descricao: "Desafio!" },
     8: { tipo: "jogar-novamente", valor: 0, descricao: "Jogue novamente!" },
     10: { tipo: "perde-rodada", valor: 0, descricao: "Perdeu uma rodada!" },
     11: { tipo: "memory-forest", descricao: "🧠 Jogo da Mem\u00F3ria" },
     12: { tipo: "desafio", descricao: "Desafio!" },
    15: { tipo: "voltar-inicio", valor: 0, descricao: "Volte para o início!" },
    16: { tipo: "desafio", descricao: "Desafio!" },
    18: { tipo: "desafio", descricao: "Desafio!" },
    20: { tipo: "vitoria", valor: 0, descricao: "🏆 Chegada!" },
  };

  const icons = [
    "🌟", "🌸", "🌈", "⭐", "🦋",
    "🍀", "🎈", "🐱", "🍭", "🎀",
    "🌻", "🐰", "🍬", "🦄", "🎪",
    "🐼", "🍉", "🐶", "🎠", "👑",
  ];

  const boardPositions = {
    1:  { x: 10, y: 10 },
    2:  { x: 26, y: 10 },
    3:  { x: 42, y: 10 },
    4:  { x: 58, y: 10 },
    5:  { x: 74, y: 10 },
    6:  { x: 74, y: 28 },
    7:  { x: 58, y: 28 },
    8:  { x: 42, y: 28 },
    9:  { x: 26, y: 28 },
    10: { x: 10, y: 28 },
    11: { x: 10, y: 46 },
    12: { x: 26, y: 46 },
    13: { x: 42, y: 46 },
    14: { x: 58, y: 46 },
    15: { x: 74, y: 46 },
    16: { x: 74, y: 64 },
    17: { x: 58, y: 64 },
    18: { x: 42, y: 64 },
    19: { x: 26, y: 64 },
    20: { x: 10, y: 82 },
  };

  /* ── Player Helpers ── */

  function getCurrentPlayer() {
    return players[gameState.currentPlayerIndex];
  }

  function getPlayerElement(player) {
    return player.element;
  }

  function switchTurn() {
    if (PLAYER_COUNT < 2) return;
    gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % PLAYER_COUNT;
  }

  function updateUI() {
    const p = getCurrentPlayer();
    if (elements.currentPlayerName) {
      elements.currentPlayerName.textContent = p.name;
    }
    if (elements.p1Pos) elements.p1Pos.textContent = players[0].posicao;
    if (elements.p2Pos) elements.p2Pos.textContent = players[1].posicao;
    if (elements.p1Label) elements.p1Label.textContent = players[0].name;
    if (elements.p2Label) elements.p2Label.textContent = players[1].name;

    const turnEmoji = document.getElementById("turn-emoji");
    const turnImg = document.getElementById("turn-img");
    const p1Emoji = document.getElementById("p1-status-emoji");
    const p1Img = document.getElementById("p1-status-img");
    const p2Emoji = document.getElementById("p2-status-emoji");
    const p2Img = document.getElementById("p2-status-img");
    applyVisualFallback(turnEmoji, turnImg, p.emoji, p.tokenId ? `assets/tokens/${p.tokenId}.webp` : null);
    applyVisualFallback(p1Emoji, p1Img, players[0].emoji, players[0].tokenId ? `assets/tokens/${players[0].tokenId}.webp` : null);
    applyVisualFallback(p2Emoji, p2Img, players[1].emoji, players[1].tokenId ? `assets/tokens/${players[1].tokenId}.webp` : null);

    renderBoardToken(0);
    renderBoardToken(1);
  }

  function applyVisualFallback(emojiEl, imgEl, emoji, imgSrc) {
    if (emojiEl) emojiEl.textContent = emoji;
    if (!imgEl) return;

    if (imgSrc) {
      imgEl.onload = function () {
        if (emojiEl) emojiEl.style.display = 'none';
        imgEl.style.display = 'block';
      };
      imgEl.onerror = function () {
        imgEl.style.display = 'none';
        if (emojiEl) emojiEl.style.display = '';
      };
      imgEl.src = imgSrc;
    } else {
      imgEl.style.display = 'none';
      if (emojiEl) emojiEl.style.display = '';
    }
  }

  function renderBoardToken(idx) {
    const el = idx === 0 ? elements.lara : elements.laraP2;
    if (!el) return;
    const player = players[idx];
    const emojiSpan = el.querySelector('.token-emoji');
    const imgEl = el.querySelector('.token-img');
    if (!emojiSpan || !imgEl) return;
    const imgSrc = player.tokenId ? `assets/tokens/${player.tokenId}.webp` : null;
    applyVisualFallback(emojiSpan, imgEl, player.emoji, imgSrc);
  }

  const elements = {
    track: document.getElementById("track"),
    trackContainer: document.getElementById("track-container"),
    lara: document.getElementById("lara"),
    laraP2: document.getElementById("lara-p2"),
    trailPath: document.getElementById("trail-path"),
    diceDisplay: document.getElementById("dice-display"),
    diceValue: document.getElementById("dice-value"),
    history: document.getElementById("history"),
    rollBtn: document.getElementById("roll-btn"),
    resetBtn: document.getElementById("reset-btn"),
    currentPlayerName: document.getElementById("current-player-name"),
    p1Pos: document.getElementById("p1-pos"),
    p2Pos: document.getElementById("p2-pos"),
    p1Label: document.getElementById("p1-label"),
    p2Label: document.getElementById("p2-label"),
    victoryOverlay: document.getElementById("victory-overlay"),
    victoryMessage: document.getElementById("victory-message"),
    victoryPlayAgainBtn: document.getElementById("victory-play-again-btn"),
    victoryMainMenuBtn: document.getElementById("victory-main-menu-btn"),
  };

  players[0].element = elements.lara;
  players[1].element = elements.laraP2;

  /* ── Helpers ── */

  function delay(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  /* ── SVG Path ── */

  function renderSvgPath() {
    const posicoes = getPosicoes();
    const sorted = Object.keys(posicoes)
      .sort((a, b) => a - b)
      .map((k) => posicoes[k]);

    const n = sorted.length;
    if (n < 2) return;

    let d = `M ${sorted[0].x},${sorted[0].y}`;

    for (let i = 0; i < n - 1; i++) {
      const p0 = sorted[Math.max(0, i - 1)];
      const p1 = sorted[i];
      const p2 = sorted[i + 1];
      const p3 = sorted[Math.min(n - 1, i + 2)];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }

    if (elements.trailPath) {
      elements.trailPath.setAttribute("d", d);
    }
  }

  /* ── Board ── */

  function renderizarTrilha() {
    elements.track.innerHTML = "";
    const total = getTotalCasas();
    const especiais = getCasasEspeciais();
    const posicoes = getPosicoes();
    const icones = getIcones();
    for (let i = 1; i <= total; i++) {
      const pos = posicoes[i];

      const casa = document.createElement("div");
      casa.className = "casa";
      casa.id = `casa-${i}`;
      casa.dataset.position = i;
      casa.style.left = pos.x + "%";
      casa.style.top = pos.y + "%";

      const info = especiais[i];
      if (info) {
        casa.classList.add(info.tipo === "vitoria" ? "casa-vitoria" : "casa-especial");
      }

      const icone = document.createElement("span");
      icone.className = "casa-icone";
      icone.textContent = icones[i - 1] || "⬜";

      const numero = document.createElement("span");
      numero.className = "casa-numero";
      numero.textContent = i;

      const tipo = document.createElement("span");
      tipo.className = "casa-tipo";
      if (info) {
        tipo.textContent = info.descricao;
      }

      casa.appendChild(icone);
      casa.appendChild(numero);
      casa.appendChild(tipo);
      elements.track.appendChild(casa);
    }
  }

  /* ── Player Positioning ── */

  function positionPlayerAt(casaNumero, player) {
    const p = player || getCurrentPlayer();
    const el = getPlayerElement(p);
    if (!el) return;

    if (casaNumero < 1 || casaNumero > getTotalCasas()) {
      el.classList.remove("visivel");
      return;
    }

    const cell = document.getElementById(`casa-${casaNumero}`);
    if (!cell) return;

    if (gameState.activeSubworldId && p.id !== getCurrentPlayer().id) {
      el.classList.remove("visivel");
      return;
    }

    el.classList.add("visivel");

    const container = document.getElementById("track-container");
    const cRect = container.getBoundingClientRect();
    const cellRect = cell.getBoundingClientRect();

    const laraW = el.offsetWidth;
    const laraH = el.offsetHeight;

    let offsetX = 0;
    let offsetY = 0;

    players.forEach(other => {
      if (other.id !== p.id && other.posicao === casaNumero) {
        offsetX = p.id === 1 ? -12 : 12;
        offsetY = p.id === 1 ? -8 : 8;
      }
    });

    el.style.left =
      cellRect.left - cRect.left + (cellRect.width - laraW) / 2 + offsetX + "px";
    el.style.top =
      cellRect.top - cRect.top + (cellRect.height - laraH) / 2 - 6 + offsetY + "px";
  }

  /* ── Animation ── */

  async function animatePlayerMovement(from, to, customPlayer) {
    if (from === to) return;

    const step = from < to ? 1 : -1;
    const positions = [];
    for (let p = from + step; step > 0 ? p <= to : p >= to; p += step) {
      positions.push(p);
    }

    const player = customPlayer || getCurrentPlayer();
    const el = getPlayerElement(player);

    for (const pos of positions) {
      if (pos >= 1 && pos <= getTotalCasas()) {
        positionPlayerAt(pos, player);
        el.classList.remove("animar-lara-pos");
        void el.offsetWidth;
        el.classList.add("animar-lara-pos");
        audioManager.play('playerMove');
      }
      await delay(180);
    }

    player.posicao = to;
  }

  /* ── Dice ── */

  function getDadoEmoji(valor) {
    return ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"][valor - 1] || "🎲";
  }

  async function animateDice(valor) {
    return new Promise((resolve) => {
      const values = [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6];
      let idx = 0;

      elements.diceDisplay.classList.add("animar-dado");

      const iv = setInterval(() => {
        elements.diceDisplay.textContent = getDadoEmoji(values[idx]);
        idx++;
        if (idx >= values.length) {
          clearInterval(iv);
          elements.diceDisplay.textContent = getDadoEmoji(valor);
          elements.diceValue.textContent = valor;
          elements.diceDisplay.classList.remove("animar-dado");
          setTimeout(resolve, 250);
        }
      }, 80);
    });
  }

  /* ── History ── */

  function addHistory(texto, tipo) {
    const p = document.createElement("p");
    p.className = "hist-item";
    const cls = tipo === "dado" ? "hist-dado"
      : tipo === "especial" ? "hist-especial"
      : tipo === "vitoria" ? "hist-vitoria"
      : "hist-info";
    p.innerHTML = `<span class="${cls}">${texto}</span>`;
    elements.history.appendChild(p);
    elements.history.scrollTop = elements.history.scrollHeight;
  }

  function clearHistory() {
    elements.history.innerHTML = "";
  }

  /* ── Special Cells ── */

  function sortearQuestao() {
    const mundoId = gameState.activeSubworldId || selectedWorldId;
    const eligibleIndices = getIndicesPorMundo(mundoId) ?? questoesDisponiveis.map((_, i) => i);
    const usadas = gameState.questoesUsadas;
    let pool = eligibleIndices.filter(i => !usadas.has(i));
    if (pool.length === 0) {
      usadas.clear();
      if (eligibleIndices.length < 5) {
        pool = questoesDisponiveis.map((_, i) => i).filter(i => !usadas.has(i));
        if (pool.length === 0) {
          usadas.clear();
          pool = questoesDisponiveis.map((_, i) => i);
        }
      } else {
        pool = eligibleIndices;
      }
    }
    const idx = pool[Math.floor(Math.random() * pool.length)];
    usadas.add(idx);
    return questoesDisponiveis[idx];
  }

  async function processSpecialCell(posicao, _cascadeVisited = new Set()) {
    const player = getCurrentPlayer();
    const info = getCasasEspeciais()[posicao];
    if (!info) return false;
    if (_cascadeVisited.has(posicao)) return false;
    _cascadeVisited.add(posicao);

    switch (info.tipo) {
      case "avancar": {
        const destino = Math.min(posicao + info.valor, getTotalCasas());
        audioManager.play('specialAdvance');
        addHistory(`\u2B50 ${info.descricao} \u2192 casa ${destino}`, "especial");
        await animatePlayerMovement(posicao, destino);
        player.posicao = destino;
        if (player.posicao >= getTotalCasas()) {
          if (gameState.activeSubworldId) return await handleBoardLimitReached();
          await handleVictory();
          return false;
        }
        if (getCasasEspeciais()[player.posicao]) {
          return await processSpecialCell(player.posicao, _cascadeVisited);
        }
        return false;
      }
      case "voltar": {
        const destino = Math.max(posicao - info.valor, 0);
        audioManager.play('specialBack');
        addHistory(`\uD83D\uDC22 ${info.descricao} \u2192 casa ${destino}`, "especial");
        if (destino > 0) {
          await animatePlayerMovement(posicao, destino);
        }
        player.posicao = destino;
        positionPlayerAt(destino);
        if (player.posicao > 0 && getCasasEspeciais()[player.posicao]) {
          return await processSpecialCell(player.posicao, _cascadeVisited);
        }
        return false;
      }
      case "jogar-novamente": {
        addHistory(`🎯 ${info.descricao}`, "especial");
        return true;
      }
      case "portal": {
        audioManager.play('portal');
        const entrou = await resolvePortal();
        if (entrou) {
          const portalCfg = getPortalConfigForCell(player.posicao);
          const swId = portalCfg?.targetWorldId;
          const swCfg = swId ? subworldConfigs[swId] : null;
          const swName = swCfg?.name || 'Submundo';
          const swClass = swCfg?.theme?.cssClass;
          gameState.subworldEntry[player.id] = player.posicao;
          gameState.activeSubworldId = swId;
          player.posicao = 0;
          renderizarTrilha();
          renderSvgPath();
          if (swClass) elements.trackContainer.classList.add(swClass);
          const indicator = document.getElementById("world-indicator");
          indicator.textContent = swCfg?.ui?.worldIndicator || swName;
          indicator.classList.remove("hidden");
          players.forEach(p => positionPlayerAt(p.posicao, p));
          updateUI();
          addHistory(`✦ ${player.name} entrou em ${swName}!`, "especial");
          gameState.entrouNoPortal = true;
          gameState.isMoving = false;
          elements.rollBtn.disabled = false;
          updateUI();
          return true;
        } else {
          addHistory(`\u279E ${player.name} seguiu no tabuleiro principal.`, "info");
          return false;
        }
      }
      case "atalho": {
        const bonusA = info.valor ?? 0;
        const entradaA = gameState.subworldEntry[player.id];
        const swCfgA = getSubworldConfig();
        const principalTotal = (currentWorldConfig && currentWorldConfig.board && currentWorldConfig.board.totalCells) || TOTAL_CASAS;
        const destinoA = Math.min(entradaA + bonusA, principalTotal);
        gameState.activeSubworldId = null;
        gameState.subworldEntry[player.id] = null;
        player.posicao = destinoA;
        renderizarTrilha();
        renderSvgPath();
        if (swCfgA?.theme?.cssClass) elements.trackContainer.classList.remove(swCfgA.theme.cssClass);
        document.getElementById("world-indicator").classList.add("hidden");
        players.forEach(p => positionPlayerAt(p.posicao, p));
        updateUI();
        addHistory(`🔀 ${player.name} pegou um atalho e voltou com +${bonusA} casas!`, "especial");
        if (destinoA >= principalTotal) {
          await handleVictory();
          return false;
        }
        return false;
      }
      case "saida-mundo": {
        return handleSubworldExit(info);
      }
      case "perde-rodada": {
        player.rodadasPerdidas++;
        addHistory(`😴 ${info.descricao}`, "especial");
        return false;
      }
      case "voltar-inicio": {
        addHistory(`🔙 ${info.descricao}`, "especial");
        if (player.posicao !== 0) {
          await animatePlayerMovement(player.posicao, 0);
        }
        player.posicao = 0;
        positionPlayerAt(0);
        return false;
      }
      case "desafio": {
        const desafio = sortearQuestao();
        if (!desafio) return false;
        audioManager.play('challengeOpen');
        addHistory(`\u2753 ${player.name} caiu em um desafio!`, "especial");
        const acertou = await resolveChallenge(desafio);
        if (acertou) {
          audioManager.play('correctAnswer');
          const destino = Math.min(posicao + 1, getTotalCasas());
          if (destino > posicao) {
            await animatePlayerMovement(posicao, destino);
          }
          player.posicao = destino;
          positionPlayerAt(destino);
          addHistory(`\u2705 ${player.name} acertou! Avan\u00e7ou para casa ${destino}`, "especial");
          if (player.posicao >= getTotalCasas()) {
            if (gameState.activeSubworldId) return await handleBoardLimitReached();
            await handleVictory();
            return false;
          }
        } else {
          audioManager.play('wrongAnswer');
          const destino = Math.max(posicao - 1, 0);
          if (destino > 0 && destino < posicao) {
            await animatePlayerMovement(posicao, destino);
          }
          player.posicao = destino;
          positionPlayerAt(destino);
          addHistory(`\u274C ${player.name} errou! Voltou para casa ${destino}`, "especial");
        }
        return false;
      }
      case "swap-positions": {
        const otherPlayer = players[1 - gameState.currentPlayerIndex];
        if (player.posicao !== otherPlayer.posicao) {
          const fromA = player.posicao;
          const fromB = otherPlayer.posicao;
          player.posicao = fromB;
          otherPlayer.posicao = fromA;
          await animatePlayerMovement(fromA, fromB, player);
          await animatePlayerMovement(fromB, fromA, otherPlayer);
          positionPlayerAt(player.posicao, player);
          positionPlayerAt(otherPlayer.posicao, otherPlayer);
          updateUI();
          addHistory(`\uD83C\uDF00 ${player.name} trocou de posi\u00E7\u00E3o com ${otherPlayer.name}!`, "especial");
        } else {
          addHistory(`\uD83C\uDF00 ${info.descricao} — ambos na mesma casa, nada acontece.`, "info");
        }
        return false;
      }
      case "recife-placeholder": {
        addHistory(`\uD83C\uDF0A ${info.descricao}`, "especial");
        let resultado;
        try {
          resultado = await launchOceanMatch3({ isBot: player.isBot });
        } catch (err) {
          addLog(`\u274C Erro no Ocean Match-3: ${err.message}`);
          console.error('[Ocean Match-3 Error]', err);
          return false;
        }
        if (resultado.venceu) {
          const destino = Math.min(player.posicao + resultado.boardDelta, getTotalCasas());
          audioManager.play('specialAdvance');
          if (destino > player.posicao) {
            await animatePlayerMovement(player.posicao, destino);
          }
          player.posicao = destino;
          addHistory(`\uD83C\uDF1F ${player.name} encontrou o tesouro e avan\u00E7ou +${resultado.boardDelta} casas!`, "especial");
          if (player.posicao >= getTotalCasas()) {
            await handleVictory();
            return false;
          }
        } else {
          audioManager.play('wrongAnswer');
          addHistory(`\uD83C\uDF0A ${player.name} ficou sem tempo! B\u00F4nus: 0`, "especial");
        }
        return false;
      }
      case "placeholder": {
        addHistory(`\uD83D\uDCCC ${info.descricao}`, "info");
        return false;
      }
      case "dino-runner": {
        addHistory(`\uD83E\uDD96 ${info.descricao}`, "especial");
        const dinoResult = await launchDinoRunner({ isBot: player.isBot });
        const delta = dinoResult.boardDelta || 0;
        if (delta > 0) {
          const destino = Math.min(player.posicao + delta, getTotalCasas());
          audioManager.play('specialAdvance');
          if (destino > player.posicao) {
            await animatePlayerMovement(player.posicao, destino);
          }
          player.posicao = destino;
          const msg = dinoResult.venceu
            ? `\uD83C\uDF1F ${player.name} completou o Dino Runner e avan\u00E7ou +${delta} casas!`
            : `\uD83C\uDF1F ${player.name} alcan\u00E7ou a \u00E1rea dif\u00EDcil do Dino Runner e ganhou +${delta} casas!`;
          addHistory(msg, "especial");
          if (player.posicao >= getTotalCasas()) {
            await handleVictory();
            return false;
          }
        } else {
          audioManager.play('wrongAnswer');
          addHistory(`\uD83D\uDCA5 ${player.name} colidiu no Dino Runner! B\u00F4nus: 0`, "especial");
        }
        return false;
      }
      case "buraco-minhoca": {
        addHistory(`\uD83D\uDE80 ${info.descricao}`, "especial");
        const resultado = await launchMeteoroGame({ isBot: player.isBot });
        if (resultado.venceu) {
          const destino = Math.min(player.posicao + resultado.boardDelta, getTotalCasas());
          audioManager.play('specialAdvance');
          if (destino > player.posicao) {
            await animatePlayerMovement(player.posicao, destino);
          }
          player.posicao = destino;
          addHistory(`\uD83C\uDF1F ${player.name} atravessou o Buraco de Minhoca e avan\u00E7ou +${resultado.boardDelta} casas!`, "especial");
          if (player.posicao >= getTotalCasas()) {
            await handleVictory();
            return false;
          }
        } else {
          audioManager.play('wrongAnswer');
          addHistory(`\uD83D\uDCA5 ${player.name} foi atingido por meteoros! B\u00F4nus: 0`, "especial");
        }
        return false;
      }
      case "memory-forest": {
        addHistory(`\uD83C\uDF3F ${info.descricao}`, "especial");
        let resultado;
        try {
          resultado = await launchMemoryForest({ isBot: player.isBot });
        } catch (err) {
          console.error('[Memory Forest Error]', err);
          return false;
        }
        if (resultado.venceu) {
          const destino = Math.min(player.posicao + resultado.boardDelta, getTotalCasas());
          audioManager.play('specialAdvance');
          if (destino > player.posicao) {
            await animatePlayerMovement(player.posicao, destino);
          }
          player.posicao = destino;
          addHistory(`\uD83C\uDF1F ${player.name} encontrou ${resultado.stats?.paresEncontrados ?? 0} pares e avan\u00E7ou +${resultado.boardDelta} casas!`, "especial");
          if (player.posicao >= getTotalCasas()) {
            await handleVictory();
            return false;
          }
        } else {
          audioManager.play('wrongAnswer');
          addHistory(`\uD83C\uDF32 ${player.name} encontrou ${resultado.stats?.paresEncontrados ?? 0} pares. B\u00F4nus: 0`, "especial");
        }
        return false;
      }
      case "ataque-dragoes": {
        addHistory(`\uD83D\uDC09 ${info.descricao}`, "especial");
        const ataqueResult = await launchAtaqueDragoes({ isBot: player.isBot });
        if (ataqueResult.venceu) {
          const destino = Math.min(player.posicao + ataqueResult.boardDelta, getTotalCasas());
          audioManager.play('specialAdvance');
          if (destino > player.posicao) {
            await animatePlayerMovement(player.posicao, destino);
          }
          player.posicao = destino;
          addHistory(`\u2B50 ${player.name} protegeu o castelo e avan\u00E7ou +${ataqueResult.boardDelta} casas!`, "especial");
          if (player.posicao >= getTotalCasas()) {
            await handleVictory();
            return false;
          }
        } else {
          audioManager.play('wrongAnswer');
          addHistory(`\uD83D\uDC09 ${player.name} foi superado pelos drag\u00F5es! B\u00F4nus: 0`, "especial");
        }
        return false;
      }
      case "vitoria": {
        await handleVictory();
        return false;
      }
      default:
        return false;
    }
  }

  async function handleSubworldExit(info) {
    const bonus = info.valor ?? 0;
    const player = getCurrentPlayer();
    const entrada = gameState.subworldEntry[player.id];
    const swCfg = getSubworldConfig();
    const principalTotal = (currentWorldConfig && currentWorldConfig.board && currentWorldConfig.board.totalCells) || TOTAL_CASAS;
    const destino = Math.min(entrada + bonus, principalTotal);
    gameState.activeSubworldId = null;
    gameState.subworldEntry[player.id] = null;
    player.posicao = destino;
    renderizarTrilha();
    renderSvgPath();
    if (swCfg?.theme?.cssClass) elements.trackContainer.classList.remove(swCfg.theme.cssClass);
    document.getElementById("world-indicator").classList.add("hidden");
    players.forEach(p => positionPlayerAt(p.posicao, p));
    updateUI();
    addHistory(`✨ ${player.name} completou o submundo! Avan\u00e7ou ${bonus} casas!`, "especial");
    if (destino >= principalTotal) {
      await handleVictory();
      return false;
    }
    return false;
  }

  /* ── Subworld limit helper ── */

  async function handleBoardLimitReached() {
    const player = getCurrentPlayer();
    const info = getCasasEspeciais()[player.posicao];
    if (info?.tipo === "saida-mundo") {
      return handleSubworldExit(info);
    }
    console.error(
      "[Lara World] Submundo " + gameState.activeSubworldId + " atingiu a posição final " +
      player.posicao + ", mas não existe evento de saída configurado."
    );
    return false;
  }

  /* ── Victory ── */

  async function handleVictory() {
    audioManager.play('victory');
    const player = getCurrentPlayer();
    const el = getPlayerElement(player);
    const total = getTotalCasas();

    player.posicao = total;
    gameState.jogoFinalizado = true;
    gameState.jogoAtivo = false;
    elements.rollBtn.disabled = true;
    positionPlayerAt(total);
    updateUI();

    el.classList.add("animar-vitoria");

    addHistory(`🎉🎉 PARABÉNS, ${player.name} venceu! 🎉🎉`, "vitoria");

    const victoryEmoji = document.getElementById("victory-emoji");
    const victoryImg = document.getElementById("victory-img");
    applyVisualFallback(victoryEmoji, victoryImg, player.emoji, player.tokenId ? `assets/tokens/${player.tokenId}.webp` : null);
    if (elements.victoryMessage) {
      elements.victoryMessage.textContent = `${player.name} venceu o jogo!`;
    }
    if (elements.victoryOverlay) {
      elements.victoryOverlay.classList.remove("hidden");
    }
  }

  /* ── End Turn ── */

  function unlockTurn() {
    console.log("[UNLOCK] called, before: isMoving=" + gameState.isMoving + ", rollBtn.disabled=" + elements.rollBtn.disabled);
    gameState.isMoving = false;
    elements.rollBtn.disabled = false;
    console.log("[UNLOCK] after: isMoving=" + gameState.isMoving + ", rollBtn.disabled=" + elements.rollBtn.disabled);
    scheduleBotTurnIfNeeded();
  }

  function scheduleBotTurnIfNeeded() {
    const p = getCurrentPlayer();
    if (p.isBot && gameState.jogoAtivo && !gameState.jogoFinalizado && !botTurnScheduled) {
      botTurnScheduled = true;
      elements.rollBtn.disabled = true;
      setTimeout(async () => {
        botTurnScheduled = false;
        if (getCurrentPlayer().isBot && gameState.jogoAtivo && !gameState.jogoFinalizado) {
          await jogarDado();
        }
      }, 1000);
    }
  }

  /* ── Main Action ── */

  async function jogarDado() {
    console.log("[JOGAR] ENTER: isMoving=" + gameState.isMoving + ", rollBtn.disabled=" + elements.rollBtn.disabled + ", activeSubworldId=" + gameState.activeSubworldId + ", player.pos=" + getCurrentPlayer().posicao);
    if (!gameState.jogoAtivo || gameState.jogoFinalizado || gameState.isMoving) {
      console.log("[JOGAR] GUARD BLOCKED: jogoAtivo=" + gameState.jogoAtivo + ", jogoFinalizado=" + gameState.jogoFinalizado + ", isMoving=" + gameState.isMoving);
      return;
    }

    gameState.isMoving = true;
    elements.rollBtn.disabled = true;
    console.log("[JOGAR] isMoving=true, rollBtn.disabled=true");

    const player = getCurrentPlayer();

    if (player.rodadasPerdidas > 0) {
      player.rodadasPerdidas--;
      const restante =
        player.rodadasPerdidas > 0
          ? ` (${player.rodadasPerdidas} restante(s))`
          : "";
      addHistory(`😴 ${player.name} perdeu esta rodada!${restante}`, "especial");
      switchTurn();
      updateUI();
      unlockTurn();
      return;
    }

    const resultado = Math.floor(Math.random() * 6) + 1;
    audioManager.play('diceRoll');
    await animateDice(resultado);
    audioManager.play('diceResult');

    const from = player.posicao;
    const target = Math.min(from + resultado, getTotalCasas());

    if (target > from) {
      await animatePlayerMovement(from, target);
    } else if (target === 0) {
      positionPlayerAt(0);
    }

    player.posicao = target;

    addHistory(`🎲 ${player.name} tirou ${resultado} → casa ${target}`, "dado");

    if (target >= getTotalCasas()) {
      console.log("[JOGAR] target >= total, activeSubworldId=" + gameState.activeSubworldId);
      if (gameState.activeSubworldId) {
        await processSpecialCell(target);
        if (gameState.jogoFinalizado) {
          gameState.isMoving = false;
          console.log("[JOGAR] jogoFinalizado true, return");
          return;
        }
        gameState.isMoving = false;
        switchTurn();
        updateUI();
        unlockTurn();
        console.log("[JOGAR] subworld completion, unlockTurn called");
        return;
      }
      await handleVictory();
      gameState.isMoving = false;
      return;
    }

    console.log("[JOGAR] calling processSpecialCell(" + target + "), activeSubworldId=" + gameState.activeSubworldId);
    let extraTurn;
    try {
      extraTurn = await processSpecialCell(target);
    } catch (err) {
      console.error('[JOGAR] processSpecialCell error:', err);
      extraTurn = false;
    }
    console.log("[JOGAR] processSpecialCell returned extraTurn=" + extraTurn + ", isMoving=" + gameState.isMoving + ", rollBtn.disabled=" + elements.rollBtn.disabled + ", activeSubworldId=" + gameState.activeSubworldId);

    if (gameState.jogoFinalizado) {
      gameState.isMoving = false;
      console.log("[JOGAR] jogoFinalizado true, return");
      return;
    }

    if (extraTurn) {
      gameState.isMoving = false;
      elements.rollBtn.disabled = false;
      updateUI();
      if (!gameState.entrouNoPortal) {
        addHistory("🎯 Jogue novamente!", "especial");
      }
      gameState.entrouNoPortal = false;
      console.log("[JOGAR] extraTurn true, final state: isMoving=" + gameState.isMoving + ", rollBtn.disabled=" + elements.rollBtn.disabled);
      scheduleBotTurnIfNeeded();
      return;
    }

    console.log("[JOGAR] extraTurn false, switching turn");
    if (!gameState.activeSubworldId) {
      switchTurn();
    }
    updateUI();
    unlockTurn();
    console.log("[JOGAR] switchTurn+unlockTurn done, isMoving=" + gameState.isMoving + ", rollBtn.disabled=" + elements.rollBtn.disabled);
  }

  /* ── Reset ── */

  function resetGameState() {
    players.forEach(p => { p.posicao = 0; p.rodadasPerdidas = 0; });
    gameState.currentPlayerIndex = 0;
    gameState.jogoAtivo = true;
    gameState.jogoFinalizado = false;
    gameState.isMoving = false;
    gameState.questoesUsadas.clear();
    gameState.activeSubworldId = null;
    gameState.subworldEntry = { 1: null, 2: null };
    gameState.entrouNoPortal = false;

    elements.diceDisplay.textContent = "🎲";
    elements.diceValue.textContent = "-";

    players.forEach(p => {
      const el = getPlayerElement(p);
      if (el) el.classList.remove("visivel", "animar-vitoria");
    });

    document.querySelectorAll(".casa-ativada").forEach((el) => {
      el.classList.remove("casa-ativada");
    });

    clearHistory();
    elements.rollBtn.disabled = false;
    document.getElementById("world-indicator").classList.add("hidden");
  }

  function reiniciarJogo() {
    resetGameState();
    showMainMenu();
  }

  /* ── Theme Engine ── */

  function applyWorldTheme() {
    const cfg = currentWorldConfig;
    if (!cfg || !cfg.theme) return;

    document.body.dataset.world = cfg.id;

    const theme = cfg.theme;

    /* Remove previously applied theme decorations */
    document.querySelectorAll('.theme-deco').forEach(el => el.remove());

    /* Apply decorations from config */
    if (theme.decorations && Array.isArray(theme.decorations)) {
      theme.decorations.forEach(deco => {
        const el = document.createElement('div');
        el.className = 'deco theme-deco ' + (deco.className || '');
        el.textContent = deco.content || '';
        elements.trackContainer.appendChild(el);
      });
    }
  }

  function clearWorldTheme() {
    delete document.body.dataset.world;
    document.querySelectorAll('.theme-deco').forEach(el => el.remove());
  }

  /* ── Main Menu ── */

  function showMainMenu() {
    document.getElementById("main-menu").classList.remove("hidden");
    document.getElementById("setup-screen").classList.add("hidden");
    document.getElementById("world-selector").classList.add("hidden");
    selectedWorldId = null;
    currentWorldConfig = null;
    selectedLayoutId = null;
    modoJogo = null;
    clearWorldTheme();
  }

  function hideMainMenu() {
    document.getElementById("main-menu").classList.add("hidden");
  }

  function setupMenuEvents() {
    document.getElementById("btn-rapido").addEventListener("click", () => {
      audioManager.play('buttonClick');
      modoJogo = "rapido";
      hideMainMenu();
      showWorldSelector();
    });
  }

  /* ── World Selector ── */

  function enableWorldCard(worldId) {
    const card = document.querySelector(`.world-card[data-world="${worldId}"]`);
    if (!card) return;
    card.disabled = false;
    const badge = card.querySelector('.world-card-badge');
    if (badge) {
      badge.textContent = '\u2705 Dispon\u00edvel';
      badge.className = 'world-card-badge badge-available';
    }
  }

  function showWorldSelector() {
    document.querySelectorAll('.world-card:not(:disabled):not([data-world="random"])').forEach(card => {
      const wid = card.dataset.world;
      try {
        const wc = get(wid);
        const emojiEl = card.querySelector('.world-card-emoji');
        const nameEl = card.querySelector('.world-card-name');
        if (emojiEl && wc.icon) emojiEl.textContent = wc.icon;
        if (nameEl && wc.name) nameEl.textContent = wc.name.replace(wc.icon || '', '').trim();
      } catch (e) {
        /* world not registered, keep default display */
      }
    });
    document.getElementById("world-selector").classList.remove("hidden");
  }

  function hideWorldSelector() {
    document.getElementById("world-selector").classList.add("hidden");
  }

  function selectWorld(worldId) {
    if (worldId === "random") {
      currentWorldConfig = random(w => w.type === 'main');
      selectedWorldId = currentWorldConfig.id;
    } else {
      currentWorldConfig = get(worldId);
      selectedWorldId = worldId;
    }
    selectedLayoutId = loadLayoutPreference(selectedWorldId) || null;
    applyWorldTheme();
    hideWorldSelector();
    showSetupScreen();
  }

  function setupWorldSelectorEvents() {
    document.querySelectorAll(".world-card:not(:disabled)").forEach(card => {
      card.addEventListener("click", function () {
        audioManager.play('buttonClick');
        selectWorld(this.dataset.world);
      });
    });

    document.getElementById("world-back-btn").addEventListener("click", () => {
      audioManager.play('buttonClick');
      hideWorldSelector();
      showMainMenu();
    });
  }

  /* ── Modal Setup ── */

  function showSetupScreen() {
    document.getElementById("setup-screen").classList.remove("hidden");
    renderLayoutSelector();
  }

  function hideSetupScreen() {
    document.getElementById("setup-screen").classList.add("hidden");
  }

  function renderLayoutSelector() {
    const container = document.getElementById('layout-selector');
    const btnGroup = document.getElementById('layout-buttons');
    const board = currentWorldConfig?.board;
    const hasMultiple = board && board.layouts && Object.keys(board.layouts).length > 1;

    if (!hasMultiple) {
      container.classList.add('hidden');
      return;
    }

    container.classList.remove('hidden');
    btnGroup.innerHTML = '';

    for (const [lid, layout] of Object.entries(board.layouts)) {
      const btn = document.createElement('button');
      btn.className = 'layout-btn';
      btn.dataset.layoutId = lid;
      btn.innerHTML = (layout.icon || '') + ' ' + layout.name;

      if (lid === selectedLayoutId || (!selectedLayoutId && lid === board.defaultLayout)) {
        btn.classList.add('selected');
      }

      btn.addEventListener('click', () => {
        btnGroup.querySelectorAll('.layout-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedLayoutId = lid;
      });

      btnGroup.appendChild(btn);
    }
  }

  function startGame() {
    players[0].name = document.getElementById("player1-name").value.trim() || "Jogador 1";
    const p1Selected = document.querySelector(".card-p1 .emoji-btn.selected");
    players[0].emoji = p1Selected ? p1Selected.dataset.emoji : "🧒";
    players[0].tokenId = p1Selected ? p1Selected.dataset.token : "lara";

    if (isSinglePlayer) {
      players[1].name = "Máquina";
      players[1].emoji = "🤖";
      players[1].isBot = true;
      players[1].tokenId = "";
    } else {
      players[1].name = document.getElementById("player2-name").value.trim() || "Jogador 2";
      const p2Selected = document.querySelector(".card-p2 .emoji-btn.selected");
      players[1].emoji = p2Selected ? p2Selected.dataset.emoji : "🧑";
      players[1].isBot = false;
      players[1].tokenId = p2Selected ? p2Selected.dataset.token : "leo";
    }

    renderBoardToken(0);
    renderBoardToken(1);

    if (currentWorldConfig?.board?.layouts && selectedLayoutId) {
      saveLayoutPreference(currentWorldConfig.id, selectedLayoutId);
    }

    botTurnScheduled = false;
    hideSetupScreen();
    gameState.questoesUsadas.clear();
    renderizarTrilha();
    renderSvgPath();
    updateUI();
    players.forEach(p => positionPlayerAt(p.posicao, p));
    addHistory("🎮 Bem-vindos ao Lara World!", "info");
  }

    function updateAvatarPreview(playerIndex, emoji, name, avatarId) {
      const emojiEl = document.getElementById(`avatar-emoji-p${playerIndex + 1}`);
      const nameEl = document.getElementById(`avatar-name-p${playerIndex + 1}`);
      const imgEl = document.querySelector(`#avatar-frame-p${playerIndex + 1} .avatar-img`);
      if (emojiEl && emoji) emojiEl.textContent = emoji;
      if (nameEl && name) nameEl.textContent = name;
      if (imgEl && arguments.length > 3) {
        if (avatarId) {
          imgEl.src = `assets/avatars/${avatarId}.webp`;
          imgEl.style.display = '';
        } else {
          imgEl.src = '';
          imgEl.style.display = 'none';
        }
      }
    }

    function setupModalEvents() {
      const p1Name = document.getElementById("player1-name");
      const p2Name = document.getElementById("player2-name");
      const startBtn = document.getElementById("start-game-btn");
      const p1Card = document.querySelector(".card-p1");
      const p2Card = document.querySelector(".card-p2");
      const setupScreen = document.getElementById("setup-screen");

      let p1Emoji = null;
      let p2Emoji = null;

      function checkReady() {
        if (isSinglePlayer) {
          startBtn.disabled = !(p1Name.value.trim() && p1Emoji);
        } else {
          startBtn.disabled = !(p1Name.value.trim() && p1Emoji && p2Name.value.trim() && p2Emoji);
        }
      }

      function updateModeUI() {
        if (isSinglePlayer) {
          setupScreen.classList.add("mode-1p");
        } else {
          setupScreen.classList.remove("mode-1p");
        }
        checkReady();
      }

      document.querySelectorAll('.mode-option input[type="radio"]').forEach(radio => {
        radio.addEventListener("change", function () {
          document.querySelectorAll(".mode-option").forEach(opt => opt.classList.remove("selected"));
          this.closest(".mode-option").classList.add("selected");
          isSinglePlayer = this.value === "1p";
          updateModeUI();
        });
      });

      p1Name.addEventListener("input", function () {
        checkReady();
        updateAvatarPreview(0, null, this.value.trim() || "Jogador 1");
      });
      p2Name.addEventListener("input", function () {
        checkReady();
        updateAvatarPreview(1, null, this.value.trim() || "Jogador 2");
      });

      p1Card.querySelectorAll(".emoji-btn").forEach(btn => {
        btn.addEventListener("click", function () {
          p1Card.querySelectorAll(".emoji-btn").forEach(b => b.classList.remove("selected"));
          this.classList.add("selected");
          p1Emoji = this.dataset.emoji;
          updateAvatarPreview(0, p1Emoji, null, this.dataset.avatar);
          checkReady();
        });
      });

      p2Card.querySelectorAll(".emoji-btn").forEach(btn => {
        btn.addEventListener("click", function () {
          p2Card.querySelectorAll(".emoji-btn").forEach(b => b.classList.remove("selected"));
          this.classList.add("selected");
          p2Emoji = this.dataset.emoji;
          updateAvatarPreview(1, p2Emoji, null, this.dataset.avatar);
          checkReady();
        });
      });

      const p1Def = p1Card.querySelector('.emoji-btn[data-avatar="lara"]');
      const p2Def = p2Card.querySelector('.emoji-btn[data-avatar="leo"]');
      if (p1Def) { p1Def.classList.add("selected"); p1Emoji = "🧒"; updateAvatarPreview(0, "🧒", "Lara", "lara"); }
      if (p2Def) { p2Def.classList.add("selected"); p2Emoji = "🧑"; updateAvatarPreview(1, "🧑", "Amigo", "leo"); }

      startBtn.addEventListener("click", () => { audioManager.play('buttonClick'); prepareAndDraw(); });
      updateModeUI();
    }

  /* ── Sorteio Inicial (Draw) ── */

  function prepareAndDraw() {
    players[0].name = document.getElementById("player1-name").value.trim() || "Jogador 1";
    const p1Sel = document.querySelector(".card-p1 .emoji-btn.selected");
    players[0].emoji = p1Sel ? p1Sel.dataset.emoji : "🧒";
    players[0].isBot = false;
    players[0].tokenId = p1Sel ? p1Sel.dataset.token : "lara";

    if (isSinglePlayer) {
      players[1].name = "Máquina";
      players[1].emoji = "🤖";
      players[1].isBot = true;
      players[1].tokenId = "";
    } else {
      players[1].name = document.getElementById("player2-name").value.trim() || "Jogador 2";
      const p2Sel = document.querySelector(".card-p2 .emoji-btn.selected");
      players[1].emoji = p2Sel ? p2Sel.dataset.emoji : "🧑";
      players[1].isBot = false;
      players[1].tokenId = p2Sel ? p2Sel.dataset.token : "leo";
    }

    renderBoardToken(0);
    renderBoardToken(1);

    botTurnScheduled = false;
    hideSetupScreen();
    startDrawSequence();
  }

  function showDrawScreen() {
    const emoji0 = document.getElementById("draw-emoji-0");
    const img0 = document.getElementById("draw-img-0");
    const emoji1 = document.getElementById("draw-emoji-1");
    const img1 = document.getElementById("draw-img-1");
    applyVisualFallback(emoji0, img0, players[0].emoji, players[0].tokenId ? `assets/tokens/${players[0].tokenId}.webp` : null);
    applyVisualFallback(emoji1, img1, players[1].emoji, players[1].tokenId ? `assets/tokens/${players[1].tokenId}.webp` : null);
    document.getElementById("draw-name-0").textContent = players[0].name;
    document.getElementById("draw-name-1").textContent = players[1].name;

    document.getElementById("draw-dice-box-0").textContent = "🎲";
    document.getElementById("draw-dice-box-1").textContent = "🎲";
    document.getElementById("draw-value-0").textContent = "-";
    document.getElementById("draw-value-1").textContent = "-";

    document.getElementById("draw-player-0").classList.remove("winner");
    document.getElementById("draw-player-1").classList.remove("winner");

    drawState.drawWinnerIndex = null;

    document.getElementById("draw-status").textContent = "";
    document.getElementById("draw-start-btn").classList.add("hidden");
    document.getElementById("draw-start-btn").disabled = true;

    document.getElementById("draw-roll-btn-0").disabled = false;
    document.getElementById("draw-roll-btn-0").classList.remove("hidden");

    if (isSinglePlayer) {
      document.getElementById("draw-roll-btn-1").classList.add("hidden");
    } else {
      document.getElementById("draw-roll-btn-1").classList.remove("hidden");
      document.getElementById("draw-roll-btn-1").disabled = false;
    }

    document.getElementById("draw-overlay").classList.remove("hidden");
  }

  function hideDrawScreen() {
    document.getElementById("draw-overlay").classList.add("hidden");
  }

  function waitForPlayerRoll(playerIndex) {
    return new Promise(resolve => {
      const btn = document.getElementById(`draw-roll-btn-${playerIndex}`);
      btn.onclick = function handler() {
        audioManager.play('diceRoll');
        btn.disabled = true;
        btn.onclick = null;
        const value = Math.floor(Math.random() * 6) + 1;
        animateDrawDice(playerIndex, value).then(() => {
          audioManager.play('diceResult');
          resolve(value);
        });
      };
    });
  }

  async function autoBotRoll(playerIndex) {
    await delay(800);
    const value = Math.floor(Math.random() * 6) + 1;
    await animateDrawDice(playerIndex, value);
    return value;
  }

  async function animateDrawDice(playerIndex, valor) {
    const box = document.getElementById(`draw-dice-box-${playerIndex}`);
    const valueEl = document.getElementById(`draw-value-${playerIndex}`);

    for (const v of [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6]) {
      box.textContent = getDadoEmoji(v);
      await delay(60);
    }

    box.textContent = getDadoEmoji(valor);
    valueEl.textContent = valor;
    await delay(250);
  }

  async function startDrawSequence() {
    showDrawScreen();
    let tieCount = 0;

    while (true) {
      drawState.rolls = [null, null];

      drawState.rolls[0] = await waitForPlayerRoll(0);

      if (isSinglePlayer) {
        drawState.rolls[1] = await autoBotRoll(1);
      } else {
        drawState.rolls[1] = await waitForPlayerRoll(1);
      }

      const [v1, v2] = drawState.rolls;

      if (v1 === v2) {
        drawState.drawWinnerIndex = null;
        document.getElementById("draw-start-btn").disabled = true;
        document.getElementById("draw-player-0").classList.remove("winner");
        document.getElementById("draw-player-1").classList.remove("winner");

        if (tieCount >= 2) {
          const winnerIndex = Math.random() < 0.5 ? 0 : 1;
          drawState.drawWinnerIndex = winnerIndex;
          const msgs = [
            "Empate cósmico! O jogo escolheu quem começa.",
            "Depois de tantos empates, a sorte decidiu!",
            "Tanto empate que o destino tomou a frente!",
          ];
          document.getElementById("draw-status").textContent =
            msgs[Math.floor(Math.random() * msgs.length)];
          document.getElementById(`draw-player-${winnerIndex}`).classList.add("winner");
          document.getElementById("draw-start-btn").classList.remove("hidden");
          document.getElementById("draw-start-btn").disabled = false;
          break;
        }

        tieCount++;
        document.getElementById("draw-status").textContent = "🤝 Empate! Vamos rolar novamente!";
        document.getElementById("draw-dice-box-0").textContent = "🎲";
        document.getElementById("draw-dice-box-1").textContent = "🎲";
        document.getElementById("draw-value-0").textContent = "-";
        document.getElementById("draw-value-1").textContent = "-";
        document.getElementById("draw-roll-btn-0").disabled = false;
        if (!isSinglePlayer) {
          document.getElementById("draw-roll-btn-1").disabled = false;
        }
        await delay(1500);
        continue;
      }

      const winnerIndex = v1 > v2 ? 0 : 1;
      drawState.drawWinnerIndex = winnerIndex;

      document.getElementById(`draw-player-${winnerIndex}`).classList.add("winner");

      const winner = players[winnerIndex];
      document.getElementById("draw-status").textContent =
        `🏆 ${winner.name} começa a aventura!`;
      document.getElementById("draw-start-btn").classList.remove("hidden");
      document.getElementById("draw-start-btn").disabled = false;
      break;
    }
  }

  function continueAfterDraw() {
    if (drawState.drawWinnerIndex === null || drawState.drawWinnerIndex === undefined) {
      return;
    }

    const startBtn = document.getElementById("draw-start-btn");
    startBtn.disabled = true;
    gameState.currentPlayerIndex = drawState.drawWinnerIndex;
    hideDrawScreen();
    gameState.questoesUsadas.clear();
    renderizarTrilha();
    renderSvgPath();
    updateUI();
    players.forEach(p => positionPlayerAt(p.posicao, p));
    addHistory("🎮 Bem-vindos ao Lara World!", "info");

    if (getCurrentPlayer().isBot && gameState.jogoAtivo && !gameState.jogoFinalizado) {
      scheduleBotTurnIfNeeded();
    }
  }

  /* ── Challenge Modal ── */

  function showChallengeModal(desafio) {
    return new Promise((resolve) => {
      const overlay = document.getElementById("challenge-overlay");
      const questionEl = document.getElementById("challenge-question");
      const optionsEl = document.getElementById("challenge-options");

      questionEl.textContent = desafio.pergunta;
      optionsEl.innerHTML = "";

      desafio.opcoes.forEach((opcao, index) => {
        const btn = document.createElement("button");
        btn.className = "challenge-btn";
        btn.textContent = `${String.fromCharCode(65 + index)}) ${opcao}`;
        btn.addEventListener("click", () => {
          overlay.classList.add("hidden");
          resolve(opcao === desafio.resposta);
        });
        optionsEl.appendChild(btn);
      });

      overlay.classList.remove("hidden");
    });
  }

  /* ── Portal Modal ── */

  function showPortalModal(portalCfg) {
    return new Promise((resolve) => {
      const overlay = document.getElementById("portal-overlay");
      const titleEl = overlay.querySelector("h2");
      const msgEl = document.getElementById("portal-message");
      const entrarBtn = document.getElementById("portal-entrar-btn");
      const continuarBtn = document.getElementById("portal-continuar-btn");

      if (portalCfg) {
        titleEl.textContent = portalCfg.name || '\uD83C\uDF0D Portal';
        msgEl.textContent = portalCfg.entrance?.message || 'Voc\u00EA encontrou um portal! Deseja entrar?';
      } else {
        titleEl.textContent = '\uD83C\uDF0D Portal';
        msgEl.textContent = 'Voc\u00EA encontrou um portal! Deseja entrar?';
      }

      entrarBtn.onclick = () => {
        overlay.classList.add("hidden");
        resolve(true);
      };
      continuarBtn.onclick = () => {
        overlay.classList.add("hidden");
        resolve(false);
      };

      overlay.classList.remove("hidden");
    });
  }

  async function resolveChallenge(desafio) {
    const player = getCurrentPlayer();
    if (player.isBot) {
      await delay(600);
      const acertou = Math.random() < 0.6;
      if (acertou) {
        addHistory(`🤖 ${player.name} acertou o desafio!`, "especial");
      } else {
        addHistory(`🤖 ${player.name} errou o desafio!`, "especial");
      }
      return acertou;
    }
    return showChallengeModal(desafio);
  }

  async function resolvePortal() {
    const player = getCurrentPlayer();
    const portalCfg = getPortalConfigForCell(player.posicao);
    const swCfg = portalCfg?.targetWorldId ? subworldConfigs[portalCfg.targetWorldId] : null;
    const swName = swCfg?.name || 'Submundo';

    if (player.isBot) {
      await delay(500);
      const entrou = Math.random() < 0.5;
      if (entrou) {
        addHistory(`🤖 ${player.name} decidiu entrar em ${swName}!`, "especial");
      } else {
        addHistory(`🤖 ${player.name} decidiu continuar no tabuleiro.`, "info");
      }
      return entrou;
    }
    return showPortalModal(portalCfg);
  }

  /* ── Debug ── */

  function renderDebugLayoutButtons() {
    const container = document.getElementById('debug-layout-buttons');
    if (!container) return;
    container.innerHTML = '';
    const board = currentWorldConfig?.board;
    if (!board || !board.layouts) return;
    for (const [lid, layout] of Object.entries(board.layouts)) {
      const btn = document.createElement('button');
      btn.className = 'debug-btn debug-btn-layout';
      btn.dataset.debug = 'layout:' + lid;
      btn.textContent = layout.name;
      container.appendChild(btn);
    }
  }

  function setupDebugMode() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("debug") !== "1") return;

    const panel = document.getElementById("debug-panel");
    if (!panel) return;
    panel.classList.remove("hidden");

    // ── Debug State ──
    const debugLog = [];
    let lastEventResult = {
      eventType: '-', posBefore: '-', posAfter: '-',
      cascaded: '-', victory: '-', specialAreaChange: '-',
    };

    function addLog(msg) {
      debugLog.unshift(`[${new Date().toLocaleTimeString()}] ${msg}`);
      if (debugLog.length > 20) debugLog.pop();
      renderLogs();
    }

    function setEventResult(partial) {
      Object.assign(lastEventResult, partial);
      renderEventResult();
    }

    function clearEventResult() {
      lastEventResult = { eventType: '-', posBefore: '-', posAfter: '-', cascaded: '-', victory: '-', specialAreaChange: '-' };
      renderEventResult();
    }

    function txt(id, val) {
      const el = document.getElementById(id);
      if (el) el.textContent = String(val);
    }

    function renderState() {
      const p = getCurrentPlayer();
      txt('d-world', currentWorldConfig?.name || '-');
      txt('d-area', getSubworldConfig()?.name || 'Nenhuma');
      txt('d-player', p ? `${p.emoji} ${p.name}` : '-');
      txt('d-pos', p != null ? p.posicao : '-');
      txt('d-p1', players[0] ? `${players[0].emoji} ${players[0].posicao}` : '-');
      txt('d-p2', players[1] ? `${players[1].emoji} ${players[1].posicao}` : '-');
      txt('d-entry', p != null ? (gameState.subworldEntry[p.id] ?? '-') : '-');
      txt('d-game', gameState.jogoAtivo ? (gameState.jogoFinalizado ? 'Finalizado' : 'Ativo') : 'Inativo');
      txt('d-turn', `${gameState.currentPlayerIndex + 1}/${PLAYER_COUNT}`);
      renderDebugLayoutButtons();
    }

    function renderLogs() {
      const c = document.getElementById('debug-log-container');
      if (c) c.innerHTML = debugLog.map(m => `<div class="debug-log-item">${m}</div>`).join('');
    }

    function renderEventResult() {
      txt('d-event-type', lastEventResult.eventType);
      txt('d-event-before', lastEventResult.posBefore);
      txt('d-event-after', lastEventResult.posAfter);
      txt('d-event-cascade', lastEventResult.cascaded);
      txt('d-event-victory', lastEventResult.victory);
      txt('d-event-area', lastEventResult.specialAreaChange);
    }

    setInterval(renderState, 500);

    // ── Subworld helpers ──
    function enterSubworld(swId) {
      const p = getCurrentPlayer();
      gameState.subworldEntry[p.id] = p.posicao;
      gameState.activeSubworldId = swId;
      p.posicao = 0;
      renderizarTrilha();
      renderSvgPath();
      const swCfg = subworldConfigs[swId];
      if (swCfg?.theme?.cssClass) elements.trackContainer.classList.add(swCfg.theme.cssClass);
      const ind = document.getElementById("world-indicator");
      ind.textContent = swCfg?.ui?.worldIndicator || swCfg?.name || swId;
      ind.classList.remove("hidden");
      players.forEach(p2 => positionPlayerAt(p2.posicao, p2));
      gameState.isMoving = false;
      elements.rollBtn.disabled = false;
      updateUI();
      addLog(`\uD83D\uDEAA Entrou em ${swCfg?.name || swId}`);
    }

    function exitSubworld() {
      const swCfg = getSubworldConfig();
      gameState.activeSubworldId = null;
      gameState.subworldEntry[getCurrentPlayer().id] = null;
      gameState.entrouNoPortal = false;
      renderizarTrilha();
      renderSvgPath();
      if (swCfg?.theme?.cssClass) elements.trackContainer.classList.remove(swCfg.theme.cssClass);
      document.getElementById("world-indicator").classList.add("hidden");
      players.forEach(p2 => positionPlayerAt(p2.posicao, p2));
      gameState.isMoving = false;
      elements.rollBtn.disabled = false;
      updateUI();
      addLog('\u2B05 Voltou ao mundo principal');
    }

    // ── Move + Process action ──
    async function debugMoveAndProcess(targetCell) {
      const player = getCurrentPlayer();
      const prevPos = player.posicao;
      const prevArea = gameState.activeSubworldId;
      const info = getCasasEspeciais()[targetCell];
      const eventType = info?.tipo || 'nenhum';

      clearEventResult();
      setEventResult({ eventType, posBefore: prevPos });

      player.posicao = targetCell;
      positionPlayerAt(targetCell);
      updateUI();
      addLog(`\uD83D\uDCCC Moveu para casa ${targetCell} (${eventType})`);

      if (info) {
        await processSpecialCell(targetCell);
      } else {
        addLog(`\u26A0\uFE0F Casa ${targetCell} sem evento`);
      }

      const afterPos = player.posicao;
      const afterArea = gameState.activeSubworldId;
      const victory = gameState.jogoFinalizado;
      const cascaded = afterPos !== targetCell && afterPos !== prevPos;
      let areaChange = '-';
      if (prevArea !== afterArea) {
        areaChange = afterArea
          ? `Entrou em ${subworldConfigs[afterArea]?.name || afterArea}`
          : 'Saiu da \u00e1rea especial';
      }

      setEventResult({
        posAfter: afterPos,
        cascaded: cascaded ? `Sim (${targetCell} \u2192 ${afterPos})` : 'N\u00e3o',
        victory: victory ? 'Sim \uD83C\uDFC6' : 'N\u00e3o',
        specialAreaChange: areaChange,
      });

      if (victory) addLog('\uD83C\uDFC6 Vit\u00f3ria disparada!');
      if (cascaded) addLog(`\uD83D\uDD00 Cascata: ${targetCell} \u2192 ${afterPos}`);
      if (areaChange !== '-') addLog(`\uD83D\uDEAA ${areaChange}`);

      gameState.isMoving = false;
      elements.rollBtn.disabled = false;
      updateUI();
    }

    // ── Button Handler ──
    panel.addEventListener("click", async (e) => {
      const btn = e.target.closest(".debug-btn");
      if (!btn) return;

      const action = btn.dataset.debug;
      const player = getCurrentPlayer();

      clearEventResult();

      // Ações padronizadas via prefixo (processadas antes do switch para não poluir os cases)
      const layoutMatch = action.match(/^layout:(.+)$/);
      if (layoutMatch) {
        const lid = layoutMatch[1];
        const board = currentWorldConfig?.board;
        if (board && board.layouts && board.layouts[lid]) {
          applyLayout(lid);
          addLog(`\uD83D\uDDFA\uFE0F Layout: ${board.layouts[lid].name}`);
        } else {
          addLog(`\u26A0\uFE0F Layout "${lid}" n\u00E3o encontrado`);
        }
        return;
      }

      try {
        switch (action) {

          // ── Mover ──
          case "move-only": {
            const cell = parseInt(document.getElementById("debug-target-cell")?.value || "1", 10);
            const idx = parseInt(document.getElementById("debug-player-select")?.value || "0", 10);
            const target = players[idx];
            if (!target) break;
            const clamped = Math.max(0, Math.min(cell, getTotalCasas()));
            target.posicao = clamped;
            positionPlayerAt(clamped, target);
            updateUI();
            addLog(`\uD83D\uDCCD ${target.emoji} ${target.name} \u2192 casa ${clamped}`);
            setEventResult({ eventType: 'movimento manual', posBefore: target.posicao, posAfter: clamped });
            break;
          }

          // ── Processar ──
          case "process-only": {
            const cp = getCurrentPlayer();
            const curCell = cp.posicao;
            const info = getCasasEspeciais()[curCell];
            if (!info) {
              addLog(`\u26A0\uFE0F Casa ${curCell} sem evento`);
              setEventResult({ eventType: 'nenhum', posBefore: curCell, posAfter: curCell });
              break;
            }
            setEventResult({ eventType: info.tipo, posBefore: curCell });
            addLog(`\u26A1 Processando casa ${curCell} (${info.tipo})`);
            await processSpecialCell(curCell);
            setEventResult({ posAfter: cp.posicao, cascaded: cp.posicao !== curCell ? `Sim (${curCell} \u2192 ${cp.posicao})` : 'N\u00e3o' });
            if (gameState.jogoFinalizado) {
              setEventResult({ victory: 'Sim \uD83C\uDFC6' });
              addLog('\uD83C\uDFC6 Vit\u00f3ria disparada!');
            }
            gameState.isMoving = false;
            elements.rollBtn.disabled = false;
            updateUI();
            break;
          }

          // ── Mover + Processar ──
          case "move-process": {
            const cell = parseInt(document.getElementById("debug-target-cell")?.value || "1", 10);
            await debugMoveAndProcess(cell);
            break;
          }

          // ── Testes Rápidos: Vale ──
          case "vale-casa6": {
            if (gameState.activeSubworldId) { addLog('\u26A0\uFE0F Est\u00e1 em submundo. Use o bot\u00e3o de sair primeiro.'); break; }
            if (currentWorldConfig?.id !== 'dinossauros') { addLog('\u26A0\uFE0F Teste v\u00e1lido apenas no Vale dos Dinossauros'); break; }
            await debugMoveAndProcess(6);
            break;
          }
          case "vale-casa19": {
            if (gameState.activeSubworldId) { addLog('\u26A0\uFE0F Est\u00e1 em submundo. Use o bot\u00e3o de sair primeiro.'); break; }
            if (currentWorldConfig?.id !== 'dinossauros') { addLog('\u26A0\uFE0F Teste v\u00e1lido apenas no Vale dos Dinossauros'); break; }
            await debugMoveAndProcess(19);
            break;
          }
          case "vale-portal": {
            if (gameState.activeSubworldId) { addLog('\u26A0\uFE0F Est\u00e1 em submundo. Use o bot\u00e3o de sair primeiro.'); break; }
            if (currentWorldConfig?.id !== 'dinossauros') { addLog('\u26A0\uFE0F Teste v\u00e1lido apenas no Vale dos Dinossauros'); break; }
            await debugMoveAndProcess(10);
            break;
          }

          // ── Testes Rápidos: Dino Runner ──
          case "dino-runner-minigame": {
            addLog('\uD83C\uDFAE Abrindo Dino Runner manualmente...');
            gameState.isMoving = true;
            elements.rollBtn.disabled = true;
            const dinoResult = await launchDinoRunner();
            gameState.isMoving = false;
            elements.rollBtn.disabled = false;
            if (dinoResult.venceu) {
              const p = getCurrentPlayer();
              const destino = Math.min(p.posicao + dinoResult.boardDelta, getTotalCasas());
              if (destino > p.posicao) {
                await animatePlayerMovement(p.posicao, destino);
              }
              p.posicao = destino;
              addLog(`\u2705 Dino Runner vencido! Avan\u00E7ou +${dinoResult.boardDelta} \u2192 casa ${destino}`);
            } else {
              addLog(`\uD83D\uDCA5 Dino Runner perdido! B\u00F4nus: 0`);
            }
            updateUI();
            setEventResult({ eventType: 'dino-runner (debug)', posBefore: getCurrentPlayer().posicao, posAfter: getCurrentPlayer().posicao });
            break;
          }
          case "dino-runner-vitoria": {
            const pDR = getCurrentPlayer();
            const BONUS_DR = 3;
            const destinoDR = Math.min(pDR.posicao + BONUS_DR, getTotalCasas());
            addLog('\u2705 Simulando vit\u00F3ria no Dino Runner...');
            gameState.isMoving = true;
            elements.rollBtn.disabled = true;
            if (destinoDR > pDR.posicao) {
              await animatePlayerMovement(pDR.posicao, destinoDR);
            }
            pDR.posicao = destinoDR;
            gameState.isMoving = false;
            elements.rollBtn.disabled = false;
            updateUI();
            addLog(`\u2705 B\u00F4nus aplicado: +${BONUS_DR} \u2192 casa ${destinoDR} (sem cascata)`);
            if (pDR.posicao >= getTotalCasas()) {
              await handleVictory();
            }
            setEventResult({ eventType: 'dino-runner vit\u00F3ria (simulado)', posBefore: pDR.posicao - BONUS_DR, posAfter: destinoDR, cascaded: 'N\u00E3o (debug)' });
            break;
          }
          case "dino-runner-derrota": {
            addLog('\u274C Simulando derrota no Dino Runner...');
            addLog('\uD83E\uDEA8 Dinossauro colidiu! B\u00F4nus: 0');
            setEventResult({ eventType: 'dino-runner derrota (simulado)', posBefore: getCurrentPlayer().posicao, posAfter: getCurrentPlayer().posicao, cascaded: 'N\u00E3o' });
            break;
          }
          case "dino-runner-retornar": {
            document.getElementById('minigame-overlay').classList.add('hidden');
            gameState.isMoving = false;
            elements.rollBtn.disabled = false;
            addLog('\u21A9\uFE0F Overlay do Dino Runner fechado. Estado restaurado.');
            setEventResult({ eventType: 'retorno dino-runner (debug)', posBefore: getCurrentPlayer().posicao, posAfter: getCurrentPlayer().posicao });
            break;
          }

          // ── Testes Rápidos: Floresta ──
          case "floresta-casa5": {
            if (gameState.activeSubworldId) { addLog('\u26A0\uFE0F Est\u00e1 em submundo.'); break; }
            if (currentWorldConfig?.id !== 'floresta-encantada') { addLog('\u26A0\uFE0F Teste v\u00e1lido apenas na Floresta Encantada'); break; }
            await debugMoveAndProcess(5);
            break;
          }
          case "floresta-portal": {
            if (gameState.activeSubworldId) { addLog('\u26A0\uFE0F Est\u00e1 em submundo.'); break; }
            if (currentWorldConfig?.id !== 'floresta-encantada') { addLog('\u26A0\uFE0F Teste v\u00e1lido apenas na Floresta Encantada'); break; }
            await debugMoveAndProcess(11);
            break;
          }

          // ── Testes Rápidos: Jogo da Memória ──
          case "memoria-abrir": {
            if (currentWorldConfig?.id !== 'floresta-encantada') { addLog('\u26A0\uFE0F Teste v\u00e1lido apenas na Floresta Encantada'); break; }
            addLog('\uD83C\uDF3F Abrindo Jogo da Mem\u00F3ria...');
            const memResult = await launchMemoryForest({ isBot: false });
            const memDelta = memResult.boardDelta || 0;
            if (memDelta > 0) {
              const pM = getCurrentPlayer();
              const destinoM = Math.min(pM.posicao + memDelta, getTotalCasas());
              pM.posicao = destinoM;
              addLog(`\u2705 Vit\u00F3ria! +${memDelta} casas \u2192 casa ${destinoM}`);
            } else {
              addLog(`\u274C Derrota. Pares: ${memResult.stats?.paresEncontrados ?? 0}/6`);
            }
            setEventResult({ eventType: 'memory-forest (debug)', posBefore: getCurrentPlayer().posicao - memDelta, posAfter: getCurrentPlayer().posicao, cascaded: 'N\u00E3o' });
            break;
          }
          case "memoria-vitoria": {
            if (currentWorldConfig?.id !== 'floresta-encantada') { addLog('\u26A0\uFE0F Teste v\u00e1lido apenas na Floresta Encantada'); break; }
            addLog('\u2705 Simulando vit\u00F3ria no Jogo da Mem\u00F3ria...');
            const pMV = getCurrentPlayer();
            const destinoMV = Math.min(pMV.posicao + 3, getTotalCasas());
            pMV.posicao = destinoMV;
            addLog(`\u2705 B\u00F4nus aplicado: +3 \u2192 casa ${destinoMV} (sem cascata)`);
            if (pMV.posicao >= getTotalCasas()) {
              await handleVictory();
            }
            setEventResult({ eventType: 'memory-forest vit\u00F3ria (simulado)', posBefore: pMV.posicao - 3, posAfter: destinoMV, cascaded: 'N\u00E3o (debug)' });
            break;
          }
          case "memoria-derrota": {
            addLog('\u274C Simulando derrota no Jogo da Mem\u00F3ria...');
            addLog('\uD83C\uDF32 Pares insuficientes. B\u00F4nus: 0');
            setEventResult({ eventType: 'memory-forest derrota (simulado)', posBefore: getCurrentPlayer().posicao, posAfter: getCurrentPlayer().posicao, cascaded: 'N\u00E3o' });
            break;
          }
          case "memoria-tempo": {
            document.getElementById('minigame-overlay').classList.add('hidden');
            gameState.isMoving = false;
            elements.rollBtn.disabled = false;
            addLog('\u23F1 Tempo encerrado (debug).');
            setEventResult({ eventType: 'memory-forest tempo (debug)', posBefore: getCurrentPlayer().posicao, posAfter: getCurrentPlayer().posicao });
            break;
          }
          case "memoria-retornar": {
            document.getElementById('minigame-overlay').classList.add('hidden');
            gameState.isMoving = false;
            elements.rollBtn.disabled = false;
            addLog('\u21A9\uFE0F Overlay do Jogo da Mem\u00F3ria fechado. Estado restaurado.');
            setEventResult({ eventType: 'retorno memory-forest (debug)', posBefore: getCurrentPlayer().posicao, posAfter: getCurrentPlayer().posicao });
            break;
          }
          case "memoria-bot": {
            if (currentWorldConfig?.id !== 'floresta-encantada') { addLog('\u26A0\uFE0F Teste v\u00e1lido apenas na Floresta Encantada'); break; }
            addLog('\uD83E\uDD16 Abrindo Jogo da Mem\u00F3ria (modo bot)...');
            const memBotResult = await launchMemoryForest({ isBot: true });
            const memBotDelta = memBotResult.boardDelta || 0;
            if (memBotDelta > 0) {
              const pMB = getCurrentPlayer();
              const destinoMB = Math.min(pMB.posicao + memBotDelta, getTotalCasas());
              pMB.posicao = destinoMB;
              addLog(`\u2705 Bot venceu! +${memBotDelta} casas \u2192 casa ${destinoMB}`);
            } else {
              addLog(`\u274C Bot perdeu. Pares: ${memBotResult.stats?.paresEncontrados ?? 0}/6`);
            }
            setEventResult({ eventType: 'memory-forest bot (debug)', posBefore: getCurrentPlayer().posicao - memBotDelta, posAfter: getCurrentPlayer().posicao, cascaded: 'N\u00E3o' });
            break;
          }

          // ── Testes Rápidos: Oceanos ──
          case "oceanos-casa2": {
            if (currentWorldConfig?.id !== 'reino-oceanos') { addLog('\u26A0\uFE0F Teste v\u00E1lido apenas no Reino dos Oceanos'); break; }
            if (gameState.activeSubworldId) { addLog('\u26A0\uFE0F Est\u00E1 em submundo. Use o bot\u00E3o de sair primeiro.'); break; }
            await debugMoveAndProcess(2);
            break;
          }
          case "oceanos-casa4": {
            if (currentWorldConfig?.id !== 'reino-oceanos') { addLog('\u26A0\uFE0F Teste v\u00E1lido apenas no Reino dos Oceanos'); break; }
            if (gameState.activeSubworldId) { addLog('\u26A0\uFE0F Est\u00E1 em submundo. Use o bot\u00E3o de sair primeiro.'); break; }
            await debugMoveAndProcess(4);
            break;
          }
          case "oceanos-casa5": {
            if (currentWorldConfig?.id !== 'reino-oceanos') { addLog('\u26A0\uFE0F Teste v\u00E1lido apenas no Reino dos Oceanos'); break; }
            if (gameState.activeSubworldId) { addLog('\u26A0\uFE0F Est\u00E1 em submundo. Use o bot\u00E3o de sair primeiro.'); break; }
            await debugMoveAndProcess(5);
            break;
          }
          case "oceanos-casa8": {
            if (currentWorldConfig?.id !== 'reino-oceanos') { addLog('\u26A0\uFE0F Teste v\u00E1lido apenas no Reino dos Oceanos'); break; }
            if (gameState.activeSubworldId) { addLog('\u26A0\uFE0F Est\u00E1 em submundo. Use o bot\u00E3o de sair primeiro.'); break; }
            await debugMoveAndProcess(8);
            break;
          }
          case "oceanos-casa9": {
            if (currentWorldConfig?.id !== 'reino-oceanos') { addLog('\u26A0\uFE0F Teste v\u00E1lido apenas no Reino dos Oceanos'); break; }
            if (gameState.activeSubworldId) { addLog('\u26A0\uFE0F Est\u00E1 em submundo. Use o bot\u00E3o de sair primeiro.'); break; }
            await debugMoveAndProcess(9);
            break;
          }
          case "oceanos-casa12": {
            if (currentWorldConfig?.id !== 'reino-oceanos') { addLog('\u26A0\uFE0F Teste v\u00E1lido apenas no Reino dos Oceanos'); break; }
            if (gameState.activeSubworldId) { addLog('\u26A0\uFE0F Est\u00E1 em submundo. Use o bot\u00E3o de sair primeiro.'); break; }
            await debugMoveAndProcess(12);
            break;
          }
          case "oceanos-casa16": {
            if (currentWorldConfig?.id !== 'reino-oceanos') { addLog('\u26A0\uFE0F Teste v\u00E1lido apenas no Reino dos Oceanos'); break; }
            if (gameState.activeSubworldId) { addLog('\u26A0\uFE0F Est\u00E1 em submundo. Use o bot\u00E3o de sair primeiro.'); break; }
            await debugMoveAndProcess(16);
            break;
          }
          case "oceanos-casa17": {
            if (currentWorldConfig?.id !== 'reino-oceanos') { addLog('\u26A0\uFE0F Teste v\u00E1lido apenas no Reino dos Oceanos'); break; }
            if (gameState.activeSubworldId) { addLog('\u26A0\uFE0F Est\u00E1 em submundo. Use o bot\u00E3o de sair primeiro.'); break; }
            await debugMoveAndProcess(17);
            break;
          }
          case "oceanos-casa18": {
            if (currentWorldConfig?.id !== 'reino-oceanos') { addLog('\u26A0\uFE0F Teste v\u00E1lido apenas no Reino dos Oceanos'); break; }
            if (gameState.activeSubworldId) { addLog('\u26A0\uFE0F Est\u00E1 em submundo. Use o bot\u00E3o de sair primeiro.'); break; }
            await debugMoveAndProcess(18);
            break;
          }
          case "oceanos-casa20": {
            if (currentWorldConfig?.id !== 'reino-oceanos') { addLog('\u26A0\uFE0F Teste v\u00E1lido apenas no Reino dos Oceanos'); break; }
            if (gameState.activeSubworldId) { addLog('\u26A0\uFE0F Est\u00E1 em submundo. Use o bot\u00E3o de sair primeiro.'); break; }
            await debugMoveAndProcess(20);
            break;
          }

          // ── Testes Rápidos: Galáxia ──
          case "galaxia-casa7": {
            if (currentWorldConfig?.id !== 'galaxia-estelar') { addLog('\u26A0\uFE0F Teste v\u00E1lido apenas na Gal\u00E1xia Estelar'); break; }
            if (gameState.activeSubworldId) { addLog('\u26A0\uFE0F Est\u00E1 em submundo. Use o bot\u00E3o de sair primeiro.'); break; }
            await debugMoveAndProcess(7);
            break;
          }
          case "galaxia-casa9": {
            if (currentWorldConfig?.id !== 'galaxia-estelar') { addLog('\u26A0\uFE0F Teste v\u00E1lido apenas na Gal\u00E1xia Estelar'); break; }
            if (gameState.activeSubworldId) { addLog('\u26A0\uFE0F Est\u00E1 em submundo. Use o bot\u00E3o de sair primeiro.'); break; }
            await debugMoveAndProcess(9);
            break;
          }
          case "galaxia-casa14": {
            if (currentWorldConfig?.id !== 'galaxia-estelar') { addLog('\u26A0\uFE0F Teste v\u00E1lido apenas na Gal\u00E1xia Estelar'); break; }
            if (gameState.activeSubworldId) { addLog('\u26A0\uFE0F Est\u00E1 em submundo. Use o bot\u00E3o de sair primeiro.'); break; }
            await debugMoveAndProcess(14);
            break;
          }
          case "galaxia-casa15": {
            if (currentWorldConfig?.id !== 'galaxia-estelar') { addLog('\u26A0\uFE0F Teste v\u00E1lido apenas na Gal\u00E1xia Estelar'); break; }
            if (gameState.activeSubworldId) { addLog('\u26A0\uFE0F Est\u00E1 em submundo. Use o bot\u00E3o de sair primeiro.'); break; }
            await debugMoveAndProcess(15);
            break;
          }
          case "galaxia-minigame": {
            if (currentWorldConfig?.id !== 'galaxia-estelar') { addLog('\u26A0\uFE0F Teste v\u00E1lido apenas na Gal\u00E1xia Estelar'); break; }
            const p = getCurrentPlayer();
            addLog('\uD83C\uDFAE Abrindo minigame manualmente...');
            gameState.isMoving = true;
            elements.rollBtn.disabled = true;
            const resultado = await launchMeteoroGame();
            gameState.isMoving = false;
            elements.rollBtn.disabled = false;
            if (resultado.venceu) {
              const destino = Math.min(p.posicao + resultado.boardDelta, getTotalCasas());
              if (destino > p.posicao) {
                await animatePlayerMovement(p.posicao, destino);
              }
              p.posicao = destino;
              addLog(`\u2705 Minigame vencido! Avan\u00E7ou +${resultado.boardDelta} \u2192 casa ${destino}`);
            } else {
              addLog(`\uD83D\uDCA5 Minigame perdido! B\u00F4nus: 0`);
            }
            updateUI();
            setEventResult({ eventType: 'minigame (debug)', posBefore: p.posicao, posAfter: p.posicao });
            break;
          }
          case "galaxia-vitoria": {
            if (currentWorldConfig?.id !== 'galaxia-estelar') { addLog('\u26A0\uFE0F Teste v\u00E1lido apenas na Gal\u00E1xia Estelar'); break; }
            const pWin = getCurrentPlayer();
            const posicaoOriginal = pWin.posicao;
            const BONUS = 3;
            const destino = Math.min(posicaoOriginal + BONUS, getTotalCasas());
            addLog('\u2705 Simulando vit\u00F3ria no minigame...');
            gameState.isMoving = true;
            elements.rollBtn.disabled = true;
            if (destino > posicaoOriginal) {
              await animatePlayerMovement(posicaoOriginal, destino);
            }
            pWin.posicao = destino;
            gameState.isMoving = false;
            elements.rollBtn.disabled = false;
            updateUI();
            addLog(`\u2705 B\u00F4nus aplicado: +${BONUS} \u2192 casa ${destino} (sem cascata)`);
            if (pWin.posicao >= getTotalCasas()) {
              await handleVictory();
            }
            setEventResult({ eventType: 'minigame vit\u00F3ria (simulado)', posBefore: posicaoOriginal, posAfter: destino, cascaded: 'N\u00E3o (debug)' });
            break;
          }
          case "galaxia-derrota": {
            if (currentWorldConfig?.id !== 'galaxia-estelar') { addLog('\u26A0\uFE0F Teste v\u00E1lido apenas na Gal\u00E1xia Estelar'); break; }
            addLog('\u274C Simulando derrota no minigame...');
            addLog('\uD83D\uDCA5 Nave destru\u00EDda! B\u00F4nus: 0');
            setEventResult({ eventType: 'minigame derrota (simulado)', posBefore: getCurrentPlayer().posicao, posAfter: getCurrentPlayer().posicao, cascaded: 'N\u00E3o' });
            break;
          }
          case "galaxia-retornar": {
            if (currentWorldConfig?.id !== 'galaxia-estelar') { addLog('\u26A0\uFE0F Teste v\u00E1lido apenas na Gal\u00E1xia Estelar'); break; }
            document.getElementById('minigame-overlay').classList.add('hidden');
            gameState.isMoving = false;
            elements.rollBtn.disabled = false;
            addLog('\u21A9\uFE0F Overlay do minigame fechado. Estado restaurado.');
            setEventResult({ eventType: 'retorno (debug)', posBefore: getCurrentPlayer().posicao, posAfter: getCurrentPlayer().posicao });
            break;
          }

          // ── Testes Rápidos: Ocean Match-3 ──
          case "ocean-match3-minigame": {
            const pOcean = getCurrentPlayer();
            addLog('\uD83C\uDFAE Abrindo Ocean Match-3 manualmente...');
            gameState.isMoving = true;
            elements.rollBtn.disabled = true;
            let resultadoOcean;
            try {
              resultadoOcean = await launchOceanMatch3();
            } catch (err) {
              addLog(`\u274C Erro ao abrir Ocean Match-3: ${err.message}`);
              console.error('[Ocean Match-3 Error]', err);
              gameState.isMoving = false;
              elements.rollBtn.disabled = false;
              updateUI();
              break;
            }
            gameState.isMoving = false;
            elements.rollBtn.disabled = false;
            if (resultadoOcean.venceu) {
              const destino = Math.min(pOcean.posicao + resultadoOcean.boardDelta, getTotalCasas());
              if (destino > pOcean.posicao) {
                await animatePlayerMovement(pOcean.posicao, destino);
              }
              pOcean.posicao = destino;
              addLog(`\u2705 Ocean Match-3 vencido! Avan\u00E7ou +${resultadoOcean.boardDelta} \u2192 casa ${destino}`);
            } else {
              addLog(`\uD83D\uDCA5 Ocean Match-3 perdido! B\u00F4nus: 0`);
            }
            updateUI();
            setEventResult({ eventType: 'ocean-match3 (debug)', posBefore: pOcean.posicao, posAfter: pOcean.posicao });
            break;
          }
          case "ocean-match3-vitoria": {
            const pOV = getCurrentPlayer();
            const BONUS_OCEAN = 3;
            const destinoOV = Math.min(pOV.posicao + BONUS_OCEAN, getTotalCasas());
            addLog('\u2705 Simulando vit\u00F3ria no Ocean Match-3...');
            gameState.isMoving = true;
            elements.rollBtn.disabled = true;
            if (destinoOV > pOV.posicao) {
              await animatePlayerMovement(pOV.posicao, destinoOV);
            }
            pOV.posicao = destinoOV;
            gameState.isMoving = false;
            elements.rollBtn.disabled = false;
            updateUI();
            addLog(`\u2705 B\u00F4nus aplicado: +${BONUS_OCEAN} \u2192 casa ${destinoOV} (sem cascata)`);
            if (pOV.posicao >= getTotalCasas()) {
              await handleVictory();
            }
            setEventResult({ eventType: 'ocean-match3 vit\u00F3ria (simulado)', posBefore: pOV.posicao - BONUS_OCEAN, posAfter: destinoOV, cascaded: 'N\u00E3o (debug)' });
            break;
          }
          case "ocean-match3-tempo": {
            addLog('\u274C Simulando fim do tempo no Ocean Match-3...');
            addLog('\uD83C\uDF0A Tempo esgotado! B\u00F4nus: 0');
            setEventResult({ eventType: 'ocean-match3 tempo (simulado)', posBefore: getCurrentPlayer().posicao, posAfter: getCurrentPlayer().posicao, cascaded: 'N\u00E3o' });
            break;
          }
          case "ocean-match3-retornar": {
            document.getElementById('minigame-overlay').classList.add('hidden');
            gameState.isMoving = false;
            elements.rollBtn.disabled = false;
            addLog('\u21A9\uFE0F Overlay do Ocean Match-3 fechado. Estado restaurado.');
            setEventResult({ eventType: 'retorno ocean (debug)', posBefore: getCurrentPlayer().posicao, posAfter: getCurrentPlayer().posicao });
            break;
          }

          // ── Ocean Match-3 Debug ──
          case "ocean-match3-time-20": {
            _debugOceanTimeConfig = 20;
            _updateDebugTimeLabel();
            addLog('\u23F1 Tempo do Ocean Match-3 configurado para 20s.');
            break;
          }
          case "ocean-match3-time-30": {
            _debugOceanTimeConfig = 30;
            _updateDebugTimeLabel();
            addLog('\u23F1 Tempo do Ocean Match-3 configurado para 30s.');
            break;
          }
          case "ocean-match3-time-45": {
            _debugOceanTimeConfig = null;
            _updateDebugTimeLabel();
            addLog('\u23F1 Tempo do Ocean Match-3 restaurado para 45s (padr\u00E3o).');
            break;
          }
          case "ocean-match3-time-60": {
            _debugOceanTimeConfig = 60;
            _updateDebugTimeLabel();
            addLog('\u23F1 Tempo do Ocean Match-3 configurado para 60s.');
            break;
          }
          case "ocean-match3-time-inf": {
            _debugOceanTimeConfig = Infinity;
            _updateDebugTimeLabel();
            addLog('\u267E\uFE0F Ocean Match-3 em modo sem limite de tempo.');
            break;
          }
          case "ocean-match3-restart": {
            const oldInst = OceanMatch3.currentInstance;
            if (oldInst && oldInst._started) {
              oldInst.destroy();
            }
            addLog('\uD83D\uDD04 Ocean Match-3 reiniciado...');
            gameState.isMoving = true;
            elements.rollBtn.disabled = true;
            try {
              await launchOceanMatch3();
            } catch (err) {
              addLog(`\u274C Erro ao reiniciar Ocean Match-3: ${err.message}`);
              console.error('[Ocean Match-3 Restart Error]', err);
            }
            gameState.isMoving = false;
            elements.rollBtn.disabled = false;
            setEventResult({ eventType: 'ocean-match3 restart (debug)', posBefore: getCurrentPlayer().posicao, posAfter: getCurrentPlayer().posicao });
            break;
          }
          case "ocean-match3-estado": {
            const inst = OceanMatch3.currentInstance;
            if (!inst || !inst._started) {
              addLog('\uD83D\uDD0E Ocean Match-3 n\u00E3o est\u00E1 ativo.');
            } else {
              const s = inst.getDebugState();
              const sel = s.selectedCell
                ? `(${s.selectedCell.row},${s.selectedCell.col})`
                : 'nenhuma';
              const swapInfo = s.lastSwap
                ? `, \u00FAltima: (${s.lastSwap.from.row},${s.lastSwap.from.col}) ${s.lastSwap.from.type} \u2194 (${s.lastSwap.to.row},${s.lastSwap.to.col}) ${s.lastSwap.to.type}`
                : '';
              addLog(
                `\uD83D\uDD0E Estado: grade ${s.rows}\u00D76, ${s.totalPieces} pe\u00E7as, ` +
                `sele\u00E7\u00E3o: ${sel}, trocas: ${s.swapCount}${swapInfo}`
              );
            }
            break;
          }
          case "ocean-match3-regenerar": {
            const inst2 = OceanMatch3.currentInstance;
            if (!inst2 || !inst2._started) {
              addLog('\uD83D\uDD04 Ocean Match-3 n\u00E3o est\u00E1 ativo.');
            } else if (inst2.interactionLocked) {
              addLog('\u26A0\uFE0F A m\u00E1quina est\u00E1 jogando este minigame. Aguarde.');
            } else {
              inst2.regenerateGrid();
              addLog('\uD83D\uDD04 Grade do Ocean Match-3 regenerada.');
            }
            break;
          }
          case "ocean-match3-detectar": {
            const inst3 = OceanMatch3.currentInstance;
            if (!inst3 || !inst3._started) {
              addLog('\uD83D\uDD0D Ocean Match-3 n\u00E3o est\u00E1 ativo.');
            } else if (inst3.interactionLocked) {
              addLog('\u26A0\uFE0F A m\u00E1quina est\u00E1 jogando este minigame. Aguarde.');
            } else {
              const matches = inst3._findMatches(inst3.grid);
              if (matches.hasMatches) {
                const totalCells = matches.cells.length;
                const groups = matches.groups.map(g =>
                  `${g.type} (${g.direction}, ${g.cells.length} pe\u00E7as)`
                ).join('; ');
                addLog(`\uD83D\uDD0D ${matches.groups.length} grupo(s) encontrados: ${groups} (${totalCells} c\u00E9lulas no total)`);
              } else {
                addLog('\uD83D\uDD0D Nenhuma combina\u00E7\u00E3o encontrada na grade atual.');
              }
            }
            break;
          }
          case "ocean-match3-load-test": {
            const inst4 = OceanMatch3.currentInstance;
            if (!inst4 || !inst4._started) {
              addLog('\uD83E\uDDEA Ocean Match-3 n\u00E3o est\u00E1 ativo.');
            } else if (inst4.interactionLocked) {
              addLog('\u26A0\uFE0F A m\u00E1quina est\u00E1 jogando este minigame. Aguarde.');
            } else {
              inst4._loadTestGrid();
              addLog('\uD83E\uDDEA Grade de teste carregada (v\u00E1rias combina\u00E7\u00F5es prontas).');
            }
            break;
          }
          case "ocean-match3-load-empty": {
            const inst5 = OceanMatch3.currentInstance;
            if (!inst5 || !inst5._started) {
              addLog('\u2B1C Ocean Match-3 n\u00E3o est\u00E1 ativo.');
            } else if (inst5.interactionLocked) {
              addLog('\u26A0\uFE0F A m\u00E1quina est\u00E1 jogando este minigame. Aguarde.');
            } else {
              inst5._loadEmptyCellsTestGrid();
              addLog('\u2B1C Grade com c\u00E9lulas vazias carregada.');
            }
            break;
          }

          // ── Testes Rápidos: Castelo dos Dragões ──
          case "castelo-casa15": {
            if (gameState.activeSubworldId) { addLog('\u26A0\uFE0F Est\u00e1 em submundo.'); break; }
            if (currentWorldConfig?.id !== 'castelo-dragoes') { addLog('\u26A0\uFE0F Teste v\u00e1lido apenas no Castelo dos Drag\u00F5es'); break; }
            await debugMoveAndProcess(15);
            break;
          }
          case "castelo-casa18": {
            if (gameState.activeSubworldId) { addLog('\u26A0\uFE0F Est\u00e1 em submundo.'); break; }
            if (currentWorldConfig?.id !== 'castelo-dragoes') { addLog('\u26A0\uFE0F Teste v\u00e1lido apenas no Castelo dos Drag\u00F5es'); break; }
            await debugMoveAndProcess(18);
            break;
          }
          case "ataque-dragoes-minigame": {
            addLog('\uD83C\uDFAE Abrindo Ataque dos Drag\u00F5es manualmente...');
            gameState.isMoving = true;
            elements.rollBtn.disabled = true;
            const ataqueResult = await launchAtaqueDragoes();
            gameState.isMoving = false;
            elements.rollBtn.disabled = false;
            if (ataqueResult.venceu) {
              const p = getCurrentPlayer();
              const destino = Math.min(p.posicao + ataqueResult.boardDelta, getTotalCasas());
              if (destino > p.posicao) {
                await animatePlayerMovement(p.posicao, destino);
              }
              p.posicao = destino;
              addLog(`\u2705 Ataque dos Drag\u00F5es vencido! Avan\u00E7ou +${ataqueResult.boardDelta} \u2192 casa ${destino}`);
            } else {
              addLog(`\uD83D\uDCA5 Ataque dos Drag\u00F5es perdido! B\u00F4nus: 0`);
            }
            updateUI();
            setEventResult({ eventType: 'ataque-dragoes (debug)', posBefore: getCurrentPlayer().posicao, posAfter: getCurrentPlayer().posicao });
            break;
          }
          case "ataque-dragoes-vitoria": {
            const pAD = getCurrentPlayer();
            const BONUS_AD = 3;
            const destinoAD = Math.min(pAD.posicao + BONUS_AD, getTotalCasas());
            addLog('\u2705 Simulando vit\u00F3ria no Ataque dos Drag\u00F5es...');
            gameState.isMoving = true;
            elements.rollBtn.disabled = true;
            if (destinoAD > pAD.posicao) {
              await animatePlayerMovement(pAD.posicao, destinoAD);
            }
            pAD.posicao = destinoAD;
            gameState.isMoving = false;
            elements.rollBtn.disabled = false;
            updateUI();
            addLog(`\u2705 B\u00F4nus aplicado: +${BONUS_AD} \u2192 casa ${destinoAD} (sem cascata)`);
            if (pAD.posicao >= getTotalCasas()) {
              await handleVictory();
            }
            setEventResult({ eventType: 'ataque-dragoes vit\u00F3ria (simulado)', posBefore: pAD.posicao - BONUS_AD, posAfter: destinoAD, cascaded: 'N\u00E3o (debug)' });
            break;
          }
          case "ataque-dragoes-derrota": {
            addLog('\u274C Simulando derrota no Ataque dos Drag\u00F5es...');
            addLog('\uD83D\uDC09 Drag\u00F5es foram r\u00E1pidos! B\u00F4nus: 0');
            setEventResult({ eventType: 'ataque-dragoes derrota (simulado)', posBefore: getCurrentPlayer().posicao, posAfter: getCurrentPlayer().posicao, cascaded: 'N\u00E3o' });
            break;
          }
          case "ataque-dragoes-retornar": {
            document.getElementById('minigame-overlay').classList.add('hidden');
            gameState.isMoving = false;
            elements.rollBtn.disabled = false;
            addLog('\u21A9\uFE0F Overlay do Ataque dos Drag\u00F5es fechado. Estado restaurado.');
            setEventResult({ eventType: 'retorno ataque-dragoes (debug)', posBefore: getCurrentPlayer().posicao, posAfter: getCurrentPlayer().posicao });
            break;
          }
          case "ataque-dragoes-bot": {
            addLog('\uD83E\uDD16 Abrindo Ataque dos Drag\u00F5es em modo bot...');
            gameState.isMoving = true;
            elements.rollBtn.disabled = true;
            const ataqueBotResult = await launchAtaqueDragoes({ isBot: true });
            gameState.isMoving = false;
            elements.rollBtn.disabled = false;
            if (ataqueBotResult.venceu) {
              const pMB = getCurrentPlayer();
              const destinoMB = Math.min(pMB.posicao + ataqueBotResult.boardDelta, getTotalCasas());
              if (destinoMB > pMB.posicao) {
                await animatePlayerMovement(pMB.posicao, destinoMB);
              }
              pMB.posicao = destinoMB;
              addLog(`\u2705 Bot venceu Ataque dos Drag\u00F5es! Avan\u00E7ou +${ataqueBotResult.boardDelta} \u2192 casa ${destinoMB}`);
            } else {
              addLog(`\uD83D\uDCA5 Bot perdeu Ataque dos Drag\u00F5es! B\u00F4nus: 0`);
            }
            updateUI();
            setEventResult({ eventType: 'ataque-dragoes bot (debug)', posBefore: getCurrentPlayer().posicao, posAfter: getCurrentPlayer().posicao });
            break;
          }

          // ── Limpar Logs ──
          case "clear-logs":
            debugLog.length = 0;
            renderLogs();
            break;
          case "toggle-questions": {
            const dq = document.getElementById('debug-questions');
            const btn = document.querySelector('[data-debug="toggle-questions"]');
            if (dq && btn) {
              dq.classList.toggle('hidden');
              btn.textContent = dq.classList.contains('hidden') ? '📚 Mostrar' : '📚 Ocultar';
              if (!dq.classList.contains('hidden')) renderQuestions();
            }
            break;
          }
        }
      } catch (err) {
        addLog(`\u274C Erro: ${err.message}`);
        console.error('[Debug Error]', err);
        gameState.isMoving = false;
        elements.rollBtn.disabled = false;
      }
    });

    function renderQuestions() {
      const totalEl = document.getElementById('dq-total');
      const usadasEl = document.getElementById('dq-usadas');
      const mundoEl = document.getElementById('dq-mundo');
      const listEl = document.getElementById('dq-list');
      if (!listEl) return;
      const total = questoesDisponiveis.length;
      const usadas = gameState.questoesUsadas.size;
      if (totalEl) totalEl.textContent = `${total}`;
      if (usadasEl) usadasEl.textContent = `${usadas}/${total}`;
      if (mundoEl) {
        const mid = gameState.activeSubworldId || selectedWorldId;
        const cats = getCategoriasPorMundo(mid);
        mundoEl.textContent = cats.length > 0 ? `${mid} (${cats.join(', ')})` : `${mid || 'nenhum'} (geral)`;
      }
      const html = [];
      for (const [cat, questoes] of Object.entries(bancoQuestoes)) {
        html.push(`<div class="debug-dq-cat"><strong>${cat}</strong> (${questoes.length})</div>`);
        questoes.forEach((q, i) => {
          const realIdx = categoryIndices[cat][i];
          const usada = usadas > 0 && gameState.questoesUsadas.has(realIdx);
          const difLabel = q.dificuldade ? ` [${q.dificuldade}]` : '';
          html.push(`<div class="debug-dq-item${usada ? ' debug-dq-usada' : ''}">`);
          html.push(`<span class="debug-dq-idx">#${realIdx}</span>`);
          html.push(`<span class="debug-dq-pergunta">${q.pergunta}</span>`);
          html.push(`<span class="debug-dq-opcoes">${q.opcoes.join(', ')}</span>`);
          html.push(`<span class="debug-dq-resposta">${q.resposta}${difLabel}</span>`);
          html.push(`</div>`);
        });
      }
      listEl.innerHTML = html.join('');
    }

    renderState();
    renderLogs();
    renderEventResult();
    renderQuestions();
    setInterval(renderQuestions, 1000);
  }

  /* ── Gallery Token Initialization ── */

  function initGalleryTokens() {
    document.querySelectorAll('.emoji-btn').forEach(btn => {
      const avatar = btn.dataset.avatar;
      if (!avatar) return;
      const emoji = btn.dataset.emoji || '';
      const imgSrc = `assets/tokens/${avatar}.webp`;
      const emojiSpan = document.createElement('span');
      emojiSpan.className = 'btn-emoji';
      emojiSpan.textContent = btn.textContent;
      btn.textContent = '';
      btn.appendChild(emojiSpan);
      const imgEl = document.createElement('img');
      imgEl.className = 'btn-img';
      imgEl.alt = '';
      btn.appendChild(imgEl);
      applyVisualFallback(emojiSpan, imgEl, emoji, imgSrc);
    });
  }

  /* ── Minigame host wrapper ── */

  async function launchMeteoroGame(options = {}) {
    return launchMinigameHost('meteor-game', {
      isBot: options.isBot || false,
      playerName: getCurrentPlayer().name
    });
  }

  let _debugOceanTimeConfig = null; // null = default (45), number = specific, Infinity = no limit

  function _updateDebugTimeLabel() {
    const label = document.getElementById('debug-ocean-current-time');
    if (!label) return;
    const val = _debugOceanTimeConfig;
    if (val === Infinity) label.textContent = 'Tempo atual: \u221E (sem limite)';
    else if (val === null) label.textContent = 'Tempo atual: 45s (padr\u00E3o)';
    else label.textContent = `Tempo atual: ${val}s`;
  }

  async function launchDinoRunner(options = {}) {
    return launchMinigameHost('dino-runner', {
      isBot: options.isBot || false,
      playerName: getCurrentPlayer().name
    });
  }

  async function launchMemoryForest(options = {}) {
    return launchMinigameHost('memory-forest', {
      isBot: options.isBot || false,
      playerName: getCurrentPlayer().name
    });
  }

  async function launchOceanMatch3(options = {}) {
    OceanMatch3.debugTimeLimit = _debugOceanTimeConfig;
    return launchMinigameHost('ocean-match3', {
      isBot: options.isBot || false,
      playerName: getCurrentPlayer().name
    });
  }

  async function launchAtaqueDragoes(options = {}) {
    return launchMinigameHost('ataque-dragoes', {
      isBot: options.isBot || false,
      playerName: getCurrentPlayer().name
    });
  }

  /* ── Init ── */

  function init() {
    const verEl = document.getElementById('menu-version');
    if (verEl) verEl.textContent = APP_VERSION;
    initGalleryTokens();
    enableWorldCard('dinossauros');
    enableWorldCard('galaxia-estelar');
    enableWorldCard('reino-oceanos');
    enableWorldCard('castelo-dragoes');
    audioManager.init();

    document.addEventListener('click', function firstInteraction() {
      document.removeEventListener('click', firstInteraction);
      if (audioManager._ctx && audioManager._ctx.state === 'suspended') {
        audioManager._ctx.resume();
      }
    }, { once: true });

    elements.rollBtn.addEventListener("click", jogarDado);
    elements.resetBtn.addEventListener("click", reiniciarJogo);
    if (elements.victoryPlayAgainBtn) {
      elements.victoryPlayAgainBtn.addEventListener("click", () => {
        audioManager.play('buttonClick');
        if (elements.victoryOverlay) {
          elements.victoryOverlay.classList.add("hidden");
        }
        resetGameState();
        if (modoJogo === "rapido") {
          showSetupScreen();
        } else {
          showMainMenu();
        }
      });
    }
    if (elements.victoryMainMenuBtn) {
      elements.victoryMainMenuBtn.addEventListener("click", () => {
        audioManager.play('buttonClick');
        if (elements.victoryOverlay) {
          elements.victoryOverlay.classList.add("hidden");
        }
        resetGameState();
        showMainMenu();
      });
    }
    document.getElementById("draw-start-btn").addEventListener("click", continueAfterDraw);

    const historyToggle = document.querySelector(".history-toggle");
    if (historyToggle) {
      historyToggle.addEventListener("click", function () {
        const hist = document.getElementById("history");
        hist.classList.toggle("expanded");
        this.textContent = hist.classList.contains("expanded") ? "\u25B2" : "\u25BC";
      });
    }

    showMainMenu();
    setupMenuEvents();
    setupWorldSelectorEvents();
    setupModalEvents();
    setupDebugMode();
    _updateDebugTimeLabel();
  }

  document.addEventListener("DOMContentLoaded", async () => {
    await loadAllWorlds();
    init();
  });
})();
