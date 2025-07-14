export function playShieldHitSound() {
  const shieldHitSound = document.getElementById("shieldHitA");
  if (!shieldHitSound) {
    console.log("shieldHitA element not found!");
    return;
  }
  const clone = shieldHitSound.cloneNode();

  if (Math.random() < 0.5) {
    clone.volume = Math.min(1, 0.6 + Math.random() * 0.5);
    clone.playbackRate = 0.9 + Math.random() * 0.2;
  } else {
    clone.volume = 0.4 + Math.random() * 0.6;
    clone.playbackRate = 0.8 + Math.random() * 0.4;
  }

  clone.play();
}

