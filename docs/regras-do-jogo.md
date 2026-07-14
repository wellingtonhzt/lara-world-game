# Regras do Jogo

## Objetivo

Levar seu personagem da casa inicial (posição 0) até a **casa 20** (vitória). O primeiro jogador a atingir ou ultrapassar a casa 20 vence a partida.

## Tela Inicial (Menu Principal)

Ao abrir o jogo, a **Tela Inicial** é exibida com duas opções:

- **⚡ Jogo Rápido** — inicia uma partida no modo Single Player (Humano vs Máquina) com configuração simplificada (apenas nome e sprite do Jogador 1)
- **🏆 Modo Carreira** — botão desabilitado visualmente com texto "(Em Breve)", reservado para futura progressão com fases e pontuação

Clique em **"⚡ Jogo Rápido"** para acessar o modal de configuração e começar a jogar.

## Seletor de Modo

Ao abrir o jogo, o modal de configuração exibe um seletor com duas opções:

- **👥 2 Jogadores** — modo multiplayer padrão (padrão)
- **👤 1 Jogador** — modo Humano vs Máquina

A escolha do modo determina quais campos são exibidos no modal e como o Jogador 2 se comporta.

## Modo 1 Jogador (Humano vs Máquina)

1. Selecione **"👤 1 Jogador"** no seletor de modo.
2. Configure o nome e sprite do **Jogador 1** (você). O card do Jogador 2 é oculto.
3. Clique em **"Iniciar Jogo"** para começar.
4. Você joga primeiro. Clique em **"Jogar Dado"** para sua vez.
5. Após sua jogada, o turno alterna para a **Máquina**, que joga automaticamente após 1 segundo.
6. A máquina realiza a jogada completa: dado, movimento, casas especiais, desafios e portal.
7. **Desafios da máquina**: o bot responde perguntas automaticamente com 60% de chance de acerto (delay de 600ms).
8. **Portal da máquina**: o bot decide entrar no Portal da Floresta com 50% de chance (delay de 500ms).
9. Os turnos alternam entre você e a máquina até alguém vencer.
10. **Chegue na casa 20** para vencer!

## Modo 2 Jogadores (Multiplayer)

1. Ao abrir o jogo, o **modal de configuração** é exibido para definir nomes e sprites de cada jogador.
2. O **Jogador 1** configura seu nome e escolhe um sprite na grade de emojis, depois o **Jogador 2** faz o mesmo.
3. Clique em **"Iniciar Jogo"** para começar a partida.
4. O painel indica claramente de quem é a vez.
5. O jogador ativo clica em **"Jogar Dado"** para sua vez.
6. Após a jogada (incluindo efeitos de casas especiais), o turno alterna automaticamente para o outro jogador.
7. Exceções: a casa **"Jogue novamente"** (casa 8) concede uma jogada extra ao mesmo jogador. O **Mundo da Floresta** também mantém o mesmo jogador até a saída.
8. Cada jogador tem sua própria posição na trilha e seu próprio contador de rodadas perdidas.
9. Se os dois jogadores estiverem na mesma casa, os personagens aparecem lado a lado.
10. **O primeiro jogador a atingir ou ultrapassar a casa 20 vence** — a partida é encerrada imediatamente.

## Sorteio Inicial (Quem Começa)

1. Após configurar os jogadores, um sorteio decide quem joga primeiro.
2. Cada jogador rola um dado clicando em "🎲 Rolar".
3. Quem tirar o maior valor começa.
4. **Empate**: os dados são rolados novamente (máximo de 2 empates consecutivos).
5. **3º empate**: desempate automático — o jogo escolhe um jogador aleatoriamente e exibe uma mensagem divertida.
6. A regra vale para modo 2 jogadores e 1 jogador vs máquina.
7. O dado da partida não é alterado — esta regra vale apenas para o sorteio inicial.

## Jogo da Memória da Floresta (Casa 11)

- Ao cair exatamente na **casa 11**, um modal é exibido com duas opções:
  - **"Entrar no Jogo da Memória"** — o jogador inicia o minigame de memória
  - **"Continuar no tabuleiro"** — o jogador permanece no mundo principal e o turno segue normalmente
- O minigame é um overlay isolado que **não altera** o tabuleiro principal

### Regras do Minigame

