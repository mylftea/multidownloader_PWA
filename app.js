import { translations } from './translations.js';

let downloadQueue = [];
let isPaused = false;
let currentLang = "en";

const selectors = {
  urlInput: () => document.getElementById('urlInput'),
  formatSelect: () => document.getElementById('formatSelect'),
  queueList: () => document.getElementById('queueList'),
  logContainer: () => document.getElementById('logContainer'),
  themeSwitch: () => document.getElementById('themeSwitch'),
  modeLabel: () => document.getElementById('modeLabel'),
  langSelect: () => document.getElementById('langSelect'),
  installBtn: () => document.getElementById('installBtn'),
  installPopup: () => document.getElementById('installPopup'),
  installPopupBtn: () => document.getElementById('installPopupBtn'),
  closePopup: () => document.getElementById('closePopup'),
  buttons: {
    addQueue: () => document.getElementById('addToQueueBtn'),
    start: () => document.getElementById('startDownloadsBtn'),
    pause: () => document.getElementById('pauseBtn'),
    resume: () => document.getElementById('resumeBtn'),
    clearLogs: () => document.getElementById('clearLogsBtn'),
  },
};

function updateQueueDisplay() {
  const qList = selectors.queueList();
  qList.innerHTML = '';

  downloadQueue.forEach((item, index) => {
    const el = document.createElement('div');
    el.className = 'queue-item';
    el.innerHTML = `
      <div><strong>#${index + 1}</strong> | ${item.url}</div>
      <div>Status: ${item.status}</div>
      <div>📁 ${item.fileName}</div>
      ${item.title ? `<div><strong>📺 ${item.title}</strong></div>` : ''}
      ${item.thumbnail ? `<img src="${item.thumbnail}" alt="thumbnail" style="max-width:100%; border-radius:8px;" />` : ''}
      <div style="background:#ddd; border-radius:4px; overflow:hidden;">
        <div style="width:${item.progress || 0}%; background:#4CAF50; height:8px;"></div>
      </div>
      <div>
        <button onclick="moveUp(${index})">⬆️</button>
        <button onclick="moveDown(${index})">⬇️</button>
        <button onclick="removeItem(${index})">🗑</button>
      </div>
    `;
    qList.appendChild(el);
  });
}

// ✅ Register so nested functions (like async callbacks) can access it
window.updateQueueDisplay = updateQueueDisplay;

function fetchMetadata(url, callback) {
  fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`)
    .then(res => res.json())
    .then(data => callback({
      title: data?.title || '',
      thumbnail: data?.thumbnail_url || ''
    }))
    .catch(() => callback(null));
}

function localizeStatus(status) {
  return translations[currentLang]?.status[status] || status;
}

function addToQueue() {
  const url = selectors.urlInput().value.trim();
  const format = selectors.formatSelect().value;
  if (!url) return alert("Please enter a URL.");

  let fileName = `file_${downloadQueue.length + 1}.${format}`;
  fetchMetadata(url, (meta) => {
    const cleanTitle = meta?.title?.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    if (cleanTitle) fileName = `${cleanTitle}.${format}`;

    downloadQueue.push({
      url,
      format,
      status: localizeStatus("Queued"),
      progress: 0,
      fileName,
      title: meta?.title || '',
      thumbnail: meta?.thumbnail || ''
    });

    window.updateQueueDisplay();
    selectors.urlInput().value = '';
  });
}

function clearLogs() {
  localStorage.removeItem('downloadLogs');
  selectors.logContainer().innerHTML = '';
}

async function processQueue() {
  const logList = [];

  for (let i = 0; i < downloadQueue.length; i++) {
    const item = downloadQueue[i];
    if (item.status !== localizeStatus("Queued") && item.status !== localizeStatus("Paused")) continue;

    item.status = localizeStatus("Downloading");
    window.updateQueueDisplay();

    for (let p = 0; p <= 100; p += 10) {
      if (isPaused) {
        item.status = localizeStatus("Paused");
        window.updateQueueDisplay();
        return;
      }
      item.progress = p;
      window.updateQueueDisplay();
      await new Promise(r => setTimeout(r, 200));
    }

    try {
      const res = await fetch('https://my-multidownload-backend-server.onrender.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: item.url, format: item.format })
      });

      const data = await res.json();
      if (data.fileUrl) {
        const a = document.createElement('a');
        a.href = `https://my-multidownload-backend-server.onrender.com${data.fileUrl}`;
        a.download = '';
        a.click();
        item.status = localizeStatus("Downloaded");
      } else {
        item.status = localizeStatus("Failed");
        alert('Download failed: ' + data.message);
      }
    } catch (err) {
      console.error('Backend error:', err);
      item.status = localizeStatus("Failed");
      alert('Server error or download failed.');
    }

    item.progress = 100;
    window.updateQueueDisplay();
    logList.push(`Downloaded: ${item.fileName} (${item.title})`);
  }

  const previousLogs = JSON.parse(localStorage.getItem('downloadLogs') || '[]');
  const updatedLogs = previousLogs.concat(logList);
  localStorage.setItem('downloadLogs', JSON.stringify(updatedLogs));
  selectors.logContainer().innerHTML = updatedLogs.map(l => `<div>📝 ${l}</div>`).join('');
}

function setButtonHandlers() {
  const { addQueue, start, pause, resume, clearLogs } = selectors.buttons;

  addQueue().onclick = () => {
    console.log("🟢 Add to Queue clicked");
    addToQueue();
  };
  start().onclick = () => {
    console.log("🟢 Start Downloads clicked");
    isPaused = false;
    processQueue();
  };
  pause().onclick = () => {
    console.log("🟢 Pause clicked");
    isPaused = true;
  };
  resume().onclick = () => {
    console.log("🟢 Resume clicked");
    isPaused = false;
    processQueue();
  };
  clearLogs().onclick = () => {
    console.log("🟢 Clear Logs clicked");
    clearLogs();
  };
}

function init() {
  console.log("✅ init() function is executing");

  setButtonHandlers();
  applyTranslations(localStorage.getItem('lang') || 'en');

  selectors.langSelect().onchange = (e) => {
    const lang = e.target.value;
    localStorage.setItem('lang', lang);
    applyTranslations(lang);
  };

  const logs = JSON.parse(localStorage.getItem('downloadLogs') || '[]');
  selectors.logContainer().innerHTML = logs.map(l => `<div>📝 ${l}</div>`).join('');

  const theme = localStorage.getItem('theme');
  if (theme === 'dark') document.body.classList.add('dark');

  selectors.themeSwitch().onclick = () => {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    selectors.modeLabel().textContent = isDark ? '🌙 Dark' : '☀️ Light';
  };
}

console.log("✅ app.js loaded");
document.addEventListener('DOMContentLoaded', init);
