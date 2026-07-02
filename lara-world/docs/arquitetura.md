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
Estrutura semântica com três seções principais:
- **Board**: Grade com as 20 casas da trilha
- **Controls**: Área do dado, status e botões
- **Messages**: Painel de mensagens do jogo

### style.css
- Design responsivo com CSS Grid
- Tema infantil com cores vibrantes
- Animações CSS para dado e personagem
- Layout mobile-first com media queries

### game.js
Padrão **Module Pattern** (IIFE) para encapsulamento:
- **State Object**: Gerencia posição, rodadas perdidas, status do jogo
- **Casas Especiais**: Mapa de configuração das casas com efeitos
- **Funções Principais**:
  - `renderizarTrilha()`: Desenha as 20 casas
  - `jogarDado()`: Lógica principal do turno
  - `processarCasaAtual()`: Aplica regras das casas especiais
  - `animarDado()`: Efeito visual de rolagem
  - `verificarVitoria()`: Checa condição de vitória

## Fluxo do Jogo

```
Início
  ↓
Jogador clica "Jogar Dado"
  ↓
Anima dado (1-6)
  ↓
Lara avança N casas
  ↓
Verifica casa especial?
  ├── Sim → Aplica efeito (avançar/voltar/perder rodada/etc)
  └── Não → Finaliza turno
  ↓
Verifica vitória (casa 20)?
  ├── Sim → Tela de vitória
  └── Não → Aguarda próxima jogada
```

## Docker

O Dockerfile usa **nginx:alpine** para servir os arquivos estáticos. O `docker-compose.yml` expõe a porta **8080**.
