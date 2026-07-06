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
│   ├── game.js          # Lógica do jogo (monólito original)
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
│       └── floresta/
│           └── config.js  # WorldConfig Floresta Encantada
├── docker/
│   └── nginx.conf       # Configuração do Nginx
├── Dockerfile           # Build da imagem Docker
└── docker-compose.yml   # Orquestração Docker
```

> Nota: as pastas `src/assets/images/` e `src/assets/sounds/` estão previstas para versões futuras.

## Arquitetura do Frontend

### index.html

Estrutura semântica dividida em:

- **Main Menu** (`#main-menu`):
  - Container centralizado com `z-index: 1000`, exibido ao carregar o jogo
  - Título "🌍 Lara World" com estilo decorativo
  - Dois botões: "⚡ Jogo Rápido" (ativo) e "🏆 Modo Carreira" (desabilitado, "(Em Breve)")
  - Escondido quando uma partida é iniciada; reexibido via "Voltar ao Menu"
- **Setup Modal** (`#setup-screen`):
  - Overlay fixo com `z-index: 1000`, exibido após clicar em "Jogo Rápido"
  - Card do Jogador 1 com campo de nome (`<input>`) e grade de emojis (`.emoji-grid`)
  - Botão **"Iniciar Jogo"** — esconde o modal e renderiza o tabuleiro
- **Victory Overlay** (`#victory-overlay`):
  - Overlay fixo com confetes animados (`.confetti-piece`) e fogos serpentina (`.serpentine`)
  - Título "🏆 Vitória!", mensagem personalizada com nome do vencedor
  - Container `.victory-actions` com dois botões: "🔁 Jogar Novamente" (dispara `reiniciarJogo()`) e "🏠 Voltar ao Menu" (dispara `showMainMenu()`)
- **Portal Modal** (`#portal-overlay`):
  - Overlay fixo com `z-index: 800`, exibido ao cair na casa 11
  - Título "🌿 Portal da Floresta", mensagem descritiva
  - Botões "Entrar na Floresta" e "Continuar no Jogo"
- **Challenge Modal** (`#challenge-overlay`):
  - Overlay fixo com `z-index: 500`, exibido durante o jogo
  - Título "Desafio!", pergunta (`#challenge-question`) e opções (`#challenge-options`)
  - Botões de alternativa criados dinamicamente via JS
- **Header**: Título com emoji decorativo, `#world-indicator` mostrando mundo atual (principal/floresta)
- **Board Area** (esquerda):
  - `#track-container`: container com gradiente de céu/grama, decorações (nuvens, árvores, flores)
  - SVG `#trail-path`: caminho suave que conecta as casas (Catmull-Rom spline)
  - `#track`: container das células `.casa` com posicionamento absoluto (20 no principal, 8 na floresta)
  - `#lara` e `#lara-p2`: personagens posicionados dinamicamente (apenas o ativo na floresta)
  - `.mundo-floresta` decorações: árvores (`#floresta-tree1..3`), cogumelos, folhas
- **Panel Area** (direita):
  - `#dice-display`: dado virtual com emoji
  - Status: indicador de turno e posições de ambos os jogadores
  - Botões: Jogar Dado e Reiniciar
  - `#history`: histórico cronológico de jogadas
- **Debug Panel** (`#debug-panel`):
  - Exibido apenas quando `?debug=1` na URL
  - 5 botões: Casa 11, Entrar na Floresta, Casa 5 (Atalho), Casa 8 (Saída), Voltar ao Principal
  - Posicionado no canto inferior esquerdo com `z-index: 999`

### style.css

- **Layout**: Flexbox com `board-area` (flex: 1) e `panel-area` (240px fixos)
- **Setup Modal** (`#setup-overlay`): `position: fixed`, `inset: 0`, `z-index: 1000`, `background: rgba(0,0,0,0.5)`, `display: flex` centralizado
- **Player Cards** (`.player-card`): fundo branco com borda arredondada, padding interno, sombra suave. Destaque visual (borda dourada) para o card ativo
- **Emoji Grid** (`.emoji-grid`): `display: flex` com `flex-wrap: wrap`, gaps entre os itens. Cada emoji (`.emoji-option`): 48×48px, cursor pointer, borda transparente. Selecionado: borda azul com fundo claro
- **Tabuleiro**: `#track-container` com `position: relative` e gradiente de fundo
- **Células** (`.casa`): `position: absolute` com `transform: translate(-50%,-50%)` para centralização. Cada casa recebe `left` e `top` em percentual via JS
- **Caminho SVG**: `#trail-path` com `stroke-width: 10`, cor bege/marrom, opacidade 0.6
- **Personagens**: círculos brancos com borda rosa (Lara) ou azul (Amigo), `z-index: 20`, 58×58px
- **Casa especial**: cores por `data-position` (3 amarela, 4 roxa desafio, 5 rosa, 7 roxa desafio, 8 laranja, 10 roxa, 12 roxa desafio, 15 vermelha, 16 roxa desafio, 18 roxa desafio, 20 verde com glow)
- **Animações**: `pulse` (movimento), `bounce` (dado), `celebrar` (vitória)
- **Responsivo**: `@media (max-width: 840px)` com empilhamento vertical, células 64×46px

