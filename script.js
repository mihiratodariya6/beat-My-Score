// --- DOM ELEMENTS ---
const screens = document.querySelectorAll('.screen');
const screenStart = document.getElementById('screen-start');
const screenName = document.getElementById('screen-name');
const screenGender = document.getElementById('screen-gender');
const screenCountry = document.getElementById('screen-country');
const screenAge = document.getElementById('screen-age');
const screenHome = document.getElementById('screen-home');
const screenSettings = document.getElementById('screen-settings');
const screenLevelSelect = document.getElementById('screen-level-select');
const screenReady = document.getElementById('screen-ready');
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
const displayLevelBadge = document.getElementById('display-level-badge');
const homeBestScore = document.getElementById('home-best-score');
const homeTotalScore = document.getElementById('home-total-score');
const homeGamesPlayed = document.getElementById('home-games-played');
const btnGoLevelSelect = document.getElementById('btn-go-level-select');
const btnGoSettings = document.getElementById('btn-go-settings');

// Settings Elements
const btnBackSettings = document.getElementById('btn-back-settings');
const colorOptions = document.querySelectorAll('.color-option');

// Level Select Elements
const btnBackHome = document.getElementById('btn-back-home');
const levelListContainer = document.getElementById('level-list');
const btnStartGame = document.getElementById('btn-start-game');

// Ready Elements
const readyLevelText = document.getElementById('ready-level-text');
const readyTimeText = document.getElementById('ready-time-text');
const readyCountdown = document.getElementById('ready-countdown');

// Game Elements
const uiTime = document.getElementById('ui-time');
const uiScore = document.getElementById('ui-score');
const uiCombo = document.getElementById('ui-combo');
const playArea = document.getElementById('play-area');
const target = document.getElementById('target');

// Result Elements
const resultLevel = document.getElementById('result-level');
const resultLastPlay = document.getElementById('result-last-play');
const resultScore = document.getElementById('result-score');
const resultBest = document.getElementById('result-best');
const resultCombo = document.getElementById('result-combo');
const feedbackMessage = document.getElementById('feedback-message');
const unlockMessage = document.getElementById('unlock-message');
const btnResultHome = document.getElementById('btn-result-home');
const btnRestart = document.getElementById('btn-restart');

// --- APP STATE ---
let playerProfile = {
    name: '',
    gender: '',
    country: '',
    age: '',
    bestScore: 0,
    totalScore: 0,
    lastScore: 0,
    gamesPlayed: 0,
    unlockedLevel: 1,
    targetColor: '#EF4444' // NEW: Default Red
};

// Level Definitions
const LEVELS = [
    { id: 1, time: 30, size: 80, unlockReq: 0 },
    { id: 2, time: 45, size: 70, unlockReq: 50 },
    { id: 3, time: 60, size: 60, unlockReq: 100 },
    { id: 4, time: 90, size: 50, unlockReq: 180 },
    { id: 5, time: 120, size: 40, unlockReq: 300 }
];

let selectedLevelId = 1;
let currentLevelConfig = null;

let score = 0;
let combo = 0;
let maxCombo = 0;
let timeLeft = 0;
let gameInterval;
let countdownInterval;
let isPlaying = false;

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
    
    if (playerProfile.name && playerProfile.gender && playerProfile.country && playerProfile.age) {
        // Ensure new variables exist for old saves
        if(!playerProfile.unlockedLevel) playerProfile.unlockedLevel = 1; 
        if(!playerProfile.totalScore) playerProfile.totalScore = 0;
        if(!playerProfile.lastScore) playerProfile.lastScore = 0;
        if(!playerProfile.targetColor) playerProfile.targetColor = '#EF4444';
        
        applySettings();
        updateHomeUI();
        showScreen(screenHome);
    } else {
        showScreen(screenStart);
    }
}

function applySettings() {
    // Set CSS variable for target color
    document.documentElement.style.setProperty('--target-color', playerProfile.targetColor);
    
    // Update Settings UI selection
    colorOptions.forEach(opt => {
        if(opt.getAttribute('data-color') === playerProfile.targetColor) {
            opt.classList.add('selected');
        } else {
            opt.classList.remove('selected');
        }
    });
}

function populateCountries() {
    worldCountries.forEach(country => {
        let opt = document.createElement('option');
        opt.value = country;
        opt.innerText = country;
        selectCountry.appendChild(opt);
    });
}

