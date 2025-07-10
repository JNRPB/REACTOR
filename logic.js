// In activeEnemiesFile.js
window.activeEnemies = [];
window.fxParticles = [];




let gameArea;
let enemiesSpawned = 0;
let enemiesKilled = 0;

//Player Abilites
let currentAbility = 'fists';
let rocketCount = 5;

window.shieldHealth = 50;
window.shieldDisplay = document.getElementById('shieldDisplay');
window.shieldDisplay.textContent = `Shield: ${window.shieldHealth}`;

window.reactorHealth = 300;
window.reactorDisplay = document.getElementById('reactorDisplay');
window.reactorDisplay.textContent = `Reactor Health: ${window.reactorHealth}`;





window.addEventListener('DOMContentLoaded', () => {
  gameArea = document.getElementById('gameArea');


  //********************************************************************************************************************* CANVAS FX */


const canvas = document.getElementById('fxCanvas');
const ctx = canvas.getContext('2d');
const shield = document.getElementById('shield');

window.fxCanvas = canvas;
window.fxCtx = ctx;
window.fxParticles = [];

function resizeCanvas() {
  // Set canvas pixel dimensions to exactly match gameArea size
  canvas.width = gameArea.clientWidth;
  canvas.height = gameArea.clientHeight;
  
  // Position the canvas at the top-left corner of gameArea
  canvas.style.width = canvas.width + 'px';
  canvas.style.height = canvas.height + 'px';
  canvas.style.top = '0px';
  canvas.style.left = '0px';
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

//********************************************************************************************* Start Button */
  const startButton = document.getElementById('startGameBtn');
  const ambientMusic = document.getElementById('ambientMusic');
  ambientMusic.volume = 0.15;

startButton.addEventListener('click', () => {
  enemiesSpawned = 0;          // Reset spawn count
  spawnEnemyRepeatedly();
  ambientMusic.play().catch(() => { console.log("User interaction needed to play audio"); });
  requestAnimationFrame(gameLoop); // Start the animation loop
  startButton.remove();
});

//********************************************************************************************* Ability Buttons */
const rocketSlot = document.getElementById('rocketSlot');
const rocketCountLabel = document.getElementById('rocketCountLabel');

rocketSlot.addEventListener('click', () => {
  if (rocketCount > 0) {
    currentAbility = 'rocket';
    console.log("Rocket selected");
  }
});

function updateRocketDisplay() {
  rocketCountLabel.textContent = rocketCount;
  rocketSlot.style.opacity = rocketCount > 0 ? '1' : '0.4';
}
window.updateRocketDisplay = updateRocketDisplay;


//********************************************************************************************* Ability Handlers */



gameArea.addEventListener('click', (event) => {
    if (event.target.closest('#hotbar')) return;
    if (currentAbility === 'rocket'){

        const rect = gameArea.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        window.fireRocket(x,y);
    }
});

  // Spawn an enemy to start with
  function spawnEnemyRepeatedly() {
  if (enemiesSpawned >= 70) return;  // Stop after 20 enemies

  spawnEnemy();      // Spawn one enemy
  enemiesSpawned++;  // Increment count

  const randomDelay = Math.random() * 1500 + 500; // 500ms to 2000ms

  setTimeout(spawnEnemyRepeatedly, randomDelay);
}

});


let lastFrameTime = 0;

function gameLoop(timestamp = 0) {
  const deltaTime = (timestamp - lastFrameTime) / 1000; // seconds
  lastFrameTime = timestamp;

  moveEnemies();
  drawParticles(deltaTime);

  requestAnimationFrame(gameLoop);
}


//********************************************************************************************* FX */

window.screenShake = function(duration = 300, intensity = 5) {
  const originalStyle = gameArea.style.transform;
  let start = null;

  function shake(timestamp) {
    if (!start) start = timestamp;
    const elapsed = timestamp - start;

    const x = (Math.random() - 0.5) * intensity * 2;
    const y = (Math.random() - 0.5) * intensity * 2;

    gameArea.style.transform = `translate(${x}px, ${y}px)`;

    if (elapsed < duration) {
      requestAnimationFrame(shake);
    } else {
      gameArea.style.transform = originalStyle;
    }
  }

  requestAnimationFrame(shake);
}

function drawParticles(deltaTime) {
  const ctx = window.fxCtx;
  const canvas = window.fxCanvas;
  if (!ctx || !canvas) return;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update and draw each particle
  const particles = window.fxParticles;
  for (let i = particles.length - 1; i >= 0; i--) {
    
    const p = particles[i];

    // Update position
    p.x += p.vx * deltaTime;
    p.y += p.vy * deltaTime;
    p.life -= deltaTime;

    // Draw particle as glowing circle
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(0, 255, 255, ${p.life / p.maxLife})`;
    ctx.shadowColor = 'cyan';
    ctx.shadowBlur = 10;
    ctx.fill();

    // Remove dead particles
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

