export const galaxiaEstelar = {
  id: 'galaxia-estelar',
  name: '\uD83C\uDF0C Gal\u00E1xia Estelar',
  description: 'Viaje pelo espa\u00E7o! Desvie de meteoros no Buraco de Minhoca e chegue ao fim da gal\u00E1xia!',
  icon: '\uD83C\uDF0C',
  thumbnail: null,
  version: '1.0.0',
  type: 'main',
  metadata: {
    default: false,
    sortPriority: 3,
  },

  board: {
    totalCells: 20,
    startCell: 1,
    finishCell: 20,
    pathType: 'linear',
    cells: [
      { id: 1,  x: 15, y: 8 },
      { id: 2,  x: 29, y: 8 },
      { id: 3,  x: 43, y: 8 },
      { id: 4,  x: 57, y: 8 },
      { id: 5,  x: 71, y: 8 },
      { id: 6,  x: 71, y: 28 },
      { id: 7,  x: 57, y: 28 },
      { id: 8,  x: 43, y: 28 },
      { id: 9,  x: 29, y: 28 },
      { id: 10, x: 15, y: 28 },
      { id: 11, x: 15, y: 48 },
      { id: 12, x: 29, y: 48 },
      { id: 13, x: 43, y: 48 },
      { id: 14, x: 57, y: 48 },
      { id: 15, x: 71, y: 48 },
      { id: 16, x: 71, y: 68 },
      { id: 17, x: 57, y: 68 },
      { id: 18, x: 43, y: 68 },
      { id: 19, x: 29, y: 68 },
      { id: 20, x: 15, y: 84 },
    ],
    cellIcons: [
      '\u2B50', '\uD83C\uDF1F', '\uD83C\uDF20', '\uD83D\uDE80', '\uD83C\uDF0D',
      '\uD83C\uDF0E', '\u2604\uFE0F', '\uD83C\uDF12', '\uD83D\uDD2D', '\uD83E\uDE90',
      '\uD83C\uDF1B', '\uD83C\uDF1E', '\u2728', '\uD83C\uDF15', '\uD83D\uDE80',
      '\uD83C\uDF0A', '\uD83C\uDF1C', '\uD83D\uDE80', '\uD83C\uDF0C', '\uD83D\uDC51',
    ],
  },

  theme: {
    themeId: 'galaxia-estelar',
    cssClass: 'mundo-galaxia',
    background: {
      type: 'gradient',
      value: 'linear-gradient(to bottom, #0a0a2e 0%, #1a1a4e 25%, #0d0d3b 50%, #1a0a2e 75%, #0a0a1e 100%)',
    },
    colors: {
      primary: '#7c4dff',
      secondary: '#b388ff',
      accent: '#e040fb',
      background: '#0a0a2e',
      text: '#e0e0ff',
      cellDefault: '#1a1a4e',
      cellSpecial: '#2a1a5e',
    },
    decorations: [
      { type: 'emoji', content: '\u2B50', className: 'deco-star-1' },
      { type: 'emoji', content: '\u2B50', className: 'deco-star-2' },
      { type: 'emoji', content: '\u2B50', className: 'deco-star-3' },
      { type: 'emoji', content: '\uD83C\uDF1F', className: 'deco-sun' },
      { type: 'emoji', content: '\uD83C\uDF1B', className: 'deco-moon' },
      { type: 'emoji', content: '\u2604\uFE0F', className: 'deco-comet-1' },
      { type: 'emoji', content: '\u2604\uFE0F', className: 'deco-comet-2' },
      { type: 'emoji', content: '\uD83C\uDF12', className: 'deco-planet-1' },
      { type: 'emoji', content: '\uD83D\uDE80', className: 'deco-rocket' },
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
      params: { cell: 20 },
      label: 'Chegar ao fim da gal\u00E1xia!',
      optional: false,
    },
  ],

  events: {
    3: [
      { type: 'move', params: { delta: 2 }, description: '\uD83C\uDF0A Avance 2' },
    ],
    5: [
      { type: 'challenge', description: '\u2B50 Desafio' },
    ],
     7: [
        { type: 'swap-positions', params: {}, description: '\uD83C\uDF00 Troca' },
      ],
    9: [
      { type: 'extraTurn', description: '\u26A1 Jogue novamente' },
    ],
    12: [
      { type: 'challenge', description: '\uD83C\uDF20 Desafio' },
    ],
    14: [
      { type: 'move', params: { delta: -3 }, description: '\u2604\uFE0F Volte 3' },
    ],
    15: [
      { type: 'buraco-minhoca', description: '\uD83D\uDE80 Buraco de Minhoca!' },
    ],
    16: [
      { type: 'skipTurn', params: { count: 1 }, description: '\u2744\uFE0F Perde 1 rodada' },
    ],
    18: [
      { type: 'challenge', description: '\uD83C\uDF1F Desafio' },
    ],
    20: [
      { type: 'finishWorld', description: '\uD83C\uDFC1 Chegada!' },
    ],
  },

  portals: [],

  questionCategories: [
    'espaco',
    'matematica',
    'natureza',
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
    worldName: 'Gal\u00E1xia Estelar',
    subtitle: 'Aventura nas estrelas!',
    initialMessage: '\uD83C\uDF0C Bem-vindos \u00E0 Gal\u00E1xia Estelar!',
    setupTitle: 'Preparar Miss\u00E3o Espacial',
    worldIndicator: '\uD83C\uDF0C Gal\u00E1xia Estelar',
    victoryTitle: 'Gal\u00E1xia Conquistada!',
  },

  customEventHandlers: {},
};
