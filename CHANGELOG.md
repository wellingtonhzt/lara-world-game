# Changelog

## [0.7.0] - 2026-07-05

### Adicionado
- Seletor de modo no modal de configuração: botões de rádio "👥 2 Jogadores" (padrão) e "👤 1 Jogador"
- Modo 1 Jogador (Humano vs Máquina) — P2 é controlado automaticamente pela máquina
- `players[].isBot` — flag que marca um jogador como controlado pela máquina
- `resolveChallenge()` — bot responde desafios com 60% de chance de acerto (delay de 600ms)
- `resolvePortal()` — bot decide entrar no portal com 50% de chance (delay de 500ms)
- `scheduleBotTurnIfNeeded()` — agenda jogada automática do bot após 1 segundo
- `botTurnScheduled` — flag booleana para evitar agendamento duplicado
- `isSinglePlayer` — flag global que alterna entre modo 1P e 2P
- Tela de vitória (`#victory-overlay`) com confetes animados, fogos serpentina, troféu e botão "Jogar Novamente"
- `handleVictory()` — exibe overlay, desabilita dado, anima personagem vencedor
- CSS `.mode-selector`, `.mode-option`, `.mode-option.selected`, `#setup-screen.mode-1p .player2-card`
- Estilos do overlay de vitória (confetes, serpentina, conteúdo centralizado)

### Alterado
- `setupModalEvents()` — integrado seletor de modo com validação condicional (1P só exige P1)
- `startGame()` — no modo 1 jogador, P2 recebe nome "Máquina", emoji "🤖" e `isBot: true`
- `switchTurn()` — proteção `if (PLAYER_COUNT < 2) return` para modo 1 jogador
- `unlockTurn()` — agora chama `scheduleBotTurnIfNeeded()` para agendar jogada do bot
- `showSetupScreen()` / `hideSetupScreen()` — adaptado para usar `#setup-screen`
- HTML `#setup-screen` — adicionado seletor de modo, removido jQuery (agora JS puro)

### Corrigido
- Casa 5 (🐢 Volte 1 casa) na posição 1: ao voltar para posição 0, o código processava a casa como desafio, abrindo modal indevidamente — corrigido com guarda que impede cascata para casa especial após `voltar` para posição 0
- Botão "Jogar Dado" permanecia desabilitado após vitória — `handleVictory()` agora garante `elements.rollBtn.disabled = true` e reinício reabilita corretamente

## [0.6.0] - 2026-07-03

### Adicionado
- Portal da Floresta na casa 11 com modal de entrada (Entrar / Continuar)
- Mundo da Floresta: mini-trilha de 8 casas com coordenadas em formato de S
- Constantes `FLORESTA_TOTAL`, `florestaPosicoes`, `florestaIcones`, `florestaEspeciais`
- Funções getters world-aware: `getTotalCasas()`, `getPosicoes()`, `getIcones()`, `getCasasEspeciais()`
- `gameState.mundoAtual` — rastreia em qual mundo o jogador está ("principal" | "floresta")
- `gameState.entradaFloresta` — objeto `{1: null, 2: null}` para posição salva por jogador
- `gameState.entrouNoPortal` — flag para evitar reentrada no portal
- Renderização condicional: `renderizarTrilha()` / `renderSvgPath()` / `positionPlayerAt()` / `animatePlayerMovement()` usam getters world-aware
- Casas especiais da floresta: "desafio" (casa 3 e 7), "atalho" (casa 5), "saida-mundo" (casa 8)
- `processSpecialCell` cases "portal" e "saida-mundo" com transição entre mundos
- `jogarDado()` adaptado: ao completar floresta, retorna ao mundo principal com bônus
- CSS `.mundo-floresta` com fundo verde escuro, decorações temáticas (árvores, cogumelos, folhas)
- `#world-indicator` no header indicando mundo atual
- Modo debug: painel com 5 botões ativado por `?debug=1` na URL

### Alterado
- `renderizarTrilha()` — aceita parâmetro opcional `mundo` para renderizar mundo principal ou floresta
- `renderSvgPath()` — aceita parâmetro opcional `posicoes` para gerar caminho no mundo correto
- `positionPlayerAt()` — oculta sprite do outro jogador quando `mundoAtual === "floresta"`
- `switchTurn()` — não alterna turno quando `mundoAtual === "floresta"` (mesmo jogador continua)
- `jogarDado()` — ao final do turno na floresta, volta ao mundo principal com bônus e sem cascatear
- `reiniciarJogo()` — reseta `mundoAtual`, `entradaFloresta`, `entrouNoPortal`
- Casa 5 da floresta: de "avancar" para "atalho" (saída imediata com +2)
- Casas especiais da floresta estilizadas com nomes temáticos

