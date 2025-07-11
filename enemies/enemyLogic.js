let lastReactorDamageTime = 0; // to move to reactor script

let mouseX = 0;
let mouseY = 0;

gameArea.addEventListener("mousemove", (e) => {
  const rect = gameArea.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
});

//********************************************************************************************************************* Spawn Ememies */

function spawnEnemy() {
  // Random enemies
  //let i = Math.floor(Math.random() * level1Enemys.length); <-
  //let r = level1Enemys[i];

  // Weighted enemies

  let r = pickWeightedEnemy(level1Enemies);

  // Create a div
  let activeEnemy = document.createElement("div");

  // Add styles based on enemy data
  activeEnemy.style.border = r.border;
  activeEnemy.style.width = r.size + "px";
  activeEnemy.style.height = r.size + "px";
  activeEnemy.style.position = "absolute";
  activeEnemy.style.padding = "0.01px"; // adds extra clickable area
  activeEnemy.style.boxSizing = "content-box"; // padding won't shrink visible size
  activeEnemy.style.backgroundColor = r.color; // make sure it has visible background

  // Set dataset properties
  activeEnemy.dataset.speed = r.speed;
  activeEnemy.dataset.hp = r.hp;
  activeEnemy.dataset.name = r.name;
  activeEnemy.dataset.weight = r.weight;

  // Initialize position properties
  activeEnemy.y = -r.size;

  // Calculate horizontal position within game area
  const areaWidth = gameArea.clientWidth;
  const maxLeft = areaWidth - r.size;
  const randomX = Math.floor(Math.random() * maxLeft);

  activeEnemy.style.left = randomX + "px";
  activeEnemy.style.top = activeEnemy.y + "px";

  // Append enemy to the game area
  gameArea.appendChild(activeEnemy);

  // Add to active enemies array
  activeEnemies.push(activeEnemy);


}

//***********************************************************************************************************Damage Enemies */

function damageEnemy(enemy, amount) {
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
    gameArea.removeChild(enemy);

    console.log("Enemy died. Spawning guaranteed rocket drop.");

    if (Math.random() < 0.1) {
      spawnRocketLoot(x, y);
    }

    enemiesKilled++;
    document.getElementById(
      "killCounter"
    ).textContent = `Enemies Killed: ${enemiesKilled}`;

    // Remove from activeEnemies array
    const index = activeEnemies.indexOf(enemy);
    if (index > -1) activeEnemies.splice(index, 1);
  } else {
    // Enemy still alive - update HP and show visual hit feedback
    enemy.dataset.hp = currentHp;
    enemy.style.opacity = "0.7";
    setTimeout(() => {
      enemy.style.opacity = "1";
    }, 100);
  }
}


function showDamageNumber(enemy, amount) {
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
  const gameAreaRect = gameArea.getBoundingClientRect();

  const x = rect.left - gameAreaRect.left + rect.width / 2;
  const y = rect.top - gameAreaRect.top;

  dmg.style.left = `${x}px`;
  dmg.style.top = `${y}px`;

  gameArea.appendChild(dmg);

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

//********************************************************************************************************************* Pick Weighted Enemies */

function pickWeightedEnemy(enemyList) {
  const totalWeight = enemyList.reduce((sum, enemy) => sum + enemy.weight, 0);
  let roll = Math.random() * totalWeight;

  for (let i = 0; i < enemyList.length; i++) {
    roll -= enemyList[i].weight;
    if (roll <= 0) {
      return enemyList[i];
    }
  }

  // Fallback (shouldn't happen unless weights are weird)
  return enemyList[enemyList.length - 1];
}

// Optionally expose it globally
window.pickWeightedEnemy = pickWeightedEnemy;

//********************************************************************************************************************* Move Ememies */

function moveEnemies() {
  const areaHeight = gameArea.clientHeight;
  const shield = document.getElementById("shield");
  const shieldTop = shield.offsetTop;

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
    if (!window.shieldDown && enemy.y + enemy.offsetHeight > shieldTop) {
      enemyHitsShield(enemy);
    } else if (enemy.y > areaHeight) {
      // Enemy fell past game area, remove it and damage REACTOR
      enemyHitsReactor(enemy);
    }
  }
}

