// --- PWA SETUP ---
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW registration failed:', err));
}

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
const screenAchievements = document.getElementById('screen-achievements');
const screenScoreboard = document.getElementById('screen-scoreboard');
const screenReady = document.getElementById('screen-ready');
const screenGame = document.getElementById('screen-game');
const screenResult = document.getElementById('screen-result');
const screenTasks = document.getElementById('screen-tasks');

const btnStartApp = document.getElementById('btn-start-app'); 
const inputUsername = document.getElementById('input-username'); 
const btnNextName = document.getElementById('btn-next-name'); 

const btnGenders = document.querySelectorAll('.btn-gender');
const btnNextGender = document.getElementById('btn-next-gender');
const selectCountry = document.getElementById('select-country');
const btnNextCountry = document.getElementById('btn-next-country');
const btnAges = document.querySelectorAll('.btn-age');
const btnFinishOnboarding = document.getElementById('btn-finish-onboarding');

const displayAvatar = document.getElementById('display-avatar');
const displayName = document.getElementById('display-name');
const displayCountry = document.getElementById('display-country');
const displayLevelBadge = document.getElementById('display-level-badge');
const homeBestScore = document.getElementById('home-best-score');
const homeTotalScore = document.getElementById('home-total-score');
const homeGamesPlayed = document.getElementById('home-games-played');
const homeCoins = document.getElementById('home-coins');

const btnStartGame = document.getElementById('btn-start-game'); 
const btnGoSettings = document.getElementById('btn-go-settings');
const btnGoShop = document.getElementById('btn-go-shop');
const btnGoAchievements = document.getElementById('btn-go-achievements');
const btnGoScoreboard = document.getElementById('btn-go-scoreboard');
const btnGoTasks = document.getElementById('btn-go-tasks');

const btnBackAchievements = document.getElementById('btn-back-achievements');
const achievementsList = document.getElementById('achievements-list');

const btnBackTasks = document.getElementById('btn-back-tasks'); 
const tasksList = document.getElementById('tasks-list'); 
const tasksCoins = document.getElementById('tasks-coins'); 
const taskResetTimer = document.getElementById('task-reset-timer'); 

const btnBackScoreboard = document.getElementById('btn-back-scoreboard');
const tabWorld = document.getElementById('tab-world');
const tabLocal = document.getElementById('tab-local');
const scoreboardList = document.getElementById('scoreboard-list');

const btnBackShop = document.getElementById('btn-back-shop');
const shopCoins = document.getElementById('shop-coins');
const tabColors = document.getElementById('tab-colors');
const tabShapes = document.getElementById('tab-shapes');
const containerColors = document.getElementById('shop-container-colors');
const containerShapes = document.getElementById('shop-container-shapes');

// NAVU BUTTON (Free Coins)
const btnFreeCoins = document.getElementById('btn-free-coins');

const btnBackSettings = document.getElementById('btn-back-settings');
const toggleSound = document.getElementById('toggle-sound');
const btnResetData = document.getElementById('btn-reset-data'); 

const readyLevelText = document.getElementById('ready-level-text');
const readyTargetText = document.getElementById('ready-target-text'); 
const readyCountdown = document.getElementById('ready-countdown');

const uiTime = document.getElementById('ui-time');
const uiLevel = document.getElementById('ui-level'); 
const uiScore = document.getElementById('ui-score');
const uiProgress = document.getElementById('ui-progress'); 
const playArea = document.getElementById('play-area');
const target = document.getElementById('target');

const resultTitle = document.getElementById('result-title');
const resultScore = document.getElementById('result-score');
const resultCoins = document.getElementById('result-coins');
const resultTotalScore = document.getElementById('result-total-score');
const resultNextLevel = document.getElementById('result-next-level');
const feedbackMessage = document.getElementById('feedback-message');
const unlockMessage = document.getElementById('unlock-message');
const achievementToast = document.getElementById('achievement-toast');
const achievementToastName = document.getElementById('achievement-toast-name');
const btnResultHome = document.getElementById('btn-result-home');
const btnNextLevel = document.getElementById('btn-next-level');
const btnSkipLevel = document.getElementById('btn-skip-level'); 
const btnResultShop = document.getElementById('btn-result-shop');
const btnRestart = document.getElementById('btn-restart');

// --- APP STATE ---
let playerProfile = {
    name: '', gender: '', country: '', age: '',
    bestScore: 0, totalScore: 0, lastScore: 0, gamesPlayed: 0, coins: 0,
    unlockedLevel: 1, currentPlayingLevel: 1, 
    targetColor: 'Red', targetShape: 'Circle',
    unlockedColors: ['Red', 'Blue', 'Green'],
    unlockedShapes: ['Circle', 'Square'],
    unlockedAchievements: [],
    soundEnabled: true,
    lastTaskDate: '',
    dailyTasksProgress: {
        tap_count: 0,
        games_played: 0,
        levels_cleared: 0,
        score_accumulated: 0
    },
    dailyTasksClaimed: []
};

