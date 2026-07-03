(function () {
  const TOTAL_CASAS = 20;
  const PLAYER_COUNT = 2;

  /* ── Players ── */
  const players = [
    { id: 1, name: 'Lara', emoji: '🧒', posicao: 0, rodadasPerdidas: 0, element: null },
    { id: 2, name: 'Amigo', emoji: '🧑', posicao: 0, rodadasPerdidas: 0, element: null },
  ];

  const gameState = {
    currentPlayerIndex: 0,
    jogoAtivo: true,
    jogoFinalizado: false,
    isMoving: false,
  };

  const casasEspeciais = {
    3: { tipo: "avancar", valor: 2, descricao: "Avance 2 casas!" },
    5: { tipo: "voltar", valor: 1, descricao: "Volte 1 casa!" },
    8: { tipo: "jogar-novamente", valor: 0, descricao: "Jogue novamente!" },
    10: { tipo: "perde-rodada", valor: 0, descricao: "Perdeu uma rodada!" },
    15: { tipo: "voltar-inicio", valor: 0, descricao: "Volte para o início!" },
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
      elements.currentPlayerName.textContent = `${p.emoji} ${p.name}`;
    }
    if (elements.p1Pos) elements.p1Pos.textContent = players[0].posicao;
    if (elements.p2Pos) elements.p2Pos.textContent = players[1].posicao;
    if (elements.p1Label) elements.p1Label.textContent = `${players[0].emoji} ${players[0].name}`;
    if (elements.p2Label) elements.p2Label.textContent = `${players[1].emoji} ${players[1].name}`;
    if (elements.lara) elements.lara.textContent = players[0].emoji;
    if (elements.laraP2) elements.laraP2.textContent = players[1].emoji;
  }

  const elements = {
    track: document.getElementById("track"),
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
  };

  players[0].element = elements.lara;
  players[1].element = elements.laraP2;

  /* ── Helpers ── */

  function delay(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  /* ── SVG Path ── */

  function renderSvgPath() {
    const sorted = Object.keys(boardPositions)
      .sort((a, b) => a - b)
      .map((k) => boardPositions[k]);

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
    for (let i = 1; i <= TOTAL_CASAS; i++) {
      const pos = boardPositions[i];

      const casa = document.createElement("div");
      casa.className = "casa";
      casa.id = `casa-${i}`;
      casa.dataset.position = i;
      casa.style.left = pos.x + "%";
      casa.style.top = pos.y + "%";

      if (casasEspeciais[i]) {
        casa.classList.add(i === 20 ? "casa-vitoria" : "casa-especial");
      }

      const icone = document.createElement("span");
      icone.className = "casa-icone";
      icone.textContent = icons[i - 1] || "⬜";

      const numero = document.createElement("span");
      numero.className = "casa-numero";
      numero.textContent = i;

      const tipo = document.createElement("span");
      tipo.className = "casa-tipo";
      if (casasEspeciais[i]) {
        tipo.textContent = casasEspeciais[i].descricao;
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

    if (casaNumero < 1 || casaNumero > TOTAL_CASAS) {
      el.classList.remove("visivel");
      return;
    }

    const cell = document.getElementById(`casa-${casaNumero}`);
    if (!cell) return;

    const container = document.getElementById("track-container");
    const cRect = container.getBoundingClientRect();
    const cellRect = cell.getBoundingClientRect();

    const laraW = 58;
    const laraH = 58;

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
    el.classList.add("visivel");
  }

  /* ── Animation ── */

  async function animatePlayerMovement(from, to) {
    if (from === to) return;

    const step = from < to ? 1 : -1;
    const positions = [];
    for (let p = from + step; step > 0 ? p <= to : p >= to; p += step) {
      positions.push(p);
    }

    const player = getCurrentPlayer();
    const el = getPlayerElement(player);

    for (const pos of positions) {
      if (pos >= 1 && pos <= TOTAL_CASAS) {
        positionPlayerAt(pos);
        el.classList.remove("animar-lara-pos");
        void el.offsetWidth;
        el.classList.add("animar-lara-pos");
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

  async function processSpecialCell(posicao) {
    const player = getCurrentPlayer();
    const info = casasEspeciais[posicao];
    if (!info) return false;

    switch (info.tipo) {
      case "avancar": {
        const destino = Math.min(posicao + info.valor, TOTAL_CASAS);
        addHistory(`⭐ ${info.descricao} → casa ${destino}`, "especial");
        await animatePlayerMovement(posicao, destino);
        player.posicao = destino;
        if (destino >= TOTAL_CASAS) {
          await handleVictory();
          return false;
        }
        return await processSpecialCell(destino);
      }
      case "voltar": {
        const destino = Math.max(posicao - info.valor, 0);
        addHistory(`🐢 ${info.descricao} → casa ${destino}`, "especial");
        if (destino > 0) {
          await animatePlayerMovement(posicao, destino);
        }
        player.posicao = destino;
        positionPlayerAt(destino);
        return false;
      }
      case "jogar-novamente": {
        addHistory(`🎯 ${info.descricao}`, "especial");
        return true;
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
      case "vitoria": {
        await handleVictory();
        return false;
      }
      default:
        return false;
    }
  }

  /* ── Victory ── */

  async function handleVictory() {
    const player = getCurrentPlayer();
    const el = getPlayerElement(player);

    player.posicao = TOTAL_CASAS;
    gameState.jogoFinalizado = true;
    gameState.jogoAtivo = false;
    elements.rollBtn.disabled = true;
    positionPlayerAt(TOTAL_CASAS);
    updateUI();

    el.classList.add("animar-vitoria");

    addHistory(`🎉🎉 PARABÉNS, ${player.name} venceu! 🎉🎉`, "vitoria");
  }

  /* ── End Turn ── */

  function unlockTurn() {
    gameState.isMoving = false;
    elements.rollBtn.disabled = false;
  }

  /* ── Main Action ── */

  async function jogarDado() {
    if (!gameState.jogoAtivo || gameState.jogoFinalizado || gameState.isMoving)
      return;

    gameState.isMoving = true;
    elements.rollBtn.disabled = true;

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
    await animateDice(resultado);

    const from = player.posicao;
    const target = Math.min(from + resultado, TOTAL_CASAS);

    if (target > from) {
      await animatePlayerMovement(from, target);
    } else if (target === 0) {
      positionPlayerAt(0);
    }

    player.posicao = target;

    addHistory(`🎲 ${player.name} tirou ${resultado} → casa ${target}`, "dado");

    if (target >= TOTAL_CASAS) {
      await handleVictory();
      gameState.isMoving = false;
      return;
    }

    const extraTurn = await processSpecialCell(target);

    if (gameState.jogoFinalizado) {
      gameState.isMoving = false;
      return;
    }

    if (extraTurn) {
      gameState.isMoving = false;
      elements.rollBtn.disabled = false;
      updateUI();
      addHistory("🎯 Jogue novamente!", "especial");
      return;
    }

    switchTurn();
    updateUI();
    unlockTurn();
  }

  /* ── Reset ── */

  function reiniciarJogo() {
    players.forEach(p => { p.posicao = 0; p.rodadasPerdidas = 0; });
    gameState.currentPlayerIndex = 0;
    gameState.jogoAtivo = true;
    gameState.jogoFinalizado = false;
    gameState.isMoving = false;

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
    showSetupScreen();
  }

  /* ── Modal Setup ── */

  function showSetupScreen() {
    document.getElementById("setup-screen").classList.remove("hidden");
  }

  function hideSetupScreen() {
    document.getElementById("setup-screen").classList.add("hidden");
  }

  function startGame() {
    players[0].name = document.getElementById("player1-name").value.trim() || "Jogador 1";
    players[1].name = document.getElementById("player2-name").value.trim() || "Jogador 2";

    const p1Selected = document.querySelector("#p1-emoji-grid .emoji-btn.selected");
    const p2Selected = document.querySelector("#p2-emoji-grid .emoji-btn.selected");
    players[0].emoji = p1Selected ? p1Selected.dataset.emoji : "🧒";
    players[1].emoji = p2Selected ? p2Selected.dataset.emoji : "🧑";

    elements.lara.textContent = players[0].emoji;
    elements.laraP2.textContent = players[1].emoji;

    hideSetupScreen();
    renderizarTrilha();
    renderSvgPath();
    updateUI();
    players.forEach(p => positionPlayerAt(p.posicao, p));
    addHistory("🎮 Bem-vindos ao Lara World!", "info");
  }

  function setupModalEvents() {
    const p1Name = document.getElementById("player1-name");
    const p2Name = document.getElementById("player2-name");
    const startBtn = document.getElementById("start-game-btn");
    const p1Grid = document.getElementById("p1-emoji-grid");
    const p2Grid = document.getElementById("p2-emoji-grid");

    let p1Emoji = null;
    let p2Emoji = null;

    function checkReady() {
      startBtn.disabled = !(p1Name.value.trim() && p1Emoji && p2Name.value.trim() && p2Emoji);
    }

    p1Name.addEventListener("input", checkReady);
    p2Name.addEventListener("input", checkReady);

    p1Grid.querySelectorAll(".emoji-btn").forEach(btn => {
      btn.addEventListener("click", function () {
        p1Grid.querySelectorAll(".emoji-btn").forEach(b => b.classList.remove("selected"));
        this.classList.add("selected");
        p1Emoji = this.dataset.emoji;
        checkReady();
      });
    });

    p2Grid.querySelectorAll(".emoji-btn").forEach(btn => {
      btn.addEventListener("click", function () {
        p2Grid.querySelectorAll(".emoji-btn").forEach(b => b.classList.remove("selected"));
        this.classList.add("selected");
        p2Emoji = this.dataset.emoji;
        checkReady();
      });
    });

    const p1Def = p1Grid.querySelector('.emoji-btn[data-emoji="🧒"]');
    const p2Def = p2Grid.querySelector('.emoji-btn[data-emoji="🧑"]');
    if (p1Def) { p1Def.classList.add("selected"); p1Emoji = "🧒"; }
    if (p2Def) { p2Def.classList.add("selected"); p2Emoji = "🧑"; }

    startBtn.addEventListener("click", startGame);
    checkReady();
  }

  /* ── Init ── */

  function init() {
    elements.rollBtn.addEventListener("click", jogarDado);
    elements.resetBtn.addEventListener("click", reiniciarJogo);
    showSetupScreen();
    setupModalEvents();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
