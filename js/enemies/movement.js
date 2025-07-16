import { playShieldHitSound } from "../audio/handlers.js";
import {
  enemyHitsReactor,
  enemyHitsShield,
} from "../defence/defence.js";
import { gameState } from "../state.js";

export function moveEnemies(
  gameArea,
  activeEnemies,
  mouseX,
  mouseY,
  shield,
  shieldDown,
  reactorHealthRef,
  onReactorDamage,
  onGameOver
) {
  const areaHeight = gameArea.clientHeight;
  const areaWidth = gameArea.clientWidth;
  const shieldTop = shieldContainer.offsetTop;

  if (!Array.isArray(activeEnemies)) {
    console.warn("moveEnemies called with non-array:", activeEnemies);
    return;
  }

  for (let i = activeEnemies.length - 1; i >= 0; i--) {
    const enemy = activeEnemies[i];

    // ========== DOM-based Enemy ==========
    if (enemy instanceof HTMLElement) {
      const speed = parseFloat(enemy.dataset?.speed || "1");

      enemy.x += enemy.knockbackVX;
      enemy.y += enemy.knockbackVY;
      enemy.y += speed;

      enemy.knockbackVX *= 0.9;
      enemy.knockbackVY *= 0.9;
      if (Math.abs(enemy.knockbackVX) < 0.01) enemy.knockbackVX = 0;
      if (Math.abs(enemy.knockbackVY) < 0.01) enemy.knockbackVY = 0;

      // Update DOM position
      enemy.style.left = `${enemy.x}px`;
      enemy.style.top = `${enemy.y}px`;

      // Check shield collision
      if (!shieldDown && enemy.y + enemy.offsetHeight > shieldTop) {
        enemyHitsShield(enemy, gameArea, activeEnemies);
        playShieldHitSound();
        continue;
      }

      // Check reactor collision
      if (enemy.y > areaHeight) {
        enemyHitsReactor(enemy, gameArea, activeEnemies);
        continue;
      }

      // Wall bounce
      const maxX = areaWidth - enemy.offsetWidth;
      if (enemy.x < 0 || enemy.x > maxX) {
        enemy.x = Math.max(0, Math.min(enemy.x, maxX));
        enemy.knockbackVX = -enemy.knockbackVX * 0.7;
      }

    // ========== Object-Based Enemy ==========
    } else if (enemy && typeof enemy === "object" && "x" in enemy && "y" in enemy) {
      const speed = typeof enemy.speed === "number" ? enemy.speed : 1;

      if (!enemy.isFrozen) {
        enemy.x += enemy.knockbackVX || 0;
        enemy.y += enemy.knockbackVY || 0;
        enemy.y += speed;

        if (enemy.knockbackVX) enemy.knockbackVX *= 0.9;
        if (enemy.knockbackVY) enemy.knockbackVY *= 0.9;
      }

      // Add custom behavior for object enemies hitting boundaries/reactor
      if (enemy.y > areaHeight && typeof enemy.onFall === "function") {
        enemy.onFall(enemy, gameArea, activeEnemies);
      }

    // ========== Unknown Format ==========
    } else {
      console.warn("Unknown enemy type detected in moveEnemies:", enemy);
    }
  }
}
