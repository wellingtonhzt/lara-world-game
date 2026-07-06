# Layouts do Lara World

## 1. Filosofia de Layout

Lara World é um jogo de tabuleiro infantil. O layout deve priorizar:

1. **O tabuleiro** — é o centro da experiência, o elemento mais importante
2. **O personagem** — o jogador precisa se ver no tabuleiro
3. **O dado** — a ação principal (rolar) precisa ser óbvia
4. **A informação** — posição, turno, histórico — suporte, não protagonista

## 2. Layout Desktop (≥1024px)

### Estrutura Geral

```
┌──────────────────────────────────────────────────────────────┐
│  [world-indicator]  🏠 [Menu]                               │
├─────────────────────────────────────────────────────┬────────┤
│                                                     │  DADO  │
│              TABULEIRO (track-container)            │ 🎲     │
│                                                     │        │
│   ┌──┐  ┌──┐  ┌──┐  ┌──┐  ┌──┐                    │ 👤 P1  │
│   │20│  │19│  │18│  │17│  │16│                    │ ➡️     │
│   └──┘  └──┘  └──┘  └──┘  └──┘                    │ 🤖 P2  │
│                                                     │        │
│   ┌──┐  ┌──┐  ┌──┐  ┌──┐  ┌──┐                    │ [DADO] │
│   │11│  │12│  │13│  │14│  │15│                    │        │
│   └──┘  └──┘  └──┘  └──┘  └──┘                    │ HISTÓ- │
│                                                     │ RICO   │
│   ┌──┐  ┌──┐  ┌──┐  ┌──┐  ┌──┐                    │ 📜     │
│   │10│  │ 9│  │ 8│  │ 7│  │ 6│                    │ ...    │
│   └──┘  └──┘  └──┘  └──┘  └──┘                    │ ...    │
│                                                     │        │
│   ┌──┐  ┌──┐  ┌──┐  ┌──┐  ┌──┐                    │        │
│   │ 1│  │ 2│  │ 3│  │ 4│  │ 5│                    │        │
│   └──┘  └──┘  └──┘  └──┘  └──┘                    │        │
│                                                     │        │
└─────────────────────────────────────────────────────┴────────┘
```

### Zoneamento

| Zona | Ocupação | Prioridade |
|---|---|---|
| **Tabuleiro** | ~65% da largura, 100% da altura | 1 — protagonista |
| **Painel Lateral** | 280px fixos, altura total | 2 — suporte |
| **Header** | 48px, largura total | 3 — informação |
| **Overlays (modais)** | Centralizados, z-index 1000+ | 4 — eventos |

### Header

- Altura: 48px
- Conteúdo: `world-indicator` (esquerda), botão "Voltar ao Menu" (direita)
- Fundo: sólido ou gradiente fino, combinando com o tema do mundo
- Posição: fixed no topo (não scrolla com a página)

### Painel Lateral

- Largura: 280px (fixa)
- Conteúdo (top → bottom):
  - **Dado**: grande (88px), centralizado
  - **Jogador ativo**: indicador visual (→ nome, avatar)
  - **Status dos jogadores**: posição atual, rodadas perdidas
  - **Botão "Jogar Dado"**: grande, chamativo, cor de acento
  - **Botão "Reiniciar"**: secundário
  - **Histórico**: scrollável, últimas 10-15 jogadas
- Fundo: off-white ou semi-transparente com frosted glass

### Tabuleiro

- Ocupa o espaço restante (flex: 1)
- Proporção calculada dinamicamente pelo JS (snake pattern)
- Fundo: cena do mundo atual (ilustração completa)
- Trilha: caminho SVG sobre a ilustração

## 3. Layout Tablet (768×1024)

- Mesma estrutura do desktop, mas com painel lateral reduzido
- Painel: 220px ou recolhível (toggle)
- Dado e botões mantidos visíveis
- Histórico oculto por padrão (toggle)

## 4. Layout Mobile (<768px)

### Estrutura Empilhada

