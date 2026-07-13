# Roadmap Lara World

### v0.26.0-preview — Versão Oficial Consolidada (Atual) ✅

- [x] Versão oficial que unifica todo o trabalho desde v0.17.0-preview
- [x] src/version.js, cache-busting e documentação sincronizados em v0.26.0-preview
- [x] Script scripts/check-version.mjs criado para auditoria automática
- [x] Duplicidade [0.17.0-preview] no CHANGELOG resolvida (hotfix realocado para [0.16.0-preview])
- [x] Versionamento inconsistente corrigido

### v0.17.0-preview — Correção de 3 Bugs ✅

- [x] Bug 1 — Vitória prematura ao sair de submundo (handleBoardLimitReached)
- [x] Bug 2 — Pergunta "Qual palavra tem 5 letras?" sem alternativa correta
- [x] Bug 3 — Mundo Aleatório sempre escolhia Floresta (getDefault → random)
- [x] validateQuestionBank() adicionada em src/data/questions.js
- [x] Versionamento: v0.17.0-preview, cache-busting atualizado
- [x] CHANGELOG, README, docs atualizados

### v0.16.0-preview — Visual da Galáxia Estelar + Sistema de Variantes de Tabuleiro ✅

- [x] Infraestrutura visual de background e path.webp para Galáxia Estelar (ART-011)
- [x] `src/version.js` criado com constante `APP_VERSION` centralizada
- [x] Cache-busting de CSS/JS unificado via `?v=v0.16.0-preview`
- [x] Versão da tela inicial sincronizada com `APP_VERSION` (via `game.js:init()`)
- [x] README, CHANGELOG, docs atualizados para v0.16.0-preview
- [x] Fluxo de versionamento documentado no AI_WORKFLOW.md

**Sistema de Variantes de Tabuleiro (Layouts):**
- [x] Arquitetura genérica `board.layouts` + `board.defaultLayout` no WorldConfig
- [x] Galáxia Estelar com 3 layouts: padrão, orbita, spiral (`src/worlds/galaxia/layouts.js`)
- [x] Selector UI automático (só aparece em mundos com 2+ layouts)
- [x] Troca de layout via comando `layout:{id}`
- [x] Persistência em `localStorage` por mundo
- [x] getActiveBoardLayout(), applyLayout(), renderLayoutSelector()
- [x] Integração Debug: renderDebugLayoutButtons()
- [x] Validação em world-registry.js
- [x] LayoutEntry typedef em types.js

### v0.15.0-preview — Troca Quântica + Result Card ✅

- [x] Casa 7 swap-positions
- [x] Result card do minigame
- [x] Correções de colisão e UX mobile

### v0.14.0-preview — Galáxia Estelar + MeteoroGame ✅

- [x] Mundo Galáxia Estelar completo (GAL-001)
- [x] Minigame MeteoroGame funcional
- [x] Integração com sistema de turnos e bônus

### v0.13.0-preview — Infraestrutura de Áudio ✅

- [x] Sistema de áudio modular (AUD-001)
- [x] Efeitos sonoros para UI, dado, tabuleiro, quiz, recompensas
- [x] Mecanismo de fallback silencioso

### Hero Screen Redesign — Tela Inicial com Logo Oficial ✅

- [x] Redesign completo da Hero Screen com logo oficial (`logo-lara-world.webp`)
- [x] Estrutura `.menu-brand` substitui antiga `.menu-logo` baseada em emoji
- [x] Ilustração Lara removida do card central (composição simplificada)
- [x] Classes CSS refatoradas (`.menu-brand-logo`, `.menu-brand-fallback`)
- [x] Fallback textual via `onerror` no logo
- [x] Responsivo com breakpoints ≤768px, ≤400px
- [x] Assets `logo-lara-world.webp`, `menu-background.webp`, `lara-hero.webp` existentes
- [x] Todos os 6 `world-icons/*.webp` implementados (floresta, dinossauros, galaxia, oceanos, castelo, aleatorio)

### v0.19.0-preview — Limite de Empates no Sorteio Inicial ✅

- [x] Contador de empates consecutivos (máx. 2)
- [x] 3º empate: desempate automático aleatório
- [x] Mensagens divertidas no desempate
- [x] Funciona em 2 jogadores e 1 jogador vs máquina
- [x] Dado da partida não alterado

### v0.18.0-preview — Revisão e Melhorias do Sistema de Perguntas — QST-001 ✅

