import { gameState } from "../state.js";
import { shieldEnemy } from "./enemyLevelGroups.js";

// Picks an enemy from a weighted list
export function pickWeightedEnemy(enemyList) {
  const totalWeight = enemyList.reduce((sum, enemy) => sum + enemy.weight, 0);
  let roll = Math.random() * totalWeight;

  for (let i = 0; i < enemyList.length; i++) {
    roll -= enemyList[i].weight;
    if (roll <= 0) {
      return enemyList[i];
    }
  }

  // fallback
  return enemyList[enemyList.length - 1];
}

// Spawns an enemy DOM element in the gameArea
export function spawnEnemy(gameArea, level1Enemies) {
  let r = pickWeightedEnemy(level1Enemies);

  let activeEnemy = document.createElement("div");

  activeEnemy.style.border = r.border;
  activeEnemy.style.width = r.size + "px";
  activeEnemy.style.height = r.size + "px";
  activeEnemy.style.position = "absolute";
  activeEnemy.style.padding = "0.01px"; // adds extra clickable area
  activeEnemy.style.boxSizing = "content-box";
  activeEnemy.style.backgroundColor = r.color;

  activeEnemy.dataset.speed = r.speed;
  activeEnemy.dataset.hp = r.hp;
  activeEnemy.dataset.name = r.name;
  activeEnemy.dataset.weight = r.weight;
  activeEnemy.dataset.size = r.size;
  

  const areaWidth = gameArea.clientWidth;
  const maxLeft = areaWidth - r.size;
  const randomX = Math.floor(Math.random() * maxLeft);

  activeEnemy.y = -r.size;
  activeEnemy.x = randomX;
  activeEnemy.knockbackVX = 0;
  activeEnemy.knockbackVY = 0;
  activeEnemy.style.left = randomX + "px";
  activeEnemy.style.top = activeEnemy.y + "px";
  activeEnemy.lootTableID = r.lootTableID;

  gameArea.appendChild(activeEnemy);

  gameState.activeEnemies.push(activeEnemy);
}

export function spawnShieldEnemy(gameArea, specialEnemies) {
  let r = shieldEnemy.enemyD;

  let activeEnemy = document.createElement("div");

  activeEnemy.isShielded = r.isShielded;

  activeEnemy.style.border = r.border;
  activeEnemy.style.width = r.size + "px";
  activeEnemy.style.height = r.size + "px";
  activeEnemy.style.position = "absolute";
  activeEnemy.style.padding = "0.01px"; // adds extra clickable area
  activeEnemy.style.boxSizing = "content-box";
  activeEnemy.style.backgroundColor = r.color;

  activeEnemy.dataset.speed = r.speed;
  activeEnemy.dataset.hp = r.hp;
  activeEnemy.dataset.name = r.name;
  activeEnemy.dataset.weight = r.weight;

  const areaWidth = gameArea.clientWidth;
  const maxLeft = areaWidth - r.size;
  const randomX = Math.floor(Math.random() * maxLeft);

  activeEnemy.y = -r.size;
  activeEnemy.x = randomX;
  activeEnemy.knockbackVX = 0;
  activeEnemy.knockbackVY = 0;
  activeEnemy.style.left = randomX + "px";
  activeEnemy.style.top = activeEnemy.y + "px";

  const shieldDiv = document.createElement("div");
shieldDiv.classList.add("enemyShield");  // We'll style this in CSS next
activeEnemy.appendChild(shieldDiv);


  gameArea.appendChild(activeEnemy);

  gameState.activeEnemies.push(activeEnemy);
}



