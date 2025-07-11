
let isFiring = false;
let lastShotTime = 0;
const fireInterval = 200; // milliseconds between shots

const activeBullets = [];


gameArea.addEventListener("mousedown", (e) => {
  if (currentAbility === "fists") {
    isFiring = true;
  }
});

gameArea.addEventListener("mouseup", () => {
  isFiring = false;
});

window.fire = function(){
  if (isFiring && currentAbility === "fists") {
    const now = performance.now();
    if (now - lastShotTime >= fireInterval) {
      lastShotTime = now;

      const gameRect = gameArea.getBoundingClientRect();
      const playerX = gameArea.clientWidth / 2;
      const playerY = gameArea.clientHeight - 40;

      const targetX = lastMouseX - gameRect.left;
      const targetY = lastMouseY - gameRect.top;

      // Calculate base angle from player to mouse
      const baseAngle = Math.atan2(targetY - playerY, targetX - playerX);

      const pelletCount = 9;    // number of bullets per shot
      const spreadDeg = 1;     // total spread in degrees
      const halfSpread = spreadDeg / 2;

      for (let i = 0; i < pelletCount; i++) {
        // Spread bullets evenly across the cone
        const angleOffset = ((i / (pelletCount - 1)) * spreadDeg) - halfSpread;
        const angle = baseAngle + angleOffset * (Math.PI / 180);

        spawnBullet(playerX, playerY, angle);
      }
    }
  }
};

function spawnBullet(x, y, angle) {
  const bullet = document.createElement("div");
  bullet.classList.add("bullet");
  bullet.style.position = "absolute";
  bullet.style.width = "6px";
  bullet.style.height = "6px";
  bullet.style.background = "white";
  bullet.style.borderRadius = "50%";
  bullet.style.left = `${x}px`;
  bullet.style.top = `${y}px`;
  bullet.style.zIndex = 15;

  const velocity = 50;
  bullet.dataset.dx = Math.cos(angle) * velocity;
  bullet.dataset.dy = Math.sin(angle) * velocity;

  gameArea.appendChild(bullet);
  activeBullets.push(bullet);
}






window.moveBullets = function () {
  for (let i = activeBullets.length - 1; i >= 0; i--) {
    const bullet = activeBullets[i];
    const dx = parseFloat(bullet.dataset.dx);
    const dy = parseFloat(bullet.dataset.dy);

    const x = parseFloat(bullet.style.left) + dx;
    const y = parseFloat(bullet.style.top) + dy;
    bullet.style.left = `${x}px`;
    bullet.style.top = `${y}px`;

    // Check for collision
    const bulletRect = bullet.getBoundingClientRect();
    const bulletCenterX = bulletRect.left + bulletRect.width / 2;
    const bulletCenterY = bulletRect.top + bulletRect.height / 2;

    for (let j = activeEnemies.length - 1; j >= 0; j--) {
      const enemy = activeEnemies[j];
      const enemyRect = enemy.getBoundingClientRect();

      if (
        bulletRect.right > enemyRect.left &&
        bulletRect.left < enemyRect.right &&
        bulletRect.bottom > enemyRect.top &&
        bulletRect.top < enemyRect.bottom
      ) {
        damageEnemy(enemy, 10);
        bullet.remove();
        activeBullets.splice(i, 1);
        break;
      }
    }

    // Remove if off screen
    if (
      x < 0 || x > gameArea.clientWidth ||
      y < 0 || y > gameArea.clientHeight
    ) {
      bullet.remove();
      activeBullets.splice(i, 1);
    }
  }
}


let lastMouseX = 0;
let lastMouseY = 0;

gameArea.addEventListener("mousemove", (e) => {
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
});