**Banco de Perguntas:**
- [x] Extrair bancoQuestoes para `src/data/questions.js`
- [x] Expandir de 30 para 128 perguntas
- [x] Adicionar 9 categorias (Matemática, Português, Animais, Espaço, Natureza, Dinossauros, Lógica, Cores e Formas, Conhecimentos Gerais)
- [x] Campo `dificuldade` (facil, media, dificil)
- [x] Mapeamento temático por mundo (worldCategoryMap)
- [x] Funções `getIndicesPorMundo`, `getCategoriasPorMundo`, `categoryIndices`

**Seleção Temática:**
- [x] Floresta → Animais, Natureza, Cores e Formas, Lógica
- [x] Dinossauros → Dinossauros, Animais, Natureza, Matemática
- [x] Galáxia → Espaço, Lógica, Conhecimentos Gerais
- [x] Fallback geral se pool temático for insuficiente

**Algoritmo de Sorteio:**
- [x] Filtrar por mundo atual (activeSubworldId || selectedWorldId)
- [x] Evitar repetição na mesma partida (Set de índices)
- [x] Reinício automático quando pool esgota
- [x] Mesmo algoritmo para humano e bot

**Debug:**
- [x] Painel de auditoria com `?debug=1`
- [x] Botão "📚 Mostrar/Ocultar" no debug
- [x] Exibir total, usadas, mundo atual, categorias, dificuldade
- [x] Indicador visual de perguntas já usadas

### v0.12.0-preview — Board Layout 2.0 + path.webp Infrastructure + Hero Screen + Seleção v2 + Avatares/Tokens

**Board Layout 2.0:**
- Novo formato `board.cells` (`[{id, x, y}]`) para posicionamento individual de células por mundo, com fallback automático para `board.positions`
- **Vale dos Dinossauros recelularizado**: primeiro mundo a usar `board.cells` — 20 células em 4 fileiras S-curve, shift +7pp X para centralização
- Engine estendida: `WorldConfig.board.cells` documentado em types.js; world-registry valida cells[]; game.js normaliza ambos os formatos

**Caminhos Temáticos (ART-005/006):**
- **ART-005**: stroke do SVG reduzido de 14px → 5px, opacity ~0.25 — prepara traço para textura
- **ART-006**: CSS do `.path-line` com `background-image` para `path.webp`, seletores por mundo, override de subworld — infraestrutura completa para textura de caminho
- **Fallback ativo**: SVG stroke 5px mantido como fallback enquanto assets .webp não forem criados

**Hero Screen (UX-010 → UX-011 → UX-012 → UX-013):**
- **UX-010**: Overhaul CSS do Main Menu — 7 gradientes radiais, shapes flutuantes, logo gradiente pink-dourado, card translúcido com backdrop-filter, glow pulse, footer
- **UX-011**: Personagem Lara sobreposta ao card (max-w 200px, margin -60px para protrusão)
- **UX-012**: Background image (menu-background.webp) com opacity 0.50 via `::before`, fallback CSS garantido
- **UX-013.1/2**: Card 580px com 0.88 saturação e borda 3px, Lara 320px/280px com -130px margin, botões maiores com subtítulos e glow pulse 2.5s, badge "EM BREVE..." refinado, sparkles, responsivo ≤600px/≤400px
- Assets `src/assets/ui/` criados com `lara-hero.webp` e `menu-background.webp` (pendentes)

**Seleção de Mundos v2 (UX-014):**
- Painel remodelado no visual da Hero Screen — fundo gradiente + menu-background.webp + shapes flutuantes + sparkles
- Card central glass com `backdrop-filter: blur(24px)`, borda branca 3px, glow rosa
- Subtítulo "Cada mundo guarda uma aventura diferente."
- Cards com identidade por mundo (bordas coloridas via data-world)
- Mundo Aleatório em destaque (glow pulsante roxo)
- Mundos bloqueados elegantes (sem grayscale, com cor temática)
- Botão "← Menu Principal" premium (gradiente pink-dourado + sombra 3D)
- Lara removida — exclusiva da Hero Screen

**Ilustrações dos Mundos (ART-009):**
- Container 96×96px preparado em cada card para ilustração futura
- Fallback de emoji via `onerror` — quando asset existir, substitui automaticamente
- 6 assets previstos em `src/assets/world-icons/`: floresta.webp, dinossauros.webp, galaxia.webp, oceanos.webp, castelo.webp, aleatorio.webp
- Cache-busting permanece em `?v=0.12.0-preview` (sem alteração de código)