```
┌──────────────────┐
│  world-indicator │
├──────────────────┤
│                  │
│   TABULEIRO      │
│   (reduzido)     │
│                  │
├──────────────────┤
│  🎲  [JOGAR]     │  ← HUD compacto
│  👤 P1: casa 12  │
│  🤖 P2: casa 7   │
├──────────────────┤
│  📜 Histórico    │  ← 3-5 linhas
│  (recolhível)    │
└──────────────────┘
```

### Prioridades Mobile

1. **Tabuleiro** — ocupa 55-65% da altura da tela
2. **HUD compacto** — dado + botão + status dos jogadores (30%)
3. **Histórico** — 5-10% (recolhível)
4. **Header** — 5%

### HUD Mobile

- Layout horizontal: dado + botão de ação lado a lado
- Status dos jogadores: abaixo, em formato compacto (avatar + nome + casa)
- Botão "Jogar Dado" grande o suficiente para uso com um polegar (mín 56px altura)

### Tabuleiro Mobile

- Snake pattern mantido, mas com células menores (48×48 ou 56×56)
- Texto das células reduzido (apenas número, sem descrição)
- Personagens proporcionais ao tamanho da célula
- Zoom: tabuleiro deve caber na largura da tela, scroll vertical se necessário

## 5. Layout de Modais

### Regra Geral

- Centralizado horizontal e verticalmente
- Largura máxima: 480px (desktop), 90vw (mobile)
- Altura máxima: 80vh, scroll interno se necessário
- Fundo: frosted glass (`backdrop-filter: blur(6px)`)
- Animação de entrada: fade-in + scale

### Posicionamento por Tipo

| Modal | Largura | Altura | Observação |
|---|---|---|---|
| Configuração | 600px | auto | Mais largo pelos cards de jogador |
| Desafio | 480px | auto | Pergunta + 3 opções |
| Portal | 420px | auto | Título + mensagem + 2 botões |
| Vitória | 520px | 400px | Overlay especial com confetes |
| Debug (painel) | 200px | auto | Canto inferior esquerdo, não centralizado |

## 6. Seletor de Mundos

```
┌──────────────────────────────────────────────────┐
│                                                   │
│              🌍 Escolha seu mundo!                │
│                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  🌳      │  │  🦖      │  │  🌌      │        │
│  │ Floresta │  │ Dinossau │  │ Galáxia  │        │
│  │ Encantad │  │  s       │  │ Estelar  │        │
│  │  a       │  │          │  │          │        │
│  │          │  │          │  │ 🔒       │        │
│  └──────────┘  └──────────┘  └──────────┘        │
│                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  🌊      │  │  🏰      │  │  🎲      │        │
│  │ Oceanos  │  │ Castelo  │  │ Aleatório │        │
│  │          │  │           │  │          │        │
│  │ 🔒       │  │ 🔒       │  │          │        │
│  └──────────┘  └──────────┘  └──────────┘        │
│                                                   │
│              [🔙 Voltar]                          │
└──────────────────────────────────────────────────┘
```

- Grid de 3 colunas (desktop) ou 2 colunas (mobile)
- Card com ícone grande + nome + badge (se bloqueado)

## 7. Responsividade — Breakpoints

| Breakpoint | Largura | Layout |
|---|---|---|
| **Desktop** | ≥1024px | Tabuleiro + painel lateral |
| **Tablet** | 768px–1023px | Tabuleiro + painel reduzido |
| **Mobile** | 480px–767px | Empilhado (tabuleiro + HUD) |
| **Small Mobile** | <480px | Mesmo empilhado, fonte reduzida |

## 8. Regras de Layout

1. O tabuleiro nunca deve ser menor que 60% da largura ou altura visível
2. O dado nunca deve ficar abaixo da dobra (visible without scroll)
3. O botão "Jogar Dado" deve ser o maior botão da tela
4. Modais não devem cobrir o tabuleiro completamente
5. O indicador de turno deve ser visível sem desviar o olhar do tabuleiro
6. Em mobile, todos os elementos essenciais devem estar acessíveis com uma mão
