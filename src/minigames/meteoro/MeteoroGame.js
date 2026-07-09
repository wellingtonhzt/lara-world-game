export class MeteoroGame {
  constructor(container, onComplete) {
    this.container = container;
    this.onComplete = onComplete;
    this.canvas = null;
    this.ctx = null;
    this.rafId = null;
    this.running = false;

    this.ship = { x: 0, y: 0, width: 40, height: 32 };
    this.meteoros = [];
    this.stars = [];
    this.lives = 3;
    this.timeLeft = 15;
    this.lastSpawn = 0;
    this.score = 0;
    this.width = 0;
    this.height = 0;
    this.keys = { left: false, right: false };
    this.touchX = null;

    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._onTouchStart = this._onTouchStart.bind(this);
    this._onTouchEnd = this._onTouchEnd.bind(this);
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
    this._loop = this._loop.bind(this);
  }

  start() {
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
    this.canvas.addEventListener('mousedown', this._onMouseDown);
    this.canvas.addEventListener('mouseup', this._onMouseUp);

    this._loop(performance.now());
  }

  stop() {
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
      this.canvas.removeEventListener('mousedown', this._onMouseDown);
      this.canvas.removeEventListener('mouseup', this._onMouseUp);
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
    this.ship.x = this.width / 2 - this.ship.width / 2;
    this.ship.y = this.height - this.ship.height - 16;
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
    const size = Math.random() * 18 + 12;
    const speed = Math.random() * 1.8 + 1.2;
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
    if (e.key === 'ArrowLeft' || e.key === 'a') {
      this.keys.left = true;
      e.preventDefault();
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
      this.keys.right = true;
      e.preventDefault();
    }
  }

  _onKeyUp(e) {
    if (e.key === 'ArrowLeft' || e.key === 'a') {
      this.keys.left = false;
      e.preventDefault();
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
      this.keys.right = false;
      e.preventDefault();
    }
  }

  _onTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = this.canvas.getBoundingClientRect();
    this.touchX = touch.clientX - rect.left;
  }

  _onTouchEnd(e) {
    e.preventDefault();
    this.touchX = null;
  }

  _onMouseDown(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.touchX = e.clientX - rect.left;
  }

  _onMouseUp() {
    this.touchX = null;
  }

  _update(dt) {
    const shipSpeed = 260;

    if (this.keys.left || (this.touchX !== null && this.touchX < this.width / 2)) {
      this.ship.x -= shipSpeed * dt;
    }
    if (this.keys.right || (this.touchX !== null && this.touchX >= this.width / 2)) {
      this.ship.x += shipSpeed * dt;
    }

    this.ship.x = Math.max(0, Math.min(this.width - this.ship.width, this.ship.x));

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
        continue;
      }
    }

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
      }
    }

    this.timeLeft -= dt;
    if (this.timeLeft <= 0) {
      this._end(true);
    }
  }

  _end(success) {
    this.running = false;
    if (success) {
      this.onComplete({ status: 'success', bonus: 3 });
    } else {
      this.onComplete({ status: 'fail', bonus: 0 });
    }
  }

  _draw() {
    const ctx = this.ctx;
    if (!ctx) return;

    ctx.fillStyle = '#05051a';
    ctx.fillRect(0, 0, this.width, this.height);

    for (const s of this.stars) {
      ctx.globalAlpha = s.a + Math.sin(performance.now() * 0.001 * s.speed) * 0.15;
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

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('\u2764\uFE0F '.repeat(this.lives), 14, 30);

    ctx.textAlign = 'right';
    const timeColor = this.timeLeft < 5 ? '#ff4444' : '#ffffff';
    ctx.fillStyle = timeColor;
    ctx.font = 'bold 22px monospace';
    ctx.fillText(Math.ceil(this.timeLeft) + 's', this.width - 14, 30);
  }

  _loop(timestamp) {
    if (!this.running) {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
      return;
    }

    if (!this._lastTime) {
      this._lastTime = timestamp;
    }

    const dt = Math.min((timestamp - this._lastTime) / 1000, 0.05);
    this._lastTime = timestamp;

    this._update(dt);
    if (this.running) {
      this._draw();
      this.rafId = requestAnimationFrame(this._loop);
    } else {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }
  }

  destroy() {
    this.stop();
  }
}
