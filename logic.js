// In activeEnemiesFile.js
window.activeEnemies = [];
window.fxParticles = [];

let gameArea;
let enemiesSpawned = 0;
let enemiesKilled = 0;

//Player Abilites Default
let currentAbility = "fists";
let rocketCount = 5;
let bouncyBallFull = true;

window.shieldHealth = 50;
window.shieldDisplay = document.getElementById("shieldDisplay");
window.shieldDisplay.textContent = `Shield: ${window.shieldHealth}`;

window.reactorHealth = 300;
window.reactorDisplay = document.getElementById("reactorDisplay");
window.reactorDisplay.textContent = `Reactor Health: ${window.reactorHealth}`;

window.addEventListener("DOMContentLoaded", () => {
  gameArea = document.getElementById("gameArea");

  //********************************************************************************************************************* CANVAS FX */

  const canvas = document.getElementById("fxCanvas");
  const ctx = canvas.getContext("2d");
  const shield = document.getElementById("shield");

  window.fxCanvas = canvas;
  window.fxCtx = ctx;
  window.fxParticles = [];

  function resizeCanvas() {
    // Set canvas pixel dimensions to exactly match gameArea size
    canvas.width = gameArea.clientWidth;
    canvas.height = gameArea.clientHeight;

    // Position the canvas at the top-left corner of gameArea
    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";
    canvas.style.top = "0px";
    canvas.style.left = "0px";
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  //********************************************************************************************* Start Button */
  const startButton = document.getElementById("startGameBtn");
  const ambientMusic = document.getElementById("ambientMusic");
  ambientMusic.volume = 0.15;

  startButton.addEventListener("click", () => {
    enemiesSpawned = 0; // Reset spawn count
    spawnWave();
    ambientMusic.play().catch(() => {
      console.log("User interaction needed to play audio");
    });
    requestAnimationFrame(gameLoop); // Start the animation loop
    startButton.remove();
  });

  //********************************************************************************************* Spawning & Waves */
  let wave = 1;
  let enemiesSpawnedThisWave = 0;
  let maxWaves = 10; // or remove this if you want endless waves
  let waveInProgress = false;

  function updateWaveInfo(waveNumber) {
    const waveInfo = document.getElementById("waveInfo");
    waveInfo.textContent = `Wave: ${waveNumber}`;
  }

  function updateEnemiesRemaining() {
    const enemiesRemainingInfo = document.getElementById(
      "enemiesRemainingInfo"
    );
    enemiesRemainingInfo.textContent = `Enemies Remaining: ${activeEnemies.length}`;
  }

  function spawnWave() {
    if (wave > maxWaves) {
      console.log("All waves completed!");
      return;
    }

    waveInProgress = true;
    enemiesSpawnedThisWave = 0;

    updateWaveInfo(wave);  // Added here to update wave display at start of wave

    const enemiesInWave = 5 + wave * 3;

    const waveInterval = setInterval(() => {
      if (wave === 5 && enemiesSpawnedThisWave === 0) {
        clearInterval(waveInterval);
        spawnBoss();
        return;
      }

      spawnEnemy();
      enemiesSpawnedThisWave++;

      updateEnemiesRemaining();  // Added here to update enemies remaining after spawn

      if (enemiesSpawnedThisWave >= enemiesInWave) {
        clearInterval(waveInterval);
        wave++;
        waveInProgress = false;

        setTimeout(spawnWave, 4000);
      }
    }, 400);
  }

  //********************************************************************************************* Spawning & Waves BOSS */
  function spawnBoss() {
    const bossSize = 100;

    let boss = document.createElement("div");
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
        showBossHealthBar(boss);
      }
    }, 16);
  }

  function showBossHealthBar(boss) {
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

  function updateBossHealthBar(boss) {
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
      wave++;
      setTimeout(spawnWave, 4000);
    }
  }

  window.updateBossHealthBar = updateBossHealthBar;

  //********************************************************************************************* Ability Buttons */
  const rocketSlot = document.getElementById("rocketSlot");
  const rocketCountLabel = document.getElementById("rocketCountLabel");

  rocketSlot.addEventListener("click", () => {
    console.log("ClickedRocket");
    if (rocketCount > 0) {
      currentAbility = "rocket";
    }
  });

  function updateRocketDisplay() {
    rocketCountLabel.textContent = rocketCount;
    rocketSlot.style.opacity = rocketCount > 0 ? "1" : "0.4";
  }
  window.updateRocketDisplay = updateRocketDisplay;

  const bouncyBallSlot = document.getElementById("bouncyBallSlot");

  bouncyBallSlot.addEventListener("click", () => {
    console.log("ClickedBall");
    if (bouncyBallFull) {
      currentAbility = "bouncyBall";
    }
  });

  function updateBouncyBallDisplay() {
    bouncyBallSlot.style.opacity = bouncyBallFull ? "1" : "0.4";
  }
  window.updateBouncyBallDisplay = updateBouncyBallDisplay;

  //********************************************************************************************* Ability Handlers */

  gameArea.addEventListener("click", (event) => {
    if (event.target.closest("#hotbar")) return;
    if (currentAbility === "rocket") {
      const rect = gameArea.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      window.fireRocket(x, y);
    } else if (currentAbility === "bouncyBall") {
      const rect = gameArea.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      window.fireBouncyBall(x, y);
    }
  });



  let lastFrameTime = 0;

  function gameLoop(timestamp = 0) {
    const deltaTime = (timestamp - lastFrameTime) / 1000; // seconds
    lastFrameTime = timestamp;

    moveEnemies();
    drawParticles(deltaTime);
    window.fire();
    window.moveBullets();

    requestAnimationFrame(gameLoop);
  }

  //********************************************************************************************* FX */

  window.screenShake = function (duration = 300, intensity = 5) {
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
  };

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
      ctx.shadowColor = "cyan";
      ctx.shadowBlur = 10;
      ctx.fill();

      // Remove dead particles
      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    }
  }
});
