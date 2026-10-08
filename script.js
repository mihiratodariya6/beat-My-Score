// --- DOM ELEMENTS ---
const screens = document.querySelectorAll('.screen');
const screenStart = document.getElementById('screen-start');
const screenName = document.getElementById('screen-name');
const screenCountry = document.getElementById('screen-country');
const screenAge = document.getElementById('screen-age');
const screenHome = document.getElementById('screen-home');
const screenGame = document.getElementById('screen-game');
const screenResult = document.getElementById('screen-result');

// Onboarding Elements
const btnStartOnboarding = document.getElementById('btn-start-onboarding');
const inputName = document.getElementById('input-name');
const btnNextName = document.getElementById('btn-next-name');
const selectCountry = document.getElementById('select-country');
const btnNextCountry = document.getElementById('btn-next-country');
const btnAges = document.querySelectorAll('.btn-age');
const btnFinishOnboarding = document.getElementById('btn-finish-onboarding');

// Home Elements
const displayName = document.getElementById('display-name');
const displayCountry = document.getElementById('display-country');
const homeBestScore = document.getElementById('home-best-score');
const homeGamesPlayed = document.getElementById('home-games-played');
const btnPlay = document.getElementById('btn-play');

// Game Elements
const uiTime = document.getElementById('ui-time');
const uiScore = document.getElementById('ui-score');
const uiCombo = document.getElementById('ui-combo');
const playArea = document.getElementById('play-area');
const target = document.getElementById('target');

// Result Elements
const resultScore = document.getElementById('result-score');
const resultCombo = document.getElementById('result-combo');
const btnHome = document.getElementById('btn-home');
const btnRestart = document.getElementById('btn-restart');

// --- APP STATE ---
let playerProfile = {
    name: '',
    country: '',
    age: '',
    bestScore: 0,
    gamesPlayed: 0
};

// --- GAME STATE ---
let score = 0;
let combo = 0;
let maxCombo = 0;
let timeLeft = 30;
let gameInterval;
let isPlaying = false;
const TARGET_SIZE = 70; 

// --- INITIALIZATION ---
function init() {
    loadProfile();
    
    // If profile exists, go to Home, else show Start Screen
    if (playerProfile.name && playerProfile.country && playerProfile.age) {
        updateHomeUI();
        showScreen(screenHome);
    } else {
        showScreen(screenStart);
    }
}

// --- LOCAL STORAGE ---
function loadProfile() {
    const saved = localStorage.getItem('beatMyScoreProfile');
    if (saved) {
        // Merge saved data with default profile structure
        playerProfile = { ...playerProfile, ...JSON.parse(saved) };
    }
}

function saveProfile() {
    localStorage.setItem('beatMyScoreProfile', JSON.stringify(playerProfile));
}

// --- NAVIGATION ---
function showScreen(screenElement) {
    screens.forEach(s => s.classList.remove('active'));
    screenElement.classList.add('active');
}

// --- ONBOARDING LOGIC ---
btnStartOnboarding.addEventListener('click', () => {
    showScreen(screenName);
});

// Name validation
inputName.addEventListener('input', () => {
    if (inputName.value.trim().length > 0) {
        btnNextName.disabled = false;
        btnNextName.classList.remove('btn-disabled');
    } else {
        btnNextName.disabled = true;
        btnNextName.classList.add('btn-disabled');
    }
});

btnNextName.addEventListener('click', () => {
    playerProfile.name = inputName.value.trim();
    showScreen(screenCountry);
});

// Country validation
selectCountry.addEventListener('change', () => {
    if (selectCountry.value !== "") {
        btnNextCountry.disabled = false;
        btnNextCountry.classList.remove('btn-disabled');
    }
});

btnNextCountry.addEventListener('click', () => {
    playerProfile.country = selectCountry.value;
    showScreen(screenAge);
});

// Age selection
btnAges.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove selection from all
        btnAges.forEach(b => b.classList.remove('selected'));
        // Add to clicked
        btn.classList.add('selected');
        
        playerProfile.age = btn.getAttribute('data-age');
        
        btnFinishOnboarding.disabled = false;
        btnFinishOnboarding.classList.remove('btn-disabled');
    });
});

btnFinishOnboarding.addEventListener('click', () => {
    saveProfile();
    updateHomeUI();
    showScreen(screenHome);
});

// --- HOME LOGIC ---
function updateHomeUI() {
    displayName.innerText = playerProfile.name;
    // Extract just the flag emoji from the country string (e.g. "🇮🇳 India" -> "🇮🇳")
    const flag = playerProfile.country.split(' ')[0];
    displayCountry.innerText = flag;
    
    homeBestScore.innerText = playerProfile.bestScore;
    homeGamesPlayed.innerText = playerProfile.gamesPlayed;
}

btnPlay.addEventListener('click', startGame);
btnHome.addEventListener('click', () => {
    updateHomeUI();
    showScreen(screenHome);
});

// --- GAME LOGIC ---
btnRestart.addEventListener('click', startGame);
target.addEventListener('pointerdown', handleTargetHit);

function startGame() {
    score = 0;
    combo = 0;
    maxCombo = 0;
    timeLeft = 30;
    isPlaying = true;

    uiScore.innerText = score;
    uiCombo.innerText = `${combo}🔥`;
    uiTime.innerText = timeLeft;

    showScreen(screenGame);
    
    clearInterval(gameInterval);
    gameInterval = setInterval(updateTimer, 1000);

    target.style.display = 'block';
    moveTarget();
}

function updateTimer() {
    if (!isPlaying) return;
    
    timeLeft--;
    uiTime.innerText = timeLeft;

    if (timeLeft <= 0) {
        endGame();
    }
}

function handleTargetHit(e) {
    if (!isPlaying) return;
    e.preventDefault(); 
    
    score++;
    combo++;
    if (combo > maxCombo) maxCombo = combo;

    uiScore.innerText = score;
    uiCombo.innerText = `${combo}🔥`;

    moveTarget();
}

function moveTarget() {
    const areaRect = playArea.getBoundingClientRect();
    const maxX = areaRect.width - TARGET_SIZE - 20;
    const maxY = areaRect.height - TARGET_SIZE - 20;

    const randomX = Math.floor(Math.random() * maxX) + 10;
    const randomY = Math.floor(Math.random() * maxY) + 10;

    target.style.left = `${randomX}px`;
    target.style.top = `${randomY}px`;

    target.classList.remove('pop-anim');
    void target.offsetWidth; 
    target.classList.add('pop-anim');
}

function endGame() {
    isPlaying = false;
    clearInterval(gameInterval);
    target.style.display = 'none';

    // Update Player Profile logic
    playerProfile.gamesPlayed++;
    if (score > playerProfile.bestScore) {
        playerProfile.bestScore = score;
    }
    saveProfile();

    resultScore.innerText = score;
    resultCombo.innerText = maxCombo;

    showScreen(screenResult);
}

// Start App
init();