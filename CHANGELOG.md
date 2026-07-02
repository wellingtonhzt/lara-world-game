# Changelog

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
