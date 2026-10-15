const drumPads = document.querySelectorAll('.drum-pad');

function playSound(pad) {
  const soundPath = pad.dataset.sound;
  if (!soundPath) return;

  const audio = new Audio(soundPath);
  audio.play().catch((error) => {
    console.error(`Could not play ${soundPath}:`, error);
  });
}

drumPads.forEach((pad) => {
  pad.addEventListener('click', () => playSound(pad));
});

window.addEventListener('keydown', (event) => {
  if (event.repeat) return;

  const key = event.key.toLowerCase();
  const pad = [...drumPads].find((drumPad) => drumPad.dataset.key === key);
  if (pad) playSound(pad);
});
