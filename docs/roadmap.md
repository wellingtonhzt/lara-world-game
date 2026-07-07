# Roadmap Lara World

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

## Futuro

### v0.11.0-preview — Evolução Visual (UX 2.0)
- **UX-1.1** — Overhaul CSS completo (cartoon, arredondado, 3D, profundidade)
- **ASSET-001** — Sistema de backgrounds por mundo (estrutura + CSS)
- **ART-002** — Caminhos temáticos (infraestrutura SVG pattern)
- **Estrutura `src/assets/worlds/`** criada

## ART — Direção de Arte

Nova trilha de desenvolvimento focada exclusivamente na identidade visual do projeto.

| Etapa | Status | Descrição |
|-------|--------|-----------|
| **ART-001** | ✅ Concluído | Sistema de backgrounds por mundo — estrutura, CSS, overlay de contraste, fallback |
| **ART-002** | ⏳ Em andamento | Caminhos temáticos — textura no stroke do SVG, fallback sólido, preparado para expansão |
| **ART-003** | 🔲 Pendente | Casas ilustradas — substituir células CSS por assets visuais por tipo de casa |
| **ART-004** | 🔲 Pendente | HUD ilustrada — painel lateral, botões, dados e indicadores com assets próprios |
| **ART-005** | 🔲 Pendente | Logo oficial — identidade visual do título Lara World |
| **ART-006** | 🔲 Pendente | Personagens — sprites dos jogadores com design próprio (não apenas emojis) |
| **ART-007** | 🔲 Pendente | Ícones próprios — substituir emojis por iconografia original do jogo |
| **ART-008** | 🔲 Pendente | Animações — movimentos, transições e efeitos visuais refinados |

### A7 — Theme Engine Completa
- Temas visuais completos para todos os mundos atuais
- Decorações dinâmicas por configuração (não mais injetadas via JS)
- Transições suaves entre temas

### A8 — Question Engine
- Extrair bancoQuestoes para `data/questions/*.js`
- ChallengeSystem como módulo independente
- Categorias de perguntas reutilizáveis entre mundos

### A9 — Galáxia Estelar
- Criar `worlds/galaxia/config.js`
- Terceiro mundo completo com eventos espaciais
- Validar processo de adição de novo mundo
