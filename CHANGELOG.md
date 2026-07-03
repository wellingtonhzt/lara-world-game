# Changelog

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
