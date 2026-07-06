import { register, get, getDefault } from './engine/world-registry.js';
import { florestaEncantada } from './worlds/floresta/config.js';

(function () {
  const TOTAL_CASAS = 20;
  const PLAYER_COUNT = 2;

  /* ── Players ── */
  const players = [
    { id: 1, name: 'Lara', emoji: '🧒', posicao: 0, rodadasPerdidas: 0, element: null, isBot: false },
    { id: 2, name: 'Amigo', emoji: '🧑', posicao: 0, rodadasPerdidas: 0, element: null, isBot: false },
  ];

  const gameState = {
    currentPlayerIndex: 0,
    jogoAtivo: true,
    jogoFinalizado: false,
    isMoving: false,
    questoesUsadas: new Set(),
    mundoAtual: "principal",
    entradaFloresta: { 1: null, 2: null },
    entrouNoPortal: false,
  };

  let selectedWorldId = null;
  let currentWorldConfig = null;
  let isSinglePlayer = false;
  let botTurnScheduled = false;
  let modoJogo = null;
  let drawState = { rolls: [null, null], drawWinnerIndex: null };

  /* ── World-aware helpers ── */

  function getTotalCasas() {
    return gameState.mundoAtual === "floresta" ? FLORESTA_TOTAL : TOTAL_CASAS;
  }
  function getCasasEspeciais() {
    return gameState.mundoAtual === "floresta" ? florestaEspeciais : casasEspeciais;
  }
  function getPosicoes() {
    return gameState.mundoAtual === "floresta" ? florestaPosicoes : boardPositions;
  }
  function getIcones() {
    return gameState.mundoAtual === "floresta" ? florestaIcones : icons;
  }

  const casasEspeciais = {
    3: { tipo: "avancar", valor: 2, descricao: "Avance 2 casas!" },
    4: { tipo: "desafio", descricao: "Desafio!" },
    5: { tipo: "voltar", valor: 1, descricao: "Volte 1 casa!" },
    7: { tipo: "desafio", descricao: "Desafio!" },
     8: { tipo: "jogar-novamente", valor: 0, descricao: "Jogue novamente!" },
     10: { tipo: "perde-rodada", valor: 0, descricao: "Perdeu uma rodada!" },
     11: { tipo: "portal", descricao: "🌿 Portal da Floresta" },
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

  const bancoQuestoes = {
    Matematica: [
      { pergunta: "Quanto é 2 + 2?", opcoes: ["3", "4", "5"], resposta: "4" },
      { pergunta: "Quanto é 5 - 3?", opcoes: ["1", "2", "3"], resposta: "2" },
      { pergunta: "Quanto é 3 + 4?", opcoes: ["6", "7", "8"], resposta: "7" },
      { pergunta: "Quanto é 10 - 6?", opcoes: ["3", "4", "5"], resposta: "4" },
      { pergunta: "Quanto é 2 × 3?", opcoes: ["5", "6", "7"], resposta: "6" },
    ],
    Portugues: [
      { pergunta: "Qual é a primeira letra do alfabeto?", opcoes: ["A", "B", "C"], resposta: "A" },
      { pergunta: "Quantas vogais existem?", opcoes: ["3", "5", "7"], resposta: "5" },
      { pergunta: "Qual palavra está no plural?", opcoes: ["Gato", "Gatos", "Gatinho"], resposta: "Gatos" },
      { pergunta: "Complete: 'O ___ comeu a maçã.'", opcoes: ["menino", "menina", "meninos"], resposta: "menino" },
      { pergunta: "Qual letra inicia a palavra 'Bola'?", opcoes: ["A", "B", "C"], resposta: "B" },
    ],
    Animais: [
      { pergunta: "Qual animal faz 'miau'?", opcoes: ["Cachorro", "Gato", "Pato"], resposta: "Gato" },
      { pergunta: "Qual animal tem listras pretas e laranja?", opcoes: ["Leão", "Tigre", "Zebra"], resposta: "Tigre" },
      { pergunta: "Qual animal vive na água?", opcoes: ["Gato", "Peixe", "Pássaro"], resposta: "Peixe" },
      { pergunta: "Qual animal voa?", opcoes: ["Cachorro", "Peixe", "Pássaro"], resposta: "Pássaro" },
      { pergunta: "Qual animal late?", opcoes: ["Cachorro", "Gato", "Pato"], resposta: "Cachorro" },
    ],
    Espaco: [
      { pergunta: "Qual planeta é conhecido como planeta vermelho?", opcoes: ["Marte", "Terra", "Júpiter"], resposta: "Marte" },
      { pergunta: "O que é o Sol?", opcoes: ["Um planeta", "Uma estrela", "Uma lua"], resposta: "Uma estrela" },
      { pergunta: "Qual é o maior planeta do sistema solar?", opcoes: ["Marte", "Saturno", "Júpiter"], resposta: "Júpiter" },
      { pergunta: "O que a Lua faz ao redor da Terra?", opcoes: ["Gira", "Para", "Explode"], resposta: "Gira" },
      { pergunta: "Quantos planetas existem no sistema solar?", opcoes: ["7", "8", "9"], resposta: "8" },
    ],
    Natureza: [
      { pergunta: "Qual cor mistura azul e amarelo?", opcoes: ["Verde", "Roxo", "Laranja"], resposta: "Verde" },
      { pergunta: "O que as plantas precisam para crescer?", opcoes: ["Sombra", "Luz do sol", "Gelo"], resposta: "Luz do sol" },
      { pergunta: "Qual estação vem depois do inverno?", opcoes: ["Verão", "Primavera", "Outono"], resposta: "Primavera" },
      { pergunta: "Onde vivem os peixes?", opcoes: ["No céu", "Na água", "Na terra"], resposta: "Na água" },
      { pergunta: "Qual é o maior animal do mundo?", opcoes: ["Elefante", "Baleia", "Girafa"], resposta: "Baleia" },
    ],
    Dinossauros: [
      { pergunta: "Qual dinossauro é conhecido como 'rei dos dinossauros'?", opcoes: ["Triceratops", "T-Rex", "Estegossauro"], resposta: "T-Rex" },
      { pergunta: "Qual dinossauro tem placas nas costas?", opcoes: ["T-Rex", "Estegossauro", "Pterodáctilo"], resposta: "Estegossauro" },
      { pergunta: "Qual dinossauro tem três chifres?", opcoes: ["Triceratops", "T-Rex", "Estegossauro"], resposta: "Triceratops" },
      { pergunta: "Como os dinossauros desapareceram?", opcoes: ["Meteorito", "Frio", "Fome"], resposta: "Meteorito" },
      { pergunta: "Qual dinossauro tem pescoço muito comprido?", opcoes: ["T-Rex", "Braquiossauro", "Triceratops"], resposta: "Braquiossauro" },
    ],
  };

  const questoesDisponiveis = Object.values(bancoQuestoes).flat();

  /* ── Forest World ── */

  const FLORESTA_TOTAL = 8;

  const florestaPosicoes = {
    1: { x: 12, y: 20 },
    2: { x: 30, y: 20 },
    3: { x: 48, y: 22 },
    4: { x: 66, y: 30 },
    5: { x: 70, y: 52 },
    6: { x: 52, y: 62 },
    7: { x: 34, y: 62 },
    8: { x: 16, y: 70 },
  };

  const florestaIcones = ["🌲", "🍄", "🦊", "🌳", "🐿️", "🍃", "🦉", "👑"];

  const florestaEspeciais = {
    3: { tipo: "desafio", descricao: "🐾 Desafio da Floresta!" },
    5: { tipo: "atalho", descricao: "🌿 Atalho de Saída" },
    7: { tipo: "desafio", descricao: "🦉 Enigma do Guardião!" },
    8: { tipo: "saida-mundo", descricao: "🚪 Saída da Floresta" },
  };

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

    if (gameState.mundoAtual === "floresta" && p.id !== getCurrentPlayer().id) {
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
      if (pos >= 1 && pos <= getTotalCasas()) {
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

  function sortearQuestao() {
    const usadas = gameState.questoesUsadas;
    const total = questoesDisponiveis.length;
    if (usadas.size >= total) {
      usadas.clear();
    }
    let idx;
    do {
      idx = Math.floor(Math.random() * total);
    } while (usadas.has(idx));
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
        addHistory(`⭐ ${info.descricao} → casa ${destino}`, "especial");
        await animatePlayerMovement(posicao, destino);
        player.posicao = destino;
        if (destino >= getTotalCasas()) {
          await handleVictory();
          return false;
        }
        return await processSpecialCell(destino, _cascadeVisited);
      }
      case "voltar": {
        const destino = Math.max(posicao - info.valor, 0);
        addHistory(`🐢 ${info.descricao} → casa ${destino}`, "especial");
        if (destino > 0) {
          await animatePlayerMovement(posicao, destino);
        }
        player.posicao = destino;
        positionPlayerAt(destino);
        if (destino > 0 && getCasasEspeciais()[destino]) {
          return await processSpecialCell(destino, _cascadeVisited);
        }
        return false;
      }
      case "jogar-novamente": {
        addHistory(`🎯 ${info.descricao}`, "especial");
        return true;
      }
      case "portal": {
        const entrou = await resolvePortal();
        console.log("[PORTAL] entrou =", entrou);
        if (entrou) {
          console.log("[PORTAL] Antes: mundoAtual=" + gameState.mundoAtual + ", isMoving=" + gameState.isMoving + ", rollBtn.disabled=" + elements.rollBtn.disabled);
          gameState.entradaFloresta[player.id] = player.posicao;
          console.log("[PORTAL] posicaoSalva =", gameState.posicaoSalva);
          gameState.mundoAtual = "floresta";
          console.log("[PORTAL] mundoAtual =", gameState.mundoAtual);
          player.posicao = 0;
          console.log("[PORTAL] player.posicao = 0");
          renderizarTrilha();
          console.log("[PORTAL] renderizarTrilha done, total casas =", document.querySelectorAll(".casa").length, ", primeira casa id =", document.querySelector(".casa")?.id);
          renderSvgPath();
          console.log("[PORTAL] renderSvgPath done");
          elements.trackContainer.classList.add("mundo-floresta");
          console.log("[PORTAL] classList add mundo-floresta, track-container className =", elements.trackContainer.className);
          document.getElementById("world-indicator").classList.remove("hidden");
          console.log("[PORTAL] world-indicator hidden =", document.getElementById("world-indicator").classList.contains("hidden"));
          players.forEach(p => positionPlayerAt(p.posicao, p));
          console.log("[PORTAL] positionPlayerAt done for all players");
          updateUI();
          console.log("[PORTAL] updateUI done, isMoving=" + gameState.isMoving + ", rollBtn.disabled=" + elements.rollBtn.disabled);
          addHistory(`🌿 ${player.name} entrou no Mundo da Floresta!`, "especial");
          gameState.entrouNoPortal = true;
          gameState.isMoving = false;
          elements.rollBtn.disabled = false;
          console.log("[PORTAL] FINAL: isMoving=" + gameState.isMoving + ", rollBtn.disabled=" + elements.rollBtn.disabled + ", mundoAtual=" + gameState.mundoAtual);
          updateUI();
          console.log("[PORTAL] updateUI pos-final, rollBtn.disabled=" + elements.rollBtn.disabled);
          return true;
        } else {
          addHistory(`➡️ ${player.name} seguiu no tabuleiro principal.`, "info");
          return false;
        }
      }
      case "atalho": {
        const bonusA = 2;
        const entradaA = gameState.entradaFloresta[player.id];
        const destinoA = Math.min(entradaA + bonusA, TOTAL_CASAS);
        gameState.mundoAtual = "principal";
        gameState.entradaFloresta[player.id] = null;
        player.posicao = destinoA;
        renderizarTrilha();
        renderSvgPath();
        elements.trackContainer.classList.remove("mundo-floresta");
        document.getElementById("world-indicator").classList.add("hidden");
        players.forEach(p => positionPlayerAt(p.posicao, p));
        updateUI();
        addHistory(`🌿 ${player.name} pegou o Atalho da Floresta e voltou com +${bonusA} casas!`, "especial");
        if (destinoA >= TOTAL_CASAS) {
          await handleVictory();
          return false;
        }
        return false;
      }
      case "saida-mundo": {
        const bonus = 3;
        const entrada = gameState.entradaFloresta[player.id];
        const destino = Math.min(entrada + bonus, TOTAL_CASAS);
        gameState.mundoAtual = "principal";
        gameState.entradaFloresta[player.id] = null;
        player.posicao = destino;
        renderizarTrilha();
        renderSvgPath();
        elements.trackContainer.classList.remove("mundo-floresta");
        document.getElementById("world-indicator").classList.add("hidden");
        players.forEach(p => positionPlayerAt(p.posicao, p));
        updateUI();
        addHistory(`✨ ${player.name} completou o Mundo da Floresta! Avançou ${bonus} casas!`, "especial");
        if (destino >= TOTAL_CASAS) {
          await handleVictory();
          return false;
        }
        return false;
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
        addHistory(`❓ ${player.name} caiu em um desafio!`, "especial");
        const acertou = await resolveChallenge(desafio);
        if (acertou) {
          const destino = Math.min(posicao + 1, getTotalCasas());
          if (destino > posicao) {
            await animatePlayerMovement(posicao, destino);
          }
          player.posicao = destino;
          positionPlayerAt(destino);
          addHistory(`✅ ${player.name} acertou! Avançou para casa ${destino}`, "especial");
        } else {
          const destino = Math.max(posicao - 1, 0);
          if (destino > 0 && destino < posicao) {
            await animatePlayerMovement(posicao, destino);
          }
          player.posicao = destino;
          positionPlayerAt(destino);
          addHistory(`❌ ${player.name} errou! Voltou para casa ${destino}`, "especial");
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

    if (elements.victoryMessage) {
      elements.victoryMessage.textContent = `${player.emoji} ${player.name} venceu o jogo!`;
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
    console.log("[JOGAR] ENTER: isMoving=" + gameState.isMoving + ", rollBtn.disabled=" + elements.rollBtn.disabled + ", mundoAtual=" + gameState.mundoAtual + ", player.pos=" + getCurrentPlayer().posicao);
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
    await animateDice(resultado);

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
      console.log("[JOGAR] target >= total, mundo=" + gameState.mundoAtual);
      if (gameState.mundoAtual === "floresta") {
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
        console.log("[JOGAR] floresta completion, unlockTurn called");
        return;
      }
      await handleVictory();
      gameState.isMoving = false;
      return;
    }

    console.log("[JOGAR] calling processSpecialCell(" + target + "), mundo=" + gameState.mundoAtual);
    const extraTurn = await processSpecialCell(target);
    console.log("[JOGAR] processSpecialCell returned extraTurn=" + extraTurn + ", isMoving=" + gameState.isMoving + ", rollBtn.disabled=" + elements.rollBtn.disabled + ", mundo=" + gameState.mundoAtual);

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
    if (gameState.mundoAtual !== "floresta") {
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
    gameState.mundoAtual = "principal";
    gameState.entradaFloresta = { 1: null, 2: null };
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
    elements.trackContainer.classList.remove("mundo-floresta");
    document.getElementById("world-indicator").classList.add("hidden");
  }

  function reiniciarJogo() {
    resetGameState();
    showMainMenu();
  }

  /* ── Main Menu ── */

  function showMainMenu() {
    document.getElementById("main-menu").classList.remove("hidden");
    document.getElementById("setup-screen").classList.add("hidden");
    document.getElementById("world-selector").classList.add("hidden");
    selectedWorldId = null;
    currentWorldConfig = null;
    modoJogo = null;
  }

  function hideMainMenu() {
    document.getElementById("main-menu").classList.add("hidden");
  }

  function setupMenuEvents() {
    document.getElementById("btn-rapido").addEventListener("click", () => {
      modoJogo = "rapido";
      hideMainMenu();
      showWorldSelector();
    });
  }

  /* ── World Selector ── */

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
      currentWorldConfig = getDefault();
      selectedWorldId = currentWorldConfig.id;
    } else {
      currentWorldConfig = get(worldId);
      selectedWorldId = worldId;
    }
    hideWorldSelector();
    showSetupScreen();
  }

  function setupWorldSelectorEvents() {
    document.querySelectorAll(".world-card:not(:disabled)").forEach(card => {
      card.addEventListener("click", function () {
        selectWorld(this.dataset.world);
      });
    });

    document.getElementById("world-back-btn").addEventListener("click", () => {
      hideWorldSelector();
      showMainMenu();
    });
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
    const p1Selected = document.querySelector("#p1-emoji-grid .emoji-btn.selected");
    players[0].emoji = p1Selected ? p1Selected.dataset.emoji : "🧒";

    if (isSinglePlayer) {
      players[1].name = "Máquina";
      players[1].emoji = "🤖";
      players[1].isBot = true;
    } else {
      players[1].name = document.getElementById("player2-name").value.trim() || "Jogador 2";
      const p2Selected = document.querySelector("#p2-emoji-grid .emoji-btn.selected");
      players[1].emoji = p2Selected ? p2Selected.dataset.emoji : "🧑";
      players[1].isBot = false;
    }

    elements.lara.textContent = players[0].emoji;
    elements.laraP2.textContent = players[1].emoji;

    botTurnScheduled = false;
    hideSetupScreen();
    gameState.questoesUsadas.clear();
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

    startBtn.addEventListener("click", prepareAndDraw);
    updateModeUI();
  }

  /* ── Sorteio Inicial (Draw) ── */

  function prepareAndDraw() {
    players[0].name = document.getElementById("player1-name").value.trim() || "Jogador 1";
    const p1Sel = document.querySelector("#p1-emoji-grid .emoji-btn.selected");
    players[0].emoji = p1Sel ? p1Sel.dataset.emoji : "🧒";
    players[0].isBot = false;

    if (isSinglePlayer) {
      players[1].name = "Máquina";
      players[1].emoji = "🤖";
      players[1].isBot = true;
    } else {
      players[1].name = document.getElementById("player2-name").value.trim() || "Jogador 2";
      const p2Sel = document.querySelector("#p2-emoji-grid .emoji-btn.selected");
      players[1].emoji = p2Sel ? p2Sel.dataset.emoji : "🧑";
      players[1].isBot = false;
    }

    elements.lara.textContent = players[0].emoji;
    elements.laraP2.textContent = players[1].emoji;

    botTurnScheduled = false;
    hideSetupScreen();
    startDrawSequence();
  }

  function showDrawScreen() {
    document.getElementById("draw-emoji-0").textContent = players[0].emoji;
    document.getElementById("draw-name-0").textContent = players[0].name;
    document.getElementById("draw-emoji-1").textContent = players[1].emoji;
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
        btn.disabled = true;
        btn.onclick = null;
        const value = Math.floor(Math.random() * 6) + 1;
        animateDrawDice(playerIndex, value).then(() => resolve(value));
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
        document.getElementById("draw-status").textContent = "🤝 Empate! Vamos rolar novamente!";
        document.getElementById("draw-dice-box-0").textContent = "🎲";
        document.getElementById("draw-dice-box-1").textContent = "🎲";
        document.getElementById("draw-value-0").textContent = "-";
        document.getElementById("draw-value-1").textContent = "-";
        document.getElementById("draw-player-0").classList.remove("winner");
        document.getElementById("draw-player-1").classList.remove("winner");
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
        `🏆 ${winner.emoji} ${winner.name} começa a aventura!`;
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

  function showPortalModal() {
    return new Promise((resolve) => {
      const overlay = document.getElementById("portal-overlay");
      const entrarBtn = document.getElementById("portal-entrar-btn");
      const continuarBtn = document.getElementById("portal-continuar-btn");

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
    if (player.isBot) {
      await delay(500);
      const entrou = Math.random() < 0.5;
      if (entrou) {
        addHistory(`🤖 ${player.name} decidiu entrar no portal!`, "especial");
      } else {
        addHistory(`🤖 ${player.name} decidiu continuar no tabuleiro.`, "info");
      }
      return entrou;
    }
    return showPortalModal();
  }

  /* ── Debug ── */

  function setupDebugMode() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("debug") !== "1") return;

    const panel = document.getElementById("debug-panel");
    if (!panel) return;
    panel.classList.remove("hidden");

    panel.addEventListener("click", async (e) => {
      const btn = e.target.closest(".debug-btn");
      if (!btn) return;

      switch (btn.dataset.debug) {
        case "casa11": {
          const p = getCurrentPlayer();
          p.posicao = 11;
          positionPlayerAt(11, p);
          addHistory(`[DEBUG] ${p.name} foi para casa 11`, "info");
          updateUI();
          break;
        }
        case "entrar-floresta": {
          const p = getCurrentPlayer();
          gameState.entradaFloresta[p.id] = p.posicao;
          gameState.mundoAtual = "floresta";
          p.posicao = 0;
          renderizarTrilha();
          renderSvgPath();
          elements.trackContainer.classList.add("mundo-floresta");
          document.getElementById("world-indicator").classList.remove("hidden");
          players.forEach(p2 => positionPlayerAt(p2.posicao, p2));
          gameState.isMoving = false;
          elements.rollBtn.disabled = false;
          updateUI();
          addHistory(`[DEBUG] ${p.name} entrou na Floresta`, "info");
          break;
        }
        case "casa5-floresta": {
          if (gameState.mundoAtual !== "floresta") return;
          const p = getCurrentPlayer();
          p.posicao = 5;
          await processSpecialCell(5);
          gameState.isMoving = false;
          elements.rollBtn.disabled = false;
          updateUI();
          addHistory(`[DEBUG] Casa 5 acionada via debug`, "info");
          break;
        }
        case "casa8-floresta": {
          if (gameState.mundoAtual !== "floresta") return;
          const p = getCurrentPlayer();
          p.posicao = 8;
          await processSpecialCell(8);
          gameState.isMoving = false;
          elements.rollBtn.disabled = false;
          updateUI();
          addHistory(`[DEBUG] Casa 8 acionada via debug`, "info");
          break;
        }
        case "voltar-principal": {
          gameState.mundoAtual = "principal";
          gameState.entradaFloresta[getCurrentPlayer().id] = null;
          gameState.entrouNoPortal = false;
          renderizarTrilha();
          renderSvgPath();
          elements.trackContainer.classList.remove("mundo-floresta");
          document.getElementById("world-indicator").classList.add("hidden");
          players.forEach(p2 => positionPlayerAt(p2.posicao, p2));
          gameState.isMoving = false;
          elements.rollBtn.disabled = false;
          updateUI();
          addHistory(`[DEBUG] Voltou ao mundo principal`, "info");
          break;
        }
      }
    });
  }

  /* ── Init ── */

  function init() {
    register(florestaEncantada);

    elements.rollBtn.addEventListener("click", jogarDado);
    elements.resetBtn.addEventListener("click", reiniciarJogo);
    if (elements.victoryPlayAgainBtn) {
      elements.victoryPlayAgainBtn.addEventListener("click", () => {
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
  }

  document.addEventListener("DOMContentLoaded", init);
})();