// --- SOUNDS ---
const sfx = {
    splash: new Audio("data:audio/wav;base64,UklGRlQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YTAAAACAAf8M/xb/Ff8S/xL/FP8Y/x7/JP8p/y7/NP84/zz/P/9B/0X/SP9L/07/UP9S/w=="),
    click: new Audio("data:audio/wav;base64,UklGRmQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YUAAAACA/v/3/+//5//j/+b/4v/b/87/x//E/8f/wf+w/5X/c/9K/yH/9v7f/r7+lv5w/kz+Mv4S/vb93f25/Zn9c/1Q/Tb9Hf0J/fj83/y4/Jr8jPxs/FT8I/z1+9b7rvuV+2H7Kvv7+t/6nPpG+v757Pk="),
    over: new Audio("data:audio/wav;base64,UklGRq4AAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YIgAAACA/v/0/9X/p/92/zn/+v7Q/pr+Xv4W/db8gvws/Nb7ifsz+/r6x/qU+l76IPr4+cL5jvlB+fv4wPiO+E/4Evjp98v3uvfL99X30vfb9+r3/fcO+Cb4Qvh++KT41Pj5+Bn5Qfl0+ab51Pn7+R/6R/p0+pr6yPoS+zj7aPuY+8n75fsW/D38aPyY/MD86vwn/Wf9jv24/eD9CP4j/jr+Pf4="),
    combo: new Audio("data:audio/wav;base64,UklGRhYBAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YeoAAACA/v/2/+//7f/2/wkAIgBFAFcAaAB3AIEAiACTAJoAqAC1AMMA0gDhAOkA7AD5AAcBFwEuAT8BUwFpAXoBhgGPAYsBggF4AWcBWAFFATIBHQEIAdIAewAbAL3+a/4A/qX9LP2/+0b74fqd+mD6Ifro+af5VvkK+ar4Tfjr95f3VPcY9/v28fbe9sL2rPaa9pv2kfaa9pb2rfbB9uP2Cfcj90D3Xfd995r3pve398f33/fn9+v3+fcE+A=="),
    coin: new Audio("data:audio/wav;base64,UklGRmQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YUAAAACA/v/3/+//5//j/+b/4v/b/87/x//E/8f/wf+w/5X/c/9K/yH/9v7f/r7+lv5w/kz+Mv4S/vb93f25/Zn9c/1Q/Tb9Hf0J/fj83/y4/Jr8jPxs/FT8I/z1+9b7rvuV+2H7Kvv7+t/6nPpG+v757Pk=")
};

function playSound(type) {
    if (playerProfile.soundEnabled && sfx[type]) { sfx[type].currentTime = 0; sfx[type].play().catch(() => {}); }
}
document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => { if(!btn.classList.contains('btn-disabled')) playSound('click'); });
});

// --- ACHIEVEMENTS ---
const ACHIEVEMENTS = [
    { id: 'first_game', icon: '🎮', title: 'First Game', desc: 'Complete your first game.', condition: (p) => p.gamesPlayed >= 1 },
    { id: 'games_10', icon: '🕹️', title: 'Arcade Rat', desc: 'Play 10 games total.', condition: (p) => p.gamesPlayed >= 10 },
    { id: 'games_50', icon: '🎰', title: 'Addicted', desc: 'Play 50 games total.', condition: (p) => p.gamesPlayed >= 50 },
    { id: 'games_100', icon: '🤖', title: 'Machine', desc: 'Play 100 games total.', condition: (p) => p.gamesPlayed >= 100 },
    { id: 'score_50', icon: '💯', title: 'Half Century', desc: 'Score 50 points in a single game.', condition: (p) => p.bestScore >= 50 },
    { id: 'score_100', icon: '🔥', title: 'Century Maker', desc: 'Score 100 points in a single game.', condition: (p) => p.bestScore >= 100 },
    { id: 'score_150', icon: '🚀', title: 'Speed Demon', desc: 'Score 150 points in a single game.', condition: (p) => p.bestScore >= 150 },
    { id: 'score_200', icon: '⚡', title: 'Godlike', desc: 'Score 200 points in a single game.', condition: (p) => p.bestScore >= 200 },
    { id: 'total_500', icon: '📈', title: 'Grinder', desc: 'Reach a total score of 500.', condition: (p) => p.totalScore >= 500 },
    { id: 'total_1000', icon: '🌟', title: 'Dedicated', desc: 'Reach a total score of 1,000.', condition: (p) => p.totalScore >= 1000 },
    { id: 'total_5000', icon: '💫', title: 'Legend', desc: 'Reach a total score of 5,000.', condition: (p) => p.totalScore >= 5000 },
    { id: 'rich_kid', icon: '💰', title: 'Rich Kid', desc: 'Accumulate 1,000 coins.', condition: (p) => p.coins >= 1000 },
    { id: 'millionaire', icon: '🏦', title: 'Banker', desc: 'Accumulate 5,000 coins.', condition: (p) => p.coins >= 5000 },
    { id: 'billionaire', icon: '💎', title: 'Diamond Hands', desc: 'Accumulate 15,000 coins.', condition: (p) => p.coins >= 15000 },
    { id: 'level_3', icon: '⭐', title: 'Rising Star', desc: 'Reach Level 3.', condition: (p) => p.unlockedLevel >= 3 },
    { id: 'level_5', icon: '👑', title: 'Game Master', desc: 'Reach Level 5.', condition: (p) => p.unlockedLevel >= 5 },
    { id: 'level_10', icon: '🎖️', title: 'Unstoppable', desc: 'Reach Level 10.', condition: (p) => p.unlockedLevel >= 10 },
    { id: 'level_20', icon: '🏆', title: 'Champion', desc: 'Reach Level 20.', condition: (p) => p.unlockedLevel >= 20 },
    { id: 'level_50', icon: '💀', title: 'Insane', desc: 'Reach Level 50.', condition: (p) => p.unlockedLevel >= 50 },
    { id: 'shopper', icon: '🛍️', title: 'Shopper', desc: 'Unlock 5 different colors.', condition: (p) => p.unlockedColors.length >= 5 },
    { id: 'collector', icon: '🎨', title: 'Collector', desc: 'Unlock 10 different colors.', condition: (p) => p.unlockedColors.length >= 10 },
    { id: 'shapeshifter', icon: '💠', title: 'Shape Shifter', desc: 'Unlock 5 different shapes.', condition: (p) => p.unlockedShapes.length >= 5 },
    { id: 'designer', icon: '📐', title: 'Designer', desc: 'Unlock 10 different shapes.', condition: (p) => p.unlockedShapes.length >= 10 }
];

