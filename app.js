let downloadQueue = [];
let isPaused = false;
let currentLang = "en";

const translations = {
  en: {
    title: "WebDownloader",
    urlLabel: "Enter URL:",
    formatLabel: "Choose Format:",
    formats: { mp4: "MP4 (Video)", mp3: "MP3 (Audio)", m4a: "M4A (Audio)", wav: "WAV (Audio)" },
    addQueue: "➕ Add to Queue", start: "⬇️ Start Downloads", pause: "⏸ Pause", resume: "▶ Resume",
    logsTitle: "Download Logs",
    status: { Queued: "Queued", Downloading: "Downloading...", Downloaded: "Downloaded", Paused: "Paused", Failed: "Failed" }
  },
  fil: {
    title: "Pang-download ng Maramihan", urlLabel: "Ilagay ang URL:", formatLabel: "Piliin ang Format:",
    formats: { mp4: "MP4 (Bidyo)", mp3: "MP3 (Awdio)", m4a: "M4A (Awdio)", wav: "WAV (Awdio)" },
    addQueue: "➕ Idagdag sa Pila", start: "⬇️ Simulan ang Pag-download", pause: "⏸ I-pause", resume: "▶ Ipagpatuloy",
    logsTitle: "Mga Log ng Pag-download",
    status: { Queued: "Nakapila", Downloading: "Nagda-download...", Downloaded: "Na-download", Paused: "Naka-pause", Failed: "Nabigo" }
  }
  // Add additional languages here as needed
};

function applyTranslations(lang) {
  const t = translations[lang] || translations.en;
  currentLang = lang;
  document.getElementById('title').textContent = t.title;
  document.getElementById('urlLabel').textContent = t.urlLabel;
  document.getElementById('formatLabel').textContent = t.formatLabel;
  document.getElementById('addToQueueBtn').textContent = t.addQueue;
  document.getElementById('startDownloadsBtn').textContent = t.start;
  document.getElementById('pauseBtn').textContent = t.pause;
  document.getElementById('resumeBtn').textContent = t.resume;
  document.getElementById('logsTitle').textContent = t.logsTitle;

  const formatSelect = document.getElementById('formatSelect');
  formatSelect.innerHTML = '';
  Object.entries(t.formats).forEach(([val, label]) => {
    const opt = document.createElement('option');
    opt.value = val;
    opt.textContent = label;
    formatSelect.appendChild(opt);
  });
}

function localizeStatus(status) {
  return translations[currentLang]?.status[status] || status;
}

function fetchMetadata(url, callback) {
  fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`)
    .then(res => res.json())
    .then(data => callback({
      title: data?.title || '',
      thumbnail: data?.thumbnail_url || ''
    }))
    .catch(() => callback(null));
}

function updateQueueDisplay() {
  // Implement your UI update logic here
}

function moveUp(i) {
  if (i <= 0) return;
  [downloadQueue[i - 1], downloadQueue[i]] = [downloadQueue[i], downloadQueue[i - 1]];
  updateQueueDisplay();
}
function moveDown(i) {
  if (i >= downloadQueue.length - 1) return;
  [downloadQueue[i + 1], downloadQueue[i]] = [downloadQueue[i], downloadQueue[i + 1]];
  updateQueueDisplay();
}
function removeItem(i) {
  downloadQueue.splice(i, 1);
  updateQueueDisplay();
}

async function processQueue() {
  // Simulate download process for demonstration
}

document.addEventListener('DOMContentLoaded', () => {
  const themeSwitch = document.getElementById('themeSwitch');
  const modeLabel = document.getElementById('modeLabel');
  const langSelect = document.getElementById('langSelect');

  document.getElementById('clearLogsBtn').onclick = () => {
    localStorage.removeItem('downloadLogs');
    document.getElementById('logContainer').innerHTML = '';
  };

  document.getElementById('pauseBtn').onclick = () => isPaused = true;
  document.getElementById('resumeBtn').onclick = () => { isPaused = false; processQueue(); };
  document.getElementById('startDownloadsBtn').onclick = () => {
    isPaused = false;
    processQueue();
  };
  document.getElementById('addToQueueBtn').onclick = () => {
    // Your existing add-to-queue logic here
  };

  themeSwitch.onclick = () => {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    modeLabel.textContent = isDark ? '🌙 Dark' : '☀️ Light';
  };

  langSelect.onchange = (e) => {
    const newLang = e.target.value;
    localStorage.setItem('lang', newLang);
    applyTranslations(newLang);
  };

  const storedLang = localStorage.getItem('lang') || 'en';
  langSelect.value = storedLang;
  applyTranslations(storedLang);

  // ✅ Install modal logic
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    setTimeout(() => {
      const popup = document.getElementById('installPopup');
      if (popup) popup.style.display = 'flex';
    }, 1500);
  });

  const installBtn = document.getElementById('installBtn');
  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const result = await deferredPrompt.userChoice;
        console.log(`User choice: ${result.outcome}`);
        deferredPrompt = null;
      }
      const popup = document.getElementById('installPopup');
      if (popup) popup.style.display = 'none';
    });
  }

  const closePopup = document.getElementById('closePopup');
  if (closePopup) {
    closePopup.addEventListener('click', () => {
      const popup = document.getElementById('installPopup');
      if (popup) popup.style.display = 'none';
    });
  }
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered:', reg);
    } catch (err) {
      console.error('SW registration failed:', err);
    }
  });
}
