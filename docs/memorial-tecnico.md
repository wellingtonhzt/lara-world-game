# Memorial Técnico

## [0.7.0] - 2026-07-05

### Objetivo

Adicionar modo Single Player (Humano vs Máquina) com bot automático que joga dado, responde desafios e decide entrar no portal. Implementar tela de vitória visual com confetes e overlay. Corrigir cascata da casa 5 na posição 1 e botão "Jogar Dado" após reinício.

### Arquivos Alterados

| Arquivo | Tipo de Alteração |
|---------|-------------------|
| `src/game.js` | Adicionado: `players[].isBot`, `isSinglePlayer`, `botTurnScheduled`, `resolveChallenge()`, `resolvePortal()`, `scheduleBotTurnIfNeeded()`, seletor de modo em `setupModalEvents()`, `handleVictory()`. Modificado: `startGame()` (configura P2 como bot), `switchTurn()` (proteção 1P), `unlockTurn()` (agenda bot), `jogarDado()` (suporte a bot) |
| `src/index.html` | Adicionado: seletor de modo (`.mode-selector` com radio buttons 1P/2P), overlay de vitória (`#victory-overlay`) com confetes, serpentina, troféu e botão "Jogar Novamente" |
| `src/style.css` | Adicionado: `.mode-selector`, `.mode-option`, `.mode-option.selected`, `#setup-screen.mode-1p .player2-card`, estilos do overlay de vitória (confetes, serpentina, conteúdo) |

### Impacto Técnico

- **game.js**: `players[]` ganhou campo `isBot: false` padrão. Nova variável `isSinglePlayer` (boolean) controla modo de jogo. `botTurnScheduled` impede agendamento duplicado do turno do bot. `startGame()` — em modo 1P, P2 recebe name="Máquina", emoji="🤖", isBot=true; P2 card fica oculto. `resolveChallenge(desafio)` — se `player.isBot`, delay(600ms) + `Math.random() < 0.6` para acerto; senão, chama `showChallengeModal()`. `resolvePortal()` — se `player.isBot`, delay(500ms) + `Math.random() < 0.5` para entrar; senão, chama `showPortalModal()`. `scheduleBotTurnIfNeeded()` — verifica se jogador atual é bot e jogo ativo, agenda `setTimeout(jogarDado, 1000)`. `unlockTurn()` agora chama `scheduleBotTurnIfNeeded()` ao final. `switchTurn()` ganhou guarda `if (PLAYER_COUNT < 2) return` para modo 1P. `handleVictory()` — nova função que define `jogoFinalizado = true`, desabilita dado, exibe `#victory-overlay` com confetes e botão "Jogar Novamente".
- **HTML**: Seletor de modo adicionado ao `#setup-screen` com dois `<label class="mode-option">` contendo radio buttons. Overlay `#victory-overlay` com 15 `.confetti-piece` (cores variadas, posições aleatórias, animações com delay), 2 `.serpentine` (fogos), título "🏆 Vitória!", mensagem `#victory-message`, botão "🔄 Jogar Novamente".
- **CSS**: `.mode-selector` (flex, gap 12px, centralizado), `.mode-option` (flex 1, padding, border-radius, transição), `.mode-option.selected` (borda rosa, fundo rosa claro). `#setup-screen.mode-1p .player2-card` com `display: none`. Overlay de vitória: `.victory-overlay` (fixed, inset 0, z-index 2000, flex centralizado, background rgba), `.confetti-piece` (position absolute, top -10px, animação `confetti-fall` com duração e delay variados), `.serpentine` (position absolute, animação `firework`), `.victory-content` (background branco, border-radius, padding, z-index 10).

### Impacto Funcional

- Novo seletor de modo no modal de configuração permite escolher entre 2 Jogadores e 1 Jogador
- Modo 1 Jogador: jogador humano vs máquina com turnos alternados automaticamente
- Bot joga sozinho após 1 segundo de espera, incluindo dado, movimento e casas especiais
- Bot responde desafios educativos com 60% de chance de acerto (sem exibir modal)
- Bot decide entrar no Portal da Floresta com 50% de chance (sem exibir modal)
- Ao vencer, overlay de vitória com confetes animados e fogos serpentina é exibido
- Botão "Jogar Novamente" no overlay retorna ao modal de configuração
- Casa 5 na posição 1 não abre mais modal de desafio indevidamente
- Botão "Jogar Dado" funciona corretamente após reinício
- Todas as funcionalidades anteriores (multiplayer 2P, floresta, desafios, banco de questões) permanecem inalteradas no modo 2 jogadores