// --- DAILY TASKS ---
const DAILY_TASKS = [
    { id: 'daily_tap', type: 'tap_count', target: 200, reward: 150, title: 'Tap 200 Times', desc: 'Tap the target 200 times today.' },
    { id: 'daily_play', type: 'games_played', target: 5, reward: 100, title: 'Play 5 Games', desc: 'Play 5 rounds today.' },
    { id: 'daily_clear', type: 'levels_cleared', target: 3, reward: 250, title: 'Clear 3 Levels', desc: 'Successfully beat 3 levels today.' },
    { id: 'daily_score', type: 'score_accumulated', target: 500, reward: 300, title: 'Score 500 Points', desc: 'Accumulate 500 points across games today.' }
];

const SHOP_COLORS = [
    { name: 'Red', hex: '#EF4444', cost: 0 }, { name: 'Blue', hex: '#3B82F6', cost: 0 }, { name: 'Green', hex: '#10B981', cost: 0 },
    { name: 'Purple', hex: '#8B5CF6', cost: 100 }, { name: 'Yellow', hex: '#F59E0B', cost: 250 }, { name: 'Orange', hex: '#F97316', cost: 500 },
    { name: 'Pink', hex: '#EC4899', cost: 750 }, { name: 'Cyan', hex: '#06B6D4', cost: 1000 }, { name: 'Teal', hex: '#14B8A6', cost: 1500 },
    { name: 'Lime', hex: '#84CC16', cost: 2000 }, { name: 'Indigo', hex: '#6366F1', cost: 2500 }, { name: 'Rose', hex: '#F43F5E', cost: 3000 },
    { name: 'Amber', hex: '#D97706', cost: 4000 }, { name: 'Fuchsia', hex: '#D946EF', cost: 5000 }, { name: 'Emerald', hex: '#059669', cost: 6000 },
    { name: 'Sky', hex: '#0EA5E9', cost: 7500 }, { name: 'Violet', hex: '#7C3AED', cost: 9000 }, { name: 'Slate', hex: '#64748B', cost: 10000 },
    { name: 'Stone', hex: '#78716C', cost: 12000 }, { name: 'Zinc', hex: '#71717A', cost: 15000 }, { name: 'Neutral', hex: '#737373', cost: 18000 },
    { name: 'Crimson', hex: '#BE123C', cost: 20000 }, { name: 'Brown', hex: '#92400E', cost: 25000 }, { name: 'Navy', hex: '#1E3A8A', cost: 30000 },
    { name: 'Forest', hex: '#064E3B', cost: 40000 }, { name: 'Gold', hex: '#CA8A04', cost: 50000 }, { name: 'Silver', hex: '#9CA3AF', cost: 60000 },
    { name: 'Bronze', hex: '#B45309', cost: 75000 }, { name: 'White', hex: '#FFFFFF', cost: 90000 }, { name: 'Black', hex: '#111827', cost: 100000 }
];

