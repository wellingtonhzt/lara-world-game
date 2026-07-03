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

### v0.6.0 (Atual) — Mundo da Floresta e Sistema de Portais ✅

- **Portal da Floresta** na casa 11 — modal com opções "Entrar" ou "Continuar"
- **Mundo da Floresta** — mini-trilha de 8 casas com visual temático (fundo verde escuro, decorações)
- **Jogador ativo exclusivo** — apenas o jogador que entrou aparece na floresta
- **Turno bloqueado** — o turno não alterna enquanto o jogador estiver na floresta
- **Casas especiais da floresta**: desafio (casas 3 e 7), atalho de saída (casa 5), saída (casa 8)
- **Posição salva por jogador** — `entradaFloresta: {1: null, 2: null}`
- **Retorno sem cascata** — ao sair da floresta, o bônus não ativa outras casas especiais
- **Modo debug** — `?debug=1` na URL, painel com botões para teste rápido (portal, entrada, atalho, saída, reset)
- Banco de questões com 30 perguntas em 6 categorias
- Sorteio aleatório sem repetição (controle via Set)
- Modal de desafio que bloqueia o dado até resposta
- 12 casas especiais no mundo principal (casa 11 agora é Portal da Floresta)
- Modal de configuração inicial com nomes e sprites personalizáveis
- Tabuleiro visual com trilha serpentina e caminho SVG
- Movimento animado casa por casa (async/await, 180ms/passo)
- Sistema de dado virtual 1-6 com animação de rolagem
- Multiplayer local para 2 jogadores
- Alternância automática de turnos (exceto na floresta)
- Histórico de jogadas
- Sistema de vitória
- Reinício retorna ao modal de configuração
- Design responsivo

### v0.4.0 ✅

- 5 casas de desafio educativo com perguntas fixas
- Modal de desafio e regras de acerto/erro

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
