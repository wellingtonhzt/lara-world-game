# Visão Geral do Lara World

## O que é?

Lara World é um jogo de trilha infantil multiplayer para navegador, onde os jogadores percorrem um caminho de 20 casas até a linha de chegada. Controlado por um dado virtual, o jogo possui casas especiais que aceleram ou dificultam o progresso, e suporta 2 jogadores no mesmo dispositivo com alternância automática de turnos.

## Público-alvo

Crianças em idade pré-escolar e escolar (3 a 10 anos), mas divertido para todas as idades. O modo multiplayer é ideal para irmãos, amigos ou pais e filhos jogarem juntos.

## Plataforma

Navegador web (Chrome, Firefox, Edge, Safari). Sem necessidade de instalação ou cadastro.

## Conceito do Jogo

O tabuleiro é uma trilha serpentina com 20 casas posicionadas em snake pattern (4 linhas × 5 colunas). Um caminho SVG suave conecta as casas, criando uma trilha visual que guia os jogadores do início (canto superior esquerdo) até a chegada (canto inferior esquerdo). Cada casa exibe um ícone temático, seu número e, quando especial, uma descrição do efeito.

## Principais Funcionalidades

### v0.34.0-preview (Atual) — Tela de Vitória Premium ✅

- **Celebração premium**: card creme, borda dourada, ribbon rosa, coroa, confetes finitos e avatar oficial do vencedor
- **Resumo da partida**: duração, total de lançamentos e mundo, coletados apenas durante a sessão atual
- **Mensagens por contexto**: textos positivos para vitória humana, vitória da máquina e modo com dois jogadores
- **Entrada rápida**: sequência visual de aproximadamente 650 ms, sem atrasar as ações
- **Acessibilidade**: diálogo modal, anúncio do vencedor, ciclo e restauração de foco, contraste e movimento reduzido
- **Responsividade**: estatísticas e botões se reorganizam em celulares e telas baixas

### v0.33.0-preview — Board Alive ✅

- **Movimento vivo**: destaque exclusivo em cada casa percorrida e glow curto no destino
- **Feedback do personagem e dado**: pouso com bounce suave e impacto ao revelar o resultado
- **Casas especiais**: desafio, portal, minigame e chegada têm respiração visual discreta
- **Turno e progresso**: jogador ativo destacado e barras com easing bidirecional
- **Ambiente por configuração**: folhas, estrelas, bolhas, poeira e brasas declaradas em `theme.ambientEffect`
- **Performance**: CSS animations, até dez partículas por tema e suporte a movimento reduzido

### v0.32.0-preview — Eventos e Narração Visual ✅

- **Narração centralizada**: overlay informa dado, deslocamento, eventos especiais, desafios, minigames e turnos
- **Fila sequencial**: somente uma mensagem aparece por vez; chamadas retornam Promise e podem ser aguardadas pelo fluxo
- **Integração com HUD**: toda narração atualiza “Último Evento”, sem eliminar o histórico interno
- **Sincronização segura**: reset, menu e vitória limpam mensagens e timers pendentes
- **Acessibilidade**: `aria-live`, contraste, mensagens curtas, responsividade e movimento reduzido

### v0.31.0-preview — Sobre & Tutorial ✅

- **Sobre o Lara World**: tela com informações do jogo, recursos atuais, em desenvolvimento e créditos — acessível pelo botão "ℹ️ Sobre" na tela inicial
- **Como Jogar**: tutorial interativo com 7 passos de onboarding, indicador de progresso, navegação por teclado e mouse. Overlay glass card, persistência em localStorage, não abre automaticamente
- **Modularização**: módulos separados em `src/about/` e `src/tutorial/` com arquitetura barrel, seguindo o padrão do Arcade
- **Botões secundários**: "📖 Como Jogar" e "ℹ️ Sobre" abaixo dos botões primários no menu inicial

### v0.30.0-preview — Modo Arcade ✅

