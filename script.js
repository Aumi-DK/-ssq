const results = document.getElementById('results');
const countInput = document.getElementById('count');
const countLabel = document.getElementById('countLabel');
const countPrefix = document.getElementById('countPrefix');
const countSuffix = document.getElementById('countSuffix');
const winRedsInput = document.getElementById('winReds');
const winBlueInput = document.getElementById('winBlue');
const themeToggle = document.getElementById('themeToggle');
const langSelect = document.getElementById('langSelect');

const titleText = document.getElementById('titleText');
const subtitleText = document.getElementById('subtitleText');
const generateBtn = document.getElementById('generate');
const copyBtn = document.getElementById('copy');
const themeLabel = document.getElementById('themeLabel');
const winRedLabel = document.getElementById('winRedLabel');
const winBlueLabel = document.getElementById('winBlueLabel');
const checkBtn = document.getElementById('check');
const helperText = document.getElementById('helperText');
const footerText = document.getElementById('footerText');
const contactTitle = document.getElementById('contactTitle');
const contactSub = document.getElementById('contactSub');
const emailLabelText = document.getElementById('emailLabelText');
const nameLabelText = document.getElementById('nameLabelText');
const messageLabelText = document.getElementById('messageLabelText');
const emailInput = document.getElementById('emailInput');
const nameInput = document.getElementById('nameInput');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const contactForm = document.getElementById('contactForm');
const contactStatus = document.getElementById('contactStatus');

const translations = {
  ko: {
    title: '双色球 번호 추천기',
    subtitle: '1~33 사이에서 빨간 공 6개, 1~16 사이에서 파란 공 1개를 무작위 추천합니다.',
    generate: '추천 번호 생성',
    copy: '클립보드로 복사',
    countPrefix: '세트 개수:',
    countSuffix: '개',
    theme: '다크 모드',
    setLabel: '추천',
    winRedLabel: '당첨 빨간 공 (6개, 쉼표/공백 구분)',
    winRedPlaceholder: '예: 3,8,11,22,25,30',
    winBlueLabel: '당첨 파란 공 (1개)',
    winBluePlaceholder: '1~16',
    check: '당첨 확인',
    helper: 'Tip: 버튼을 눌러 새로운 조합을 바로 만들어 보세요.',
    footer: '참고: 추천 번호는 재미용이며 당첨을 보장하지 않습니다.',
    contactTitle: '문의하기',
    contactSub: '피드백이나 개선 아이디어가 있다면 메시지를 남겨주세요.',
    emailLabel: '이메일 (답변용)',
    nameLabel: '이름 / 별명',
    namePlaceholder: '홍길동',
    messageLabel: '메시지',
    messagePlaceholder: '원하시는 기능이나 버그 제보를 적어주세요.',
    send: '보내기',
    clipboardOk: '클립보드에 복사되었습니다.',
    clipboardFail: '복사에 실패했습니다. 브라우저 권한을 확인하세요.',
    redError: '빨간 공은 1~33 사이의 서로 다른 숫자 6개를 입력하세요.',
    blueError: '파란 공은 1~16 사이의 숫자 1개를 입력하세요.',
    contactSending: '전송 중...',
    contactOk: '보냈습니다! 곧 답변드릴게요.',
    contactFail: '전송에 실패했습니다. 잠시 후 다시 시도해주세요.',
    contactNet: '네트워크 오류입니다. 다시 시도해주세요.',
    hitTag: (r) => `적중 R${r}`,
    hitTagBlue: (r) => `적중 R${r}+B`,
    statusNone: '—'
  },
  zh: {
    title: '双色球号码推荐器',
    subtitle: '从1~33随机选6个红球，从1~16随机选1个蓝球。',
    generate: '生成推荐号码',
    copy: '复制到剪贴板',
    countPrefix: '组合数：',
    countSuffix: '组',
    theme: '深色模式',
    setLabel: '推荐',
    winRedLabel: '开奖号码（6个红球，逗号/空格分隔）',
    winRedPlaceholder: '例：3,8,11,22,25,30',
    winBlueLabel: '开奖号码（1个蓝球）',
    winBluePlaceholder: '1~16',
    check: '检查是否中奖',
    helper: '提示：点击按钮即可生成新的组合。',
    footer: '说明：推荐号码仅供娱乐，不保证中奖。',
    contactTitle: '联系我们',
    contactSub: '有建议或想要的功能，请留言告诉我。',
    emailLabel: '邮箱（用于回复）',
    nameLabel: '姓名/昵称',
    namePlaceholder: '张三',
    messageLabel: '留言',
    messagePlaceholder: '想要的功能或Bug描述都可以。',
    send: '发送',
    clipboardOk: '已复制到剪贴板。',
    clipboardFail: '复制失败，请检查浏览器权限。',
    redError: '红球请输入1~33之间互不相同的6个数字。',
    blueError: '蓝球请输入1~16之间的1个数字。',
    contactSending: '发送中...',
    contactOk: '已发送！我们会尽快回复。',
    contactFail: '发送失败，请稍后再试。',
    contactNet: '网络错误，请重试。',
    hitTag: (r) => `命中 R${r}`,
    hitTagBlue: (r) => `命中 R${r}+B`,
    statusNone: '—'
  }
};

