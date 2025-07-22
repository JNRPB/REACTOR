import { spawnWave } from "../waveLogic.js";
import { bossList } from "./bossProfiles.js";
import { sentinelBehavior } from "./bosses/sentinelBehavior.js";
import { showBossHealthBar } from "../enemyUI.js";

export function spawnBoss(gameArea, activeEnemies, bossIndex = 0) {
  const bossData = bossList[bossIndex];
  const boss = document.createElement("div");

  boss.id = "boss";
  boss.style.position = "absolute";
  boss.style.width = `${bossData.width}px`;
  boss.style.height = `${bossData.height}px`;
  boss.style.position = "absolute";
  boss.style.backgroundColor = bossData.color;
  boss.style.border = bossData.border;
  boss.style.borderRadius = bossData.borderRadius;
  //position on the game area
  boss.style.left = `${(gameArea.clientWidth - bossData.width) / 2}px`;
  boss.style.top = `-${bossData.height}px`;

  gameArea.appendChild(boss);

  boss.dataset.hp = bossData.maxHp;
  boss.dataset.maxHp = bossData.maxHp;
  boss.dataset.isBoss = "true";
  boss.dataset.name = bossData.name;

  activeEnemies.push(boss);

  let targetY = 50; // final Y position for the boss (pixels)
  let speed = 1; // pixels per frame (adjust for slower/faster)

  // Use setInterval to move boss down every ~16ms (~60fps)
  let moveInterval = setInterval(() => {
    let currentY = parseFloat(boss.style.top); // get current vertical position
    if (currentY < targetY) {
      if (isNaN(currentY)) currentY = -bossData.height;
      boss.style.top = currentY + speed + "px"; // move down by speed pixels
    } else {
      clearInterval(moveInterval); // stop moving when target reached
      showBossHealthBar(boss, gameArea); // then show the boss health bar
      sentinelBehavior(boss, bossData);
    }
  }, 16);
}
