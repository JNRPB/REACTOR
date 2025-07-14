import { moveEnemies } from "./enemies/movement.js";
import { drawParticles } from "./fx.js";
import { gameState } from "./state.js"

let lastFrameTime = 0;

export function gameLoop(timestamp = 0) {
  const deltaTime = (timestamp - lastFrameTime) / 1000; // seconds
  lastFrameTime = timestamp;
  console.log("Enemies Killed: ", gameState.enemiesKilled);



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
