# Roadmap Lara World

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
- Galeria dividida em duas seções: Avatares (lara, leo, dino, byte) e Emojis clássicos (collapsível)
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
- Galeria dividida em Avatares (Lara, Léo, Dino, Byte) + Emojis clássicos (collapsível)
- `assets/avatars/` — preview circular no setup (108×108px, object-fit: contain)
- `assets/tokens/` — representação in-game (object-fit: cover circular)
- `initGalleryTokens()` — cada botão vira span+img com fallback visual
- `applyVisualFallback()` — fallback central usado em 6 contextos (galeria, status, tabuleiro, draw, vitória)
- `player.tokenId` — associado via `data-token` do botão selecionado
- `updateAvatarPreview()` — preview em tempo real no setup

### ART-010 — Reprocessamento de lara.webp ✅
- Avatar: canvas 512×512, 86.9% altura, centralizado
- Token: canvas 512×512, 86.9% altura, centralizado

## Futuro

### 🎯 Próximas Prioridades

- **Hero Screen v2** — reorganização completa da composição visual da tela inicial
- **Evolução dos cards dos mundos** — refinamento visual contínuo da seleção de mundos
- **Assets próprios das casas especiais** — substituir células CSS por assets visuais por tipo de casa
- **Ilustrações das áreas dos mundos** — backgrounds e caminhos para submundos (Floresta Misteriosa, Caverna dos Fósseis)
- **Sistema de conquistas** — medalhas e progressão do jogador
- **Modo Aventura** — campanha com progressão entre mundos
- **Animações da interface** — transições e micro-interações

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
| **ART-013** | 🔲 Pendente | Hero Screen background — criar `menu-background.webp` asset |
| **ART-014** | 🔲 Pendente | Lara character asset — criar `lara-hero.webp` ilustração |
| **ART-015** | 🔲 Pendente | Demais personagens — criar assets leo.webp, dino.webp, byte.webp |

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
