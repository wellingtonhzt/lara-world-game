import { registerAll } from '../engine/world-registry.js';
import { WORLD_IDS } from '../data/world-manifest.js';

// ── Explicit static imports ──
// World configs are imported explicitly here (no dynamic import()).
// When adding a new world:
//   1. Uncomment the import for its config
//   2. Add it to worldConfigMap
//
// import florestaEncantada from './floresta-encantada/config.js';
// import valeDinossauros from './vale-dinossauros/config.js';
// import galaxiaEstelar from './galaxia-estelar/config.js';
// import reinoOceanos from './reino-oceanos/config.js';
// import casteloDragoes from './castelo-dragoes/config.js';

const worldConfigMap = {
  // 'floresta-encantada': florestaEncantada,
  // 'vale-dinossauros': valeDinossauros,
  // 'galaxia-estelar': galaxiaEstelar,
  // 'reino-oceanos': reinoOceanos,
  // 'castelo-dragoes': casteloDragoes,
};

export function loadAllWorlds() {
  const configs = [];

  for (const id of WORLD_IDS) {
    const config = worldConfigMap[id];

    if (config) {
      configs.push(config);
    } else {
      console.warn(
        `[WorldLoader] No config module found for world "${id}". ` +
        `Ensure the import is added to worlds/loader.js.`
      );
    }
  }

  if (configs.length > 0) {
    registerAll(configs);
  }

  console.log(`[WorldLoader] ${configs.length} world(s) loaded`);

  return configs;
}