- **Modo Arcade**: novo modo acessível pelo botão "🎮 Modo Arcade" na tela inicial — permite jogar qualquer minigame registrado de forma avulsa, sem tabuleiro
- **Galeria de minigames**: tela com cards para cada minigame, exibindo nome, ícone, descrição, duração e estatísticas do jogador
- **Estatísticas persistentes**: dados salvos em `localStorage` (chave `lara-world-arcade-stats`) — partidas, vitórias, derrotas, taxa de acerto, sequência máxima, tempo total jogado
- **Parâmetro `context` no MinigameHost**: `launchMinigameHost()` aceita `context: 'board' | 'arcade'`, alterando textos de retorno e ocultando efeitos do tabuleiro
- **Card final contextual**: no Arcade — "Voltar ao Arcade" / "Voltando ao Modo Arcade..." sem menção ao tabuleiro; no tabuleiro — mantém textos atuais
- **Arquitetura modular**: 6 novos arquivos em `src/arcade/` — controller, screen, card, stats, CSS, barrel
- **Isolamento**: Arcade não depende de `currentPlayerIndex`, `players[]`, posição, `StateManager` nem `SessionManager`

### v0.29.0-preview — Padronização Visual dos Tabuleiros ✅

- **Padronização visual**: casas especiais usam ícones funcionais exclusivos (❓ ⏩ ⏪ 🎲 ⏸️ 🔄 👑 🧩 🏃 🚀 🎯 🐉), casas normais usam ícones temáticos únicos por mundo
- **Textos reduzidos**: todas as descrições de eventos encurtadas para leitura rápida no mobile (máximo 3 palavras)
- **Revisão dos 5 mundos**: Floresta 🌿, Dinossauros 🦕, Galáxia 🌌, Oceanos 🌊, Castelo 🏰 — cada mundo com identidade visual própria e zero repetição em casas normais
- **Galáxia ajustada**: casa 17 normalizada com 🌟; ⏸️ reservado exclusivamente para "Pule a vez"

### v0.28.0-preview — Ataque dos Dragões ✅

- **Ataque dos Dragões**: minigame Canvas na casa 15 do Castelo dos Dragões — defesa do castelo contra dragões que voam em direção ao castelo
- **Mecânica**: clique/toque nos dragões para destruí-los antes que alcancem o castelo
- **Duração**: 20 segundos | **Meta**: 15 dragões acertados | **Defesa**: 3 escudos
- **4 fases de dificuldade**: velocidade e quantidade de dragões simultâneos aumentam a cada 5 segundos
- **Resultado**: vitória (+3 casas, sem cascata) ou derrota (boardDelta 0, sem penalidade)
- **Bot com 55% de chance**: a máquina resolve automaticamente o minigame

### v0.27.0-preview — Jogo da Memória da Floresta ✅

- **Jogo da Memória da Floresta**: minigame DOM na casa 11 da Floresta Encantada — 12 cartas (6 pares com emojis de floresta), cronômetro de 30s, vitória com 4+ pares
- **Floresta Misteriosa removida**: WorldConfig, subworld, CSS e debug da antiga Área Especial removidos
- **Infraestrutura de subworlds preservada**: sistema genérico mantido para uso futuro

### v0.26.0-preview — Versão Oficial Consolidada

- **Versão oficial que incorpora todo o trabalho desde v0.17.0-preview**, unificando as releases documentais v0.18.0-preview a v0.25.0-preview
- **Quinto mundo — Castelo dos Dragões**: tema medieval infantil, layout ascendente, identidade visual roxa/lilás
- **Redesign da Hero Screen**: logo oficial `logo-lara-world.webp` substitui antigo título emoji + gradiente
- **Sistema de Variantes de Tabuleiro (Layouts)**: arquitetura genérica `board.layouts` no WorldConfig
- **Sistema de Avatares e Tokens (UX-015)**: 4 personagens oficiais com fallback visual
- **Board Layout 2.0**: `board.cells` para posicionamento individual de células
- **Emojis clássicos removidos**: galeria de seleção simplificada para 4 personagens oficiais
- **Arquitetura de minigames consolidada**: documentação unificada, DMP-01 resolvido
- **Cache-busting**: `?v=v0.26.0-preview`

