# Memorial Técnico

## [0.3.0] - 2026-07-03

### Objetivo

Implementar um modal de configuração inicial que permita aos jogadores definir seus nomes e escolher sprites (emojis) antes do início da partida, além de alterar o fluxo de reinício para retornar ao modal.

### Arquivos Alterados

| Arquivo | Tipo de Alteração |
|---------|-------------------|
| `src/game.js` | Adicionado: showSetupScreen, hideSetupScreen, startGame, setupModalEvents. Alterado: init, reiniciarJogo |
| `src/index.html` | Adicionado: estrutura do modal com inputs de nome e grades de emoji para P1 e P2 |
| `src/style.css` | Adicionado: estilos do modal overlay, player cards, emoji grid e estados de seleção |
| `README.md` | Atualizado: v0.3.0 como versão ativa, funcionalidades, modo de jogar com modal, roadmap |
| `CHANGELOG.md` | Adicionado: entrada v0.3.0 |
| `docs/visao-geral.md` | Atualizado: funcionalidades da v0.3.0 |
| `docs/arquitetura.md` | Atualizado: estrutura do index.html, seção CSS do modal, funções de setup, fluxo do jogo |
| `docs/regras-do-jogo.md` | Atualizado: regras multiplayer com modal, regra de reinício |
| `docs/roadmap.md` | Atualizado: v0.3.0 movido para concluído |
| `docs/memorial-tecnico.md` | Adicionado: entrada v0.3.0 |

### Impacto Técnico

- **game.js**: `init()` agora chama `showSetupScreen()` em vez de `renderizarTrilha()` diretamente. Criada função `setupModalEvents()` que registra eventos de clique nas grades de emoji (`#p1-emoji-grid` e `#p2-emoji-grid`) e no botão "Iniciar Jogo". `startGame()` lê os valores dos inputs, define `players[].name` e `players[].emoji`, esconde o modal e chama `renderizarTrilha()`. `reiniciarJogo()` agora chama `showSetupScreen()` em vez de renderizar diretamente.
- **HTML**: Modal adicionado ao body com `#setup-overlay` contendo dois `.player-card` com inputs (`#p1-name`, `#p2-name`) e grades de emoji (`#p1-emoji-grid`, `#p2-emoji-grid`). Cada grade contém 10 opções de emoji.
- **CSS**: Modal usa `position: fixed` com overlay semi-transparente. Player cards com `flex: 1` ocupam metade da largura cada. Emoji grid com `display: flex; flex-wrap: wrap`. Emoji selecionado ganha borda azul com `box-shadow`.
- **jQuery**: Biblioteca carregada via CDN no HTML para facilitar manipulação do DOM no modal, sem alterar o restante do código que permanece em JavaScript Vanilla.

### Impacto Funcional

- Jogo agora começa com modal de configuração em vez de tabuleiro pronto
- Jogadores podem personalizar nomes e sprites antes de cada partida
- Sprites dos dois jogadores são independentes (cada grade tem seu próprio estado)
- Reinício retorna ao modal, permitindo reconfiguração
- Fallback para nomes "Jogador 1" / "Jogador 2" e emojis 🧒 / 👦 se o jogador não interagir

### Objetivo

Evoluir o Lara World de um jogo single player para suporte a multiplayer local com 2 jogadores, alternância de turnos e documentação completa do projeto.

### Arquivos Alterados

| Arquivo | Tipo de Alteração |
|---------|-------------------|
| `src/game.js` | Refatoração: estrutura de players, controle de turnos, offset em mesma casa |
| `src/style.css` | Adicionado: #lara-p2, .turn-indicator, .pos-p1/.pos-p2, animação para P2 |
| `src/index.html` | Adicionado: #lara-p2 visível, painel com turno e posições individuais |
| `README.md` | Reescrito: status, funcionalidades, multiplayer, tecnologias, roadmap |
| `CHANGELOG.md` | Criado: registro v0.1.0 e v0.2.0 |
| `docs/visao-geral.md` | Reescrito: conceito multiplayer, funcionalidades detalhadas |
| `docs/arquitetura.md` | Reescrito: organização do código, movimento, turnos, estado |
| `docs/regras-do-jogo.md` | Reescrito: regras 1 e 2 jogadores, tabela de casas |
| `docs/roadmap.md` | Reescrito: versões concluídas e futuro |
| `docs/AI_WORKFLOW.md` | Criado: processo de desenvolvimento assistido |

### Impacto Técnico

- **game.js**: `PLAYER_COUNT` passou de 1 para 2. `posicao` e `rodadasPerdidas` movidos de `gameState` para objetos individuais de cada `player`. Adicionadas funções `getCurrentPlayer()`, `getPlayerElement()`, `switchTurn()`, `updateUI()`. `positionPlayerAt()` agora aceita parâmetro opcional `player` e aplica offset (±12x, ±8y) quando dois jogadores estão na mesma casa. `jogarDado()` agora chama `switchTurn()` e `updateUI()` ao final de cada turno.
- **HTML/CSS**: Segundo personagem `#lara-p2` adicionado. Painel de status exibe indicador de turno e posições individuais.

### Impacto Funcional

- Jogo agora suporta 2 jogadores no mesmo dispositivo
- Turnos alternam automaticamente após cada jogada
- Exceção: casa 8 (jogue novamente) mantém o mesmo jogador
- Cada jogador tem posição e contador de rodadas perdidas próprios
- Personagens sobrepostos recebem offset visual para não se ocultarem
- Primeiro jogador a atingir a casa 20 vence e encerra a partida
- Reinício reseta ambos os jogadores simultaneamente
