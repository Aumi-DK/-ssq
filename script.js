const results = document.getElementById('results');
const countInput = document.getElementById('count');
const countLabel = document.getElementById('countLabel');
const winRedsInput = document.getElementById('winReds');
const winBlueInput = document.getElementById('winBlue');
const themeToggle = document.getElementById('themeToggle');

const pickUnique = (max, n) => {
  const pool = Array.from({ length: max }, (_, i) => i + 1);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, n).sort((a, b) => a - b);
};

function renderSets() {
  results.innerHTML = '';
  currentSets.forEach((set, idx) => {
    const evalInfo = evaluations[idx];
    const tag = evalInfo
      ? `<span class="tag ${evalInfo.jackpot ? 'jackpot' : ''}">적중 R${evalInfo.red}${evalInfo.blue ? '+B' : ''}</span>`
      : '';
    const row = document.createElement('div');
    row.className = 'set';
    row.innerHTML = `
      <div class="label">${set.label}</div>
      <div class="balls">${set.reds.map(n => `<span class="ball red">${String(n).padStart(2, '0')}</span>`).join('')}
        <span class="ball blue">${String(set.blue).padStart(2, '0')}</span>
      </div>
      <div class="status">${tag || '—'}</div>`;
    results.appendChild(row);
  });
}

function generateSets() {
  const count = Number(countInput.value);
  currentSets = Array.from({ length: count }, (_, idx) => ({
    reds: pickUnique(33, 6),
    blue: pickUnique(16, 1)[0],
    label: `추천 ${idx + 1}`
  }));
  evaluations = Array(count).fill(null);
  renderSets();
  return currentSets;
}

function copySets(sets) {
  const text = sets.map(s => `R:${s.reds.join(',')} B:${s.blue}`).join('\n');
  navigator.clipboard.writeText(text)
    .then(() => alert('클립보드에 복사되었습니다.'))
    .catch(() => alert('복사에 실패했습니다. 브라우저 권한을 확인하세요.'));
}

document.getElementById('generate').addEventListener('click', () => {
  currentSets = generateSets();
});

document.getElementById('copy').addEventListener('click', () => {
  if (!currentSets.length) currentSets = generateSets();
  copySets(currentSets);
});

countInput.addEventListener('input', (e) => {
  countLabel.textContent = e.target.value;
});

function parseWinning() {
  const redsRaw = winRedsInput.value.replace(/，/g, ',');
  const reds = redsRaw.split(/[\s,]+/).filter(Boolean).map(Number);
  const blue = Number(winBlueInput.value);

  if (reds.length !== 6 || new Set(reds).size !== 6 || reds.some(n => n < 1 || n > 33 || Number.isNaN(n))) {
    alert('빨간 공은 1~33 사이의 서로 다른 숫자 6개를 입력하세요.');
    return null;
  }
  if (Number.isNaN(blue) || blue < 1 || blue > 16) {
    alert('파란 공은 1~16 사이의 숫자 1개를 입력하세요.');
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
currentSets = generateSets();

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

// Contact form submit
const contactForm = document.getElementById('contactForm');
const contactStatus = document.getElementById('contactStatus');
contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  contactStatus.textContent = '전송 중...';
  const formData = new FormData(contactForm);
  try {
    const resp = await fetch(contactForm.action, {
      method: 'POST',
      body: formData,
      headers: { Accept: 'application/json' }
    });
    if (resp.ok) {
      contactStatus.textContent = '보냈습니다! 곧 답변드릴게요.';
      contactForm.reset();
    } else {
      contactStatus.textContent = '전송에 실패했습니다. 잠시 후 다시 시도해주세요.';
    }
  } catch (err) {
    contactStatus.textContent = '네트워크 오류입니다. 다시 시도해주세요.';
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
