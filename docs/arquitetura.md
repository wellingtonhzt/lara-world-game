# Arquitetura do Lara World

## Stack Tecnológica

- **Frontend**: HTML5 + CSS3 + JavaScript Vanilla (sem frameworks)
- **Infraestrutura**: Docker + Nginx (alpine)
- **Hospedagem Futura**: Debian (Proxmox LXC)

## Estrutura de Diretórios

```
lara-world/
├── CHANGELOG.md         # Histórico de versões
├── README.md            # Documentação principal
├── docs/                # Documentação do projeto
│   ├── arquitetura.md
│   ├── arquitetura-motor-de-mundos.md
│   ├── regras-do-jogo.md
│   ├── roadmap.md
│   ├── visao-geral.md
│   ├── memorial-tecnico.md
│   └── AI_WORKFLOW.md
├── src/                 # Código-fonte do jogo
│   ├── index.html       # Página principal
│   ├── style.css        # Estilos do jogo
│   ├── game.js          # Lógica do jogo (ES Module)
│   ├── data/            # Dados estruturados do jogo
│   │   └── questions.js # Banco de perguntas (128 perguntas, 9 categorias)
│   ├── audio/           # Módulo de áudio
│   │   ├── AudioManager.js    # Gerenciador central (Web Audio API)
│   │   ├── sounds.js          # Catálogo de sons (chaves simbólicas)
│   │   └── index.js           # Instância singleton exportada
│   ├── minigames/       # Minigames internos
│   │   ├── engine/            # Motor de minigames
│   │   │   ├── minigame-host.js     # Host compartilhado (tabuleiro e arcade)
│   │   │   ├── minigame-registry.js # Registro de minigames
│   │   │   ├── minigame-result.js   # Normalização de resultados
│   │   │   ├── loader.js            # Imports de minigames (side-effect)
│   │   │   └── index.js             # Barrel re-exports
│   │   ├── meteoro/           # Minigame MeteoroGame (Buraco de Minhoca)
│   │   │   ├── MeteoroGame.js      # Classe principal do minigame (4-dir, meteoros, vidas)
│   │   │   ├── meteoroGame.css     # Estilos do jogo (flash, UI, resultado)
│   │   │   └── index.js            # Factory/export do minigame
│   │   ├── dino-runner/       # Minigame Dino Runner (Vale dos Dinossauros, casa 10)
│   │   │   ├── DinoRunnerGame.js   # Classe principal (Canvas, pulo, obstáculos, 30s, 3 fases)
│   │   │   ├── dino-runner.css     # Estilos do canvas
│   │   │   └── index.js            # Config e registro do minigame
│   │   ├── ataque-dragoes/    # Minigame Ataque dos Dragões (Castelo dos Dragões, casa 15)
│   │   │   ├── AtaqueDragoesGame.js # Classe principal (Canvas, dragões, castelo, 20s, 4 fases)
│   │   │   ├── ataque-dragoes.css   # Estilos do canvas
│   │   │   └── index.js             # Config e registro do minigame
│   │   ├── memoria-floresta/  # Minigame Jogo da Memória (Floresta, casa 11)
│   │   │   ├── MemoryGame.js       # Classe principal (DOM, cartas, cronômetro)
│   │   │   ├── memoryGame.css      # Estilos do tabuleiro de cartas
│   │   │   └── index.js            # Config e registro do minigame
│   │   └── ocean-match3/      # Minigame Ocean Match-3 (Oceanos)
│   │       ├── OceanMatch3.js      # Classe principal (Canvas, match-3, cronômetro)
│   │       ├── ocean-match3.css    # Estilos do canvas
│   │       └── index.js            # Config e registro do minigame
│   ├── arcade/            # Modo Arcade (jogar minigames avulsos)
│   │   ├── index.js             # Barrel re-exports de todos os módulos públicos
│   │   ├── arcade-controller.js # Lifecycle: enter/leave, guard de execução, launch com try/finally
│   │   ├── arcade-screen.js     # Renderização da galeria de cards, showError/hideError, setCardsEnabled
│   │   ├── arcade-card.js       # Card individual: createMinigameCard, updateCardStats, escapeHtml
│   │   ├── arcade-stats.js      # Persistência localStorage (schema v1), recordGame, safeResult
│   │   └── arcade.css           # Tema escuro, overlay z-index 1400, grid responsivo, .arcade-cards-disabled
│   ├── assets/          # Recursos visuais do jogo
│   │   ├── ui/          # Assets da Hero Screen (menu inicial)
│   │   │   ├── logo-lara-world.webp  # Logo oficial do Lara World — exibido na Hero Screen
│   │   │   ├── lara-hero.webp       # Ilustração da personagem Lara (criado, não utilizado na Hero Screen atual)
│   │   │   └── menu-background.webp # Fundo temático do menu
│   │   ├── avatars/     # Avatares oficiais (preview no setup)
│   │   │   ├── lara.webp            # Lara — protagonista
│   │   │   ├── leo.webp             # Léo — personagem oficial
│   │   │   ├── dino.webp            # Dino — personagem oficial
│   │   │   └── byte.webp            # Byte — personagem oficial
│   │   ├── tokens/      # Tokens dos personagens (in-game)
│   │   │   ├── lara.webp            # Token da Lara (circular, object-fit cover)
│   │   │   ├── leo.webp             # Token do Léo
│   │   │   ├── dino.webp            # Token do Dino
│   │   │   └── byte.webp            # Token do Byte
│   │   ├── audio/        # Assets de áudio (.webm)
│   │   │   ├── music/         # Músicas de fundo (loop)
│   │   │   ├── ui/            # Sons de interface (cliques, modais)
│   │   │   ├── dice/          # Sons de dados (rolar, resultado)
│   │   │   ├── board/         # Sons do tabuleiro (movimento, portais)
│   │   │   ├── quiz/          # Sons de desafios (perguntas, acerto/erro)
│   │   │   └── rewards/       # Sons de recompensa (vitória, game over)
│   │   ├── world-icons/  # Ilustrações oficiais dos mundos
│   │   │   ├── floresta.webp        # Floresta Encantada (pendente)
│   │   │   ├── dinossauros.webp     # Vale dos Dinossauros (pendente)
│   │   │   ├── galaxia.webp         # Galáxia Estelar (pendente)
│   │   │   ├── oceanos.webp         # Reino dos Oceanos (pendente)
│   │   │   ├── castelo.webp         # Castelo dos Dragões (pendente)
│   │   │   └── aleatorio.webp       # Mundo Aleatório (pendente)
│   │   └── worlds/      # Assets por mundo
│   │       ├── floresta/
│   │       │   ├── background.webp  # Background ilustrado do tabuleiro (pendente)
│   │       │   └── path.webp        # Textura do caminho (pendente)
│   │       ├── dinossauros/
│   │       │   ├── background.webp  # Background ilustrado do tabuleiro (pendente)
│   │       │   └── path.webp        # Textura do caminho (pendente)
│   │       ├── galaxia/
│   │       │   ├── background.webp  # Background ilustrado do tabuleiro (pendente)
│   │       │   └── path.webp        # Textura do caminho (pendente)
│   │       └── oceanos/
│   │           ├── background.webp  # Background ilustrado do tabuleiro (pendente)
│   │           └── path.webp        # Textura do caminho (pendente)
│   ├── core/            # Módulos fundamentais do motor
│   │   ├── constants.js # Constantes do motor
│   │   ├── types.js     # Tipos JSDoc
│   │   └── utils.js     # Utilitários
│   ├── data/
│   │   └── world-manifest.js  # Manifesto de IDs de mundos
│   ├── engine/          # Módulos do motor de mundos
│   │   ├── event-processor.js  # Processador de eventos
│   │   ├── session-manager.js  # Gerenciamento de sessão
│   │   ├── state-manager.js    # Gerenciamento de estado
│   │   └── world-registry.js   # Registro de mundos
│   └── worlds/          # Configurações de mundos
│       ├── loader.js    # Carregador de mundos
│       ├── floresta/
│       │   └── config.js  # WorldConfig Floresta Encantada
│       ├── dinossauros/
│       │   └── config.js  # WorldConfig Vale dos Dinossauros (sem Caverna dos Fósseis — substituída pelo Dino Runner)
│       ├── galaxia/
│       │   ├── config.js  # WorldConfig Galáxia Estelar
│       │   └── layouts.js # Layouts do tabuleiro: padrão, orbita, spiral
│       ├── oceanos/
│       │   └── config.js  # WorldConfig Reino dos Oceanos
│       └── castelo/
│           └── config.js  # WorldConfig Castelo dos Dragões
├── docker/
│   └── nginx.conf       # Configuração do Nginx
├── Dockerfile           # Build da imagem Docker
└── docker-compose.yml   # Orquestração Docker
```

