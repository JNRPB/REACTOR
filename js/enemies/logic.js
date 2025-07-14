import { spawnBoss } from "./boss.js";
import { spawnEnemy } from "./spawn.js";
import { gameState, gameStats } from "../state.js";
import { level1Enemies } from "./enemyLevelGroups.js";
import { updateStatsPanel } from "../utilities.js";


let wave = 0;
let enemiesSpawnedThisWave = 0;
let maxWaves = 10; // or remove this if you want endless waves
let waveInProgress = false;

function spawnWave(gameArea) {
  if (waveInProgress) return;
  if (wave > maxWaves) {
    console.log("All waves completed!");
    return;
  }

  waveInProgress = true;
  enemiesSpawnedThisWave = 0;

  gameStats.wave++;
  updateStatsPanel(); // Added here to update wave display at start of wave

  const enemiesInWave = 5 + wave * 3;

  const waveInterval = setInterval(() => {
    if (wave === 5 && enemiesSpawnedThisWave === 0) {
      clearInterval(waveInterval);
      spawnBoss(document.getElementById("gameArea"), gameState.activeEnemies);
      return;
    }

    spawnEnemy(gameArea, level1Enemies);
    enemiesSpawnedThisWave++;
     // Added here to update enemies remaining after spawn

    if (enemiesSpawnedThisWave >= enemiesInWave) {
      clearInterval(waveInterval);

      const checkEnemiesInterval = setInterval(() => {
        

        if (gameState.activeEnemies.length === 0) {
          clearInterval(checkEnemiesInterval);
          wave++;
          waveInProgress = false;
          spawnWave(gameArea);
        }
      }, 500);
    }
  }, 400);
}

export { spawnWave };
