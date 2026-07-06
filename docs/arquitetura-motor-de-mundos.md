# Arquitetura do Motor de Mundos — Lara World

> **Documento oficial de arquitetura**
> Aprovado nas sprints A0 e A0.1
> Implementação: Sprints A1–A6.6 concluídas (v0.10.0-preview)

---

## 1. Visão Geral

O Lara World está evoluindo de um jogo único com um mundo fixo para um **motor de mundos**
capaz de suportar múltiplos mundos temáticos sem alteração do código central.

Cada mundo (Floresta Encantada, Vale dos Dinossauros, Galáxia Estelar, etc.) será
definido exclusivamente por **configuração**. O motor nunca conhece mundos específicos —
ele conhece apenas **contratos genéricos**.

---

## 2. Princípio Central

> **O motor do Lara World nunca conhece mundos específicos. Ele conhece apenas contratos genéricos.**

Nenhum nome de mundo, ID de mundo, regra de mundo, célula especial, portal ou pergunta
deve estar hardcoded no motor. Tudo que é específico de um mundo vive em seu arquivo
de configuração.

---

## 3. Arquitetura Geral

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           GAME SESSION                                      │
│  Representa a aventura completa. Modo, progresso, placar, seed aleatória.  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                          ENGINE                                      │   │
│  │  Orquestrador principal. Coordena todos os subsistemas.              │   │
│  │                                                                      │   │
│  │  ┌──────────────┐  ┌───────────────┐  ┌──────────────────────────┐  │   │
│  │  │ TurnManager  │  │ BoardRenderer │  │ PlayerManager            │  │   │
│  │  │ Alterna      │  │ Monta trilha, │  │ Gerencia posição, UI,    │  │   │
│  │  │ turnos,      │  │ SVG, células, │  │ atualização dos          │  │   │
│  │  │ agenda bot   │  │ tema visual   │  │ jogadores                │  │   │
│  │  └──────────────┘  └───────────────┘  └──────────────────────────┘  │   │
│  │                                                                      │   │
│  │  ┌──────────────┐  ┌───────────────┐  ┌──────────────────────────┐  │   │
│  │  │ DiceManager  │  │ EventProcessor│  │ PortalManager            │  │   │
│  │  │ Rolagem,     │  │ Processa      │  │ Gerencia entrada/saída   │  │   │
│  │  │ animação     │  │ eventos de    │  │ de submundos, pilha de   │  │   │
│  │  │ do dado      │  │ células       │  │ mundos                   │  │   │
│  │  └──────────────┘  └───────────────┘  └──────────────────────────┘  │   │
│  │                                                                      │   │
│  │  ┌──────────────┐  ┌───────────────┐  ┌──────────────────────────┐  │   │
│  │  │ Challenge    │  │ VictorySystem │  │ CampaignSystem           │  │   │
│  │  │ System       │  │ Vitória,      │  │ Progressão entre mundos  │  │   │
│  │  │ Desafios,    │  │ confetes,     │  │ (Modo Carreira)          │  │   │
│  │  │ perguntas    │  │ botões        │  │                          │  │   │
│  │  └──────────────┘  └───────────────┘  └──────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                      WORLD REGISTRY                                  │   │
│  │  Carrega mundos, resolve por ID, fornece ao Engine.                  │   │
│  │  Engine nunca chama mundo específico — sempre via registry.          │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                      THEME MANAGER                                   │   │
│  │  Aplica tema visual (cores, gradientes, CSS class, decorações)      │   │
│  │  com base no worldConfig.theme. Usa data-attribute seletor.         │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         QUESTION CATALOG                                   │
│                                                                             │
│  Perguntas organizadas por categoria em arquivos separados.                │
│  Mundos referenciam categorias. Categorias reutilizáveis entre mundos.     │
│                                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐ │
│  │ Geografia│  │ História │  │ Ciências │  │ Português│  │ Natureza     │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Contratos Conceituais

### 4.1. WorldConfig

