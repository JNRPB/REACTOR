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