### game.js

Padrão **Module Pattern** (IIFE) para encapsulamento de escopo.

#### Organização do Código

```
constantes / configuração
  ├── TOTAL_CASAS (20), FLORESTA_TOTAL (8)
  ├── PLAYER_COUNT (2)
  ├── players[]        → array de objetos {id, name, emoji, posicao, rodadasPerdidas, element, isBot}
  ├── gameState        → {currentPlayerIndex, jogoAtivo, jogoFinalizado, isMoving, questoesUsadas, mundoAtual, entradaFloresta, entrouNoPortal}
  ├── modoJogo         → string | null ("rapido" no Jogo Rápido, null no menu)
  ├── isSinglePlayer   → boolean global (alterna entre modo 1P e 2P)
  └── botTurnScheduled → boolean que evita agendamento duplicado do turno do bot
  ├── casasEspeciais[] → mapa de configuração (12 casas no principal)
  ├── florestaEspeciais[] → mapa de configuração (4 casas na floresta)
  ├── boardPositions{} → coordenadas percentuais do mundo principal
  ├── florestaPosicoes{} → coordenadas percentuais da floresta (formato S)
  ├── icons[]          → emoji por casa no principal
  ├── florestaIcones[] → emoji por casa na floresta
  ├── bancoQuestoes{}  → banco categorizado {categoria: [{pergunta, opcoes[], resposta}]}
  └── questoesDisponiveis[] → flat pool construído de bancoQuestoes

Getters World-Aware
  ├── getTotalCasas()      → TOTAL_CASAS ou FLORESTA_TOTAL conforme mundoAtual
  ├── getPosicoes()        → boardPositions ou florestaPosicoes
  ├── getIcones()          → icons ou florestaIcones
  └── getCasasEspeciais()  → casasEspeciais ou florestaEspeciais

Player Helpers
  ├── getCurrentPlayer()   → retorna o jogador ativo
  ├── getPlayerElement(p)  → retorna o elemento DOM do jogador
  ├── switchTurn()         → alterna currentPlayerIndex (bloqueado se mundoAtual === "floresta")
  └── updateUI()           → atualiza indicador de turno e posições

SVG Path / Board
  ├── renderSvgPath(posicoes?) → gera curva Catmull-Rom no SVG (usa getPosicoes() por padrão)
  └── renderizarTrilha(mundo?) → cria células <div> no DOM (20 ou 8 conforme mundo)

Posicionamento
  └── positionPlayerAt(n, player?) → posiciona personagem sobre a casa
       com offset (±12×, ±8×) se ambos jogadores estiverem na mesma casa
       oculta sprite não ativo quando mundoAtual === "floresta"

Animação
  └── animatePlayerMovement(from, to) → move player casa a casa (180ms)

Dado
  ├── getDadoEmoji(valor)  → retorna emoji do dado
  └── animateDice(valor)   → animação bounce + loop

Histórico
  ├── addHistory(texto, tipo)
  └── clearHistory()

Casas Especiais
  └── processSpecialCell(pos) → aplica efeitos com animação
       ├── "avancar" (casa 3) → move +n, cascateia
       ├── "voltar" (casa 5) → move -n, não cascateia
       ├── "desafio" (casas 4,7,12,16,18 + floresta 3,7) → sortearQuestao(), abre modal, move ±1, não cascateia
       ├── "portal" (casa 11) → exibe modal de entrada na floresta, salva posição, transporta
       ├── "atalho" (floresta casa 5) → volta ao principal com +2, não cascateia
       ├── "saida-mundo" (floresta casa 8) → volta ao principal com +3, não cascateia
       ├── "jogar-novamente" (casa 8) → retorna true (extra turn)
       ├── "perde-rodada" (casa 10) → incrementa contador
       ├── "voltar-inicio" (casa 15) → move para 0
       └── "vitoria" (casa 20) → handleVictory()

Sorteio de Perguntas
  ├── sortearQuestao() → sorteia índice não usado de questoesDisponiveis[]
  ├── gameState.questoesUsadas (Set) → rastreia índices já sorteados
  ├── Se todas usadas → limpa o Set e recomeça
  └── Chamado por processSpecialCell no case "desafio"

Main Menu
  ├── showMainMenu() → exibe menu inicial, esconde tabuleiro/painel/victory
  ├── hideMainMenu() → esconde menu, prepara tabuleiro
  └── setupMenuEvents() → registra clique em "⚡ Jogo Rápido" e "🏆 Modo Carreira"

Bot AI
  ├── resolveChallenge(desafio) → se for bot, responde com 60% acerto (delay 600ms); senão, abre modal
  ├── resolvePortal() → se for bot, decide entrar com 50% chance (delay 500ms); senão, abre modal
  └── scheduleBotTurnIfNeeded() → agenda jogada do bot após 1s, com guarda botTurnScheduled

Vitória
  └── handleVictory() → overlay de vitória com confetes, desativa jogo, exibe dois botões (Jogar Novamente / Voltar ao Menu)

Turno Principal
  └── jogarDado() → função assíncrona principal (adaptada para floresta e bot)

Modo Debug
  └── initDebugMode() → ativado por ?debug=1, painel com 5 botões de teste

Controles
  ├── resetGameState() → reseta estado (posições, rodadasPerdidas, mundoAtual, entradaFloresta, entrouNoPortal, questoesUsadas, jogoAtivo, jogoFinalizado) sem exibir UI
  └── reiniciarJogo() → chama resetGameState(), depois showSetupScreen()

Setup Screen
  ├── showSetupScreen() → exibe modal, popula grade de emojis, foca P1
  ├── hideSetupScreen() → esconde modal
  ├── setupModalEvents() → registra eventos de clique nas grades e botão
  └── startGame() → lê nomes/emojis dos inputs, inicia partida

Challenge Modal
  └── showChallengeModal(desafio) → exibe pergunta/opções, retorna Promise<boolean>

Inicialização (A5.1)
  └── init() → WorldRegistry.init([florestaEncantada]), chama showMainMenu()
       └── selectWorld() → currentWorldConfig = WorldRegistry.get(id) || getDefault()
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
- **Bloqueio na floresta**: a função só alterna se `mundoAtual !== "floresta"`, garantindo que o mesmo jogador complete a floresta sem interrupção
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
  mundoAtual, entradaFloresta, entrouNoPortal }
```

