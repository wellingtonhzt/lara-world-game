// ── World: Floresta Encantada ──
//
// Primeiro mundo oficial da Engine Lara World.
// Define o mundo principal (tabuleiro de 20 casas)
// e o submundo Floresta Misteriosa (8 casas).
//
// Esta config espelha exatamente o comportamento atual
// do jogo. Nenhuma regra ou evento foi alterado.

export const florestaEncantada = {

  // ── Metadata ──

  id: 'floresta-encantada',
  name: '\uD83C\uDF33 Floresta Encantada',
  description: 'Aventure-se na floresta m\u00e1gica! Responda desafios, encontre portais e chegue ao final para vencer!',
  icon: '\uD83C\uDF33',
  thumbnail: null,
  version: '1.0.0',
  type: 'main',
  metadata: {
    default: true,
    sortPriority: 1,
  },

  // ── Board ──

  board: {
    totalCells: 20,
    startCell: 1,
    finishCell: 20,
    pathType: 'linear',
    positions: {
       1: { x: 10, y: 10 },
       2: { x: 26, y: 10 },
       3: { x: 42, y: 10 },
       4: { x: 58, y: 10 },
       5: { x: 74, y: 10 },
       6: { x: 74, y: 28 },
       7: { x: 58, y: 28 },
       8: { x: 42, y: 28 },
       9: { x: 26, y: 28 },
      10: { x: 10, y: 28 },
      11: { x: 10, y: 46 },
      12: { x: 26, y: 46 },
      13: { x: 42, y: 46 },
      14: { x: 58, y: 46 },
      15: { x: 74, y: 46 },
      16: { x: 74, y: 64 },
      17: { x: 58, y: 64 },
      18: { x: 42, y: 64 },
      19: { x: 26, y: 64 },
      20: { x: 10, y: 82 },
    },
    cellIcons: [
      '\uD83C\uDF1F', '\uD83C\uDF38', '\uD83C\uDF08', '\u2B50', '\uD83E\uDD8B',
      '\uD83C\uDF40', '\uD83C\uDF88', '\uD83D\uDC31', '\uD83C\uDF6D', '\uD83C\uDF80',
      '\uD83C\uDF3B', '\uD83D\uDC30', '\uD83C\uDF6C', '\uD83E\uDD84', '\uD83C\uDFAA',
      '\uD83D\uDC3C', '\uD83C\uDF49', '\uD83D\uDC36', '\uD83C\uDFA0', '\uD83D\uDC51',
    ],
  },

  // ── Theme ──

  theme: {
    themeId: 'floresta-encantada',
    cssClass: 'mundo-floresta-encantada',
    background: {
      type: 'gradient',
      value: 'linear-gradient(to bottom, #87ceeb 0%, #b5dffa 25%, #b5e8b5 55%, #7ec850 75%, #5daa3a 100%)',
    },
    colors: {
      primary: '#e91e63',
      secondary: '#a8845a',
      accent: '#f9a825',
      background: '#fff8f0',
      text: '#4a3520',
      cellDefault: '#fef7e6',
      cellSpecial: '#fff8e1',
    },
    decorations: [
      { type: 'emoji', content: '\u2601\uFE0F', className: 'deco-cloud-1' },
      { type: 'emoji', content: '\u2601\uFE0F', className: 'deco-cloud-2' },
      { type: 'emoji', content: '\u2601\uFE0F', className: 'deco-cloud-3' },
      { type: 'emoji', content: '\uD83C\uDF24\uFE0F', className: 'deco-sun' },
      { type: 'emoji', content: '\uD83C\uDF33', className: 'deco-tree-1' },
      { type: 'emoji', content: '\uD83C\uDF32', className: 'deco-tree-2' },
      { type: 'emoji', content: '\uD83C\uDF37', className: 'deco-flower-1' },
      { type: 'emoji', content: '\uD83C\uDF3B', className: 'deco-flower-2' },
      { type: 'emoji', content: '\uD83C\uDF38', className: 'deco-flower-3' },
      { type: 'emoji', content: '\uD83C\uDF3A', className: 'deco-flower-4' },
    ],
    music: {
      theme: null,
      portal: null,
      victory: null,
    },
  },

  // ── Rules ──

  rules: {
    diceFaces: 6,
    passStartBonus: false,
    allowBackMovement: true,
    slipChance: 0,
    slipDelta: 0,
  },

  // ── Objectives ──

  objectives: [
    {
      type: 'reachEnd',
      params: { cell: 20 },
      label: 'Chegar ao final do mundo!',
      optional: false,
    },
  ],

  // ── Events ──
  //
  // Mapa: casa → array de eventos
  // Os eventos são executados na ordem do array.
  // Eventos de movimento devem vir por último.

  events: {
    3: [
      { type: 'move', params: { delta: 2 }, description: 'Avance 2 casas!' },
    ],
    4: [
      { type: 'challenge', description: 'Desafio!' },
    ],
    5: [
      { type: 'move', params: { delta: -1 }, description: 'Volte 1 casa!' },
    ],
    7: [
      { type: 'challenge', description: 'Desafio!' },
    ],
    8: [
      { type: 'extraTurn', description: 'Jogue novamente!' },
    ],
    10: [
      { type: 'skipTurn', params: { count: 1 }, description: 'Perdeu uma rodada!' },
    ],
    11: [
      { type: 'portal', params: { portalId: 'portal-floresta-misteriosa' }, description: '\uD83C\uDF3F Portal da Floresta' },
    ],
    12: [
      { type: 'challenge', description: 'Desafio!' },
    ],
    15: [
      { type: 'resetPosition', description: 'Volte para o in\u00edcio!' },
    ],
    16: [
      { type: 'challenge', description: 'Desafio!' },
    ],
    18: [
      { type: 'challenge', description: 'Desafio!' },
    ],
    20: [
      { type: 'finishWorld', description: '\uD83C\uDFC6 Chegada!' },
    ],
  },

  // ── Portals ──

  portals: [
    {
      id: 'portal-floresta-misteriosa',
      name: '\uD83C\uDF32 Floresta Misteriosa',
      description: 'Uma floresta densa e sombria cheia de enigmas.',
      sourceCell: 11,
      type: 'fixed',
      targetWorldId: 'floresta-misteriosa',
      entrance: {
        message: 'Voc\u00ea encontrou o Portal da Floresta! Deseja entrar?',
        effect: null,
        requiresConfirmation: true,
        requirements: null,
      },
      exitBehavior: {
        returnCell: null,
        bonusCells: 0,
        message: '\u2728 Retornou ao mundo principal!',
        clearsPenalties: false,
      },
      lifetime: {
        maxActivations: null,
        expiresAfterTurn: null,
        expiresOnComplete: false,
      },
    },
  ],

  // ── Question Categories ──
  //
  // Categorias de perguntas disponíveis neste mundo.
  // Referenciam o catálogo global em data/questions/

  questionCategories: [
    'matematica',
    'portugues',
    'animais',
    'espaco',
    'natureza',
    'dinossauros',
  ],

  // ── Assets ──

  assets: {
    backgrounds: {
      main: null,
      loading: null,
      victory: null,
      portal: null,
    },
    sprites: {},
    sounds: {
      dice: null,
      move: null,
      portal: null,
      challenge: null,
      victory: null,
    },
    music: {
      theme: null,
      portal: null,
      victory: null,
    },
    ui: {
      icon: null,
      banner: null,
    },
  },

  // ── UI ──

  ui: {
    worldName: 'Floresta Encantada',
    subtitle: 'A aventura da Lara come\u00e7a aqui!',
    initialMessage: '\uD83C\uDFAE Bem-vindos ao Lara World!',
    setupTitle: 'Preparar Jogo',
    worldIndicator: '\uD83C\uDF3F Mundo da Floresta',
    victoryTitle: 'Vit\u00f3ria!',
  },

  // ── Custom Event Handlers ──
  //
  // Handlers para tipos de evento que não existem no EventProcessor.
  // Serão implementados quando o config for conectado ao motor.

  customEventHandlers: {
    // shortcut: usado no submundo Floresta Misteriosa (casa 5)
    // Deve retornar ao mundo principal com bônus de 2 casas
    shortcut: null,

    // worldExit: usado no submundo Floresta Misteriosa (casa 8)
    // Deve retornar ao mundo principal com bônus de 3 casas
    worldExit: null,
  },
};

