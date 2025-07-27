import { spawnWave } from "./enemies/waveLogic.js";
import { initFxCanvas } from "../fx/setup.js";
import { gameLoop } from "./loop.js";
import { setupMouseTracking } from "./input.js";
import { handlePrimaryWeaponClick } from "./weapons.js";
import { gameState, gameStats, objState } from "./state.js";
import { level1Enemies } from "./enemies/enemyLevelGroups.js";
import { renderAbilitiesPanel } from "./abilities/ui.js";
import { enemyA, enemyB, enemyC } from "./enemies/enemyprofiles.js";

document.addEventListener("DOMContentLoaded", () => {
  gameState.gameArea = document.getElementById("gameArea");
  initFxCanvas(gameState.gameArea);
  initGame();
});

// Function to reset all game state for a fresh run
function resetGameState() {
  // Core state
  gameState.shieldHealth = gameState.maxShieldHealth;
  gameState.reactorHealth = 100;
  gameState.rocketCount = 5;
  gameState.enemiesSpawned = 0;
  gameState.shieldedEnemySpawned = false;
  gameState.isFiring = false;
  gameState.mouseState = { x: 0, y: 0, isDown: false };
  gameState.activeEnemies = [];
  gameState.enemyPool = [enemyA, enemyB, enemyC];
  gameState.abilities.unlocked = [];
  gameState.abilities.current = "fists";
  gameState.gameOver = false;

  // Stats
  gameStats.wave = 1;
  gameStats.enemiesSpawned = 0;
  gameStats.enemiesKilled = 0;
  gameStats.enemiesHitShield = 0;
  gameStats.enemiesHitReactor = 0;
  gameStats.totalDamageDealt = 0;
  gameStats.damageTaken = 0;
  gameStats.rocketsUsed = 0;
  gameStats.primaryShotsFired = 0;
  gameStats.primaryHits = 0;

  // Object state
  objState.purifierTotem = null;
  objState.sniper = null;

  // Clear UI objects
  const gameArea = gameState.gameArea;
  if (gameArea) {
    gameArea.querySelectorAll(".enemy, #boss, .loot").forEach(el => el.remove());
  }

  //renderAbilitiesPanel?.();
}

export function initGame() {
  const gameArea = gameState.gameArea;
  const startButton = document.getElementById("startGameBtn");
  const ambientMusic = document.getElementById("ambientMusic");

  ambientMusic.volume = 0.15;

  gameState.gameArea.addEventListener("click", handlePrimaryWeaponClick);

  startButton.addEventListener("click", () => {
    const welcomeScreen = document.getElementById("welcomeScreen");

    resetGameState();

    ambientMusic.play().catch(() => {
      console.log("User interaction needed to play audio");
    });

    requestAnimationFrame(gameLoop);
    setupMouseTracking(gameArea, gameState.mouseState);
    spawnWave(gameArea, level1Enemies);

    welcomeScreen.style.display = "none";
    startButton.remove();
  });

  // 🎮 Restart button setup
  const restartButton = document.getElementById("restartBtn");
  restartButton.addEventListener("click", () => {
  window.location.reload();
  });
}

export function gameOver() {
  gameState.gameOver = true;

  const gameOverScreen = document.getElementById("gameOverScreen");
  if (gameOverScreen) gameOverScreen.style.display = "flex";

  document.getElementById("waveStatPara").textContent = ` You survived ${gameStats.wave} waves `;
  document.getElementById("killCountPara").textContent = ` You killed ${gameStats.enemiesKilled} enemies `;
}