function loadProfile() {
    const saved = localStorage.getItem('beatMyScoreProfile');
    if (saved) {
        playerProfile = { ...playerProfile, ...JSON.parse(saved) };
    }
}

function saveProfile() {
    localStorage.setItem('beatMyScoreProfile', JSON.stringify(playerProfile));
}

function showScreen(screenElement) {
    screens.forEach(s => s.classList.remove('active'));
    screenElement.classList.add('active');
}

// --- ONBOARDING LOGIC ---
btnStartOnboarding.addEventListener('click', () => {
    if(playerProfile.name) localStorage.removeItem('beatMyScoreProfile'); 
    showScreen(screenName);
});
inputName.addEventListener('input', () => {
    if (inputName.value.trim().length > 0) {
        btnNextName.disabled = false; btnNextName.classList.remove('btn-disabled');
    } else {
        btnNextName.disabled = true; btnNextName.classList.add('btn-disabled');
    }
});
btnNextName.addEventListener('click', () => {
    playerProfile.name = inputName.value.trim(); showScreen(screenGender);
});
btnGenders.forEach(btn => {
    btn.addEventListener('click', () => {
        btnGenders.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        playerProfile.gender = btn.getAttribute('data-gender');
        btnNextGender.disabled = false; btnNextGender.classList.remove('btn-disabled');
    });
});
btnNextGender.addEventListener('click', () => { showScreen(screenCountry); });
selectCountry.addEventListener('change', () => {
    if (selectCountry.value !== "") {
        btnNextCountry.disabled = false; btnNextCountry.classList.remove('btn-disabled');
    }
});
btnNextCountry.addEventListener('click', () => {
    playerProfile.country = selectCountry.value; showScreen(screenAge);
});
btnAges.forEach(btn => {
    btn.addEventListener('click', () => {
        btnAges.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        playerProfile.age = btn.getAttribute('data-age');
        btnFinishOnboarding.disabled = false; btnFinishOnboarding.classList.remove('btn-disabled');
    });
});
btnFinishOnboarding.addEventListener('click', () => {
    playerProfile.unlockedLevel = 1;
    playerProfile.targetColor = '#EF4444'; // Default Red
    saveProfile();
    applySettings(); 
    updateHomeUI(); 
    showScreen(screenHome);
});

// --- HOME LOGIC ---
function updateHomeUI() {
    displayName.innerText = playerProfile.name;
    if (playerProfile.gender === 'Male') displayAvatar.innerText = '👨';
    else if (playerProfile.gender === 'Female') displayAvatar.innerText = '👩';
    else displayAvatar.innerText = '👤';
    
    const flag = playerProfile.country.split(' ')[0];
    displayCountry.innerText = flag;
    displayLevelBadge.innerText = `LEVEL ${playerProfile.unlockedLevel}`;
    
    homeBestScore.innerText = playerProfile.bestScore;
    homeTotalScore.innerText = playerProfile.totalScore;
    homeGamesPlayed.innerText = playerProfile.gamesPlayed;
}

btnGoLevelSelect.addEventListener('click', () => {
    buildLevelList();
    showScreen(screenLevelSelect);
});
btnGoSettings.addEventListener('click', () => {
    showScreen(screenSettings);
});

// --- SETTINGS LOGIC ---
btnBackSettings.addEventListener('click', () => {
    showScreen(screenHome);
});

colorOptions.forEach(opt => {
    opt.addEventListener('click', () => {
        const color = opt.getAttribute('data-color');
        playerProfile.targetColor = color;
        saveProfile();
        applySettings();
    });
});


// --- LEVEL SELECTION LOGIC ---
btnBackHome.addEventListener('click', () => { showScreen(screenHome); });