const SHOP_SHAPES = [
    { name: 'Circle', css: '50%', cost: 0 }, { name: 'Square', css: '8px', cost: 0 },
    { name: 'Diamond', css: '12px', transform: 'rotate(45deg)', cost: 150 }, { name: 'Leaf', css: '0 50% 0 50%', cost: 300 },
    { name: 'Blob 1', css: '40% 60% 70% 30% / 40% 50% 60% 50%', cost: 600 }, { name: 'Blob 2', css: '50% 50% 20% 80% / 25% 80% 20% 75%', cost: 1000 },
    { name: 'Triangle', css: '0', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', cost: 2500 },
    { name: 'Message', css: '0', clipPath: 'polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%)', cost: 5000 },
    { name: 'Pentagon', css: '0', clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)', cost: 8000 },
    { name: 'Hexagon', css: '0', clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)', cost: 15000 },
    { name: 'Octagon', css: '0', clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)', cost: 25000 },
    { name: 'Cross', css: '0', clipPath: 'polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)', cost: 40000 },
    { name: 'Star', css: '0', clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)', cost: 60000 },
    { name: 'Chevron', css: '0', clipPath: 'polygon(25% 0%, 100% 0%, 75% 50%, 100% 100%, 25% 100%, 0% 50%)', cost: 80000 },
    { name: 'Ninja', css: '0', clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)', cost: 100000 }
];

const LEVELS = [];
for (let i = 1; i <= 100; i++) {
    let tScore = 15 + (i * 5); 
    LEVELS.push({ id: i, time: Math.max(5, Math.ceil(tScore * 0.75)), size: Math.max(15, 75 - (i * 3)), targetScore: tScore });
}

const worldCountries = ["🇮🇳 India", "🇺🇸 USA", "🇬🇧 UK", "🇨🇦 Canada", "🇦🇺 Australia", "🇦🇪 UAE", "🇵🇰 Pakistan", "🇧🇩 Bangladesh", "🇳🇵 Nepal", "🇱🇰 Sri Lanka", "🇨🇳 China", "🇯🇵 Japan", "🇰🇷 South Korea", "🇸🇬 Singapore", "🇲🇾 Malaysia", "🇮🇩 Indonesia", "🇵🇭 Philippines", "🇹🇭 Thailand", "🇻🇳 Vietnam", "🇩🇪 Germany", "🇫🇷 France", "🇮🇹 Italy", "🇪🇸 Spain", "🇵🇹 Portugal", "🇳🇱 Netherlands", "🇨🇭 Switzerland", "🇸🇪 Sweden", "🇳🇴 Norway", "🇩🇰 Denmark", "🇫🇮 Finland", "🇷🇺 Russia", "🇺🇦 Ukraine", "🇧🇷 Brazil", "🇦🇷 Argentina", "🇨🇴 Colombia", "🇲🇽 Mexico", "🇿🇦 South Africa", "🇳🇬 Nigeria", "🇰🇪 Kenya", "🇪🇬 Egypt", "🇸🇦 Saudi Arabia", "🇮🇷 Iran", "🇹🇷 Turkey", "🇮🇱 Israel", "🇳🇿 New Zealand", "🌎 Other"];

function generateFakeLeaderboard(isLocal) {
    let data = [];
    const names = ["Alex", "John", "Sarah", "Rahul", "Priya", "Mike", "Emma", "David", "Ayesha", "Chris", "Lisa", "Vikram", "Neha", "Sam", "Tom", "Jerry", "Ali", "Nina", "Oscar", "Zoe"];
    const avatars = ["👨", "👩", "👤", "🧑", "👧", "👦"];
    let baseScore = playerProfile.totalScore > 0 ? playerProfile.totalScore : 100;
    
    for(let i=0; i<99; i++) {
        let fakeCountry = isLocal ? playerProfile.country : worldCountries[Math.floor(Math.random() * worldCountries.length)];
        let fakeScore = Math.floor(Math.random() * (baseScore * 1.5)) + 10; 
        data.push({ name: names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random()*999), country: fakeCountry, bestScore: fakeScore, avatar: avatars[Math.floor(Math.random() * avatars.length)], isPlayer: false });
    }
    data.push({ name: playerProfile.name + ' (You)', country: playerProfile.country, bestScore: playerProfile.totalScore, avatar: playerProfile.gender === 'Male' ? '👨' : (playerProfile.gender === 'Female' ? '👩' : '👤'), isPlayer: true });
    data.sort((a,b) => b.bestScore - a.bestScore);
    data.forEach((item, idx) => item.rank = idx + 1);
    return data;
}

let currentLevelConfig = null;
let currentLevelScore = 0; 
let timeLeft = 0; let gameInterval; let countdownInterval; let isPlaying = false;

// ==========================================
// --- REAL ADMOB INTEGRATION ---
// ==========================================

async function startAdMobBanner() {
    try {
        const AdMob = window.Capacitor?.Plugins?.AdMob;
        if (AdMob) {
            await AdMob.initialize({});
            await AdMob.showBanner({
                adId: 'ca-app-pub-9566636476372749/5477298705', // REAL BANNER ID
                adSize: 'BANNER',
                position: 'BOTTOM_CENTER',
                margin: 0,
                isTesting: false // REAL ADS ON
            });
        }
    } catch (err) { console.log("AdMob Banner Error:", err); }
}

let isInterstitialReady = false;

async function prepareInterstitialAd() {
    try {
        const AdMob = window.Capacitor?.Plugins?.AdMob;
        if (AdMob) {
            await AdMob.prepareInterstitial({
                // REAL INTERSTITIAL AD ID
                adId: 'ca-app-pub-9566636476372749/4402999531', 
                isTesting: false // REAL ADS ON
            });
            isInterstitialReady = true;
        }
    } catch (err) { console.log("Interstitial Error:", err); }
}

async function showInterstitialAd() {
    try {
        const AdMob = window.Capacitor?.Plugins?.AdMob;
        if (AdMob && isInterstitialReady) {
            await AdMob.showInterstitial();
            isInterstitialReady = false; 
            prepareInterstitialAd(); 
        }
    } catch (err) { console.log("Show Interstitial Error:", err); }
}

let isRewardedReady = false;

async function prepareRewardedAd() {
    try {
        const AdMob = window.Capacitor?.Plugins?.AdMob;
        if (AdMob) {
            AdMob.addListener('onRewardedVideoAdReward', (rewardItem) => {
                playerProfile.coins += 100; // GIVE 100 COINS
                if(shopCoins) shopCoins.innerText = formatNumber(playerProfile.coins);
                if(tasksCoins) tasksCoins.innerText = formatNumber(playerProfile.coins);
                saveProfile();
                playSound('combo');
                alert("Awesome! You got +100 Coins for watching the ad!");
            });

            await AdMob.prepareRewardVideoAd({
                // TEST REWARDED AD ID (Replace with real later)
                adId: 'ca-app-pub-3940256099942544/5224354917', 
                isTesting: true // Test mode ON for Rewarded
            });
            isRewardedReady = true;
        }
    } catch (err) { console.log("Rewarded Error:", err); }
}

async function showRewardedAd() {
    try {
        const AdMob = window.Capacitor?.Plugins?.AdMob;
        if (AdMob && isRewardedReady) {
            await AdMob.showRewardVideoAd();
            isRewardedReady = false;
            prepareRewardedAd(); 
        } else {
            alert("Ad is loading... Please check your internet or try again in a few seconds.");
        }
    } catch (err) { console.log("Show Rewarded Error:", err); }
}

