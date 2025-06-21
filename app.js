let downloadQueue = [];
let isPaused = false;
let currentLang = "en";


const translations = {
  es: {
    title: "Descargador WEB",
    urlLabel: "Introduce la URL:",
    formatLabel: "Elige el formato:",
    formats: { mp4: "MP4 (Video)", mp3: "MP3 (Audio)", m4a: "M4A (Audio)", wav: "WAV (Audio)" },
    addQueue: "➕ Agregar a la cola", start: "⬇️ Iniciar Descargas", pause: "⏸ Pausar", resume: "▶ Reanudar",
    logsTitle: "Registros de descarga",
    status: { Queued: "En cola", Downloading: "Descargando...", Downloaded: "Descargado", Paused: "Pausado", Failed: "Fallido" }
  },
  fr: {
    title: "Téléchargeur WEB",
    urlLabel: "Entrez l'URL :",
    formatLabel: "Choisir le format :",
    formats: { mp4: "MP4 (Vidéo)", mp3: "MP3 (Audio)", m4a: "M4A (Audio)", wav: "WAV (Audio)" },
    addQueue: "➕ Ajouter à la file", start: "⬇️ Démarrer les téléchargements", pause: "⏸ Pause", resume: "▶ Reprendre",
    logsTitle: "Journaux de téléchargement",
    status: { Queued: "En file", Downloading: "Téléchargement...", Downloaded: "Téléchargé", Paused: "En pause", Failed: "Échoué" }
  },
  de: {
    title: "WebDownloader",
    urlLabel: "URL eingeben:",
    formatLabel: "Format auswählen:",
    formats: { mp4: "MP4 (Video)", mp3: "MP3 (Audio)", m4a: "M4A (Audio)", wav: "WAV (Audio)" },
    addQueue: "➕ Zur Warteschlange", start: "⬇️ Downloads starten", pause: "⏸ Pause", resume: "▶ Fortsetzen",
    logsTitle: "Download-Protokolle",
    status: { Queued: "Wartend", Downloading: "Lädt herunter...", Downloaded: "Heruntergeladen", Paused: "Pausiert", Failed: "Fehlgeschlagen" }
  },
  it: {
    title: "WebDownloader",
    urlLabel: "Inserisci l'URL:",
    formatLabel: "Scegli il formato:",
    formats: { mp4: "MP4 (Video)", mp3: "MP3 (Audio)", m4a: "M4A (Audio)", wav: "WAV (Audio)" },
    addQueue: "➕ Aggiungi alla coda", start: "⬇️ Avvia i download", pause: "⏸ Pausa", resume: "▶ Riprendi",
    logsTitle: "Registri di download",
    status: { Queued: "In coda", Downloading: "Scaricamento...", Downloaded: "Scaricato", Paused: "In pausa", Failed: "Fallito" }
  },
  zh: {
    title: "Web下载器",
    urlLabel: "输入网址：",
    formatLabel: "选择格式：",
    formats: { mp4: "MP4（视频）", mp3: "MP3（音频）", m4a: "M4A（音频）", wav: "WAV（音频）" },
    addQueue: "➕ 添加到队列", start: "⬇️ 开始下载", pause: "⏸ 暂停", resume: "▶ 恢复",
    logsTitle: "下载日志",
    status: { Queued: "排队中", Downloading: "下载中...", Downloaded: "已下载", Paused: "已暂停", Failed: "失败" }
  },
  ja: {
    title: "Webダウンローダー",
    urlLabel: "URLを入力：",
    formatLabel: "フォーマットを選択：",
    formats: { mp4: "MP4（ビデオ）", mp3: "MP3（オーディオ）", m4a: "M4A（オーディオ）", wav: "WAV（オーディオ）" },
    addQueue: "➕ キューに追加", start: "⬇️ ダウンロード開始", pause: "⏸ 一時停止", resume: "▶ 再開",
    logsTitle: "ダウンロードログ",
    status: { Queued: "待機中", Downloading: "ダウンロード中...", Downloaded: "完了", Paused: "一時停止", Failed: "失敗" }
  },
  ko: {
    title: "Web다운로더",
    urlLabel: "URL 입력:",
    formatLabel: "형식 선택:",
    formats: { mp4: "MP4 (비디오)", mp3: "MP3 (오디오)", m4a: "M4A (오디오)", wav: "WAV (오디오)" },
    addQueue: "➕ 대기열에 추가", start: "⬇️ 다운로드 시작", pause: "⏸ 일시중지", resume: "▶ 다시 시작",
    logsTitle: "다운로드 로그",
    status: { Queued: "대기 중", Downloading: "다운로드 중...", Downloaded: "완료됨", Paused: "일시 중지됨", Failed: "실패" }
  },
  hi: {
    title: "Webडाउनलोडर",
    urlLabel: "यूआरएल दर्ज करें:",
    formatLabel: "फॉर्मेट चुनें:",
    formats: { mp4: "MP4 (वीडियो)", mp3: "MP3 (ऑडियो)", m4a: "M4A (ऑडियो)", wav: "WAV (ऑडियो)" },
    addQueue: "➕ कतार में जोड़ें", start: "⬇️ डाउनलोड शुरू करें", pause: "⏸ रोकें", resume: "▶ पुनः प्रारंभ करें",
    logsTitle: "डाउनलोड लॉग",
    status: { Queued: "प्रतीक्षा में", Downloading: "डाउनलोड हो रहा है...", Downloaded: "डाउनलोड हो गया", Paused: "रुका हुआ", Failed: "असफल" }
  },

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
  const qList = document.getElementById('queueList');
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
  const logList = [];
  for (let i = 0; i < downloadQueue.length; i++) {
    const item = downloadQueue[i];
    if (item.status !== localizeStatus("Queued") && item.status !== localizeStatus("Paused")) continue;
    item.status = localizeStatus("Downloading");
    updateQueueDisplay();
    for (let p = 0; p <= 100; p += 10) {
      if (isPaused) {
        item.status = localizeStatus("Paused");
        updateQueueDisplay();
        return;
      }
      item.progress = p;
      updateQueueDisplay();
      await new Promise(r => setTimeout(r, 200));
    }

    const blob = new Blob([`Downloaded from ${item.url}`], {
      type: item.format === 'mp4' ? 'video/mp4' :
        item.format === 'mp3' ? 'audio/mpeg' :
          item.format === 'm4a' ? 'audio/mp4' :
            'audio/wav'
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = item.fileName;
    a.click();
    a.remove();
    item.status = localizeStatus("Downloaded");
    item.progress = 100;
    logList.push(`✅ ${item.url} saved as ${item.fileName}`);
    updateQueueDisplay();
  }

  const previousLogs = JSON.parse(localStorage.getItem('downloadLogs') || '[]');
  const updatedLogs = previousLogs.concat(logList);
  localStorage.setItem('downloadLogs', JSON.stringify(updatedLogs));
  document.getElementById('logContainer').innerHTML = updatedLogs.map(l => `<div>📝 ${l}</div>`).join('');
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
    const url = document.getElementById('urlInput').value.trim();
    const format = document.getElementById('formatSelect').value;
    if (!url) return alert("Please enter a URL.");
    let extracted = '';
    try {
      const pathName = new URL(url).pathname;
      const last = pathName.split('/').pop();
      if (last.includes('.')) extracted = last;
    } catch { }
    let fallback = `file_${downloadQueue.length + 1}.${format}`;
    let fileName = extracted || fallback;

    fetchMetadata(url, (meta) => {
      const cleanTitle = meta?.title?.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      if (cleanTitle) fileName = `${cleanTitle}.${format}`;
      downloadQueue.push({
        url, format, status: localizeStatus("Queued"), progress: 0,
        fileName, title: meta?.title || '', thumbnail: meta?.thumbnail || ''
      });
      updateQueueDisplay();
      document.getElementById('urlInput').value = '';
    });
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

  const theme = localStorage.getItem('theme');
  if (theme === 'dark') {
    document.body.classList.add('dark');
    modeLabel.textContent = '🌙 Dark';
  }


  const allLangs = {
    en: "🇺🇸 English", fil: "🇵🇭 Filipino", es: "🇪🇸 Español", fr: "🇫🇷 Français", de: "🇩🇪 Deutsch",
    it: "🇮🇹 Italiano", zh: "🇨🇳 中文", ja: "🇯🇵 日本語", ko: "🇰🇷 한국어", hi: "🇮🇳 हिंदी",
    ar: "🇸🇦 العربية", ru: "🇷🇺 Русский", pt: "🇧🇷 Português", vi: "🇻🇳 Tiếng Việt", th: "🇹🇭 ภาษาไทย"
  };

  Object.entries(allLangs).forEach(([code, label]) => {
    const opt = document.createElement('option');
    opt.value = code;
    opt.textContent = label;
    langSelect.appendChild(opt);
  });

  const storedLang = localStorage.getItem('lang');
  if (storedLang) {
    langSelect.value = storedLang;
    applyTranslations(storedLang);
  } else {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        const country = data.country || '';

        const detectMap = {
          PH: 'fil', ES: 'es', FR: 'fr', DE: 'de', IT: 'it', CN: 'zh', JP: 'ja', KR: 'ko',
          IN: 'hi', SA: 'ar', RU: 'ru', BR: 'pt', VN: 'vi', TH: 'th'
        };

        const lang = detectMap[country] || 'en';
        langSelect.value = lang;
        localStorage.setItem('lang', lang);
        applyTranslations(lang);
      })
      .catch(() => {
        langSelect.value = 'en';
        applyTranslations('en');
      });
  }

  const storedLogs = JSON.parse(localStorage.getItem('downloadLogs') || '[]');
  document.getElementById('logContainer').innerHTML = storedLogs.map(l => `<div>📝 ${l}</div>`).join('');
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

  let installPromptEvent;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    installPromptEvent = e;
    // Show a custom "Install" button…
  });

  function triggerInstall() {
    if (installPromptEvent) {
      installPromptEvent.prompt();
      installPromptEvent.userChoice.then(choice => {
        console.log('User choice:', choice.outcome);
      });
      installPromptEvent = null;
    }
  }


  let deferredPrompt;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Show popup after a short delay
    setTimeout(() => {
      document.getElementById('installPopup').style.display = 'flex';
    }, 1500); // 1.5 second delay
  });

  document.getElementById('installBtn').addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      console.log(`User choice: ${result.outcome}`);
      deferredPrompt = null;
    }
    document.getElementById('installPopup').style.display = 'none';
  });

  document.getElementById('closePopup').addEventListener('click', () => {
    document.getElementById('installPopup').style.display = 'none';
  });
}




