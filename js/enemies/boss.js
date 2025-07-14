import { spawnWave } from './logic.js';

export function spawnBoss(gameArea, activeEnemies) {
  const bossSize = 100;
  const boss = document.createElement("div");
  boss.id = "boss";
  boss.style.position = "absolute";
  boss.style.width = bossSize + "px";
  boss.style.height = bossSize + "px";
  boss.style.backgroundColor = "darkred";
  boss.style.border = "3px solid black";
  boss.style.borderRadius = "10px";
  boss.style.left = gameArea.clientWidth / 2 - bossSize / 2 + "px";
  boss.style.top = "-100px";

  gameArea.appendChild(boss);

  boss.dataset.hp = 1000;
  boss.dataset.maxHp = 1000;
  boss.dataset.isBoss = "true";

  activeEnemies.push(boss);

  let targetY = 50;
  let speed = 1;

  let moveInterval = setInterval(() => {
    let currentY = parseFloat(boss.style.top);
    if (currentY < targetY) {
      boss.style.top = currentY + speed + "px";
    } else {
      clearInterval(moveInterval);
      showBossHealthBar(boss, gameArea);
    }
  }, 16);
}

function showBossHealthBar(boss, gameArea) {
  let healthBarContainer = document.getElementById("bossHealthBarContainer");
  if (!healthBarContainer) {
    healthBarContainer = document.createElement("div");
    healthBarContainer.id = "bossHealthBarContainer";
    healthBarContainer.style.position = "absolute";
    healthBarContainer.style.top = "10px";
    healthBarContainer.style.left = "50%";
    healthBarContainer.style.transform = "translateX(-50%)";
    healthBarContainer.style.width = "300px";
    healthBarContainer.style.height = "25px";
    healthBarContainer.style.backgroundColor = "#222";
    healthBarContainer.style.border = "2px solid #555";
    healthBarContainer.style.borderRadius = "5px";
    gameArea.appendChild(healthBarContainer);

    let healthBar = document.createElement("div");
    healthBar.id = "bossHealthBar";
    healthBar.style.height = "100%";
    healthBar.style.width = "100%";
    healthBar.style.backgroundColor = "red";
    healthBar.style.borderRadius = "3px";
    healthBarContainer.appendChild(healthBar);
  }
}

export function updateBossHealthBar(boss) {
  const healthBar = document.getElementById("bossHealthBar");
  if (!healthBar) return;

  let hp = parseInt(boss.dataset.hp);
  let maxHp = parseInt(boss.dataset.maxHp);
  let percent = Math.max(0, (hp / maxHp) * 100);

  healthBar.style.width = percent + "%";

  if (hp <= 0) {
    const container = document.getElementById("bossHealthBarContainer");
    if (container) container.remove();
    boss.remove();
    setTimeout(spawnWave, 4000); // next wave
  }
}