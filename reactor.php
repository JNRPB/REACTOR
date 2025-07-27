<?php
// You can handle sessions, variables, or backend logic here if needed
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Game</title>
  <link rel="stylesheet" href="style.css" />
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
</head>

<body>



  <!-- 🎵 Audio -->
  <audio id="rocketExplosion" src="audio/impacts/rocketImpact.mp3" preload="auto"></audio>
  <audio id="ambientMusic" src="audio/Music/mesmerizingGalaxyLoop.mp3" preload="auto" loop></audio>
  <audio id="enemyDeathSound" src="audio/impacts/enemyADie.mp3" preload="auto"></audio>
  <audio id="enemyHitSound" src="audio/impacts/hitA.mp3" preload="auto"></audio>
  <audio id="shieldHitA" src="audio/impacts/shieldHitA.mp3" preload="auto"></audio>

  <!-- 🕹️ Game Title -->
  <h1 style="text-align: center;">REACTOR</h1>

  <!-- 🎮 Game UI -->
  <div id="gameWrapper">
    <div id="statsPanel">
      <h3>Stats</h3>
      <p>Wave: <span id="stat-wave">0</span></p>
      <p>Spawned: <span id="stat-spawned">0</span></p>
      <p>Killed: <span id="stat-killed">0</span></p>
      <p>Shield Hits: <span id="stat-shieldHits">0</span></p>
      <p>Reactor Hits: <span id="stat-reactorHits">0</span></p>
      <p>Total Damage: <span id="stat-damageDealt">0</span></p>
    </div>

    <div id="gameArea">


      
      <div id="welcomeScreen">
        <h1> Welcome to REACTOR </h1>
        <p>The invaders have found us! They are attacking from above. Fire your weapon <strong>(left click)</strong>
          to defeat them!</p>
        <button id="startGameBtn">Start Game</button>
      </div>

      <div id="gameOverScreen">
        <h1> Game Over!</h1>
        <p>The reactor has been <strong>Destroyed</strong>
          !!</p>

        <p id= "waveStatPara"> You Survived x waves </p>
        <p id= "killCountPara"> You killed x enemies </p>
        <button id="restartBtn">Restart</button>
      </div>

      <div id="shieldContainer">
        <div id="shieldBar"></div>
      </div>

      <div id="waveCounter">Wave: 1</div>
      <div id="waveTimer" style="display: none; font-size: 24px; color: white; text-align: center; margin-top: 10px;"></div>

      <canvas id="fxCanvas"></canvas>
    </div>

   <!-- <div id="abilitiesPanel"></div> -->

  </div>

  <!-- 🔧 Game Init -->
  <script>
    console.log('Game is ready!');
  </script>

  <script type="module">
    import { initGame } from './js/game.js';

    window.addEventListener("DOMContentLoaded", () => {
      initGame();
    });
  </script>
</body>
</html>
