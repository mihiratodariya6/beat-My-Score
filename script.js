// --- DOM ELEMENTS ---
const screens = document.querySelectorAll('.screen');
const screenStart = document.getElementById('screen-start');
const screenName = document.getElementById('screen-name');
const screenGender = document.getElementById('screen-gender');
const screenCountry = document.getElementById('screen-country');
const screenAge = document.getElementById('screen-age');
const screenHome = document.getElementById('screen-home');
const screenSettings = document.getElementById('screen-settings');
const screenShop = document.getElementById('screen-shop');
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
const homeCoins = document.getElementById('home-coins');
const btnGoLevelSelect = document.getElementById('btn-go-level-select');
const btnGoSettings = document.getElementById('btn-go-settings');
const btnGoShop = document.getElementById('btn-go-shop');

// Shop Elements
const btnBackShop = document.getElementById('btn-back-shop');
const shopCoins = document.getElementById('shop-coins');
const tabColors = document.getElementById('tab-colors');
const tabShapes = document.getElementById('tab-shapes');
const containerColors = document.getElementById('shop-container-colors');
const containerShapes = document.getElementById('shop-container-shapes');

// Settings Elements
const btnBackSettings = document.getElementById('btn-back-settings');

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
const resultScore = document.getElementById('result-score');
const resultCoins = document.getElementById('result-coins');
const resultBest = document.getElementById('result-best');
const feedbackMessage = document.getElementById('feedback-message');
const unlockMessage = document.getElementById('unlock-message');
const btnResultHome = document.getElementById('btn-result-home');
const btnRestart = document.getElementById('btn-restart');

// --- APP STATE ---
let playerProfile = {
    name: '', gender: '', country: '', age: '',
    bestScore: 0, totalScore: 0, lastScore: 0, gamesPlayed: 0, coins: 0,
    unlockedLevel: 1,
    targetColor: 'Red',
    targetShape: 'Circle',
    unlockedColors: ['Red', 'Blue', 'Green'],
    unlockedShapes: ['Circle', 'Square']
};

// --- SHOP DATA ---
const SHOP_COLORS = [
    { name: 'Red', hex: '#EF4444', cost: 0 },
    { name: 'Blue', hex: '#3B82F6', cost: 0 },
    { name: 'Green', hex: '#10B981', cost: 0 },
    { name: 'Purple', hex: '#8B5CF6', cost: 10 },
    { name: 'Yellow', hex: '#F59E0B', cost: 15 },
    { name: 'Orange', hex: '#F97316', cost: 15 },
    { name: 'Pink', hex: '#EC4899', cost: 20 },
    { name: 'Black', hex: '#111827', cost: 30 }
];

const SHOP_SHAPES = [
    { name: 'Circle', css: '50%', cost: 0 },
    { name: 'Square', css: '8px', cost: 0 }, // 8px for slight rounded corners
    { name: 'Diamond', css: '12px', cost: 20, transform: 'rotate(45deg)' },
    { name: 'Leaf', css: '0 50% 0 50%', cost: 40 }
];

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
    "🇮🇳 India", "🇺🇸 USA", "🇬🇧 UK", "🇨🇦 Canada", "🇦🇺 Australia", "🌎 Other"
    // Shortened for clarity, you can paste the full list here
];

// --- INITIALIZATION ---
function init() {
    populateCountries();
    loadProfile();
    
    if (playerProfile.name) {
        // Ensure new variables exist
        if(playerProfile.coins === undefined) playerProfile.coins = 0;
        if(!playerProfile.unlockedColors) playerProfile.unlockedColors = ['Red', 'Blue', 'Green'];
        if(!playerProfile.unlockedShapes) playerProfile.unlockedShapes = ['Circle', 'Square'];
        if(!playerProfile.targetShape) playerProfile.targetShape = 'Circle';
        
        applySettings();
        updateHomeUI();
        showScreen(screenHome);
    } else {
        showScreen(screenStart);
    }
}

function applySettings() {
    // Find hex for color name
    const colorObj = SHOP_COLORS.find(c => c.name === playerProfile.targetColor) || SHOP_COLORS[0];
    const shapeObj = SHOP_SHAPES.find(s => s.name === playerProfile.targetShape) || SHOP_SHAPES[0];
    
    document.documentElement.style.setProperty('--target-color', colorObj.hex);
    document.documentElement.style.setProperty('--target-shape', shapeObj.css);
    
    if(shapeObj.transform) {
        target.style.transform = shapeObj.transform;
        // Override active transform to keep rotation
        target.onmousedown = () => target.style.transform = `${shapeObj.transform} scale(0.9)`;
        target.onmouseup = () => target.style.transform = shapeObj.transform;
    } else {
        target.style.transform = 'none';
        target.onmousedown = null;
        target.onmouseup = null;
    }
}