### v0.17.0-preview — Correção de 3 Bugs ✅

- **Bug 1 — Vitória Prematura**: jogador não vence mais ao completar submundo por avanço/desafio — sai com +2 casas de bônus via `handleBoardLimitReached()`
- **Bug 2 — Pergunta incorreta**: "Qual palavra tem 5 letras?" corrigida de "Bola" para "Papel"; banco agora possui `validateQuestionBank()` para auditoria estrutural
- **Bug 3 — Mundo Aleatório**: botão "🎲 Mundo Aleatório" agora sorteia entre todos os mundos principais (random filter `type === 'main'`) em vez de sempre escolher Floresta
- **Versionamento**: v0.17.0-preview, cache-busting atualizado

### v0.16.0-preview — Visual da Galáxia Estelar + Variantes de Tabuleiro ✅

- **Sistema de Variantes de Tabuleiro**: arquitetura genérica `board.layouts` + `board.defaultLayout` no WorldConfig — qualquer mundo pode declarar múltiplos layouts de células
- **Galáxia Estelar**: 3 layouts disponíveis — ⭐ Padrão (original), 🪐 Órbita (curva orbital), 🌀 Espiral (rotação 360°)
- **Selector UI automático**: botões `icon + name` renderizados apenas quando o mundo tem 2+ layouts; oculto para mundos com layout único
- **Persistência**: layout ativo salvo em `localStorage` por mundo
- **Integração Debug** (`?debug=1`): botões de troca rápida de layout no painel
- **Validação**: world-registry.js valida layouts e defaultLayout
- **Máximo de 2 empates** no sorteio inicial; no 3º, desempate automático aleatório
- **Mensagens divertidas**: "Empate cósmico!", "Depois de tantos empates, a sorte decidiu!", "Tanto empate que o destino tomou a frente!"
- **Válido para**: 2 jogadores e 1 jogador vs máquina
- **Dado da partida inalterado**

### v0.18.0-preview — Revisão do Sistema de Perguntas ✅

- **Banco expandido para 128 perguntas**: 9 categorias (Matemática, Português, Animais, Espaço, Natureza, Dinossauros, Lógica, Cores e Formas, Conhecimentos Gerais), extraído para módulo próprio `src/data/questions.js`
- **Seleção temática**: perguntas filtradas por mundo — Galáxia (Espaço/Lógica), Floresta (Animais/Natureza/Cores/Lógica), Dinossauros (Dinossauros/Animais/Natureza/Matemática)
- **Auditoria em debug (`?debug=1`)**: botão "📚 Mostrar" exibe todas as perguntas com categoria, dificuldade, opções, resposta e indicador de usadas
- **Cascata pós-desafio removida**: acertar ou errar não dispara mais o efeito da casa seguinte

### v0.16.0-preview — Visual da Galáxia Estelar ✅

- **Infraestrutura visual da Galáxia**: pasta `src/assets/worlds/galaxia/` com suporte a `background.webp` e `path.webp`, seguindo padrão Floresta/Dinossauros
- **Background no #track-container**: overlay semitransparente + `url(background.webp)` + gradiente fallback escuro
- **Path.webp**: regra CSS existente com fallback SVG stroke
- **Fallback garantido**: se assets não existirem, gradiente e SVG mantêm o visual funcional

### v0.15.0-preview — Troca Quântica + Result Card ✅

- **Casa 7 — Troca Quântica**: evento `swap-positions` substitui `move -2` — jogador troca de posição com o adversário. Sem cascata. Debug com 🔄 Gal C7
- **Result Card**: ao fim do MeteoroGame, card glass exibido sobre o canvas congelado (estrelas, nave, meteoros parados). Contador 5s + botão "Voltar agora". Header do minigame oculto durante exibição
- **Documentação**: CHANGELOG, visão-geral, regras-do-jogo atualizados

