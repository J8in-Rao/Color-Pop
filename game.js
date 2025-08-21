/* === CONFIG === */
const colors = [
  { name: 'red',    value: '#ff4d4d' },
  { name: 'green',  value: '#4dff4d' },
  { name: 'blue',   value: '#4d4dff' },
  { name: 'yellow', value: '#ffff4d' },
  { name: 'purple', value: '#c44dff' },
  { name: 'cyan',   value: '#4dffff' }
];
const size = 4;   // 4×4 grid
const startDelay = 750; // ms between rounds
const startTimeout = 10000; // 10 seconds for first round
const timeoutDecrease = 250; // decrease by 250ms each round

/* === STATE === */
let score = 0;
let roundTimer;
let countdownInterval;
let nextDelay = startDelay;
let currentTimeout = startTimeout;

/* === DOM === */
const grid = document.getElementById('grid');
const scoreSpan = document.getElementById('score');
const targetNameSpan = document.getElementById('targetColorName');
const timerSpan = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');

/* === INIT === */
buildGrid();
startBtn.addEventListener('click', startGame);

/* === FUNCTIONS === */
function buildGrid() {
  grid.innerHTML = '';
  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.addEventListener('click', handleClick);
    // Add touch event for mobile devices
    cell.addEventListener('touchstart', function(e) {
      e.preventDefault(); // Prevent default touch behavior
      handleClick(e);
    });
    grid.appendChild(cell);
  }
}

function startGame() {
  score = 0;
  nextDelay = startDelay;
  currentTimeout = startTimeout;
  scoreSpan.textContent = score;
  timerSpan.textContent = (currentTimeout / 1000).toFixed(1);
  startBtn.style.display = 'none';
  nextRound();
}

function nextRound() {
  clearTimeout(roundTimer);
  clearInterval(countdownInterval);
  const cells = [...document.querySelectorAll('.cell')];

  // pick target
  const target = colors[Math.floor(Math.random() * colors.length)];
  targetNameSpan.textContent = target.name;
  targetNameSpan.style.color = target.value;

  // Select 3 random positions for target color
  const targetPositions = [];
  while (targetPositions.length < 3) {
    const pos = Math.floor(Math.random() * cells.length);
    if (!targetPositions.includes(pos)) {
      targetPositions.push(pos);
    }
  }

  // fill grid
  cells.forEach((c, idx) => {
    if (targetPositions.includes(idx)) {
      c.style.backgroundColor = target.value;
      c.dataset.correct = '1';
    } else {
      // Ensure non-correct cells never get the target color
      let otherColors = colors.filter(c => c.value !== target.value);
      const randomColor = otherColors[Math.floor(Math.random() * otherColors.length)].value;
      c.style.backgroundColor = randomColor;
      c.dataset.correct = '0';
    }
  });

  // Update timer display
  timerSpan.textContent = (currentTimeout / 1000).toFixed(1);
  
  // Start countdown timer
  let timeLeft = currentTimeout;
  countdownInterval = setInterval(() => {
    timeLeft -= 100;
    timerSpan.textContent = (timeLeft / 1000).toFixed(1);
    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
    }
  }, 100);

  // timeout
  roundTimer = setTimeout(() => {
    clearInterval(countdownInterval);
    gameOver();
  }, currentTimeout);

  // Decrease timeout for next round (minimum 2 seconds)
  currentTimeout = Math.max(2000, currentTimeout - timeoutDecrease);
}

function handleClick(e) {
  if (!e.target.dataset.correct) return; // game hasn't started
  const isCorrect = e.target.dataset.correct === '1';
  if (isCorrect) {
    score++;
    scoreSpan.textContent = score;
    clearTimeout(roundTimer);
    clearInterval(countdownInterval);
    setTimeout(nextRound, 100); // short feedback pause
  } else {
    clearTimeout(roundTimer);
    clearInterval(countdownInterval);
    alert('Game Over! Your score: ' + score);
    startBtn.style.display = 'inline-block';
    // reset grid to neutral color
    document.querySelectorAll('.cell').forEach(c => c.style.backgroundColor = '#333');
  }
}

function gameOver() {
  clearTimeout(roundTimer);
  clearInterval(countdownInterval);
  alert(`Game Over! Your score: ${score}`);
  startBtn.style.display = 'inline-block';
  // reset grid to neutral color
  document.querySelectorAll('.cell').forEach(c => c.style.backgroundColor = '#333');
}
