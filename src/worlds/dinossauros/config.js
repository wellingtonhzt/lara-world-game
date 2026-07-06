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
      '\uD83C\uDF1F', '\uD83C\uDF34', '\uD83E\uDEB4', '\uD83E\uDD5A', '\uD83E\uDD96',
      '\uD83C\uDF0B', '\uD83E\uDEA8', '\uD83E\uDD5A', '\uD83E\uDD95', '\uD83C\uDF0B',
      '\uD83C\uDF34', '\uD83E\uDEB4', '\uD83E\uDD96', '\uD83E\uDD95', '\uD83E\uDEA8',
      '\uD83C\uDF0B', '\uD83E\uDD5A', '\uD83E\uDEB4', '\uD83C\uDF34', '\uD83C\uDFC1',
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
    3: [
      { type: 'move', params: { delta: 2 }, description: '\uD83E\uDEB4 Encontrou um f\u00f3ssil! Avance 2 casas.' },
    ],
    4: [
      { type: 'challenge', description: '\uD83E\uDD5A Desafio do Ninho!' },
    ],
    5: [
      { type: 'move', params: { delta: -1 }, description: '\uD83E\uDD96 Um T-Rex apareceu! Volte 1 casa.' },
    ],
    7: [
      { type: 'challenge', description: '\uD83E\uDEA8 Desafio das Rochas!' },
    ],
    8: [
      { type: 'extraTurn', description: '\uD83E\uDD5A Ninho de dinossauro. Jogue novamente!' },
    ],
    10: [
      { type: 'skipTurn', params: { count: 1 }, description: '\uD83C\uDF0B Vulc\u00e3o ativo! Perdeu uma rodada.' },
    ],
    12: [
      { type: 'challenge', description: '\uD83E\uDEB4 Desafio dos F\u00f3sseis!' },
    ],
    14: [
      { type: 'challenge', description: '\uD83E\uDD95 Desafio das Pegadas!' },
    ],
    15: [
      { type: 'resetPosition', description: '\uD83E\uDEA8 Escorregou nas rochas! Volte ao in\u00edcio.' },
    ],
    16: [
      { type: 'challenge', description: '\uD83C\uDF0B Desafio do Vulc\u00e3o!' },
    ],
    18: [
      { type: 'challenge', description: '\uD83E\uDEB4 Desafio dos Ossos!' },
    ],
    20: [
      { type: 'finishWorld', description: '\uD83C\uDFC1 Voc\u00ea escapou do Vale dos Dinossauros!' },
    ],
  },

  // ── Portals ──

  portals: [],

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
