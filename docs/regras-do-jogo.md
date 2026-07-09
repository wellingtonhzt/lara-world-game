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

## Portal da Floresta (Casa 11)

- Ao cair exatamente na **casa 11**, um modal é exibido com duas opções:
  - **"Entrar na Floresta"** — o jogador é transportado para o Mundo da Floresta
  - **"Continuar no Jogo"** — o jogador permanece no mundo principal e o turno segue normalmente
- A posição atual do jogador no mundo principal é salva automaticamente ao entrar na floresta
- Cada jogador tem sua própria posição de entrada salva (objeto `{1, 2}`)

## Mundo da Floresta

- Mini-trilha de **8 casas** com visual temático verde escuro e decorações de floresta
- O jogador que entrou controla o turno exclusivamente — **não há alternância** enquanto estiver na floresta
- O sprite do outro jogador **não aparece** no tabuleiro da floresta
- O dado funciona normalmente (1 a 6) dentro da floresta

### Casas Especiais da Floresta

| Casa | Efeito | Descrição |
|------|--------|-----------|
| 3 | ❓ Desafio da Floresta | Pergunta educativa sorteada do banco (mesmo sistema do mundo principal). Acertar: avança 1 casa. Errar: volta 1 casa. Não cascateia. |
| 5 | 🌿 Atalho de Saída | O jogador sai imediatamente da floresta e volta ao mundo principal, **avançando 2 casas** extras. O bônus não cascateia. |
| 7 | 🦉 Enigma do Guardião | Pergunta educativa sorteada do banco. Acertar: avança 1 casa. Errar: volta 1 casa. Não cascateia. |
| 8 | 🚪 Saída da Floresta | O jogador sai imediatamente da floresta e volta ao mundo principal, **avançando 3 casas** extras. O bônus não cascateia. |

- Ao sair da floresta (casa 5 ou 8), o jogador é posicionado de volta no mundo principal a partir da posição salva, com o bônus aplicado
- O bônus de saída **não ativa** outras casas especiais (não cascateia)
- Se o bônus de saída levar à vitória (casa 20+), o jogo termina normalmente

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
 | 20 | 🏆 Vitória! | O jogador vence a partida. |

### Mundo Galáxia — Casas Especiais

| Casa | Tipo | Efeito |
|------|------|--------|
| 4 | 🌊 Avance 2 | O personagem avança 2 casas. |
| 7 | 🔀 Troca Quântica | O personagem troca de posição com o adversário. |
| 10 | ⭐ Desafio educativo | Mesmo efeito da casa 4. |
| 12 | 🌀 Volte 2 | O personagem volta 2 casas. |
| **15** | **🚪 Buraco de Minhoca** | **Abre o minigame MeteoroGame. O jogador controla uma nave e precisa desviar de meteoros. Resultado: vitória (+3 bônus) ou derrota (-2 penalidade).** |
| 18 | ⚡ Jogue novamente | O jogador ganha uma jogada extra. |

### Minigame: MeteoroGame (Buraco de Minhoca)

- **Acesso**: ao cair na casa 15 do Mundo Galáxia, um overlay de transição é exibido antes de iniciar o minigame
- **Controles**: setas do teclado (↑ ↓ ← →) ou WASD. Touch/mouse: metade superior da tela sobe, inferior desce, laterais movem horizontalmente
- **Vidas**: 3 vidas. Ao colidir com um meteoro, flash vermelho na tela, nave pisca invulnerável por 1s, texto `💥 -1 Vida!` aparece centralizado
- **Condições de vitória**: sobreviver até o tempo acabar → +3 casas de bônus no tabuleiro
- **Condições de derrota**: perder todas as 3 vidas → -2 casas de penalidade
- **Tela de resultado**: ao fim, um card glass é exibido sobre o canvas do minigame congelado (cenário espacial visível ao fundo), com resultado (vitória/derrota), vidas restantes, bônus. Botão "Voltar agora" confirma e aplica o bônus/penalidade
- **Fluxo do Bot**: se a máquina cair no Buraco de Minhoca, um overlay exibe a barra "🤖 Máquina está jogando..." com botão "⏭ Pular". Ao clicar, o resultado é simulado e exibido por 2s. Sem interação, auto-resolve após 6s

## Regras Adicionais

- **Ultrapassar a casa 20**: se o valor do dado levar além da casa 20, o personagem para na casa 20 e vence.
- **Rodada perdida**: o contador de rodadas perdidas é individual. Quando um jogador tem rodadas pendentes, seu turno é automaticamente pulado e o contador decrementado.
- **Efeito cascata**: ao cair na casa 3 (avance 2), se a nova casa também for especial, o efeito é aplicado novamente. Isso pode encadear múltiplos eventos.
- **Exceção — desafios não cascateiam**: ao acertar ou errar um desafio (casas 4, 7, 12, 16, 18 e floresta 3, 7), o movimento de +1 ou -1 ocorre sem cascatear para outras casas especiais, evitando loops infinitos.
- **Exceção — saída da floresta não cascateia**: o bônus de +2 (atalho) ou +3 (saída) ao retornar do Mundo da Floresta não ativa casas especiais.
- **Sorteio de perguntas**: a cada desafio, uma pergunta é sorteada do Banco de Questões (128 perguntas, 9 categorias). O sorteio é temático por mundo:
  - 🌌 **Galáxia Estelar**: prioriza Espaço, Lógica e Conhecimentos Gerais
  - 🌳 **Floresta** (principal + misteriosa): prioriza Animais, Natureza, Cores e Formas, Lógica
  - 🦕 **Dinossauros** (Vale + Caverna): prioriza Dinossauros, Animais, Natureza, Matemática
  - Se o pool temático acabar, usa o banco geral como fallback
- O jogo evita repetir a mesma pergunta durante a mesma partida (controle via `gameState.questoesUsadas`). Quando todas as perguntas do pool temático forem utilizadas, o ciclo recomeça.
- O bot usa o mesmo algoritmo de sorteio (60% de acerto).
- **Casa 5 na posição 1**: se estiver na casa 1 e cair na casa 5, o personagem volta para a posição 0 e fica fora do tabuleiro. Na próxima jogada, avançará para a casa 1 ou além.
- **Após a vitória**: o jogo é encerrado, o botão "Jogar Dado" é desabilitado e um overlay de vitória com confetes animados, fogos serpentina e troféu é exibido. Duas opções estão disponíveis: **"🔁 Jogar Novamente"** (reinicia no mesmo modo) ou **"🏠 Voltar ao Menu"** (retorna à tela inicial).
- **Reinício**: o botão "Reiniciar" exibe o modal de configuração novamente, permitindo que os jogadores alterem seus nomes e sprites antes de iniciar uma nova partida.
- **Modo debug**: adicione `?debug=1` à URL para ativar um painel com controles de teste. Seção Galáxia: Gal C9, Gal C14, Gal C15 🚪. Seção Minigame: 🎮 Abrir, ✅ Vencer, ❌ Perder, ↩️ Retornar. Demais seções: Casa 11, Entrar na Floresta, Casa 5 Atalho, Casa 8 Saída, Voltar ao Principal. O modo debug não afeta partidas normais.