// ==========================================

// --- INITIALIZATION ---
function init() {
    populateCountries(); 
    
    const savedData = localStorage.getItem('beatMyScoreProfile');
    
    if (savedData) {
        playerProfile = { ...playerProfile, ...JSON.parse(savedData) };
        if(!playerProfile.unlockedColors) playerProfile.unlockedColors = ['Red', 'Blue', 'Green'];
        if(!playerProfile.unlockedShapes) playerProfile.unlockedShapes = ['Circle', 'Square'];
        if(!playerProfile.targetShape) playerProfile.targetShape = 'Circle';
        if(!playerProfile.unlockedAchievements) playerProfile.unlockedAchievements = [];
        if(playerProfile.soundEnabled === undefined) playerProfile.soundEnabled = true;
        if(!playerProfile.unlockedLevel) playerProfile.unlockedLevel = 1;
        if(!playerProfile.currentPlayingLevel) playerProfile.currentPlayingLevel = playerProfile.unlockedLevel;
        
        checkDailyTasksReset(); 

        toggleSound.checked = playerProfile.soundEnabled;
        applySettings(); 
        updateHomeUI(); 
        showScreen(screenHome); 
    } else {
        showScreen(screenStart);
    }

    startAdMobBanner();
    prepareInterstitialAd();
    prepareRewardedAd();
}

function showScreen(screenElement) { screens.forEach(s => s.classList.remove('active')); screenElement.classList.add('active'); }
function formatNumber(num) { return Number(num).toLocaleString('en-IN'); }

function populateCountries() { 
    selectCountry.innerHTML = '<option value="" disabled selected>Select your country</option>';
    worldCountries.forEach(c => { 
        let opt = document.createElement('option'); opt.value = c; opt.innerText = c; selectCountry.appendChild(opt); 
    }); 
}

btnStartApp.addEventListener('click', () => { showScreen(screenName); });

btnResetData.addEventListener('click', () => {
    if(confirm("Are you sure you want to delete all your progress? This will reset the game completely!")) {
        localStorage.removeItem('beatMyScoreProfile');
        window.location.reload(true);
    }
});

function saveProfile() { localStorage.setItem('beatMyScoreProfile', JSON.stringify(playerProfile)); }

function applySettings() {
    const colorObj = SHOP_COLORS.find(c => c.name === playerProfile.targetColor) || SHOP_COLORS[0];
    const shapeObj = SHOP_SHAPES.find(s => s.name === playerProfile.targetShape) || SHOP_SHAPES[0];
    document.documentElement.style.setProperty('--target-color', colorObj.hex);
    document.documentElement.style.setProperty('--target-shape', shapeObj.css);
    document.documentElement.style.setProperty('--target-clip-path', shapeObj.clipPath || 'none');
    
    target.style.transform = 'none'; target.onmousedown = null; target.onmouseup = null;
}

inputUsername.addEventListener('input', () => { 
    btnNextName.disabled = inputUsername.value.trim().length < 3; 
    btnNextName.classList.toggle('btn-disabled', btnNextName.disabled); 
});

btnNextName.addEventListener('click', () => { 
    playerProfile.name = inputUsername.value.trim();
    showScreen(screenGender);
});

