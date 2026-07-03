# Regras do Jogo

## Objetivo

Levar seu personagem da casa inicial (posição 0) até a **casa 20** (vitória). O primeiro jogador a atingir ou ultrapassar a casa 20 vence a partida.

## Modo 1 Jogador

1. Clique no botão **"Jogar Dado"** para lançar o dado virtual.
2. O valor do dado (1 a 6) indica quantas casas seu personagem avança.
3. Ao cair em uma casa especial, regras especiais são aplicadas automaticamente.
4. Ao cair na **casa 11 (Portal da Floresta)**, um modal pergunta se deseja entrar no Mundo da Floresta.
5. Chegue na **casa 20** para vencer!

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
| 4 | ❓ Desafio educativo | Abre um modal com pergunta sorteada do Banco de Questões (6 categorias, 30 perguntas). A pergunta é aleatória e não se repete na mesma partida. Acertar: avança 1 casa. Errar: volta 1 casa. O movimento não cascateia. |
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

## Regras Adicionais

- **Ultrapassar a casa 20**: se o valor do dado levar além da casa 20, o personagem para na casa 20 e vence.
- **Rodada perdida**: o contador de rodadas perdidas é individual. Quando um jogador tem rodadas pendentes, seu turno é automaticamente pulado e o contador decrementado.
- **Efeito cascata**: ao cair na casa 3 (avance 2), se a nova casa também for especial, o efeito é aplicado novamente. Isso pode encadear múltiplos eventos.
- **Exceção — desafios não cascateiam**: ao acertar ou errar um desafio (casas 4, 7, 12, 16, 18 e floresta 3, 7), o movimento de +1 ou -1 ocorre sem cascatear para outras casas especiais, evitando loops infinitos.
- **Exceção — saída da floresta não cascateia**: o bônus de +2 (atalho) ou +3 (saída) ao retornar do Mundo da Floresta não ativa casas especiais.
- **Sorteio de perguntas**: a cada desafio, uma pergunta é sorteada aleatoriamente do Banco de Questões. O jogo evita repetir a mesma pergunta durante a mesma partida. Quando todas as 30 perguntas forem utilizadas, o ciclo recomeça.
- **Casa 5 na posição 1**: se estiver na casa 1 e cair na casa 5, o personagem volta para a posição 0 e fica fora do tabuleiro. Na próxima jogada, avançará para a casa 1 ou além.
- **Após a vitória**: o jogo é encerrado, o botão "Jogar Dado" é desabilitado e uma animação de celebração é exibida. Clique em "Reiniciar" para uma nova partida.
- **Reinício**: o botão "Reiniciar" exibe o modal de configuração novamente, permitindo que os jogadores alterem seus nomes e sprites antes de iniciar uma nova partida.
- **Modo debug**: adicione `?debug=1` à URL para ativar um painel com 5 botões de teste rápido (Casa 11, Entrar na Floresta, Casa 5 Atalho, Casa 8 Saída, Voltar ao Principal). O modo debug não afeta partidas normais.
