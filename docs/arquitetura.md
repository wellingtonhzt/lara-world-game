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
│   ├── regras-do-jogo.md
│   ├── roadmap.md
│   └── visao-geral.md
├── src/                 # Código-fonte do jogo
│   ├── index.html       # Página principal
│   ├── style.css        # Estilos do jogo
│   └── game.js          # Lógica do jogo
├── docker/
│   └── nginx.conf       # Configuração do Nginx
├── Dockerfile           # Build da imagem Docker
└── docker-compose.yml   # Orquestração Docker
```

> Nota: as pastas `src/assets/images/` e `src/assets/sounds/` estão previstas para versões futuras.

## Arquitetura do Frontend

### index.html

Estrutura semântica dividida em:

- **Header**: Título com emoji decorativo
- **Board Area** (esquerda):
  - `#track-container`: container com gradiente de céu/grama, decorações (nuvens, árvores, flores)
  - SVG `#trail-path`: caminho suave que conecta as casas (Catmull-Rom spline)
  - `#track`: container das 20 células `.casa` com posicionamento absoluto
  - `#lara` e `#lara-p2`: personagens posicionados dinamicamente
- **Panel Area** (direita):
  - `#dice-display`: dado virtual com emoji
  - Status: indicador de turno e posições de ambos os jogadores
  - Botões: Jogar Dado e Reiniciar
  - `#history`: histórico cronológico de jogadas

### style.css

- **Layout**: Flexbox com `board-area` (flex: 1) e `panel-area` (240px fixos)
- **Tabuleiro**: `#track-container` com `position: relative` e gradiente de fundo
- **Células** (`.casa`): `position: absolute` com `transform: translate(-50%,-50%)` para centralização. Cada casa recebe `left` e `top` em percentual via JS
- **Caminho SVG**: `#trail-path` com `stroke-width: 10`, cor bege/marrom, opacidade 0.6
- **Personagens**: círculos brancos com borda rosa (Lara) ou azul (Amigo), `z-index: 20`, 58×58px
- **Casa especial**: cores por `data-position` (3 amarela, 5 rosa, 8 laranja, 10 roxa, 15 vermelha, 20 verde com glow)
- **Animações**: `pulse` (movimento), `bounce` (dado), `celebrar` (vitória)
- **Responsivo**: `@media (max-width: 840px)` com empilhamento vertical, células 64×46px

### game.js

Padrão **Module Pattern** (IIFE) para encapsulamento de escopo.

#### Organização do Código

```
constantes / configuração
  ├── TOTAL_CASAS (20)
  ├── PLAYER_COUNT (2)
  ├── players[]        → array de objetos {id, name, emoji, posicao, rodadasPerdidas, element}
  ├── gameState        → {currentPlayerIndex, jogoAtivo, jogoFinalizado, isMoving}
  ├── casasEspeciais[] → mapa de configuração
  ├── boardPositions{} → coordenadas percentuais de cada casa
  └── icons[]          → emoji por casa

Player Helpers
  ├── getCurrentPlayer()   → retorna o jogador ativo
  ├── getPlayerElement(p)  → retorna o elemento DOM do jogador
  ├── switchTurn()         → alterna currentPlayerIndex
  └── updateUI()           → atualiza indicador de turno e posições

SVG Path / Board
  ├── renderSvgPath()      → gera curva Catmull-Rom no SVG
  └── renderizarTrilha()   → cria 20 células <div> no DOM

Posicionamento
  └── positionPlayerAt(n, player?) → posiciona personagem sobre a casa
       com offset (±12×, ±8×) se ambos jogadores estiverem na mesma casa

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

Vitória
  └── handleVictory() → celebração, desativa jogo

Turno Principal
  └── jogarDado() → função assíncrona principal

Controles
  └── reiniciarJogo() → reseta estado

Inicialização
  └── init() → dispara em DOMContentLoaded
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

O bloqueio de clique durante movimento é feito pela flag `gameState.isMoving`, que é setada como `true` no início de `jogarDado()` e liberada em `unlockTurn()`.

#### Controle de Turnos

- `gameState.currentPlayerIndex` (0 ou 1) indica o jogador ativo
- `switchTurn()` alterna o índice: `(currentPlayerIndex + 1) % PLAYER_COUNT`
- Chamada em três pontos de `jogarDado()`:
  - Após rodada perdida (skip automático)
  - Ao final do turno normal (sem extra turn)
- **Não** é chamada em caso de "jogue novamente" (casa 8)
- `updateUI()` sincroniza o painel com o jogador ativo

#### Gerenciamento de Estado

Cada jogador mantém seu próprio estado:
```javascript
{ id, name, emoji, posicao, rodadasPerdidas, element }
```

O estado compartilhado do jogo:
```javascript
{ currentPlayerIndex, jogoAtivo, jogoFinalizado, isMoving }
```

- `posicao`: posição na trilha (0 = fora do tabuleiro, 1-20 = casas)
- `rodadasPerdidas`: contador de rodadas a saltar (casa 10)
- `jogoAtivo`: false quando o jogo termina (vitória)
- `jogoFinalizado`: true após vitória (desabilita botão)
- `isMoving`: true durante animação (bloqueia cliques)

## Fluxo do Jogo

```
Início
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
  ├── Voltar (5) → anima movimento reverso
  ├── Jogar novamente (8) → mantém turno ativo
  ├── Perde rodada (10) → incrementa contador
  ├── Voltar início (15) → anima até casa 0
  └── Vitória (20) → celebração, fim de jogo
  ↓
Caiu em casa normal?
  └── switchTurn, updateUI, libera botão
```

## Docker

O Dockerfile usa **nginx:alpine** para servir os arquivos estáticos da pasta `src/`. O `docker-compose.yml` expõe a porta **8080** mapeando para a porta 80 do container. A configuração do Nginx está em `docker/nginx.conf`.