btnGenders.forEach(btn => { 
    btn.addEventListener('click', () => { 
        btnGenders.forEach(b => b.classList.remove('selected')); btn.classList.add('selected'); 
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
    playerProfile.country = selectCountry.value; 
    showScreen(screenAge); 
});

btnAges.forEach(btn => { 
    btn.addEventListener('click', () => { 
        btnAges.forEach(b => b.classList.remove('selected')); btn.classList.add('selected'); 
        playerProfile.age = btn.getAttribute('data-age'); 
        btnFinishOnboarding.disabled = false; btnFinishOnboarding.classList.remove('btn-disabled'); 
    }); 
});

btnFinishOnboarding.addEventListener('click', () => {
    playerProfile.unlockedLevel = 1; playerProfile.currentPlayingLevel = 1;
    playerProfile.targetColor = 'Red'; playerProfile.targetShape = 'Circle'; 
    playerProfile.coins = 0; playerProfile.bestScore = 0; playerProfile.totalScore = 0; playerProfile.gamesPlayed = 0;
    playerProfile.unlockedAchievements = []; playerProfile.unlockedColors = ['Red', 'Blue', 'Green']; playerProfile.unlockedShapes = ['Circle', 'Square']; 
    playerProfile.soundEnabled = true;
    
    const today = new Date().toDateString();
    playerProfile.lastTaskDate = today;
    playerProfile.dailyTasksProgress = { tap_count: 0, games_played: 0, levels_cleared: 0, score_accumulated: 0 };
    playerProfile.dailyTasksClaimed = [];
    
    applySettings(); updateHomeUI(); saveProfile(); showScreen(screenHome);
});

function updateHomeUI() {
    displayName.innerText = playerProfile.name;
    displayAvatar.innerText = playerProfile.gender === 'Male' ? '👨' : (playerProfile.gender === 'Female' ? '👩' : '👤');
    displayCountry.innerText = playerProfile.country ? playerProfile.country.split(' ')[0] : '🌎';
    displayLevelBadge.innerText = `LEVEL ${playerProfile.currentPlayingLevel}`; 
    homeBestScore.innerText = formatNumber(playerProfile.bestScore);
    homeTotalScore.innerText = formatNumber(playerProfile.totalScore);
    homeGamesPlayed.innerText = formatNumber(playerProfile.gamesPlayed);
    homeCoins.innerText = formatNumber(playerProfile.coins);
}

btnGoSettings.addEventListener('click', () => { showScreen(screenSettings); });
btnBackSettings.addEventListener('click', () => { showScreen(screenHome); });
toggleSound.addEventListener('change', () => { playerProfile.soundEnabled = toggleSound.checked; saveProfile(); });

function checkDailyTasksReset() {
    const today = new Date().toDateString();
    if (playerProfile.lastTaskDate !== today) {
        playerProfile.lastTaskDate = today;
        playerProfile.dailyTasksProgress = { tap_count: 0, games_played: 0, levels_cleared: 0, score_accumulated: 0 };
        playerProfile.dailyTasksClaimed = [];
        saveProfile();
    }
}

function updateDailyTaskProgress(type, amount) {
    if (playerProfile.dailyTasksProgress[type] !== undefined) {
        playerProfile.dailyTasksProgress[type] += amount;
        saveProfile();
    }
}

btnGoTasks.addEventListener('click', () => { 
    checkDailyTasksReset();
    renderTasks(); 
    tasksCoins.innerText = formatNumber(playerProfile.coins);
    showScreen(screenTasks); 
    
    setInterval(() => {
        let now = new Date();
        let night = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
        let msToMidnight = night.getTime() - now.getTime();
        let h = Math.floor(msToMidnight / 3600000);
        let m = Math.floor((msToMidnight % 3600000) / 60000);
        taskResetTimer.innerText = `Tasks reset in ${h}h ${m}m`;
    }, 1000);
});
btnBackTasks.addEventListener('click', () => { updateHomeUI(); showScreen(screenHome); });

function renderTasks() {
    tasksList.innerHTML = '';
    DAILY_TASKS.forEach(task => {
        const currentProgress = playerProfile.dailyTasksProgress[task.type] || 0;
        const isCompleted = currentProgress >= task.target;
        const isClaimed = playerProfile.dailyTasksClaimed.includes(task.id);
        
        let progressPercent = (currentProgress / task.target) * 100;
        if (progressPercent > 100) progressPercent = 100;

        const card = document.createElement('div');
        card.className = `task-card ${isCompleted && !isClaimed ? 'completed' : ''}`;
        card.style.opacity = isClaimed ? '0.6' : '1';
        
        let buttonHTML = '';
        if (isClaimed) {
            buttonHTML = `<button class="btn-claim" disabled style="background:#E5E7EB; color:#6B7280;">Claimed</button>`;
        } else if (isCompleted) {
            buttonHTML = `<button class="btn-claim" onclick="claimTask('${task.id}', ${task.reward})">Claim</button>`;
        } else {
            buttonHTML = `<button class="btn-claim" disabled>Claim</button>`;
        }

        card.innerHTML = `
            <div class="task-header">
                <div class="task-info">
                    <h4>${task.title}</h4>
                    <p>${task.desc}</p>
                </div>
                <div class="task-reward">🪙 ${task.reward}</div>
            </div>
            <div style="display:flex; align-items:center; gap: 12px; margin-top:8px;">
                <div style="flex:1;">
                    <div class="task-progress-bg">
                        <div class="task-progress-fill" style="width: ${progressPercent}%;"></div>
                    </div>
                    <div class="task-progress-text">${currentProgress}/${task.target}</div>
                </div>
                ${buttonHTML}
            </div>
        `;
        tasksList.appendChild(card);
    });
}

window.claimTask = function(taskId, reward) {
    if (!playerProfile.dailyTasksClaimed.includes(taskId)) {
        playerProfile.dailyTasksClaimed.push(taskId);
        playerProfile.coins += reward;
        tasksCoins.innerText = formatNumber(playerProfile.coins);
        playSound('combo'); 
        saveProfile();
        renderTasks();
    }
}

btnGoAchievements.addEventListener('click', () => { renderAchievements(); showScreen(screenAchievements); });
btnBackAchievements.addEventListener('click', () => { showScreen(screenHome); });

function renderAchievements() {
    achievementsList.innerHTML = '';
    ACHIEVEMENTS.forEach(ach => {
        const isUnlocked = playerProfile.unlockedAchievements.includes(ach.id);
        const card = document.createElement('div');
        card.className = `ach-card ${isUnlocked ? 'unlocked' : 'locked'}`;
        card.innerHTML = `<div class="ach-icon">${ach.icon}</div><div class="ach-info"><div class="ach-title">${ach.title} ${isUnlocked ? '✔️' : ''}</div><div class="ach-desc">${ach.desc}</div></div>`;
        achievementsList.appendChild(card);
    });
}
function checkAchievements() {
    let newAchievements = [];
    ACHIEVEMENTS.forEach(ach => {
        if (!playerProfile.unlockedAchievements.includes(ach.id)) {
            if (ach.condition(playerProfile)) { playerProfile.unlockedAchievements.push(ach.id); newAchievements.push(ach); }
        }
    });
    return newAchievements;
}

btnGoScoreboard.addEventListener('click', () => { renderScoreboard('world'); showScreen(screenScoreboard); });
btnBackScoreboard.addEventListener('click', () => { showScreen(screenHome); });

tabWorld.addEventListener('click', () => { tabWorld.classList.add('active'); tabLocal.classList.remove('active'); renderScoreboard('world'); });
tabLocal.addEventListener('click', () => { tabLocal.classList.add('active'); tabWorld.classList.remove('active'); renderScoreboard('local'); });

function renderScoreboard(type) {
    scoreboardList.innerHTML = '';
    let data = generateFakeLeaderboard(type === 'local');
    
    data.forEach(p => {
        const card = document.createElement('div');
        card.className = `sb-card ${p.isPlayer ? 'highlight' : ''}`;
        
        let rankHtml = `<div class="sb-rank">${p.rank}</div>`;
        if(p.rank === 1) rankHtml = `<div class="sb-rank gold">🥇</div>`;
        if(p.rank === 2) rankHtml = `<div class="sb-rank silver">🥈</div>`;
        if(p.rank === 3) rankHtml = `<div class="sb-rank bronze">🥉</div>`;

        card.innerHTML = `
            ${rankHtml}
            <div class="sb-info">
                <div class="sb-name" style="display:flex; align-items:center; gap:8px;"><span>${p.avatar}</span> ${p.name}</div>
                <div class="sb-country">${p.country || '🌎'}</div>
            </div>
            <div class="sb-score">${formatNumber(p.bestScore)}</div>
        `;
        scoreboardList.appendChild(card);
    });
}

btnGoShop.addEventListener('click', () => { shopCoins.innerText = formatNumber(playerProfile.coins); renderShop(); showScreen(screenShop); });
btnBackShop.addEventListener('click', () => { updateHomeUI(); showScreen(screenHome); });
btnResultShop.addEventListener('click', () => { shopCoins.innerText = formatNumber(playerProfile.coins); renderShop(); showScreen(screenShop); });

tabColors.addEventListener('click', () => { tabColors.classList.add('active'); tabShapes.classList.remove('active'); containerColors.style.display = 'grid'; containerShapes.style.display = 'none'; });
tabShapes.addEventListener('click', () => { tabShapes.classList.add('active'); tabColors.classList.remove('active'); containerShapes.style.display = 'grid'; containerColors.style.display = 'none'; });

if (btnFreeCoins) {
    btnFreeCoins.addEventListener('click', () => {
        showRewardedAd();
    });
}

function renderShop() {
    containerColors.innerHTML = '';
    SHOP_COLORS.forEach(item => {
        const isUnlocked = playerProfile.unlockedColors.includes(item.name);
        const isEquipped = playerProfile.targetColor === item.name;
        const canAfford = playerProfile.coins >= item.cost;
        const card = document.createElement('div'); card.className = `shop-item ${isEquipped ? 'equipped' : ''}`;
        let btnHTML = isEquipped ? `<div class="btn-equipped">Equipped</div>` : (isUnlocked ? `<button class="btn-equip" onclick="window.equipItem('Color', '${item.name}')">Equip</button>` : `<button class="btn-buy ${canAfford ? '' : 'locked'}" onclick="window.buyItem('Color', '${item.name}', ${item.cost})">🪙 ${formatNumber(item.cost)}</button>`);
        card.innerHTML = `<div class="shop-item-preview-box"><div class="shop-item-preview" style="background-color: ${item.hex}; border-radius: 50%; border: ${item.hex === '#FFFFFF' ? '1px solid #ccc' : 'none'};"></div></div><div class="shop-item-name">${item.name}</div>${btnHTML}`;
        containerColors.appendChild(card);
    });

    containerShapes.innerHTML = '';
    SHOP_SHAPES.forEach(item => {
        const isUnlocked = playerProfile.unlockedShapes.includes(item.name);
        const isEquipped = playerProfile.targetShape === item.name;
        const canAfford = playerProfile.coins >= item.cost;
        const card = document.createElement('div'); card.className = `shop-item ${isEquipped ? 'equipped' : ''}`;
        let btnHTML = isEquipped ? `<div class="btn-equipped">Equipped</div>` : (isUnlocked ? `<button class="btn-equip" onclick="window.equipItem('Shape', '${item.name}')">Equip</button>` : `<button class="btn-buy ${canAfford ? '' : 'locked'}" onclick="window.buyItem('Shape', '${item.name}', ${item.cost})">🪙 ${formatNumber(item.cost)}</button>`);
        card.innerHTML = `<div class="shop-item-preview-box"><div class="shop-item-preview" style="background-color: var(--primary); border-radius: ${item.css}; clip-path: ${item.clipPath || 'none'}; transform: ${item.transform || 'none'}"></div></div><div class="shop-item-name">${item.name}</div>${btnHTML}`;
        containerShapes.appendChild(card);
    });
}
window.buyItem = function(type, itemName, cost) { if(playerProfile.coins >= cost) { playerProfile.coins -= cost; if(type === 'Color') playerProfile.unlockedColors.push(itemName); if(type === 'Shape') playerProfile.unlockedShapes.push(itemName); shopCoins.innerText = formatNumber(playerProfile.coins); saveProfile(); renderShop(); checkAchievements(); } }
window.equipItem = function(type, itemName) { if(type === 'Color') playerProfile.targetColor = itemName; if(type === 'Shape') playerProfile.targetShape = itemName; saveProfile(); applySettings(); renderShop(); }

btnStartGame.addEventListener('click', () => { startGetReadyPhase(); });
btnNextLevel.addEventListener('click', () => { startGetReadyPhase(); });
btnRestart.addEventListener('click', () => { startGetReadyPhase(); });

btnSkipLevel.addEventListener('click', () => {
    if(playerProfile.currentPlayingLevel >= playerProfile.unlockedLevel) {
        playerProfile.unlockedLevel = playerProfile.currentPlayingLevel + 1;
    }
    playerProfile.currentPlayingLevel++;
    saveProfile();
    playSound('click');
    startGetReadyPhase();
});

function startGetReadyPhase() {
    checkDailyTasksReset(); 
    currentLevelConfig = LEVELS[playerProfile.currentPlayingLevel - 1]; 
    readyLevelText.innerText = `LEVEL ${playerProfile.currentPlayingLevel}`; 
    readyTargetText.innerText = `Target Score: ${currentLevelConfig.targetScore}`; 
    readyCountdown.innerText = '3'; 
    showScreen(screenReady);

    let count = 3; clearInterval(countdownInterval);
    countdownInterval = setInterval(() => { 
        count--; 
        if (count > 0) { readyCountdown.innerText = count; } 
        else if (count === 0) { readyCountdown.innerText = 'GO!'; playSound('combo'); } 
        else { clearInterval(countdownInterval); startGame(); } 
    }, 1000);
}

target.addEventListener('pointerdown', handleTargetHit);

function handleTargetHit(e) { 
    if (!isPlaying) return; 
    e.preventDefault(); 
    
    currentLevelScore++; 
    uiScore.innerText = currentLevelScore; 
    
    updateDailyTaskProgress('tap_count', 1);
    
    let progressPercent = (currentLevelScore / currentLevelConfig.targetScore) * 100;
    if (progressPercent > 100) progressPercent = 100;
    uiProgress.style.width = `${progressPercent}%`;

    playSound('splash'); 

    target.classList.remove('jelly-anim');
    void target.offsetWidth; 
    target.classList.add('jelly-anim');

    const rect = target.getBoundingClientRect();
    const clickX = e.clientX || (rect.left + rect.width / 2);
    const clickY = e.clientY || (rect.top + rect.height / 2);
    const currentColor = document.documentElement.style.getPropertyValue('--target-color') || '#EF4444';
    
    createSplashEffect(clickX, clickY, currentColor);

    moveTarget(); 
}

function createSplashEffect(x, y, color) {
    const particleCount = 10;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const size = Math.random() * 12 + 6; 
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = color;
        
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 80 + 40; 
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 500);
    }
}

