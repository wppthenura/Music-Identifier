import { recordAudioFromStream, sendToBackend } from './recorder.js';

chrome.runtime.onMessage.addListener(async (msg, sender) => {
  if (msg.action === 'startCapture') {
    chrome.tabCapture.capture({ audio: true, video: false }, async (stream) => {
      if (!stream) {
        chrome.runtime.sendMessage({ action: 'noMatch' });
        return;
      }

      try {
        const audioBlob = await recordAudioFromStream(stream);
        const result = await sendToBackend(audioBlob);

        if (result?.title) {
          chrome.runtime.sendMessage({
            action: 'songDetected',
            title: result.title,
            artist: result.artist
          });
        } else {
          chrome.runtime.sendMessage({ action: 'noMatch' });
        }
      } catch (e) {
        console.error(e);
        chrome.runtime.sendMessage({ action: 'noMatch' });
      }
    });
  }
});