function buildLevelList() {
    levelListContainer.innerHTML = '';
    btnStartGame.disabled = true;
    btnStartGame.classList.add('btn-disabled');

    LEVELS.forEach(lvl => {
        const isUnlocked = playerProfile.unlockedLevel >= lvl.id;
        const card = document.createElement('div');
        card.className = `level-card ${isUnlocked ? '' : 'locked'}`;
        if (isUnlocked && lvl.id === selectedLevelId) card.classList.add('selected');
        
        card.innerHTML = `
            <div class="level-info">
                <span class="level-name">Level ${lvl.id}</span>
                <span class="level-time">${lvl.time} Seconds ${!isUnlocked ? `(Requires Score ${lvl.unlockReq})` : ''}</span>
            </div>
            <div class="level-status">${isUnlocked ? '🔓' : '🔒'}</div>
        `;

        if (isUnlocked) {
            card.addEventListener('click', () => {
                document.querySelectorAll('.level-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                selectedLevelId = lvl.id;
                btnStartGame.disabled = false;
                btnStartGame.classList.remove('btn-disabled');
            });
            if(lvl.id === selectedLevelId) {
                btnStartGame.disabled = false;
                btnStartGame.classList.remove('btn-disabled');
            }
        }
        levelListContainer.appendChild(card);
    });
}

btnStartGame.addEventListener('click', () => {
    currentLevelConfig = LEVELS.find(l => l.id === selectedLevelId);
    startGetReadyPhase();
});

// --- GET READY PHASE ---
function startGetReadyPhase() {
    readyLevelText.innerText = `LEVEL ${currentLevelConfig.id}`;
    readyTimeText.innerText = `${currentLevelConfig.time} SECONDS`;
    readyCountdown.innerText = '3';
    showScreen(screenReady);

    let count = 3;
    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            readyCountdown.innerText = count;
        } else if (count === 0) {
            readyCountdown.innerText = 'GO!';
        } else {
            clearInterval(countdownInterval);
            startGame();
        }
    }, 1000);
}

// --- GAME LOGIC ---
btnRestart.addEventListener('click', startGetReadyPhase);
target.addEventListener('pointerdown', handleTargetHit);

function startGame() {
    score = 0;
    combo = 0;
    maxCombo = 0;
    timeLeft = currentLevelConfig.time;
    isPlaying = true;

    target.style.width = `${currentLevelConfig.size}px`;
    target.style.height = `${currentLevelConfig.size}px`;

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
    const maxX = areaRect.width - currentLevelConfig.size - 20;
    const maxY = areaRect.height - currentLevelConfig.size - 20;

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

    let oldBest = playerProfile.bestScore;
    let oldLast = playerProfile.lastScore;

    if (score > oldBest && oldBest > 0) {
        feedbackMessage.innerText = '🏆 NEW PERSONAL BEST!';
        feedbackMessage.style.color = '#10B981'; 
    } else if (score > oldLast && oldLast > 0) {
        feedbackMessage.innerText = `🎉 +${score - oldLast} IMPROVEMENT!`;
        feedbackMessage.style.color = '#4F46E5'; 
    } else if (score === oldLast && oldLast > 0) {
        feedbackMessage.innerText = '😎 SO CLOSE! TIE!';
        feedbackMessage.style.color = '#F59E0B'; 
    } else if (oldLast > 0) {
        feedbackMessage.innerText = '💪 KEEP GOING! TRY AGAIN';
        feedbackMessage.style.color = '#EF4444'; 
    } else {
        feedbackMessage.innerText = '🎮 GREAT FIRST GAME!';
        feedbackMessage.style.color = '#4F46E5';
    }

    playerProfile.gamesPlayed++;
    playerProfile.totalScore += score;
    playerProfile.lastScore = score;
    if (score > playerProfile.bestScore) {
        playerProfile.bestScore = score;
    }

    let newlyUnlocked = false;
    let maxQualify = 1;
    for(let i=0; i<LEVELS.length; i++){
        if(playerProfile.bestScore >= LEVELS[i].unlockReq) {
            maxQualify = LEVELS[i].id;
        }
    }
    if (maxQualify > playerProfile.unlockedLevel) {
        playerProfile.unlockedLevel = maxQualify;
        newlyUnlocked = true;
    }

    saveProfile();

    resultLevel.innerText = `${currentLevelConfig.id} (${currentLevelConfig.time}s)`;
    resultLastPlay.innerText = oldLast;
    resultScore.innerText = score;
    resultBest.innerText = playerProfile.bestScore;
    resultCombo.innerText = maxCombo;

    if (newlyUnlocked) {
        unlockMessage.innerText = `🎉 LEVEL ${playerProfile.unlockedLevel} UNLOCKED!`;
        unlockMessage.style.display = 'block';
    } else {
        unlockMessage.style.display = 'none';
    }

    showScreen(screenResult);
}

btnResultHome.addEventListener('click', () => {
    updateHomeUI();
    showScreen(screenHome);
});

// Start App
init();