function startGame() {
    currentLevelScore = 0; 
    timeLeft = currentLevelConfig.time; 
    isPlaying = true;

    target.style.width = `${currentLevelConfig.size}px`; 
    target.style.height = `${currentLevelConfig.size}px`;

    uiLevel.innerText = playerProfile.currentPlayingLevel; 
    uiScore.innerText = currentLevelScore; 
    uiTime.innerText = timeLeft; 
    uiProgress.style.width = '0%';
    
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
        evaluateLevelResult();
    } 
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

function evaluateLevelResult() {
    isPlaying = false; 
    clearInterval(gameInterval); 
    target.style.display = 'none';

    let isSuccess = currentLevelScore >= currentLevelConfig.targetScore;
    endGame(isSuccess);
}

function endGame(isSuccess) {
    let coinsEarned = currentLevelScore * 2; 
    playerProfile.coins += coinsEarned;
    playerProfile.gamesPlayed++; 
    playerProfile.totalScore += currentLevelScore; 
    
    updateDailyTaskProgress('games_played', 1);
    updateDailyTaskProgress('score_accumulated', currentLevelScore);

    if (currentLevelScore > playerProfile.bestScore) {
        playerProfile.bestScore = currentLevelScore;
    }

    if (isSuccess) { 
        resultTitle.innerText = `🎯 LEVEL ${playerProfile.currentPlayingLevel} CLEARED!`; 
        resultTitle.style.color = '#10B981';
        feedbackMessage.innerText = 'AWESOME WORK!';
        
        updateDailyTaskProgress('levels_cleared', 1);
        
        btnNextLevel.style.display = 'block';
        btnSkipLevel.style.display = 'none'; 
        
        if(playerProfile.currentPlayingLevel >= playerProfile.unlockedLevel) {
             playerProfile.unlockedLevel = playerProfile.currentPlayingLevel + 1;
             unlockMessage.style.display = 'block';
             unlockMessage.innerText = `🎉 LEVEL ${playerProfile.unlockedLevel} UNLOCKED!`;
        } else {
             unlockMessage.style.display = 'none';
        }
        playerProfile.currentPlayingLevel++; 
        
    } else { 
        resultTitle.innerText = `💀 GAME OVER`; 
        resultTitle.style.color = '#EF4444';
        feedbackMessage.innerText = 'TARGET NOT REACHED. TRY AGAIN!';
        
        btnNextLevel.style.display = 'none';
        btnSkipLevel.style.display = 'block'; 
        
        unlockMessage.style.display = 'none';
    } 

    const newAchievements = checkAchievements();
    
    resultScore.innerText = currentLevelScore;
    resultTotalScore.innerText = playerProfile.totalScore;
    resultCoins.innerText = formatNumber(coinsEarned);
    resultNextLevel.innerText = playerProfile.currentPlayingLevel;

    saveProfile(); 
    playSound('over');
    
    showInterstitialAd();

    if(newAchievements.length > 0) {
        achievementToastName.innerText = newAchievements[0].title;
        achievementToast.style.display = 'block';
    } else {
        achievementToast.style.display = 'none';
    }

    showScreen(screenResult);
}

btnResultHome.addEventListener('click', () => { updateHomeUI(); showScreen(screenHome); });

init();