**Sistema de Avatares e Tokens (UX-015):**
- Galeria com 4 avatares oficiais: Lara, Léo, Dino, Byte
- `assets/avatars/` — 4 avatares oficiais para preview circular no setup (108×108px, object-fit: contain)
- `assets/tokens/` — 4 tokens oficiais para representação in-game (object-fit: cover circular)
- `initGalleryTokens()` — transforma cada botão da galeria em span+img com fallback visual
- `applyVisualFallback()` — mecanismo central de fallback (onload/onerror) usado em 6 contextos
- `player.tokenId` — novo campo para associar token ao jogador
- Status panel: nome movido para fora do container visual de 28px
- Draw screen: visual do jogador ampliado de 52px para 76px

**ART-010 — Reprocessamento de lara.webp:**
- lara.webp (avatar): canvas 512×512, altura ~86.9%, centralizado
- lara.webp (token): canvas 512×512, altura ~86.9%, centralizado — cobertura ideal em container circular

## Concluído

### v0.1.0
- Estrutura inicial do projeto
- Lógica do jogo (dado, movimento, casas especiais)
- Interface básica para 1 jogador
- Sistema de vitória e reinício
- Docker + Nginx

### v0.2.0
- Tabuleiro visual com trilha serpentina
- Caminho SVG suave conectando as casas
- Movimento animado casa por casa (180ms/passo)
- Personagens como elementos visuais independentes
- Painel lateral com dado, status, botões e histórico
- Casas especiais com animação de movimento extra
- Multiplayer local para 2 jogadores
- Alternância automática de turnos
- Destaque visual do jogador ativo
- Personagens lado a lado quando na mesma casa
- Animações CSS (dado bounce, pulse, celebração)
- Bloqueio de clique durante animação
- Design responsivo

### v0.3.0
- Modal de configuração inicial com nomes e sprites personalizáveis
- Grade de emojis exclusiva para cada jogador (seleção independente)
- Inicialização do jogo a partir do modal
- Reinício retorna ao modal de configuração

### v0.4.0
- 5 casas de desafio educativo (casas 4, 7, 12, 16, 18)
- Modal de desafio com pergunta e 3 alternativas
- Acerto = avança 1 casa | Erro = volta 1 casa
- Bloqueio do dado durante o desafio
- Movimento pós-desafio não cascateia (evita loops)

### v0.5.0
- Banco de questões organizado por 6 categorias (Matemática, Português, Animais, Espaço, Natureza, Dinossauros)
- 30 perguntas no total (5 por categoria)
- Sorteio aleatório de perguntas a cada desafio
- Sem repetição de perguntas na mesma partida (controle via Set)
- Reinício automático do banco quando todas as perguntas são usadas

### v0.6.0 — Mundo da Floresta e Sistema de Portais
- Portal da Floresta na casa 11 com modal de entrada
- Mundo da Floresta: mini-trilha de 8 casas com visuais temáticos
- Casas especiais da floresta: desafio, atalho (+2), saída (+3)
- Turno não alterna enquanto jogador está na floresta
- Posição de entrada salva por jogador (objeto `{1, 2}`)
- Modo debug ativado por `?debug=1` na URL

### v0.7.0 — Modo Single Player (Humano vs Máquina)
- Seletor de modo no modal de configuração (1P / 2P)
- Modo 1 Jogador: Humano vs Máquina com bot automático
- Bot responde desafios (60% acerto) e decide portal (50% chance)
- Tela de vitória com confetes animados e fogos serpentina
- Correção: casa 5 não cascateia para desafio na posição 1
- Correção: botão "Jogar Dado" reabilitado corretamente após vitória

### v0.8.0 — Menu Inicial e Interface Refinada
- Tela inicial (Main Menu) com título e botões "⚡ Jogo Rápido" / "🏆 Modo Carreira (Em Breve)"
- Modo Jogo Rápido: inicia partida single player com configuração simplificada
- Tela de vitória com dois botões: "🔁 Jogar Novamente" e "🏠 Voltar ao Menu"
- Variável `modoJogo` para controle do modo de jogo
- Função `resetGameState()` extraída para reúso
- Cache-busting via `?v=0.8.0`

