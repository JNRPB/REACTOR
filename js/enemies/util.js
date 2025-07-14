export function pickWeightedEnemy(enemyList) {
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