## [0.6.0] - 2026-07-03

### Objetivo

Implementar um sistema de mundos alternativos com portal de entrada, começando pelo Mundo da Floresta — uma mini-trilha de 8 casas acessada pela casa 11, com mecânicas exclusivas, visuais temáticos e proteção de turno durante a sessão na floresta. Incluir modo debug para facilitar testes.

### Arquivos Alterados

| Arquivo | Tipo de Alteração |
|---------|-------------------|
| `src/game.js` | Adicionado: constantes da floresta (`FLORESTA_TOTAL`, `florestaPosicoes`, `florestaIcones`, `florestaEspeciais`), getters world-aware, `gameState.mundoAtual`, `gameState.entradaFloresta`, `gameState.entrouNoPortal`, case "portal" e "saida-mundo" em processSpecialCell, modo debug. Modificado: `renderizarTrilha`, `renderSvgPath`, `positionPlayerAt`, `animatePlayerMovement`, `jogarDado`, `switchTurn`, `reiniciarJogo` |
| `src/index.html` | Adicionado: `#portal-overlay` (modal de entrada), `#world-indicator` (indicador de mundo), decorações da floresta, `#debug-panel` |
| `src/style.css` | Adicionado: `.mundo-floresta` (fundo verde escuro), estilos de casas da floresta, portal overlay, world indicator, decorações temáticas, debug panel |
| `README.md` | Atualizado: v0.6.0 como versão ativa, funcionalidades, história, roadmap |
| `CHANGELOG.md` | Adicionado: entrada v0.6.0 |
| `docs/visao-geral.md` | Atualizado: v0.6.0 como versão atual |
| `docs/arquitetura.md` | Atualizado: constantes, index.html, game.js, turnos, estado |
| `docs/regras-do-jogo.md` | Atualizado: portal, floresta, casas especiais |
| `docs/roadmap.md` | Atualizado: v0.6.0 movido para concluído |
| `docs/memorial-tecnico.md` | Adicionado: entrada v0.6.0 |

### Impacto Técnico

- **game.js**: Adicionadas constantes `FLORESTA_TOTAL = 8`, `florestaPosicoes` (coordenadas em formato de S), `florestaIcones` (🌲🌿🍄🐾🦉🍂🌳🚪), `florestaEspeciais` (casa 3 desafio, casa 5 atalho, casa 7 desafio, casa 8 saída-mundo). Criados getters dinâmicos `getTotalCasas()`, `getPosicoes()`, `getIcones()`, `getCasasEspeciais()` que retornam valores do mundo atual. `gameState.mundoAtual` alterna entre `"principal"` e `"floresta"`. `gameState.entradaFloresta = {1: null, 2: null}` salva posição de entrada por jogador. `gameState.entrouNoPortal` evita reentrada no portal na mesma jogada. `processSpecialCell` ganhou case "portal" que exibe modal com opções Entrar/Continuar e case "saida-mundo" que retorna ao mundo principal com bônus (+3 na casa 8, +2 na casa 5 via "atalho"). `jogarDado()` adaptado para suportar floresta: ao completar a floresta, volta ao principal com bônus sem cascatear.
- **Renderização**: `renderizarTrilha()` aceita parâmetro `mundo` para renderizar tabuleiro correto. `renderSvgPath()` aceita `posicoes` opcional para gerar caminho SVG. `positionPlayerAt()` oculta sprite do outro jogador quando `mundoAtual === "floresta"`. `animatePlayerMovement()` usa `getPosicoes()` para obter coordenadas do mundo atual.
- **Turno**: `switchTurn()` agora verifica `if (mundoAtual !== "floresta")` antes de alternar, garantindo que o mesmo jogador complete a floresta sem interrupção.
- **Debug**: Novo bloco opcional ativado por `?debug=1` na URL. Cinco botões: "Casa 11 (Portal)", "Entrar na Floresta", "Casa 5 (Atalho)", "Casa 8 (Saída)", "Voltar ao Principal". Renderiza painel `#debug-panel` no canto inferior esquerdo com `z-index: 999`.
- **Correções**: `renderizarSvgPath` → `renderSvgPath` em portal e saída-mundo. `entradaFloresta` movido para fora do bloco `if (extraTurn)` — estava sendo resetado indevidamente em jogadas normais.

