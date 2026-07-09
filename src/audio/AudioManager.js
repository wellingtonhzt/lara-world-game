import { SOUNDS } from './sounds.js';

const STORAGE_KEY = 'laraAudioConfig';

export class AudioManager {
  constructor() {
    this._ctx = null;
    this._initialized = false;
    this._unlocked = false;
    this._sounds = {};
    this._activeEffects = {};
    this._musicSource = null;
    this._musicBuffer = null;
    this._musicKey = null;
    this._musicGain = null;
    this._masterGain = null;
    this._effectsGain = null;
    this._loadSettings();
  }

  /* ────────────── Public API ────────────── */

  init() {
    if (this._initialized) return;
    this._registerSounds();
    this._initialized = true;
  }

  async play(soundKey) {
    if (!this._initialized) return;
    if (this.muted) return;
    const entry = this._sounds[soundKey];
    if (!entry || !entry.path) return;
    if (entry.category !== 'effects') return;
    try {
      await this._ensureCtx();
      const buffer = await this._decode(entry.path);
      const source = this._ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(this._effectsGain);
      source.start(0);
      this._activeEffects[soundKey] = source;
      source.onended = () => { delete this._activeEffects[soundKey]; };
    } catch {
      /* ignore silently — file not found, decode error, etc. */
    }
  }

  stop(soundKey) {
    const source = this._activeEffects[soundKey];
    if (source) {
      try { source.stop(); } catch { /* already stopped */ }
      delete this._activeEffects[soundKey];
    }
  }

  async playMusic(soundKey) {
    if (!this._initialized) return;
    if (this.muted) return;
    const entry = this._sounds[soundKey];
    if (!entry || !entry.path) return;
    if (entry.category !== 'music') return;
    this.stopMusic();
    this._musicKey = soundKey;
    try {
      await this._ensureCtx();
      const buffer = await this._decode(entry.path);
      this._musicBuffer = buffer;
      this._musicSource = this._ctx.createBufferSource();
      this._musicSource.buffer = buffer;
      this._musicSource.loop = true;
      this._musicSource.connect(this._musicGain);
      this._musicSource.start(0);
    } catch {
      /* ignore silently */
    }
  }

  stopMusic() {
    if (this._musicSource) {
      try { this._musicSource.stop(); } catch { /* already stopped */ }
      this._musicSource = null;
    }
    this._musicBuffer = null;
    this._musicKey = null;
  }

  setMasterVolume(value) {
    this.masterVolume = Math.max(0, Math.min(1, value));
    if (this._masterGain) this._masterGain.gain.value = this.masterVolume;
    this._save();
  }

  get masterVolume() {
    return this._masterVol;
  }

  set masterVolume(v) { this._masterVol = v; }

  setMusicVolume(value) {
    this.musicVolume = Math.max(0, Math.min(1, value));
    if (this._musicGain) this._musicGain.gain.value = this.musicVolume;
    this._save();
  }

  get musicVolume() {
    return this._musicVol;
  }

  set musicVolume(v) { this._musicVol = v; }

  setEffectsVolume(value) {
    this.effectsVolume = Math.max(0, Math.min(1, value));
    if (this._effectsGain) this._effectsGain.gain.value = this.effectsVolume;
    this._save();
  }

  get effectsVolume() {
    return this._effectsVol;
  }

  set effectsVolume(v) { this._effectsVol = v; }

  mute() {
    this.muted = true;
    this.stopMusic();
    this._save();
  }

  unmute() {
    this.muted = false;
    this._save();
  }

  toggleMute() {
    if (this.muted) {
      this.unmute();
    } else {
      this.mute();
    }
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  /* ────────────── Internal ────────────── */

  _registerSounds() {
    for (const [key, cfg] of Object.entries(SOUNDS)) {
      this._sounds[key] = { path: cfg.path || '', category: cfg.category || 'effects' };
    }
  }

  async _ensureCtx() {
    if (this._ctx && this._ctx.state !== 'closed') {
      if (this._ctx.state === 'suspended') await this._ctx.resume();
      return this._ctx;
    }
    this._ctx = new (window.AudioContext || window.webkitAudioContext)();
    this._masterGain = this._ctx.createGain();
    this._masterGain.gain.value = this._masterVol;
    this._masterGain.connect(this._ctx.destination);

    this._musicGain = this._ctx.createGain();
    this._musicGain.gain.value = this._musicVol;
    this._musicGain.connect(this._masterGain);

    this._effectsGain = this._ctx.createGain();
    this._effectsGain.gain.value = this._effectsVol;
    this._effectsGain.connect(this._masterGain);

    if (this._ctx.state === 'suspended') await this._ctx.resume();
    return this._ctx;
  }

  async _decode(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Audio not found: ${path}`);
    const arrayBuffer = await response.arrayBuffer();
    return this._ctx.decodeAudioData(arrayBuffer);
  }

  /* ── Settings persistence ── */

  _loadSettings() {
    this._masterVol = 1.0;
    this._musicVol = 0.5;
    this._effectsVol = 0.8;
    this.muted = false;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (typeof data.masterVolume === 'number') this._masterVol = data.masterVolume;
        if (typeof data.musicVolume === 'number') this._musicVol = data.musicVolume;
        if (typeof data.effectsVolume === 'number') this._effectsVol = data.effectsVolume;
        if (typeof data.muted === 'boolean') this.muted = data.muted;
      }
    } catch {
      /* ignore corrupt localStorage */
    }
  }

  _save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        masterVolume: this._masterVol,
        musicVolume: this._musicVol,
        effectsVolume: this._effectsVol,
        muted: this.muted,
      }));
    } catch {
      /* localStorage full or unavailable */
    }
  }
}
