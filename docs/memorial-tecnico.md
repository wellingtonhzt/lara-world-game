# Memorial Técnico

## [0.9.0-preview] - 2026-07-06

### Objetivo

Iniciar a Fase de Mundos do Lara World: criar um motor modular (SessionManager, StateManager, WorldRegistry, EventProcessor) que coexista com o monólito original, adicionar um seletor de mundos na interface entre o menu e o setup, e implementar o primeiro WorldConfig (Floresta Encantada + Floresta Misteriosa). Nenhuma funcionalidade existente foi alterada.

### Arquivos Alterados

| Arquivo | Tipo de Alteração |
|---------|-------------------|
| `src/game.js` | Adicionado: fluxo do seletor de mundos (+35 linhas), variável `selectedWorldId`. Modificado: `showSetupScreen()` agora recebe parâmetro do mundo selecionado |
| `src/index.html` | Adicionado: seletor de mundos com 6 cards (`.world-card`), grid `.world-selector-grid`, overlay `.world-selector-overlay` |
| `src/style.css` | Adicionado: estilos do seletor de mundos (overlay, grid, cards, hover, badge "Em breve", badge "Aleatório") |
| `src/engine/event-processor.js` | **Criado** — 381 linhas, 8 tipos de evento built-in, registro de handlers customizados, cascade com proteção de loop, JSDoc typedefs (EventContext, EventResult, EventHandler) |
| `src/engine/session-manager.js` | **Criado** — 133 linhas, 5 métodos (create, validate, getCurrentWorld, getDrawState, isMultiWorld), validação de sessão, deepFreeze |
| `src/engine/state-manager.js` | **Criado** — 227 linhas, 17 métodos, deepClone em leituras, avanço mecânico de turno, gerenciamento de worldStack, playerState |
| `src/engine/world-registry.js` | **Criado** — 12 métodos, 4 classes de erro (WorldNotFoundError, WorldAlreadyRegisteredError, InvalidWorldConfigError, WorldNotReadyError), validação de contrato, deepFreeze |
| `src/worlds/floresta/config.js` | **Criado** — 402 linhas, exporta `florestaEncantada` (20 células, 12 eventos, 1 portal, 6 categorias) e `florestaMisteriosa` (8 células, 4 eventos, 2 categorias) |
| `src/core/constants.js` | **Criado** — Constantes do motor (event types, error codes, default values) |
| `src/core/utils.js` | **Criado** — Funções utilitárias (deepFreeze, deepClone, validateConfig, isValidId) |
| `src/core/types.js` | **Criado** — Tipos JSDoc para contratos do motor (WorldConfig, PortalConfig, EventConfig, GameSession, GameState) |
| `src/data/world-manifest.js` | **Criado** — Array WORLD_IDS com todos os IDs de mundos (todos comentados exceto floresta) |
| `src/worlds/loader.js` | **Criado** — Imports estáticos dos WorldConfigs, função `loadWorldConfig()` por ID |
| `docs/arquitetura-motor-de-mundos.md` | Atualizado: seção "Arquivos Alterados" com arquivos criados, plano de migração ajustado para execução real |
| `docs/visao-geral.md` | Atualizado: v0.9.0-preview como versão atual, funcionalidades do seletor de mundos |
| `docs/arquitetura.md` | Atualizado: diretórios (core/, engine/, worlds/), motor de mundos, seletor de mundos |
| `docs/roadmap.md` | Atualizado: v0.9.0-preview movido para concluído |
| `README.md` | Atualizado: v0.9.0-preview como versão ativa, funcionalidades, história, roadmap |
| `CHANGELOG.md` | Adicionado: entrada v0.9.0-preview |
| `docs/memorial-tecnico.md` | Adicionado: entrada v0.9.0-preview |

### Impacto Técnico

