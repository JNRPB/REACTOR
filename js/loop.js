import { moveEnemies } from "./enemies/movement.js";
import { gameState } from "./state.js";
import { drawParticles, drawShieldPickupParticles } from "../fx/particles.js";
import { drawBackground } from "../fx/setup.js";

let lastFrameTime = 0;

export function gameLoop(timestamp = 0) {
  const canvas = document.getElementById("fxCanvas");
  const ctx = canvas.getContext("2d");

  // Clear canvas for this frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Calculate delta time for animations/logic
  const deltaTime = (timestamp - lastFrameTime) / 1000;
  lastFrameTime = timestamp;

  // Move DOM and object enemies
  moveEnemies(
    document.getElementById("gameArea"),
    gameState.activeEnemies,
    gameState.mouseState.x,
    gameState.mouseState.y,
    document.getElementById("shield"),
    gameState.shieldDown,
    { value: gameState.reactorHealth },
    () => {
      // onReactorDamage callback
    },
    () => {
      // onGameOver callback
    }
  );

  drawParticles(deltaTime);
  drawShieldPickupParticles();
  //drawBackground();

  // Request next animation frame to continue game loop
  requestAnimationFrame(gameLoop);
}