### v0.9.0-preview — Seletor de Mundos e Motor Modular
- Seletor de Mundos na tela inicial (6 cards: Floresta + 4 "Em breve" + Aleatório)
- `SessionManager` — gerenciamento de sessão com validação
- `StateManager` — gerenciamento de estado do jogo (17 métodos)
- `WorldRegistry` — registro de mundos (12 métodos)
- `EventProcessor` — processador de eventos de células (8 tipos built-in)
- `src/worlds/floresta/config.js` — primeiro WorldConfig (Floresta Encantada + Floresta Misteriosa)
- Módulos core: `constants.js`, `utils.js`, `types.js`
- `world-manifest.js` e `loader.js` — infraestrutura de carregamento
- Cache-busting via `?v=0.9.0-preview`
- **Sprint A5.1** — Engine em produção (WorldRegistry init, currentWorldConfig populado, game.js como ES Module)
- **Sprint A5.2** — Board do WorldConfig consumido por getters do jogo

### v0.10.0-preview — Vale dos Dinossauros e Ecossistema Multi-Mundos
- **🦖 Vale dos Dinossauros** — segundo mundo completo com 20 casas, eventos temáticos e portal na casa 10
- **🦴 Caverna dos Fósseis** — segunda Área Especial (submundo), 8 casas, risco x recompensa: saída rápida sem bônus (c7) ou saída completa com +3 (c8)
- **Portal genérico** — `activeSubworldId` substitui `mundoAtual` hardcoded
- **Retorno parametrizado** — bônus lido do WorldConfig (Floresta +3, Caverna +3)
- **Theme Engine** — tema visual por mundo via `data-world` no body
- **Debug da Caverna** — botões específicos no painel `?debug=1`
- **Sprint A6.3** — Theme Manager em produção
- **Sprint A6.5** — Config e debug da Caverna dos Fósseis
- **Sprint A6.6** — Portal genérico sem hardcoded
- **Arquitetura consolidada** — dois mundos, duas áreas, zero alterações na engine
- Cache-busting via `?v=20260706`

### UX-014 — Seleção de Mundos v2 ✅
- Painel remodelado: fundo Hero Screen + glass + shapes flutuantes + sparkles
- Subtítulo discreto abaixo do título
- Cards com identidade por mundo (bordas coloridas via data-world)
- Mundo Aleatório com destaque especial (glow roxo pulsante)
- Mundos bloqueados elegantes (sem grayscale, com cor temática)
- Botão "← Menu Principal" premium (gradiente + sombra 3D)
- Lara removida (exclusiva da Hero Screen)

### ART-009 — Ilustrações Oficiais dos Mundos ✅
- Container 96×96px em cada card para ilustração futura
- Fallback de emoji via `onerror` + `display: none` no img
- 6 assets previstos: floresta, dinossauros, galaxia, oceanos, castelo, aleatorio
- Diretório `src/assets/world-icons/` criado

### UX-015 — Sistema de Avatares e Tokens ✅
- Galeria com 4 avatares oficiais: Lara, Léo, Dino, Byte
- `assets/avatars/` — preview circular no setup (108×108px, object-fit: contain)
- `assets/tokens/` — representação in-game (object-fit: cover circular)
- `initGalleryTokens()` — cada botão vira span+img com fallback visual
- `applyVisualFallback()` — fallback central usado em 6 contextos (galeria, status, tabuleiro, draw, vitória)
- `player.tokenId` — associado via `data-token` do botão selecionado
- `updateAvatarPreview()` — preview em tempo real no setup

### ART-010 — Reprocessamento de lara.webp ✅
- Avatar: canvas 512×512, 86.9% altura, centralizado
- Token: canvas 512×512, 86.9% altura, centralizado

### v0.16.0-preview — Visual da Galáxia Estelar ✅
- **Infraestrutura visual completa**: pasta `src/assets/worlds/galaxia/` criada com suporte a `background.webp` e `path.webp`
- **CSS do #track-container**: overlay + `url("assets/worlds/galaxia/background.webp")` + gradiente fallback escuro
- **Path.webp**: regra existente com fallback SVG stroke
- **Fallback garantido**: se assets não existirem, gradiente e SVG mantêm o visual funcional

### ART-011 — Background e Path da Galáxia ✅
- ✅ **Criado** `src/assets/worlds/galaxia/` com `.gitkeep`
- ✅ **CSS atualizado**: `body[data-world="galaxia-estelar"] #track-container` com 3 camadas (overlay + url + gradiente)
- ✅ **Documentação**: README, CHANGELOG, visão-geral, arquitetura, roadmap, memorial-técnico atualizados
- ✅ **Seletor usado**: `body[data-world="galaxia-estelar"] #track-container`

