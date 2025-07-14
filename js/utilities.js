import { gameStats } from "./state.js";

export function percentage(partialValue, totalValue) {
  return (100 * partialValue) / totalValue;
}



export function updateStatsPanel() {
  document.getElementById("stat-wave").textContent = gameStats.wave;
  document.getElementById("stat-killed").textContent = gameStats.enemiesKilled;
  document.getElementById("stat-shieldHits").textContent = gameStats.enemiesHitShield;
  document.getElementById("stat-reactorHits").textContent = gameStats.enemiesHitReactor;
  document.getElementById("stat-damageDealt").textContent = gameStats.totalDamageDealt;
}
