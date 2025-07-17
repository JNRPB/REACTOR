import { gameState } from "../../../state.js";

export function sentinelBehavior(bossElement, bossData) {
  let phase = 1;

  const behaviorInterval = setInterval(() => {
    if (!document.body.contains(bossElement)) {
      clearInterval(behaviorInterval);
      return;
    }

    if (
      parseFloat(bossElement.dataset.hp) < bossData.maxHp * 0.75 &&
      phase === 1
    ) {
      phase = 2;
      bossElement.style.backgroundColor = "yellow";
      // more behavior here
    }

    if (
      parseFloat(bossElement.dataset.hp) < bossData.maxHp * 0.25 &&
      phase === 2
    ) {
      phase = 3;
      bossElement.style.backgroundColor = "white";
      // more behavior here
    }

    const roll = Math.random();
    if (roll < 0.4) {
      miniHorde(bossElement);
    } else {
      //shieldUp(bossElement); //TODO: make shield
      bossElement.style.transition = "transform 1s linear";
      bossElement.style.transform = "rotate(360deg)";

      // Reset after rotation (optional)
      setTimeout(() => {
        bossElement.style.transform = "rotate(0deg)";
      }, 1000);
    }
  }, 3000); // boss makes a decition every 3 seconds
}

export function miniHorde(bossElement) {
  const hordeSize = 15; // or randomize: Math.floor(Math.random() * 3) + 3;

  const bossX = bossElement.offsetLeft + bossElement.offsetWidth / 2;
  const bossY = bossElement.offsetTop + bossElement.offsetHeight / 2;

  for (let i = 0; i < hordeSize; i++) {
    const angle = (i / hordeSize) * Math.PI * 2;
    const radius = 80; // how far from the boss the enemies appear

    const spawnX = bossX + Math.cos(angle) * radius;
    const spawnY = bossY + Math.sin(angle) * radius;

    spawnHorde(spawnX, spawnY);
  }
}

export function spawnHorde(x, y) {
  const miniEnemy = document.createElement("div");
  miniEnemy.classList.add("enemy", "mini-horde");

  miniEnemy.style.width = "20px";
  miniEnemy.style.height = "20px";
  miniEnemy.style.backgroundColor = "orange";
  miniEnemy.style.position = "absolute";
  miniEnemy.style.left = `${x}px`;
  miniEnemy.style.top = `${y}px`;

  miniEnemy.x = x; // ✅ needed for movement
  miniEnemy.y = y;
  miniEnemy.knockbackVX = 0;
  miniEnemy.knockbackVY = 0;

  miniEnemy.dataset.hp = "10";
  miniEnemy.dataset.speed = (Math.random() * 1 + 0.5).toFixed(2);
  miniEnemy.dataset.damage = "1";

  const gameArea = document.getElementById("gameArea");
  gameArea.appendChild(miniEnemy);
  gameState.activeEnemies.push(miniEnemy);
}