function populateCountries() {
    worldCountries.forEach(country => {
        let opt = document.createElement('option');
        opt.value = country; opt.innerText = country;
        selectCountry.appendChild(opt);
    });
}

function loadProfile() {
    const saved = localStorage.getItem('beatMyScoreProfile');
    if (saved) playerProfile = { ...playerProfile, ...JSON.parse(saved) };
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
    btnNextName.disabled = inputName.value.trim().length === 0;
    btnNextName.classList.toggle('btn-disabled', btnNextName.disabled);
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
    btnNextCountry.disabled = selectCountry.value === "";
    btnNextCountry.classList.toggle('btn-disabled', btnNextCountry.disabled);
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
    playerProfile.targetColor = 'Red';
    playerProfile.targetShape = 'Circle';
    playerProfile.coins = 0;
    playerProfile.unlockedColors = ['Red', 'Blue', 'Green'];
    playerProfile.unlockedShapes = ['Circle', 'Square'];
    saveProfile(); applySettings(); updateHomeUI(); showScreen(screenHome);
});

// --- HOME LOGIC ---
function updateHomeUI() {
    displayName.innerText = playerProfile.name;
    displayAvatar.innerText = playerProfile.gender === 'Male' ? '👨' : (playerProfile.gender === 'Female' ? '👩' : '👤');
    displayCountry.innerText = playerProfile.country.split(' ')[0];
    displayLevelBadge.innerText = `LEVEL ${playerProfile.unlockedLevel}`;
    homeBestScore.innerText = playerProfile.bestScore;
    homeTotalScore.innerText = playerProfile.totalScore;
    homeGamesPlayed.innerText = playerProfile.gamesPlayed;
    homeCoins.innerText = playerProfile.coins;
}

btnGoLevelSelect.addEventListener('click', () => { buildLevelList(); showScreen(screenLevelSelect); });
btnGoSettings.addEventListener('click', () => { showScreen(screenSettings); });
btnBackSettings.addEventListener('click', () => { showScreen(screenHome); });

// --- SHOP LOGIC ---
btnGoShop.addEventListener('click', () => {
    shopCoins.innerText = playerProfile.coins;
    renderShop();
    showScreen(screenShop);
});
btnBackShop.addEventListener('click', () => {
    updateHomeUI();
    showScreen(screenHome);
});

tabColors.addEventListener('click', () => {
    tabColors.classList.add('active'); tabShapes.classList.remove('active');
    containerColors.style.display = 'grid'; containerShapes.style.display = 'none';
});
tabShapes.addEventListener('click', () => {
    tabShapes.classList.add('active'); tabColors.classList.remove('active');
    containerShapes.style.display = 'grid'; containerColors.style.display = 'none';
});

function renderShop() {
    // Render Colors
    containerColors.innerHTML = '';
    SHOP_COLORS.forEach(item => {
        const isUnlocked = playerProfile.unlockedColors.includes(item.name);
        const isEquipped = playerProfile.targetColor === item.name;
        const canAfford = playerProfile.coins >= item.cost;
        
        const card = document.createElement('div');
        card.className = `shop-item ${isEquipped ? 'equipped' : ''}`;
        
        let buttonHTML = '';
        if(isEquipped) {
            buttonHTML = `<div class="btn-equipped">Equipped</div>`;
        } else if (isUnlocked) {
            buttonHTML = `<button class="btn-equip" onclick="equipItem('Color', '${item.name}')">Equip</button>`;
        } else {
            buttonHTML = `<button class="btn-buy ${canAfford ? '' : 'locked'}" onclick="buyItem('Color', '${item.name}', ${item.cost})">🪙 ${item.cost}</button>`;
        }

        card.innerHTML = `
            <div class="shop-item-preview-box">
                <div class="shop-item-preview" style="background-color: ${item.hex}; border-radius: 50%;"></div>
            </div>
            <div class="shop-item-name">${item.name}</div>
            ${buttonHTML}
        `;
        containerColors.appendChild(card);
    });

    // Render Shapes
    containerShapes.innerHTML = '';
    SHOP_SHAPES.forEach(item => {
        const isUnlocked = playerProfile.unlockedShapes.includes(item.name);
        const isEquipped = playerProfile.targetShape === item.name;
        const canAfford = playerProfile.coins >= item.cost;
        
        const card = document.createElement('div');
        card.className = `shop-item ${isEquipped ? 'equipped' : ''}`;
        
        let buttonHTML = '';
        if(isEquipped) {
            buttonHTML = `<div class="btn-equipped">Equipped</div>`;
        } else if (isUnlocked) {
            buttonHTML = `<button class="btn-equip" onclick="equipItem('Shape', '${item.name}')">Equip</button>`;
        } else {
            buttonHTML = `<button class="btn-buy ${canAfford ? '' : 'locked'}" onclick="buyItem('Shape', '${item.name}', ${item.cost})">🪙 ${item.cost}</button>`;
        }

        card.innerHTML = `
            <div class="shop-item-preview-box">
                <div class="shop-item-preview" style="background-color: var(--primary); border-radius: ${item.css}; transform: ${item.transform || 'none'}"></div>
            </div>
            <div class="shop-item-name">${item.name}</div>
            ${buttonHTML}
        `;
        containerShapes.appendChild(card);
    });
}

