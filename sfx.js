async function setupReverb(audioContext, impulseURL) {
  const response = await fetch(impulseURL);
  const arraybuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arraybuffer);

  const convolver = audioContext.createConvolver();
  convolver.buffer = audioBuffer;

  return convolver;
}

// Adds reverb effect to an audio element
window.addReverbToAudio = async function(audioElement, impulseUrl = 'audio/ir/2_16L.wav') {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const source = ctx.createMediaElementSource(audioElement);
  const convolver = await setupReverb(ctx, impulseUrl);

  source.connect(convolver);
  convolver.connect(ctx.destination);

  return { ctx, source, convolver };
};







window.playRocketExplosion = function() {
  const explosionSound = new Audio('audio/Impacts/rocketImpact.mp3');
  
  explosionSound.playbackRate = 0.8 + Math.random() * 0.4;
  explosionSound.volume = 0.7 + Math.random() * 0.3;
  
  explosionSound.play();
};

window.playFizz = function() {
  const fizz = new Audio('audio/Impacts/rocketfizz.mp3');
  
  // Randomize volume between 0.7 and 1
  fizz.volume = 0.7 + Math.random() * 0.3;

  // Randomize playbackRate between 0.9 and 1.1 (pitch variation)
  fizz.playbackRate = 0.9 + Math.random() * 0.2;

  fizz.loop = true;

  // Play immediately
  fizz.play();

  return fizz;  // Return the Audio instance
};

window.stopFizz = function(fizzInstance) {
  if (fizzInstance) {
    fizzInstance.pause();
    fizzInstance.currentTime = 0;
  }
};