// ── Subworld: Floresta Misteriosa ──

export const florestaMisteriosa = {
  id: 'floresta-misteriosa',
  name: '\uD83C\uDF32 Floresta Misteriosa',
  description: 'Um submundo denso e sombrio dentro da Floresta Encantada.',
  icon: '\uD83C\uDF32',
  thumbnail: null,
  version: '1.0.0',
  type: 'subworld',

  board: {
    totalCells: 8,
    startCell: 1,
    finishCell: 8,
    pathType: 'linear',
    positions: {
      1: { x: 12, y: 20 },
      2: { x: 30, y: 20 },
      3: { x: 48, y: 22 },
      4: { x: 66, y: 30 },
      5: { x: 70, y: 52 },
      6: { x: 52, y: 62 },
      7: { x: 34, y: 62 },
      8: { x: 16, y: 70 },
    },
    cellIcons: [
      '\uD83C\uDF32', '\uD83C\uDF44', '\uD83E\uDD8A', '\uD83C\uDF33',
      '\uD83D\uDC3F\uFE0F', '\uD83C\uDF43', '\uD83E\uDD89', '\uD83D\uDC51',
    ],
  },

  theme: {
    themeId: 'floresta-misteriosa',
    cssClass: 'mundo-floresta',
    background: {
      type: 'gradient',
      value: 'linear-gradient(to bottom, #1a3c1a 0%, #2d5f2d 50%, #1e4d1e 100%)',
    },
    colors: {
      primary: '#2e7d32',
      secondary: '#5d4037',
      accent: '#ffd54f',
      background: '#1a3c1a',
      text: '#e8f5e9',
      cellDefault: '#2e5e2e',
      cellSpecial: '#3d7a3d',
    },
    decorations: [
      { type: 'emoji', content: '\uD83C\uDF32', className: 'floresta-deco-tree-1' },
      { type: 'emoji', content: '\uD83C\uDF32', className: 'floresta-deco-tree-2' },
      { type: 'emoji', content: '\uD83C\uDF33', className: 'floresta-deco-tree-3' },
      { type: 'emoji', content: '\uD83C\uDF44', className: 'floresta-deco-mushroom-1' },
      { type: 'emoji', content: '\uD83C\uDF44', className: 'floresta-deco-mushroom-2' },
      { type: 'emoji', content: '\uD83C\uDF43', className: 'floresta-deco-leaf-1' },
      { type: 'emoji', content: '\uD83C\uDF43', className: 'floresta-deco-leaf-2' },
      { type: 'emoji', content: '\uD83C\uDF3A', className: 'floresta-deco-flower' },
    ],
    music: {
      theme: null,
      portal: null,
      victory: null,
    },
  },

  rules: {
    diceFaces: 6,
    passStartBonus: false,
    allowBackMovement: true,
    slipChance: 0,
    slipDelta: 0,
  },

  objectives: [
    {
      type: 'reachEnd',
      params: { cell: 8 },
      label: 'Completar a Floresta Misteriosa!',
      optional: false,
    },
  ],

  events: {
    3: [
      { type: 'challenge', description: '\uD83D\uDC3E Desafio da Floresta!' },
    ],
    5: [
      { type: 'shortcut', params: { bonusCells: 2 }, description: '\uD83C\uDF3F Atalho de Sa\u00edda' },
    ],
    7: [
      { type: 'challenge', description: '\uD83E\uDD89 Enigma do Guardi\u00e3o!' },
    ],
    8: [
      { type: 'worldExit', params: { bonusCells: 3 }, description: '\uD83D\uDEAA Sa\u00edda da Floresta' },
    ],
  },

  portals: [],

  questionCategories: [
    'natureza',
    'animais',
  ],

  assets: {
    backgrounds: {
      main: null,
      loading: null,
      victory: null,
      portal: null,
    },
    sprites: {},
    sounds: {
      dice: null,
      move: null,
      portal: null,
      challenge: null,
      victory: null,
    },
    music: {
      theme: null,
      portal: null,
      victory: null,
    },
    ui: {
      icon: null,
      banner: null,
    },
  },

  ui: {
    worldName: 'Floresta Misteriosa',
    subtitle: 'Um submundo de enigmas e desafios.',
    initialMessage: '\uD83C\uDF3F Bem-vindo \u00e0 Floresta Misteriosa!',
    worldIndicator: '\uD83C\uDF3F Mundo da Floresta',
    victoryTitle: 'Floresta Conclu\u00edda!',
  },
};
