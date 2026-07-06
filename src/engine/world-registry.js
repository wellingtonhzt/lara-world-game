// ── Error Classes ──

export class WorldNotFoundError extends Error {
  constructor(id) {
    super(`World "${id}" not found in registry`);
    this.name = 'WorldNotFoundError';
    this.worldId = id;
  }
}

export class DuplicateWorldError extends Error {
  constructor(id) {
    super(`World "${id}" is already registered`);
    this.name = 'DuplicateWorldError';
    this.worldId = id;
  }
}

export class InvalidWorldConfigError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidWorldConfigError';
  }
}

export class NoWorldsAvailableError extends Error {
  constructor(detail) {
    const msg = detail
      ? `No worlds available: ${detail}`
      : 'No worlds available after applying the filter';
    super(msg);
    this.name = 'NoWorldsAvailableError';
  }
}

// ── Registry State ──

const _registry = new Map();
let _isLoaded = false;

// ── Helpers ──

function deepFreeze(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Object.isFrozen(obj)) return obj;
  const propNames = Object.getOwnPropertyNames(obj);
  for (const name of propNames) {
    const value = obj[name];
    if (value && typeof value === 'object') {
      deepFreeze(value);
    }
  }
  return Object.freeze(obj);
}

function ensureLoaded() {
  if (!_isLoaded && _registry.size > 0) {
    console.warn('[WorldRegistry] Registry used before loadAllWorlds completed');
  }
}

// ── Validation ──

function validateWorldConfig(config) {
  if (!config || typeof config !== 'object') {
    throw new InvalidWorldConfigError('WorldConfig must be a non-null object');
  }

  const requiredFields = [
    ['id', 'string'],
    ['name', 'string'],
    ['type', 'string'],
    ['version', 'string'],
  ];

  for (const [field, kind] of requiredFields) {
    const val = config[field];
    if (typeof val !== kind || (kind === 'string' && val.length === 0)) {
      throw new InvalidWorldConfigError(
        `Missing or invalid required field "${field}": expected non-empty ${kind}, got ${typeof val}`
      );
    }
  }

  if (config.type !== 'main' && config.type !== 'subworld') {
    throw new InvalidWorldConfigError(
      `Invalid type "${config.type}": must be "main" or "subworld"`
    );
  }

  if (!config.board || typeof config.board !== 'object') {
    throw new InvalidWorldConfigError('Missing required field "board"');
  }

  if (!Number.isInteger(config.board.totalCells) || config.board.totalCells < 1) {
    throw new InvalidWorldConfigError(
      `board.totalCells must be a positive integer, got ${config.board.totalCells}`
    );
  }

  if (!config.board.positions || typeof config.board.positions !== 'object') {
    throw new InvalidWorldConfigError('Missing required field "board.positions"');
  }

  const total = config.board.totalCells;
  const posKeys = Object.keys(config.board.positions)
    .map(Number)
    .filter(k => Number.isInteger(k) && k >= 1 && k <= total);

  if (posKeys.length === 0) {
    throw new InvalidWorldConfigError(
      `board.positions must cover at least one cell in range 1..${total}`
    );
  }

  for (let cell = 1; cell <= total; cell++) {
    const pos = config.board.positions[cell];
    if (!pos || typeof pos.x !== 'number' || typeof pos.y !== 'number') {
      console.warn(
        `[WorldRegistry] World "${config.id}": board.positions[${cell}] is missing or has no x/y coordinates`
      );
    }
  }

  if (!config.objectives || !Array.isArray(config.objectives) || config.objectives.length === 0) {
    throw new InvalidWorldConfigError('objectives must be a non-empty array');
  }

  for (const [i, obj] of config.objectives.entries()) {
    if (typeof obj.type !== 'string' || obj.type.length === 0) {
      throw new InvalidWorldConfigError(`objectives[${i}] missing required field "type"`);
    }
    if (typeof obj.label !== 'string' || obj.label.length === 0) {
      throw new InvalidWorldConfigError(`objectives[${i}] missing required field "label"`);
    }
  }

  if (!config.events || typeof config.events !== 'object') {
    throw new InvalidWorldConfigError('Missing required field "events"');
  }

  const eventKeys = Object.keys(config.events);
  for (const key of eventKeys) {
    const cellNum = Number(key);
    if (!Number.isInteger(cellNum) || cellNum < 1 || cellNum > total) {
      throw new InvalidWorldConfigError(
        `Event key "${key}" is not a valid cell number (1..${total})`
      );
    }
    if (!Array.isArray(config.events[key])) {
      throw new InvalidWorldConfigError(`Events for cell ${key} must be an array`);
    }
  }

  if (config.portals && Array.isArray(config.portals)) {
    for (const [i, portal] of config.portals.entries()) {
      if (!portal.id) {
        throw new InvalidWorldConfigError(`portals[${i}] missing required field "id"`);
      }
      if (typeof portal.sourceCell !== 'number') {
        throw new InvalidWorldConfigError(
          `portals[${i}] ("${portal.id}") missing required field "sourceCell"`
        );
      }
    }
  }

  if (typeof config.requiredEngineVersion === 'string') {
    const warn = `World "${config.id}" requires engine version ${config.requiredEngineVersion}. Ensure the engine is compatible.`;
    console.warn(`[WorldRegistry] ${warn}`);
  }
}

// ── Public API ──

export function register(config) {
  validateWorldConfig(config);

  if (_registry.has(config.id)) {
    throw new DuplicateWorldError(config.id);
  }

  const frozen = deepFreeze(config);
  _registry.set(config.id, frozen);
}

export function registerAll(configs) {
  if (!Array.isArray(configs)) {
    throw new InvalidWorldConfigError('registerAll expects an array of WorldConfig');
  }
  for (const config of configs) {
    register(config);
  }
  _isLoaded = true;
}

export function get(id) {
  ensureLoaded();
  if (!_registry.has(id)) {
    throw new WorldNotFoundError(id);
  }
  return _registry.get(id);
}

export function getSafe(id) {
  ensureLoaded();
  return _registry.get(id) || null;
}

export function exists(id) {
  return _registry.has(id);
}

export function list(filter) {
  ensureLoaded();
  const worlds = Array.from(_registry.values());

  worlds.sort((a, b) => {
    const pa = a.metadata?.sortPriority ?? Infinity;
    const pb = b.metadata?.sortPriority ?? Infinity;
    if (pa !== pb) return pa - pb;
    return 0;
  });

  if (typeof filter === 'function') {
    return worlds.filter(filter);
  }

  return worlds;
}

export function ids() {
  ensureLoaded();
  return Array.from(_registry.keys());
}

export function getDefault() {
  ensureLoaded();

  const worlds = Array.from(_registry.values());

  const explicit = worlds.find(w => w.metadata?.default === true);
  if (explicit) return explicit;

  if (worlds.length === 0) {
    throw new NoWorldsAvailableError('No worlds registered');
  }

  return worlds[0];
}

export function random(filter, options = {}) {
  ensureLoaded();

  let worlds = list(filter);
  const { excludeIds = [] } = options || {};

  if (Array.isArray(excludeIds) && excludeIds.length > 0) {
    worlds = worlds.filter(w => !excludeIds.includes(w.id));
  }

  if (worlds.length === 0) {
    throw new NoWorldsAvailableError();
  }

  return worlds[Math.floor(Math.random() * worlds.length)];
}

export function count() {
  return _registry.size;
}

export function isLoaded() {
  return _isLoaded;
}

export function resolveLoaded() {
  _isLoaded = true;
}

export function reset() {
  _registry.clear();
  _isLoaded = false;
}
