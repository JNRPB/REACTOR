import { spawnWave } from "../waveLogic.js";
import { bossList } from "./bossProfiles.js";
import { sentinelBehavior } from "./bosses/sentinelBehavior.js";
import { showBossHealthBar } from "../enemyUI.js";

function safeSetPosition(element, left, top) {
  if (typeof left === "number" && !isNaN(left)) {
    element.style.left = `${left}px`;
  } else {
    console.warn("⚠️ Invalid left position:", left, element);
  }

  if (typeof top === "number" && !isNaN(top)) {
    element.style.top = `${top}px`;
  } else {
    console.warn("⚠️ Invalid top position:", top, element);
  }
}

export function spawnBoss(gameArea, activeEnemies, bossIndex = 0) {
  const bossData = bossList[bossIndex];
  if (!bossData) {
    console.error("Invalid boss index:", bossIndex);
    return;
  }

  const boss = document.createElement("div");

  // Ensure boss has required dimensions
  const bossWidth = typeof bossData.width === "number" ? bossData.width : 100;
  const bossHeight = typeof bossData.height === "number" ? bossData.height : 100;
  const gameAreaWidth = typeof gameArea.clientWidth === "number" ? gameArea.clientWidth : 800;

  boss.id = "boss";
  boss.style.position = "absolute";
  boss.style.width = `${bossWidth}px`;
  boss.style.height = `${bossHeight}px`;
  boss.style.backgroundColor = bossData.color || "red";
  boss.style.border = bossData.border || "2px solid black";
  boss.style.borderRadius = bossData.borderRadius || "0";

  // Set initial position safely
  const initialLeft = (gameAreaWidth - bossWidth) / 2;
  const initialTop = -bossHeight;

  safeSetPosition(boss, initialLeft, initialTop);



  boss.dataset.hp = bossData.maxHp;
  boss.dataset.maxHp = bossData.maxHp;
  boss.dataset.isBoss = "true";
  boss.dataset.name = bossData.name;

  gameArea.appendChild(boss);
  activeEnemies.push(boss);

  // Movement parameters
  const targetY = 50;
  const speed = 1;

  let moveInterval = setInterval(() => {
    let currentY = parseFloat(boss.style.top);

    if (isNaN(currentY)) {
      console.warn("⚠️ Boss.style.top is NaN, resetting to initialTop:", initialTop);
      currentY = initialTop;
    }

    if (currentY < targetY) {
      const nextY = currentY + speed;
      if (!isNaN(nextY)) {
        safeSetPosition(boss, initialLeft, nextY);
      } else {
        console.warn("⚠️ Invalid nextY computed:", nextY);
      }
    } else {
      clearInterval(moveInterval);
      showBossHealthBar(boss, gameArea);
      sentinelBehavior(boss, bossData);
    }
  }, 16);
}