> Nota: a pasta `src/assets/` foi criada na v0.11.0-preview para iniciar a fase de identidade visual. A subpasta `worlds/` abriga assets por mundo (`background.webp`, `path.webp`), atualmente com floresta/, dinossauros/, galaxia/, oceanos/ e castelo/. Cada mundo possui seu próprio background e textura de caminho, com fallback CSS garantido se o asset não existir. A Galáxia Estelar recebeu sua infraestrutura visual na v0.16.0-preview (ART-011). A infraestrutura do `path.webp` foi preparada na v0.12.0-preview (background-image no `.path-line`, seletores por mundo). A subpasta `ui/` foi criada na UX-013 para abrigar assets da Hero Screen (`lara-hero.webp`, `menu-background.webp`), posteriormente expandida na v0.25.0-preview com `logo-lara-world.webp` (logo oficial). Todos os 3 assets existem atualmente com fallback CSS/textual garantido. A subpasta `world-icons/` foi criada na UX-014/ART-009 para abrigar as ilustrações oficiais dos mundos (6 assets), com container 96×96px e fallback de emoji — atualmente todos os 6 assets existem e são funcionalmente carregados. As subpastas `avatars/` e `tokens/` foram criadas na UX-015/ART-010 para abrigar os assets de personagens oficiais — `avatars/` para preview circular no setup (108×108px, `object-fit: contain`) e `tokens/` para representação in-game (62×62px circular, `object-fit: cover`), ambos com fallback para emoji. A subpasta `audio/` foi criada na AUD-001 (v0.13.0-preview) para abrigar assets de áudio (.webm), com subpastas por categoria: `ui/`, `dice/`, `board/`, `quiz/`, `rewards/`, `music/`. Consulte [docs/audio.md](./audio.md) para detalhes completos.

## Arquitetura do Frontend

### index.html

Estrutura semântica dividida em:

- **Main Menu** (`#main-menu`):
  - Container centralizado com `z-index: 2000`, exibido ao carregar o jogo
  - Fundo com 7 gradientes radiais + shapes flutuantes animados + `menu-background.webp` (opacity 0.50) + sparkles decorativos
  - Card central translúcido (`.menu-content`) com gradiente rosado/creme/azulado, `backdrop-filter: blur(24px)`, borda branca 3px e glow rosa
  - Logo oficial (`.menu-brand`) com `<img class="menu-brand-logo" src="assets/ui/logo-lara-world.webp">` + `<span class="menu-brand-fallback">` como fallback textual — substitui a antiga estrutura `.menu-logo` com emoji 🌍 + gradiente
  - Ilustração Lara removida do card central (antigo `.menu-lara-hero`) — composição simplificada
  - Três botões: "⚡ Jogo Rápido" (ativo, glow pulsante), "🎮 Modo Arcade" (novo) e "🏆 Modo Aventura" (desabilitado, badge "EM BREVE...")
  - Footer com versão lida de `APP_VERSION` (src/version.js)
  - Escondido quando uma partida é iniciada; reexibido via "Voltar ao Menu"
