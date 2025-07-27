import { gameState } from "../../../state.js";

export function sentinelBehavior(bossElement, bossData) {
  let phase = 1;

  const behaviorInterval = setInterval(() => {
    if (!document.body.contains(bossElement)) {
      clearInterval(behaviorInterval);
      return;
    }

    const currentHp = parseFloat(bossElement.dataset.hp);

    if (currentHp < bossData.maxHp * 0.75 && phase === 1) {
      phase = 2;
      bossElement.style.backgroundColor = "yellow";
      // more behavior here
    }

    if (currentHp < bossData.maxHp * 0.25 && phase === 2) {
      phase = 3;
      bossElement.style.backgroundColor = "white";
      // more behavior here
    }

    const roll = Math.random();
    if (roll < 0.4) {
      miniHorde(bossElement);
    } else {
      //shieldUp(bossElement); // TODO: implement shield
      bossElement.style.transition = "transform 1s linear";
      bossElement.style.transform = "rotate(360deg)";

      // Reset after rotation
      setTimeout(() => {
        bossElement.style.transform = "rotate(0deg)";
      }, 1000);
    }
  }, 3000); // boss acts every 3 seconds
}

export function miniHorde(bossElement) {
  const hordeSize = 15;

  const bossX = bossElement.offsetLeft + bossElement.offsetWidth / 2;
  const bossY = bossElement.offsetTop + bossElement.offsetHeight / 2;

  console.log("miniHorde spawn center:", bossX, bossY);

  if (isNaN(bossX) || isNaN(bossY)) {
    console.warn("⚠️ Invalid boss position for miniHorde spawn:", bossX, bossY);
    return; // bail out if invalid
  }

  for (let i = 0; i < hordeSize; i++) {
    const angle = (i / hordeSize) * Math.PI * 2;
    const radius = 80;

    const spawnX = bossX + Math.cos(angle) * radius;
    const spawnY = bossY + Math.sin(angle) * radius;

    spawnHorde(spawnX, spawnY);
  }
}

export function spawnHorde(x, y) {
  if (isNaN(x) || isNaN(y)) {
    console.warn("⚠️ spawnHorde called with invalid coordinates:", x, y);
    return; // bail out early to avoid invalid CSS assignment
  }

  const miniEnemy = document.createElement("div");
  miniEnemy.classList.add("enemy", "mini-horde");

  miniEnemy.style.width = "20px";
  miniEnemy.style.height = "20px";
  miniEnemy.style.backgroundColor = "orange";
  miniEnemy.style.position = "absolute";

  miniEnemy.style.left = `${x}px`;
  miniEnemy.style.top = `${y}px`;

  miniEnemy.x = x;
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
