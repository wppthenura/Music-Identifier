document.getElementById('start-btn').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'startCapture' });

  const info = document.getElementById('song-info');
  info.textContent = 'Listening...';

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === 'songDetected') {
      info.textContent = `🎵 ${msg.title} - ${msg.artist}`;
    } else if (msg.action === 'noMatch') {
      info.textContent = '❌ No song detected';
    }
  });
});