- **Setup Modal** (`#setup-screen`):
  - Overlay fixo com `z-index: 1000`, exibido após clicar em "Jogo Rápido"
  - Card do Jogador 1 e Jogador 2, cada um com:
    - `.avatar-preview`: preview circular 108×108px (`.avatar-frame`) com `<span class="avatar-emoji">` + `<img class="avatar-img">` para o asset `assets/avatars/{id}.webp` e `.avatar-player-name`
    - Campo de nome (`<input>`) e label "Personagem:"
    - Grade "🧑 Avatares" (`.avatar-grid`) com 4 botões oficiais: Lara (`🧒`), Léo (`🧑`), Dino (`🦖`), Byte (`💻`)
    - Grade de 4 personagens oficiais: Lara, Léo, Dino, Byte (todos com assets .webp + fallback emoji)
    - Cada botão (`.emoji-btn`) possui `data-emoji`, `data-avatar` e `data-token`; no bootstrap, `initGalleryTokens()` transforma cada botão em span + img com fallback visual para `assets/tokens/{avatar}.webp`
  - Botão **"Iniciar Jogo"** — esconde o modal e renderiza o tabuleiro
- **Victory Overlay** (`#victory-overlay`):
  - Overlay fixo com confetes animados (`.confetti-piece`) e fogos serpentina (`.serpentine`)
  - Título "🏆 Vitória!", mensagem personalizada com nome do vencedor
  - Container `.victory-actions` com dois botões: "🔁 Jogar Novamente" (dispara `reiniciarJogo()`) e "🏠 Voltar ao Menu" (dispara `showMainMenu()`)
- **Portal Modal** (`#portal-overlay`):
  - Overlay fixo com `z-index: 800`, exibido ao cair em uma casa de portal
  - Título e mensagem dinâmicos, lidos do portal config do mundo atual
  - Botões "Entrar" e "Continuar"
- **Arcade Screen** (`#arcade-screen`, classe `.arcade-screen`):
  - Overlay fullscreen com `z-index: 1400` (abaixo de minigame-overlay e main-menu, acima do tabuleiro)
  - Tema escuro com fundo `#1a1a2e`, header, grid de cards (`.arcade-cards`) e footer com botão "← Menu Principal"
  - Cada card (`.arcade-card`) exibe: ícone do minigame, título, descrição, duração, taxa de vitória, partidas jogadas
  - Cards ficam visualmente desabilitados (`.arcade-cards-disabled`) quando um minigame está em execução
  - Erros são exibidos em `#arcade-error` com texto amigável
  - Inicializado via `initArcadeScreen(onSelect)` que renderiza cards dinamicamente a partir de `listMinigames()`
  - Controlado por `enterArcadeMode()` / `leaveArcadeMode()` / `showArcadeScreen()` / `hideArcadeScreen()`
- **Challenge Modal** (`#challenge-overlay`):
  - Overlay fixo com `z-index: 500`, exibido durante o jogo
  - Título "Desafio!", pergunta (`#challenge-question`) e opções (`#challenge-options`)
  - Botões de alternativa criados dinamicamente via JS
- **Header**: Título com emoji decorativo, `#world-indicator` mostrando mundo/área atual (texto dinâmico)
- **World Selector Overlay** (`#world-selector`):
  - Overlay exibido entre o menu e o setup
  - Fundo com 7 gradientes radiais + `menu-background.webp` (opacity 0.60) + shapes flutuantes + sparkles (mesmo visual da Hero Screen)
  - Card central glass com gradiente rosado/creme/azulado, `backdrop-filter: blur(24px)`, borda 3px, glow rosa
  - Subtítulo "Cada mundo guarda uma aventura diferente."
  - Grid com 6 cards: 🌳 Floresta, 🦖 Dinossauros, 3 futuros (🔒), 🎲 Aleatório
  - Cards com identidade por mundo (bordas coloridas via data-world) e container 96×96px para ilustrações futuras
  - Botão "← Menu Principal" premium (gradiente pink-dourado + sombra 3D)
- **Board Area** (esquerda):
  - `#track-container`: container com gradiente de céu/grama (ou background temático por mundo), decorações (nuvens, árvores, flores, dinossauros, floresta)
  - SVG `#trail-path`: caminho suave que conecta as casas (Catmull-Rom spline)
  - `#track`: container das células `.casa` com posicionamento absoluto (20 no principal, 8 na área especial)
  - `#lara` e `#lara-p2`: personagens posicionados dinamicamente (apenas o ativo na área especial)
  - `.layout-selector`: barra horizontal com botões `icon + name` para troca de layout; oculto via `.hidden` se o mundo tiver < 2 layouts
  - Tema visual aplicado via `data-world` no `<body>`, com background temático opcional no `#track-container` (ASSET-001)
- **Panel Area** (direita):
  - `#dice-display`: dado virtual com emoji
  - Status: indicador de turno e posições de ambos os jogadores
  - Botões: Jogar Dado e Reiniciar
  - `#history`: histórico cronológico de jogadas
- **Debug Panel** (`#debug-panel`):
  - Exibido apenas quando `?debug=1` na URL
  - 5 botões: Casa 11, Entrar na Floresta, Casa 5 (Atalho), Casa 8 (Saída), Voltar ao Principal
  - Seção Galáxia: botões de layout (Padrão, Órbita, Espiral), C9, C14, C15🚪
  - Seção Minigame: 🎮 Abrir, ✅ Vencer, ❌ Perder, ↩️ Retornar
  - Posicionado no canto inferior esquerdo com `z-index: 999`