- **game.js**: Novo fluxo `showWorldSelector()` inserido entre o clique em "Jogo Rápido" e `showSetupScreen()`. Seletor exibe 6 `.world-card` em grid 3×2. `selectedWorldId` (string | null) armazena a escolha. Ao selecionar Floresta ou Aleatório, o seletor é ocultado e `showSetupScreen()` é chamado. Cards bloqueados ("Em breve") exibem badge e ignoram clique. Cache-busting atualizado para `?v=0.9.0-preview`.
- **HTML**: Novo `#world-selector-overlay` com container `.world-selector-content`, título, grid `.world-selector-grid`, botão "Voltar". Seis `.world-card` com `.world-card-icon`, `.world-card-name`, `.world-card-desc`, `.world-card-badge`.
- **CSS**: `.world-selector-overlay` (fixed, inset 0, z-index 1100, flex centralizado, fundo escuro). `.world-selector-grid` (display grid, 3 columns, gap 20px, max-width 800px). `.world-card` (background rgba branco, border-radius 16px, padding, cursor pointer, transição hover com escala e borda rosa). `.world-card.disabled` (opacity 0.5, cursor not-allowed). `.world-card-badge` (position absolute, top right, padding, border-radius, "🔒 Em breve" ou "🎲 Aleatório").
- **Engine**: Todos os módulos do motor são independentes e não conectados ao game.js. WorldRegistry oferece `register()`, `get()`, `getAll()`, `isRegistered()`, `validate()`, `getReady()`, `getByType()`, `listIds()`, `size()`, `has()`, `remove()`, `clear()` — todos com validação de tipos e deepFreeze. SessionManager gerencia sessão com `create()` (valida worldId, gera seed, inicializa drawState), `validate()`, `getCurrentWorld()`, `getDrawState()`, `isMultiWorld()`. StateManager oferece 17 métodos para gerenciar estado do jogo: `create()`, `getState()`, `getPlayer()`, `getCurrentPlayer()`, `setPlayerPosition()`, `switchTurn()`, `getWorldStack()`, `pushWorld()`, `popWorld()`, etc. EventProcessor implementa 8 tipos built-in (`move`, `challenge`, `skipTurn`, `extraTurn`, `portal`, `resetPosition`, `finishWorld`, `item`) com cascade automático e proteção de loop (max 100 iterações).
- **EventProcessor (revisões)**: Ordem de resolução alterada de built-in→world→global para world→built-in→global. `processCell` renomeado para `processEventsAtCell`. `addItem` e `setEntryPosition` substituídos por callbacks `onCollectItem`/`onPortalEntryPosition` para evitar dependência de StateManager. Operador `||` substituído por `??` para defaults falsy-safe. Cascade movido para após TODOS os eventos de uma célula, não entre cada evento.
- **WorldConfig Floresta**: 402 linhas com dados extraídos 1:1 do game.js. 20 cells no mundo principal com 12 eventos espalhados, incluindo portal (casa 11 → Floresta Misteriosa). 8 cells no submundo com 4 eventos (2 desafios, 1 atalho, 1 saída-mundo). Temas, regras, cores, ícones, posições SVG — todos migrados. Não consumido por nada — puramente declarativo.

### Impacto Funcional

- Novo seletor de mundos aparece após clicar em "⚡ Jogo Rápido", antes do setup
- Floresta Encantada é o único mundo jogável; 4 mundos aparecem como "Em breve"
- "Mundo Aleatório" seleciona Floresta automaticamente (preparado para futura expansão)
- Engine modular existe em paralelo — nenhuma funcionalidade existente foi alterada
- game.js, index.html, style.css continuam sendo o jogo executado
- Cache-busting atualizado para `?v=0.9.0-preview` garante carregamento da nova versão
- Todas as funcionalidades anteriores (single player, multiplayer, floresta, desafios, banco de questões, menu) permanecem inalteradas

### Notas Técnicas

- O EventProcessor foi criado e revisado com 7 correções, mas NÃO está conectado ao game.js
- O WorldConfig da Floresta contém todos os dados do mundo mas NÃO é consumido por nada
- Floresta Misteriosa usa tipos de evento customizados (`shortcut`, `worldExit`) que não são built-in no EventProcessor — placeholder em `customEventHandlers` para implementação futura
- `selectedWorldId` está definido em game.js e pronto para consumo pelo WorldRegistry na Sprint A5
- Os 4 cards "Em breve" são placeholder visual — seus IDs estão reservados no world-manifest.js

## Marco 3 — Engine em Produção (Sprints A5.1 e A5.2)

### Objetivo

Colocar a Engine em produção: inicializar o WorldRegistry no bootstrap do jogo, migrar `game.js` para ES Module, popular `currentWorldConfig` a partir do registry, e consumir os dados de `board` do WorldConfig nos getters e funções do jogo — tudo com fallback seguro para dados hardcoded.

### Arquivos Alterados

| Arquivo | Tipo de Alteração |
|---------|-------------------|
| `src/game.js` | Migrado de IIFE para ES Module (`type="module"`). Adicionado: import de `WorldRegistry` e `florestaEncantada`, `WorldRegistry.init()` no bootstrap, `currentWorldConfig`. `selectWorld()` agora usa `WorldRegistry.get()`. `getTotalCasas()`, `getPosicoes()`, `getIcones()` consomem `currentWorldConfig.board` com fallback. `handleVictory()` e casos "atalho"/"saida-mundo" usam `config.board.totalCells` |
| `src/index.html` | `<script>` alterado para `<script type="module">`. `data-world="floresta"` alterado para `data-world="floresta-encantada"` |
| `README.md` | Seção de execução local atualizada com exigência de servidor HTTP |
| `CHANGELOG.md` | Adicionado: entrada Sprint A5.1 + A5.2 |
| `docs/arquitetura.md` | Atualizado: fluxo de inicialização com WorldRegistry, seletor de mundos consumindo config |
| `docs/arquitetura-motor-de-mundos.md` | Atualizado: plano de migração com A5.1-A5.4 |
| `docs/roadmap.md` | Atualizado: A5.1 e A5.2 em concluído |