const pickUnique = (max, n) => {
  const pool = Array.from({ length: max }, (_, i) => i + 1);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, n).sort((a, b) => a - b);
};

function renderSets() {
  const t = translations[currentLocale];
  results.innerHTML = '';
  currentSets.forEach((set, idx) => {
    const evalInfo = evaluations[idx];
    let tag = '';
    if (evalInfo) {
      tag = evalInfo.blue
        ? `<span class="tag ${evalInfo.jackpot ? 'jackpot' : ''}">${t.hitTagBlue(evalInfo.red)}</span>`
        : `<span class="tag">${t.hitTag(evalInfo.red)}</span>`;
    }
    const row = document.createElement('div');
    row.className = 'set';
    row.innerHTML = `
      <div class="label">${set.label}</div>
      <div class="balls">${set.reds.map(n => `<span class="ball red">${String(n).padStart(2, '0')}</span>`).join('')}
        <span class="ball blue">${String(set.blue).padStart(2, '0')}</span>
      </div>
      <div class="status">${tag || t.statusNone}</div>`;
    results.appendChild(row);
  });
}

function generateSets() {
  const count = Number(countInput.value);
  const t = translations[currentLocale];
  currentSets = Array.from({ length: count }, (_, idx) => ({
    reds: pickUnique(33, 6),
    blue: pickUnique(16, 1)[0],
    label: `${t.setLabel} ${idx + 1}`
  }));
  evaluations = Array(count).fill(null);
  renderSets();
  return currentSets;
}

function copySets(sets) {
  const text = sets.map(s => `R:${s.reds.join(',')} B:${s.blue}`).join('\n');
  const t = translations[currentLocale];
  navigator.clipboard.writeText(text)
    .then(() => alert(t.clipboardOk))
    .catch(() => alert(t.clipboardFail));
}

document.getElementById('generate').addEventListener('click', () => {
  currentSets = generateSets();
});

document.getElementById('copy').addEventListener('click', () => {
  if (!currentSets.length) currentSets = generateSets();
  copySets(currentSets);
});

function updateCountLabel() {
  const t = translations[currentLocale];
  countPrefix.textContent = t.countPrefix;
  countLabel.textContent = countInput.value;
  countSuffix.textContent = t.countSuffix;
}

countInput.addEventListener('input', (e) => {
  updateCountLabel();
});

function parseWinning() {
  const redsRaw = winRedsInput.value.replace(/，/g, ',');
  const reds = redsRaw.split(/[\s,]+/).filter(Boolean).map(Number);
  const blue = Number(winBlueInput.value);
  const t = translations[currentLocale];

  if (reds.length !== 6 || new Set(reds).size !== 6 || reds.some(n => n < 1 || n > 33 || Number.isNaN(n))) {
    alert(t.redError);
    return null;
  }
  if (Number.isNaN(blue) || blue < 1 || blue > 16) {
    alert(t.blueError);
    return null;
  }
  return { reds: new Set(reds), blue };
}

function checkWinning() {
  const winning = parseWinning();
  if (!winning) return;
  evaluations = currentSets.map(set => {
    const redHit = set.reds.filter(n => winning.reds.has(n)).length;
    const blueHit = set.blue === winning.blue;
    return { red: redHit, blue: blueHit, jackpot: redHit === 6 && blueHit };
  });
  renderSets();
  if (evaluations.some(e => e?.jackpot)) {
    startConfetti();
  }
}

document.getElementById('check').addEventListener('click', checkWinning);

let currentSets = [];
let evaluations = [];

