const drumPads = document.querySelectorAll('.drum-pad');
const recordButton = document.querySelector('#record-button');
const stopButton = document.querySelector('#stop-button');
const replayButton = document.querySelector('#replay-button');
const recorderStatus = document.querySelector('#recorder-status');
const beatQueue = [];
let isRecording = false;

function playAudio(soundPath) {
  const audio = new Audio(soundPath);
  audio.play().catch((error) => {
    console.error(`Could not play ${soundPath}:`, error);
  });
}

function playSound(pad) {
  const soundPath = pad.dataset.sound;
  if (!soundPath) return;

  if (isRecording) {
    beatQueue.push({
      key: pad.dataset.key,
      sound: soundPath,
      timestamp: performance.now(),
    });
  }

  playAudio(soundPath);
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

recordButton.addEventListener('click', () => {
  beatQueue.length = 0;
  isRecording = true;
  recordButton.disabled = true;
  stopButton.disabled = false;
  replayButton.disabled = true;
  recorderStatus.textContent = 'Recording…';
});

stopButton.addEventListener('click', () => {
  isRecording = false;
  recordButton.disabled = false;
  stopButton.disabled = true;
  replayButton.disabled = beatQueue.length === 0;
  recorderStatus.textContent = `${beatQueue.length} beat${beatQueue.length === 1 ? '' : 's'} recorded.`;
});

replayButton.addEventListener('click', () => {
  if (beatQueue.length === 0) return;

  const firstTimestamp = beatQueue[0].timestamp;
  beatQueue.forEach((beat) => {
    window.setTimeout(() => playAudio(beat.sound), beat.timestamp - firstTimestamp);
  });
  recorderStatus.textContent = `Replaying ${beatQueue.length} beat${beatQueue.length === 1 ? '' : 's'}.`;
});