### style.css

- **Layout**: Flexbox com `board-area` (flex: 1) e `panel-area` (240px fixos)
- **Setup Modal** (`#setup-overlay`): `position: fixed`, `inset: 0`, `z-index: 1000`, `background: rgba(0,0,0,0.5)`, `display: flex` centralizado
- **Player Cards** (`.player-card`): fundo branco com borda arredondada, padding interno, sombra suave. Destaque visual (borda dourada) para o card ativo
- **Emoji Grid** (`.emoji-grid`): `display: flex` com `flex-wrap: wrap`, gaps entre os itens. Cada emoji (`.emoji-option`): 48×48px, cursor pointer, borda transparente. Selecionado: borda azul com fundo claro
- **Tabuleiro**: `#track-container` com `position: relative` e gradiente de fundo
- **Células** (`.casa`): `position: absolute` com `transform: translate(-50%,-50%)` para centralização. Cada casa recebe `left` e `top` em percentual via JS
- **Caminho SVG**: `#trail-path` com `stroke-width: 5` (ART-005), opacity ~0.25, `background-image` preparado para path.webp com seletores por mundo (ART-006), SVG stroke como fallback ativo
- **Personagens**: círculos brancos com borda rosa (Lara) ou azul (Amigo), `z-index: 20`, 58×58px
- **Casa especial**: cores por `data-position` (3 amarela, 4 roxa desafio, 5 rosa, 7 roxa desafio, 8 laranja, 10 roxa, 12 roxa desafio, 15 vermelha, 16 roxa desafio, 18 roxa desafio, 20 verde com glow)
- **Animações**: `pulse` (movimento), `bounce` (dado), `celebrar` (vitória)
- **Responsivo**: `@media (max-width: 840px)` com empilhamento vertical, células 64×46px

### game.js

Padrão **ES Module** com imports estáticos. Consome WorldConfigs dos mundos registrados e mantém estado de jogo global.

#### Organização do Código