### Impacto Técnico

- **game.js → ES Module**: O arquivo foi convertido de um IIFE (Immediately Invoked Function Expression) para um módulo ES6 (`export` implícito via script type="module"). Isso permite usar `import` para trazer `WorldRegistry`, `florestaEncantada` e, futuramente, outros módulos do engine. Consequência: o jogo não pode mais ser executado via `file://` — exige servidor HTTP.
- **WorldRegistry.init([florestaEncantada])**: Chamado no início do bootstrap, registra o primeiro mundo no registry. `selectWorld(worldId)` agora consulta o registry via `WorldRegistry.get(worldId)` — se o mundo não for encontrado, usa `WorldRegistry.getDefault()` como fallback.
- **currentWorldConfig**: Nova variável no escopo do módulo que armazena o WorldConfig completo do mundo selecionado. É populada em `selectWorld()` e consumida pelos getters world-aware.
- **Getters com fallback**: `getTotalCasas()` retorna `currentWorldConfig?.board?.totalCells ?? TOTAL_CASAS`. `getPosicoes()` retorna `currentWorldConfig?.board?.positions ?? boardPositions`. `getIcones()` retorna `currentWorldConfig?.board?.cellIcons ?? icons`. Isso garante que o jogo funciona mesmo se `currentWorldConfig` estiver ausente (fallback para os dados hardcoded do monólito).
- **handleVictory() e casas especiais**: O case "atalho" (floresta casa 5) e "saida-mundo" (floresta casa 8) usam `currentWorldConfig?.board?.totalCells` em vez de `FLORESTA_TOTAL`. O mesmo para `handleVictory()` que agora lê `currentWorldConfig?.board?.totalCells ?? TOTAL_CASAS`.
- **data-world**: O atributo `data-world` no `<html>` foi alterado de `"floresta"` para `"floresta-encantada"` para corresponder ao ID formal do WorldConfig.
- **Ambiente de desenvolvimento**: `cd src && npx serve .` (porta 3000) ou `cd src && py -m http.server 8000`.

### Impacto Funcional

