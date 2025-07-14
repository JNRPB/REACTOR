import {
  enemyHitsReactor,
  enemyHitsShield,
  reactorHealth,
  shieldDown
} from '../defence/defence.js';

import {gameState} from "../state.js";


export function moveEnemies(gameArea, activeEnemies, mouseX, mouseY, shield, shieldDown, reactorHealthRef, onReactorDamage, onGameOver) {
  const areaHeight = gameArea.clientHeight;
  const shieldTop = shield.offsetTop;
    if (!Array.isArray(activeEnemies)) {
    console.warn("moveEnemies called without activeEnemies array");
    return;
  }
  for (let i = activeEnemies.length - 1; i >= 0; i--) {
    let enemy = activeEnemies[i];

    // Move enemy down
    enemy.y += parseFloat(enemy.dataset.speed);
    enemy.style.top = enemy.y + "px";

    //Repel Logic
    
    const repelRadius = 100;
    const repelStrength = 0.325; 

    // Get enemy center
    const enemyRect = enemy.getBoundingClientRect();
    const gameRect = gameArea.getBoundingClientRect();
    const enemyX = enemyRect.left + enemy.offsetWidth / 2 - gameRect.left;
    const enemyY = enemyRect.top + enemy.offsetHeight / 2 - gameRect.top;

    // Vector from mouse to enemy
    const dx = enemyX - mouseX;
    const dy = enemyY - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < repelRadius) {
      const force = ((repelRadius - distance) / repelRadius) * repelStrength;
      const offsetX = (dx / distance) * force;
      const offsetY = (dy / distance) * force;

      const currentLeft = parseFloat(enemy.style.left);
      const currentTop = parseFloat(enemy.style.top);

      // Slightly push enemy away from cursor
      enemy.style.left = `${currentLeft + offsetX}px`;
      enemy.style.top = `${currentTop + offsetY}px`;

      // Keep .y in sync with visual position
      enemy.y = currentTop + offsetY;
    }

    // Check if enemy reached the shield
    if (!shieldDown && enemy.y + enemy.offsetHeight > shieldTop) {
      enemyHitsShield(enemy, gameArea, activeEnemies);
    } else if (enemy.y > areaHeight) {
      // Enemy fell past game area, remove it and damage REACTOR
      enemyHitsReactor(enemy, gameArea, activeEnemies);
    }
  }
}