```javascript
WorldConfig {
  ── Metadata ──
  id: string                    // "floresta-encantada"
  name: string                  // "🌳 Floresta Encantada"
  description: string           // "Aventure-se na floresta mágica!"
  version: string               // "1.0"
  type: "main" | "subworld"

  ── Theme ──
  theme: ThemeConfig {
    cssClass: string            // "mundo-floresta-encantada"
    colors: {                   // primary, secondary, accent, background
      primary: string
      secondary: string
      accent: string
      background: string
      text: string
      cellDefault: string
      cellSpecial: string
    }
    gradients: {
      background: string
      overlay?: string
    }
    decorations: Decoration[]   // [{ type, className, count, positions }]
    animations: string[]        // ["leaf-fall"]
  }

  ── Board ──
  board: BoardConfig {
    totalCells: number
    startCell: number
    finishCell: number
    positions: { [cellNumber]: { x, y } }
    cellIcons: string[]
    pathType: "linear" | "circular" | "branched"
  }

  ── Rules ──
  rules: RulesConfig {
    diceType: "d6" | "d8" | "d12" | "custom"
    passStartBonus: boolean
    reverseMovement: boolean
    extraDiceConditions: string[]
    slipChance: number          // 0-1
    slipDelta: number
  }

  ── Objectives ──
  objectives: ObjectiveConfig[] // [{ type, params, label }]
  // Tipos: reachEnd, collectItems, answerQuestions, findKey, defeatBoss

  ── Portals ──
  portals: PortalConfig[]       // ver contrato 4.2

  ── Question Categories ──
  questionCategories: string[]  // ["geografia", "historia"]

  ── Assets ──
  assets: AssetsConfig {
    backgrounds: { main, loading, victory, portal }
    sprites: { [key]: path }
    sounds: { dice, move, portal, challenge, victory }
    music: { theme, portal, victory }
    ui: { icon, banner }
  }

  ── Events ──
  events: {
    [cellNumber]: EventConfig[] // ver contrato 4.3
  }

  ── Custom Handlers ──
  customEventHandlers?: {
    [eventType: string]: (params, context) => result
  }

  ── SubWorlds ──
  subWorlds?: string[]          // IDs dos submundos
}
```

### 4.2. PortalConfig

```javascript
PortalConfig {
  id: string                    // "portal-floresta-misteriosa"
  name: string                  // "🌲 Floresta Misteriosa"
  description: string
  sourceCell: number            // casa que ativa o portal
  type: "fixed" | "secret" | "temporary" | "conditional" | "one-way"
  targetWorldId: string         // "floresta-misteriosa"

  entrance: {
    message: string
    effect?: string             // "fade" | "zoom" | "flash"
    requiresConfirmation: boolean
    requirements?: {
      type: "hasItem" | "answeredQuestion" | "minCell"
      itemId?: string
      questionCategory?: string
      minCell?: number
    }
  }

  exitBehavior: {
    returnCell: number
    bonusCells: number
    message: string
    clearsPenalties: boolean
  }

  lifetime: {
    maxActivations: number | null
    expiresAfterTurn: number | null
    expiresOnComplete: boolean
  }
}
```

### 4.3. EventConfig

```javascript
EventConfig {
  type: string       // "move" | "challenge" | "skipTurn" | "extraTurn"
                     // | "portal" | "resetPosition" | "finishWorld" | "item"
  params?: {
    target?: number
    delta?: number
    category?: string
    portalId?: string
    itemId?: string
    count?: number
  }
  description?: string
  condition?: { type: string, value?: any }
  probability?: number   // 0-1
  once?: boolean
}
```

**Eventos conhecidos pelo motor:**

| Evento | Função | Parâmetros |
|---|---|---|
| `move` | Move jogador para casa específica ou por deslocamento | `target` ou `delta` |
| `challenge` | Dispara desafio/pergunta | `category` (opcional) |
| `skipTurn` | Jogador perde vez(es) | `count` (padrão 1) |
| `extraTurn` | Jogador joga novamente | — |
| `portal` | Ativa portal para submundo | `portalId` |
| `resetPosition` | Volta ao início | `target` (padrão startCell) |
| `finishWorld` | Conclui mundo (vitória/transição) | — |
| `item` | Jogador ganha item | `itemId`, `count` |

**Eventos customizados:**
Mundos podem registrar handlers via `worldConfig.customEventHandlers`.
O EventProcessor delega tipos desconhecidos para:
1. `worldConfig.customEventHandlers[type]`
2. Registro global (`Engine.registerEventType`)
3. Warning + ignore (se não encontrado)

