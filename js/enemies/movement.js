import { playShieldHitSound } from "../audio/handlers.js";
import {
  enemyHitsReactor,
  enemyHitsShield,
  reactorHealth,
  shieldDown,
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
  const shieldTop = shield.offsetTop;
  if (!Array.isArray(activeEnemies)) {
    console.warn("moveEnemies called without activeEnemies array");
    return;
  }
  for (let i = activeEnemies.length - 1; i >= 0; i--) {
    let enemy = activeEnemies[i];

    enemy.x += enemy.knockbackVX;
    enemy.y += enemy.knockbackVY;
    enemy.y += parseFloat(enemy.dataset.speed);
    enemy.knockbackVX *= 0.9;
    enemy.knockbackVY *= 0.9;
    if (Math.abs(enemy.knockbackVX) < 0.01) enemy.knockbackVX = 0;
    if (Math.abs(enemy.knockbackVY) < 0.01) enemy.knockbackVY = 0;
    enemy.style.left = `${enemy.x}px`;
    enemy.style.top = `${enemy.y}px`;

    // Check if enemy reached the shield
    if (!shieldDown && enemy.y + enemy.offsetHeight > shieldTop) {
      enemyHitsShield(enemy, gameArea, activeEnemies);
      playShieldHitSound();

    } else if (enemy.y > areaHeight) {
      // Enemy fell past game area, remove it and damage REACTOR
      enemyHitsReactor(enemy, gameArea, activeEnemies);
    }
    const areaWidth = gameArea.clientWidth;
    const maxX = areaWidth - enemy.offsetWidth;

    if (enemy.x < 0) {
      enemy.x = 0;
      enemy.knockbackVX = -enemy.knockbackVX * 0.7; // bounce with energy loss
    } else if (enemy.x > maxX) {
      enemy.x = maxX;
      enemy.knockbackVX = -enemy.knockbackVX * 0.7;
    }
  }
}