```
constantes / configuração
  ├── WORLD_CONFIGS       → { florestaEncantada, valeDinossauros, galaxiaEstelar, reinoOceanos, casteloDosDragoes } — registrados no WorldRegistry
  ├── currentWorldConfig  → WorldConfig ativo (selecionado ou default)
  ├── selectedWorldId     → string | null (ID do mundo escolhido no seletor)
  ├── subworldConfigs     → {} — lookup de áreas especiais (vazio no momento)
  ├── PLAYER_COUNT (2)
  ├── players[]           → array de objetos {id, name, emoji, posicao, rodadasPerdidas, element, isBot, tokenId}
  ├── gameState           → {currentPlayerIndex, jogoAtivo, jogoFinalizado, isMoving, questoesUsadas,
  │                         activeSubworldId, subworldEntry, entrouNoPortal}
  ├── modoJogo            → string | null ("rapido" no Jogo Rápido, null no menu)
  ├── isSinglePlayer      → boolean global
  ├── botTurnScheduled    → boolean
  ├── casasEspeciais[]    → mapa de configuração do mundo principal (12 casas)
  ├── boardPositions{}    → coordenadas percentuais do mundo principal (fallback se board.positions não existir)
  ├── icons[]             → emoji por casa no principal
  └── Importado de `./data/questions.js`:
       ├── bancoQuestoes{}         → banco categorizado (9 categorias, 128 perguntas)
       ├── questoesDisponiveis[]   → flat pool do banco
       ├── categoryIndices{}       → categoria → índices no flat pool
       ├── worldCategoryMap{}      → mundo → categorias temáticas
       ├── getIndicesPorMundo(id)  → retorna índices temáticos ou null (fallback geral)
       ├── getCategoriasPorMundo(id) → retorna categorias do mundo
       └── validateQuestionBank()   → percorre todo o banco reportando perguntas com resposta ausente ou fora das opções

Getters World-Aware
  ├── getTotalCasas()      → currentWorldConfig.board.totalCells ou TOTAL_CASAS (fallback)
  ├── getPosicoes()        → Se board.layouts existir, usa `getActiveBoardLayout().cells` convertido para mapa; senão, board.cells (se existir) ou board.positions ou boardPositions
  ├── getIcones()          → currentWorldConfig.board.cellIcons ou icons
  ├── getCasasEspeciais()  → eventsToSpecialCells(currentWorldConfig.events) ou casasEspeciais
  ├── getSubworldConfig()  → subworldConfigs[activeSubworldId] ou null
  └── getActiveBoardLayout() → se currentWorldConfig.board.layouts existir, retorna o layout ativo (persistido em localStorage e validado contra defaults); senão, null

Getters de Área Especial
  ├── getPortalConfigForCell(pos) → busca em currentWorldConfig.portals[pos] ou null
  └── eventsToSpecialCells(events) → converte eventos do WorldConfig para formato das casas especiais

Player Helpers
  ├── getCurrentPlayer()   → retorna o jogador ativo
  ├── getPlayerElement(p)  → retorna o elemento DOM do jogador
  ├── switchTurn()         → alterna currentPlayerIndex (bloqueado se activeSubworldId !== null)
  ├── updateUI()           → atualiza indicador de turno e posições (aplica fallback visual com token)
  ├── renderBoardToken(idx) → carrega token asset no tabuleiro para o jogador
  └── applyVisualFallback(emojiEl, imgEl, emoji, imgSrc) → carrega img com fallback para emoji (usada em UI, tabuleiro, draw, vitória, galeria)

SVG Path / Board
  ├── renderSvgPath(posicoes?) → gera curva Catmull-Rom no SVG (usa getPosicoes() por padrão)
  ├── renderizarTrilha()      → cria células <div> no DOM (usa getTotalCasas())
  ├── applyLayout(layoutId)   → troca layout ativo: persiste em localStorage, re-renderiza SVG path e reposiciona jogadores
  └── renderLayoutSelector()  → se currentWorldConfig.board.layouts tiver 2+ entradas, cria botões icon+nome no `.layout-selector` container; oculto via classe `.hidden` se < 2 layouts

Posicionamento
  └── positionPlayerAt(n, player?) → posiciona personagem sobre a casa
       com offset (±12×, ±8×) se ambos jogadores estiverem na mesma casa
       oculta sprite não ativo quando activeSubworldId !== null

Animação
  └── animatePlayerMovement(from, to) → move player casa a casa (180ms)

Dado
  ├── getDadoEmoji(valor)  → retorna emoji do dado
  └── animateDice(valor)   → animação bounce + loop

Histórico
  ├── addHistory(texto, tipo)
  └── clearHistory()

Limite de Submundo
  └── handleBoardLimitReached() → quando jogador atinge limite do submundo por avanço/desafio:
       ├── Lê entrada do jogador + 2 de bônus
       ├── Limpa activeSubworldId e subworldEntry
       ├── Re-renderiza trilha principal
       ├── Verifica vitória no mundo principal
       └── Retorna false (encerra processamento)

Casas Especiais
  └── processSpecialCell(pos) → aplica efeitos com animação
       ├── "avancar" (casa 3) → move +n, cascateia; se activeSubworldId e limite, chama handleBoardLimitReached()
       ├── "voltar" (casa 5) → move -n, não cascateia
       ├── "desafio" → sortearQuestao(), abre modal, move ±1, não cascateia; se activeSubworldId e limite, chama handleBoardLimitReached()
        ├── "dino-runner" → launchDinoRunner(), vitória +3 casas, derrota 0
        ├── "portal" → consulta getPortalConfigForCell(), exibe modal, salva posição, define activeSubworldId
       ├── "atalho" (área especial) → volta ao principal com +bonusCells, não cascateia
       ├── "saida-mundo" (área especial) → volta ao principal com +bonusCells, não cascateia
       ├── "jogar-novamente" (casa 8) → retorna true (extra turn)
       ├── "extraTurn" → retorna true
       ├── "perde-rodada" (casa 10) → incrementa contador
       ├── "voltar-inicio" (casa 15) → move para 0
       ├── "move" → executado via delta/target
       └── "vitoria" (casa 20) → handleVictory()

Troca de Layout
  └── Comando `layout:{id}` (processado no switch de comandos especiais, l.1692-1704)
       ├── Chama applyLayout(layoutId) que persiste no localStorage e re-renderiza SVG
       └── Botões de layout (renderLayoutSelector) e debug (renderDebugLayoutButtons) usam este comando

Sorteio de Perguntas (temático por mundo)
  ├── sortearQuestao() → filtra por mundo (activeSubworldId || selectedWorldId)
  ├── Pool temático via getIndicesPorMundo() → se <5 itens, fallback geral
  ├── gameState.questoesUsadas (Set) → rastreia índices já sorteados (global)
  ├── Remove usados do pool → se pool vazio, limpa Set e recomeça
  ├── Bot (60% acerto) e humano usam o mesmo sortearQuestao()
  └── Mundo sem mapeamento → usa banco geral (128 perguntas)

Main Menu
  ├── showMainMenu() → exibe menu inicial, esconde tabuleiro/painel/victory, chama leaveArcadeMode()
  ├── hideMainMenu() → esconde menu, prepara tabuleiro
  └── setupMenuEvents() → registra clique em "⚡ Jogo Rápido", "🎮 Modo Arcade" e "🏆 Modo Carreira"

Modo Arcade
  ├── initArcadeController(showMainMenu) → injeta callback de saída
  ├── initArcadeScreen(onSelect) → renderiza cards da galeria
  ├── enterArcadeMode() → exibe galeria (chamado pelo listener do btn-arcade)
  ├── leaveArcadeMode() → oculta galeria (chamado em showMainMenu e exitArcadeToMenu)
  ├── launchArcadeMinigame(id) → abre minigame via MinigameHost(context: 'arcade'), registra stats
  ├── exitArcadeToMenu() → leaveArcadeMode() + onExit()
  ├── arcadeBackBtn → listener no #arcade-back-btn, chama exitArcadeToMenu()
  └── modoJogo = "arcade" → valor de modoJogo para o Arcade

Seletor de Mundos
  ├── showWorldSelector() → exibe grid de 6 cards (5 mundos disponíveis + 1 aleatório)
  ├── hideWorldSelector() → esconde seletor
  └── selectWorld(id) → currentWorldConfig = WorldRegistry.get(id) || (random + get), aplica data-world
  └── "random" → currentWorldConfig = random(w => w.type === 'main'), sorteia entre mundos principais

Bot AI
  ├── resolveChallenge(desafio) → se for bot, responde com 60% acerto (delay 600ms); senão, abre modal
  ├── resolvePortal() → se for bot, decide entrar com 50% chance (delay 500ms); senão, abre modal
  └── scheduleBotTurnIfNeeded() → agenda jogada do bot após 1s, com guarda botTurnScheduled

Vitória
  └── handleVictory() → overlay de vitória com confetes, desativa jogo, exibe dois botões

Turno Principal
  └── jogarDado() → função assíncrona principal

Modo Debug
  ├── initDebugMode() → ativado por ?debug=1, painel com botões para teste de portais, áreas especiais e layouts
  └── renderDebugLayoutButtons() → botões de troca rápida de layout na seção Galáxia do debug

Gerenciamento de Estado
  ├── resetGameState() → reseta estado (posições, rodadasPerdidas, activeSubworldId, subworldEntry,
  │                       entrouNoPortal, questoesUsadas, jogoAtivo, jogoFinalizado)
  └── reiniciarJogo() → chama resetGameState(), depois showSetupScreen()

Setup Screen
  ├── showSetupScreen() → exibe modal, popula grade de emojis, foca P1
  ├── hideSetupScreen() → esconde modal
  ├── setupModalEvents() → registra eventos de clique nas grades e botão
  ├── startGame() → lê nomes/emojis/tokenId dos inputs, inicia partida
  ├── prepareAndDraw() → lê nomes/emojis/tokenId, inicia sequência de sorteio
  └── updateAvatarPreview(idx, emoji, name, avatarId) → atualiza preview do avatar

Challenge Modal
  └── showChallengeModal(desafio) → exibe pergunta/opções, retorna Promise<boolean>

Sorteio Inicial
  ├── showDrawScreen() → exibe overlay com nomes, emojis/tokens, dados
  ├── startDrawSequence() → orquestra rolagem dos dois jogadores
  │   ├── waitForPlayerRoll(idx) → aguarda clique em "🎲 Rolar", retorna valor 1-6
  │   ├── autoBotRoll(idx) → modo 1P: rolagem automática do bot após 800ms
  │   ├── animateDrawDice(idx, valor) → anima dado (12 frames, 60ms cada)
  │   ├── Empate: re-rola (máx. 2 empates consecutivos)
  │   ├── 3º empate: desempate automático aleatório com mensagem divertida
  │   └── Maior valor vence → winnerIndex 0 ou 1
  ├── continueAfterDraw() → define gameState.currentPlayerIndex, inicia partida
  └── drawState = { rolls: [null, null], drawWinnerIndex: null }

Inicialização
  ├── initGalleryTokens() → transforma emoji-btn em span+img com fallback visual
  └── init() → initGalleryTokens(), WorldRegistry.init([florestaEncantada, valeDinossauros, galaxiaEstelar, reinoOceanos, casteloDosDragoes]), chama showMainMenu()
```