### v0.14.0-preview — Galáxia Estelar + Minigame do Buraco de Minhoca ✅

- **Mundo Galáxia**: tabuleiro temático com 20 casas, textos enxutos seguindo padrão visual (ícone + descrição curta: `🌊 Avance 2`, `⭐ Desafio`, `🌀 Volte 2`, `⚡ Jogue novamente`, `🔀 Troca Quântica`)
- **Buraco de Minhoca (casa 15)**: casa especial que transporta o jogador para o minigame MeteoroGame, com controles 4-direcionais (↑↓←→ + WASD)
- **MeteoroGame**: jogo interno com nave, meteoros, 3 vidas, feedback visual (flash vermelho, invulnerabilidade, texto `💥 -1 Vida!`), tela de resultado com bônus e botão "Voltar ao tabuleiro"
- **Fluxo do Bot**: se a máquina cair no Buraco de Minhoca, overlay com barra de progresso e botão "Pular", auto-resolve após 6s
- **Debug**: painel Galáxia com botões para C9, C14, C15🚪 e minigame (Abrir, Vencer, Perder, Retornar)

### v0.13.0-preview — Infraestrutura de Áudio ✅

- **AudioManager centralizado**: classe `AudioManager` que encapsula a Web Audio API, com cadeia de ganho em cascata (`masterGain` → `musicGain` + `effectsGain`), criação lazy do `AudioContext` e tolerância total a assets ausentes. Documentação completa em [docs/audio.md](./audio.md)
- **Catálogo de sons** (`src/audio/sounds.js`): 16 chaves simbólicas cobrindo UI, dados, tabuleiro, quiz, recompensas e música
- **Singleton**: instância única `audioManager` exportada via `src/audio/index.js`
- **21 pontos de integração**: cliques, dados, movimento, casas especiais, desafios e vitória com chamadas a `audioManager.play()`
- **Volumes independentes** (mestre, música, efeitos) com persistência automática em `localStorage`
- **Mute com persistência**: estado salvo entre sessões
- **Assets de áudio**: 7 diretórios criados em `src/assets/audio/` — `ui/`, `dice/`, `board/`, `quiz/`, `rewards/`, `music/` (aguardando arquivos .webm)
- **Degradação graciosa**: qualquer falha de áudio é silenciosamente ignorada

### v0.12.0-preview — Board Layout 2.0 + Hero Screen ✅

- **Hero Screen (UX-013 → redesign)** — tela inicial com redesign completo: logo oficial `logo-lara-world.webp` substitui o antigo título emoji + gradiente, card central glass com `backdrop-filter: blur(24px)`, borda branca 3px e glow rosa, botão "Jogo Rápido" com glow pulsante e subtítulo, "Modo Aventura" secundário com badge "EM BREVE...", fundo temático via `menu-background.webp` (opacity 0.50) + 7 gradientes radiais + shapes flutuantes + sparkles. A ilustração da Lara sobreposta ao card foi removida para simplificar a composição
- **Assets UI**: `src/assets/ui/` com `logo-lara-world.webp` (logo oficial, ativo), `menu-background.webp` (fundo, ativo) e `lara-hero.webp` (asset existente, não utilizado na Hero Screen atual)
- **Responsivo**: breakpoints ≤768px, ≤400px e viewport reduzida com escalonamento proporcional do logo e botões
- **Board Layout 2.0** — novo formato `board.cells` (`[{id, x, y}]`) que permite posicionamento individual de cada célula por mundo, substituindo o mapa fixo `positions`
- **Fallback automático** — `getPosicoes()` normaliza ambos os formatos; mundos existentes (Floresta) seguem com `board.positions` inalterados
- **Vale dos Dinossauros recelularizado com Dino Runner** — primeiro mundo a usar `board.cells` (20 células, 4 fileiras S-curve, +7pp X para centralizar). A casa 10 agora abriga o minigame Dino Runner (Canvas infinite runner de 30s) em vez do portal para a Caverna dos Fósseis
- **path.webp infrastructure** — CSS do `.path-line` preparado com `background-image`, `background-size: cover`, seletores por mundo e override de subworld
- **ART-005** — stroke do SVG reduzido de 14px para 5px com opacity ~0.25, preparando o caminho para receber textura
- **ART-006** — infraestrutura CSS completa para path.webp com fallback do traço SVG original
- **Ajustes finos de posição** — múltiplas iterações de refinamento nas coordenadas do Vale dos Dinossauros

