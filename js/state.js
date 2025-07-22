

export const gameState = {
    gameArea: null,
    rocketCount: 5,
    enemiesSpawned: 0,
    shieldHealth: 50,
    maxShieldHealth: 300,
    reactorHealth: 300,
    isFiring: false,
    mouseState: { x: 0, y: 0, isDown: false },
    /** @type {any[]} */
    activeEnemies: [],
    shieldedEnemySpawned: false,
    abilities: {
      unlocked: [],
      current: "fists"
    },
    
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


export const objState = {
  purifierTotem: null,
  sniper: null,
};