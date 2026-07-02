(function () {
  const TOTAL_CASAS = 20;

  const casasEspeciais = {
    3: { tipo: "avancar", valor: 2, descricao: "Avance 2 casas!" },
    5: { tipo: "voltar", valor: 1, descricao: "Volte 1 casa!" },
    8: { tipo: "jogar-novamente", valor: 0, descricao: "Jogue novamente!" },
    10: { tipo: "perde-rodada", valor: 0, descricao: "Perdeu uma rodada!" },
    15: { tipo: "voltar-inicio", valor: 0, descricao: "Volte para o início!" },
    20: { tipo: "vitoria", valor: 0, descricao: "Vitória! 🎉" },
  };

  const icons = [
    "🌟", "🌸", "🌈", "⭐", "🦋",
    "🍀", "🎈", "🐱", "🍭", "🎀",
    "🌻", "🐰", "🍬", "🦄", "🎪",
    "🐼", "🍉", "🐶", "🎠", "👑",
  ];

  let state = {
    posicao: 0,
    rodadasPerdidas: 0,
    jogoAtivo: true,
    jogoFinalizado: false,
    aguardandoJogada: false,
  };

  const elements = {
    track: document.getElementById("track"),
    diceDisplay: document.getElementById("dice-display"),
    diceValue: document.getElementById("dice-value"),
    currentPosition: document.getElementById("current-position"),
    messages: document.getElementById("messages"),
    rollBtn: document.getElementById("roll-btn"),
    resetBtn: document.getElementById("reset-btn"),
  };

  function init() {
    renderizarTrilha();
    atualizarPosicaoLara();
    elements.rollBtn.addEventListener("click", jogarDado);
    elements.resetBtn.addEventListener("click", reiniciarJogo);
  }

  function renderizarTrilha() {
    elements.track.innerHTML = "";
    for (let i = 1; i <= TOTAL_CASAS; i++) {
      const casa = document.createElement("div");
      casa.className = "casa";
      casa.dataset.casa = i;
      casa.id = `casa-${i}`;

      if (casasEspeciais[i]) {
        casa.classList.add(
          i === 20 ? "casa-vitoria" : "casa-especial"
        );
      }

      const icone = document.createElement("span");
      icone.className = "casa-icone";
      icone.textContent = icons[i - 1] || "⬜";

      const info = document.createElement("div");
      info.className = "cara-metade";

      const numero = document.createElement("span");
      numero.className = "casa-numero";
      numero.textContent = i;

      const tipo = document.createElement("span");
      tipo.className = "casa-tipo";

      if (casasEspeciais[i]) {
        tipo.textContent = casasEspeciais[i].descricao;
      }

      info.appendChild(numero);
      info.appendChild(tipo);
      casa.appendChild(icone);
      casa.appendChild(info);
      elements.track.appendChild(casa);
    }
  }

  function atualizarPosicaoLara() {
    document.querySelectorAll(".casa-lara").forEach((el) => {
      el.classList.remove("casa-lara");
    });

    const posAtual = state.posicao;
    if (posAtual >= 1 && posAtual <= TOTAL_CASAS) {
      const casaEl = document.getElementById(`casa-${posAtual}`);
      if (casaEl) {
        casaEl.classList.add("casa-lara");
        casaEl.querySelector(".casa-icone").textContent = "🧒";
      }
    }

    elements.currentPosition.textContent = posAtual;

    for (let i = 1; i <= TOTAL_CASAS; i++) {
      const casaEl = document.getElementById(`casa-${i}`);
      if (casaEl && i !== posAtual) {
        casaEl.querySelector(".casa-icone").textContent = icons[i - 1] || "⬜";
      }
    }
  }

  function adicionarMensagem(texto, tipo) {
    const p = document.createElement("p");
    p.className = `msg ${tipo ? "msg-" + tipo : ""}`;
    p.textContent = texto;
    elements.messages.appendChild(p);
    elements.messages.scrollTop = elements.messages.scrollHeight;
  }

  function limparMensagens() {
    elements.messages.innerHTML = "";
  }

  function jogarDado() {
    if (!state.jogoAtivo || state.jogoFinalizado) return;

    if (state.aguardandoJogada) return;
    state.aguardandoJogada = true;
    elements.rollBtn.disabled = true;

    if (state.rodadasPerdidas > 0) {
      state.rodadasPerdidas--;
      adicionarMensagem(
        `😴 Lara perdeu esta rodada! (${state.rodadasPerdidas} restante(s))`,
        "evento"
      );
      state.aguardandoJogada = false;
      elements.rollBtn.disabled = false;
      return;
    }

    const resultado = Math.floor(Math.random() * 6) + 1;
    animarDado(resultado, () => {
      state.posicao += resultado;
      if (state.posicao > TOTAL_CASAS) {
        state.posicao = TOTAL_CASAS;
      }

      adicionarMensagem(
        `🎲 Lara tirou ${resultado} e foi para a casa ${state.posicao}.`,
        "destaque"
      );

      processarCasaAtual();
    });
  }

  function animarDado(valor, callback) {
    const intervalos = [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6];
    let idx = 0;

    elements.diceDisplay.classList.add("animar-dado");

    const intervalo = setInterval(() => {
      elements.diceDisplay.textContent = getDadoEmoji(intervalos[idx]);
      idx++;
      if (idx >= intervalos.length) {
        clearInterval(intervalo);
        elements.diceDisplay.textContent = getDadoEmoji(valor);
        elements.diceValue.textContent = valor;
        elements.diceDisplay.classList.remove("animar-dado");

        const casaEl = document.getElementById(`casa-${state.posicao}`);
        if (casaEl) {
          casaEl.classList.add("animar-lara");
          setTimeout(() => casaEl.classList.remove("animar-lara"), 500);
        }

        setTimeout(callback, 300);
      }
    }, 80);
  }

  function getDadoEmoji(valor) {
    const dados = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
    return dados[valor - 1] || "🎲";
  }

  function processarCasaAtual() {
    const casa = casasEspeciais[state.posicao];
    if (!casa) {
      finalizarTurno();
      return;
    }

    switch (casa.tipo) {
      case "avancar": {
        const destino = Math.min(state.posicao + casa.valor, TOTAL_CASAS);
        adicionarMensagem(
          `⭐ Casa especial! ${casa.descricao} Lara vai para ${destino}.`,
          "evento"
        );
        state.posicao = destino;
        if (destino === TOTAL_CASAS) {
          verificarVitoria();
        } else {
          processarCasaAtual();
        }
        break;
      }
      case "voltar": {
        state.posicao = Math.max(state.posicao - casa.valor, 0);
        adicionarMensagem(
          `🐢 Casa especial! ${casa.descricao} Lara foi para ${state.posicao}.`,
          "evento"
        );
        finalizarTurno();
        break;
      }
      case "jogar-novamente": {
        adicionarMensagem(
          `🎯 Casa especial! ${casa.descricao}`,
          "evento"
        );
        state.aguardandoJogada = false;
        elements.rollBtn.disabled = false;
        atualizarPosicaoLara();
        return;
      }
      case "perde-rodada": {
        state.rodadasPerdidas += 1;
        adicionarMensagem(
          `😴 Casa especial! ${casa.descricao}`,
          "evento"
        );
        finalizarTurno();
        break;
      }
      case "voltar-inicio": {
        state.posicao = 0;
        adicionarMensagem(
          `🔙 Casa especial! ${casa.descricao}`,
          "evento"
        );
        finalizarTurno();
        break;
      }
      case "vitoria": {
        verificarVitoria();
        break;
      }
      default:
        finalizarTurno();
    }
  }

  function verificarVitoria() {
    if (state.posicao >= TOTAL_CASAS) {
      state.posicao = TOTAL_CASAS;
      state.jogoFinalizado = true;
      state.jogoAtivo = false;
      state.aguardandoJogada = false;
      elements.rollBtn.disabled = true;

      adicionarMensagem(
        "🎉🎉🎉 PARABÉNS! Lara completou a jornada! 🎉🎉🎉",
        "sucesso"
      );

      for (let i = 1; i <= TOTAL_CASAS; i++) {
        const el = document.getElementById(`casa-${i}`);
        if (el) el.classList.remove("casa-lara");
      }

      const casaFinal = document.getElementById(`casa-${TOTAL_CASAS}`);
      if (casaFinal) {
        casaFinal.classList.add("casa-lara");
        casaFinal.querySelector(".casa-icone").textContent = "🧒";
      }

      elements.currentPosition.textContent = TOTAL_CASAS;
    }
  }

  function finalizarTurno() {
    atualizarPosicaoLara();
    state.aguardandoJogada = false;
    elements.rollBtn.disabled = false;
  }

  function reiniciarJogo() {
    state.posicao = 0;
    state.rodadasPerdidas = 0;
    state.jogoAtivo = true;
    state.jogoFinalizado = false;
    state.aguardandoJogada = false;

    elements.rollBtn.disabled = false;
    elements.diceDisplay.textContent = "🎲";
    elements.diceValue.textContent = "-";

    document.querySelectorAll(".casa-lara").forEach((el) => {
      el.classList.remove("casa-lara");
    });
    for (let i = 1; i <= TOTAL_CASAS; i++) {
      const el = document.getElementById(`casa-${i}`);
      if (el) {
        el.querySelector(".casa-icone").textContent = icons[i - 1] || "⬜";
      }
    }

    elements.currentPosition.textContent = "0";

    limparMensagens();
    adicionarMensagem("🔄 Jogo reiniciado! Clique em 'Jogar Dado' para começar.");
  }

  document.addEventListener("DOMContentLoaded", init);
})();
