# 🌍 Lara World

**Lara World** é um jogo de trilha infantil para navegador, onde os jogadores percorrem um caminho de 20 casas até a linha de chegada. Feito com HTML, CSS e JavaScript puro — sem frameworks, sem backend, sem banco de dados.

---

## 📌 Status do Projeto

| Versão | Data | Status |
|--------|------|--------|
| **v0.4.0** | Jul/2026 | ✅ **Ativo** |
| v0.3.0 | Jul/2026 | ✅ Concluído |
| v0.2.0 | Jul/2026 | ✅ Concluído |
| v0.1.0 | Jul/2026 | ✅ Concluído |

---

## ✨ Funcionalidades Atuais (v0.4.0)

- **Desafios educativos** — 5 casas de desafio com perguntas de múltipla escolha (casa 4, 7, 12, 16, 18)
- **Modal de desafio** — ao cair em uma casa de desafio, um modal com pergunta e 3 alternativas é exibido
- **Acerto/erro com movimento** — resposta correta: avança 1 casa; resposta errada: volta 1 casa
- **Bloqueio do dado durante desafio** — o botão "Jogar Dado" permanece desabilitado até o desafio ser respondido
- **Prevenção de loop infinito** — o movimento pós-desafio não cascateia para outras casas especiais
- **Modal de configuração inicial** — tela de setup com nome e sprite para cada jogador antes da partida
- **Nomes personalizados** — Jogador 1 e Jogador 2 com campos de texto editáveis
- **Sprites independentes** — grade de emojis exclusiva para cada jogador, sem compartilhamento de estado
- **Inicialização pelo modal** — o tabuleiro só é carregado após clicar em "Iniciar Jogo"
- **Reinício retorna ao modal** — ao reiniciar, o jogador pode alterar nomes e sprites novamente
- **Tabuleiro visual em trilha** — 20 casas posicionadas em snake pattern com caminho SVG suave
- **Movimento animado** — personagens andam casa por casa com animação pulse (180ms/passo)
- **Sistema de dado** — dado virtual 1-6 com animação de rolagem (bounce)
- **11 casas especiais** com efeitos automáticos:
  - Casa 3 → Avance 2 casas
  - Casa 4 → Desafio educativo
  - Casa 5 → Volte 1 casa
  - Casa 7 → Desafio educativo
  - Casa 8 → Jogue novamente
  - Casa 10 → Perde uma rodada
  - Casa 12 → Desafio educativo
  - Casa 15 → Volte ao início
  - Casa 16 → Desafio educativo
  - Casa 18 → Desafio educativo
  - Casa 20 → Vitória
- **Multiplayer local** — 2 jogadores no mesmo dispositivo
- **Alternância automática de turnos** — após cada jogada, o turno passa para o próximo jogador
- **Destaque visual do jogador ativo** — indicador de turno no painel
- **Histórico de jogadas** — registro cronológico de todas as ações
- **Sistema de vitória** — o primeiro a chegar ou ultrapassar a casa 20 vence
- **Design responsivo** — adaptado para desktop e notebook
- **Docker + Nginx** — ambiente conteinerizado para deploy

---

## 🎮 Como Jogar

### Configuração Inicial

1. Abra o jogo no navegador.
2. O **modal de configuração** é exibido automaticamente.
3. Digite o nome do **Jogador 1** e escolha um sprite na grade de emojis.
4. Digite o nome do **Jogador 2** e escolha um sprite na grade de emojis.
5. Clique em **"Iniciar Jogo"** para começar a partida.

### Modo 2 Jogadores (Multiplayer)

1. O jogo inicia com o **Jogador 1** (configurado no modal).
2. Clique em **"Jogar Dado"** para lançar o dado.
3. O personagem avança o número de casas sorteado — andando casa por casa com animação.
4. Casas especiais podem fazer você avançar, voltar, perder rodadas, jogar novamente ou **responder a um desafio educativo** (casas 4, 7, 12, 16, 18).
5. Ao cair em uma casa de desafio, um modal com pergunta de múltipla escolha aparece. Acertar = avança 1 casa; errar = volta 1 casa.
6. Após cada jogada, o turno alterna automaticamente para o outro jogador.
6. Se os dois jogadores estiverem na mesma casa, os personagens aparecem lado a lado.
7. **O primeiro a atingir ou ultrapassar a casa 20 vence** a partida.
8. Para uma nova partida, clique em **"Reiniciar"** — o modal de configuração reaparece para ajustar nomes e sprites.

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

O Lara World começou como um MVP de tabuleiro simples para 1 jogador. A primeira versão (v0.1.0) implementou a lógica básica do jogo com dados, casas especiais e Docker. Na sequência (v0.1.5) recebeu um tabuleiro visual com trilha serpentina, personagem animado e painel lateral. A versão v0.2.0 adicionou multiplayer local com alternância de turnos entre 2 jogadores. A v0.3.0 introduziu o modal de configuração inicial com nomes e sprites personalizáveis. A versão atual (v0.4.0) adiciona 5 casas de desafios educativos com perguntas de múltipla escolha.

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
git clone https://github.com/wellingtonhzt/lara-world-game.git
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

- **v0.5.0** — Sprites PNG, sons, melhorias visuais
- **v0.6.0** — Mundos temáticos (Floresta, Espacial, Dinossauros)
- **v1.0.0** — Lançamento oficial

Veja o [roadmap completo](docs/roadmap.md).

---

## 🤖 Desenvolvimento Assistido por IA

Este projeto segue o processo definido em [docs/AI_WORKFLOW.md](docs/AI_WORKFLOW.md), que estabelece um fluxo obrigatório de implementação, validação, documentação e memorial técnico para toda evolução futura.

---

## 📄 Licença

Este projeto é open source e está sob a licença MIT.