- **Tabuleiro**: 12 cartas formando 6 pares com emojis de floresta (🌲🦊🌳🍄🌺🦋)
- **Duração**: 30 segundos (cronômetro visível)
- **Mecânica**: virar no máximo 2 cartas por tentativa
- **Par correto**: cartas permanecem abertas
- **Par incorreto**: cartas ficam visíveis por ~700ms e depois são fechadas
- **Cliques bloqueados**: enquanto duas cartas erradas estiverem sendo exibidas
- **Vitória**: encontrar pelo menos 4 dos 6 pares
- **Continue jogando**: mesmo após atingir 4 pares, o jogador continua até os 30 segundos ou todos os 6 pares
- **Todos os 6 pares**: tabuleiro permanece concluído até o cronômetro terminar

### Resultado

- **4, 5 ou 6 pares**: vitória e bônus de +3 casas
- **0, 1, 2 ou 3 pares**: retorno sem bônus
- **Sem penalidade**: o jogador permanece onde está
- **Bônus sem cascata**: o movimento de bônus não dispara outras casas especiais
- **Result card**: exibe vitória/derrota, pares encontrados, percentual, bônus e botão "Voltar ao tabuleiro"
- **Retorno automático**: após ~5 segundos o jogador retorna ao tabuleiro

## Casas Especiais — Mundo Principal

| Casa | Efeito | Descrição |
|------|--------|-----------|
| 3 | ⭐ Avance 2 casas | O personagem anda 2 casas adicionais. Se cair em outra casa especial, o efeito cascateia. |
| 4 | ❓ Desafio educativo | Abre um modal com pergunta sorteada do Banco de Questões (9 categorias, 128 perguntas). A pergunta é temática por mundo e não se repete na mesma partida. Acertar: avança 1 casa. Errar: volta 1 casa. O movimento não cascateia. |
| 5 | 🐢 Volte 1 casa | O personagem volta 1 casa. Se estiver na casa 1, vai para a posição 0 (fora do tabuleiro). |
| 7 | ❓ Desafio educativo | Mesmo efeito da casa 4. |
| 8 | 🎯 Jogue novamente | O jogador ganha uma jogada extra imediatamente. O turno não alterna. |
| 10 | 😴 Perde uma rodada | O jogador perde a **próxima** rodada. O contador é pessoal de cada jogador. |
| **11** | **🌿 Portal da Floresta** | **Abre modal com opções "Entrar na Floresta" ou "Continuar no Jogo".** |
| 12 | ❓ Desafio educativo | Mesmo efeito da casa 4. |
| 15 | 🔙 Volte ao início | O personagem volta para a posição 0 (fora do tabuleiro). |
| 16 | ❓ Desafio educativo | Mesmo efeito da casa 4. |
| 18 | ❓ Desafio educativo | Mesmo efeito da casa 4. |
|  | 20 | 🏆 Vitória! | O jogador vence a partida. |

## Padrão Visual dos Tabuleiros (v0.29.0-preview)

Regra oficial para apresentação visual das casas em todos os mundos:

**Casas especiais** — cada casa exibe:
- Número da casa
- Ícone funcional exclusivo da ação
- Texto curto da ação (máx. 3 palavras)

**Casas normais** — cada casa exibe:
- Número da casa
- Ícone temático do mundo (único, sem repetição)
- Sem texto descritivo

**Ícones funcionais reservados** (somente casas especiais):
| Ícone | Ação |
|-------|------|
| ❓ | Desafio |
| ⏩ | Avançar |
| ⏪ | Voltar |
| 🎲 | Jogue de novo |
| ⏸️ | Pule a vez |
| 🔄 | Troque de lugar |
| 👑 | Chegada |
| 🧩 | Memória |
| 🏃 | Dino Runner |
| 🚀 | Buraco de Minhoca |
| 🎯 | Match-3 |
| 🐉 | Dragões |

**Regras de repetição:**
- Ícones funcionais podem repetir apenas se representam exatamente a mesma ação (ex: ❓ em 5 casas de Desafio)
- Ícones normais NUNCA se repetem dentro do mesmo mundo
- Ícones normais NUNCA usam ícones funcionais reservados

### Mundo Galáxia — Casas Especiais

