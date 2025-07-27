import { screenShake } from "../fx.js";
import { gameState, gameStats } from "../state.js";
import { updateStatsPanel } from "../utilities.js";
import { gameOver } from "../game.js";

export let reactorHealth = 300;
export let shieldHealth = 100;
export let shieldDown = false;
export let lastReactorDamageTime = 0;

const shieldElement = document.getElementById("shieldContainer");

export function enemyHitsReactor(enemy, gameArea, activeEnemies) {
  const weight = parseInt(enemy.dataset.weight, 10) || 1;
  const damage = Math.round(10 / weight);

  reactorHealth -= damage;
  gameStats.enemiesHitReactor++;
  updateStatsPanel();
  console.log(gameState.reactorHealth);
  gameOver();

  gameArea.removeChild(enemy);
  const index = activeEnemies.indexOf(enemy);
  if (index > -1) activeEnemies.splice(index, 1);

  shieldElement.style.backgroundColor = "red";
  setTimeout(() => (shieldElement.style.backgroundColor = "#654321"), 50);

  screenShake();

  if (reactorHealth <= 0) {
    reactorHealth = 0;
    gameOver();
  }
}

export function enemyHitsShield(enemy, gameArea, activeEnemies) {
  if (enemy.dataset.dead === "true") return;

  const weight = parseInt(enemy.dataset.size, 10) || 1;
  const damage = Math.round(weight);

  if (enemy.isShielded) {
    gameState.shieldHealth -= gameState.shieldHealth / 2;
  } else {
    gameState.shieldHealth -= damage;
  }

  if (gameState.shieldHealth < 0) gameState.shieldHealth = 0;

  gameStats.enemiesHitShield++;
  updateStatsPanel();

  // Remove enemy from DOM and activeEnemies array
  gameArea.removeChild(enemy);
  const index = activeEnemies.indexOf(enemy);
  if (index > -1) activeEnemies.splice(index, 1);

  updateShieldHealthBar();

  screenShake();
}

export function updateShieldHealthBar() {
  const shieldBar = document.getElementById("shieldBar");
  const maxShieldHealth = 100; // adjust if needed
  const healthPercent = (gameState.shieldHealth / maxShieldHealth) * 100;
  shieldBar.style.width = healthPercent + "%";

  if (gameState.shieldHealth <= 0) {
    gameState.shieldHealth = 0;
    gameState.shieldDown = true;
  } else {
    gameState.shieldDown = false;
  }
}