### Impacto Funcional

- Casa 11 agora abre modal "Portal da Floresta" com opção de entrar (vai para floresta, salva posição) ou continuar (ignora)
- Mundo da Floresta com trilha própria de 8 casas em formato de S, fundo verde escuro, decorações temáticas
- Ao entrar na floresta: jogador ativo continua jogando sem alternância de turno
- Outro jogador não aparece no tabuleiro da floresta (sprite oculto)
- Casa 3 da floresta: desafio educativo (pergunta do banco)
- Casa 5 da floresta: atalho de saída — volta ao mundo principal com +2 casas de bônus
- Casa 7 da floresta: desafio educativo (pergunta do banco)
- Casa 8 da floresta: saída — volta ao mundo principal com +3 casas de bônus
- Bônus de saída não cascateia para outras casas especiais
- Modo debug facilita teste de todos os cenários da floresta
- Todas as regras anteriores (desafios, banco de questões, multiplayer) permanecem inalteradas quando no mundo principal

## [0.5.0] - 2026-07-03

### Objetivo

Evoluir o sistema de desafios educativos de perguntas fixas por casa para um Banco de Questões organizado por categorias, com sorteio aleatório e proteção contra repetição na mesma partida.

### Arquivos Alterados

| Arquivo | Tipo de Alteração |
|---------|-------------------|
| `src/game.js` | Substituído: `desafios[]` por `bancoQuestoes{}`. Adicionado: `questoesDisponiveis[]`, `sortearQuestao()`, `gameState.questoesUsadas`. Modificado: processSpecialCell case "desafio", reiniciarJogo, startGame |
| `README.md` | Atualizado: v0.5.0 como versão ativa, funcionalidades com banco de questões, histórico, roadmap |
| `CHANGELOG.md` | Adicionado: entrada v0.5.0 |
| `docs/visao-geral.md` | Atualizado: funcionalidades da v0.5.0 |
| `docs/arquitetura.md` | Atualizado: constantes com bancoQuestoes/questoesDisponiveis, gameState com questoesUsadas, seção de sorteio |
| `docs/regras-do-jogo.md` | Atualizado: descrição das casas de desafio com sorteio, regra de não repetição |
| `docs/roadmap.md` | Atualizado: v0.5.0 movido para concluído, v0.6.0 como Mundos e Portais Secretos |
| `docs/memorial-tecnico.md` | Adicionado: entrada v0.5.0 |

### Impacto Técnico

- **game.js**: `desafios[]` (array flat de 5 perguntas) substituído por `bancoQuestoes{}` com 6 categorias e 30 perguntas. `questoesDisponiveis[]` gerado via `Object.values(bancoQuestoes).flat()`. Nova função `sortearQuestao()` que: (1) verifica se todas as perguntas foram usadas (`gameState.questoesUsadas.size >= total`), (2) limpa o Set se necessário, (3) sorteia índice aleatório não usado, (4) marca como usado e retorna a pergunta. `processSpecialCell` case "desafio" agora chama `sortearQuestao()` em vez de indexar `desafios[info.valor]`. Campos `valor` removidos das entradas de desafio em `casasEspeciais` (4, 7, 12, 16, 18) por não serem mais necessários.
- **Reset**: `reiniciarJogo()` e `startGame()` chamam `gameState.questoesUsadas.clear()` para garantir banco fresco a cada partida.
- **Correção de bug**: adicionado `elements.rollBtn.disabled = false` em `reiniciarJogo()` — o botão "Jogar Dado" ficava desabilitado após vencer e reiniciar porque `handleVictory()` o desabilita mas o reset não o reabilitava.

### Impacto Funcional

- Desafios agora exibem perguntas sorteadas de 6 categorias temáticas
- Nenhuma pergunta se repete dentro da mesma partida
- Partidas longas podem esgotar as 30 perguntas — o banco reinicia automaticamente
- Botão "Jogar Dado" funciona corretamente após reinício (bug corrigido)
- Todas as regras anteriores de desafio (acerto/erro, movimento, não cascata) permanecem inalteradas
- Nenhuma alteração em HTML, CSS, Docker, modal inicial ou sistema de turnos

## [0.4.0] - 2026-07-03

### Objetivo

Adicionar 5 casas de desafio educativo com perguntas de múltipla escolha, integradas ao fluxo de jogo existente sem alterar regras especiais prévias, modal inicial, Docker ou sistema de jogadores.