### 4.4. QuestionCatalog

```
QuestionCatalog:
  Organização:
    data/questions/<categoria>.js

  Cada arquivo exporta:
    QuestionItem[] = [{
      id: string              // "geo-001"
      category: string        // "geografia"
      difficulty: 1 | 2 | 3
      pergunta: string
      opcoes: string[4]
      correta: number         // índice (0-3)
      explicacao?: string
    }]

  Uso:
    Mundo referencia: worldConfig.questionCategories = ["geografia", "historia"]
    ChallengeSystem consulta categorias, sorteia pergunta aleatória.
    Se evento especificar category, filtra por ela.
    Se não, sorteia entre todas as categorias do mundo.
```

### 4.5. GameSession

```javascript
GameSession {
  // Representa a aventura completa do início ao fim
  modoJogo: "rapido" | "carreira"

  // Modo Rápido
  worldId: string              // mundo escolhido (ou "random")
  isRandom: boolean

  // Modo Carreira
  campaignId: string           // "campanha-principal"
  worlds: string[]             // ordem dos mundos
  currentWorldIndex: number
  completedWorlds: string[]    // IDs dos mundos concluídos
  campaignScore: number        // placar acumulado

  // Jogadores
  players: Player[]
  isSinglePlayer: boolean

  // Sorteio
  drawState: {
    completed: boolean
    results: number[]
    currentPlayerIndex: number
  }

  // Aleatoriedade
  seed: number                 // seed para consistência
}
```

### 4.6. GameState

```javascript
GameState {
  // Representa o estado temporário da partida no mundo atual
  mundoAtual: string           // ID do mundo carregado

  players: PlayerState[]       // posição, cor, nome, penalidades
  currentPlayerIndex: number
  turnCount: number

  // Movimento
  isMoving: boolean
  movementQueue: Movement[]
  animationInProgress: boolean

  // Portal
  worldStack: WorldStackEntry[]  // pilha de mundos (pai → submundo)
  // WorldStackEntry = { worldId, playerPositions, returnCell, bonusCells }

  // Overlays
  overlayActive: boolean
  overlayType: string | null

  // Histórico
  history: HistoryEntry[]

  // Flags
  gameOver: boolean
  botScheduled: boolean
  debugMode: boolean
}
```

---

## 5. Estrutura de Mundo

Cada mundo é composto pelos seguintes blocos de configuração:

| Bloco | Descrição |
|---|---|
| **Metadata** | id, nome, descrição, versão, tipo (main/subworld) |
| **Theme** | Cores, gradientes, decorações, classes CSS, animações |
| **Board** | Total de casas, posições SVG, ícones, tipo de trilha |
| **Rules** | Tipo de dado, bônus ao passar início, gravidade, correnteza |
| **Objectives** | Objetivos de vitória (reachEnd, collectItems, etc.) |
| **Portals** | Portais para submundos (0 ou mais) |
| **QuestionCategories** | Referências a categorias de perguntas |
| **Assets** | Backgrounds, sprites, sons, músicas |
| **Events** | Mapa casa → eventos que disparam ao cair na casa |
| **SubWorlds** | IDs dos submundos associados |

---

## 6. Sistema de Eventos

Antes (monólito): `processSpecialCell()` usava `if/else` com tipos hardcoded e
referências a nomes de mundos.

Depois (eventos): cada casa do tabuleiro declara uma lista de eventos no config do
mundo. O `EventProcessor` do motor itera sobre os eventos da casa e executa os
manipuladores registrados.

**Fluxo:**

```
1. Jogador cai na casa N
2. Engine chama EventProcessor.process(N, worldConfig, gameState)
3. EventProcessor procura worldConfig.events[N]
4. Se existir, itera sobre o array de eventos
5. Para cada evento:
   a. Verifica condição (se houver)
   b. Verifica probabilidade
   c. Executa handler registrado para event.type
6. Handler retorna ações que o Engine aplica
```

**Eventos conhecidos:** `move`, `challenge`, `skipTurn`, `extraTurn`, `portal`,
`resetPosition`, `finishWorld`, `item`.

**Eventos customizados:** qualquer string nova é delegada para
`worldConfig.customEventHandlers[type]` ou registro global.

