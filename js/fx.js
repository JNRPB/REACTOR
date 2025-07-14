import {gameState} from "./state.js"

export function drawParticles(deltaTime) {
  const ctx = window.fxCtx;
  const canvas = window.fxCanvas;
  if (!ctx || !canvas) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const particles = window.fxParticles;
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx * deltaTime;
    p.y += p.vy * deltaTime;
    p.life -= deltaTime;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(0, 255, 255, ${p.life / p.maxLife})`;
    ctx.shadowColor = "cyan";
    ctx.shadowBlur = 10;
    ctx.fill();

    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

export function screenShake(duration = 300, intensity = 5) {
  const originalStyle = gameState.gameArea.style.transform;
  let start = null;

  function shake(timestamp) {
    if (!start) start = timestamp;
    const elapsed = timestamp - start;

    const x = (Math.random() - 0.5) * intensity * 2;
    const y = (Math.random() - 0.5) * intensity * 2;

    gameState.gameArea.style.transform = `translate(${x}px, ${y}px)`;

    if (elapsed < duration) {
      requestAnimationFrame(shake);
    } else {
      gameState.gameArea.style.transform = originalStyle;
    }
  }

  requestAnimationFrame(shake);
}
