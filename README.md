# 🌍 Lara World

**Lara World** é um jogo de trilha infantil para navegador, onde os jogadores percorrem um caminho de 20 casas até a linha de chegada. Feito com HTML, CSS e JavaScript puro — sem frameworks, sem backend, sem banco de dados.

---

## 📌 Status do Projeto

| Versão | Data | Status |
|--------|------|--------|
| v0.2.0 | Jul/2026 | ✅ Ativo |
| v0.1.0 | Jul/2026 | ✅ Concluído |

---

## ✨ Funcionalidades Atuais (v0.2.0)

- **Tabuleiro visual em trilha** — 20 casas posicionadas em snake pattern com caminho SVG suave
- **Movimento animado** — personagens andam casa por casa com animação pulse (180ms/passo)
- **Sistema de dado** — dado virtual 1-6 com animação de rolagem (bounce)
- **6 casas especiais** com efeitos automáticos:
  - Casa 3 → Avance 2 casas
  - Casa 5 → Volte 1 casa
  - Casa 8 → Jogue novamente
  - Casa 10 → Perde uma rodada
  - Casa 15 → Volte ao início
  - Casa 20 → Vitória
- **Multiplayer local** — 2 jogadores no mesmo dispositivo
- **Alternância automática de turnos** — após cada jogada, o turno passa para o próximo jogador
- **Destaque visual do jogador ativo** — indicador de turno no painel
- **Histórico de jogadas** — registro cronológico de todas as ações
- **Sistema de vitória** — o primeiro a chegar ou ultrapassar a casa 20 vence
- **Reinício de partida** — botão que reseta ambos os jogadores
- **Design responsivo** — adaptado para desktop e notebook
- **Docker + Nginx** — ambiente conteinerizado para deploy

---

## 🎮 Como Jogar

### Modo 1 Jogador

1. Abra o jogo no navegador.
2. Clique em **"Jogar Dado"** para lançar o dado.
3. Lara avança o número de casas sorteado — andando casa por casa com animação.
4. Casas especiais podem fazer você avançar, voltar, perder rodadas ou jogar novamente.
5. Chegue na **casa 20** para vencer!

### Modo 2 Jogadores (Multiplayer)

- Cada jogador tem seu próprio personagem e posição na trilha.
- O painel indica de quem é a vez com destaque visual.
- Após cada jogada, o turno alterna automaticamente.
- Se os dois jogadores estiverem na mesma casa, os personagens aparecem lado a lado.
- O primeiro a atingir ou ultrapassar a casa 20 vence a partida.
- Casas especiais afetam apenas o jogador que nelas caiu.

---

## 🛠️ Tecnologias

| Tecnologia | Versão | Função |
|------------|--------|--------|
| HTML5 | — | Estrutura da página |
| CSS3 | — | Estilização, layout flex, animações |
| JavaScript | ES6+ | Lógica do jogo (IIFE, async/await, Promises) |
| Nginx | alpine | Servidor web para deploy |
| Docker | — | Conteinerização |

---

## 📜 História do Projeto

O Lara World começou como um MVP de tabuleiro simples para 1 jogador. A primeira versão (v0.1.0) implementou a lógica básica do jogo com dados, casas especiais e Docker. Na sequência (v0.1.5) recebeu um tabuleiro visual com trilha serpentina, personagem animado e painel lateral. A versão atual (v0.2.0) adiciona multiplayer local com alternância de turnos entre 2 jogadores.

---

## 🚀 Como Executar Localmente

### Opção 1 — Direto no navegador

Abra o arquivo `src/index.html` no seu navegador (Chrome, Firefox, Edge ou Safari).

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

---

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

---

## 🗺️ Roadmap

- **v0.3.0** — Sprites PNG, sons, melhorias visuais
- **v0.4.0** — Escolha de personagens, nomes personalizados, novas casas especiais
- **v0.5.0** — Mundos temáticos (Floresta, Espacial, Dinossauros)
- **v1.0.0** — Lançamento oficial

Veja o [roadmap completo](docs/roadmap.md).

---

## 🤖 Desenvolvimento Assistido por IA

Este projeto segue o processo definido em [docs/AI_WORKFLOW.md](docs/AI_WORKFLOW.md), que estabelece um fluxo obrigatório de implementação, validação, documentação e memorial técnico para toda evolução futura.

---

## 📄 Licença

Este projeto é open source e está sob a licença MIT.
