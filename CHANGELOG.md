# Changelog

## [Unreleased]

## [0.35.0-preview] - 2026-07-15

### Adicionado
- **Question Engine completa**: módulo `src/data/questions/` com `QuestionEngine`, `QuestionRepository`, `QuestionSelector`, `QuestionValidator` e `CategoryCatalog`
- **128 perguntas migradas** em 9 categorias: matemática, português, animais, espaço, natureza, dinossauros, lógica, cores e formas, conhecimentos gerais
- **`questionPolicy` nos WorldConfigs**: 5 mundos configurados com pesos por categoria e faixa de nível
- **Anti-repetição por sessão**: `usedQuestionIds` em gameState com reset automático ao esgotar pool
- **Fallback seguro**: fallback em camadas (clear excludeIds → tentar todas categorias → null seguro) sem penalizar jogador
- **Validação de `questionPolicy`** em world-registry.js
- **122 testes** cobrindo seleção, anti-repetição, fallback, mutação, políticas de mundo e comportamento do bot

### Alterado
- **`sortearQuestao()`**: agora usa `QuestionEngine.select()` com `questionPolicy` do mundo ativo
- **`showChallengeModal()`**: adaptado ao novo schema (`question`, `options[]`, `correctOption`)
- **Debug do banco**: usa API pública do QuestionEngine (`getStatistics`, `getCategories`, `selectMany`)
- **`types.js`**: adicionado `QuestionPolicy` typedef; `QuestionItem` atualizado para novo schema
- **Versão e cache-busting**: atualizados para `v0.35.0-preview`

### Removido
- **Sistema legado**: `src/data/questions.js` removido (100% substituído pelo Question Engine)

## [0.34.0-preview] - 2026-07-15

### Adicionado
- **Tela de Vitória Premium**: card creme responsivo com borda dourada, ribbon rosa, coroa, avatar oficial, mensagem positiva, estatísticas e faixa “Dica Lara”
- **Estatísticas de sessão**: coleta incremental e não persistente de duração e lançamentos, combinada ao nome real do mundo
- **Acessibilidade do diálogo**: semântica modal, anúncio do resultado, foco inicial, ciclo de Tab, restauração de foco e foco visível

### Alterado
- **Celebração**: sequência de entrada de aproximadamente 650 ms, confetes finitos e suporte completo a `prefers-reduced-motion`
- **Responsividade**: conteúdo adaptado para desktop, notebook, tablet, celular vertical, paisagem e telas baixas
- **Fluxos de vitória**: mensagens secundárias específicas para humano, máquina e dois jogadores, sem alterar regras ou ações existentes
- **Versão e cache-busting**: atualizados para `v0.34.0-preview`

## [0.33.0-preview] - 2026-07-15

### Adicionado
- **Board Alive**: feedback curto na casa final, iluminação sequencial do caminho, pouso suave do token e impacto final do dado
- **Casas especiais vivas**: animação contínua discreta para desafio, portal, minigames e chegada
- **Turno visual**: glow aplicado somente ao token e avatar do jogador ativo
- **Efeitos ambientais configuráveis**: `theme.ambientEffect` nos WorldConfigs com presets genéricos para folhas, estrelas, bolhas, poeira e brasas

### Alterado
- **Barra de progresso**: easing ajustado para crescimento e redução mais suaves
- **Acessibilidade e performance**: animações baseadas em CSS, partículas limitadas e desativação via `prefers-reduced-motion`
- **Versão e cache-busting**: atualizados para `v0.33.0-preview`

## [0.32.0-preview] - 2026-07-15

### Adicionado
- **Game Event Overlay**: narração temporária e sequencial para dado, movimento, bônus, penalidades, desafios, minigames e mudança de turno
- **Módulo `src/ui/game-event-overlay.js`**: API `showGameEvent()`, `queueGameEvent()` e `clearGameEvents()`, fila com Promise, prevenção de resolução duplicada e cancelamento de timers
- **Estilos `src/ui/game-event-overlay.css`**: dez variações visuais, glass discreto, responsividade e `prefers-reduced-motion`

### Alterado
- **HUD**: “Último Evento” passa a ser atualizado por um helper único; o histórico interno acumulativo foi preservado separadamente
- **Fluxo da partida**: desafios, minigames, bot e turnos aguardam a narração visual sem alterar regras ou resultados
- **Limpeza de sessão**: reset, menu e vitória cancelam fila visual e timer agendado do bot
- **Versão e cache-busting**: atualizados para `v0.32.0-preview`

## [0.31.0-preview] - 2026-07-14

### Adicionado
- **Sobre o Lara World**: tela com informações do jogo, recursos atuais, em desenvolvimento e créditos — acessível pelo botão "ℹ️ Sobre" na tela inicial. Overlay glass card com design consistente com o menu
- **Como Jogar**: tutorial interativo com 7 passos de onboarding, indicador de progresso (dots), navegação por teclado (setas, Esc) e mouse. Overlay glass card, persistência em localStorage (`lara-world-tutorial-seen`), não abre automaticamente
- **Módulo `src/about/`**: 3 arquivos — `about-screen.js` (lógica), `about.css` (estilos), `index.js` (barrel). Funções: `initAboutScreen()`, `showAboutScreen()`, `hideAboutScreen()`
- **Módulo `src/tutorial/`**: 4 arquivos — `tutorial-data.js` (dados dos 7 passos), `tutorial-screen.js` (lógica), `tutorial.css` (estilos), `index.js` (barrel). Funções: `initTutorialScreen()`, `showTutorialScreen()`, `hideTutorialScreen()`, `hasSeenTutorial()`, `resetTutorialSeen()`
- **Botões secundários no menu**: "📖 Como Jogar" e "ℹ️ Sobre" abaixo dos botões primários, com visual reduzido (classe `menu-btn-secondary`)

### Alterado
- **`src/game.js`**: imports de `about/index.js` e `tutorial/index.js`, `initAboutScreen()` e `initTutorialScreen()` no `init()`, listeners `#btn-tutorial` e `#btn-about` em `setupMenuEvents()`, `hideAboutScreen()` e `hideTutorialScreen()` em `showMainMenu()`
- **`src/index.html`**: links CSS `about/about.css` e `tutorial/tutorial.css`, botões secundários `#btn-tutorial` e `#btn-about` no menu, overlay containers `#about-overlay` e `#tutorial-overlay`
- **`src/version.js`**: versão atualizada para `v0.31.0-preview`
- **Cache-busting**: query params `?v=v0.31.0-preview` em CSS e JS no index.html

## [0.30.0-preview] - 2026-07-14

### Adicionado
- **Modo Arcade**: novo modo de jogo que permite jogar qualquer minigame registrado de forma avulsa, sem precisar passar pelo tabuleiro. Acessível pelo botão "🎮 Modo Arcade" na tela inicial
- **Galeria de minigames**: tela com cards para cada minigame disponível, exibindo nome, ícone, descrição, duração e estatísticas do jogador
- **Estatísticas persistentes do Arcade**: dados salvos em `localStorage` (chave `lara-world-arcade-stats`) com schema v1: partidas jogadas, vitórias, derrotas, sequência atual, sequência máxima, tempo total jogado, última jogada e último resultado por minigame
- **Parâmetro `context` no MinigameHost**: `launchMinigameHost()` agora aceita campo opcional `context: 'board' | 'arcade'` para alternar textos de retorno e ocultar efeitos do tabuleiro no card final
- **Card final contextual**: no contexto `arcade`, o card exibe "Voltar ao Arcade" e "Voltando ao Modo Arcade em Xs..." — sem menção ao tabuleiro, sem exibição de bônus de casas
- **Card final no contexto `board` preservado**: textos "Voltar ao tabuleiro", "Voltando ao tabuleiro em Xs..." e exibição de "+N casas" mantidos intactos
- **Arquitetura `src/arcade/`**: 6 novos arquivos — `index.js` (barrel), `arcade-controller.js` ( lifecycle + guard de execução ), `arcade-screen.js` (renderização da galeria), `arcade-card.js` (card individual), `arcade-stats.js` (persistência localStorage), `arcade.css` (tema escuro)
- **Isolamento do Arcade em relação ao tabuleiro**: Arcade não depende de `currentPlayerIndex`, `players[]`, posição, `StateManager` nem `SessionManager`

### Alterado
- **`src/game.js`**: imports de `arcade/index.js`, `initArcadeController(showMainMenu)`, `initArcadeScreen()` no `init()`, listener `#btn-arcade`, `leaveArcadeMode()` em `showMainMenu()`
- **`src/index.html`**: botão `#btn-arcade` no menu, seção `#arcade-screen` com galeria + footer, import CSS `arcade/arcade.css`
- **`src/style.css`**: classe `.menu-btn-arcade` com variantes responsivas (tablet ≤768px, phone ≤600px)
- **`src/minigames/engine/minigame-host.js`**: campo `context` extraído de options (default `'board'`), helper `getReturnPresentation(ctx)` centraliza textos de retorno, `showResult()` oculta bonus quando `context === 'arcade'`, `startReturnCountdown()` usa textos contextuais e atualiza `cardBtn.textContent`
- **`src/arcade/arcade-controller.js`**: passa `context: 'arcade'` na chamada a `launchMinigameHost()`

