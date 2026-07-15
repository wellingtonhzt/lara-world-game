/* ============================================
   Lara World — Tutorial Data (src/tutorial/tutorial-data.js)
   7 steps of onboarding content
   ============================================ */

export const TUTORIAL_STEPS = [
  {
    icon: '\uD83C\uDF0D',
    title: 'Escolha sua aventura',
    text: 'Escolha um mundo e prepare seu personagem. Cada mundo possui desafios, visual e minigame próprios.'
  },
  {
    icon: '\uD83C\uDFB2',
    title: 'Quem começa?',
    text: 'Antes da partida, os jogadores rolam o dado. Quem tirar o maior número começa.',
    note: 'Se houver muitos empates, o jogo realiza um desempate divertido.'
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
    text: 'Responda perguntas educativas. Acertos podem ajudar você a avançar pelo tabuleiro.'
  },
  {
    icon: '\uD83C\uDFAE',
    title: 'Jogue os minigames',
    text: 'Algumas casas abrem minigames. Vencer pode conceder bônus no tabuleiro. Perder não causa penalidade adicional.',
    note: 'No Modo Arcade, os minigames são jogados sem tabuleiro e sem bônus de casas.'
  },
  {
    icon: '\uD83C\uDFC6',
    title: 'Chegue ao final',
    text: 'O primeiro jogador a alcançar a casa 20 vence a partida.'
  }
];

export const TUTORIAL_SEEN_KEY = 'lara-world-tutorial-seen';