// Theme handling
const THEME_KEY = 'ssq-theme';
function applyTheme(mode) {
  document.documentElement.setAttribute('data-theme', mode);
  themeToggle.checked = mode === 'dark';
  localStorage.setItem(THEME_KEY, mode);
}
themeToggle.addEventListener('change', () => {
  applyTheme(themeToggle.checked ? 'dark' : 'light');
});
const savedTheme = localStorage.getItem(THEME_KEY);
applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

// Language handling
const LANG_KEY = 'ssq-lang';
let currentLocale = localStorage.getItem(LANG_KEY) || 'ko';
langSelect.value = currentLocale;

function applyLocale(locale) {
  currentLocale = locale;
  localStorage.setItem(LANG_KEY, locale);
  const t = translations[locale];
  document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'ko';

  titleText.textContent = t.title;
  subtitleText.textContent = t.subtitle;
  generateBtn.textContent = t.generate;
  copyBtn.textContent = t.copy;
  themeLabel.textContent = t.theme;
  winRedLabel.textContent = t.winRedLabel;
  winRedsInput.placeholder = t.winRedPlaceholder;
  winBlueLabel.textContent = t.winBlueLabel;
  winBlueInput.placeholder = t.winBluePlaceholder;
  checkBtn.textContent = t.check;
  helperText.textContent = t.helper;
  footerText.textContent = t.footer;
  contactTitle.textContent = t.contactTitle;
  contactSub.textContent = t.contactSub;
  emailLabelText.textContent = t.emailLabel;
  nameLabelText.textContent = t.nameLabel;
  nameInput.placeholder = t.namePlaceholder;
  messageLabelText.textContent = t.messageLabel;
  messageInput.placeholder = t.messagePlaceholder;
  sendButton.textContent = t.send;
  updateCountLabel();
  // relabel sets for current locale
  currentSets = currentSets.map((s, idx) => ({ ...s, label: `${t.setLabel} ${idx + 1}` }));
  renderSets();
}

langSelect.addEventListener('change', (e) => {
  applyLocale(e.target.value);
});

applyLocale(currentLocale);
currentSets = generateSets();

// Contact form submit
contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const t = translations[currentLocale];
  contactStatus.textContent = t.contactSending;
  const formData = new FormData(contactForm);
  try {
    const resp = await fetch(contactForm.action, {
      method: 'POST',
      body: formData,
      headers: { Accept: 'application/json' }
    });
    if (resp.ok) {
      contactStatus.textContent = t.contactOk;
      contactForm.reset();
    } else {
      contactStatus.textContent = t.contactFail;
    }
  } catch (err) {
    contactStatus.textContent = t.contactNet;
  }
});

// Confetti effect
const confettiCanvas = document.getElementById('confetti');
const ctx = confettiCanvas.getContext('2d');
let confettiParticles = [];
let confettiActive = false;
let confettiTimer;

function resizeCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function spawnConfetti(count = 160) {
  confettiParticles = Array.from({ length: count }, () => ({
    x: Math.random() * confettiCanvas.width,
    y: Math.random() * confettiCanvas.height - confettiCanvas.height,
    r: Math.random() * 6 + 4,
    dx: Math.random() * 4 - 2,
    dy: Math.random() * 3 + 2,
    color: `hsl(${Math.random() * 360}, 100%, 60%)`,
    tilt: Math.random() * 10,
    tiltAngle: Math.random() * Math.PI
  }));
}

function drawConfetti() {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiParticles.forEach(p => {
    ctx.beginPath();
    ctx.fillStyle = p.color;
    ctx.ellipse(p.x, p.y, p.r, p.r * 0.6, p.tiltAngle, 0, Math.PI * 2);
    ctx.fill();
  });
}

function updateConfetti() {
  confettiParticles.forEach(p => {
    p.x += p.dx;
    p.y += p.dy;
    p.tiltAngle += 0.05;
    if (p.y > confettiCanvas.height) {
      p.y = -10;
      p.x = Math.random() * confettiCanvas.width;
    }
  });
}

function confettiLoop() {
  if (!confettiActive) return;
  updateConfetti();
  drawConfetti();
  requestAnimationFrame(confettiLoop);
}

function startConfetti(duration = 3500) {
  confettiActive = true;
  spawnConfetti();
  confettiLoop();
  clearTimeout(confettiTimer);
  confettiTimer = setTimeout(stopConfetti, duration);
}

function stopConfetti() {
  confettiActive = false;
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
}