### Arquivos Alterados

| Arquivo | Tipo de Alteração |
|---------|-------------------|
| `src/game.js` | Adicionado: array `desafios[]`, 5 entradas em `casasEspeciais` (4,7,12,16,18), case "desafio" em processSpecialCell, função showChallengeModal |
| `src/index.html` | Adicionado: estrutura do modal `#challenge-overlay` com pergunta e opções |
| `src/style.css` | Adicionado: estilos do modal de desafio, cores das 5 casas de desafio (roxo) |
| `README.md` | Atualizado: v0.4.0 como versão ativa, funcionalidades com desafios, tabela de casas expandida, histórico |
| `CHANGELOG.md` | Adicionado: entrada v0.4.0 |
| `docs/visao-geral.md` | Atualizado: funcionalidades da v0.4.0 |
| `docs/arquitetura.md` | Atualizado: estrutura do index.html com challenge modal, cores CSS, organização do código, fluxo do jogo |
| `docs/regras-do-jogo.md` | Atualizado: tabela de casas especiais com desafios, regra de não-cascata |
| `docs/roadmap.md` | Atualizado: v0.4.0 movido para concluído |
| `docs/memorial-tecnico.md` | Adicionado: entrada v0.4.0 |

### Impacto Técnico

- **game.js**: Adicionado array `desafios[]` com 5 objetos `{pergunta, opcoes[], resposta}`. `casasEspeciais` expandido de 6 para 11 entradas — 5 novas com tipo "desafio" e `valor` indexando o array. `processSpecialCell()` ganhou case "desafio" que: (1) registra no histórico, (2) chama `showChallengeModal()` via Promise, (3) move o jogador ±1 casa, (4) retorna `false` sem cascatear. `showChallengeModal(desafio)` cria botões dinâmicos com `String.fromCharCode(65 + index)` para rótulos A/B/C, resolve a Promise com `opcao === desafio.resposta` e esconde o overlay.
- **HTML**: Modal `#challenge-overlay` adicionado entre o setup screen e o game-layout, com `#challenge-question` (parágrafo) e `#challenge-options` (container dos botões).
- **CSS**: `.challenge-overlay` com `z-index: 500`, `.challenge-content` centralizado, `.challenge-btn` com hover roxo. Casas 4, 7, 12, 16, 18 estilizadas com fundo `#f3e5f5`, borda `#7b1fa2` e sombra `#4a148c`.
- **Prevenção de loop**: O movimento pós-desafio (`+1` ou `-1`) atualiza `player.posicao` e `positionPlayerAt()` sem chamar `processSpecialCell()` novamente, eliminando qualquer risco de cascata cíclica.

### Impacto Funcional

- 5 novas casas especiais com mecânica de perguntas e respostas
- Jogador que acerta avança 1 casa; que erra volta 1 casa
- Dado fica bloqueado enquanto o modal de desafio estiver aberto
- Histórico registra a entrada no desafio, o acerto ou o erro
- Nenhuma regra anterior foi alterada — casas 3, 5, 8, 10, 15, 20 funcionam exatamente como antes
- Modal inicial, Docker, sistema de jogadores — inalterados

## [0.3.0] - 2026-07-03

### Objetivo

Implementar um modal de configuração inicial que permita aos jogadores definir seus nomes e escolher sprites (emojis) antes do início da partida, além de alterar o fluxo de reinício para retornar ao modal.

### Arquivos Alterados

| Arquivo | Tipo de Alteração |
|---------|-------------------|
| `src/game.js` | Adicionado: showSetupScreen, hideSetupScreen, startGame, setupModalEvents. Alterado: init, reiniciarJogo |
| `src/index.html` | Adicionado: estrutura do modal com inputs de nome e grades de emoji para P1 e P2 |
| `src/style.css` | Adicionado: estilos do modal overlay, player cards, emoji grid e estados de seleção |
| `README.md` | Atualizado: v0.3.0 como versão ativa, funcionalidades, modo de jogar com modal, roadmap |
| `CHANGELOG.md` | Adicionado: entrada v0.3.0 |
| `docs/visao-geral.md` | Atualizado: funcionalidades da v0.3.0 |
| `docs/arquitetura.md` | Atualizado: estrutura do index.html, seção CSS do modal, funções de setup, fluxo do jogo |
| `docs/regras-do-jogo.md` | Atualizado: regras multiplayer com modal, regra de reinício |
| `docs/roadmap.md` | Atualizado: v0.3.0 movido para concluído |
| `docs/memorial-tecnico.md` | Adicionado: entrada v0.3.0 |

