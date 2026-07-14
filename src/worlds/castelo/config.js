export const casteloDosDragoes = {
  id: 'castelo-dragoes',
  name: '\uD83D\uDC09 Castelo dos Drag\u00F5es',
  description: 'Atravesse muralhas m\u00E1gicas e encare os desafios dos drag\u00F5es!',
  icon: '\uD83D\uDC09',
  thumbnail: null,
  version: '1.0.0',
  type: 'main',
  metadata: {
    default: false,
    sortPriority: 5,
  },

  board: {
    totalCells: 20,
    startCell: 1,
    finishCell: 20,
    pathType: 'linear',
    cells: [
      { id: 1,  x: 10, y: 90 },
      { id: 2,  x: 26, y: 90 },
      { id: 3,  x: 42, y: 90 },
      { id: 4,  x: 58, y: 90 },
      { id: 5,  x: 74, y: 90 },
      { id: 6,  x: 74, y: 72 },
      { id: 7,  x: 58, y: 72 },
      { id: 8,  x: 42, y: 72 },
      { id: 9,  x: 26, y: 72 },
      { id: 10, x: 10, y: 72 },
      { id: 11, x: 10, y: 54 },
      { id: 12, x: 26, y: 54 },
      { id: 13, x: 42, y: 54 },
      { id: 14, x: 58, y: 54 },
      { id: 15, x: 74, y: 54 },
      { id: 16, x: 74, y: 36 },
      { id: 17, x: 58, y: 36 },
      { id: 18, x: 42, y: 36 },
      { id: 19, x: 26, y: 36 },
      { id: 20, x: 10, y: 18 },
    ],
    cellIcons: [
      '\uD83C\uDFF0', '\uD83D\uDC09', '\uD83E\uDEBD', '\u2694\uFE0F', '\u2753',
      '\uD83D\uDEE1\uFE0F', '\uD83E\uDDF1', '\uD83D\uDD25', '\uD83C\uDFB2', '\uD83D\uDC32',
      '\uD83D\uDCA4', '\uD83D\uDC09', '\uD83D\uDC51', '\u2753', '\uD83D\uDD2E',
      '\uD83D\uDC09', '\uD83D\uDD25', '\uD83D\uDD04', '\u2B50', '\uD83C\uDFC6',
    ],
  },

  theme: {
    themeId: 'castelo-dragoes',
    cssClass: 'mundo-castelo',
    background: {
      type: 'gradient',
      value: 'linear-gradient(to bottom, #4a148c 0%, #6a1b9a 20%, #7b1fa2 45%, #4a148c 70%, #311b92 100%)',
    },
    colors: {
      primary: '#7b1fa2',
      secondary: '#ce93d8',
      accent: '#ffd700',
      background: '#311b92',
      text: '#f3e5f5',
      cellDefault: '#6a1b9a',
      cellSpecial: '#4a148c',
    },
    decorations: [
      { type: 'emoji', content: '\uD83C\uDFF0', className: 'deco-castle-1' },
      { type: 'emoji', content: '\uD83C\uDFF0', className: 'deco-castle-2' },
      { type: 'emoji', content: '\uD83D\uDC09', className: 'deco-dragon-1' },
      { type: 'emoji', content: '\uD83D\uDC09', className: 'deco-dragon-2' },
      { type: 'emoji', content: '\u2728', className: 'deco-sparkle-1' },
      { type: 'emoji', content: '\u2728', className: 'deco-sparkle-2' },
      { type: 'emoji', content: '\uD83C\uDF1F', className: 'deco-star-1' },
      { type: 'emoji', content: '\uD83D\uDD25', className: 'deco-fire-1' },
    ],
    music: { theme: null, portal: null, victory: null },
  },

  rules: {
    diceFaces: 6,
    passStartBonus: false,
    allowBackMovement: true,
    slipChance: 0,
    slipDelta: 0,
  },

  objectives: [
    { type: 'reachEnd', params: { cell: 20 }, label: 'Alcan\u00E7ar o topo do castelo!', optional: false },
  ],

  events: {
    3:  [{ type: 'move', params: { delta: 2 }, description: '\uD83E\uDEBD Avance 2' }],
    5:  [{ type: 'challenge', description: '\u2753 Desafio' }],
    7:  [{ type: 'move', params: { delta: -1 }, description: '\uD83E\uDDF1 Volte 1' }],
    9:  [{ type: 'extraTurn', description: '\uD83C\uDFB2 Jogue novamente' }],
    11: [{ type: 'skipTurn', params: { count: 1 }, description: '\uD83D\uDCA4 Perde uma rodada' }],
    12: [{ type: 'placeholder', description: '\uD83D\uDC09 Em breve' }],
    14: [{ type: 'challenge', description: '\u2753 Desafio' }],
    15: [{ type: 'ataque-dragoes', description: '\uD83D\uDC09 Ataque dos Drag\u00F5es \u2014 Proteja o castelo!' }],
    16: [{ type: 'move', params: { delta: -2 }, description: '\uD83D\uDD25 Volte 2' }],
    18: [{ type: 'swap-positions', params: {}, description: '\uD83D\uDD04 Troque de lugar' }],
    20: [{ type: 'finishWorld', description: '\uD83C\uDFC6 Vit\u00F3ria' }],
  },

  portals: [],

  questionCategories: [
    'logica', 'matematica', 'portugues', 'conhecimentosgerais',
  ],

  assets: {
    backgrounds: { main: null, loading: null, victory: null, portal: null },
    sprites: {},
    sounds: { dice: null, move: null, portal: null, challenge: null, victory: null },
    music: { theme: null, portal: null, victory: null },
    ui: { icon: null, banner: null },
  },

  ui: {
    worldName: 'Castelo dos Drag\u00F5es',
    subtitle: 'Atravesse muralhas m\u00E1gicas e encare os desafios dos drag\u00F5es!',
    initialMessage: '\uD83D\uDC09 Bem-vindos ao Castelo dos Drag\u00F5es!',
    setupTitle: 'Preparar Aventura',
    worldIndicator: '\uD83D\uDC09 Castelo dos Drag\u00F5es',
    victoryTitle: 'Castelo Conquistado!',
  },

  customEventHandlers: {},
};
