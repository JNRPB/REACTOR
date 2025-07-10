//************************************************************************************************** Rocket */

let rocketDamageAmount = 50000;

function explodeRocket(x, y, radius = 80) {
  const particleCount = 40;  // lots of bits
  const duration = 1500;     // particles last longer
  const distance = Math.random() * radius;

  createParticles(x, y, particleCount, duration, 'orange');
  damageNearbyEnemies(x, y, radius, rocketDamageAmount);




  // If you want, you can enhance createParticles to accept radius and spread particles accordingly
}

window.fireRocket = function (x, y) {
  if (rocketCount <= 0) return;
  let activeRocket = document.createElement("div");
  gameArea.appendChild(activeRocket);

  rocketCount--;
  updateRocketDisplay();

  if (rocketCount === 0) {
    currentAbility = 'fists';
  }

  activeRocket.style.width = '20px';
  activeRocket.style.height = '40px';
  activeRocket.style.backgroundColor = 'red';
  activeRocket.style.position = 'absolute';
  activeRocket.style.borderRadius = '10px';
  activeRocket.style.boxShadow = '0 0 10px orange';
  activeRocket.style.transform = 'translate(-50%, 0)';

  const startX = gameArea.clientWidth / 2;
  const startY = gameArea.clientHeight - 40;
  activeRocket.style.left = `${startX}px`;
  activeRocket.style.top = `${startY}px`;

  const dx = x - startX;
  const dy = y - startY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const directionX = dx / distance;
  const directionY = dy / distance;

  const speed = 5;
  const maxRadius = 80;  // radius of explosion & debug circle

  // Create debug circle once with maxRadius
  const debugCircle = document.createElement('div');
  debugCircle.style.position = 'absolute';
  debugCircle.style.left = `${x - maxRadius}px`;
  debugCircle.style.top = `${y - maxRadius}px`;
  debugCircle.style.width = `${maxRadius * 2}px`;
  debugCircle.style.height = `${maxRadius * 2}px`;
  debugCircle.style.border = '2px dashed red';
  debugCircle.style.borderRadius = '50%';
  debugCircle.style.pointerEvents = 'none';
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
      explodeRocket(currentX, currentY, maxRadius);
      activeRocket.remove();
      debugCircle.remove();
    }
  }

  animate();
};


function damageNearbyEnemies(x, y, radius, rocketDamageAmount) {
  activeEnemies.forEach(enemy => {
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



