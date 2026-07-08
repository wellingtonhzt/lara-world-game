export const valeDosDinossauros = {

  // ── Metadata ──

  id: 'dinossauros',
  name: '\uD83E\uDD96 Vale dos Dinossauros',
  description: 'Explore um vale pr\u00e9-hist\u00f3rico cheio de dinossauros, f\u00f3sseis e vulc\u00f5es ativos! Responda desafios, desvie de perigos e seja o primeiro a escapar!',
  icon: '\uD83E\uDD96',
  thumbnail: null,
  version: '1.0.0',
  type: 'main',
  metadata: {
    default: false,
    sortPriority: 2,
  },

  // ── Board ──

  board: {
    totalCells: 20,
    startCell: 1,
    finishCell: 20,
    pathType: 'linear',
    cells: [
      { id: 1,  x: 15, y: 12 },
      { id: 2,  x: 29, y: 10 },
      { id: 3,  x: 43, y: 12 },
      { id: 4,  x: 57, y: 10 },
      { id: 5,  x: 71, y: 12 },
      { id: 6,  x: 71, y: 34 },
      { id: 7,  x: 57, y: 32 },
      { id: 8,  x: 43, y: 34 },
      { id: 9,  x: 29, y: 32 },
      { id: 10, x: 15, y: 34 },
      { id: 11, x: 17, y: 54 },
      { id: 12, x: 31, y: 56 },
      { id: 13, x: 45, y: 54 },
      { id: 14, x: 59, y: 56 },
      { id: 15, x: 73, y: 54 },
      { id: 16, x: 73, y: 74 },
      { id: 17, x: 59, y: 76 },
      { id: 18, x: 45, y: 74 },
      { id: 19, x: 31, y: 76 },
      { id: 20, x: 17, y: 84 },
    ],
    cellIcons: [
      '\uD83C\uDF1F', '\uD83E\uDEB4', '\uD83C\uDF3F', '\uD83E\uDD95', '\uD83C\uDF34',
      '\uD83E\uDEA8', '\u26F0\uFE0F', '\uD83E\uDD5A', '\uD83C\uDF0B', '\uD83C\uDF40',
      '\uD83E\uDD96', '\uD83D\uDC3E', '\uD83E\uDEB4', '\uD83E\uDEA8', '\uD83C\uDF34',
      '\uD83E\uDEA8', '\uD83C\uDF0B', '\uD83E\uDD85', '\uD83E\uDD96', '\uD83C\uDFC1',
    ],
  },

  // ── Theme ──

  theme: {
    themeId: 'vale-dinossauros',
    cssClass: 'mundo-vale-dinossauros',
    background: {
      type: 'gradient',
      value: 'linear-gradient(to bottom, #f4e4c1 0%, #e8d5a3 30%, #c9a96e 60%, #8b6914 100%)',
    },
    colors: {
      primary: '#e65100',
      secondary: '#795548',
      accent: '#ff6f00',
      background: '#fff3e0',
      text: '#3e2723',
      cellDefault: '#fff8e1',
      cellSpecial: '#ffe0b2',
    },
    decorations: [
      { type: 'emoji', content: '\u2601\uFE0F', className: 'deco-cloud-1' },
      { type: 'emoji', content: '\u2601\uFE0F', className: 'deco-cloud-2' },
      { type: 'emoji', content: '\u2601\uFE0F', className: 'deco-cloud-3' },
      { type: 'emoji', content: '\uD83C\uDF24\uFE0F', className: 'deco-sun' },
      { type: 'emoji', content: '\uD83C\uDF34', className: 'deco-palm-1' },
      { type: 'emoji', content: '\uD83C\uDF34', className: 'deco-palm-2' },
      { type: 'emoji', content: '\uD83E\uDEA8', className: 'deco-rock-1' },
      { type: 'emoji', content: '\uD83E\uDEA8', className: 'deco-rock-2' },
      { type: 'emoji', content: '\uD83C\uDF0B', className: 'deco-volcano' },
      { type: 'emoji', content: '\uD83E\uDD96', className: 'deco-dino' },
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
      label: 'Escapar do Vale dos Dinossauros!',
      optional: false,
    },
  ],

  // ── Events ──

  events: {
    2: [
      { type: 'challenge', description: '\uD83E\uDEB4 Desafio' },
    ],
    4: [
      { type: 'move', params: { delta: 3 }, description: '\uD83E\uDD95 Avance 3' },
    ],
    6: [
      { type: 'move', params: { delta: -2 }, description: '\uD83E\uDEA8 Volte 2' },
    ],
    8: [
      { type: 'extraTurn', description: '\uD83E\uDD5A Jogue novamente' },
    ],
      9: [
      { type: 'challenge', description: '\uD83C\uDF0B Desafio' },
    ],
    10: [
      { type: 'portal', params: { portalId: 'portal-caverna-fosseis' }, description: '\uD83E\uDEB4 Portal' },
    ],
    11: [
      { type: 'move', params: { delta: -4 }, description: '\uD83E\uDD96 Volte 4' },
    ],
    13: [
      { type: 'challenge', description: '\uD83D\uDC3E Desafio' },
    ],
    15: [
      { type: 'move', params: { delta: 1 }, description: '\uD83C\uDF34 Avance 1' },
    ],
    17: [
      { type: 'skipTurn', params: { count: 1 }, description: '\uD83C\uDF0B Perde 1 rodada' },
    ],
    19: [
      { type: 'challenge', description: '\uD83E\uDD85 Desafio' },
    ],
    20: [
      { type: 'finishWorld', description: '\uD83C\uDFC1 Vit\u00f3ria' },
    ],
  },

  // ── Portals ──

  portals: [
    {
      id: 'portal-caverna-fosseis',
      name: '\uD83E\uDEB4 Caverna dos F\u00f3sseis',
      description: 'Uma antiga caverna cheia de f\u00f3sseis e cristais.',
      sourceCell: 10,
      type: 'fixed',
      targetWorldId: 'caverna-dos-fosseis',
      entrance: {
        message: 'Voc\u00EA encontrou a entrada de uma caverna antiga! Deseja explorar?',
        effect: null,
        requiresConfirmation: true,
        requirements: null,
      },
      exitBehavior: {
        returnCell: null,
        bonusCells: 0,
        message: '\u2728 Retornou ao Vale dos Dinossauros!',
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

  questionCategories: [
    'dinossauros',
    'natureza',
    'animais',
    'matematica',
    'portugues',
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
    worldName: 'Vale dos Dinossauros',
    subtitle: 'Aventura pr\u00e9-hist\u00f3rica espera por voc\u00ea!',
    initialMessage: '\uD83E\uDD96 Bem-vindos ao Vale dos Dinossauros!',
    setupTitle: 'Preparar Expedi\u00e7\u00e3o',
    worldIndicator: '\uD83C\uDF0B Vale dos Dinossauros',
    victoryTitle: 'Voc\u00ea escapou!',
  },

  // ── Custom Event Handlers ──

  customEventHandlers: {},
};

export const cavernaDosFosseis = {
  id: 'caverna-dos-fosseis',
  name: '\uD83E\uDEB4 Caverna dos F\u00f3sseis',
  description: 'Uma antiga caverna onde paleont\u00f3logos encontraram f\u00f3sseis gigantes, cristais brilhantes e o esqueleto de um temido T-Rex.',
  icon: '\uD83E\uDEB4',
  thumbnail: null,
  version: '1.0.0',
  type: 'subworld',

  board: {
    totalCells: 8,
    startCell: 1,
    finishCell: 8,
    pathType: 'linear',
    positions: {
      1: { x: 10, y: 15 },
      2: { x: 28, y: 15 },
      3: { x: 46, y: 18 },
      4: { x: 64, y: 22 },
      5: { x: 72, y: 42 },
      6: { x: 58, y: 58 },
      7: { x: 38, y: 62 },
      8: { x: 18, y: 66 },
    },
    cellIcons: [
      '\uD83D\uDEAA', '\uD83D\uDC8E', '\uD83E\uDEB4', '\uD83E\uDEA8',
      '\uD83E\uDEA8', '\uD83D\uDC80', '\u2620\uFE0F', '\uD83D\uDEAA',
    ],
  },

  theme: {
    themeId: 'caverna-dos-fosseis',
    cssClass: 'mundo-caverna-fosseis',
    background: {
      type: 'gradient',
      value: 'linear-gradient(to bottom, #2d1b0e 0%, #4a3020 30%, #3a2515 60%, #1a0f08 100%)',
    },
    colors: {
      primary: '#ff8f00',
      secondary: '#5d4037',
      accent: '#ffd54f',
      background: '#2d1b0e',
      text: '#f5e6d3',
      cellDefault: '#4a3020',
      cellSpecial: '#5d4037',
    },
    decorations: [
      { type: 'emoji', content: '\uD83D\uDDA4', className: 'caverna-deco-crystal-1' },
      { type: 'emoji', content: '\uD83D\uDDA4', className: 'caverna-deco-crystal-2' },
      { type: 'emoji', content: '\uD83E\uDEB4', className: 'caverna-deco-fossil-1' },
      { type: 'emoji', content: '\uD83E\uDEB4', className: 'caverna-deco-fossil-2' },
      { type: 'emoji', content: '\uD83E\uDD96', className: 'caverna-deco-trex' },
      { type: 'emoji', content: '\uD83E\uDEA8', className: 'caverna-deco-rock' },
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
      label: 'Explorar a caverna e retornar ao Vale dos Dinossauros!',
      optional: false,
    },
  ],

  events: {
    2: [
      { type: 'move', params: { delta: 1 }, description: '\uD83D\uDC8E Avance 1 casa' },
    ],
    3: [
      { type: 'challenge', description: '\uD83E\uDEB4 Desafio' },
    ],
    5: [
      { type: 'move', params: { delta: -1 }, description: '\uD83E\uDEA8 Volte 1 casa' },
    ],
    7: [
      { type: 'worldExit', params: { bonusCells: 0 }, description: '\u2620\uFE0F Sa\u00edda r\u00e1pida' },
    ],
    8: [
      { type: 'worldExit', params: { bonusCells: 3 }, description: '\uD83D\uDEAA Sa\u00edda' },
    ],
  },

  portals: [],

  questionCategories: [
    'dinossauros',
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
    sprites: {
      cristais: null,
      fossil: null,
      ovo: null,
      trex: null,
      caverna: null,
    },
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
    worldName: 'Caverna dos F\u00f3sseis',
    subtitle: 'Antigas cavernas de f\u00f3sseis e cristais.',
    initialMessage: '\uD83E\uDEB4 Bem-vindo \u00e0 Caverna dos F\u00f3sseis!',
    worldIndicator: '\uD83E\uDEB4 Caverna dos F\u00f3sseis',
    victoryTitle: 'Caverna Explorada!',
  },

  customEventHandlers: {},
};