### Impacto Técnico

- **game.js**: `init()` agora chama `showSetupScreen()` em vez de `renderizarTrilha()` diretamente. Criada função `setupModalEvents()` que registra eventos de clique nas grades de emoji (`#p1-emoji-grid` e `#p2-emoji-grid`) e no botão "Iniciar Jogo". `startGame()` lê os valores dos inputs, define `players[].name` e `players[].emoji`, esconde o modal e chama `renderizarTrilha()`. `reiniciarJogo()` agora chama `showSetupScreen()` em vez de renderizar diretamente.
- **HTML**: Modal adicionado ao body com `#setup-overlay` contendo dois `.player-card` com inputs (`#p1-name`, `#p2-name`) e grades de emoji (`#p1-emoji-grid`, `#p2-emoji-grid`). Cada grade contém 10 opções de emoji.
- **CSS**: Modal usa `position: fixed` com overlay semi-transparente. Player cards com `flex: 1` ocupam metade da largura cada. Emoji grid com `display: flex; flex-wrap: wrap`. Emoji selecionado ganha borda azul com `box-shadow`.
- **jQuery**: Biblioteca carregada via CDN no HTML para facilitar manipulação do DOM no modal, sem alterar o restante do código que permanece em JavaScript Vanilla.

### Impacto Funcional

- Jogo agora começa com modal de configuração em vez de tabuleiro pronto
- Jogadores podem personalizar nomes e sprites antes de cada partida
- Sprites dos dois jogadores são independentes (cada grade tem seu próprio estado)
- Reinício retorna ao modal, permitindo reconfiguração
- Fallback para nomes "Jogador 1" / "Jogador 2" e emojis 🧒 / 👦 se o jogador não interagir

### Objetivo

Evoluir o Lara World de um jogo single player para suporte a multiplayer local com 2 jogadores, alternância de turnos e documentação completa do projeto.

### Arquivos Alterados

| Arquivo | Tipo de Alteração |
|---------|-------------------|
| `src/game.js` | Refatoração: estrutura de players, controle de turnos, offset em mesma casa |
| `src/style.css` | Adicionado: #lara-p2, .turn-indicator, .pos-p1/.pos-p2, animação para P2 |
| `src/index.html` | Adicionado: #lara-p2 visível, painel com turno e posições individuais |
| `README.md` | Reescrito: status, funcionalidades, multiplayer, tecnologias, roadmap |
| `CHANGELOG.md` | Criado: registro v0.1.0 e v0.2.0 |
| `docs/visao-geral.md` | Reescrito: conceito multiplayer, funcionalidades detalhadas |
| `docs/arquitetura.md` | Reescrito: organização do código, movimento, turnos, estado |
| `docs/regras-do-jogo.md` | Reescrito: regras 1 e 2 jogadores, tabela de casas |
| `docs/roadmap.md` | Reescrito: versões concluídas e futuro |
| `docs/AI_WORKFLOW.md` | Criado: processo de desenvolvimento assistido |

### Impacto Técnico

- **game.js**: `PLAYER_COUNT` passou de 1 para 2. `posicao` e `rodadasPerdidas` movidos de `gameState` para objetos individuais de cada `player`. Adicionadas funções `getCurrentPlayer()`, `getPlayerElement()`, `switchTurn()`, `updateUI()`. `positionPlayerAt()` agora aceita parâmetro opcional `player` e aplica offset (±12x, ±8y) quando dois jogadores estão na mesma casa. `jogarDado()` agora chama `switchTurn()` e `updateUI()` ao final de cada turno.
- **HTML/CSS**: Segundo personagem `#lara-p2` adicionado. Painel de status exibe indicador de turno e posições individuais.

### Impacto Funcional

- Jogo agora suporta 2 jogadores no mesmo dispositivo
- Turnos alternam automaticamente após cada jogada
- Exceção: casa 8 (jogue novamente) mantém o mesmo jogador
- Cada jogador tem posição e contador de rodadas perdidas próprios
- Personagens sobrepostos recebem offset visual para não se ocultarem
- Primeiro jogador a atingir a casa 20 vence e encerra a partida
- Reinício reseta ambos os jogadores simultaneamente
