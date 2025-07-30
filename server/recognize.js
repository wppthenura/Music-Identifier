const crypto = require('crypto');
const axios = require('axios');
const FormData = require('form-data');

module.exports = async function recognize(audioBuffer) {
  const host = process.env.ACR_HOST;
  const accessKey = process.env.ACR_ACCESS_KEY;
  const accessSecret = process.env.ACR_ACCESS_SECRET;
  const httpMethod = 'POST';
  const httpURL = '/v1/identify';
  const dataType = 'audio';
  const signatureVersion = '1';
  const timestamp = Math.floor(Date.now() / 1000);

  const stringToSign = [
    httpMethod,
    httpURL,
    accessKey,
    dataType,
    signatureVersion,
    timestamp,
  ].join('\n');

  const signature = crypto
    .createHmac('sha1', accessSecret)
    .update(stringToSign)
    .digest('base64');

  const form = new FormData();
  form.append('sample', audioBuffer, 'sample.wav');
  form.append('access_key', accessKey);
  form.append('data_type', dataType);
  form.append('signature_version', signatureVersion);
  form.append('signature', signature);
  form.append('timestamp', timestamp);

  const response = await axios.post(`https://${host}/v1/identify`, form, {
    headers: form.getHeaders(),
    maxBodyLength: Infinity
  });

  const result = response.data;
  const song = result.metadata?.music?.[0];

  if (song) {
    return {
      title: song.title,
      artist: song.artists?.[0]?.name || 'Unknown Artist'
    };
  } else {
    return { title: null, artist: null };
  }
};
