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




  <h1 style="text-align: center;">REACTOR</h1>
  <div id="shieldDisplay" style="position: fixed; top: 10px; left: 10px; font-size: 20px; color: white;">Shield: 5</div>
  <div id="reactorDisplay" style="position: fixed; top: 10px; left: 100px; font-size: 20px; color: white;">Reactor Health: 300</div>

  <div id="killCounter">Enemies Killed: 0</div>

  <div id="waveInfo">Wave: 0</div>
<div id="enemiesRemainingInfo">Enemies Remaining: 0</div>




 

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
