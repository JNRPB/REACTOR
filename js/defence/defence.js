import { screenShake } from '../fx.js';
import { gameState, gameStats } from '../state.js';
import { updateStatsPanel } from '../utilities.js';

export let reactorHealth = 300;
export let shieldHealth = 50;
export let shieldDown = false;
export let lastReactorDamageTime = 0;

const reactorDisplay = document.getElementById("reactorDisplay");
const shieldDisplay = document.getElementById("shieldDisplay");
const shieldElement = document.getElementById("shield");

export function enemyHitsReactor(enemy, gameArea, activeEnemies) {
  const weight = parseInt(enemy.dataset.weight, 10) || 1;
  const damage = Math.round(10 / weight);

  reactorHealth -= damage;
  reactorDisplay.textContent = `Reactor Health: ${reactorHealth}`;

  gameArea.removeChild(enemy);
  const index = activeEnemies.indexOf(enemy);
  if (index > -1) activeEnemies.splice(index, 1);

  shieldElement.style.backgroundColor = "red";
  setTimeout(() => (shieldElement.style.backgroundColor = "#654321"), 50);

  screenShake();

  if (reactorHealth <= 0) {
    reactorHealth = 0;
    window.gameOver = true;
  }
}

export function enemyHitsShield(enemy, gameArea, activeEnemies) {

  if(enemy.dataset.dead === "true") return;
  const weight = parseInt(enemy.dataset.weight, 10) || 1;
  const damage = Math.round(10 / weight);

  const gameAreaRect = gameArea.getBoundingClientRect();
  const enemyRect = enemy.getBoundingClientRect();

  const impactX = enemyRect.left + enemyRect.width / 2 - gameAreaRect.left;
  const impactY = enemyRect.top + enemyRect.height / 2 - gameAreaRect.top;

  gameState.shieldHealth -= damage;
  gameStats.enemiesHitShield ++;
  updateStatsPanel();

  gameArea.removeChild(enemy);
  const index = activeEnemies.indexOf(enemy);
  if (index > -1) activeEnemies.splice(index, 1);

  shieldElement.style.backgroundColor = "red";
  setTimeout(() => (shieldElement.style.backgroundColor = "#654321"), 50);

  screenShake();

  // Particle burst
  const baseSpeed = 300;
  for (let i = 0; i < 30; i++) {
    const spread = 0.6;

    window.fxParticles.push({
      x: impactX,
      y: impactY,
      vx: (Math.random() * 2 - 1) * spread * baseSpeed,
      vy: -(Math.random() * (baseSpeed * 0.5) + baseSpeed * 0.5),
      radius: Math.random() * 5 + 2,
      life: 0.6,
      maxLife: 0.6,
    });
  }

  if (shieldHealth <= 0) {
    shieldHealth = 0;
    shieldDown = true;
  }
}