#### Sistema de Movimentação

O movimento é feito por `animatePlayerMovement(from, to)`:
1. Gera array de posições intermediárias (passo 1, sentido crescente ou decrescente)
2. Itera com `for...of` + `await delay(180)` para pausa entre passos
3. Em cada iteração chama `positionPlayerAt(pos)` que:
   - Obtém o `getBoundingClientRect()` da célula alvo
   - Calcula coordenadas do personagem centralizado na célula
   - Aplica offset se outro jogador estiver na mesma casa
   - Aplica classe `animar-lara-pos` para efeito pulse
4. Ao final, atualiza `player.posicao`

O bloqueio de clique durante movimento é feito pela flag `gameState.isMoving`, que é setada como `true` no início de `jogarDado()` e liberada em `unlockTurn()`. O mesmo bloqueio protege o modal de desafio — enquanto o jogador responde, `isMoving` permanece `true` e o botão "Jogar Dado" fica desabilitado.

#### Controle de Turnos

- `gameState.currentPlayerIndex` (0 ou 1) indica o jogador ativo
- `switchTurn()` alterna o índice: `(currentPlayerIndex + 1) % PLAYER_COUNT`
- **Bloqueio na área especial**: a função só alterna se `activeSubworldId === null`, garantindo que o mesmo jogador complete a área especial sem interrupção
- Chamada em três pontos de `jogarDado()`:
  - Após rodada perdida (skip automático)
  - Ao final do turno normal (sem extra turn)
- **Não** é chamada em caso de "jogue novamente" (casa 8)
- `updateUI()` sincroniza o painel com o jogador ativo e atualiza `#world-indicator`

#### Gerenciamento de Estado

Cada jogador mantém seu próprio estado:
```javascript
{ id, name, emoji, posicao, rodadasPerdidas, element, isBot }
```

O estado compartilhado do jogo:
```javascript
{ currentPlayerIndex, jogoAtivo, jogoFinalizado, isMoving, questoesUsadas,
  activeSubworldId, subworldEntry, entrouNoPortal }
```

Além do estado dos jogadores, o módulo possui duas variáveis globais:
```javascript
let isSinglePlayer = false;   // true quando modo 1 jogador está ativo
let botTurnScheduled = false; // true quando um turno de bot já foi agendado
```

- `activeSubworldId`: string | null — ID do submundo ativo ou null se no mundo principal
- `subworldEntry`: `{1: number | null, 2: number | null}` — posição de entrada salva por jogador na área especial
- `entrouNoPortal`: boolean — evita reentrada no portal durante o mesmo turno

## Fluxo do Jogo

