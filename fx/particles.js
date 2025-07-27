export function createParticles(
  x,
  y,
  count = 100,
  duration = 800,
  color = "white"
) {
  const gravity = 500; // pixels per second squared

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const speed = Math.random() * 200; // px/s initial velocity magnitude
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;

    const radius = Math.random() * 3;

    window.fxParticles.push({
      x,
      y,
      vx,
      vy,
      gravity,
      life: duration / 1000,
      maxLife: duration / 1000,
      radius,
      color,
    });
  }
}

export function drawParticles(deltaTime) {
  const ctx = window.fxCtx;
  const canvas = window.fxCanvas;
  if (!ctx || !canvas) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const particles = window.fxParticles;
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];

    // Update velocity with gravity (accelerate down)
    p.vy += p.gravity * deltaTime;

    // Update position
    p.x += p.vx * deltaTime;
    p.y += p.vy * deltaTime;

    // Decrease life
    p.life -= deltaTime;

    // Draw particle with fade out
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(0, 255, 255, ${p.life / p.maxLife})`;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 10;
    ctx.fill();

    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

let shieldPickupParticles = [];

export function spawnShieldPickupParticles(startX, startY) {
  const shieldBar = document.getElementById("shieldBar");
  const canvas = window.fxCanvas;


  const canvasRect = canvas.getBoundingClientRect();
const barRect = shieldBar.getBoundingClientRect();
const targetX = barRect.left - canvasRect.left + barRect.width;
const targetY = barRect.top - canvasRect.top + barRect.height / 2;

  for (let i = 0; i < 10; i++) {
    shieldPickupParticles.push({
      x: startX + (Math.random() - 0.5) * 10,
      y: startY + (Math.random() - 0.5) * 10,
      targetX,
      targetY,
      radius: 3 + Math.random() * 2,
      color: "cyan",
    });
  }
}

export function drawShieldPickupParticles() {
  const ctx = window.fxCtx;
  const canvas = window.fxCanvas;
  if (!ctx || !canvas) return;

  for (let i = shieldPickupParticles.length - 1; i >= 0; i--) {
    const p = shieldPickupParticles[i];

    // Move toward the target (ease in)
    p.x += (p.targetX - p.x) * 0.08;
    p.y += (p.targetY - p.y) * 0.08;

    // Draw particle
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(0, 255, 255, 0.7)";
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 8;
    ctx.fill();

    // Remove if very close
    if (
      Math.abs(p.x - p.targetX) < 2 &&
      Math.abs(p.y - p.targetY) < 2
    ) {
      shieldPickupParticles.splice(i, 1);
    }
  }
}

