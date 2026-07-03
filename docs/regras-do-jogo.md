# Regras do Jogo

## Objetivo

Levar seu personagem da casa inicial (posição 0) até a **casa 20** (vitória). O primeiro jogador a atingir ou ultrapassar a casa 20 vence a partida.

## Modo 1 Jogador

1. Clique no botão **"Jogar Dado"** para lançar o dado virtual.
2. O valor do dado (1 a 6) indica quantas casas seu personagem avança.
3. Ao cair em uma casa especial, regras especiais são aplicadas automaticamente.
4. Chegue na **casa 20** para vencer!

## Modo 2 Jogadores (Multiplayer)

1. Ao abrir o jogo, o **modal de configuração** é exibido para definir nomes e sprites de cada jogador.
2. O **Jogador 1** configura seu nome e escolhe um sprite na grade de emojis, depois o **Jogador 2** faz o mesmo.
3. Clique em **"Iniciar Jogo"** para começar a partida.
4. O painel indica claramente de quem é a vez.
5. O jogador ativo clica em **"Jogar Dado"** para sua vez.
6. Após a jogada (incluindo efeitos de casas especiais), o turno alterna automaticamente para o outro jogador.
7. Exceção: a casa **"Jogue novamente"** (casa 8) concede uma jogada extra ao mesmo jogador.
8. Cada jogador tem sua própria posição na trilha e seu próprio contador de rodadas perdidas.
9. Se os dois jogadores estiverem na mesma casa, os personagens aparecem lado a lado.
10. **O primeiro jogador a atingir ou ultrapassar a casa 20 vence** — a partida é encerrada imediatamente.

## Casas Especiais

| Casa | Efeito | Descrição |
|------|--------|-----------|
| 3 | ⭐ Avance 2 casas | O personagem anda 2 casas adicionais. Se cair em outra casa especial, o efeito cascateia. |
| 4 | ❓ Desafio educativo | Abre um modal com pergunta sorteada do Banco de Questões (6 categorias, 30 perguntas). A pergunta é aleatória e não se repete na mesma partida. Acertar: avança 1 casa. Errar: volta 1 casa. O movimento não cascateia. |
| 5 | 🐢 Volte 1 casa | O personagem volta 1 casa. Se estiver na casa 1, vai para a posição 0 (fora do tabuleiro). |
| 7 | ❓ Desafio educativo | Mesmo efeito da casa 4. |
| 8 | 🎯 Jogue novamente | O jogador ganha uma jogada extra imediatamente. O turno não alterna. |
| 10 | 😴 Perde uma rodada | O jogador perde a **próxima** rodada. O contador é pessoal de cada jogador. |
| 12 | ❓ Desafio educativo | Mesmo efeito da casa 4. |
| 15 | 🔙 Volte ao início | O personagem volta para a posição 0 (fora do tabuleiro). |
| 16 | ❓ Desafio educativo | Mesmo efeito da casa 4. |
| 18 | ❓ Desafio educativo | Mesmo efeito da casa 4. |
| 20 | 🏆 Vitória! | O jogador vence a partida. |

## Regras Adicionais

- **Ultrapassar a casa 20**: se o valor do dado levar além da casa 20, o personagem para na casa 20 e vence.
- **Rodada perdida**: o contador de rodadas perdidas é individual. Quando um jogador tem rodadas pendentes, seu turno é automaticamente pulado e o contador decrementado.
- **Efeito cascata**: ao cair na casa 3 (avance 2), se a nova casa também for especial, o efeito é aplicado novamente. Isso pode encadear múltiplos eventos.
- **Exceção — desafios não cascateiam**: ao acertar ou errar um desafio (casas 4, 7, 12, 16, 18), o movimento de +1 ou -1 ocorre sem cascatear para outras casas especiais, evitando loops infinitos.
- **Sorteio de perguntas**: a cada desafio, uma pergunta é sorteada aleatoriamente do Banco de Questões. O jogo evita repetir a mesma pergunta durante a mesma partida. Quando todas as 30 perguntas forem utilizadas, o ciclo recomeça.
- **Casa 5 na posição 1**: se estiver na casa 1 e cair na casa 5, o personagem volta para a posição 0 e fica fora do tabuleiro. Na próxima jogada, avançará para a casa 1 ou além.
- **Após a vitória**: o jogo é encerrado, o botão "Jogar Dado" é desabilitado e uma animação de celebração é exibida. Clique em "Reiniciar" para uma nova partida.
- **Reinício**: o botão "Reiniciar" exibe o modal de configuração novamente, permitindo que os jogadores alterem seus nomes e sprites antes de iniciar uma nova partida.
