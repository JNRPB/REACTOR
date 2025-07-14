import { spawnBoss } from "./enemies/boss.js";
import { spawnWave } from "./enemies/logic.js";
import { moveEnemies } from "./enemies/movement.js";
import { drawParticles } from "./fx.js";
import { gameState } from "./state.js"


let lastFrameTime = 0;
let lastWaveTime = 0;
const waveCooldown = 10;

export function gameLoop(timestamp = 0) {
  const deltaTime = (timestamp - lastFrameTime) / 1000; // seconds
  lastFrameTime = timestamp;

  if (timestamp / 1000 - lastWaveTime > waveCooldown) {
    spawnWave(document.getElementById("gameArea"));
    //spawnBoss(document.getElementById("gameArea"), gameState.activeEnemies, 0)
    lastWaveTime = timestamp;
  }
  
  moveEnemies(
    document.getElementById("gameArea"),
    gameState.activeEnemies,
    gameState.mouseState.x,
    gameState.mouseState.y,
    document.getElementById("shield"),
    gameState.shieldDown,
    { value: gameState.reactorHealth },
    () => {
      /* onReactorDamage Function */
    },
    () => {
      /* gameOver Function */
    }
  );
  drawParticles(deltaTime);
  
  

  requestAnimationFrame(gameLoop);
}
