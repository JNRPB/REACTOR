import { createParticles } from './particles.js';
import { gameState } from '../state.js';

export function damageNearbyEnemies(x, y, radius, damageAmount, activeEnemies) {

  radius = 80

console.log("damageNearbyEnemies called with", activeEnemies.length, "enemies");
console.log("activeEnemies:", activeEnemies);



  activeEnemies.forEach((enemy) => {
    const rect = enemy.getBoundingClientRect();
    const gameAreaRect = gameState.gameArea.getBoundingClientRect();

    const enemyX = rect.left - gameAreaRect.left + rect.width / 2;
    const enemyY = rect.top - gameAreaRect.top + rect.height / 2;

    const dx = x - enemyX;
    const dy = y - enemyY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    console.log(`${enemy.dataset.name}:`);
console.log("Explosion at:", x, y);
console.log("Enemy center at:", enemyX, enemyY);
console.log("Distance:", distance);
console.log("Radius:", radius);


    if (distance < radius) {
      console.log(`Enemy ${enemy.dataset.name} distance: ${distance}`);
      damageEnemy(enemy, damageAmount);
      
    }
  });
}

export function damageEnemy(enemy, amount, activeEnemies) {
  let currentHp = parseInt(enemy.dataset.hp, 10);
  currentHp -= amount;

  showDamageNumber(enemy, amount);

  // If this enemy is the boss, update boss HP and health bar
  if (enemy.dataset.isBoss === "true") {
    enemy.dataset.hp = currentHp;
    updateBossHealthBar(enemy);
    return; // Boss logic handles death, so exit here
  }

  // Normal enemy damage and death logic
  const color = window.getComputedStyle(enemy).backgroundColor;
  const rect = enemy.getBoundingClientRect();
  const gameAreaRect = gameArea.getBoundingClientRect();
  const x = rect.left - gameAreaRect.left + enemy.offsetWidth / 2;
  const y = rect.top - gameAreaRect.top + enemy.offsetHeight / 2;

  if (currentHp <= 0) {

     enemy.dataset.dead = "true";
    // Play enemy death sound with slight random variation
    const base = document.getElementById("enemyDeathSound");
    if (base) {
      const clone = base.cloneNode(); // allows overlapping sounds
      clone.volume = 0.7 + Math.random() * 0.3; // vary volume
      clone.playbackRate = 0.9 + Math.random() * 0.3; // vary pitch
      clone.play();
    }

    const size = parseInt(enemy.style.width);
    const particleCount = Math.floor(size * 2);
    const duration = size * 30 + 5;

    createParticles(x, y, particleCount, duration, color);
      if (gameState.gameArea.contains(enemy)) {
    gameState.gameArea.removeChild(enemy);
  }

    console.log("Enemy died. Spawning guaranteed rocket drop.");

    if (Math.random() < 0.1) {
      spawnRocketLoot(x, y);
    }

    gameState.enemiesKilled++;

    // Remove from activeEnemies array
    const index = gameState.activeEnemies.indexOf(enemy);
    if (index > -1) gameState.activeEnemies.splice(index, 1);
  } else {
    // Enemy still alive - update HP and show visual hit feedback
    enemy.dataset.hp = currentHp;
    enemy.style.opacity = "0.7";
    setTimeout(() => {
      enemy.style.opacity = "1";
    }, 100);
  }
}


function showDamageNumber(enemy, amount, gameArea) {
  const dmg = document.createElement("div");
  dmg.textContent = `-${amount}`;
  dmg.style.position = "absolute";
  dmg.style.color = "yellow";
  dmg.style.fontWeight = "bold";
  dmg.style.fontSize = "16px";
  dmg.style.pointerEvents = "none";
  dmg.style.zIndex = 1000;
  dmg.style.transition = "transform 0.6s ease-out, opacity 0.6s ease-out";

  const rect = enemy.getBoundingClientRect();
  const gameAreaRect = gameState.gameArea.getBoundingClientRect();

  const x = rect.left - gameAreaRect.left + rect.width / 2;
  const y = rect.top - gameAreaRect.top;

  dmg.style.left = `${x}px`;
  dmg.style.top = `${y}px`;

  gameState.gameArea.appendChild(dmg);

  // Trigger animation
  requestAnimationFrame(() => {
    dmg.style.transform = "translateY(-30px)";
    dmg.style.opacity = "0";
  });

  // Remove after animation
  setTimeout(() => {
    dmg.remove();
  }, 600);
}

window.damageEnemy = damageEnemy;