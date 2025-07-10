// In activeEnemiesFile.js
window.activeEnemies = [];

let gameArea;
let enemiesSpawned = 0;
let enemiesKilled = 0;

//Player Abilites
let currentAbility = 'fists';
let rocketCount = 5;

window.playerHealth = 2000;
window.healthDisplay = document.getElementById('healthDisplay');
window.healthDisplay.textContent = `Health: ${window.playerHealth}`;





window.addEventListener('DOMContentLoaded', () => {
  gameArea = document.getElementById('gameArea');

//********************************************************************************************* Start Button */
  const startButton = document.getElementById('startGameBtn');

startButton.addEventListener('click', () => {
  enemiesSpawned = 0;          // Reset spawn count
  spawnEnemyRepeatedly();      // Start spawning enemies
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


function gameLoop() {
  moveEnemies();
  requestAnimationFrame(gameLoop);
}

//********************************************************************************************* Ability Handlers */

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