### Corrigido
- `renderizarSvgPath` → `renderSvgPath` (ReferenceError nos cases portal e saída-mundo)
- `entradaFloresta` sendo resetado no bloco `if (extraTurn)` — movido para fora do bloco
- Falta de `switchTurn()` guard — adicionada verificação `mundoAtual !== "floresta"` antes de alternar
- Sprite do jogador não ativo visível na floresta — oculto via `positionPlayerAt()`

## [0.5.0] - 2026-07-03

### Adicionado
- Banco de questões organizado por 6 categorias (Matemática, Português, Animais, Espaço, Natureza, Dinossauros)
- 30 perguntas no total (5 por categoria)
- Função `sortearQuestao()` — sorteia índice aleatório com proteção contra repetição
- `gameState.questoesUsadas` (Set) — rastreia perguntas já sorteadas na partida
- `questoesDisponiveis[]` — array flat construído a partir do banco categorizado
- Reset automático: quando todas as 30 perguntas forem usadas, o Set é limpo e o ciclo recomeça

### Alterado
- `desafios[]` (array fixo) substituído por `bancoQuestoes{}` (objeto categorizado)
- `casasEspeciais` — campos `valor` removidos das casas de desafio (4, 7, 12, 16, 18)
- `processSpecialCell` case "desafio" — agora chama `sortearQuestao()` em vez de `desafios[info.valor]`

### Corrigido
- `reiniciarJogo()` — botão "Jogar Dado" permanecia desabilitado após vitória e reinício; agora é reabilitado com `elements.rollBtn.disabled = false`

## [0.4.0] - 2026-07-03

### Adicionado
- 5 casas de desafio educativo (casas 4, 7, 12, 16, 18)
- Modal de desafio com pergunta e 3 alternativas de múltipla escolha
- Função `showChallengeModal()` — exibe modal e retorna Promise com acerto/erro
- Array `desafios[]` com 5 perguntas temáticas
- Movimento pós-desafio: acertar = avançar 1 casa, errar = voltar 1 casa
- Bloqueio do dado durante desafio (via `gameState.isMoving`)
- Estilos visuais para casas de desafio (roxo) e modal de desafio
- Histórico registra "caiu em desafio", "acertou" e "errou"

### Alterado
- `casasEspeciais{}` expandido de 6 para 11 casas
- `processSpecialCell()` agora trata o tipo "desafio"

## [0.3.0] - 2026-07-03

### Adicionado
- Modal de configuração inicial (setup screen) antes da partida
- Campo de nome personalizado para Jogador 1 e Jogador 2
- Grade de emojis exclusiva para cada jogador (seleção de sprite)
- Botão "Iniciar Jogo" no modal para dar início à partida
- jQuery carregado no HTML para manipulação do DOM
- Funções `showSetupScreen()`, `hideSetupScreen()`, `startGame()`, `setupModalEvents()`
- `reiniciarJogo()` agora retorna ao modal de configuração em vez de resetar o tabuleiro diretamente

### Alterado
- `init()` modificado para exibir o modal e só carregar o tabuleiro após "Iniciar Jogo"
- Nomes dos jogadores agora são definidos via input do modal (fallback para "Jogador 1" / "Jogador 2")
- Emojis dos jogadores agora são definidos via seleção na grade (fallback para 🧒 / 👦)
- Fluxo de reinício alterado: modal → jogo → vitória → modal

## [0.2.0] - 2026-07-02

### Adicionado
- Multiplayer local para 2 jogadores
- Alternância automática de turnos
- Destaque visual do jogador ativo no painel
- Posições individuais para cada jogador
- Personagens lado a lado quando na mesma casa
- Histórico de jogadas
- Função `updateUI()` para sincronização do painel
- Estrutura de dados `players[]` preparada para expansão

### Alterado
- Refatoração do estado do jogo: `posicao` e `rodadasPerdidas` movidos para objeto de cada jogador
- Tabuleiro reposicionado com snake pattern (4 linhas × 5 colunas)
- Células redimensionadas para 88×56px com `transform: translate(-50%, -50%)`
- Caminho SVG suave (Catmull-Rom) substituindo linhas retas
- Personagem Lara como elemento genérico por jogador

### Removido
- Marcador "🏁 INÍCIO" do tabuleiro (casa 1 já indica início)
- Rotações CSS nas células (causavam sobreposição)
- Dependência de `elements.currentPosition` (substituído por posições por jogador)

## [0.1.0] - 2026-07-02

### Adicionado
- MVP inicial do Lara World
- Tabuleiro com 20 casas em grid 5×4
- Sistema de dado virtual (1-6)
- 6 casas especiais com efeitos:
  - Avance 2 casas (casa 3)
  - Volte 1 casa (casa 5)
  - Jogue novamente (casa 8)
  - Perde uma rodada (casa 10)
  - Volte ao início (casa 15)
  - Vitória (casa 20)
- Movimento básico do personagem
- Botão Jogar Dado e Reiniciar
- Mensagens de eventos do jogo
- Docker + Nginx (nginx:alpine)
- docker-compose.yml com porta 8080
- Documentação inicial (README, arquitetura, regras, roadmap)
