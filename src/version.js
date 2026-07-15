export const APP_VERSION = 'v0.32.0-preview';

export function getCacheBust() {
  return `v=${encodeURIComponent(APP_VERSION)}`;
}