---

## 7. Sistema de Portais

Antes: portal hardcoded na casa 11, texto "Portal da Floresta" fixo no HTML,
estado `entradaFloresta` no gameState, retorno hardcoded para casa 8.

Depois: portal é uma **entidade própria** com seu próprio contrato.

**Características:**

- Mundo pode ter **0 ou mais portais**
- Cada portal aponta para um submundo via `targetWorldId`
- Portal gerencia mensagem de entrada, efeito, comportamento de saída (casa de retorno, bônus)
- `PortalManager` mantém uma pilha de mundos (`worldStack`)
- Ao entrar: salva mundo atual + posição dos jogadores, carrega submundo
- Ao completar submundo (`finishWorld` em subworld): restaura mundo pai, aplica bônus

**Tipos de portal planejados:**

| Tipo | Descrição |
|---|---|
| `fixed` | Sempre visível e ativo |
| `secret` | Precisa ser descoberto (dica visual) |
| `temporary` | Some após N turnos ou N usos |
| `conditional` | Só ativa se jogador tiver item/condição |
| `one-way` | Sem volta — submundo vira mundo atual |

---

## 8. QuestionCatalog

Antes: todas as perguntas em um `bancoQuestoes` global com categorias, mas sem
vínculo com mundos.

Depois: perguntas vivem em um **catálogo separado por categoria**, fora dos mundos.
Mundos apenas **referenciam** categorias.

**Vantagens:**

- Categorias reutilizáveis entre mundos (ex.: "geografia" serve para Floresta e Castelo)
- Novo mundo pode usar categorias existentes ou criar novas
- Banco de perguntas evolui independente dos mundos
- `difficulty` permite filtrar por nível

**Estrutura:**

```
data/questions/
  index.js              // agrega e exporta todas as categorias
  geografia.js          → [{ id, category, difficulty, pergunta, opcoes, correta }]
  historia.js
  ciencias.js
  portugues.js
  natureza.js           // criado para Floresta Misteriosa
  dinossauros.js        // futuro
  astronomia.js         // futuro
  oceanos.js            // futuro
```

---

## 9. GameSession vs GameState

| Aspecto | GameSession | GameState |
|---|---|---|
| **Escopo** | Aventura completa | Partida atual (um mundo) |
| **Persistência** | Dura a sessão inteira | Reseta ao trocar de mundo |
| **Modo Carreira** | Mantém progresso entre mundos | Novo GameState para cada mundo |
| **Jogadores** | Configuração inicial | Posições, turnos, penalidades |
| **Mundo** | worldId escolhido | mundoAtual carregado |
| **Portal** | — | worldStack (pilha de mundos) |
| **Sorteio** | drawState (já realizado) | — após sorteio |
| **Histórico** | Histórico completo | Histórico do mundo atual |
| **Placar** | campaignScore (Carreira) | Pontos da partida atual |

---

## 10. Mapeamento dos Mundos Atuais

### Mundo Principal — 🌳 Floresta Encantada

```
🌳 Floresta Encantada
├── ID: "floresta-encantada"
├── 20 casas
├── Eventos: casa 3 (avancar), 4 (desafio), 5 (voltar), 7 (desafio),
│           8 (jogar-novamente), 10 (perde-rodada), 11 (portal→Floresta Misteriosa),
│           12 (desafio), 15 (voltar-inicio), 16 (desafio), 18 (desafio), 20 (vitoria)
├── Portal: casa 11 → "floresta-misteriosa"
└── Submundo: Floresta Misteriosa (8 casas, worldExit bonus +3)
```

### Submundo — 🌲 Floresta Misteriosa

```
🌲 Floresta Misteriosa
├── ID: "floresta-misteriosa"
├── 8 casas
├── Eventos: casa 3 (desafio), 5 (atalho→volta +2), 7 (desafio), 8 (saida-mundo→volta +3)
├── Tipo: subworld
└── Retorno: +3 casas a partir da entrada
```

### Mundo Principal — 🦖 Vale dos Dinossauros