- Nenhuma regressão funcional — todos os fallbacks preservam o comportamento original
- Cards do seletor de mundos agora exibem nome e descrição extraídos do WorldConfig (antes eram texto estático no HTML)
- Demo online (https://lara-world.wl-infra.uk/) continua funcionando sem alterações
- Jogadores precisam usar servidor HTTP local para desenvolvimento — `file://` não funciona mais

### Notas Técnicas

- A migração para ES Module foi necessária para viabilizar imports de módulos do engine
- `file://` é bloqueado por segurança do navegador — não é uma limitação do código
- O fallback nos getters garante compatibilidade retroativa: se um novo mundo for carregado sem config, o jogo usa os dados hardcoded do monólito
- A5.1 foi a primeira sprint com código da engine EFETIVAMENTE executado no jogo — anteriormente os módulos existiam apenas em paralelo, não conectados
- A5.2 estendeu o consumo para `board.totalCells`, `board.positions`, `board.cellIcons` — todos os getters world-aware agora lêem do config

## [0.8.0] - 2026-07-05

### Objetivo

Implementar um menu inicial (Main Menu) com duas opções de entrada ("⚡ Jogo Rápido" e "🏆 Modo Carreira (Em Breve)"), refatorar a tela de vitória para oferecer duas saídas distintas (Jogar Novamente / Voltar ao Menu), e extrair `resetGameState()` para reúso entre reinício e retorno ao menu.

### Arquivos Alterados

| Arquivo | Tipo de Alteração |
|---------|-------------------|
| `src/game.js` | Adicionado: `modoJogo`, `showMainMenu()`, `hideMainMenu()`, `setupMenuEvents()`, `resetGameState()`. Modificado: `init()` (agora chama `showMainMenu()`), `setupModalEvents()` (configura `modoJogo`, oculta seletor 2P), `startGame()` (usa `modoJogo`), `handleVictory()` (dois botões), `reiniciarJogo()` (usa `resetGameState()`) |
| `src/index.html` | Adicionado: `#main-menu` com `.menu-title`, `.menu-buttons`, `.menu-btn` para "Jogo Rápido" e "Carreira". Reordenado: `#main-menu` antes de `#game-layout`. Modificado: `#victory-overlay` com container `.victory-actions` para dois botões. Cache-busting atualizado para `?v=0.8.0` |
| `src/style.css` | Adicionado: `#main-menu`, `.menu-title` (fonte grande, gradiente dourado), `.menu-buttons` (flex column, gap), `.menu-btn` (hover rosa, borda), `.menu-btn.disabled` (opacity, cursor not-allowed), `.menu-btn-icon` (tamanho fixo 64px), `.victory-actions` (flex, gap, dois botões lado a lado) |
| `README.md` | Atualizado: v0.8.0 como versão ativa, funcionalidades, história, roadmap |
| `CHANGELOG.md` | Adicionado: entrada v0.8.0 |
| `docs/visao-geral.md` | Atualizado: v0.8.0 como versão atual |
| `docs/arquitetura.md` | Atualizado: index.html com main menu, game.js com modoJogo/showMainMenu/resetGameState, fluxo do jogo |
| `docs/regras-do-jogo.md` | Atualizado: Tela Inicial, tela de vitória com duas saídas |
| `docs/roadmap.md` | Atualizado: v0.8.0 movido para concluído |
| `docs/memorial-tecnico.md` | Adicionado: entrada v0.8.0 |

### Impacto Técnico

- **game.js**: Nova variável `modoJogo` (string | null) controla o modo atual — `"rapido"` para Jogo Rápido, `null` no menu. `init()` agora chama `showMainMenu()` em vez de `showSetupScreen()`. `showMainMenu()` exibe `#main-menu` e oculta `#game-layout`, `#setup-screen`, `#victory-overlay`. `hideMainMenu()` oculta `#main-menu` e exibe `#game-layout`. `setupMenuEvents()` registra clique no botão "Jogo Rápido" (configura `modoJogo = "rapido"`, chama `hideMainMenu()` + `showSetupScreen()`) e no botão "Carreira" (disabled, sem ação). `setupModalEvents()` no modo Jogo Rápido oculta o seletor de modo e força configuração 1P. `startGame()` usa `modoJogo` para determinar se é single player. `resetGameState()` extrai a lógica de reset de estado de `reiniciarJogo()`: zera posições, `rodadasPerdidas`, `mundoAtual = "principal"`, `entradaFloresta = {1: null, 2: null}`, `entrouNoPortal = false`, `questoesUsadas.clear()`, `jogoAtivo = true`, `jogoFinalizado = false`. `reiniciarJogo()` agora chama `resetGameState()` e depois `showSetupScreen()`. `handleVictory()` agora cria dois botões no container `.victory-actions`: "🔁 Jogar Novamente" chama `reiniciarJogo()` e "🏠 Voltar ao Menu" chama `showMainMenu()`.
- **HTML**: Novo `#main-menu` com `<h1 class="menu-title">🌍 Lara World</h1>`, dois `<button class="menu-btn">` no container `.menu-buttons`. O segundo botão ("🏆 Modo Carreira") possui classe `disabled` e `disabled` attribute. Estrutura reordenada: `#main-menu` é o primeiro elemento do body, seguido por `#game-layout`. `#victory-overlay` ganhou container `.victory-actions` com `id="victory-actions"`. Cache-busting: `?v=0.8.0` no link do CSS e script do JS.
- **CSS**: `#main-menu` com `position: fixed`, `inset: 0`, `z-index: 1000`, `display: flex`, `flex-direction: column`, centralizado, fundo com gradiente animado. `.menu-title` com `font-size: 4rem`, gradiente dourado (`linear-gradient(135deg, #ffd700, #ff8c00)`), `text-shadow` decorativo. `.menu-buttons` com `display: flex`, `flex-direction: column`, `gap: 20px`. `.menu-btn` com `padding: 20px 40px`, `font-size: 1.5rem`, `border-radius: 16px`, `border: 3px solid rgba(255,255,255,0.3)`, `background: rgba(255,255,255,0.1)`, `cursor: pointer`, hover com borda rosa. `.menu-btn.disabled` com `opacity: 0.4`, `cursor: not-allowed`. `.menu-btn-icon` com `font-size: 64px`, `line-height: 1`. `.victory-actions` com `display: flex`, `gap: 12px`, `justify-content: center`.

### Impacto Funcional

- Jogo agora inicia com um menu principal visual com título decorativo e dois botões
- "⚡ Jogo Rápido" inicia partida single player com configuração mínima (apenas nome/sprite do Jogador 1)
- "🏆 Modo Carreira" aparece como botão desabilitado com "(Em Breve)", sem ação
- Tela de vitória agora oferece duas opções: "Jogar Novamente" (mesmo modo) ou "Voltar ao Menu"
- "Jogar Novamente" agora reinicia a partida sem sair do modo atual (não exige re-seleção)
- "Voltar ao Menu" retorna ao menu principal, permitindo iniciar nova partida do zero
- Cache-busting via `?v=0.8.0` garante que navegadores carreguem a versão mais recente dos assets
- Todas as funcionalidades anteriores (single player, multiplayer, floresta, desafios, banco de questões) permanecem inalteradas

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
