const ASSETS_BASE = '../../assets/minigames/memoria-floresta';

function assetUrl(relativePath) {
  return new URL(`${ASSETS_BASE}/${relativePath}`, import.meta.url).href;
}

export const CARD_BACK_URL = assetUrl('card-back.webp');

export const PAIR_ASSETS = {
  raposa:    { url: assetUrl('pairs/raposa.webp'),    emoji: '\uD83E\uDD8A' },
  coruja:    { url: assetUrl('pairs/coruja.webp'),    emoji: '\uD83E\uDD89' },
  borboleta: { url: assetUrl('pairs/borboleta.webp'), emoji: '\uD83E\uDD8B' },
  cogumelo:  { url: assetUrl('pairs/cogumelo.webp'),  emoji: '\uD83C\uDF44' },
  flor:      { url: assetUrl('pairs/flor.webp'),      emoji: '\uD83C\uDF3A' },
  esquilo:   { url: assetUrl('pairs/esquilo.webp'),   emoji: '\uD83E\uDD8F' },
};

export const PAIR_KEYS = Object.keys(PAIR_ASSETS);

export const CARD_BACK_EMOJI = '\uD83C\uDF3F';
