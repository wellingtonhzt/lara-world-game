/* ============================================
   Lara World — Tutorial Data (src/tutorial/tutorial-data.js)
   9 steps of onboarding content
   ============================================ */

export const TUTORIAL_STEPS = [
  {
    icon: '\uD83C\uDFAE',
    title: 'Escolha como jogar',
    text: 'Jogo Rápido traz uma partida em um mundo. Modo Aventura conecta os cinco mundos e acumula pontos. No Arcade, você joga minigames avulsos.',
    note: 'A campanha do Modo Aventura existe somente na sessão atual e termina se a página for recarregada.'
  },
  {
    icon: '\uD83C\uDF0D',
    title: 'Prepare os participantes',
    text: 'Escolha nomes e personagens para jogar com outra pessoa ou contra a Máquina. No Jogo Rápido, escolha também o mundo da partida.'
  },
  {
    icon: '\uD83C\uDFB2',
    title: 'Quem começa?',
    text: 'Antes da partida, os jogadores rolam o dado. Quem tirar o maior número começa.',
    note: 'Na aventura há um único sorteio: o vencedor começa os mundos 1, 3 e 5; o outro participante começa os mundos 2 e 4.'
  },
  {
    icon: '\uD83C\uDFB2',
    title: 'Role o dado',
    text: 'Na sua vez, toque em "Jogar Dado". Seu personagem avançará pelo tabuleiro.'
  },
  {
    icon: '\uD83D\uDDFA\uFE0F',
    title: 'Conheça as casas',
    text: 'Cada casa pode trazer um evento diferente:',
    items: [
      '\u2753 Desafio',
      '\u23E9 Avançar',
      '\u23EA Voltar',
      '\uD83C\uDFB2 Jogar novamente',
      '\u23F8\uFE0F Pular uma rodada',
      '\uD83D\uDD04 Trocar de posição',
      '\uD83E\uDDE9 \uD83C\uDFC3 \uD83D\uDE80 \uD83C\uDFAF \uD83D\uDC09 Minigames',
      '\uD83D\uDC51 Chegada'
    ]
  },
  {
    icon: '\u2753',
    title: 'Complete desafios',
    text: 'Responda perguntas educativas. No Modo Aventura, cada resposta correta vale 10 pontos e até 2 acertos pontuam por participante em cada mundo.',
    note: 'Resposta incorreta vale zero ponto na aventura.'
  },
  {
    icon: '\uD83C\uDFAE',
    title: 'Jogue os minigames',
    text: 'Algumas casas abrem minigames. No Modo Aventura, uma vitória vale 20 pontos e até 1 minigame pontua por participante em cada mundo.',
    note: 'No Arcade, os minigames são avulsos. Derrotas não retiram pontos da aventura.'
  },
  {
    icon: '\uD83C\uDFC6',
    title: 'Conclua o mundo',
    text: 'O primeiro jogador a alcançar a casa 20 vence o mundo. No Modo Aventura, a vitória vale 30 pontos e o mapa mostra o placar antes da próxima etapa.'
  },
  {
    icon: '\uD83D\uDDFA\uFE0F',
    title: 'Complete a aventura',
    text: 'Termine os cinco mundos para concluir a campanha. Quem tiver mais pontos vence a aventura; em caso de igualdade, o resultado é empate.',
    note: 'Zerar o Lara World significa concluir os cinco mundos e terminar com a maior pontuação.'
  }
];

export const TUTORIAL_SEEN_KEY = 'lara-world-tutorial-seen';