```
🦖 Vale dos Dinossauros
├── ID: "vale-dinossauros"
├── 20 casas
├── Eventos: casa 3 (avancar), 4 (desafio), 5 (voltar), 7 (desafio),
│           8 (jogar-novamente), 10 (portal→Caverna dos Fósseis),
│           12 (desafio), 15 (voltar-inicio), 16 (desafio), 18 (desafio), 20 (vitoria)
├── Portal: casa 10 → "caverna-dos-fosseis"
└── Submundo: Caverna dos Fósseis (8 casas, worldExit bonus +3)
```

### Submundo — 🦴 Caverna dos Fósseis

```
🦴 Caverna dos Fósseis
├── ID: "caverna-dos-fosseis"
├── 8 casas
├── Eventos: casa 3 (desafio), 5 (move→passagem), 7 (extraTurn), 8 (saida-mundo→volta +2)
├── Tipo: subworld
└── Retorno: +2 casas a partir da entrada
```

---

## 11. Modos de Jogo

### Jogo Rápido

- Jogador escolhe um mundo disponível na lista
- Opção "Aleatório" seleciona um mundo aleatório
- Partida isolada em um único mundo
- Ao vencer, volta ao menu
- Suporta 1 jogador (vs bot) e 2 jogadores

### Modo Carreira

- Sequência fixa de mundos definida pela campanha
- Progresso persiste entre mundos na sessão
- Placar acumulado (campaignScore)
- Ao concluir um mundo, avança para o próximo
- Ao concluir todos, campeão geral é declarado
- Mundo atual pode ser Floresta, Dinossauros, Galáxia, Oceanos, Castelo

---

## 12. Plano de Migração

| Sprint | O que fazer | Status |
|---|---|---|---|
| **A1** | Fundação dos contratos: `core/constants.js`, `core/utils.js`, `core/types.js` | ✅ Concluído |
| **A1.5** | World Registry + Loader + World Manifest: `engine/world-registry.js`, `worlds/loader.js`, `data/world-manifest.js` | ✅ Concluído |
| **A2** | SessionManager + StateManager: `engine/session-manager.js`, `engine/state-manager.js` | ✅ Concluído |
| **A3** | Event System Core: `engine/event-processor.js` com 8 tipos built-in, handlers customizados, cascade | ✅ Concluído |
| **A4** | Floresta Encantada como primeira config: `worlds/floresta/config.js` (Floresta Encantada + Floresta Misteriosa) | ✅ Concluído |
| **v0.9.0-preview** | World Selector + documentação: tela de seleção de mundos, cache-busting, docs atualizadas | ✅ Concluído |
| **A5.1** | Conectar engine — WorldRegistry em produção: game.js como ES Module, WorldRegistry.init() no bootstrap, currentWorldConfig populado, cards do seletor consomem WorldConfig | ✅ Concluído |
| **A5.2** | Consumir Board do WorldConfig: getTotalCasas(), getPosicoes(), getIcones(), handleVictory(), "atalho", "saida-mundo" usam currentWorldConfig.board com fallback | ✅ Concluído |
| **A6** | Vale dos Dinossauros: criar `worlds/dinossauros/config.js`. Testar "apenas configuração" | ✅ Concluído |
| **A6 (continuação)** | Caverna dos Fósseis: criar submundo, eventos, portal, debug | ✅ Concluído |
| **A6.3** | ThemeManager: aplicar tema visual do WorldConfig (cores, gradientes, CSS class) ao tabuleiro e painel | ✅ Concluído |
| **A6.6** | Portal genérico: `activeSubworldId` substitui `mundoAtual`, lookup em `subworldConfigs`, sem hardcoded | ✅ Concluído |
| **A7** | BoardRenderer: extrair renderização do tabuleiro de game.js para `engine/board-renderer.js` | ⏳ Pendente |
| **A8** | QuestionCatalog: extrair `bancoQuestoes` para `data/questions/*`. ChallengeSystem lê por categoria | ⏳ Pendente |
| **A9** | ChallengeSystem: extrair `showChallengeModal`, `sortearQuestao`, lógica para `engine/challenge-system.js` | ⏳ Pendente |
| **A10** | BotController + VictorySystem: extrair bot AI e vitória para módulos do engine | ⏳ Pendente |
| **A11** | PortalManager: extrair lógica de portal de game.js para `engine/portal-manager.js` | ⏳ Pendente |
| **A12** | CampaignSystem: `engine/campaign-system.js`. Modo Carreira com sequência de mundos | ⏳ Pendente |
| **A13** | CustomEventHandlers: implementar handlers customizados no EventProcessor para eventos de mundo | ⏳ Pendente |
| **A14** | Assets Dinâmicos: carregamento sob demanda de assets declarados no config | ⏳ Pendente |
| **A15** | Polimento: overlays dinâmicos, MenuController genérico, testes de regressão | ⏳ Pendente |

