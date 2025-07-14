export const gameState = {
    gameArea: null,
    currentAbility: "fists",
    rocketCount: 5,
    bouncyBallFull: true,
    enemiesSpawned: 0,
    enemiesKilled: 0,
    shieldHealth: 50,
    reactorHealth: 300,
    isFiring: false,
    mouseState: { x: 0, y: 0 },
    /** @type {any[]} */
    activeEnemies: [],
}

export const gameStats = {
  wave: 0,
  enemiesSpawned: 0,
  enemiesKilled: 0,
  enemiesHitShield: 0,
  enemiesHitReactor: 0,
  totalDamageDealt: 0,
  damageTaken: 0,
  rocketsUsed: 0,
  primaryShotsFired: 0,
  primaryHits: 0,
}