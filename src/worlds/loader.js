import { registerAll } from '../engine/world-registry.js';
import { WORLD_IDS } from '../data/world-manifest.js';
import { florestaEncantada } from './floresta/config.js';
import { valeDosDinossauros } from './dinossauros/config.js';

const worldConfigMap = {
  'floresta-encantada': florestaEncantada,
  'dinossauros': valeDosDinossauros,
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
