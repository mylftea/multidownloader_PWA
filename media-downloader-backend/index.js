const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/downloads', express.static(path.join(__dirname, 'downloads')));

app.post('/download', (req, res) => {
  const { url, format } = req.body;

  if (!url || !format) {
    return res.status(400).send({ error: 'Missing URL or format' });
  }

  const safeFormat = ['mp4', 'mp3', 'm4a', 'wav'].includes(format) ? format : 'mp4';
  const command = `yt-dlp -f bestaudio[ext=${safeFormat}]/best[ext=${safeFormat}] --output downloads/%(title)s.%(ext)s ${url}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('Download error:', stderr);
      return res.status(500).send({ error: 'Download failed' });
    }

    const filenameMatch = stdout.match(/\[download\]\sDestination:\s(.+)/);
    if (filenameMatch && filenameMatch[1]) {
      const file = path.basename(filenameMatch[1].trim());
      return res.send({ fileUrl: `/downloads/${file}` });
    } else {
      return res.status(200).send({ message: 'Download complete but filename not found' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