### v0.14.0-preview — Galáxia Estelar + Minigame do Buraco de Minhoca ✅
- **Mundo Galáxia**: terceiro mundo completo com 20 casas, textos enxutos seguindo padrão visual (ícone + descrição curta)
- **Buraco de Minhoca movido para casa 15**: casa especial `buraco-minhoca` removida da casa 10, adicionada na casa 15
- **Minigame MeteoroGame**: jogo interno com nave 4-dir (↑↓←→ + WASD), meteoros, 3 vidas, flash/invulnerabilidade, tela de resultado
- **Fluxo do Bot**: overlay com barra de progresso e botão "Pular", auto-resolve após 6s
- **Painel Debug**: seção Galáxia (C9, C14, C15🚪) + seção minigame (Abrir, Vencer, Perder, Retornar)

### A10 — Galáxia Estelar ✅
- ✅ **Criado** `worlds/galaxia/config.js` — terceiro mundo completo com layaway espacial
- ✅ **20 casas** com eventos espaciais temáticos (nomes de estrelas, casas especiais)
- ✅ **`board.cells`** utilizado para layout personalizado
- ✅ **Processo de adição de novo mundo validado** — Floresta → Dinossauros → Galáxia

### 🐉 Quinto Mundo — Castelo dos Dragões ✅

- [x] WorldConfig completo em `src/worlds/castelo/config.js`
- [x] Layout ascendente via `board.cells` (y: 90 → 18)
- [x] Tema visual roxo/lilás com gradiente escuro
- [x] 9 eventos (avance, desafio, volte, extraTurn, skipTurn, swap-positions, placeholder, vitória)
- [x] Registro no WorldRegistry e integração ao seletor de mundos
- [x] Integração ao sorteio do Mundo Aleatório
- [x] Identidade visual com CSS completo
- [x] Assets placeholder (`background.webp`)
- [x] Casa 12 reservada como `placeholder` para evolução futura

## Futuro

### 🎯 Próximas Prioridades

- **Assets de áudio .webm** — produzir/baixar todos os 16 sons do catálogo (atualmente todos pendentes)
- **Integração de música ambiente** — chamar `audioManager.playMusic('backgroundMusic')` em `game.js`
- **Integração de sons de modal** — conectar `modalOpen`/`modalClose` nas aberturas/fechamentos
- **Integração de treasure e gameOver** — conectar sons pendentes do catálogo
- ~~**Hero Screen v2** — reorganização completa da composição visual da tela inicial~~ ✅ **Concluído** — redesign entregue com logo oficial e identidade consolidada
- **Evolução dos cards dos mundos** — refinamento visual contínuo da seleção de mundos
- **Assets próprios das casas especiais** — substituir células CSS por assets visuais por tipo de casa
- **Ilustrações das áreas dos mundos** — backgrounds e caminhos para submundos (Floresta Misteriosa, Caverna dos Fósseis)
- **Assets da Galáxia** — criar `background.webp` e `path.webp` em `src/assets/worlds/galaxia/` (infraestrutura CSS pronta)
- **Sistema de conquistas** — medalhas e progressão do jogador
- **Modo Aventura** — campanha com progressão entre mundos
- **Animações da interface** — transições e micro-interações
- **Minigame exclusivo do Castelo dos Dragões** — evento especial para a casa reservada (casa 12)

### Assets do Reino dos Oceanos

- **Infraestrutura de diretório**: `src/assets/worlds/oceanos/` criado com `.gitkeep`, `background.webp` e `path.webp` (placeholders zero-byte)
- **CSS completo**: seletores `body[data-world="reino-oceanos"]` implementados para fundo, track-container, células, casas especiais, vitória e path-line
- **Ilustração do mundo**: `world-icons/oceanos.webp` asset pendente

### 🔊 Melhorias Futuras de Áudio

- **Músicas por mundo** — trilhas sonoras temáticas diferentes para cada mundo (Floresta, Dinossauros, futuros)
- **Preload de áudio** — carregar buffers na inicialização para evitar delay no primeiro play
- **Crossfade entre músicas** — transição suave ao trocar faixas
- **Tela de configuração de áudio** — sliders de volume e botão mute na UI do jogo
- **Sistema de prioridades** — sons importantes (vitória, dado) têm prioridade sobre sons secundários
- **Pool de efeitos** — reutilizar AudioBufferSourceNode para sons frequentes
- **Variações aleatórias** — múltiplas variações do mesmo som para evitar repetição (ex: 3 sons de passo diferentes)
- **Novas categorias de efeitos** — ambiência, passos, itens coletáveis, power-ups

