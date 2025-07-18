export async function recordAudioFromStream(stream, duration = 10000) {
  return new Promise((resolve, reject) => {
    const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
    const chunks = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onerror = (e) => reject(e.error);

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      resolve(blob);
    };

    recorder.start();

    setTimeout(() => recorder.stop(), duration);
  });
}

export async function sendToBackend(blob) {
  const formData = new FormData();
  formData.append('audio', blob, 'sample.webm');

  const res = await fetch('http://localhost:5000/recognize', {
    method: 'POST',
    body: formData
  });

  if (!res.ok) throw new Error('Failed to recognize audio');

  return res.json();
}
