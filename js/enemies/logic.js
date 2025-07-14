import { spawnBoss } from './boss.js';
import { spawnEnemy } from "./spawn.js";
import { gameState } from "../state.js";
import { level1Enemies } from './enemyLevelGroups.js';

let wave = 1;
let enemiesSpawnedThisWave = 0;
let maxWaves = 10; // or remove this if you want endless waves
let waveInProgress = false;

function updateWaveInfo(waveNumber) {
  const waveInfo = document.getElementById("waveInfo");
  waveInfo.textContent = `Wave: ${waveNumber}`;
}

function updateEnemiesRemaining() {
  const enemiesRemainingInfo = document.getElementById("enemiesRemainingInfo");
  enemiesRemainingInfo.textContent = `Enemies Remaining: ${gameState.activeEnemies.length}`;
}

function spawnWave(gameArea) {
  if (wave > maxWaves) {
    console.log("All waves completed!");
    return;
  }

  waveInProgress = true;
  enemiesSpawnedThisWave = 0;

  updateWaveInfo(wave); // Added here to update wave display at start of wave

  const enemiesInWave = 5 + wave * 3;

  const waveInterval = setInterval(() => {
    if (wave === 5 && enemiesSpawnedThisWave === 0) {
      clearInterval(waveInterval);
      spawnBoss(document.getElementById("gameArea"), gameState.activeEnemies);
      return;
    }

    spawnEnemy(gameArea, level1Enemies);
    enemiesSpawnedThisWave++;

    updateEnemiesRemaining(); // Added here to update enemies remaining after spawn

    if (enemiesSpawnedThisWave >= enemiesInWave) {
      clearInterval(waveInterval);
      wave++;
      waveInProgress = false;

      setTimeout(spawnWave(gameArea), 4000);
    }
  }, 400);
}
export { spawnWave };