### Corrigido
- **Import faltando**: `initArcadeController` não estava no import de `arcade/index.js` em `game.js`, causando `ReferenceError` que impedia o carregamento da página (corrigido durante auditoria de recuperação)

## [0.29.0-preview] - 2026-07-14

### Adicionado
- **Padronização visual dos tabuleiros**: nova regra oficial — casas especiais usam ícones funcionais exclusivos (❓ ⏩ ⏪ 🎲 ⏸️ 🔄 👑 🧩 🏃 🚀 🎯 🐉), casas normais usam ícones temáticos únicos por mundo, sem repetição entre si e sem conflito com ícones funcionais
- **Revisão completa dos 5 mundos**: Floresta 🌿, Dinossauros 🦕, Galáxia 🌌, Oceanos 🌊, Castelo 🏰 — todos os cellIcons reavaliados e padronizados com identidade visual própria
- **Textos das casas reduzidos**: todas as descrições de eventos foram encurtadas para leitura rápida no mobile (máximo 3 palavras: "Desafio", "Avance 2", "Volte 1", "Jogue de novo", "Pule a vez", "Troque de lugar", "Chegada", "Memória", "Dino Runner", "Buraco de Minhoca", "Match-3", "Dragões")
- **Ajuste Galáxia casa 17**: normalizada com ícone 🌟 (normal) — ⏸️ reservado exclusivamente para a ação "Pule a vez"

### Alterado
- **game.js**: fallback `casasEspeciais` atualizado com textos mínimos e ícones funcionais
- **index.html**: botão debug "Gal C15 🚪" renomeado para "🚀 Gal C15"
- **Floresta**: cellIcons — 🌳 🍄 🦋 🐞 🌻 🍃 🌸 🐿️ 🐾 (normais); ⏩ ❓ ⏪ 🎲 ⏸️ 🧩 🔄 👑 (especiais)
- **Dinossauros**: cellIcons — 🥚 🦴 🌴 🌋 🐾 🪨 🌱 🦅 (normais); ❓ ⏩ ⏪ 🎲 🏃 ⏸️ 👑 (especiais)
- **Galáxia**: cellIcons — 🌌 🌍 ☄️ 🌙 🪐 🔭 🛰️ 💫 🛸 🌠 🌟 (normais); ⏩ ❓ 🔄 🎲 🚀 ⏸️ 👑 (especiais)
- **Oceanos**: cellIcons — 🌊 🐙 🐠 🪸 🐢 🐟 🦈 🐚 🐋 🦞 (normais); ⏩ ❓ ⏪ 🔄 🎲 🎯 ⏸️ 👑 (especiais)
- **Castelo**: cellIcons — 🏰 ⚔️ 🛡️ 📜 🗝️ 🔮 🏹 🏺 (normais); ⏩ ❓ ⏪ 🎲 ⏸️ 🐉 🔄 👑 (especiais)

### Corrigido
- **Cache HTTP**: Reescrita da política de cache no Nginx (`docker/nginx.conf`) — adicionada diretiva `always` em todos os headers, separação explícita HTML/JS/CSS/mídia, `.map` incluído no grupo de revalidação. Corrige problema onde Cloudflare servia assets JS antigos (`loader.js`) com `max-age=604800, immutable` após deploy.

## [0.28.0-preview] - 2026-07-13

### Adicionado
- **Ataque dos Dragões**: novo minigame Canvas na casa 15 do Castelo dos Dragões — jogo de defesa onde o jogador toca nos dragões antes que alcancem o castelo. 20 segundos, 15 dragões para acertar, 3 escudos de defesa. 4 fases de dificuldade progressiva (velocidade e quantidade de dragões simultâneos aumentam). Botão de pausa ausente — jogo é contínuo. Controles: clique/toque no dragão. Resultado: vitória (+3 casas) ou derrota (boardDelta 0, sem penalidade).
- **Arquivos criados**: `src/minigames/ataque-dragoes/AtaqueDragoesGame.js`, `ataque-dragoes.css`, `index.js`
- **Debug expandido**: 5 botões novos — abrir ataque dos dragões, simular vitória, simular derrota, retornar, testar bot
- **Casa 15 do Castelo**: evento alterado de `placeholder` para `ataque-dragoes`

### Alterado
- **Castelo dos Dragões**: casa 15 agora dispara o minigame Ataque dos Dragões em vez de ser casa sem efeito
- **Loader de minigames**: import de `'../ataque-dragoes/index.js'` adicionado em `src/minigames/engine/loader.js`
- **game.js**: novo case `"ataque-dragoes"` em `processSpecialCell()`, wrapper `launchAtaqueDragoes()`, 8 handlers de debug

## [0.27.0-preview] - 2026-07-13

### Adicionado
- **Jogo da Memória da Floresta (MEMORY-FOREST)**: novo minigame DOM na casa 11 da Floresta Encantada — 12 cartas (6 pares com emojis de floresta), cronômetro de 30s, vitória com 4+ pares. Modal "Entrar" ou "Continuar" antes de iniciar. Bot com 65% de chance de vitória. Result card com estatísticas e retorno automático em 5s.
- **Arquivos criados**: `src/minigames/memoria-floresta/MemoryGame.js`, `memoryGame.css`, `index.js`
- **Debug expandido**: 6 botões novos — abrir memória, simular vitória, simular derrota, encerrar tempo, retornar, testar bot

### Removido
- **Floresta Misteriosa**: WorldConfig completa (`florestaMisteriosa`) removida de `src/worlds/floresta/config.js`
- **Subworld removido**: import `florestaMisteriosa` em `game.js` removido; entrada `subworldConfigs['floresta-misteriosa']` esvaziada
- **CSS exclusivo removido**: estilos `.mundo-floresta` (casas 3, 5, 7, 8 do submundo) e seletor `#track-container.mundo-floresta` removidos de `style.css`
- **Mapeamento de perguntas**: `'floresta-misteriosa'` removido de `worldCategoryMap` em `questions.js`
- **Debug antigo**: botões `floresta-saida` e handler `enterSubworld('floresta-misteriosa')` removidos

### Alterado
- **Casa 11 da Floresta**: evento alterado de `portal` (genérico) para `memory-forest` (minigame específico)
- **Handler `processSpecialCell()`**: novo case `"memory-forest"` com modal, lançamento do minigame e processamento de bônus
- **Infraestrutura de subworlds preservada**: `subworldConfigs`, `getSubworldConfig()`, `handleSubworldExit()`, cases `"portal"`, `"atalho"`, `"saida-mundo"` mantidos intactos

## [0.26.0-preview] - 2026-07-12

### Versão Oficial Consolidada

Release oficial que incorpora todo o trabalho realizado desde v0.17.0-preview, unificando as versões documentais v0.18.0-preview a v0.25.0-preview em um único marco com evidência no código (version.js, cache-busting, documentação sincronizada).

### Adicionado
- **Remoção dos emojis clássicos**: seção collapsível removida da tela de seleção de personagens; galeria simplificada para 4 personagens oficiais
- **Quinto mundo — Castelo dos Dragões**: tema medieval infantil, layout ascendente, 20 casas, 9 eventos, identidade visual roxa/lilás
- **Reino dos Oceanos**: infraestrutura de assets e diretório `src/assets/worlds/oceanos/` com placeholders
- **Sistema de Variantes de Tabuleiro (Layouts)**: arquitetura genérica `board.layouts` no WorldConfig, Galáxia como primeiro adotante com 3 layouts
- **Sistema de Avatares e Tokens (UX-015)**: 4 personagens oficiais com fallback visual via `applyVisualFallback()`
- **Ilustrações Oficiais dos Mundos (ART-009)**: container 96×96px em cada card com fallback de emoji
- **Board Layout 2.0**: `board.cells` substitui `board.positions` para posicionamento individual de células

### Alterado
- **Redesign da Hero Screen**: logo oficial `logo-lara-world.webp` substitui antigo título emoji + gradiente; Lara removida do card; estrutura `.menu-brand` adotada
- **Consolidação da arquitetura de minigames**: documentação unificada (MinigameRegistry, MinigameHost, contrato boardDelta). DMP-01 resolvido — penalidade -2 do MeteoroGame oficializada como boardDelta 0
- **Galáxia Estelar**: background personalizado, suporte a `path.webp`, 3 layouts
- **Seletor de Mundos v2 (UX-014)**: painel remodelado no visual da Hero Screen, cards com identidade por mundo

### Corrigido
- **Duplicidade [0.17.0-preview] no CHANGELOG**: duas entradas mesmo número (07-09 e 07-11) mescladas — hotfix cascata realocado para [0.16.0-preview], período correto de desenvolvimento
- **Versionamento inconsistente**: v0.18.0-preview a v0.25.0-preview existiam apenas na documentação, sem tag ou version.js. v0.26.0-preview é a primeira release oficial desde v0.17.0-preview