---

## 13. Regra de Ouro

> **Adicionar um novo mundo deve exigir apenas configuração, nunca alteração no motor.**

Criar `src/worlds/meu-mundo/config.js` exportando um `WorldConfig` dentro do contrato.
Se o mundo precisar de:

- **Casas especiais** → define `events: { casa: [{ type, params }] }`
- **Portal** → adiciona ao `portals[]`
- **Perguntas** → adiciona categorias em `questionCategories`; se nova, cria `data/questions/nova-categoria.js`
- **Regras próprias** → preenche `rules`
- **Tema visual** → preenche `theme`
- **Objetivos diferentes** → `objectives: [{ type, params }]`
- **Evento novo não previsto** → `customEventHandlers: { "meuEvento": handler }`

**Zero alterações em `engine/`, `core/`, `index.html`, `style.css`.**

---

> **Nota sobre a execução:** O plano original listava o World Selector como Sprint A12. Na execução real, ele foi antecipado para v0.9.0-preview (após A4) para fornecer a interface de seleção de mundos antes da conexão completa do motor. As demais sprints (A5–A15) seguem a ordem planejada.

## 14. Observações Futuras

Ideias registradas para sprints futuras (fora do escopo atual):

- **Página "Como Jogar"** — tutorial interativo das regras
- **Página de Créditos** — exibir contribuidores e versão do motor
- **Tutorial guiado** — primeiro acesso guia o jogador passo a passo
- **Lara World Bible** — documento unificado de game design com todas as regras, mundos, visão de produto
- **Melhorias no banco de perguntas** — mais perguntas, dificuldade parametrizável, temas por mundo
- **Algoritmo do dado balanceado** — mitigar sequências de azar extremo (ex.: garantia de avanço mínimo)
- **Mobile-first como requisito permanente** — todo novo mundo deve ser testado em 3 breakpoints

---

## 15. Marco 5 — Primeiro Ecossistema Multi-Mundos (v0.10.0-preview)

### O que foi entregue

- **Dois mundos completos**: Floresta Encantada e Vale dos Dinossauros, cada um com 20 casas, eventos temáticos, portal próprio
- **Duas Áreas Especiais**: Floresta Misteriosa (submundo da Floresta) e Caverna dos Fósseis (submundo do Vale), cada uma com 8 casas e eventos próprios
- **Portal genérico**: o estado de submundo (`activeSubworldId`, `subworldEntry`) substituiu as variáveis hardcoded `mundoAtual`, `entradaFloresta`, `entradaCaverna`
- **Retorno parametrizado**: o bônus de saída é lido do WorldConfig (`worldExit.params.bonusCells`) — Floresta +3, Caverna +3
- **Theme Engine**: tema visual aplicado via `data-world` no `<body>`, CSS temático para cada mundo, decorações dinâmicas injetadas via JS
- **Debug independente**: botões específicos para cada Área Especial no painel de debug
- **Zero alterações na Engine**: nenhum arquivo em `src/engine/`, `src/core/`, `src/data/` ou `src/worlds/loader.js` foi modificado

### Impacto na Arquitetura

| Componente | Antes (v0.9.0) | Depois (v0.10.0) |
|---|---|---|
| Estado de submundo | `mundoAtual`, `entradaFloresta`, `entradaCaverna` | `activeSubworldId`, `subworldEntry` |
| Lookup de dados | `getTotalCasas()` com switch implícito | `getSubworldConfig()` via `subworldConfigs[id]` |
| Portal | Hardcoded na casa 11, "Portal da Floresta" fixo | `getPortalConfigForCell()` lê de `currentWorldConfig.portals` |
| Eventos de área especial | `florestaEspeciais[]` separado | `eventsToSpecialCells()` converte qualquer config |
| Tema visual | Classe `.mundo-floresta` fixa | `data-world` dinâmico, CSS class do config |
| Quantidade de mundos | 1 (Floresta) | 2 (Floresta + Dinossauros) |
| Quantidade de submundos | 1 (Floresta Misteriosa) | 2 (Floresta Misteriosa + Caverna dos Fósseis) |