```
Início (DOMContentLoaded)
  ↓
Menu Inicial (showMainMenu)
  ├── "⚡ Jogo Rápido" → setupModalEvents() configura modoJogo = "rapido", esconde menu
  ├── "🎮 Modo Arcade" → modoJogo = "arcade", enterArcadeMode(), exibe galeria
  └── "🏆 Modo Carreira" → desabilitado (Em Breve)
  ↓
Seletor de Mundos (showWorldSelector) — apenas Jogo Rápido
  ├── 🌳 Floresta Encantada → selectedWorldId = "floresta-encantada"
  ├── 🦖 Vale dos Dinossauros → selectedWorldId = "vale-dinossauros"
  ├── 🐉 Castelo dos Dragões → selectedWorldId = "castelo-dragoes"
  └── 🎲 Aleatório → selectedWorldId = "random"
  ↓
Modal de Configuração (showSetupScreen)
  ├── Card do Jogador 1 → nome + sprite (modo 1P forçado no Jogo Rápido)
  └── Clique "Iniciar Jogo"
  ↓
startGame() → esconde modal, renderiza tabuleiro, inicia partida
  ↓
Indicador mostra jogador ativo
  ↓
Jogador clica "Jogar Dado"
  ├── Se isMoving → ignora (bloqueio)
  ├── Se rodadasPerdidas > 0 → decrementa, switch turn, encerra
  └── Segue:
  ↓
Anima dado (1-6) com bounce
  ↓
Anima personagem andando casa por casa (180ms/casa)
  ↓
Caiu em casa especial?
  ├── Avançar (3) → anima movimento extra, cascateia
  ├── Desafio (4,7,12,16,18 + áreas especiais) → abre modal, move ±1, não cascateia
  ├── Portal → consulta getPortalConfigForCell(), exibe modal, salva posição, transporta para área especial
  ├── Voltar (5) → anima movimento reverso
  ├── Jogar novamente / extraTurn → mantém turno ativo
  ├── Perde rodada (10) → incrementa contador
  ├── Voltar início (15) → anima até casa 0
  ├── Atalho (área especial) → volta ao principal com +bonusCells, não cascateia
  ├── Saída da área especial → volta ao principal com +bonusCells, não cascateia
  └── Vitória (20) → celebração, fim de jogo
  ↓
Caiu em casa normal?
  └── switchTurn, updateUI, unlockTurn
      └── Se jogador atual for bot → scheduleBotTurnIfNeeded() agenda jogada em 1s
```

### Fluxo do Bot (Modo 1 Jogador)

```
Fim do turno humano
  ↓
switchTurn → currentPlayerIndex = 1
  ↓
unlockTurn → scheduleBotTurnIfNeeded()
  ├── Verifica: getCurrentPlayer().isBot && jogoAtivo && !botTurnScheduled?
  ├── Sim → botTurnScheduled = true, setTimeout(1000ms)
  │         └── Após 1s → botTurnScheduled = false, chama jogarDado()
  │               ├── Bot tira dado, move, processa casas especiais
  │               ├── Se cair em desafio → resolveChallenge() — 60% acerto (600ms delay)
  │               ├── Se cair em portal → resolvePortal() — 50% entrar (500ms delay)
  │               └── Ao final → switchTurn + unlockTurn (agenda próximo turno humano)
  └── Não → aguarda clique humano
```

### Fluxo do Modo Arcade

```
Menu Inicial (showMainMenu)
  ↓
Clique "🎮 Modo Arcade" → modoJogo = "arcade"
  ↓
enterArcadeMode()
  ├── setCardsEnabled(true), hideError(), refreshArcadeCards()
  └── showArcadeScreen() → exibe galeria de cards
  ↓
Galeria de Minigames (arcade-screen)
  ├── Cada card: nome, ícone, descrição, duração, taxa de vitória, partidas
  ├── Cards dinamicamente renderizados via listMinigames() do registry
  └── Clique em card → launchArcadeMinigame(minigameId)
  ↓
launchArcadeMinigame(minigameId)
  ├── Guard: se _isRunning → retorna null (impede duplicatas)
  ├── _isRunning = true, setCardsEnabled(false)
  ├── hideArcadeScreen()
  ├── launchMinigameHost(minigameId, { isBot: false, playerName: 'Jogador', context: 'arcade' })
  │   ├── Card final: "Voltar ao Arcade" / "Voltando ao Modo Arcade em Xs..."
  │   ├── Bonus de casas: NÃO exibido (context === 'arcade')
  │   └── Retorna resultado normalizado
  ├── recordGame(minigameId, result, durationMs) → atualiza stats em localStorage
  └── finally: _isRunning = true → false, setCardsEnabled(true), refreshArcadeCards(), showArcadeScreen()
  ↓
Voltar à galeria (estatísticas atualizadas nos cards)
```

### MinigameHost — Parâmetro `context`

O `launchMinigameHost()` aceita campo opcional `context`:

| context | Texto de retorno | Texto do botão | Bonus no card | Destino ao retornar |
|---------|-----------------|----------------|---------------|---------------------|
| `'board'` (padrão) | "Voltando ao tabuleiro em Xs..." | "Voltar ao tabuleiro" | Exibido (+N casas) | game.js (aplica boardDelta) |
| `'arcade'` | "Voltando ao Modo Arcade em Xs..." | "Voltar ao Arcade" | Oculto | arcade-controller.js (volta à galeria) |

Chamadas atuais do tabuleiro em `game.js` não informam `context`, usando o padrão `'board'`. Apenas o Arcade passa `context: 'arcade'` explicitamente.

## Motor de Mundos (v0.12.0-preview)

A partir da v0.9.0-preview, o Lara World iniciou a **Fase de Mundos** com a criação de um motor modular. Na Sprint A5.1 o motor entrou em produção: o WorldRegistry é inicializado no bootstrap e o `currentWorldConfig` é populado na seleção do mundo. O game.js foi migrado para ES Module e consome `currentWorldConfig.board` diretamente (Sprint A5.2). Na v0.10.0-preview, o motor foi consolidado com a integração do segundo mundo e do sistema de portais genérico. Na v0.12.0-preview, o **Board Layout 2.0** estendeu o contrato `BoardConfig` com o formato `cells[]`, permitindo posicionamento individual por célula. Na entrega dos layouts (v0.22.0-preview), o contrato foi novamente estendido com `board.layouts` e `board.defaultLayout`, permitindo que um mundo declare múltiplas variantes de posicionamento sem alterar a engine.

### Módulos do Engine

| Módulo | Arquivo | Responsabilidade |
|--------|---------|-----------------|
| **WorldRegistry** | `src/engine/world-registry.js` | Registro e validação de mundos, 12 métodos, 4 classes de erro |
| **SessionManager** | `src/engine/session-manager.js` | Criação/validação de sessão, deepFreeze, 5 métodos |
| **StateManager** | `src/engine/state-manager.js` | Gerenciamento de estado do jogo, deepClone, 17 métodos |
| **EventProcessor** | `src/engine/event-processor.js` | Processamento de eventos de células, 8 tipos built-in, cascade |