| Casa | Tipo | Efeito |
|------|------|--------|
| 4 | 🌊 Avance 2 | O personagem avança 2 casas. |
| 7 | 🔀 Troca Quântica | O personagem troca de posição com o adversário. |
| 10 | ⭐ Desafio educativo | Mesmo efeito da casa 4. |
| 12 | 🌀 Volte 2 | O personagem volta 2 casas. |
| **15** | **🚪 Buraco de Minhoca** | **Abre o minigame MeteoroGame. O jogador controla uma nave e precisa desviar de meteoros. Resultado: vitória (+3 bônus) ou derrota (boardDelta 0, sem penalidade).** |
| 18 | ⚡ Jogue novamente | O jogador ganha uma jogada extra. |

### Seletor de Layout (Galáxia Estelar)

- Ao selecionar a Galáxia Estelar, um seletor visual no topo do tabuleiro permite escolher entre 3 layouts: ⭐ **Padrão** (original), 🪐 **Órbita** (curva orbital) e 🌀 **Espiral** (rotação 360°)
- A escolha persiste entre partidas (salva em `localStorage`)
- O seletor aparece apenas quando o mundo possui 2+ layouts — mundos com layout único (Floresta, Dinossauros) não exibem o seletor

### Mundo Castelo dos Dragões — Casas Especiais

| Casa | Tipo | Efeito |
|------|------|--------|
| 3 | 🏰 Avance 2 | O personagem avança 2 casas. |
| 5 | ❓ Desafio educativo | Mesmo efeito das demais casas de desafio. |
| 7 | 🔙 Volte 1 | O personagem volta 1 casa. |
| 9 | 🎯 Jogue novamente | O jogador ganha uma jogada extra. |
| 11 | 😴 Perde uma rodada | O jogador perde a próxima rodada. |
| 12 | 🐉 Em breve | Casa reservada para evolução futura (sem efeito atual). |
| 14 | ❓ Desafio educativo | Mesmo efeito das demais casas de desafio. |
| **15** | **🐉 Ataque dos Dragões** | **Abre o minigame Ataque dos Dragões. O jogador toca nos dragões para destruí-los antes que alcancem o castelo. Resultado: vitória (+3 bônus) ou derrota (boardDelta 0, sem penalidade).** |
| 16 | 🔥 Volte 2 | O personagem volta 2 casas. |
| 18 | 🔀 Troque de lugar | O personagem troca de posição com o adversário. |
| 20 | 🏆 Vitória! | O jogador vence a partida. |

- O Castelo dos Dragões **não possui submundo**, **não possui portal**
- O layout do tabuleiro é ascendente (escalada até o castelo), começando na base (y=90) e terminando no topo (y=18)

### Minigame: Ataque dos Dragões (Castelo dos Dragões)

- **Acesso**: ao cair na casa 15 do Castelo dos Dragões, o minigame é iniciado automaticamente com contagem regressiva (3, 2, 1, Começar!)
- **Objetivo**: destruir dragões tocando/clique neles antes que alcancem o castelo
- **Duração**: 20 segundos
- **Meta**: acertar pelo menos 15 dragões
- **Defesa**: 3 escudos — cada dragão que alcancem o castelo consome 1 escudo
- **Controles**: clique no mouse ou toque na tela (suporte mobile completo)
- **4 fases de dificuldade**:
  - 0-5s: até 2 dragões simultâneos, velocidade 80
  - 5-10s: até 3 dragões simultâneos, velocidade 100
  - 10-15s: até 4 dragões simultâneos, velocidade 120
  - 15-20s: até 5 dragões simultâneos, velocidade 140
- **Resultado**: vitória (15+ dragões acertados) = +3 casas de bônus | derrota = boardDelta 0 (sem penalidade)
- **Bônus sem cascata**: o movimento de bônus não dispara outras casas especiais
- **Fluxo do Bot**: se a máquina cair na casa 15, o minigame é resolvido automaticamente com 55% de chance de vitória

### Minigame: MeteoroGame (Buraco de Minhoca)

- **Acesso**: ao cair na casa 15 do Mundo Galáxia, um overlay de transição é exibido antes de iniciar o minigame
- **Controles**: setas do teclado (↑ ↓ ← →) ou WASD. Touch/mouse: metade superior da tela sobe, inferior desce, laterais movem horizontalmente
- **Vidas**: 3 vidas. Ao colidir com um meteoro, flash vermelho na tela, nave pisca invulnerável por 1s, texto `💥 -1 Vida!` aparece centralizado
- **Condições de vitória**: sobreviver até o tempo acabar → +3 casas de bônus no tabuleiro
- **Condições de derrota**: perder todas as 3 vidas → boardDelta 0 (nenhuma penalidade, jogador permanece onde está)
- **Tela de resultado**: ao fim, um card glass é exibido sobre o canvas do minigame congelado (cenário espacial visível ao fundo), com resultado (vitória/derrota), vidas restantes, bônus. Botão "Voltar agora" confirma e aplica o resultado (boardDelta 0 na derrota)
- **Fluxo do Bot**: se a máquina cair no Buraco de Minhoca, um overlay exibe a barra "🤖 Máquina está jogando..." com botão "⏭ Pular". Ao clicar, o resultado é simulado e exibido por 2s. Sem interação, auto-resolve após 6s