### Como criar um novo mundo + área especial

1. Criar `src/worlds/novo-mundo/config.js` exportando o WorldConfig com `board`, `events`, `portals`
2. Criar submundo com `type: "subworld"` no mesmo arquivo (ou separado)
3. Importar ambos em `src/game.js` e adicionar ao `WorldRegistry.init()` e `subworldConfigs`
4. Adicionar botões de debug em `src/index.html` dentro do `#debug-panel`

**Nenhuma engine modificada.**

---

## Arquivos Alterados (Sprints A0–A6.6)

### Documentação criada/alterada

### Documentação criada/alterada

| Arquivo | Sprint | Descrição |
|---|---|---|
| `docs/arquitetura-motor-de-mundos.md` | A0.2 | Documento oficial de arquitetura do motor de mundos |
| `docs/visao-geral.md` | v0.9.0 | Atualizado: v0.9.0-preview como versão atual |
| `docs/arquitetura.md` | v0.9.0 | Atualizado: diretórios core/engine/worlds, motor de mundos |
| `docs/roadmap.md` | v0.9.0 | Atualizado: v0.9.0-preview movido para concluído |
| `README.md` | v0.9.0 | Atualizado: v0.9.0-preview como versão ativa |
| `CHANGELOG.md` | v0.9.0 | Adicionado: entrada v0.9.0-preview |
| `docs/memorial-tecnico.md` | v0.9.0 | Adicionado: entrada v0.9.0-preview |

### Código criado (não conectado ao game.js)

| Arquivo | Sprint | Descrição |
|---|---|---|
| `src/core/constants.js` | A1 | Constantes do motor (event types, error codes) |
| `src/core/utils.js` | A1 | Utilitários (deepFreeze, deepClone, validateConfig) |
| `src/core/types.js` | A1 | Tipos JSDoc (WorldConfig, PortalConfig, EventConfig, etc.) |
| `src/engine/world-registry.js` | A1.5 | Registro de mundos (12 métodos, 4 classes de erro) |
| `src/data/world-manifest.js` | A1.5 | Array WORLD_IDS (todos comentados) |
| `src/worlds/loader.js` | A1.5 | Imports estáticos dos WorldConfigs |
| `src/engine/session-manager.js` | A2 | Gerenciamento de sessão (5 métodos, deepFreeze) |
| `src/engine/state-manager.js` | A2 | Gerenciamento de estado do jogo (17 métodos, deepClone) |
| `src/engine/event-processor.js` | A3 | Processador de eventos (8 tipos built-in, cascade, handlers customizados) |
| `src/worlds/floresta/config.js` | A4 | Primeiro WorldConfig (Floresta Encantada + Floresta Misteriosa, 402 linhas) |

### Código alterado (para o seletor de mundos)

| Arquivo | Sprint | Descrição |
|---|---|---|
| `src/game.js` | v0.9.0-preview | +35 linhas: fluxo do seletor de mundos, `selectedWorldId` |
| `src/index.html` | v0.9.0-preview | +45 linhas: seletor de mundos com 6 cards, cache-busting atualizado |
| `src/style.css` | v0.9.0-preview | +123 linhas: estilos do seletor de mundos (overlay, grid, cards, badges) |

### Código existente (não alterado)

| Diretório/Arquivo | Status |
|---|---|
| `Dockerfile` | Não alterado |
| `docker-compose.yml` | Não alterado |
| `docs/regras-do-jogo.md` | Não alterado |
| `docs/AI_WORKFLOW.md` | Não alterado |

---

**Sprints A0.2–A6.6 concluídas (v0.10.0-preview).** O motor de mundos está consolidado com dois mundos completos, duas áreas especiais, portal genérico e Theme Engine em produção. A engine modular (EventProcessor, StateManager, SessionManager) e os getters world-aware consomem WorldConfigs sem hardcoded. Nenhum arquivo da engine foi alterado na adição do segundo mundo — a Regra de Ouro foi validada com sucesso.
