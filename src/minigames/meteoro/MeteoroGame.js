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
    this.isMobile = window.innerWidth < 768;
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
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
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
    this.canvas.addEventListener('touchstart', this._onTouchStart, { passive: false });
    this.canvas.addEventListener('touchend', this._onTouchEnd, { passive: false });
    this.canvas.addEventListener('touchmove', this._onTouchMove, { passive: false });
    this.canvas.addEventListener('mousedown', this._onMouseDown);
    this.canvas.addEventListener('mouseup', this._onMouseUp);
    this.canvas.addEventListener('mousemove', this._onMouseMove);

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
    if (this.canvas) {
      this.canvas.removeEventListener('touchstart', this._onTouchStart);
      this.canvas.removeEventListener('touchend', this._onTouchEnd);
      this.canvas.removeEventListener('touchmove', this._onTouchMove);
      this.canvas.removeEventListener('mousedown', this._onMouseDown);
      this.canvas.removeEventListener('mouseup', this._onMouseUp);
      this.canvas.removeEventListener('mousemove', this._onMouseMove);
    }
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
    if (this.canvas) {
      this.canvas.removeEventListener('touchstart', this._onTouchStart);
      this.canvas.removeEventListener('touchend', this._onTouchEnd);
      this.canvas.removeEventListener('touchmove', this._onTouchMove);
      this.canvas.removeEventListener('mousedown', this._onMouseDown);
      this.canvas.removeEventListener('mouseup', this._onMouseUp);
      this.canvas.removeEventListener('mousemove', this._onMouseMove);
    }
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
    const shipW = Math.max(28, Math.round(this.width * 0.068));
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

  _onTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = this.canvas.getBoundingClientRect();
    this.touchX = touch.clientX - rect.left;
    this.touchY = touch.clientY - rect.top;
  }

  _onTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = this.canvas.getBoundingClientRect();
    this.touchX = touch.clientX - rect.left;
    this.touchY = touch.clientY - rect.top;
  }

  _onTouchEnd(e) {
    e.preventDefault();
    this.touchX = null;
    this.touchY = null;
  }

  _onMouseDown(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.touchX = e.clientX - rect.left;
    this.touchY = e.clientY - rect.top;
  }

  _onMouseMove(e) {
    if (this.touchX !== null) {
      const rect = this.canvas.getBoundingClientRect();
      this.touchX = e.clientX - rect.left;
      this.touchY = e.clientY - rect.top;
    }
  }

  _onMouseUp() {
    this.touchX = null;
    this.touchY = null;
  }

  _update(dt) {
    if (this.state !== 'PLAYING') return;

    if (this.hitPauseTimer > 0) {
      this.hitPauseTimer -= dt * 1000;
      if (this.hitPauseTimer < 0) this.hitPauseTimer = 0;
      return;
    }

    const shipSpeed = 260 * (this.isMobile ? 1.15 : 1.0) * (this.width / 600);
    const halfW = this.width / 2;
    const halfH = this.height / 2;

    if (this.keys.left || (this.touchX !== null && this.touchX < halfW)) {
      this.ship.x -= shipSpeed * dt;
    }
    if (this.keys.right || (this.touchX !== null && this.touchX >= halfW)) {
      this.ship.x += shipSpeed * dt;
    }
    if (this.keys.up || (this.touchX !== null && this.touchY !== null && this.touchY < halfH)) {
      this.ship.y -= shipSpeed * dt;
    }
    if (this.keys.down || (this.touchX !== null && this.touchY !== null && this.touchY >= halfH)) {
      this.ship.y += shipSpeed * dt;
    }

    this.ship.x = Math.max(0, Math.min(this.width - this.ship.width, this.ship.x));
    this.ship.y = Math.max(0, Math.min(this.height - this.ship.height, this.ship.y));

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

    const shipRect = {
      x: this.ship.x + 4,
      y: this.ship.y + 4,
      w: this.ship.width - 8,
      h: this.ship.height - 8,
    };

    for (let i = this.meteoros.length - 1; i >= 0; i--) {
      const m = this.meteoros[i];
      const shrink = m.size * 0.3;
      if (
        m.x + shrink < shipRect.x + shipRect.w &&
        m.x - shrink > shipRect.x &&
        m.y + shrink < shipRect.y + shipRect.h &&
        m.y - shrink > shipRect.y
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
    const clearZone = 80;
    for (let i = this.meteoros.length - 1; i >= 0; i--) {
      const m = this.meteoros[i];
      const dx = m.x - (shipRect.x + shipRect.w / 2);
      const dy = m.y - (shipRect.y + shipRect.h / 2);
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
    ctx.arc(this.ship.width / 2, this.ship.height * 0.3, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.globalAlpha = 1;

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
