<?php
// You can handle sessions, variables, or backend logic here if needed
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Game</title>
  <link rel="stylesheet" href="style.css" />

  <style>
    /* Basic style for your game area */

  </style>
</head>
<body>

  <audio id="rocketExplosion" src="audio/impacts/rocketImpact.mp3" preload="auto"></audio>
  <audio id="ambientMusic" src="audio/Music/mesmerizingGalaxyLoop.mp3" preload="auto" loop></audio>
  <audio id="enemyDeathSound" src="audio/impacts/enemyADie.mp3" preload="auto"></audio>
  <audio id="enemyHitSound" src="audio/impacts/hitA.mp3" preload="auto"></audio>
  <audio id="shieldHitA" src="audio/impacts/shieldHitA.mp3" preload="auto"></audio>





  <h1 style="text-align: center;">REACTOR</h1>






 
  <div id= "gameWrapper">
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
      <button id="startGameBtn">Start Game</button>
      <div id="shield"></div>
      <canvas id="fxCanvas"></canvas>
    
  
 
  </div>
  


</div>

  <script>
    // Your JavaScript game logic goes here
    console.log('Game is ready!');
  </script>



    <script type="module">
  import { initGame } from './js/game.js';

  // When the page loads, initialize the start button etc.
  window.addEventListener("DOMContentLoaded", () => {
    initGame();
  });
</script>


</body>

</html>
