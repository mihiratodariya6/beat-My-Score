// --- DOM ELEMENTS ---
const screens = document.querySelectorAll('.screen');
const screenStart = document.getElementById('screen-start');
const screenName = document.getElementById('screen-name');
const screenGender = document.getElementById('screen-gender');
const screenCountry = document.getElementById('screen-country');
const screenAge = document.getElementById('screen-age');
const screenHome = document.getElementById('screen-home');
const screenGame = document.getElementById('screen-game');
const screenResult = document.getElementById('screen-result');

// Onboarding Elements
const btnStartOnboarding = document.getElementById('btn-start-onboarding');
const inputName = document.getElementById('input-name');
const btnNextName = document.getElementById('btn-next-name');
const btnGenders = document.querySelectorAll('.btn-gender');
const btnNextGender = document.getElementById('btn-next-gender');
const selectCountry = document.getElementById('select-country');
const btnNextCountry = document.getElementById('btn-next-country');
const btnAges = document.querySelectorAll('.btn-age');
const btnFinishOnboarding = document.getElementById('btn-finish-onboarding');

// Home Elements
const displayAvatar = document.getElementById('display-avatar');
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
    gender: '',
    country: '',
    age: '',
    bestScore: 0,
    gamesPlayed: 0
};

let score = 0;
let combo = 0;
let maxCombo = 0;
let timeLeft = 30;
let gameInterval;
let isPlaying = false;
const TARGET_SIZE = 70; 

// --- HUGE COUNTRY LIST WITH FLAGS ---
const worldCountries = [
    "🇮🇳 India", "🇺🇸 USA", "🇬🇧 UK", "🇨🇦 Canada", "🇦🇺 Australia", "🇦🇪 UAE", 
    "🇵🇰 Pakistan", "🇧🇩 Bangladesh", "🇳🇵 Nepal", "🇱🇰 Sri Lanka", "🇨🇳 China", 
    "🇯🇵 Japan", "🇰🇷 South Korea", "🇸🇬 Singapore", "🇲🇾 Malaysia", "🇮🇩 Indonesia",
    "🇵🇭 Philippines", "🇹🇭 Thailand", "🇻🇳 Vietnam", "🇩🇪 Germany", "🇫🇷 France", 
    "🇮🇹 Italy", "🇪🇸 Spain", "🇵🇹 Portugal", "🇳🇱 Netherlands", "🇨🇭 Switzerland", 
    "🇸🇪 Sweden", "🇳🇴 Norway", "🇩🇰 Denmark", "🇫🇮 Finland", "🇷🇺 Russia", 
    "🇺🇦 Ukraine", "🇧🇷 Brazil", "🇦🇷 Argentina", "🇨🇴 Colombia", "🇲🇽 Mexico", 
    "🇿🇦 South Africa", "🇳🇬 Nigeria", "🇰🇪 Kenya", "🇪🇬 Egypt", "🇸🇦 Saudi Arabia", 
    "🇮🇷 Iran", "🇹🇷 Turkey", "🇮🇱 Israel", "🇳🇿 New Zealand", "🌎 Other"
];

// --- INITIALIZATION ---
function init() {
    populateCountries();
    loadProfile();
    
    // Check if profile is fully set up
    if (playerProfile.name && playerProfile.gender && playerProfile.country && playerProfile.age) {
        updateHomeUI();
        showScreen(screenHome);
    } else {
        showScreen(screenStart);
    }
}

function populateCountries() {
    worldCountries.forEach(country => {
        let opt = document.createElement('option');
        opt.value = country;
        opt.innerText = country;
        selectCountry.appendChild(opt);
    });
}

// --- LOCAL STORAGE ---
function loadProfile() {
    const saved = localStorage.getItem('beatMyScoreProfile');
    if (saved) {
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
    // Check if user already entered name previously but didn't finish
    if(playerProfile.name) {
        // Clear local storage if they are restarting onboarding
        localStorage.removeItem('beatMyScoreProfile'); 
    }
    showScreen(screenName);
});

// Name
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
    showScreen(screenGender);
});

// Gender
btnGenders.forEach(btn => {
    btn.addEventListener('click', () => {
        btnGenders.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        playerProfile.gender = btn.getAttribute('data-gender');
        btnNextGender.disabled = false;
        btnNextGender.classList.remove('btn-disabled');
    });
});

btnNextGender.addEventListener('click', () => {
    showScreen(screenCountry);
});

// Country
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

// Age
btnAges.forEach(btn => {
    btn.addEventListener('click', () => {
        btnAges.forEach(b => b.classList.remove('selected'));
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
    
    // Set Avatar based on Gender
    if (playerProfile.gender === 'Male') displayAvatar.innerText = '👨';
    else if (playerProfile.gender === 'Female') displayAvatar.innerText = '👩';
    else displayAvatar.innerText = '👤';

    // Extract Flag
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