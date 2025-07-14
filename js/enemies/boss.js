import { spawnWave } from "./logic.js";
import { bossList } from "./bossProfiles.js";
import { createBossParticles } from "./particles.js";

export function spawnBoss(gameArea, activeEnemies, bossIndex = 0) {
  const bossData = bossList[bossIndex];
  const boss = document.createElement("div");

  boss.id = "boss";
  boss.style.position = "absolute";
  boss.style.width = `${bossData.width}px`;
  boss.style.height = `${bossData.height}px`;
  boss.style.position = "absolute"; // spelling fixed from "absoloute"
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
    }
  }, 16);
}

function showBossHealthBar(boss) {
  // Check if the health bar container already exists
  let healthBarContainer = document.getElementById("bossHealthBarContainer");
  if (!healthBarContainer) {
    // Create container div
    healthBarContainer = document.createElement("div");
    healthBarContainer.id = "bossHealthBarContainer";

    // Style container to be fixed full width at top
    healthBarContainer.style.position = "fixed";
    healthBarContainer.style.top = "0";
    healthBarContainer.style.left = "0";
    healthBarContainer.style.width = "100%";
    healthBarContainer.style.height = "30px";
    healthBarContainer.style.backgroundColor = "#222";
    healthBarContainer.style.borderBottom = "3px solid #555";
    healthBarContainer.style.zIndex = "10000"; // very top layer
    healthBarContainer.style.display = "flex";
    healthBarContainer.style.alignItems = "center";
    healthBarContainer.style.padding = "0 15px";
    healthBarContainer.style.boxSizing = "border-box";
    healthBarContainer.style.fontFamily = "monospace";
    healthBarContainer.style.color = "white";
    healthBarContainer.style.fontWeight = "bold";

    // Append container to body (fixed position)
    document.body.appendChild(healthBarContainer);

    // Create inner health bar that fills based on HP
    let healthBar = document.createElement("div");
    healthBar.id = "bossHealthBar";
    healthBar.style.height = "70%";
    healthBar.style.width = "100%"; // full initially
    healthBar.style.backgroundColor = "red";
    healthBar.style.borderRadius = "5px";
    healthBar.style.position = "relative";

    healthBarContainer.appendChild(healthBar);

    // Create the text overlay to show HP numbers
    let healthText = document.createElement("div");
    healthText.id = "bossHealthText";
    healthText.style.position = "absolute";
    healthText.style.top = "50%";
    healthText.style.left = "50%";
    healthText.style.transform = "translate(-50%, -50%)";
    healthText.style.color = "white";
    healthText.style.fontWeight = "bold";
    healthText.style.pointerEvents = "none";
    healthBar.appendChild(healthText);
  }
}

function createFlash() {
  const flash = document.createElement("div");
  flash.style.position = "fixed";
  flash.style.top = 0;
  flash.style.left = 0;
  flash.style.width = "100%";
  flash.style.height = "100%";
  flash.style.backgroundColor = "white";
  flash.style.opacity = "0.8";
  flash.style.zIndex = "100000"; // very top
  flash.style.pointerEvents = "none";
  flash.style.transition = "opacity 0.5s ease-out";

  document.body.appendChild(flash);

  // Fade out and remove after 500ms
  requestAnimationFrame(() => {
    flash.style.opacity = "0";
  });

  setTimeout(() => {
    flash.remove();
  }, 500);
}

export function updateBossHealthBar(boss) {
  const healthBar = document.getElementById("bossHealthBar");
  const healthText = document.getElementById("bossHealthText");
  if (!healthBar || !healthText) return;

  let hp = parseInt(boss.dataset.hp);
  let maxHp = parseInt(boss.dataset.maxHp);
  let percent = Math.max(0, (hp / maxHp) * 100);

  healthBar.style.width = percent + "%";
  healthText.textContent = `${hp} / ${maxHp}`;

  if (hp <= 0) {
    const container = document.getElementById("bossHealthBarContainer");
    if (container) container.remove();

    // Boss center relative to gameArea
    const rect = boss.getBoundingClientRect();
    const gameAreaRect = boss.parentElement.getBoundingClientRect();
    const centerX = rect.left - gameAreaRect.left + rect.width / 2;
    const centerY = rect.top - gameAreaRect.top + rect.height / 2;

    // Trigger flash
    createFlash();

    // Create BIG particle explosion — way more particles and longer duration
    createBossParticles(centerX, centerY, 400, 3000, boss.style.backgroundColor || "darkred");

    // Remove boss after explosion duration
    setTimeout(() => {
      boss.remove();
      spawnWave(document.getElementById("gameArea"));
    }, 3000);
  }
}
