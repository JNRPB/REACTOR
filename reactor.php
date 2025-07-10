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

  <h1 style="text-align: center;">REACTOR</h1>
  <div id="healthDisplay" style="position: fixed; top: 10px; left: 10px; font-size: 20px; color: white;">
  Health: 5
</div>


  <div id="killCounter">Enemies Killed: 0</div>




  <div id="gameArea">
    <button id="startGameBtn">Start Game</button>
    <div id="wall"></div>


    <div id="hotbar">

      <div class="hotbar-slot" id="rocketSlot" data-ability="rocket">
        <img src="images/loot/rocket-icon.png" alt="Rocket">
        <span class="hotbar-count" id="rocketCountLabel">5</span>
      </div>
      

      
    </div>

  </div>

  <script>
    // Your JavaScript game logic goes here
    console.log('Game is ready!');
  </script>
    <script src="enemies/enemyprofiles.js"></script>
    <script src="enemies/enemyArrays.js"></script>
    <script src="enemies/enemyLogic.js"></script>
    <script src="abilities.js"></script>
    <script src="loot.js"></script>

    <script src="logic.js"></script>

</body>

</html>
