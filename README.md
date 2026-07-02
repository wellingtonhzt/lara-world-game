# 🌍 Lara World

**Lara World** é um jogo de trilha infantil para navegador, onde a personagem Lara percorre um caminho até a linha de chegada. Feito com HTML, CSS e JavaScript puro — sem frameworks.

## ✨ Objetivo

Levar a Lara da casa inicial até a **casa 20**, vencendo desafios e casas especiais pelo caminho.

## 🏗️ Estrutura do Projeto

```
lara-world/
├── README.md
├── docs/
│   ├── visao-geral.md
│   ├── regras-do-jogo.md
│   ├── arquitetura.md
│   └── roadmap.md
├── src/
│   ├── index.html
│   ├── style.css
│   ├── game.js
│   └── assets/
│       ├── images/
│       └── sounds/
├── docker/
│   └── nginx.conf
├── Dockerfile
└── docker-compose.yml
```

## 🎮 Como Jogar

1. Abra o jogo no navegador.
2. Clique em **"Jogar Dado"** para lançar o dado.
3. Lara avança o número de casas sorteado — andando **casa por casa** com animação visual.
4. Casas especiais podem fazer Lara avançar, voltar, perder rodadas ou jogar novamente.
5. Chegue na **casa 20** para vencer!

## Versão Atual

### v0.2.0 - Multiplayer Local

Funcionalidades implementadas:

- Tabuleiro de trilha com 20 casas
- Movimento animado da personagem
- Casas especiais:
  - Avance 2 casas
  - Volte 1 casa
  - Jogue novamente
  - Perde uma rodada
  - Volte ao início
- Histórico de jogadas
- Sistema de vitória
- Multiplayer local para 2 jogadores
- Alternância automática de turnos
- Destaque visual do jogador ativo
- Docker + Nginx
- Estrutura preparada para futuras expansões

## 🚀 Como Executar Localmente

### Opção 1 — Direto no navegador

Abra o arquivo `src/index.html` no seu navegador.

### Opção 2 — Servidor local (Node.js)

```bash
npx serve src/
```

Acesse: http://localhost:3000

### Opção 3 — Servidor local (Python)

```bash
cd src && python3 -m http.server 8000
```

Acesse: http://localhost:8000

## 🐳 Como Executar com Docker

### Pré-requisitos

- Docker
- Docker Compose

### Passos

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/lara-world.git
cd lara-world

# Build e execução
docker compose up -d
```

Acesse: http://localhost:8080

### Parar o container

```bash
docker compose down
```

## 🔮 Próximas Evoluções

- Sprites próprios da Lara
- Sprites do Jogador 2
- Sons
- Múltiplos mundos
- Ranking local
- Salvamento de progresso
- Efeitos visuais avançados

Veja o [roadmap completo](docs/roadmap.md).

## 📄 Licença

Este projeto é open source e está sob a licença MIT.