### Notas Técnicas
- `src/version.js` é a fonte única da verdade para a versão atual
- Script `scripts/check-version.mjs` criado para auditoria automática de consistência
- Todas as referências ativas sincronizadas para v0.26.0-preview

## [0.25.0-preview] - 2026-07-12

### Hero Screen — Redesign da Tela Inicial

- **Redesign completo da Hero Screen**: nova composição visual da tela inicial com branding próprio baseado em asset oficial
- **Logo oficial implementado**: `assets/ui/logo-lara-world.webp` (92KB) substitui o antigo título HTML baseado em emoji `🌍` + gradiente pink-dourado via `background-clip: text`
- **Estrutura `.menu-brand`**: container dedicado para o logo com `<img class="menu-brand-logo">` + `<span class="menu-brand-fallback">` como fallback textual — substitui a antiga estrutura `.menu-logo`
- **Ilustração Lara removida**: o elemento `.menu-lara-hero` (personagem sobreposta ao card) foi removido da Hero Screen para simplificar a composição e evitar conflito visual com o novo logo
- **Classes CSS refatoradas**: `.menu-brand`, `.menu-brand-logo`, `.menu-brand-fallback` substituem `.menu-logo`, `.menu-title-emoji`, `.menu-logo h1`
- **Card central refinado**: `.menu-content` com padding ajustado (18px 40px 18px), `backdrop-filter: blur(24px)`, borda 3px branca, glow rosa e sombra multicamadas
- **Botões preservados**: "⚡ Jogo Rápido" (primário com glow pulsante) e "🏆 Modo Aventura" (secundário com badge "EM BREVE...") mantidos sem alteração funcional
- **Decorações mantidas**: shapes flutuantes (`.menu-bg-shapes`), sparkles animados (`.menu-sparkles`), fundo com 7 gradientes radiais + `menu-background.webp` (opacity 0.50)
- **Logo com fallback**: se `logo-lara-world.webp` não carregar, o texto "Lara World" em rosa (#e91e63) com fonte 3rem é exibido como fallback via `onerror`
- **Responsivo**: breakpoints ≤768px, ≤400px e viewport reduzida com ajustes proporcionais do logo (`max-width: 432px → 390px → 100%`)
- **Assets UI consolidados**: pasta `src/assets/ui/` com `logo-lara-world.webp` (novo), `lara-hero.webp` (existente, não utilizado na Hero Screen atual), `menu-background.webp` (existente, mantido no fundo)
- **Ilustrações dos mundos implementadas**: todos os 6 assets `world-icons/*.webp` (floresta, dinossauros, galaxia, oceanos, castelo, aleatorio) existem e são funcionalmente carregados nos cards do seletor com fallback de emoji

## [0.24.0-preview] - 2026-07-12

### 🐉 Quinto Mundo — Castelo dos Dragões

- **Novo mundo jogável**: "Castelo dos Dragões" (`castelo-dragoes`) — quinto mundo principal com tema medieval infantil
- **Layout em subida**: células posicionadas em `board.cells` no sentido ascendente (y: 90→18), simulando escalada até o castelo
- **Integração ao seletor**: card do Castelo habilitado via `enableWorldCard('castelo-dragoes')`, badge "✅ Disponível"
- **Integração ao Mundo Aleatório**: incluído no sorteio de `random(w => w.type === 'main')` entre todos os 5 mundos principais
- **Identidade visual própria**: tema roxo/lilás (#4a148c, #7b1fa2, #ce93d8) com gradiente escuro, células em tom pastel e bordas douradas
- **Assets**: diretório `src/assets/worlds/castelo/` com `background.webp` (placeholder) e `.gitkeep`
- **CSS completo**: seletores `body[data-world="castelo-dragoes"]` para fundo, track-container, células, casas especiais, vitória e path-line
- **WorldConfig registrado**: no `world-manifest.js`, `loader.js` e importado no `game.js`
- **Eventos implementados**: Avance 2 (c3), Desafio (c5, c14, c19), Volte 1 (c7), Jogue novamente (c9), Perde rodada (c11), Placeholder (c12), Volte 2 (c16), Troque de lugar (c18), Vitória (c20)
- **Casa 12 reservada**: evento `placeholder` para evolução futura
- **Sem submundo**: não possui área especial
- **Sem portal**: não possui portal para outro mundo
- **Sem minigame**: não possui minigame implementado

## [0.17.0-preview] - 2026-07-11

### Correção de 3 Bugs — Corrigido

#### Bug 1 — Vitória Prematura ao Sair de Submundo

- **Problema**: `handleVictory()` era chamado diretamente nos cases `desafio` e `avancar` de `processSpecialCell()` quando o jogador atingia o limite do tabuleiro, mesmo dentro de um submundo (`activeSubworldId` definido).
- **Solução**: adicionada função `handleBoardLimitReached()` em `src/game.js` que, quando o jogador atinge o limite do submundo, sai do submundo (similar a `saida-mundo`), retorna ao mundo principal com bonificação de +2 casas e verifica vitória no mundo principal.
- **Arquivo**: `src/game.js`

#### Bug 2 — Pergunta sem Alternativa Correta

- **Problema**: na pergunta "Qual palavra tem 5 letras?" as opções eram `["Gato", "Cachorro", "Bola"]` — nenhuma tem 5 letras (Gato=4, Cachorro=8, Bola=4).
- **Solução**: alterada a opção "Bola" para "Papel" e resposta correspondente. Adicionada função `validateQuestionBank()` que percorre todo o banco e reporta perguntas com resposta ausente ou fora das opções.
- **Arquivo**: `src/data/questions.js`

#### Bug 3 — Mundo Aleatório Sempre Escolhia Floresta

- **Problema**: no seletor de mundos, a opção "random" usava `getDefault()`, que retorna sempre o primeiro mundo com `metadata.default: true` (Floresta).
- **Solução**: substituído `getDefault()` por `random(w => w.type === 'main')`, que sorteia entre todos os mundos principais disponíveis.
- **Arquivo**: `src/game.js`

### Detalhes Técnicos

- Cache-busting atualizado para `?v=v0.17.0-preview`
- Versão do projeto: `v0.17.0-preview`

## [0.23.0-preview] - 2026-07-10

### Infraestrutura de Assets — Reino dos Oceanos

- **Diretório de assets criado**: `src/assets/worlds/oceanos/` com `.gitkeep`, `background.webp` e `path.webp` (placeholders zero-byte)
- **README.md**: árvore de assets atualizada com `oceanos/`; tabela de status com entradas para background.webp e path.webp do Reino dos Oceanos
- **CHANGELOG.md**: entrada v0.23.0-preview adicionada
- **docs/visao-geral.md**: diretório `oceanos/` adicionado na estrutura de assets
- **docs/roadmap.md**: item "Assets do Reino dos Oceanos" adicionado em Futuro
- **docs/memorial-tecnico.md**: sprint registrada
- **docs/arquitetura.md**: `oceanos/` adicionado na árvore de diretórios e na nota explicativa
- **Nenhuma alteração de gameplay**: sem CSS, sem engine, sem world config — apenas assets placeholder + documentação

## [0.22.0-preview] - 2026-07-10

### Sistema de Variantes de Tabuleiro (Layouts)

- **Arquitetura genérica de layouts**: cada mundo pode declarar múltiplos layouts de tabuleiro via `board.layouts` + `board.defaultLayout` no WorldConfig — zero lógica específica de mundo no engine
- **Galáxia Estelar**: primeiro mundo a adotar o sistema com 3 layouts — ⭐ Padrão (original), 🪐 Órbita (curva orbital, deslocamento Y progressivo) e 🌀 Espiral (rotação espiral, 360° com centro偏移)
- **Selector UI renderizado automaticamente**: `renderLayoutSelector()` em `src/game.js` (l.1065-1097) cria botões `icon + name` quando `Object.keys(layouts).length > 1`; oculto para mundos com layout único via `.layout-selector.hidden { display: none; }`
- **Troca de layout via `layout:{id}`**: novo handler de comando processa `layout:id` no switch de comandos especiais (l.1692-1704), regenera o SVG path e reposiciona jogadores
- **Persistência em `localStorage`**: layout ativo salvo e restaurado por mundo
- **getActiveBoardLayout()**: função central que retorna o layout atual do mundo corrente (l.110-117), consumida por `getPosicoes()`, `applyLayout()` e `renderizarTrilha()`
- **applyLayout()**: função que re-renderiza SVG path e posiciona jogadores ao trocar layout (l.136-141)
- **Integração Debug**: `renderDebugLayoutButtons()` no painel de debug (l.1516-1529) para troca rápida entre variantes
- **Validação**: `world-registry.js` — valida `board.layouts` (objeto de LayoutEntry) e `board.defaultLayout` (deve ser chave válida em layouts)
- **Tipagem**: typedef `LayoutEntry` em `src/core/types.js` com `id`, `name`, `icon`, `description`, `cells`
- **Arquivos**: `src/worlds/galaxia/layouts.js`, `src/game.js`, `src/core/types.js`, `src/engine/world-registry.js`, `src/index.html`, `src/style.css`

### Corrigido

- **Switch quebrado corrigido**: estrutura switch em handler de debug (game.js:1900) foi corrompida por `}` extra durante alterações do layout system — removido, `node --check` passa limpo
- **Coordenadas dos Dinossauros restauradas**: `board.cells` do Vale dos Dinossauros foi sobrescrito com grid genérico durante desenvolvimento dos layouts — restauradas as coordenadas originais em S-curve com deslocamento +7pp X
- **Layout selector visível em todos os mundos**: faltava a regra `.layout-selector.hidden { display: none; }` no CSS — adicionada, selector agora aparece apenas em mundos com 2+ layouts
- **Import não utilizado removido**: `import { galaxyLayouts }` removido de `src/game.js` (era resquício de código específico de mundo)

## [0.21.0-preview] - 2026-07-09

### Versionamento Centralizado e Cache-Busting

- **`src/version.js` criado**: constante `APP_VERSION` centralizada (`'v0.16.0-preview'`) + função `getCacheBust()`
- **Tela inicial**: versão exibida no rodapé do menu agora lê de `APP_VERSION` via `game.js:init()` — não fica mais defasada
- **Cache-busting unificado**: CSS (`style.css?v=v0.16.0-preview`) e JS (`game.js?v=v0.16.0-preview`) usam versão em vez de data
- **README.md**: versão atual sincronizada para v0.16.0-preview
- **docs/visao-geral.md, docs/arquitetura.md, docs/roadmap.md**: referências de versão alinhadas
- **docs/AI_WORKFLOW.md**: regra obrigatória de versionamento adicionada ao fluxo de desenvolvimento
- **docs/memorial-tecnico.md**: sprint documentada
- **Arquivos**: `src/version.js`, `src/index.html`, `src/game.js`, `README.md`, `docs/*.md`

## [0.20.0-preview] - 2026-07-09

### UX Mobile — Galáxia Estelar (Minigame)

- **Controle touch**: substituído de "lerp até o dedo" para arraste relativo (`deltaX/deltaY`). A nave acompanha o movimento do dedo 1:1, sem precisar tocar na nave. Qualquer ponto da área de jogo funciona como área de controle.
- **Canvas target guard**: eventos de touch/pointer só chamam `preventDefault()` quando o alvo é o canvas, evitando bloquear cliques em botões como "Voltar agora"
- **Botão "Voltar agora" corrigido**: agora funciona no mobile — a chamada de `preventDefault()` nos eventos de toque bloqueava o clique. Com o guard `e.target !== this.canvas`, o botão recebe o clique normalmente.
- **`touch-action: none`** adicionado ao `.meteoro-canvas` para evitar scroll/gestos do navegador durante o minigame
- **Skip bot mode**: botão "Pular" agora limpa o `autoTimer` para evitar dupla resolução
- **Arquivos**: `src/minigames/meteoro/MeteoroGame.js`, `src/style.css`, `src/game.js`

## [0.19.0-preview] - 2026-07-09

### Limite de Empates no Sorteio Inicial

- **Problema**: o sorteio inicial permitia empates indefinidos, causando repetições chatas
- **Solução**: contador `tieCount` limita a 2 empates consecutivos; no 3º, desempate automático escolhe um jogador aleatoriamente
- **Mensagens divertidas**: "Empate cósmico! O jogo escolheu quem começa.", "Depois de tantos empates, a sorte decidiu!", "Tanto empate que o destino tomou a frente!" — uma sorteada aleatoriamente
- **Funciona em**: modo 2 jogadores e 1 jogador vs máquina
- **Dado da partida não foi alterado**: a regra vale apenas para o sorteio inicial

## [0.18.0-preview] - 2026-07-09

### Revisão e Melhorias do Sistema de Perguntas — QST-001 (Parte 2)

- **Expansão do banco de perguntas**: de 30 para 128 perguntas distribuídas em 9 categorias (Matemática, Português, Animais, Espaço, Natureza, Dinossauros, Lógica, Cores e Formas, Conhecimentos Gerais)
- **Banco extraído para módulo próprio**: `src/data/questions.js` com `bancoQuestoes`, `questoesDisponiveis`, `categoryIndices`, `worldCategoryMap`, `getIndicesPorMundo`, `getCategoriasPorMundo`
- **Campo `dificuldade` adicionado**: `"facil"`, `"media"` ou `"dificil"` em todas as 128 perguntas — compatível com versões anteriores (ignorado se ausente)
- **Seleção temática por mundo**:
  - Galáxia Estelar → Espaço, Lógica, Conhecimentos Gerais
  - Floresta (principal + misteriosa) → Animais, Natureza, Cores e Formas, Lógica
   - Dinossauros → Dinossauros, Animais, Natureza, Matemática
  - Fallback geral se o pool temático acabar
- **Algoritmo de sorteio (sortearQuestao)**: agora filtra por mundo, evita repetição na mesma partida, reinicia automaticamente quando o pool acaba, funciona igual para humano e bot
- **Painel de auditoria**: nova seção "Banco de Perguntas" no debug (`?debug=1`) com total, usadas, categorias, dificuldade e mundo atual — botão `📚 Mostrar/Ocultar`
- **Cascata pós-desafio corrigida**: acertar/errar desafio não dispara mais a casa destino (bug reportado na Floresta casa 4 → casa 5)
- **Documentação**: README, CHANGELOG, docs atualizados com o novo sistema

## [0.16.0-preview] - 2026-07-09

### Visual da Galáxia Estelar — ART-011

- **Estrutura de assets criada**: `src/assets/worlds/galaxia/` com `.gitkeep`, preparada para receber `background.webp` e `path.webp`
- **Background personalizado**: CSS de `body[data-world="galaxia-estelar"] #track-container` atualizado para seguir o padrão Floresta/Dinossauros — overlay semitransparente + `url("assets/worlds/galaxia/background.webp")` + gradiente fallback escuro
- **Path.webp já suportado**: regra `body[data-world="galaxia-estelar"] .path-line` existente com URL para o asset e fallback SVG stroke
- **Fallback garantido**: se os assets .webp não existirem, gradiente e SVG mantêm o tabuleiro funcional e legível
- **Documentação**: README, CHANGELOG, visão-geral atualizados com a nova infraestrutura

### Corrigido

- **Cascata pós-desafio**: ao acertar/errar um desafio, o movimento resultante NÃO cascateia casas especiais — vale para acerto e erro, humano e bot, todos os mundos. Movimentos de Avance/Volte automáticos continuam cascateando
- **Arquivo**: `src/game.js` — removidas linhas 621-623 (cascade após acerto)

## [0.15.0-preview] - 2026-07-09

### Casa 7 — Troca Quântica (Galáxia) + Result Card do Minigame — GAL-002

- **Casa 7 — Troca Quântica**: evento `swap-positions` substitui `move -2` — jogador troca de posição com o outro jogador (humano ou bot). Animação em ambos os tokens, UI/histórico atualizados, sem cascata. Botão debug `🔄 Gal C7` adicionado
- **Result Card sobre cenário congelado**: ao fim do MeteoroGame, um card com visual glass (blur, borda roxa, gradiente escuro) aparece sobreposto ao canvas da Galáxia, que continua renderizado (estrelas piscando, nave/ meteoros parados). Nenhum modal separado — o cenário espacial permanece visível ao fundo
- **Card de resultado**: ícone (🚀 sucesso / 💥 falha), título (MISSÃO COMPLETA / MISSÃO FALHOU), descrição, badge de recompensa com brilho dourado (oculto em derrota), contador regressivo de 5s e botão "Voltar agora"
- **Fluxo de bot com card**: mesma interface de resultado (card + contagem + botão)
- **Header oculto durante card**: título e instruções do minigame escondidos quando o card aparece, preservando apenas o cenário de fundo
- **Container com `position: relative`**: `.minigame-container` ganha posicionamento relativo para suportar o card absolute

## [0.14.0-preview] - 2026-07-09

### Galáxia Estelar + Minigame do Buraco de Minhoca — GAL-001

- **Mundo Galáxia**: textos das casas reduzidos para seguir padrão visual dos outros mundos (ícone + descrição curta). Ex: `'🌊 Avance 2'`, `'⭐ Desafio'`, `'🌀 Volte 2'`, `'⚡ Jogue novamente'`
- **Buraco de Minhoca movido para casa 15**: casa especial `buraco-minhoca` removida da casa 10 e adicionada na casa 15. Config, debug e handlers atualizados
- **MeteoroGame 4-dir**: nave agora move nas 4 direções (↑ ↓ ← → + WASD). Touch/mouse mantém controle horizontal + adiciona eixo Y (metade superior = sobe, inferior = desce)
- **Feedback de perda de vida**: flash vermelho na tela, nave pisca invulnerável por 1s, texto `'💥 -1 Vida!'` aparece centralizado, 3 vidas totais com contador visível no canto
- **Tela de resultado**: ao fim do minigame, overlay mostra resultado (vitória/derrota), vidas restantes, tempo, bônus ganho. Botão "Voltar ao tabuleiro" só fecha o overlay após clique. Bônus só é aplicado após confirmação
- **Fluxo do bot**: se a máquina cair no Buraco de Minhoca, overlay aparece com barra "🤖 Máquina está jogando..." e botão "⏭ Pular". Ao pular, resultado simulado é exibido por 2s e aplicado. Auto-resolve após 6s sem interação
- **Painel Debug**: seção Galáxia atualizada com botões: Gal C9, Gal C14 (perto do wormhole), Gal C15 🚪 (wormhole), 🎮 Abrir, ✅ Vencer, ❌ Perder, ↩️ Retornar. Todos os handlers refletem a nova casa 15

## [0.13.0-preview] - 2026-07-08

### Infraestrutura de Áudio — AUD-001

- **AudioManager** (`src/audio/AudioManager.js`): classe gerenciadora central (~218 linhas) que encapsula a Web Audio API. Gerencia `AudioContext` criado sob demanda (lazy), cadeia de ganho em cascata (`masterGain` → `musicGain` + `effectsGain`), reprodução de efeitos (`play`/`stop`), música em loop (`playMusic`/`stopMusic`), volumes independentes, mute e persistência automática via `localStorage` (chave `laraAudioConfig`)
- **Catálogo de sons** (`src/audio/sounds.js`): 16 chaves simbólicas com path e category (`'effects'` | `'music'`), cobrindo UI (3), dados (2), tabuleiro (5), quiz (3), recompensas (2) e música (1)
- **Singleton** (`src/audio/index.js`): instância única `audioManager` exportada para consumo em todo o jogo
- **Estrutura de pastas**: 7 diretórios criados em `src/assets/audio/` — `ui/`, `dice/`, `board/`, `quiz/`, `rewards/`, `music/` (vazios, aguardando arquivos .webm)
- **Integração com gameplay**: 21 chamadas de `audioManager.play()` adicionadas em 8 funções de `src/game.js` — cliques, dados, movimento, casas especiais, desafios, vitória
- **Documentação**: `docs/audio.md` com 11 seções (visão geral, arquitetura, API, integração, how-to, limitações, roadmap)
- **Degradação graciosa**: todo erro de áudio é silenciosamente ignorado — o jogo nunca quebra por falta de assets sonoros

## [0.12.0-preview] - 2026-07-08

### Sistema de Avatares e Tokens — UX-015

- **Galeria com 4 personagens oficiais**: Lara, Léo, Dino, Byte — cada um com asset próprio em `assets/avatars/` e `assets/tokens/`
- **initGalleryTokens()**: função executada no bootstrap que transforma cada `.emoji-btn` em um container `<span class="btn-emoji">` + `<img class="btn-img">`, carregando `assets/tokens/{avatar}.webp` com fallback visual para o emoji original
- **applyVisualFallback()**: mecanismo central de fallback — tenta carregar o `.webp`; se carrega (`onload`), oculta o emoji e exibe a imagem; se falha (`onerror`), oculta a imagem e exibe o emoji. Aplicado em: galeria de botões, barra de status (`#turn-emoji`/`#turn-img`), tokens no tabuleiro (`#lara`/`#lara-p2`), tela de sorteio inicial, tela de vitória
- **Avatar Preview**: cada player card ganhou preview circular (`.avatar-frame`, 108×108px) com `<span class="avatar-emoji">` + `<img class="avatar-img">`, exibindo o asset `assets/avatars/{avatarId}.webp` com `object-fit: contain` e fallback para emoji
- **Atualização de preview**: `updateAvatarPreview()` no clique do botão — altera emoji, nome e imagem do preview simultaneamente
- **Token no tabuleiro**: `.token-img` (absolute, inset 0, `object-fit: cover`, circular) sobreposto ao emoji, ativado via `renderBoardToken()` que carrega `assets/tokens/{player.tokenId}.webp`
- **Status panel**: nome do jogador movido para fora do container de 28px do visual (antes dentro, causando overflow)
- **Draw screen**: visual do jogador ampliado de 52px para 76px, `object-fit: cover` no container
- **`player.tokenId`**: novo campo no objeto `players[]`, populado via `data-token` do botão selecionado (e.g. `"lara"` para assets/tokens/lara.webp)
- **Cache-busting**: assets carregados sem cache-busting adicional — fallback para emoji nativo do SVG/emoji

### ART-010 — Reprocessamento de lara.webp

- **lara.webp (avatar)**: reprocessado em canvas 512×512, altura do asset ~86.9% do canvas (445px), centralizado horizontal e verticalmente
- **lara.webp (token)**: mesma especificação 512×512, altura ~86.9%, centralizado — garante cobertura total no `object-fit: cover` circular

### Seleção de Mundos v2 — UX-014

- **Painel remodelado**: mesmo visual da Hero Screen — fundo com 7 gradientes radiais + `menu-background.webp` (opacity 0.60) + shapes flutuantes + sparkles animados. Card central glass com `backdrop-filter: blur(24px)`, borda branca 3px, glow rosa
- **Subtítulo**: "Cada mundo guarda uma aventura diferente." abaixo do título "🌍 Escolha seu Mundo"
- **Cards maiores e com identidade**: border-radius 24px, padding 16px, hover com elevação -5px + glow colorido. Cada mundo recebe cor de borda via `data-world` — Floresta (verde #66bb6a), Dinossauros (âmbar #ffb300), Galáxia (roxo #b388ff), Oceanos (azul #64b5f6), Castelo (lilás #ce93d8)
- **Mundo Aleatório em destaque**: glow pulsante roxo (`random-glow` 3s), gradiente mágico, hover acelera para 1.5s
- **Mundos bloqueados elegantes**: mantêm identidade de cor com opacidade 0.75, sem grayscale, sem filter — parecem mundos futuros
- **Botão "← Menu Principal" premium**: gradiente pink-dourado (#e91e63 → #ff8f00), sombra 3D (0 4px 0 #880e4f), hover sobre -3px, active afunda 2px
- **Lara removida**: personagem permanece exclusiva da Hero Screen
- **Responsivo**: breakpoints ≤600px e ≤400px com grid adaptável, padding reduzido
- **Fallback**: `menu-background.webp` via `::before` (opacity 0.60); se asset não existir, gradientes do overlay mantêm a tela funcional

### Ilustrações Oficiais dos Mundos — ART-009

- **Container de ilustração**: cada card de mundo ganhou `.world-card-illustration` — área 96×96px (`≤600px: 76×76`, `≤400px: 64×64`) com flexbox centralizado
- **Estrutura img + emoji**: `<img class="world-card-img">` posicionado absolutamente sobre o `<span class="world-card-emoji">`. Quando o asset .webp não existe (agora), `onerror="this.style.display='none'"` oculta o img e o emoji permanece visível como fallback
- **6 assets previstos**: `floresta.webp`, `dinossauros.webp`, `galaxia.webp`, `oceanos.webp`, `castelo.webp`, `aleatorio.webp` em `src/assets/world-icons/`
- **Diretório criado**: `src/assets/world-icons/.gitkeep` para versionamento da estrutura
- **Atualização automática futura**: quando a ilustração for criada na pasta, o `<img>` carrega e substitui o emoji sem alteração de código

### Hero Screen — Tela Inicial com Estilo de Capa de Jogo (UX-013)

- **UX-010 — Hero Screen visual overhaul**: redesign completo do menu principal — fundo com 7 gradientes radiais, formas flutuantes abstratas animadas via CSS, logo com gradiente pink-dourado e `background-clip: text`, card central com gradiente rosado/creme/azulado e `backdrop-filter: blur(20px)`, botão "Jogo Rápido" com glow pulsante (`menu-glow-pulse`), badge "EM BREVE..." com `text-transform: uppercase`, footer com versão `v0.12.0-preview`, divisor decorativo gradiente
- **UX-011 — Lara character asset support**: elemento `<img class="menu-lara-hero">` adicionado ao HTML, estilizado com `max-width: 200px`, `max-height: 180px`, `margin-top: -60px` para sobreposição ao card, `filter: drop-shadow` com glow rosa, `pointer-events: none` para não interferir nos cliques. Estrutura `src/assets/ui/` criada com `.gitkeep`
- **UX-012 — Menu background image**: pseudo-elemento `.main-menu::before` com `url(assets/ui/menu-background.webp)` em `opacity: 0.35`, posicionado entre o fundo gradiente e o card, com fallback visual garantido (se a imagem não existir, o `::before` fica invisível e os gradientes permanecem intactos)
- **UX-013.1 — Refinamento visual**: card mais largo (520px), Lara maior (max-h 200px, margin-top -78px), logo mais compacto (gap 0px, emoji 4.2rem, h1 3.6rem), subtítulo com margem reduzida, background image opacity 0.42, botões com subtítulo descritivo ("Partida rápida e divertida" / "Novos mundos aguardam você!"), sparkles decorativos CSS
- **UX-013.2 — Refinamento visual forte**: card ainda mais largo (580px) com cores mais saturadas (0.88), borda 3px branca, glow rosa intensificado, Lara ampliada para 320px/280px com margin-top -130px (protrusão de 40px acima do card), background image opacity 0.50, Jogo Rápido com 420px de largura e glow pulse mais rápido (2.5s), Modo Aventura com opacidade 0.8 e badge "EM BREVE..." maior (padding 4px 16px, letter-spacing 1.5px), composição geral mais compacta com espaçamentos reduzidos
- **"Modo Carreira" renomeado para "Modo Aventura"** no HTML — apenas texto visível, o modo string interno `"carreira"` permanece inalterado
- **Decoração animada**: `.menu-sparkles` com dois pseudo-elementos `✦` flutuando suavemente (animation `sparkle-drift` 5s)
- **Responsivo**: breakpoints ≤600px e ≤400px ajustam Lara (160px/120px), card padding, fontes dos botões e tamanho do logo
- **Fallback de assets**: se `lara-hero.webp` não existir, o `<img>` colapsa sem quebrar layout; se `menu-background.webp` não existir, o `::before` fica invisível e os 7 gradientes de fundo permanecem visíveis

### Board Layout 2.0 — Layout Personalizado por Mundo
- **board.cells**: novo formato de layout para o board do WorldConfig — array `[{id, x, y}]` que substitui o mapa `positions` (`{pos: [x%, y%]}`), permitindo posicionamento individual e preciso de cada célula
- **Vale dos Dinossauros**: primeiro mundo a adotar `board.cells` — 20 células em 4 fileiras com curva orgânica em S, deslocado +7pp para direita para centralizar o tabuleiro no background
- **Fallback automático**: `getPosicoes()` normaliza `board.cells` para o formato de mapa esperado pelo restante do jogo; mundos existentes (Floresta Encantada) seguem usando `board.positions` inalterados
- **Engine estendida**: `WorldConfig.board.cells` documentado em `src/core/types.js`; `world-registry.js` valida `cells[]` quando presente; `game.js` consome ambos os formatos
- **Ajustes finos de posição**: múltiplas iterações de refinamento nas coordenadas do Vale dos Dinossauros até centralização ideal do tabuleiro

### path.webp — Infraestrutura para Textura de Caminho
- **ART-006**: CSS de `.path-line` preparado para exibir `path.webp` via `background-image` — `background-size: cover`, `background-position: center`, `background-repeat: no-repeat`
- **Seletores por mundo**: regras para `body[data-world="floresta-encantada"] .path-line` e `body[data-world="vale-dinossauros"] .path-line` com `background-image: url(...)`
- **Override de subworld**: submundos recebem `background-image: none` para não exibir a textura do mundo principal durante a navegação em áreas especiais
- **SVG stroke mantido como fallback**: o traço SVG original (5px, opacity ~0.25) permanece ativo como fallback visual enquanto os assets `.webp` não forem criados
- **ART-005 — Preparação do caminho**: stroke do SVG reduzido de 14px para 5px, opacity reduzido de sólido (1.0) para ~0.25, preparando o caminho para receber textura sem conflito visual

### Adicionado
- `src/core/types.js`: campo `cells` adicionado à typedef `BoardConfig` — `{id: number, x: number, y: number}[]`

### Alterado
- `src/game.js`: `getPosicoes()` verifica `board.cells` primeiro — se existir, converte para posições; senão, usa `board.positions` (fallback)
- `src/engine/world-registry.js`: validação de `WorldConfig.board` aceita `cells[]` como alternativa válida a `positions`
- `src/worlds/dinossauros/config.js`: `board.positions` substituído por `board.cells` com 20 células em 4 fileiras S-curve, deslocamento +7pp X
- `src/style.css`:
  - ART-005: `.path-line` stroke reduzido para 5px, opacity ~0.25, drop-shadow refinado
  - ART-006: `.path-line` com `background-size: cover / center / no-repeat`; seletores por mundo para `background-image: url(assets/worlds/.../path.webp)`; subworld override `background-image: none`

## [0.11.0-preview] - 2026-07-07

### Consolidação da Direção de Arte (Sprint ART)
- **UX-1.1 — Overhaul visual completo**: redesign ousado de todo o CSS com estilo cartoon, arredondado, colorido e com profundidade. Inclui: body com multi-radial gradient, células 98×64px com border-radius 20px e bottom shadow 6px, botões com shine pseudo-element e shadow 3D, overlays com backdrop-filter blur(6px), vitória com glow dourado animado e firework pseudo-elements, glass card no menu principal, scrollbar temática no histórico
- **ASSET-001 — Background ilustrado por mundo**: criada estrutura `src/assets/worlds/` e preparado CSS para aplicar `background.webp` apenas na área do tabuleiro (`#track-container`), com fallback de gradiente verde e overlay semitransparente para contraste. Aplicação no body foi descartada em favor da área do tabuleiro
- **ART-002 — Caminho temático (v1)**: infraestrutura para textura de caminho via SVG pattern (`path-texture-floresta`), com stroke sólido (opacity removido), fallback de cor sólida e preparação para futuros caminhos por mundo
- **ART-002 (v2) — Caminho sólido**: opacity removido de todos os paths (caminho 100% opaco), drop-shadow ajustado para compensar traço sem transparência, textura via pattern com fallback de cor
- **ART-003 — Background do Vale dos Dinossauros**: pasta `src/assets/worlds/dinossauros/` criada, CSS de background com overlay + `url(background.webp)` + gradiente arenoso fallback, pattern `path-texture-dinossauros` no HTML, e `stroke: url(#path-texture-dinossauros)` no CSS do caminho
- **Assets pipeline consolidada**: estrutura `src/assets/worlds/` com floresta/ e dinossauros/, cada um com `.gitkeep` para versionamento e suporte a `background.webp` + `path.webp`

### Adicionado
- `src/assets/worlds/floresta/.gitkeep` — placeholder para versionar estrutura de assets da Floresta
- `src/assets/worlds/dinossauros/.gitkeep` — placeholder para versionar estrutura de assets do Vale
- `src/index.html` — adicionados `<defs>` com SVG patterns (`path-texture`, `path-texture-floresta`, `path-texture-dinossauros`) para texturização do caminho

### Alterado
- `src/style.css`:
  - UX-1.1: redesign completo (2066 linhas) — multi-radial gradient no body, células maiores com sombra 3D, botões com shine, overlays com blur, glass card no menu, vitória com glow/firework, toques finais no tema floresta e dinossauros, responsivo refinado
  - ASSET-001: regra `body[data-world="floresta-encantada"] #track-container, #track-container.mundo-floresta` com background-image + overlay + fallback verde
  - ART-002: `#trail-path` ganhou `stroke: url(#path-texture)` com fallback sólido; floresta com `stroke: url(#path-texture-floresta)`; opacity removido de todos os paths (caminho sólido)
  - ART-003: regra `body[data-world="dinossauros"] #track-container:not(.mundo-floresta)` com background-image + overlay + fallback arenoso; `#trail-path` com `stroke: url(#path-texture-dinossauros)`; pattern adicionado no HTML
- `src/index.html`: adicionados patterns `path-texture` (default), `path-texture-floresta` e `path-texture-dinossauros` no SVG `<defs>`
- `src/assets/worlds/dinossauros/.gitkeep` — criado para versionar estrutura de assets do Vale
- README.md: seção "Identidade Visual" expandida com estrutura completa, decisões de UX e descobertas dos testes

### Notas Técnicas
- Background ilustrado aplicado apenas no `#track-container` (tabuleiro), não no body
- Fundo do body permanece com gradiente neutro (multi-radial UX-1.1)
- Fallback nativo do CSS: se `background.webp` ou `path.webp` não existirem, gradiente/cor sólida mantém o funcionamento
- SVG pattern com `<rect fill>` + `<image>` garante fallback sólido mesmo com imagem ausente
- Caminhos temáticos usam `stroke: url(#pattern-id)` com fallback de cor sólida na linha anterior
- Nenhuma engine, world config, game.js ou gameplay alterados — todas as mudanças são exclusivamente visuais (CSS + HTML)
- Estrutura preparada para expansão: novos mundos só precisam adicionar seus assets em `src/assets/worlds/<mundo>/` e criar patterns CSS correspondentes
- Backgrounds Floresta e Dinossauros seguem o mesmo padrão de 3 camadas (overlay + url + gradiente fallback)
- Decisão aprovada: cenário aplicado apenas no tabuleiro (nunca no body), centro livre para as casas, elementos visuais nas bordas

## [0.10.0-preview] - 2026-07-06

### Adicionado
- **Vale dos Dinossauros** — segundo mundo completo (`src/worlds/dinossauros/config.js`), com 20 casas, portal na casa 10, eventos temáticos de dinossauros
- **Caverna dos Fósseis** — segunda Área Especial (submundo), 8 casas, eventos próprios (desafio, move, extraTurn, worldExit com bônus +3)
- **Sprint A6.3**: Theme Engine em produção — `document.body.dataset.world` aplicado em `selectWorld()`, CSS temático para o Vale (gradiente quente, células em tons terra, decorações dino injetadas via JS). Floresta Encantada protegida com seletores `:not(.mundo-floresta)` onde necessário
- **Sprint A6.5**: Config `cavernaDosFosseis` + debug (botões "🦴 Entrar na Caverna", "Casa 3 desafio", "Casa 5 passagem", "Casa 8 saída")
- **Sprint A6.6 — Portal genérico**: `gameState.mundoAtual`/`entradaFloresta`/`entradaCaverna` substituídos por `activeSubworldId` e `subworldEntry`. Getters usam `getSubworldConfig()` com lookup em `subworldConfigs`. `eventsToSpecialCells` mapeia `shortcut`→`atalho` e `worldExit`→`saida-mundo` com `valor: ev.params.bonusCells`. ProcessSpecialCell "portal", "atalho" e "saida-mundo" leem bonus/entrada do WorldConfig
- **Portal do Vale** — adicionado em casa 10 com `targetWorldId: "caverna-dos-fosseis"`
- **Portal overlay dinâmico** — título e mensagem lidos do portal config
- **Subworld CSS class** — `theme.cssClass` aplicado no track-container ao entrar em submundo, removido ao sair
- **Cache-busting** atualizado para `?v=0.10.0-preview` (Nginx com `no-cache, must-revalidate`)

### Alterado
- `src/game.js`: Estado de subworld refatorado para `activeSubworldId` (string | null) e `subworldEntry` (map playerId→posição) — sem hardcoded "floresta" ou "dinossauros". `getPortalConfigForCell()` busca em `currentWorldConfig.portals`. Subworld configs importados de `./worlds/floresta/config.js` e `./worlds/dinossauros/config.js`. `eventsToSpecialCells` agora mapeia todos os tipos de evento que game.js entende
- `src/index.html`: Debug panel com botões da caverna separados por `<hr>`. Portal overlay dinâmico. world-indicator alterado para texto dinâmico
- `src/style.css`: `.debug-separator` adicionado. `.mundo-floresta` mantido para tema da Floresta
- `src/worlds/dinossauros/config.js`: Portal adicionado em casa 10 com `targetWorldId: "caverna-dos-fosseis"`. `cavernaDosFosseis` exportado com 8 casas e eventos próprios
- **Caverna dos Fósseis simplificada**: redistribuição de eventos para filosofia risco x recompensa — casas 4 e 6 viram normais (sem evento), casa 5 muda de `move -2` para `move -1`, casa 7 vira `worldExit` com bônus 0 (saída rápida), casa 8 mantém `worldExit +3` (saída completa). `cellIcons` atualizados: 🪨 (c4), 💀 (c6), ☠️ (c7), 🚪 (c8). Agora 5 eventos em 8 casas (vs 7 antes): 💎 Avance 1, 🦴 Desafio, 🪨 Volte 1, ☠️ Saída rápida, 🚪 Saída

### Notas Técnicas
- Engine totalmente genérica — nenhuma referência a "floresta" ou "dinossauros" em game.js
- Subworld exit bonus lido de `worldExit.params.bonusCells` — Floresta tem 3, Caverna tem 3
- `getSubworldConfig()` retorna null quando `activeSubworldId` é null
- Nenhum arquivo de engine (`src/engine/*`, `src/core/*`, `src/data/*`, `src/worlds/loader.js`) foi alterado
- Adicionar um novo mundo exige apenas: config + registrar em `subworldConfigs` + botões de debug em index.html

### Adicionado
- Sprint A5.1: engine em produção — WorldRegistry inicializado no bootstrap
- `game.js` migrado de script global para ES Module (`type="module"`)
- `src/game.js`: import de `WorldRegistry` do engine e `florestaEncantada` do config
- `src/game.js`: `WorldRegistry.init()` chamado no bootstrap com `florestaEncantada`
- `src/game.js`: `currentWorldConfig` populado via `WorldRegistry.get()` / `getDefault()`
- Cards do seletor de mundos agora populam descrição via WorldConfig
- Sprint A5.2: `getTotalCasas()`, `getPosicoes()`, `getIcones()` consomem `currentWorldConfig.board` com fallback
- `handleVictory()` e casos "atalho"/"saida-mundo" usam `currentWorldConfig.board.totalCells`
- Seletor de Mundos na tela inicial (6 cards: Floresta + 4 "Em breve" + Aleatório)
- `src/engine/event-processor.js` — processador de eventos de células (8 tipos built-in, handlers customizados, cascade)
- `src/engine/session-manager.js` — gerenciamento de sessão com validação e deepFreeze
- `src/engine/state-manager.js` — gerenciamento de estado do jogo (17 métodos, deepClone)
- `src/engine/world-registry.js` — registro de mundos (12 métodos, 4 classes de erro)
- `src/worlds/floresta/config.js` — primeiro WorldConfig (Floresta Encantada + Floresta Misteriosa)
- `src/core/constants.js`, `src/core/utils.js`, `src/core/types.js` — módulos fundamentais do motor
- `src/data/world-manifest.js` — manifesto de IDs de mundos
- `src/worlds/loader.js` — carregador de mundos (esqueleto com imports estáticos)
- Cache-busting via `?v=0.9.0-preview`

### Alterado
- `src/index.html` — `<script type="module">`, `data-world="floresta"` → `"floresta-encantada"`; adicionado seletor de mundos com 6 cards; cache-busting atualizado
- `src/style.css` — estilos do seletor de mundos (overlay, grid, cards, badges)
- `src/game.js` — removido IIFE em favor de ES Module; fluxo do seletor de mundos integrado (+35 linhas), `selectedWorldId` tracking; getters world-aware consomem config
- Documentação: README, CHANGELOG, docs/visao-geral, docs/arquitetura, docs/roadmap, docs/memorial-tecnico, docs/arquitetura-motor-de-mundos atualizados para v0.9.0

### Notas Técnicas
- ES Modules exigem servidor HTTP — `file://` é bloqueado por segurança do navegador
- Ambiente oficial de desenvolvimento: `cd src && npx serve .` (porta 3000)
- WorldRegistry.get("floresta-encantada") retorna o WorldConfig completo
- Fallbacks preservam compatibilidade se currentWorldConfig estiver ausente
- Engine modular coexiste com game.js original — nada foi desconectado
- EventProcessor revisado com 7 correções (ordem de handlers, cascade, callbacks)
- WorldConfig da Floresta extraído 1:1 do game.js — 20 células, 12 eventos, 1 portal
- Floresta Misteriosa (subworld) definida com eventos customizados (atalho, worldExit) pendentes de implementação no EventProcessor
- Nenhuma funcionalidade existente foi alterada

## [0.8.0] - 2026-07-05

### Adicionado
- Menu inicial (`#main-menu`) com título "🌍 Lara World" e dois botões
- Botão "⚡ Jogo Rápido" — inicia partida no modo Single Player com configuração simplificada
- Botão "🏆 Modo Carreira" — desabilitado visualmente com texto "(Em Breve)", reservado para futuro
- `modoJogo` — variável de estado que controla o modo atual ("rapido" | null)
- `showMainMenu()` — exibe a tela inicial e esconde o tabuleiro / painel
- `hideMainMenu()` — esconde o menu e prepara o tabuleiro para a partida
- `setupMenuEvents()` — registra eventos dos botões do menu principal
- Segundo botão na tela de vitória: "🏠 Voltar ao Menu" — retorna ao menu inicial
- `resetGameState()` — extraído de `reiniciarJogo()` para resetar estado sem exibir setup
- CSS `#main-menu`, `.menu-title`, `.menu-buttons`, `.menu-btn`, `.menu-btn.disabled`, `.menu-btn-icon`
- CSS `.victory-actions` com dois botões lado a lado no overlay de vitória
- Cache-busting via `?v=0.8.0` no HTML

### Alterado
- `init()` — agora chama `showMainMenu()` em vez de `showSetupScreen()` diretamente
- `setupModalEvents()` — adaptado para configurar `modoJogo = "rapido"` e ocultar seletor de modo 2P
- `startGame()` — usa `modoJogo` para determinar configuração (modo 1P forçado no Jogo Rápido)
- `handleVictory()` — adicionado botão "🏠 Voltar ao Menu" que chama `showMainMenu()`
- `reiniciarJogo()` — refatorado para usar `resetGameState()` e depois `showSetupScreen()`
- `configurarJogadores()` (antigo inline) — encapsulado em função separada para reúso
- Estrutura HTML reordenada: `#main-menu` antes de `#game-layout`

### Corrigido
- Vitória agora oferece duas saídas: "Jogar Novamente" (mesmo modo) ou "Voltar ao Menu"

## [0.7.0] - 2026-07-05

### Adicionado
- Seletor de modo no modal de configuração: botões de rádio "👥 2 Jogadores" (padrão) e "👤 1 Jogador"
- Modo 1 Jogador (Humano vs Máquina) — P2 é controlado automaticamente pela máquina
- `players[].isBot` — flag que marca um jogador como controlado pela máquina
- `resolveChallenge()` — bot responde desafios com 60% de chance de acerto (delay de 600ms)
- `resolvePortal()` — bot decide entrar no portal com 50% de chance (delay de 500ms)
- `scheduleBotTurnIfNeeded()` — agenda jogada automática do bot após 1 segundo
- `botTurnScheduled` — flag booleana para evitar agendamento duplicado
- `isSinglePlayer` — flag global que alterna entre modo 1P e 2P
- Tela de vitória (`#victory-overlay`) com confetes animados, fogos serpentina, troféu e botão "Jogar Novamente"
- `handleVictory()` — exibe overlay, desabilita dado, anima personagem vencedor
- CSS `.mode-selector`, `.mode-option`, `.mode-option.selected`, `#setup-screen.mode-1p .player2-card`
- Estilos do overlay de vitória (confetes, serpentina, conteúdo centralizado)

### Alterado
- `setupModalEvents()` — integrado seletor de modo com validação condicional (1P só exige P1)
- `startGame()` — no modo 1 jogador, P2 recebe nome "Máquina", emoji "🤖" e `isBot: true`
- `switchTurn()` — proteção `if (PLAYER_COUNT < 2) return` para modo 1 jogador
- `unlockTurn()` — agora chama `scheduleBotTurnIfNeeded()` para agendar jogada do bot
- `showSetupScreen()` / `hideSetupScreen()` — adaptado para usar `#setup-screen`
- HTML `#setup-screen` — adicionado seletor de modo, removido jQuery (agora JS puro)

### Corrigido
- Casa 5 (🐢 Volte 1 casa) na posição 1: ao voltar para posição 0, o código processava a casa como desafio, abrindo modal indevidamente — corrigido com guarda que impede cascata para casa especial após `voltar` para posição 0
- Botão "Jogar Dado" permanecia desabilitado após vitória — `handleVictory()` agora garante `elements.rollBtn.disabled = true` e reinício reabilita corretamente

## [0.6.0] - 2026-07-03

### Adicionado
- Portal da Floresta na casa 11 com modal de entrada (Entrar / Continuar)
- Mundo da Floresta: mini-trilha de 8 casas com coordenadas em formato de S
- Constantes `FLORESTA_TOTAL`, `florestaPosicoes`, `florestaIcones`, `florestaEspeciais`
- Funções getters world-aware: `getTotalCasas()`, `getPosicoes()`, `getIcones()`, `getCasasEspeciais()`
- `gameState.mundoAtual` — rastreia em qual mundo o jogador está ("principal" | "floresta")
- `gameState.entradaFloresta` — objeto `{1: null, 2: null}` para posição salva por jogador
- `gameState.entrouNoPortal` — flag para evitar reentrada no portal
- Renderização condicional: `renderizarTrilha()` / `renderSvgPath()` / `positionPlayerAt()` / `animatePlayerMovement()` usam getters world-aware
- Casas especiais da floresta: "desafio" (casa 3 e 7), "atalho" (casa 5), "saida-mundo" (casa 8)
- `processSpecialCell` cases "portal" e "saida-mundo" com transição entre mundos
- `jogarDado()` adaptado: ao completar floresta, retorna ao mundo principal com bônus
- CSS `.mundo-floresta` com fundo verde escuro, decorações temáticas (árvores, cogumelos, folhas)
- `#world-indicator` no header indicando mundo atual
- Modo debug: painel com 5 botões ativado por `?debug=1` na URL

### Alterado
- `renderizarTrilha()` — aceita parâmetro opcional `mundo` para renderizar mundo principal ou floresta
- `renderSvgPath()` — aceita parâmetro opcional `posicoes` para gerar caminho no mundo correto
- `positionPlayerAt()` — oculta sprite do outro jogador quando `mundoAtual === "floresta"`
- `switchTurn()` — não alterna turno quando `mundoAtual === "floresta"` (mesmo jogador continua)
- `jogarDado()` — ao final do turno na floresta, volta ao mundo principal com bônus e sem cascatear
- `reiniciarJogo()` — reseta `mundoAtual`, `entradaFloresta`, `entrouNoPortal`
- Casa 5 da floresta: de "avancar" para "atalho" (saída imediata com +2)
- Casas especiais da floresta estilizadas com nomes temáticos

### Corrigido
- `renderizarSvgPath` → `renderSvgPath` (ReferenceError nos cases portal e saída-mundo)
- `entradaFloresta` sendo resetado no bloco `if (extraTurn)` — movido para fora do bloco
- Falta de `switchTurn()` guard — adicionada verificação `mundoAtual !== "floresta"` antes de alternar
- Sprite do jogador não ativo visível na floresta — oculto via `positionPlayerAt()`

## [0.5.0] - 2026-07-03

### Adicionado
- Banco de questões organizado por 6 categorias (Matemática, Português, Animais, Espaço, Natureza, Dinossauros)
- 30 perguntas no total (5 por categoria)
- Função `sortearQuestao()` — sorteia índice aleatório com proteção contra repetição
- `gameState.questoesUsadas` (Set) — rastreia perguntas já sorteadas na partida
- `questoesDisponiveis[]` — array flat construído a partir do banco categorizado
- Reset automático: quando todas as 30 perguntas forem usadas, o Set é limpo e o ciclo recomeça

### Alterado
- `desafios[]` (array fixo) substituído por `bancoQuestoes{}` (objeto categorizado)
- `casasEspeciais` — campos `valor` removidos das casas de desafio (4, 7, 12, 16, 18)
- `processSpecialCell` case "desafio" — agora chama `sortearQuestao()` em vez de `desafios[info.valor]`

### Corrigido
- `reiniciarJogo()` — botão "Jogar Dado" permanecia desabilitado após vitória e reinício; agora é reabilitado com `elements.rollBtn.disabled = false`

## [0.4.0] - 2026-07-03

### Adicionado
- 5 casas de desafio educativo (casas 4, 7, 12, 16, 18)
- Modal de desafio com pergunta e 3 alternativas de múltipla escolha
- Função `showChallengeModal()` — exibe modal e retorna Promise com acerto/erro
- Array `desafios[]` com 5 perguntas temáticas
- Movimento pós-desafio: acertar = avançar 1 casa, errar = voltar 1 casa
- Bloqueio do dado durante desafio (via `gameState.isMoving`)
- Estilos visuais para casas de desafio (roxo) e modal de desafio
- Histórico registra "caiu em desafio", "acertou" e "errou"

### Alterado
- `casasEspeciais{}` expandido de 6 para 11 casas
- `processSpecialCell()` agora trata o tipo "desafio"

## [0.3.0] - 2026-07-03

### Adicionado
- Modal de configuração inicial (setup screen) antes da partida
- Campo de nome personalizado para Jogador 1 e Jogador 2
- Grade de emojis exclusiva para cada jogador (seleção de sprite)
- Botão "Iniciar Jogo" no modal para dar início à partida
- jQuery carregado no HTML para manipulação do DOM
- Funções `showSetupScreen()`, `hideSetupScreen()`, `startGame()`, `setupModalEvents()`
- `reiniciarJogo()` agora retorna ao modal de configuração em vez de resetar o tabuleiro diretamente

### Alterado
- `init()` modificado para exibir o modal e só carregar o tabuleiro após "Iniciar Jogo"
- Nomes dos jogadores agora são definidos via input do modal (fallback para "Jogador 1" / "Jogador 2")
- Emojis dos jogadores agora são definidos via seleção na grade (fallback para 🧒 / 👦)
- Fluxo de reinício alterado: modal → jogo → vitória → modal

## [0.2.0] - 2026-07-02

### Adicionado
- Multiplayer local para 2 jogadores
- Alternância automática de turnos
- Destaque visual do jogador ativo no painel
- Posições individuais para cada jogador
- Personagens lado a lado quando na mesma casa
- Histórico de jogadas
- Função `updateUI()` para sincronização do painel
- Estrutura de dados `players[]` preparada para expansão

### Alterado
- Refatoração do estado do jogo: `posicao` e `rodadasPerdidas` movidos para objeto de cada jogador
- Tabuleiro reposicionado com snake pattern (4 linhas × 5 colunas)
- Células redimensionadas para 88×56px com `transform: translate(-50%, -50%)`
- Caminho SVG suave (Catmull-Rom) substituindo linhas retas
- Personagem Lara como elemento genérico por jogador

### Removido
- Marcador "🏁 INÍCIO" do tabuleiro (casa 1 já indica início)
- Rotações CSS nas células (causavam sobreposição)
- Dependência de `elements.currentPosition` (substituído por posições por jogador)

## [0.1.0] - 2026-07-02

### Adicionado
- MVP inicial do Lara World
- Tabuleiro com 20 casas em grid 5×4
- Sistema de dado virtual (1-6)
- 6 casas especiais com efeitos:
  - Avance 2 casas (casa 3)
  - Volte 1 casa (casa 5)
  - Jogue novamente (casa 8)
  - Perde uma rodada (casa 10)
  - Volte ao início (casa 15)
  - Vitória (casa 20)
- Movimento básico do personagem
- Botão Jogar Dado e Reiniciar
- Mensagens de eventos do jogo
- Docker + Nginx (nginx:alpine)
- docker-compose.yml com porta 8080
- Documentação inicial (README, arquitetura, regras, roadmap)