window.buyItem = function(type, itemName, cost) {
    if(playerProfile.coins >= cost) {
        playerProfile.coins -= cost;
        if(type === 'Color') playerProfile.unlockedColors.push(itemName);
        if(type === 'Shape') playerProfile.unlockedShapes.push(itemName);
        
        shopCoins.innerText = playerProfile.coins;
        saveProfile();
        renderShop();
    }
}

window.equipItem = function(type, itemName) {
    if(type === 'Color') playerProfile.targetColor = itemName;
    if(type === 'Shape') playerProfile.targetShape = itemName;
    
    saveProfile();
    applySettings();
    renderShop();
}

// --- LEVEL SELECTION LOGIC ---
btnBackHome.addEventListener('click', () => { showScreen(screenHome); });

function buildLevelList() {
    levelListContainer.innerHTML = '';
    btnStartGame.disabled = true; btnStartGame.classList.add('btn-disabled');

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
                btnStartGame.disabled = false; btnStartGame.classList.remove('btn-disabled');
            });
            if(lvl.id === selectedLevelId) {
                btnStartGame.disabled = false; btnStartGame.classList.remove('btn-disabled');
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
        if (count > 0) readyCountdown.innerText = count;
        else if (count === 0) readyCountdown.innerText = 'GO!';
        else { clearInterval(countdownInterval); startGame(); }
    }, 1000);
}

// --- GAME LOGIC ---
btnRestart.addEventListener('click', startGetReadyPhase);
target.addEventListener('pointerdown', handleTargetHit);

function startGame() {
    score = 0; combo = 0; maxCombo = 0;
    timeLeft = currentLevelConfig.time;
    isPlaying = true;

    target.style.width = `${currentLevelConfig.size}px`;
    target.style.height = `${currentLevelConfig.size}px`;

    uiScore.innerText = score; uiCombo.innerText = `${combo}🔥`; uiTime.innerText = timeLeft;
    showScreen(screenGame);
    
    clearInterval(gameInterval);
    gameInterval = setInterval(updateTimer, 1000);

    target.style.display = 'block';
    moveTarget();
}

function updateTimer() {
    if (!isPlaying) return;
    timeLeft--; uiTime.innerText = timeLeft;
    if (timeLeft <= 0) endGame();
}

function handleTargetHit(e) {
    if (!isPlaying) return;
    e.preventDefault(); 
    
    score++; combo++;
    if (combo > maxCombo) maxCombo = combo;

    uiScore.innerText = score; uiCombo.innerText = `${combo}🔥`;
    moveTarget();
}

function moveTarget() {
    const areaRect = playArea.getBoundingClientRect();
    const maxX = areaRect.width - currentLevelConfig.size - 20;
    const maxY = areaRect.height - currentLevelConfig.size - 20;

    const randomX = Math.floor(Math.random() * maxX) + 10;
    const randomY = Math.floor(Math.random() * maxY) + 10;

    target.style.left = `${randomX}px`; target.style.top = `${randomY}px`;

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
    
    // Coin Math: 1 coin for every 10 points
    let coinsEarned = Math.floor(score / 10);
    playerProfile.coins += coinsEarned;

    // Feedback Message Logic
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
    if (score > playerProfile.bestScore) playerProfile.bestScore = score;

    // Level Unlock
    let newlyUnlocked = false;
    let maxQualify = 1;
    for(let i=0; i<LEVELS.length; i++){
        if(playerProfile.bestScore >= LEVELS[i].unlockReq) maxQualify = LEVELS[i].id;
    }
    if (maxQualify > playerProfile.unlockedLevel) {
        playerProfile.unlockedLevel = maxQualify;
        newlyUnlocked = true;
    }

    saveProfile();

    // Result UI Update
    resultLevel.innerText = `${currentLevelConfig.id} (${currentLevelConfig.time}s)`;
    resultScore.innerText = score;
    resultCoins.innerText = coinsEarned;
    resultBest.innerText = playerProfile.bestScore;

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

init();