## Regras Adicionais

- **Ultrapassar a casa 20**: se o valor do dado levar além da casa 20, o personagem para na casa 20 e vence.
- **Rodada perdida**: o contador de rodadas perdidas é individual. Quando um jogador tem rodadas pendentes, seu turno é automaticamente pulado e o contador decrementado.
- **Efeito cascata**: ao cair na casa 3 (avance 2), se a nova casa também for especial, o efeito é aplicado novamente. Isso pode encadear múltiplos eventos.
- **Exceção — desafios não cascateiam**: ao acertar ou errar um desafio (casas 4, 7, 12, 16, 18 e floresta 3, 7), o movimento de +1 ou -1 ocorre sem cascatear para outras casas especiais, evitando loops infinitos.
- **Exceção — saída da floresta não cascateia**: o bônus de +2 (atalho) ou +3 (saída) ao retornar do Mundo da Floresta não ativa casas especiais.
- **Limite do submundo**: ao atingir a última casa de um submundo por avanço automático ou acerto de desafio, o jogador não vence o jogo — ele retorna ao mundo principal com +2 casas de bônus. A vitória só é declarada se o bônux levar à casa 20 do mundo principal.
- **Mundo Aleatório**: ao selecionar "🎲 Mundo Aleatório", um mundo principal é sorteado igualmente entre os 5 disponíveis (Floresta, Dinossauros, Galáxia, Oceanos, Castelo).
- **Sorteio de perguntas**: a cada desafio, uma pergunta é sorteada do Banco de Questões (128 perguntas, 9 categorias). O sorteio é temático por mundo:
  - 🌌 **Galáxia Estelar**: prioriza Espaço, Lógica e Conhecimentos Gerais
  - 🌳 **Floresta Encantada**: prioriza Animais, Natureza, Cores e Formas, Lógica
  - 🦕 **Dinossauros**: prioriza Dinossauros, Animais, Natureza, Matemática
  - 🌊 **Reino dos Oceanos**: prioriza Natureza, Animais, Matemática, Português, Espaço
  - 🐉 **Castelo dos Dragões**: prioriza Lógica, Matemática, Português, Conhecimentos Gerais
  - Se o pool temático acabar, usa o banco geral como fallback
- O jogo evita repetir a mesma pergunta durante a mesma partida (controle via `gameState.questoesUsadas`). Quando todas as perguntas do pool temático forem utilizadas, o ciclo recomeça.
- O bot usa o mesmo algoritmo de sorteio (60% de acerto).
- **Casa 5 na posição 1**: se estiver na casa 1 e cair na casa 5, o personagem volta para a posição 0 e fica fora do tabuleiro. Na próxima jogada, avançará para a casa 1 ou além.
- **Após a vitória**: o jogo é encerrado, o botão "Jogar Dado" é desabilitado e um overlay de vitória com confetes animados, fogos serpentina e troféu é exibido. Duas opções estão disponíveis: **"🔁 Jogar Novamente"** (reinicia no mesmo modo) ou **"🏠 Voltar ao Menu"** (retorna à tela inicial).
- **Reinício**: o botão "Reiniciar" exibe o modal de configuração novamente, permitindo que os jogadores alterem seus nomes e sprites antes de iniciar uma nova partida.
- **Modo debug**: adicione `?debug=1` à URL para ativar um painel com controles de teste. Seção Galáxia: Gal C9, Gal C14, Gal C15 🚪. Seção Minigame: 🎮 Abrir, ✅ Vencer, ❌ Perder, ↩️ Retornar. Seção Castelo dos Dragões: 🐉 C15, 🔄 C18, 🎮 Abrir, ✅ Vencer, ❌ Perder, ↩️ Retornar, 🤖 Bot. Demais seções: Casa 11, Entrar na Floresta, Casa 5 Atalho, Casa 8 Saída, Voltar ao Principal. O modo debug não afeta partidas normais.
