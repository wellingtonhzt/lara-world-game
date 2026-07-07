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

### v0.10.0-preview (Atual) — Primeiro Ecossistema Multi-Mundos ✅

- **Vale dos Dinossauros** — segundo mundo completo (20 casas, portal na casa 10, eventos temáticos)
- **Caverna dos Fósseis** — segunda Área Especial (8 casas, risco x recompensa: saída rápida sem bônus ou saída completa com +3)
- **Floresta Encantada** — primeiro mundo (20 casas, portal, Floresta Misteriosa como Área Especial)
- **Portal genérico** — sem hardcoded de nomes de mundo; navegação via configuração
- **Theme Engine** — tema visual aplicado por mundo (`data-world` no body, CSS temático)
- **Retorno parametrizado** — bônus de saída lido do WorldConfig (Floresta +3, Caverna +3)
- **Debug independente** — botões para cada Área Especial no painel de debug
- **Arquitetura consolidada** — engine não conhece mundos específicos; tudo via WorldConfig
- Cache-busting atualizado para `?v=0.10.0-preview`

### v0.9.0-preview — Seletor de Mundos e Motor Modular ✅

- **Seletor de Mundos** — 6 cards exibidos entre "Jogo Rápido" e setup (Floresta, 4 "Em breve", Aleatório)
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
Escolher Mundo (Floresta / Dinossauros / Aleatório)
  ↓
Configurar Jogadores (nome + sprite)
  ↓
Jogar Mundo Principal (20 casas, eventos, desafios)
  ↓
(Quando existir) Portal → Área Especial
  ├── Entrar: mini-trilha com eventos próprios
  └── Continuar: segue no mundo principal
  ↓
Retornar da Área Especial (com bônus parametrizado)
  ↓
Concluir Mundo (atingir casa final)
  ↓
Vitória → Jogar Novamente / Voltar ao Menu
```

## Sobre Áreas Especiais

Cada mundo do Lara World pode conter uma ou mais Áreas Especiais (submundos), acessadas através de portais posicionados em casas específicas do tabuleiro. Uma Área Especial é uma mini-trilha com eventos, regras e visual próprios. Ao entrar, a posição do jogador é salva. Ao completar ou sair, o jogador retorna ao mundo principal com um bônus de casas definido na configuração da área. A engine é genérica — não conhece nomes de mundos — e toda navegação entre mundos e áreas é baseada em WorldConfigs.

## Próximos Passos

Ver [roadmap.md](./roadmap.md) para as evoluções planejadas.