### v0.11.0-preview — Evolução Visual (UX 2.0) ✅
- **UX-1.1** — Overhaul CSS completo (cartoon, arredondado, 3D, profundidade)
- **ASSET-001** — Sistema de backgrounds por mundo (estrutura + CSS)
- **ART-002** — Caminhos temáticos (infraestrutura SVG pattern, Floresta)
- **ART-002 v2** — Caminho sólido (opacity removido de todos os paths)
- **ART-003** — Background + caminho do Vale dos Dinossauros
- **ART-004** — Remoção dos elementos decorativos antigos do HTML
- **Estrutura `src/assets/worlds/`** com floresta/ e dinossauros/

## ART — Direção de Arte

Trilha de desenvolvimento focada exclusivamente na identidade visual do projeto.

| Etapa | Status | Descrição |
|-------|--------|-----------|
| **ART-001** | ✅ Concluído | Estrutura de assets — pastas por mundo, `.gitkeep`, organização inicial |
| **ART-002** | ✅ Concluído | Background Floresta Encantada + Caminho temático Floresta — CSS, SVG pattern, overlay, fallback |
| **ART-003** | ✅ Concluído | Background Vale dos Dinossauros + Caminho temático Dinossauros — CSS, SVG pattern, overlay, fallback |
| **ART-004** | ✅ Concluído | Remoção dos elementos decorativos antigos — emojis fixos do HTML removidos, CSS limpo |
| **ART-005** | ✅ Concluído | Refinamento do traço SVG — stroke 14px→5px, opacity ~0.25, preparação para path.webp |
| **ART-006** | ✅ Concluído | Infraestrutura path.webp — background-image no `.path-line`, seletores por mundo, subworld override |
| **ART-007** | 🔲 Pendente | Background Floresta Misteriosa — assets e CSS para o submundo da Floresta |
| **ART-008** | 🔲 Pendente | Background Caverna dos Fósseis — assets e CSS para o submundo do Vale |
| **ART-009** | ✅ Concluído | Ilustrações oficiais dos mundos — container 96×96px em cada card, fallback de emoji, 6 assets em `src/assets/world-icons/` |
| **ART-010** | ✅ Concluído | Reprocessamento de lara.webp — canvas 512×512, 86.9% altura para avatar e token |
| **ART-011** | 🔲 Pendente | Ícones próprios — substituir emojis por iconografia original do jogo |
| **ART-012** | ✅ Concluído | Personagens oficiais — Lara, Léo, Dino, Byte com avatares e tokens (UX-015) |
| **ART-013** | ✅ Concluído | Hero Screen background — `menu-background.webp` (99KB) criado e ativo |
| **ART-014** | ✅ Concluído | Lara character asset — `lara-hero.webp` (181KB) criado (não utilizado na Hero Screen atual) |
| **ART-015** | ✅ Concluído | Demais personagens — assets leo.webp, dino.webp, byte.webp criados |
| **ART-016** | ✅ Concluído | Logo oficial — `logo-lara-world.webp` (92KB) implementado na Hero Screen |
| **ART-017** | ✅ Concluído | Ilustrações dos mundos — 6 `world-icons/*.webp` criados (floresta, dinossauros, galaxia, oceanos, castelo, aleatorio) |

### A7 — Board Layout 2.0 e Refinamentos
- **Board Layout 2.0** — ✅ Concluído — `board.cells` implementado, Vale dos Dinossauros adotado
- Expandir `board.cells` para a Floresta Encantada (unificação do formato)
- Documentar guia de criação de layout para novos mundos

### A8 — Theme Engine Completa
- Temas visuais completos para todos os mundos atuais
- Decorações dinâmicas por configuração (não mais injetadas via JS)
- Transições suaves entre temas

### A9 — Question Engine
- Extrair bancoQuestoes para `data/questions/*.js`
- ChallengeSystem como módulo independente
- Categorias de perguntas reutilizáveis entre mundos

### A10 — Galáxia Estelar
- Criar `worlds/galaxia/config.js`
- Terceiro mundo completo com eventos espaciais
- Usar `board.cells` para layout personalizado
- Validar processo de adição de novo mundo
