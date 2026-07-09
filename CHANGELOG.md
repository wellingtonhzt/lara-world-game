# Changelog

## [0.16.0-preview] - 2026-07-09

### Visual da Galáxia Estelar — ART-011

- **Estrutura de assets criada**: `src/assets/worlds/galaxia/` com `.gitkeep`, preparada para receber `background.webp` e `path.webp`
- **Background personalizado**: CSS de `body[data-world="galaxia-estelar"] #track-container` atualizado para seguir o padrão Floresta/Dinossauros — overlay semitransparente + `url("assets/worlds/galaxia/background.webp")` + gradiente fallback escuro
- **Path.webp já suportado**: regra `body[data-world="galaxia-estelar"] .path-line` existente com URL para o asset e fallback SVG stroke
- **Fallback garantido**: se os assets .webp não existirem, gradiente e SVG mantêm o tabuleiro funcional e legível
- **Documentação**: README, CHANGELOG, visão-geral atualizados com a nova infraestrutura

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

- **Galeria dividida em duas seções**: "🧑 Avatares" (topo) com 4 personagens oficiais (Lara, Léo, Dino, Byte) e "😊 Emojis clássicos" (collapsível via `<details>`) com 19 emojis adicionais
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
