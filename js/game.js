import { spawnWave } from "./enemies/waveLogic.js";
import { initFxCanvas } from "../fx/setup.js";
import { gameLoop } from "./loop.js";
import { setupMouseTracking } from "./input.js";
import { handlePrimaryWeaponClick } from "./weapons.js";
import { gameState } from "./state.js";
import { level1Enemies } from "./enemies/enemyLevelGroups.js";

document.addEventListener("DOMContentLoaded", () => {
  gameState.gameArea = document.getElementById("gameArea");
  initGame();
});

export function initGame() {
  const gameArea = gameState.gameArea;
  const startButton = document.getElementById("startGameBtn");
  const ambientMusic = document.getElementById("ambientMusic");
  const canvas = document.getElementById("fxCanvas");

  ambientMusic.volume = 0.15;

  gameState.gameArea.addEventListener("click", handlePrimaryWeaponClick);

  startButton.addEventListener("click", () => {
    const welcomeScreen = document.getElementById("welcomeScreen");

    gameState.shieldHealth = 300;
    gameState.reactorHealth = 100;
    gameState.enemiesSpawned = 0;
    gameState.enemiesKilled = 0;

    initFxCanvas(gameArea);

    ambientMusic.play().catch(() => {
      console.log("User interaction needed to play audio");
    });

    requestAnimationFrame(gameLoop);
    setupMouseTracking(gameArea, gameState.mouseState);
    spawnWave(gameArea, level1Enemies);

    welcomeScreen.style.display = "none";
    startButton.remove();
  });
}
