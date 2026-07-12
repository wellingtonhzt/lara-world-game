export const APP_VERSION = 'v0.17.0-preview';

export function getCacheBust() {
  return `v=${encodeURIComponent(APP_VERSION)}`;
}
