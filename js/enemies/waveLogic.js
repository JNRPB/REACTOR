import { spawnBoss } from "./boss/bossSpawnLogic.js";
import { spawnEnemy, spawnShieldEnemy } from "./spawn.js";
import { gameState, gameStats} from "../state.js";
import { level1Enemies, shieldEnemy } from "./enemyLevelGroups.js";
import { updateStatsPanel } from "../utilities.js";

let wave = 4;
let enemiesSpawnedThisWave = 0;
let maxWaves = 100;
let waveInProgress = false;
let countdownInProgress = false;

const waveCounter = document.getElementById("waveCounter");

export function spawnWave(gameArea) {
  if (waveInProgress || countdownInProgress) return;
  if (wave >= maxWaves) {
    console.log("All waves completed!");
    return;
  }

  if (wave !== 4) {
  gameState.shieldedEnemySpawned = false;
}


  wave++;
  gameStats.wave = wave;
  updateStatsPanel();
  waveCounter.textContent = `Wave: ${wave}`;

  waveInProgress = true;
  enemiesSpawnedThisWave = 0;

  const enemiesInWave = 5 + wave * 3;

  const waveInterval = setInterval(() => {
    if (wave % 5 === 0 && enemiesSpawnedThisWave === 0) {
      spawnBoss(gameState.gameArea, gameState.activeEnemies, 0);
      enemiesSpawnedThisWave++;
    } 
    if (wave === 4 && !gameState.shieldedEnemySpawned) {
      console.log("Spawning shielded enemy");
      spawnShieldEnemy(gameState.gameArea, shieldEnemy.enemyD);
      gameState.shieldedEnemySpawned = true;
      enemiesSpawnedThisWave++;
    }
    else if (enemiesSpawnedThisWave < enemiesInWave) {
      spawnEnemy(gameState.gameArea, level1Enemies);
      enemiesSpawnedThisWave++;
    }

    if (
      (wave % 5 !== 0 && enemiesSpawnedThisWave >= enemiesInWave) ||
      (wave % 5 === 0 && enemiesSpawnedThisWave >= 1)
    ) {
      clearInterval(waveInterval);

      const checkEnemiesInterval = setInterval(() => {
        if (gameState.activeEnemies.length === 0 && !countdownInProgress) {
          clearInterval(checkEnemiesInterval);
          waveInProgress = false;
          countdownInProgress = true;

          const timerDisplay = document.getElementById("waveTimer");
          timerDisplay.style.display = "none"; // start hidden

          let totalDelay = 15;      // total delay in seconds between waves
          let countdownStart = 5;  // when countdown text appears (seconds left)
          let secondsLeft = totalDelay;

          const countdownInterval = setInterval(() => {
            secondsLeft--;

            if (secondsLeft <= countdownStart) {
              timerDisplay.style.display = "block";
              timerDisplay.textContent = `Next wave in ${secondsLeft}...`;
            }

            if (secondsLeft <= 0) {
              clearInterval(countdownInterval);
              timerDisplay.style.display = "none";
              countdownInProgress = false;
              spawnWave(gameArea);
            }
          }, 1000);
        }
      }, 500); // check wave completion twice a second
    }
  }, 1000); // enemy spawn interval
}