Além do estado dos jogadores, o módulo possui duas variáveis globais:
```javascript
let isSinglePlayer = false;   // true quando modo 1 jogador está ativo
let botTurnScheduled = false; // true quando um turno de bot já foi agendado
```

- `posicao`: posição na trilha (0 = fora do tabuleiro, 1-20 = casas)
- `rodadasPerdidas`: contador de rodadas a saltar (casa 10)
- `jogoAtivo`: false quando o jogo termina (vitória)
- `jogoFinalizado`: true após vitória (desabilita botão)
- `isMoving`: true durante animação (bloqueia cliques)
- `questoesUsadas`: Set de índices de perguntas já sorteadas na partida
- `mundoAtual`: string — `"principal"` ou `"floresta"` (determina qual tabuleiro é exibido)
- `entradaFloresta`: `{1: number | null, 2: number | null}` — posição de entrada salva por jogador
- `entrouNoPortal`: boolean — evita reentrada no portal durante o mesmo turno

## Fluxo do Jogo

```
Início (DOMContentLoaded)
  ↓
Menu Inicial (showMainMenu)
  ├── "⚡ Jogo Rápido" → setupModalEvents() configura modoJogo = "rapido", esconde menu
  └── "🏆 Modo Carreira" → desabilitado (Em Breve)
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
  ├── Desafio (4,7,12,16,18 + floresta 3,7) → abre modal, move ±1, não cascateia
  ├── Portal (11) → exibe modal, salva posição, transporta para floresta
  ├── Voltar (5) → anima movimento reverso
  ├── Jogar novamente (8) → mantém turno ativo
  ├── Perde rodada (10) → incrementa contador
  ├── Voltar início (15) → anima até casa 0
  ├── Atalho (floresta 5) → volta ao principal com +2, não cascateia
  ├── Saída da Floresta (floresta 8) → volta ao principal com +3, não cascateia
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

## Motor de Mundos (v0.9.0-preview)

A partir da v0.9.0-preview, o Lara World iniciou a **Fase de Mundos** com a criação de um motor modular. Na Sprint A5.1 o motor entrou em produção: o WorldRegistry é inicializado no bootstrap e o `currentWorldConfig` é populado na seleção do mundo. O game.js foi migrado para ES Module e consome `currentWorldConfig.board` diretamente (Sprint A5.2).

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

### Primeiro WorldConfig

| Mundo | Arquivo | Células | Eventos | Portais |
|-------|---------|---------|---------|---------|
| Floresta Encantada | `src/worlds/floresta/config.js` | 20 | 12 | 1 (para Floresta Misteriosa) |
| Floresta Misteriosa | (mesmo arquivo) | 8 | 4 | — |

### Seletor de Mundos

O seletor de mundos é uma tela intermediária entre o clique em "⚡ Jogo Rápido" e o modal de configuração. Exibe 6 cards em grid:
- **Floresta Encantada** — selecionável, define `selectedWorldId = "floresta"`
- **4 cards "Em breve"** — bloqueados visualmente (badge 🔒), sem ação
- **Mundo Aleatório** — seleciona Floresta (fallback)

A variável `selectedWorldId` é definida no escopo do game.js. Na Sprint A5.1, o WorldRegistry foi integrado ao fluxo de inicialização: `WorldRegistry.init()` é chamado no bootstrap, `selectWorld()` consulta o registry via `WorldRegistry.get(id)` e popula `currentWorldConfig`. Os cards do seletor agora exibem descrição e nome vindos do WorldConfig.

## Docker

O Dockerfile usa **nginx:alpine** para servir os arquivos estáticos da pasta `src/`. O `docker-compose.yml` expõe a porta **8080** mapeando para a porta 80 do container. A configuração do Nginx está em `docker/nginx.conf`.
