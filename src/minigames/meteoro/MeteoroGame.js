export class MeteoroGame {
  constructor(container, onComplete) {
    this.container = container;
    this.onComplete = onComplete;
    this.canvas = null;
    this.ctx = null;
    this.rafId = null;
    this.running = false;
    this.state = 'IDLE';

    this.ship = { x: 0, y: 0, width: 40, height: 32 };
    this.meteoros = [];
    this.stars = [];
    this.lives = 3;
    this.timeLeft = 20;
    this.lastSpawn = 0;
    this.score = 0;
    this.width = 0;
    this.height = 0;
    this.keys = { left: false, right: false, up: false, down: false };
    this.touchX = null;
    this.touchY = null;
    this.touchActive = false;
    this._dragLastX = null;
    this._dragLastY = null;
    this.isMobile = window.innerWidth < 768;
    this.debugMode = /[?&]debug=1/.test(location.search);
    this.shipBottomMargin = this.isMobile ? 56 : 24;

    this.invulnerableUntil = 0;
    this.flashTimer = 0;
    this.lifeLostText = '';
    this.lifeLostTextTimer = 0;
    this.hitPauseTimer = 0;

    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._onTouchStart = this._onTouchStart.bind(this);
    this._onTouchMove = this._onTouchMove.bind(this);
    this._onTouchEnd = this._onTouchEnd.bind(this);
    this._onPointerDown = this._onPointerDown.bind(this);
    this._onPointerMove = this._onPointerMove.bind(this);
    this._onPointerUp = this._onPointerUp.bind(this);
    this._loop = this._loop.bind(this);
  }

  start() {
    this.state = 'PLAYING';
    this.lives = 3;
    this.timeLeft = 20;
    this.meteoros = [];
    this.hitPauseTimer = 0;
    this.invulnerableUntil = 0;
    this.flashTimer = 0;
    this.lifeLostText = '';
    this.lifeLostTextTimer = 0;
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'meteoro-canvas';
    this.canvas.setAttribute('tabindex', '0');
    this.container.appendChild(this.canvas);

    this._resize();
    this._initStars();
    this.running = true;
    this.lastSpawn = performance.now();

    document.addEventListener('keydown', this._onKeyDown);
    document.addEventListener('keyup', this._onKeyUp);
    document.addEventListener('touchstart', this._onTouchStart, { passive: false });
    document.addEventListener('touchend', this._onTouchEnd, { passive: false });
    document.addEventListener('touchmove', this._onTouchMove, { passive: false });
    document.addEventListener('pointerdown', this._onPointerDown);
    document.addEventListener('pointermove', this._onPointerMove);
    document.addEventListener('pointerup', this._onPointerUp);

    this._loop(performance.now());
  }

  stop() {
    this.state = 'IDLE';
    this.running = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    document.removeEventListener('keydown', this._onKeyDown);
    document.removeEventListener('keyup', this._onKeyUp);
    document.removeEventListener('touchstart', this._onTouchStart);
    document.removeEventListener('touchend', this._onTouchEnd);
    document.removeEventListener('touchmove', this._onTouchMove);
    document.removeEventListener('pointerdown', this._onPointerDown);
    document.removeEventListener('pointermove', this._onPointerMove);
    document.removeEventListener('pointerup', this._onPointerUp);
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    this.canvas = null;
    this.ctx = null;
  }

  stopEarly() {
    if (this.state !== 'PLAYING') return;
    this.state = 'FAIL';
    this.running = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this._cleanup();
    this.onComplete({ status: 'fail', bonus: 0, lives: this.lives, timeLeft: Math.ceil(this.timeLeft) });
  }

  _cleanup() {
    document.removeEventListener('keydown', this._onKeyDown);
    document.removeEventListener('keyup', this._onKeyUp);
    document.removeEventListener('touchstart', this._onTouchStart);
    document.removeEventListener('touchend', this._onTouchEnd);
    document.removeEventListener('touchmove', this._onTouchMove);
    document.removeEventListener('pointerdown', this._onPointerDown);
    document.removeEventListener('pointermove', this._onPointerMove);
    document.removeEventListener('pointerup', this._onPointerUp);
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    this.canvas = null;
    this.ctx = null;
  }

  _resize() {
    const rect = this.container.getBoundingClientRect();
    this.width = rect.width || 600;
    this.height = rect.height || 400;
    if (this.canvas) {
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.canvas.style.width = this.width + 'px';
      this.canvas.style.height = this.height + 'px';
      this.ctx = this.canvas.getContext('2d');
    }
    const shipW = this.isMobile
      ? Math.round(Math.min(this.width * 0.18, 80))
      : Math.max(28, Math.round(this.width * 0.068));
    const shipH = Math.round(shipW * 0.8);
    this.ship.width = shipW;
    this.ship.height = shipH;
    this.ship.x = this.width / 2 - shipW / 2;
    this.ship.y = this.height - shipH - this.shipBottomMargin;
  }

  _initStars() {
    this.stars = [];
    for (let i = 0; i < 60; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        r: Math.random() * 1.8 + 0.4,
        a: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 0.3 + 0.1,
      });
    }
  }

  _spawnMeteoro() {
    const baseSize = Math.max(8, this.width * 0.025);
    const size = Math.random() * baseSize * 1.5 + baseSize;
    const baseSpeed = (Math.random() * 1.8 + 1.2) * (this.isMobile ? 0.82 : 1.0);
    const speed = baseSpeed * (400 / Math.max(this.height, 300));
    this.meteoros.push({
      x: Math.random() * (this.width - size * 2) + size,
      y: -size,
      size: size,
      speed: speed,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.05,
    });
  }

  _onKeyDown(e) {
    switch (e.key) {
      case 'ArrowLeft': case 'a': this.keys.left = true; e.preventDefault(); break;
      case 'ArrowRight': case 'd': this.keys.right = true; e.preventDefault(); break;
      case 'ArrowUp': case 'w': this.keys.up = true; e.preventDefault(); break;
      case 'ArrowDown': case 's': this.keys.down = true; e.preventDefault(); break;
    }
  }

  _onKeyUp(e) {
    switch (e.key) {
      case 'ArrowLeft': case 'a': this.keys.left = false; e.preventDefault(); break;
      case 'ArrowRight': case 'd': this.keys.right = false; e.preventDefault(); break;
      case 'ArrowUp': case 'w': this.keys.up = false; e.preventDefault(); break;
      case 'ArrowDown': case 's': this.keys.down = false; e.preventDefault(); break;
    }
  }

  _posFromEvent(e) {
    const rect = this.canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  /* ── Mobile: relative drag (touch anywhere on canvas) ── */

  _onTouchStart(e) {
    if (!this.canvas || this.state !== 'PLAYING') return;
    if (e.target !== this.canvas) return;
    e.preventDefault();
    const t = this._posFromEvent(e.touches[0]);
    this._dragLastX = t.x;
    this._dragLastY = t.y;
    this.touchActive = true;
  }

  _onTouchMove(e) {
    if (!this.canvas || !this.touchActive || this.state !== 'PLAYING') return;
    if (e.target !== this.canvas) return;
    e.preventDefault();
    const t = this._posFromEvent(e.touches[0]);
    const deltaX = t.x - this._dragLastX;
    const deltaY = t.y - this._dragLastY;
    this.ship.x += deltaX;
    this.ship.y += deltaY;
    const pad = Math.max(2, this.ship.width * 0.08);
    this.ship.x = Math.max(pad, Math.min(this.width - this.ship.width - pad, this.ship.x));
    this.ship.y = Math.max(pad, Math.min(this.height - this.ship.height - pad, this.ship.y));
    this._dragLastX = t.x;
    this._dragLastY = t.y;
  }

  _onTouchEnd(e) {
    if (e.target !== this.canvas) return;
    e.preventDefault();
    this.touchActive = false;
    this._dragLastX = null;
    this._dragLastY = null;
  }

  /* ── Desktop pointer: quadrant-based + canvas guard ── */

  _onPointerDown(e) {
    if (!this.canvas || e.pointerType === 'touch') return;
    if (e.target !== this.canvas) return;
    e.preventDefault();
    this.canvas.setPointerCapture(e.pointerId);
    const t = this._posFromEvent(e);
    this.touchX = t.x;
    this.touchY = t.y;
    this.touchActive = true;
  }

  _onPointerMove(e) {
    if (!this.canvas || !this.touchActive || e.pointerType === 'touch') return;
    if (e.target !== this.canvas) return;
    e.preventDefault();
    const t = this._posFromEvent(e);
    this.touchX = t.x;
    this.touchY = t.y;
  }

  _onPointerUp(e) {
    if (!this.canvas || e.pointerType === 'touch') return;
    if (e.target !== this.canvas) return;
    e.preventDefault();
    this.touchX = null;
    this.touchY = null;
    this.touchActive = false;
  }

  _update(dt) {
    if (this.state !== 'PLAYING') return;

    if (this.hitPauseTimer > 0) {
      this.hitPauseTimer -= dt * 1000;
      if (this.hitPauseTimer < 0) this.hitPauseTimer = 0;
      return;
    }

    const halfW = this.width / 2;
    const halfH = this.height / 2;

    if (this.touchActive && this.touchX !== null) {
      const shipSpeed = 260 * (this.width / 600);
      if (this.touchX < halfW) this.ship.x -= shipSpeed * dt;
      if (this.touchX >= halfW) this.ship.x += shipSpeed * dt;
      if (this.touchY !== null && this.touchY < halfH) this.ship.y -= shipSpeed * dt;
      if (this.touchY !== null && this.touchY >= halfH) this.ship.y += shipSpeed * dt;
    }

    if (this.keys.left) this.ship.x -= 260 * (this.width / 600) * dt;
    if (this.keys.right) this.ship.x += 260 * (this.width / 600) * dt;
    if (this.keys.up) this.ship.y -= 260 * (this.width / 600) * dt;
    if (this.keys.down) this.ship.y += 260 * (this.width / 600) * dt;

    const pad = Math.max(2, this.ship.width * 0.08);
    this.ship.x = Math.max(pad, Math.min(this.width - this.ship.width - pad, this.ship.x));
    this.ship.y = Math.max(pad, Math.min(this.height - this.ship.height - pad, this.ship.y));

    this.timeLeft -= dt;
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this._end(true);
      return;
    }

    const now = performance.now();
    if (now - this.lastSpawn > 700) {
      this._spawnMeteoro();
      this.lastSpawn = now;
      if (Math.random() < 0.3) {
        this._spawnMeteoro();
      }
    }

    for (let i = this.meteoros.length - 1; i >= 0; i--) {
      const m = this.meteoros[i];
      m.y += m.speed * 120 * dt;
      m.rotation += m.rotSpeed;
      if (m.y > this.height + m.size) {
        this.meteoros.splice(i, 1);
      }
    }

    if (this.invulnerableUntil > now) return;

    const hitboxInset = 0.1;
    const shipRect = {
      x: this.ship.x + this.ship.width * hitboxInset,
      y: this.ship.y + this.ship.height * hitboxInset,
      w: this.ship.width * (1 - hitboxInset * 2),
      h: this.ship.height * (1 - hitboxInset * 2),
    };

    for (let i = this.meteoros.length - 1; i >= 0; i--) {
      const m = this.meteoros[i];
      const meteorR = m.size * 0.5;
      if (
        m.x - meteorR < shipRect.x + shipRect.w &&
        m.x + meteorR > shipRect.x &&
        m.y - meteorR < shipRect.y + shipRect.h &&
        m.y + meteorR > shipRect.y
      ) {
        this.meteoros.splice(i, 1);
        this.lives--;

        if (this.lives <= 0) {
          this._end(false);
          return;
        }

        this._removeNearbyMeteoros(shipRect);
        this.hitPauseTimer = 800;
        this.invulnerableUntil = performance.now() + 1000;
        this.flashTimer = 200;
        this.lifeLostText = '\uD83D\uDCA5 -1 Vida!';
        this.lifeLostTextTimer = 800;
        return;
      }
    }
  }

  _removeNearbyMeteoros(shipRect) {
    const clearZone = Math.max(60, this.width * 0.18);
    const cx = shipRect.x + shipRect.w / 2;
    const cy = shipRect.y + shipRect.h / 2;
    for (let i = this.meteoros.length - 1; i >= 0; i--) {
      const m = this.meteoros[i];
      const dx = m.x - cx;
      const dy = m.y - cy;
      if (Math.sqrt(dx * dx + dy * dy) < clearZone) {
        this.meteoros.splice(i, 1);
      }
    }
  }

  _end(success) {
    this.state = success ? 'SUCCESS' : 'FAIL';
    this.flashTimer = 0;
    this.lifeLostText = '';
    this.lifeLostTextTimer = 0;
    this._draw();
    setTimeout(() => {
      this.onComplete({ status: success ? 'success' : 'fail', bonus: success ? 3 : 0, lives: this.lives, timeLeft: Math.ceil(this.timeLeft) });
    }, 1000);
  }

  _draw() {
    const ctx = this.ctx;
    if (!ctx) return;

    const now = performance.now();
    const isTerminal = this.state === 'SUCCESS' || this.state === 'FAIL';

    if (!isTerminal && this.flashTimer > 0) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
      ctx.fillRect(0, 0, this.width, this.height);
      this.flashTimer -= 16;
    }

    ctx.fillStyle = '#05051a';
    ctx.fillRect(0, 0, this.width, this.height);

    for (const s of this.stars) {
      ctx.globalAlpha = s.a + Math.sin(now * 0.001 * s.speed) * 0.15;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    for (const m of this.meteoros) {
      ctx.save();
      ctx.translate(m.x, m.y);
      ctx.rotate(m.rotation);
      const s = m.size;
      ctx.fillStyle = '#ff6b35';
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.7);
      ctx.lineTo(s * 0.6, s * 0.4);
      ctx.lineTo(0, s * 0.1);
      ctx.lineTo(-s * 0.6, s * 0.4);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#ffaa44';
      ctx.beginPath();
      ctx.arc(0, -s * 0.1, s * 0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.save();
    if (!isTerminal && this.invulnerableUntil > now) {
      ctx.globalAlpha = 0.5 + Math.sin(now * 0.02) * 0.3;
    }
    ctx.translate(this.ship.x, this.ship.y);
    ctx.fillStyle = '#7c4dff';
    ctx.beginPath();
    ctx.moveTo(this.ship.width / 2, 0);
    ctx.lineTo(this.ship.width, this.ship.height);
    ctx.lineTo(this.ship.width * 0.7, this.ship.height * 0.75);
    ctx.lineTo(this.ship.width / 2, this.ship.height * 0.85);
    ctx.lineTo(this.ship.width * 0.3, this.ship.height * 0.75);
    ctx.lineTo(0, this.ship.height);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#b388ff';
    ctx.beginPath();
    ctx.arc(this.ship.width / 2, this.ship.height * 0.3, Math.max(4, this.ship.width * 0.12), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.globalAlpha = 1;

    if (this.debugMode) {
      const hi = 0.1;
      const sx = this.ship.x + this.ship.width * hi;
      const sy = this.ship.y + this.ship.height * hi;
      const sw = this.ship.width * (1 - hi * 2);
      const sh = this.ship.height * (1 - hi * 2);
      ctx.strokeStyle = 'rgba(0, 255, 0, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(sx, sy, sw, sh);
      for (const m of this.meteoros) {
        const mr = m.size * 0.5;
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.6)';
        ctx.beginPath();
        ctx.arc(m.x, m.y, mr, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    const hudSize = Math.max(12, Math.round(this.width * 0.032));
    const hudY = Math.max(18, Math.round(this.height * 0.05));
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${hudSize}px sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText('\u2764\uFE0F '.repeat(Math.max(0, this.lives)), Math.max(8, this.width * 0.025), hudY);

    ctx.textAlign = 'right';
    const timeColor = this.timeLeft < 5 ? '#ff4444' : '#ffffff';
    ctx.fillStyle = timeColor;
    ctx.font = `bold ${Math.round(hudSize * 1.2)}px monospace`;
    ctx.fillText(Math.ceil(this.timeLeft) + 's', this.width - Math.max(8, this.width * 0.025), hudY);

    if (!isTerminal && this.lifeLostTextTimer > 0) {
      this.lifeLostTextTimer -= 16;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ff4444';
      ctx.font = `bold ${Math.round(hudSize * 1.8)}px sans-serif`;
      ctx.fillText(this.lifeLostText, this.width / 2, this.height / 2 - this.height * 0.04);
    }

    if (this.debugMode) {
      ctx.textAlign = 'left';
      ctx.fillStyle = '#88ff88';
      ctx.font = `${Math.max(9, Math.round(this.width * 0.022))}px monospace`;
      ctx.fillText('DEBUG HITBOX', 6, this.height - 8);
    }
  }

  _loop(timestamp) {
    const isTerminal = this.state === 'SUCCESS' || this.state === 'FAIL';

    if (!isTerminal && !this.running) {
      if (this.rafId) { cancelAnimationFrame(this.rafId); this.rafId = null; }
      return;
    }

    if (!isTerminal) {
      if (!this._lastTime) { this._lastTime = timestamp; }
      const dt = Math.min((timestamp - this._lastTime) / 1000, 0.05);
      this._lastTime = timestamp;
      this._update(dt);
    }

    this._draw();
    this.rafId = requestAnimationFrame(this._loop);
  }

  destroy() {
    this.stop();
  }
}