function percentage(partialValue, totalValue) {
  // to move to utilities script
  return (100 * partialValue) / totalValue;
}

//********************************************************************************************************************* Enemy Hits Reactor */

function enemyHitsReactor(enemy) {
  const weight = parseInt(enemy.dataset.weight, 10) || 1;
  const damage = Math.round(10 / weight); // Higher weight → less damage

  window.reactorHealth -= damage;
  lastReactorDamageTime = Date.now();

  const reactorDisplay = document.getElementById("reactorDisplay");
  if (reactorDisplay) {
    reactorDisplay.textContent = `Reactor Health: ${window.reactorHealth}`;
  }

  gameArea.removeChild(enemy);
  const index = activeEnemies.indexOf(enemy);
  if (index > -1) activeEnemies.splice(index, 1);

  shield.style.backgroundColor = "red";
  setTimeout(() => (shield.style.backgroundColor = "#654321"), 50);

  screenShake();

  if (window.reactorHealth <= 0) {
    window.reactorHealth = 0;
    window.gameOver = true;
  }
}

//********************************************************************************************************************* Enemy Hits Shield */

function enemyHitsShield(enemy) {
  const shield = document.getElementById("shield");
  const weight = parseInt(enemy.dataset.weight, 10) || 1;
  const damage = Math.round(10 / weight); // Higher weight → less damage

  // Calculate enemy position relative to shield canvas
  const gameAreaRect = gameArea.getBoundingClientRect();
  const enemyRect = enemy.getBoundingClientRect();

  const impactX = enemyRect.left + enemyRect.width / 2 - gameAreaRect.left;
  const impactY = enemyRect.top + enemyRect.height / 2 - gameAreaRect.top;

  window.shieldHealth -= damage;

  const shieldDisplay = document.getElementById("shieldDisplay");
  if (shieldDisplay) {
    shieldDisplay.textContent = `Shield: ${window.shieldHealth}`;
  }

  gameArea.removeChild(enemy);
  const index = activeEnemies.indexOf(enemy);
  if (index > -1) activeEnemies.splice(index, 1);

  shield.style.backgroundColor = "red";
  setTimeout(() => (shield.style.backgroundColor = "#654321"), 50);

  screenShake();
  // Create particles burst
  const baseSpeed = 300; // px/s

  for (let i = 0; i < 30; i++) {
    const spread = 0.6; // how wide sideways they spread

    window.fxParticles.push({
      x: impactX,
      y: impactY,
      vx: (Math.random() * 2 - 1) * spread * baseSpeed, // sideways velocity +/-
      vy: -(Math.random() * (baseSpeed * 0.5) + baseSpeed * 0.5), // mostly downward velocity
      radius: Math.random() * 5 + 2,
      life: 0.6,
      maxLife: 0.6,
    });
  }

  if (window.shieldHealth <= 0) {
    window.shieldHealth = 0;
    window.shieldDown = true;
  }
}

//********************************************************************************************************************* Enemy Particles */

function createParticles(x, y, count = 10, duration = 800, color = "white") {
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.classList.add("particle");

    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * 60 + 20;

    const dx = Math.cos(angle) * distance + "px";
    const dy = Math.sin(angle) * distance + "px";

    p.style.left = x + "px";
    p.style.top = y + "px";
    p.style.setProperty("--x", dx);
    p.style.setProperty("--y", dy);
    p.style.setProperty("--duration", `${duration}ms`);

    // Set particle color and glow
    p.style.backgroundColor = color;
    p.style.boxShadow = `0 0 8px ${color}`;

    gameArea.appendChild(p);

    p.addEventListener("animationend", () => p.remove());
  }
}
