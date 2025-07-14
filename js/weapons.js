import { damageNearbyEnemies } from "./enemies/damage.js";
import { gameState } from "./state.js";
import { primaryExplosion } from "./fx.js";

export function handlePrimaryWeaponClick(event) {
  const rect = gameState.gameArea.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const radius = 50;
  const damage = 10;

  damageNearbyEnemies(x, y, radius, damage, gameState.activeEnemies);

  primaryExplosion(x, y, radius);

  


}
