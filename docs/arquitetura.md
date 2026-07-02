# Arquitetura do Lara World

## Stack Tecnológica

- **Frontend**: HTML5 + CSS3 + JavaScript Vanilla (sem frameworks)
- **Infraestrutura**: Docker + Nginx
- **Hospedagem Futura**: Debian (Proxmox LXC)

## Estrutura de Diretórios

```
lara-world/
├── docs/               # Documentação do projeto
├── src/                # Código-fonte do jogo
│   ├── assets/
│   │   ├── images/     # Imagens do jogo (futuro)
│   │   └── sounds/     # Sons do jogo (futuro)
│   ├── index.html      # Página principal
│   ├── style.css       # Estilos do jogo
│   └── game.js         # Lógica do jogo
├── docker/
│   └── nginx.conf      # Configuração do Nginx
├── Dockerfile          # Build da imagem Docker
├── docker-compose.yml  # Orquestração Docker
└── README.md           # Documentação principal
```

## Arquitetura do Frontend

### index.html
Estrutura semântica dividida em:
- **Header**: Título e subtítulo
- **Board Area** (esquerda): Trilha serpentina em grid 5×4 com 20 casas
- **Panel Area** (direita): Dado, status, botões e histórico de jogadas

### style.css
- Layout flex com board à esquerda e painel à direita
- CSS Grid para trilha serpentina (4 linhas × 5 colunas, zigue-zague)
- Cores vibrantes com gradientes, cantos arredondados
- Animações: bounce (dado), pulse (Lara), celebrar (vitória)
- Responsivo: empilha verticalmente em telas menores

### game.js
Padrão **Module Pattern** (IIFE) para encapsulamento:
- **gameState**: Gerencia posição, rodadas perdidas, status, isMoving
- **Casas Especiais**: Mapa de configuração com cascateamento
- **Funções Principais**:
  - `renderizarTrilha()`: Desenha as 20 casas em posições serpentinas
  - `positionLaraAt(casa)`: Posiciona elemento #lara sobre a casa usando `getBoundingClientRect`
  - `animateLaraMovement(from, to)`: Move Lara passo a passo (async/await, 180ms por passo)
  - `animateDice(valor)`: Animação de rolagem do dado (retorna Promise)
  - `processSpecialCell(pos)`: Aplica efeitos de casa especial com animação
  - `handleVictory()`: Exibe celebração e encerra jogo
  - `jogarDado()`: Função principal assíncrona do turno

## Fluxo do Jogo

```
Início
  ↓
Jogador clica "Jogar Dado"
  ├── Se isMoving → ignora (bloqueio)
  ├── Se rodadasPerdidas > 0 → decrementa, encerra turno
  └── Segue:
  ↓
Anima dado (1-6) com bounce
  ↓
Anima Lara andando casa por casa (180ms/casa)
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
  └── Finaliza turno, libera botão
```

## Docker

O Dockerfile usa **nginx:alpine** para servir os arquivos estáticos. O `docker-compose.yml` expõe a porta **8080**.