function firePrimaryWeapon(x, y) {
  for (let i = activeEnemies.length - 1; i >= 0; i--) {
    const enemy = activeEnemies[i];
    const rect = enemy.getBoundingClientRect();
    const enemyCenterX = rect.left + rect.width / 2;
    const enemyCenterY = rect.top + rect.height / 2;

    const dist = Math.hypot(enemyCenterX - (x + gameArea.getBoundingClientRect().left), enemyCenterY - (y + gameArea.getBoundingClientRect().top));

    if (dist <= fireRange) {
      damageEnemy(enemy, 1); // lighter damage per shot
      createMuzzleFlash(x, y);
      break; // hit one per shot
    }
  }
}

function createMuzzleFlash(x, y) {
  const p = {
    x: x,
    y: y,
    vx: (Math.random() - 0.5) * 100,
    vy: (Math.random() - 0.5) * 100,
    radius: 2 + Math.random() * 2,
    life: 0.1,
    maxLife: 0.1,
  };
  fxParticles.push(p);
}



//************************************************************************************************** Rocket */

let rocketDamageAmount = 50000;

function explodeRocket(x, y, radius = 80, fizzSound) {
  const particleCount = 40; // lots of bits
  const duration = 1500; // particles last longer
  const distance = Math.random() * radius;
  const rocketExplosion = document.getElementById("rocketExplosion");
  window.addReverbToAudio(rocketExplosion, "audio/ir/2_16L.wav");

  createParticles(x, y, particleCount, duration, "orange");
  damageNearbyEnemies(x, y, radius, rocketDamageAmount);
  window.stopFizz(fizzSound);
  window.playRocketExplosion();

  // If you want, you can enhance createParticles to accept radius and spread particles accordingly
}

window.fireRocket = function (x, y) {
  if (rocketCount <= 0) return;
  let activeRocket = document.createElement("div");
  gameArea.appendChild(activeRocket);

  rocketCount--;
  updateRocketDisplay();

  if (rocketCount === 0) {
    currentAbility = "fists";
  }

  activeRocket.style.width = "20px";
  activeRocket.style.height = "40px";
  activeRocket.style.backgroundColor = "red";
  activeRocket.style.position = "absolute";
  activeRocket.style.borderRadius = "10px";
  activeRocket.style.boxShadow = "0 0 10px orange";
  activeRocket.style.transform = "translate(-50%, 0)";

  const startX = gameArea.clientWidth / 2;
  const startY = gameArea.clientHeight - 40;
  activeRocket.style.left = `${startX}px`;
  activeRocket.style.top = `${startY}px`;

  const fizzSound = window.playFizz();

  const dx = x - startX;
  const dy = y - startY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const directionX = dx / distance;
  const directionY = dy / distance;

  const speed = 5;
  const maxRadius = 80; // radius of explosion & debug circle

  // Create debug circle once with maxRadius
  const debugCircle = document.createElement("div");
  debugCircle.style.position = "absolute";
  debugCircle.style.left = `${x - maxRadius}px`;
  debugCircle.style.top = `${y - maxRadius}px`;
  debugCircle.style.width = `${maxRadius * 2}px`;
  debugCircle.style.height = `${maxRadius * 2}px`;
  debugCircle.style.border = "2px dashed red";
  debugCircle.style.borderRadius = "50%";
  debugCircle.style.pointerEvents = "none";
  debugCircle.style.zIndex = 1000;
  gameArea.appendChild(debugCircle);

  let currentX = startX;
  let currentY = startY;

  function animate() {
    currentX += directionX * speed;
    currentY += directionY * speed;

    activeRocket.style.left = `${currentX}px`;
    activeRocket.style.top = `${currentY}px`;

    const distRemaining = Math.sqrt((x - currentX) ** 2 + (y - currentY) ** 2);
    const scale = distRemaining / distance; // scale from 1 to 0
    const radius = maxRadius * scale;

    // Shrink debug circle as rocket approaches
    debugCircle.style.left = `${x - radius}px`;
    debugCircle.style.top = `${y - radius}px`;
    debugCircle.style.width = `${radius * 2}px`;
    debugCircle.style.height = `${radius * 2}px`;

    if (distRemaining > speed) {
      requestAnimationFrame(animate);
    } else {
      explodeRocket(currentX, currentY, maxRadius, fizzSound);
      activeRocket.remove();
      debugCircle.remove();
    }
  }

  animate();
};