### Módulos de Apoio

| Módulo | Arquivo | Responsabilidade |
|--------|---------|-----------------|
| **Core** | `src/core/constants.js`, `utils.js`, `types.js` | Constantes, funções auxiliares, tipos JSDoc |
| **World Manifest** | `src/data/world-manifest.js` | Array WORLD_IDS com todos os IDs de mundos (comentados) |
| **Loader** | `src/worlds/loader.js` | Imports estáticos dos WorldConfigs |

### WorldConfigs

| Mundo | Arquivo | Células | Eventos | Portais | Layout |
|-------|---------|---------|---------|---------|--------|
| **🌳 Floresta Encantada** (principal) | `src/worlds/floresta/config.js` | 20 | 12 | 0 | `board.positions` (original) |
| **🦖 Vale dos Dinossauros** (principal) | `src/worlds/dinossauros/config.js` | 20 | 12 | 1 (Dino Runner) | `board.cells` (S-curve) |
| **🌌 Galáxia Estelar** (principal) | `src/worlds/galaxia/config.js` | 20 | 9 | — | `board.layouts` (3: padrão/orbita/spiral) |
| **🌊 Reino dos Oceanos** (principal) | `src/worlds/oceanos/config.js` | 20 | 9 | — | `board.positions` |
| **🐉 Castelo dos Dragões** (principal) | `src/worlds/castelo/config.js` | 20 | 9 | — | `board.cells` (ascendente) |

### Padrão Visual de Ícones (v0.29.0-preview)

Regra oficial para ícones de casas em todos os mundos:

**Casas especiais** — usam ícones funcionais exclusivos:
| Ícone | Ação |
|-------|------|
| ❓ | Desafio |
| ⏩ | Avançar |
| ⏪ | Voltar |
| 🎲 | Jogue de novo |
| ⏸️ | Pule a vez |
| 🔄 | Troque de lugar |
| 👑 | Chegada |
| 🧩 | Memória (Floresta) |
| 🏃 | Dino Runner (Dinossauros) |
| 🚀 | Buraco de Minhoca (Galáxia) |
| 🎯 | Match-3 (Oceanos) |
| 🐉 | Dragões (Castelo) |

**Casas normais** — usam ícones temáticos únicos por mundo:
- Nenhum ícone funcional pode aparecer em casa normal
- Nenhum ícone normal pode repetir dentro do mesmo mundo
- Ícones devem combinar com o tema do mundo
- Casas normais não possuem texto descritivo

**Textos de eventos** — máx. 3 palavras: "Desafio", "Avance N", "Volte N", "Jogue de novo", "Pule a vez", "Troque de lugar", "Chegada", "Memória", "Dino Runner", "Buraco de Minhoca", "Match-3", "Dragões"

### Seletor de Mundos (UX-014 v2)

O seletor de mundos é uma tela intermediária entre o clique em "⚡ Jogo Rápido" e o modal de configuração. Exibe 6 cards em grid com visual remodelado (5 mundos disponíveis + 1 aleatório):

- **Painel glass** — mesmo estilo da Hero Screen: gradiente rosado/creme/azulado, `backdrop-filter: blur(24px)`, borda branca 3px, glow rosa
- **Fundo temático** — 7 gradientes radiais + `menu-background.webp` (opacity 0.60) + shapes flutuantes + sparkles
- **🌳 Floresta Encantada** — selecionável, borda verde
- **🦖 Vale dos Dinossauros** — selecionável, borda âmbar
- **🌌 Galáxia Estelar** — selecionável, borda roxa
- **🌊 Reino dos Oceanos** — selecionável, borda azul
- **🐉 Castelo dos Dragões** — selecionável, borda lilás
- **🎲 Mundo Aleatório** — destaque visual com glow pulsante roxo

Cada card possui container `.world-card-illustration` de 96×96px preparado para futuras ilustrações, com fallback de emoji via `onerror`.

A variável `selectedWorldId` é definida no escopo do game.js. `WorldRegistry.init()` é chamado no bootstrap com ambos os mundos, `selectWorld()` consulta o registry via `WorldRegistry.get(id)` e popula `currentWorldConfig`. Os cards do seletor exibem descrição e nome vindos do WorldConfig.

### Sistema de Submundo Genérico

O estado de submundo agora é genérico (`activeSubworldId`, `subworldEntry`) em vez de hardcoded para "floresta". Os dados de cada submundo (config, eventos, portal, retorno) são lidos dos WorldConfigs, permitindo adicionar novas áreas especiais sem alterar `game.js`.

## Docker

O Dockerfile usa **nginx:alpine** para servir os arquivos estáticos da pasta `src/`. O `docker-compose.yml` expõe a porta **8080** mapeando para a porta 80 do container. A configuração do Nginx está em `docker/nginx.conf`.

### Política de cache (preview)

A política de cache é definida no Nginx e serve como origem para Cloudflare:

| Tipo | Extensões | Cache-Control |
|---|---|---|
| HTML | `.html`, `/` | `no-store, no-cache, must-revalidate, max-age=0` |
| Código | `.js`, `.mjs`, `.css` | `no-cache, must-revalidate, max-age=0` |
| Dados | `.json`, `.webmanifest`, `.map` | `no-cache, must-revalidate, max-age=0` |
| Mídia | `.webp`, `.png`, `.jpg`, `.svg`, `.webm`, `.mp3`, `.woff2`, etc. | `public, max-age=86400` |

Não se usa `immutable` durante a fase preview, pois os assets são substituídos mantendo o mesmo nome. O `?v=` no index.html atua como cache-busting adicional para CSS e JS.
