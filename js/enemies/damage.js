import { createParticles } from "../../fx/particles.js";
import { gameState, gameStats } from "../state.js";
import { updateBossHealthBar } from "./enemyUI.js";
import { updateStatsPanel } from "../utilities.js";
import { handleLootDrop, renderDrop } from "../loot/dropHandler.js";

export function damageNearbyEnemies(x, y, radius, damageAmount, activeEnemies) {
  activeEnemies.forEach((enemy) => {
    if (!enemy) return;

    // === DOM element enemies ===
    if (enemy instanceof HTMLElement) {
      if (enemy.dataset.dead === "true" || !gameState.gameArea.contains(enemy))
        return;

      const rect = enemy.getBoundingClientRect();
      const gameAreaRect = gameState.gameArea.getBoundingClientRect();

      const enemyX = rect.left - gameAreaRect.left + rect.width / 2;
      const enemyY = rect.top - gameAreaRect.top + rect.height / 2;

      const dx = x - enemyX;
      const dy = y - enemyY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < radius) {
        damageEnemy(enemy, damageAmount, activeEnemies);
        knockbackEnemy(enemy, x, y, damageAmount);
      }

      // === JS object enemies (e.g., snipers or for when we convert all to js based canvas objects) ===
    } else if (typeof enemy === "object" && "x" in enemy && "y" in enemy) {
      // TODO: Add special handling for object enemies if needed
      // Example: skip or console.log(enemy.type)
    }
  });
}

export function damageEnemy(enemy, amount, activeEnemies) {
  if (!enemy) return;

  // Handle object-based enemies, so canvas. ready for implimenting canvas ebemies if needed
  if (enemy.isObjectBased) {
    enemy.health -= amount;
    if (enemy.health <= 0) {
      const index = activeEnemies.indexOf(enemy);
      if (index > -1) activeEnemies.splice(index, 1);
    }
    return;
  }

  if (enemy.isShielded) {
    const hitSound = document.getElementById("enemyHitSound"); //TODO: change to shield specific hit sound
    if (hitSound) {
      const clone = hitSound.cloneNode();
      clone.volume = 0.4 + Math.random() * 0.6;
      clone.playbackRate = 0.8 + Math.random() * 0.4;
      clone.play();
    }
    showImmuneText(enemy);
    return;
  }

  let currentHp = parseInt(enemy.dataset.hp, 10);
  currentHp -= amount;

  const hitSound = document.getElementById("enemyHitSound");
  if (hitSound) {
    const clone = hitSound.cloneNode();
    clone.volume = 0.4 + Math.random() * 0.6;
    clone.playbackRate = 0.8 + Math.random() * 0.4;
    clone.play();
  }

  showDamageNumber(enemy, amount);

  if (enemy.dataset.isBoss === "true") {
    enemy.dataset.hp = currentHp;
    updateBossHealthBar(enemy, activeEnemies);
    return;
  }

  const color = window.getComputedStyle(enemy).backgroundColor;
  const rect = enemy.getBoundingClientRect();
  const gameAreaRect = gameState.gameArea.getBoundingClientRect();
  const x = rect.left - gameAreaRect.left + enemy.offsetWidth / 2;
  const y = rect.top - gameAreaRect.top + enemy.offsetHeight / 2;
  const drops = handleLootDrop(enemy);

  if (currentHp <= 0) {
    enemy.dataset.dead = "true";

    const base = document.getElementById("enemyDeathSound");
    if (base) {
      const clone = base.cloneNode();
      clone.volume = 0.7 + Math.random() * 0.3;
      clone.playbackRate = 0.9 + Math.random() * 0.3;
      clone.play();
    }

    for (const itemId of drops) {
      renderDrop(itemId, {x, y});
    }

    const size = parseInt(enemy.style.width || "20", 10);
    createParticles(x, y);

    if (gameState.gameArea.contains(enemy)) {
      gameState.gameArea.removeChild(enemy);
    }

    gameStats.enemiesKilled++;
    updateStatsPanel();
    const index = gameState.activeEnemies.indexOf(enemy);
    if (index > -1) gameState.activeEnemies.splice(index, 1);
  } else {
    enemy.dataset.hp = currentHp;
    enemy.style.opacity = "0.7";
    setTimeout(() => (enemy.style.opacity = "1"), 100);
  }
}

export function knockbackEnemy(enemy, fromX, fromY, forceAmount) {
  if (enemy.isObjectBased) {
    const dx = enemy.x - fromX;
    const dy = enemy.y - fromY;
    const distance = Math.sqrt(dx * dx + dy * dy) || 1;
    const velocityX = (dx / distance) * (forceAmount / 2.5);
    const velocityY = (dy / distance) * (forceAmount / 2.5);
    enemy.knockbackVX = velocityX;
    enemy.knockbackVY = velocityY;
    return;
  }

  if (typeof enemy.x !== "number" || typeof enemy.y !== "number") return;

  if (enemy.isShielded) return;

  const enemyRect = enemy.getBoundingClientRect();
  const gameRect = gameState.gameArea.getBoundingClientRect();
  const enemyX = enemyRect.left - gameRect.left + enemy.offsetWidth / 2;
  const enemyY = enemyRect.top - gameRect.top + enemy.offsetHeight / 2;

  const dx = enemyX - fromX;
  const dy = enemyY - fromY;
  const distance = Math.sqrt(dx * dx + dy * dy) || 1;

  const velocityX = (dx / distance) * (forceAmount / 2.5);
  const velocityY = (dy / distance) * (forceAmount / 2.5);

  enemy.knockbackVX = velocityX;
  enemy.knockbackVY = velocityY;
}

function showDamageNumber(enemy, amount) {
  if (enemy.isObjectBased) return;

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
  requestAnimationFrame(() => {
    dmg.style.transform = "translateY(-30px)";
    dmg.style.opacity = "0";
  });
  setTimeout(() => dmg.remove(), 600);
}

function showImmuneText(enemy) {
  if (enemy.isObjectBased) return;

  const dmg = document.createElement("div");
  dmg.textContent = "IMMUNE";
  dmg.style.position = "absolute";
  dmg.style.color = "blue";
  dmg.style.fontWeight = "bold";
  dmg.style.fontSize = "22px";
  dmg.style.pointerEvents = "none";
  dmg.style.zIndex = 1000;
  dmg.style.transition = "transform 1s ease-out, opacity 1s ease-out";

  const rect = enemy.getBoundingClientRect();
  const gameAreaRect = gameState.gameArea.getBoundingClientRect();

  const x = rect.left - gameAreaRect.left + rect.width / 2;
  const y = rect.top - gameAreaRect.top;

  dmg.style.left = `${x}px`;
  dmg.style.top = `${y}px`;

  gameState.gameArea.appendChild(dmg);
  requestAnimationFrame(() => {
    dmg.style.transform = "translateY(-30px)";
    dmg.style.opacity = "0";
  });
  setTimeout(() => dmg.remove(), 1000);
}