function damageNearbyEnemies(x, y, radius, rocketDamageAmount) {
  activeEnemies.forEach((enemy) => {
    const rect = enemy.getBoundingClientRect();
    const gameAreaRect = gameArea.getBoundingClientRect();

    const enemyX = rect.left - gameAreaRect.left + rect.width / 2;
    const enemyY = rect.top - gameAreaRect.top + rect.height / 2;

    const dx = x - enemyX;
    const dy = y - enemyY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < radius) {
      damageEnemy(enemy, rocketDamageAmount);
      console.log(`Enemy ${enemy.dataset.name} distance: ${distance}`);
    }
  });
}

//************************************************************************************************** Bouncy Ball */

window.fireBouncyBall = function (x, y) {
  if (!bouncyBallFull) return;

  const ballSize = 20;
  const spawnX = gameArea.clientWidth / 2 - ballSize / 2;
  const spawnY = gameArea.clientHeight - 40;

  const bouncyBall = document.createElement("div");
  bouncyBall.style.position = "absolute";
  bouncyBall.style.width = `${ballSize}px`;
  bouncyBall.style.height = `${ballSize}px`;
  bouncyBall.style.background = "orange";
  bouncyBall.style.borderRadius = "50%";
  bouncyBall.style.zIndex = 10;
  bouncyBall.style.left = `${spawnX}px`;
  bouncyBall.style.top = `${spawnY}px`;
  gameArea.appendChild(bouncyBall);

  bouncyBallFull = false;
  updateBouncyBallDisplay();
  currentAbility = "fists";

  // Calculate direction from ball center to click
  const originX = spawnX + ballSize / 2;
  const originY = spawnY + ballSize / 2;
  const dxRaw = x - originX;
  const dyRaw = y - originY;
  const distance = Math.sqrt(dxRaw * dxRaw + dyRaw * dyRaw);
  const directionX = dxRaw / distance;
  const directionY = dyRaw / distance;

  const speed = 50;
  let dx = directionX * speed;
  let dy = directionY * speed;

  let posX = spawnX;
  let posY = spawnY;
  let bounces = 0;
  const maxBounces = 200;

  const interval = setInterval(() => {
    posX += dx;
    posY += dy;

    // Bounce off walls
    if (posX <= 0 || posX + ballSize >= gameArea.clientWidth) {
      dx *= -1;
      bounces++;
    }
    if (posY <= 0 || posY + ballSize >= gameArea.clientHeight) {
      dy *= -1;
      bounces++;
    }

    bouncyBall.style.left = `${posX}px`;
    bouncyBall.style.top = `${posY}px`;

    // Collision with enemies
    const gameRect = gameArea.getBoundingClientRect();
    const ballLeft = posX;
    const ballTop = posY;
    const ballRight = posX + ballSize;
    const ballBottom = posY + ballSize;
    activeEnemies.forEach((enemyEl) => {
      const enemyRect = enemyEl.getBoundingClientRect();
      const enemyLeft = enemyRect.left - gameRect.left;
      const enemyTop = enemyRect.top - gameRect.top;
      const enemyRight = enemyLeft + enemyRect.width;
      const enemyBottom = enemyTop + enemyRect.height;

      if (
        ballRight > enemyLeft &&
        ballLeft < enemyRight &&
        ballBottom > enemyTop &&
        ballTop < enemyBottom
      ) {
        damageEnemy(enemyEl, 500);
        dx *= -1;
        dy *= -1;
        bounces++;
      }
    });

    if (bounces >= maxBounces) {
      clearInterval(interval);
      bouncyBall.remove();
    }
  }, 16);
};