### v0.11.0-preview — Evolução Visual (UX 2.0) ✅

- **UX-1.1 — Overhaul visual completo**: redesign cartoon com multi-radial gradient, células 98×64px com border-radius 20px, botões com shine 3D, overlays com blur, vitória com glow dourado, glass card no menu, scrollbar temática
- **Background ilustrado por mundo**: Floresta Encantada e Vale dos Dinossauros com `background.webp` + overlay de contraste + gradiente fallback, aplicados apenas no `#track-container`
- **Caminhos temáticos**: infraestrutura SVG pattern para textura de caminho por mundo, com fallback de cor sólida (Floresta #6d8f5e, Dinossauros #c48a3a)
- **Assets pipeline consolidada**: estrutura `src/assets/worlds/` com pastas por mundo (floresta/, dinossauros/), cada um preparado para `background.webp` e `path.webp`
- **Decorações emoji removidas**: elementos decorativos antigos do HTML removidos (ART-004) — background ilustrado assume papel de cenário
- **Vale dos Dinossauros** — segundo mundo completo (20 casas, portal na casa 10, eventos temáticos)
- **Dino Runner (casa 10)** — minigame infinite runner de 30s substituindo a Caverna dos Fósseis. O dino corre automaticamente e o jogador pula para desviar de obstáculos (cactos e rochas) com 3 fases de dificuldade
- **Floresta Encantada** — primeiro mundo (20 casas, portal, Floresta Misteriosa como Área Especial)
- **Portal genérico** — sem hardcoded de nomes de mundo; navegação via configuração
- **Theme Engine** — tema visual aplicado por mundo (`data-world` no body, CSS temático)
- **Retorno parametrizado** — bônus de saída lido do WorldConfig (Floresta +3, Caverna +3)
- **Debug independente** — botões para cada Área Especial no painel de debug
- **Arquitetura consolidada** — engine não conhece mundos específicos; tudo via WorldConfig
- Dino Runner: minigame Canvas (Dinossauros, casa 10) substitui a Caverna dos Fósseis
- Cache-busting atualizado para `?v=0.10.0-preview`

### v0.9.0-preview — Seletor de Mundos e Motor Modular ✅

- **Seletor de Mundos** — 6 cards exibidos entre "Jogo Rápido" e setup (5 mundos disponíveis + Aleatório)
- **Engine modular** — SessionManager, StateManager, WorldRegistry, EventProcessor como módulos independentes
- **Primeiro WorldConfig** — Floresta Encantada (20 células, 12 eventos, 1 portal) + Floresta Misteriosa (subworld, 8 células)
- **Módulos fundamentais** — `src/core/constants.js`, `utils.js`, `types.js`
- **World Manifest** — `src/data/world-manifest.js` com WORLD_IDS
- **Loader** — `src/worlds/loader.js` com imports estáticos
- **Coexistência** — motor modular e game.js rodam lado a lado; nada foi desconectado
- Cache-busting atualizado para `?v=0.9.0-preview`

### v0.8.0 — Menu Inicial e Interface Refinada ✅

- **Menu Inicial** (`#main-menu`) — tela inicial com título e dois botões
- **⚡ Jogo Rápido** — inicia partida single player com configuração simplificada
- **🏆 Modo Carreira (Em Breve)** — botão desabilitado, reservado para progressão futura
- **Tela de vitória com duas saídas** — "🔁 Jogar Novamente" (mesmo modo) e "🏠 Voltar ao Menu"
- **`modoJogo`** — variável de estado que controla o modo de jogo atual
- **`resetGameState()`** — função extraída para resetar estado sem exibir setup
- Cache-busting via `?v=0.8.0`

### v0.7.0 — Modo Single Player e Tela de Vitória ✅

- **Seletor de modo** — botões de rádio 1P / 2P no modal de configuração
- **Modo 1 Jogador** — Humano vs Máquina com bot automático (jogada a cada 1s)
- **Bot inteligente** — responde desafios com 60% de acerto, decide portal com 50% de chance
- **Tela de vitória** — overlay com confetes animados, fogos serpentina, troféu e botão "Jogar Novamente"
- **Correção**: casa 5 (voltar) na posição 1 não cascateia para desafio
- **Correção**: botão "Jogar Dado" reabilitado corretamente após reinício

### v0.6.0 ✅

- **Portal da Floresta** na casa 11 — modal com opções "Entrar" ou "Continuar"
- **Mundo da Floresta** — mini-trilha de 8 casas com visual temático (fundo verde escuro, decorações)
- **Jogador ativo exclusivo** — apenas o jogador que entrou aparece na floresta
- **Turno bloqueado** — o turno não alterna enquanto o jogador estiver na floresta
- **Casas especiais da floresta**: desafio (casas 3 e 7), atalho de saída (casa 5), saída (casa 8)
- **Posição salva por jogador** — `entradaFloresta: {1: null, 2: null}`
- **Retorno sem cascata** — ao sair da floresta, o bônus não ativa outras casas especiais
- **Modo debug** — `?debug=1` na URL, painel com botões para teste rápido (portal, entrada, atalho, saída, reset)
- Banco de questões com 30 perguntas em 6 categorias
- Sorteio aleatório sem repetição (controle via Set)
- Modal de desafio que bloqueia o dado até resposta
- 12 casas especiais no mundo principal (casa 11 agora é Portal da Floresta)
- Modal de configuração inicial com nomes e sprites personalizáveis
- Tabuleiro visual com trilha serpentina e caminho SVG
- Movimento animado casa por casa (async/await, 180ms/passo)
- Sistema de dado virtual 1-6 com animação de rolagem
- Multiplayer local para 2 jogadores
- Alternância automática de turnos (exceto na floresta)
- Histórico de jogadas
- Sistema de vitória
- Reinício retorna ao modal de configuração
- Design responsivo

### v0.4.0 ✅

- 5 casas de desafio educativo com perguntas fixas
- Modal de desafio e regras de acerto/erro

### v0.3.0 ✅

- Modal de configuração inicial com nomes e sprites
- Reinício retorna ao modal de configuração

### v0.2.0 ✅

- Multiplayer local para 2 jogadores
- Alternância automática de turnos
- Personagens lado a lado quando na mesma casa
- Histórico de jogadas
- Design responsivo

### v0.1.0 ✅

- MVP para 1 jogador
- Lógica de dado e movimento
- Casas especiais básicas
- Docker + Nginx

## Fluxo do Jogo

```
Menu (Tela Inicial)
  ↓
┌─── "⚡ Jogo Rápido" ──────────────────────────────┐
│ Escolher Mundo (Floresta / Dinossauros / Aleatório) │
│   ↓                                                 │
│ Configurar Jogadores (nome + sprite)                │
│   ↓                                                 │
│ Jogar Mundo Principal (20 casas, eventos, desafios) │
│   ↓                                                 │
│ (Quando existir) Portal → Área Especial             │
│   ├── Entrar: mini-trilha com eventos próprios      │
│   └── Continuar: segue no mundo principal            │
│   ↓                                                 │
│ Retornar da Área Especial (com bônus parametrizado) │
│   ↓                                                 │
│ Concluir Mundo (atingir casa final)                 │
│   ↓                                                 │
│ Vitória → Jogar Novamente / Voltar ao Menu          │
└─────────────────────────────────────────────────────┘

┌─── "🎮 Modo Arcade" ──────────────────────────────┐
│ Galeria de Minigames (cards com estatísticas)       │
│   ↓                                                 │
│ Selecionar minigame → MinigameHost (context arcade) │
│   ↓                                                 │
│ Card final: "Voltar ao Arcade" (sem tabuleiro)      │
│   ↓                                                 │
│ Retornar à galeria (estatísticas atualizadas)       │
└─────────────────────────────────────────────────────┘
```

## Sobre Áreas Especiais

Cada mundo do Lara World pode conter uma ou mais Áreas Especiais (submundos), acessadas através de portais posicionados em casas específicas do tabuleiro. Uma Área Especial é uma mini-trilha com eventos, regras e visual próprios. Ao entrar, a posição do jogador é salva. Ao completar ou sair, o jogador retorna ao mundo principal com um bônus de casas definido na configuração da área. A engine é genérica — não conhece nomes de mundos — e toda navegação entre mundos e áreas é baseada em WorldConfigs.

## Evolução Visual (UX 2.0 + Hero Screen)

Iniciada na **v0.11.0-preview**, expandida na **v0.12.0-preview** e consolidada na **v0.26.0-preview**, a fase de identidade visual estabeleceu e consolidou a pipeline de produção artística do projeto, incluindo a Hero Screen com redesign completo e logo oficial em asset.

### Motivação

O jogo possuía uma base técnica sólida (engine modular, áreas especiais, modo single player) mas ainda carecia de identidade visual própria. A interface era funcional mas genérica — sem personalidade, profundidade ou apelo infantil. Na época, dois mundos estavam disponíveis (Floresta Encantada e Vale dos Dinossauros); atualmente são cinco.

### Decisões Arquiteturais Aprovadas

- ✓ Background ilustrado é aplicado apenas na área do tabuleiro (`#track-container`)
- ✓ O fundo geral da aplicação permanece neutro (gradiente multi-radial)
- ✓ Cada mundo possuirá seu próprio:
  - `background.webp` — background temático do tabuleiro
  - `path.webp` — textura do caminho
- ✓ Cada área especial (submundo) também possuirá assets próprios no futuro
- ✓ Assets são reutilizáveis entre mundos quando aplicável
- ✓ Sistema preparado para expansão para novos mundos
- ✓ Caminhos temáticos são tratados como uma camada independente do background
- ✓ O centro do cenário permanece livre para o tabuleiro
- ✓ Cada mundo pode ter posicionamento personalizado de células via `board.cells`

### Estrutura de Assets

```
src/assets/
├── audio/               # Assets de áudio (.webm)
│   ├── ui/              # Sons de interface (cliques, modais)
│   ├── dice/            # Sons de dados (rolar, resultado)
│   ├── board/           # Sons do tabuleiro (movimento, portais)
│   ├── quiz/            # Sons de desafios (perguntas, acerto/erro)
│   ├── rewards/         # Sons de recompensa (vitória, game over)
│   └── music/           # Músicas de fundo (loop)
├── ui/
│   ├── logo-lara-world.webp # Logo oficial do Lara World — exibido na Hero Screen ✅
│   ├── lara-hero.webp       # Ilustração da personagem Lara (asset criado, não utilizado na Hero Screen atual)
│   └── menu-background.webp # Fundo temático do menu principal ✅
    └── worlds/
        ├── floresta/
        │   ├── background.webp   # Background ilustrado do tabuleiro (asset pendente)
        │   └── path.webp          # Textura do caminho — CSS com background-image pronto (v0.12.0)
        ├── dinossauros/
        │   ├── background.webp   # Background ilustrado do tabuleiro (asset pendente)
        │   └── path.webp          # Textura do caminho — CSS com background-image pronto (v0.12.0)
        ├── oceanos/
        │   ├── background.webp   # Background ilustrado do tabuleiro (asset pendente)
        │   └── path.webp          # Textura do caminho (asset pendente)
        └── castelo/
            ├── background.webp   # Background ilustrado do tabuleiro (asset pendente)
            └── path.webp          # Textura do caminho (asset pendente)
```

### Finalidade dos Assets

| Asset | Onde é aplicado | Função |
|-------|----------------|--------|
| `logo-lara-world.webp` | `.menu-brand-logo` via `<img>` na Hero Screen | Logo oficial do Lara World, exibido centralizado no `.menu-brand` com fallback textual |
| `menu-background.webp` | `.main-menu::before` via CSS `background-image` | Fundo temático suave do menu principal, opacidade 0.50 |
| `background.webp` | `#track-container` via `background-image` | Ilustração de fundo do tabuleiro, coberta por overlay semitransparente para contraste |
| `path.webp` | SVG `#trail-path` via SVG pattern (`stroke: url(#...)`) | Textura aplicada ao traço do caminho, mantendo largura, sombra e formato SVG |

### Testes Realizados

**Floresta Encantada — Background** (ASSET-001 / ART-002)
- Primeiro background ilustrado integrado ao tabuleiro
- Teste mostrou ganho significativo de identidade visual
- Aplicação no body (teste inicial) foi descartada — o fundo da página não deve usar a ilustração
- Aplicação apenas na área do tabuleiro foi aprovada como decisão arquitetural

**Vale dos Dinossauros — Background** (ART-003)
- Segundo background integrado, seguindo o mesmo padrão da Floresta
- Gradiente fallback em tons de terra/areia (#f4c97a → #8b6914)
- Overlay rgba(0,0,0,0.35) mantém contraste das casas sobre o background
- Estrutura idêntica à Floresta, validando a arquitetura de assets por mundo

**Caminho Temático** (ART-002 / ART-003 / ART-005 / ART-006)
- Infraestrutura preparada para textura de caminho via SVG pattern (ART-002)
- Primeira implementação usava `opacity` no stroke — resultado artificial, caminho translúcido
- Correção: caminho sólido (opacity removido), textura via pattern com fallback de cor sólida (ART-002 v2)
- Caminhos temáticos implementados para Floresta (`path-texture-floresta`, fallback #6d8f5e) e Dinossauros (`path-texture-dinossauros`, fallback #c48a3a) (ART-002/003)
- ART-005: stroke do SVG reduzido de 14px para 5px e opacity rebaixado para ~0.25, preparando o traço para receber textura sem conflito visual
- ART-006 (v0.12.0-preview): infraestrutura via `background-image` adicionada ao `.path-line`, com seletores por mundo e override de subworld; SVG stroke mantido como fallback
- Textura definitiva (`path.webp`) ainda pendente de criação por IA para ambos os mundos — quando criada, será exibida automaticamente sobre o fallback

**Decorações Emoji**
- Backgrounds ilustrados tornaram redundantes os emojis decorativos fixos no HTML
- Elementos removidos na ART-004 para que o background assuma o papel de cenário

### Descobertas dos Testes

- Backgrounds muito carregados prejudicam a leitura do tabuleiro
- O cenário não deve competir com as casas e jogadores
- Grandes elementos visuais (dinossauros, árvores, vulcões, fósseis) devem permanecer nas laterais
- O caminho foi refinado para stroke 5px com opacity ~0.25, deixando o traço leve enquanto aguarda textura path.webp
- Decorações emoji antigas removidas — background ilustrado agora é o cenário principal
- O posicionamento do tabuleiro pode variar por mundo — `board.cells` permite ajuste individual por célula no eixo X/Y

## Próximos Passos

Ver [roadmap.md](./roadmap.md) para as evoluções planejadas.
