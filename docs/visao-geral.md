# Visão Geral do Lara World

## O que é?

Lara World é um jogo de trilha infantil multiplayer para navegador, onde os jogadores percorrem um caminho de 20 casas até a linha de chegada. Controlado por um dado virtual, o jogo possui casas especiais que aceleram ou dificultam o progresso, e suporta 2 jogadores no mesmo dispositivo com alternância automática de turnos.

## Público-alvo

Crianças em idade pré-escolar e escolar (3 a 10 anos), mas divertido para todas as idades. O modo multiplayer é ideal para irmãos, amigos ou pais e filhos jogarem juntos.

## Plataforma

Navegador web (Chrome, Firefox, Edge, Safari). Sem necessidade de instalação ou cadastro.

## Conceito do Jogo

O tabuleiro é uma trilha serpentina com 20 casas posicionadas em snake pattern (4 linhas × 5 colunas). Um caminho SVG suave conecta as casas, criando uma trilha visual que guia os jogadores do início (canto superior esquerdo) até a chegada (canto inferior esquerdo). Cada casa exibe um ícone temático, seu número e, quando especial, uma descrição do efeito.

## Principais Funcionalidades

### v0.4.0 (Atual) — Desafios Educativos ✅

- 5 casas de desafio educativo com perguntas de múltipla escolha
- Modal de desafio que bloqueia o dado até resposta
- Acerto: avança 1 casa | Erro: volta 1 casa
- Movimento pós-desafio não cascateia (evita loops infinitos)
- Modal de configuração inicial com nomes e sprites personalizáveis
- Grade de emojis exclusiva para cada jogador (seleção independente)
- Tabuleiro visual com trilha serpentina e caminho SVG
- Movimento animado casa por casa (async/await, 180ms/passo)
- Sistema de dado virtual 1-6 com animação de rolagem
- 11 casas especiais com efeitos automáticos
- Multiplayer local para 2 jogadores
- Alternância automática de turnos
- Destaque visual do jogador ativo
- Personagens lado a lado quando na mesma casa
- Histórico de jogadas
- Sistema de vitória (primeiro a chegar na casa 20)
- Reinício retorna ao modal de configuração
- Design responsivo

### v0.3.0 ✅

- Modal de configuração inicial com nomes e sprites
- Reinício retorna ao modal de configuração

### v0.2.0 ✅

- Multiplayer local para 2 jogadores
- Alternância automática de turnos
- Personagens lado a lado quando na mesma casa
- Histórico de jogadas
- Design responsivo

### v0.1.0 ✅

- MVP para 1 jogador
- Lógica de dado e movimento
- Casas especiais básicas
- Docker + Nginx

## Próximos Passos

Ver [roadmap.md](./roadmap.md) para as evoluções planejadas.
