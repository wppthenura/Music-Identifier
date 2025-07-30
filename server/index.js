require('dotenv').config();
const express = require('express');
const multer = require('multer');
const recognize = require('./recognize');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
const upload = multer({ storage: multer.memoryStorage() });

app.post('/recognize', upload.single('audio'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No audio file uploaded' });

  try {
    const result = await recognize(req.file.buffer);
    res.json(result);
  } catch (err) {
    console.error('[SERVER] Error:', err.message);
    res.status(500).json({ error: 'Recognition failed' });
  }
});

app.listen(port, () => {
  console.log(`🎧 Music Recognition Server running at http://localhost:${port}`);
});
