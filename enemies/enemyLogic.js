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
  activeEnemy.style.width = r.size + 'px';
  activeEnemy.style.height = r.size + 'px';
  activeEnemy.style.position = "absolute";
  activeEnemy.style.padding = '0.01px';  // adds extra clickable area
  activeEnemy.style.boxSizing = 'content-box'; // padding won't shrink visible size
  activeEnemy.style.backgroundColor = r.color; // make sure it has visible background


  // Set dataset properties
  activeEnemy.dataset.speed = r.speed;
  activeEnemy.dataset.hp = r.hp;
  activeEnemy.dataset.name = r.name;
  activeEnemy.dataset.weight =r.weight;

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

    activeEnemy.addEventListener('click', () => {
    if (currentAbility !== 'fists') return;
      damageEnemy(activeEnemy, 50)
  });
}


      //***********************************************************************************************************Damage Enemies */

  function damageEnemy(enemy, amount) {
    let currentHp = parseInt(enemy.dataset.hp, 10);
    currentHp -= amount;

    showDamageNumber(enemy, amount);

    const color = window.getComputedStyle(enemy).backgroundColor;
    const rect = enemy.getBoundingClientRect();
    const gameAreaRect = gameArea.getBoundingClientRect();
    const x = rect.left - gameAreaRect.left + enemy.offsetWidth / 2;
    const y = rect.top - gameAreaRect.top + enemy.offsetHeight / 2;

    if (currentHp <= 0) {
      // Calculate size for particles
      const size = parseInt(enemy.style.width);
      const particleCount = Math.floor(size * 2);
      const duration = size * 30 + 5;

      createParticles(x, y, particleCount, duration, color);
      gameArea.removeChild(enemy);

      console.log("Enemy died. Spawning guaranteed rocket drop.");
      
      if (Math.random() < 0.10) {
        spawnRocketLoot(x, y);
      }

      enemiesKilled++;
      document.getElementById('killCounter').textContent = `Enemies Killed: ${enemiesKilled}`;

      const index = activeEnemies.indexOf(enemy);
      if (index > -1) activeEnemies.splice(index, 1);
    } else {
      enemy.dataset.hp = currentHp;

      // Visual hit feedback
      enemy.style.opacity = '0.7';
      setTimeout(() => {
        enemy.style.opacity = '1';
      }, 100);
    }


  }

  function showDamageNumber(enemy, amount) {
    const dmg = document.createElement('div');
    dmg.textContent = `-${amount}`;
    dmg.style.position = 'absolute';
    dmg.style.color = 'yellow';
    dmg.style.fontWeight = 'bold';
    dmg.style.fontSize = '16px';
    dmg.style.pointerEvents = 'none';
    dmg.style.zIndex = 1000;
    dmg.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';

    const rect = enemy.getBoundingClientRect();
    const gameAreaRect = gameArea.getBoundingClientRect();

    const x = rect.left - gameAreaRect.left + rect.width / 2;
    const y = rect.top - gameAreaRect.top;

    dmg.style.left = `${x}px`;
    dmg.style.top = `${y}px`;

    gameArea.appendChild(dmg);

    // Trigger animation
    requestAnimationFrame(() => {
      dmg.style.transform = 'translateY(-30px)';
      dmg.style.opacity = '0';
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
  const wall = document.getElementById('wall');
  const wallTop = wall.offsetTop;

  for (let i = activeEnemies.length - 1; i >= 0; i--) {
    let enemy = activeEnemies[i];

    // Move enemy down
    enemy.y += parseFloat(enemy.dataset.speed);
    enemy.style.top = enemy.y + 'px';

    // Check if enemy reached the wall
    if (enemy.y + enemy.offsetHeight > wallTop) {
      enemyHitsWall(enemy);
    } else if (enemy.y > areaHeight) {
      // Enemy fell past game area, remove it
      gameArea.removeChild(enemy);
      activeEnemies.splice(i, 1);
    }
  }
}


//********************************************************************************************************************* Enemy Hits Wall */

function enemyHitsWall(enemy) {
  const wall = document.getElementById('wall');
  const weight = parseInt(enemy.dataset.weight, 10) || 1;
  const damage = Math.round(10 / weight);  // Higher weight → less damage

  console.log('Enemy weight:', weight);
  console.log('Damage dealt:', damage);

  window.playerHealth -= damage;
  console.log('Player health now:', window.playerHealth);

  const healthDisplay = document.getElementById('healthDisplay');
  if (healthDisplay) {
    healthDisplay.textContent = `Health: ${window.playerHealth}`;
  }

  gameArea.removeChild(enemy);
  const index = activeEnemies.indexOf(enemy);
  if (index > -1) activeEnemies.splice(index, 1);

  wall.style.backgroundColor = 'red';
  setTimeout(() => wall.style.backgroundColor = '#654321', 50);

  screenShake();

  if (window.playerHealth <= 0) {
    alert("Game Over! The wall has been breached!");
  }
}



//********************************************************************************************************************* Enemy Particles */

function createParticles(x, y, count = 10, duration = 800, color = 'white') {
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');

    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * 60 + 20;

    const dx = Math.cos(angle) * distance + 'px';
    const dy = Math.sin(angle) * distance + 'px';

    p.style.left = x + 'px';
    p.style.top = y + 'px';
    p.style.setProperty('--x', dx);
    p.style.setProperty('--y', dy);
    p.style.setProperty('--duration', `${duration}ms`);

    // Set particle color and glow
    p.style.backgroundColor = color;
    p.style.boxShadow = `0 0 8px ${color}`;

    gameArea.appendChild(p);

    p.addEventListener('animationend', () => p.remove());
  }
}