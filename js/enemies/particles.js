import { gameState } from "../state.js";

export function createParticles(x, y, count = 10, duration = 800, color = "white") {

  const gameArea = gameState.gameArea;

  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.classList.add("particle");

    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * 60 + 20;

    const dx = Math.cos(angle) * distance + "px";
    const dy = Math.sin(angle) * distance + "px";

    p.style.left = x + "px";
    p.style.top = y + "px";
    p.style.setProperty("--x", dx);
    p.style.setProperty("--y", dy);
    p.style.setProperty("--duration", `${duration}ms`);

    // Set particle color and glow
    p.style.backgroundColor = color;
    p.style.boxShadow = `0 0 8px ${color}`;

    gameArea.appendChild(p);

    p.addEventListener("animationend", () => p.remove());
  }
}



export function createBossParticles(x, y) {
  const gameArea = gameState.gameArea;

  const mainParticleCount = 700;
  const secondaryExplosions = 5;
  const secondaryParticleCount = 100;
  const duration = 15000; // 15 seconds
  const gravity = 0.05; // weaker gravity for slower falling
  const trailLength = 12; // longer trails
  const maxSpeed = 3; // slower speeds for gradual spread

  function createParticle() {
    const p = document.createElement("div");
    p.style.position = "absolute";
    p.style.backgroundColor = "orange";
    p.style.borderRadius = "50%";
    p.style.width = "6px";
    p.style.height = "6px";
    p.style.pointerEvents = "none";
    p.style.filter = "drop-shadow(0 0 4px orange)";
    gameArea.appendChild(p);
    return p;
  }

  class Particle {
    constructor(x, y, vx, vy, color) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.color = color;
      this.element = createParticle();
      this.element.style.backgroundColor = color;
      this.positions = [];
    }

    update(delta) {
      this.vy += gravity;
      this.x += this.vx;
      this.y += this.vy;

      this.positions.push({ x: this.x, y: this.y });
      if (this.positions.length > trailLength) this.positions.shift();

      this.element.style.left = `${this.x}px`;
      this.element.style.top = `${this.y}px`;

      const shadows = this.positions
        .map((pos, i) => {
          const alpha = (i + 1) / this.positions.length / 2;
          return `${pos.x - this.x}px ${pos.y - this.y}px 6px rgba(255, 165, 0, ${alpha})`;
        })
        .join(", ");
      this.element.style.boxShadow = shadows;
    }

    remove() {
      this.element.remove();
    }
  }

  const particles = [];
  for (let i = 0; i < mainParticleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * maxSpeed * 0.6 + maxSpeed * 0.4; // bias toward higher speeds
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    particles.push(new Particle(x, y, vx, vy, "orange"));
  }

  for (let i = 0; i < secondaryExplosions; i++) {
    const offsetX = (Math.random() - 0.5) * 300;
    const offsetY = (Math.random() - 0.5) * 300;
    for (let j = 0; j < secondaryParticleCount; j++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * (maxSpeed / 3);
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      particles.push(new Particle(x + offsetX, y + offsetY, vx, vy, "yellow"));
    }
  }

  let startTime = null;
  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;

    if (elapsed < duration) {
      particles.forEach((p) => p.update(elapsed));
      requestAnimationFrame(animate);
    } else {
      particles.forEach((p) => p.remove());
    }
  }

  requestAnimationFrame(animate);
}
