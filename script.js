// --- FIREBASE CONFIG & IMPORTS ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, getDocs, collection, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyBRGUWoYPQmVqvpNQB5lyqCnq5XuwaO30",
  authDomain: "my-admin-ce787.firebaseapp.com",
  projectId: "my-admin-ce787",
  storageBucket: "my-admin-ce787.firebasestorage.app",
  messagingSenderId: "228163101396",
  appId: "1:228163101396:web:6e4264e92e1a7b5138d141",
  measurementId: "G-EGFR72Z5H1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// --- PWA SETUP ---
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW registration failed:', err));
}

// --- DOM ELEMENTS ---
const screens = document.querySelectorAll('.screen');
const screenStart = document.getElementById('screen-start');
const screenGender = document.getElementById('screen-gender');
const screenCountry = document.getElementById('screen-country');
const screenAge = document.getElementById('screen-age');
const screenHome = document.getElementById('screen-home');
const screenSettings = document.getElementById('screen-settings');
const screenShop = document.getElementById('screen-shop');
const screenAchievements = document.getElementById('screen-achievements');
const screenScoreboard = document.getElementById('screen-scoreboard');
const screenLevelSelect = document.getElementById('screen-level-select');
const screenReady = document.getElementById('screen-ready');
const screenGame = document.getElementById('screen-game');
const screenResult = document.getElementById('screen-result');

const btnLoginGoogle = document.getElementById('btn-login-google');
const loginLoading = document.getElementById('login-loading');

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

const btnGoLevelSelect = document.getElementById('btn-go-level-select');
const btnGoSettings = document.getElementById('btn-go-settings');
const btnGoShop = document.getElementById('btn-go-shop');
const btnGoAchievements = document.getElementById('btn-go-achievements');
const btnGoScoreboard = document.getElementById('btn-go-scoreboard');

const btnBackAchievements = document.getElementById('btn-back-achievements');
const achievementsList = document.getElementById('achievements-list');

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

const btnBackSettings = document.getElementById('btn-back-settings');
const toggleSound = document.getElementById('toggle-sound');
const btnLogout = document.getElementById('btn-logout');

const btnBackHome = document.getElementById('btn-back-home');
const levelListContainer = document.getElementById('level-list');
const btnStartGame = document.getElementById('btn-start-game');

const readyLevelText = document.getElementById('ready-level-text');
const readyTimeText = document.getElementById('ready-time-text');
const readyCountdown = document.getElementById('ready-countdown');

const uiTime = document.getElementById('ui-time');
const uiScore = document.getElementById('ui-score');
const uiCombo = document.getElementById('ui-combo');
const playArea = document.getElementById('play-area');
const target = document.getElementById('target');

const resultLevel = document.getElementById('result-level');
const resultScore = document.getElementById('result-score');
const resultCoins = document.getElementById('result-coins');
const resultBest = document.getElementById('result-best');
const feedbackMessage = document.getElementById('feedback-message');
const unlockMessage = document.getElementById('unlock-message');
const achievementToast = document.getElementById('achievement-toast');
const achievementToastName = document.getElementById('achievement-toast-name');
const btnResultHome = document.getElementById('btn-result-home');
const btnRestart = document.getElementById('btn-restart');

// --- APP STATE ---
let playerProfile = {
    id: null, name: '', gender: '', country: '', age: '',
    bestScore: 0, totalScore: 0, lastScore: 0, gamesPlayed: 0, coins: 0,
    unlockedLevel: 1, targetColor: 'Red', targetShape: 'Circle',
    unlockedColors: ['Red', 'Blue', 'Green'],
    unlockedShapes: ['Circle', 'Square'],
    unlockedAchievements: [],
    soundEnabled: true
};

const sfx = {
    tap: new Audio("data:audio/wav;base64,UklGRmYBAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YUMBAACA/v/7//f/6//e/83/uf+a/3b/UP8o/wD//P72/vL+3/7S/sz+2/7X/s7+rf6P/n7+Vv4y/hT+8/3h/dX95/3V/cz9vf2g/YH9Vv0j/Qj97Pzm/Nz83/zc/Nz8zvyq/IT8Wvw//Bz88fvh++D72vvR+837tPua+3v7YftM+z/7H/v/+9v7nfsS+x/7Tvsj+zj7KPsT+/T66Prh+tX61/rT+rn6m/p++k76Ifre+Z/5Yfkr+eH4tPh2+FL4NPgc+A=="),
    click: new Audio("data:audio/wav;base64,UklGRmQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YUAAAACA/v/3/+//5//j/+b/4v/b/87/x//E/8f/wf+w/5X/c/9K/yH/9v7f/r7+lv5w/kz+Mv4S/vb93f25/Zn9c/1Q/Tb9Hf0J/fj83/y4/Jr8jPxs/FT8I/z1+9b7rvuV+2H7Kvv7+t/6nPpG+v757Pk="),
    over: new Audio("data:audio/wav;base64,UklGRq4AAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YIgAAACA/v/0/9X/p/92/zn/+v7Q/pr+Xv4W/db8gvws/Nb7ifsz+/r6x/qU+l76IPr4+cL5jvlB+fv4wPiO+E/4Evjp98v3uvfL99X30vfb9+r3/fcO+Cb4Qvh++KT41Pj5+Bn5Qfl0+ab51Pn7+R/6R/p0+pr6yPoS+zj7aPuY+8n75fsW/D38aPyY/MD86vwn/Wf9jv24/eD9CP4j/jr+Pf4="),
    combo: new Audio("data:audio/wav;base64,UklGRhYBAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YeoAAACA/v/2/+//7f/2/wkAIgBFAFcAaAB3AIEAiACTAJoAqAC1AMMA0gDhAOkA7AD5AAcBFwEuAT8BUwFpAXoBhgGPAYsBggF4AWcBWAFFATIBHQEIAdIAewAbAL3+a/4A/qX9LP2/+0b74fqd+mD6Ifro+af5VvkK+ar4Tfjr95f3VPcY9/v28fbe9sL2rPaa9pv2kfaa9pb2rfbB9uP2Cfcj90D3Xfd995r3pve398f33/fn9+v3+fcE+A==")
};

function playSound(type) {
    if (playerProfile.soundEnabled && sfx[type]) { sfx[type].currentTime = 0; sfx[type].play().catch(() => {}); }
}
document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => { if(!btn.classList.contains('btn-disabled')) playSound('click'); });
});

// --- DATA ---
const ACHIEVEMENTS = [
    { id: 'first_game', icon: '🎮', title: 'First Game', desc: 'Complete your first game.', condition: (p) => p.gamesPlayed >= 1 },
    { id: 'score_50', icon: '💯', title: 'Half Century', desc: 'Score 50 points in a single game.', condition: (p) => p.bestScore >= 50 },
    { id: 'score_100', icon: '🔥', title: 'Century Maker', desc: 'Score 100 points in a single game.', condition: (p) => p.bestScore >= 100 },
    { id: 'total_500', icon: '📈', title: 'Grinder', desc: 'Reach a total score of 500.', condition: (p) => p.totalScore >= 500 },
    { id: 'rich_kid', icon: '💰', title: 'Rich Kid', desc: 'Accumulate 1,000 coins.', condition: (p) => p.coins >= 1000 },
    { id: 'level_3', icon: '⭐', title: 'Rising Star', desc: 'Unlock Level 3.', condition: (p) => p.unlockedLevel >= 3 },
    { id: 'level_5', icon: '👑', title: 'Game Master', desc: 'Unlock Level 5.', condition: (p) => p.unlockedLevel >= 5 },
    { id: 'shopper', icon: '🛍️', title: 'Big Spender', desc: 'Unlock 5 different colors.', condition: (p) => p.unlockedColors.length >= 5 }
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
    LEVELS.push({
        id: i,
        time: Math.min(60, 25 + (i * 5)), 
        size: Math.max(20, 85 - (i * 5)), 
        unlockReq: (i - 1) * 30 
    });
}

const worldCountries = ["🇮🇳 India", "🇺🇸 USA", "🇬🇧 UK", "🇨🇦 Canada", "🇦🇺 Australia", "🇦🇪 UAE", "🇵🇰 Pakistan", "🇧🇩 Bangladesh", "🇳🇵 Nepal", "🇱🇰 Sri Lanka", "🇨🇳 China", "🇯🇵 Japan", "🇰🇷 South Korea", "🇸🇬 Singapore", "🇲🇾 Malaysia", "🇮🇩 Indonesia", "🇵🇭 Philippines", "🇹🇭 Thailand", "🇻🇳 Vietnam", "🇩🇪 Germany", "🇫🇷 France", "🇮🇹 Italy", "🇪🇸 Spain", "🇵🇹 Portugal", "🇳🇱 Netherlands", "🇨🇭 Switzerland", "🇸🇪 Sweden", "🇳🇴 Norway", "🇩🇰 Denmark", "🇫🇮 Finland", "🇷🇺 Russia", "🇺🇦 Ukraine", "🇧🇷 Brazil", "🇦🇷 Argentina", "🇨🇴 Colombia", "🇲🇽 Mexico", "🇿🇦 South Africa", "🇳🇬 Nigeria", "🇰🇪 Kenya", "🇪🇬 Egypt", "🇸🇦 Saudi Arabia", "🇮🇷 Iran", "🇹🇷 Turkey", "🇮🇱 Israel", "🇳🇿 New Zealand", "🌎 Other"];

let selectedLevelId = 1; let currentLevelConfig = null;
let score = 0; let combo = 0; let maxCombo = 0; let timeLeft = 0;
let gameInterval; let countdownInterval; let isPlaying = false;

// --- INITIALIZATION ---
function init() {
    populateCountries(); 
    loadProfile();
    
    // Check Auth State
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            playerProfile.id = user.uid;
            playerProfile.name = user.displayName ? user.displayName.split(' ')[0] : 'Player';
            
            loginLoading.style.display = 'block';
            btnLoginGoogle.style.display = 'none';

            try {
                const docRef = doc(db, "players", user.uid);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    playerProfile = { ...playerProfile, ...docSnap.data() };
                    
                    if(!playerProfile.unlockedColors) playerProfile.unlockedColors = ['Red', 'Blue', 'Green'];
                    if(!playerProfile.unlockedShapes) playerProfile.unlockedShapes = ['Circle', 'Square'];
                    if(!playerProfile.targetShape) playerProfile.targetShape = 'Circle';
                    if(!playerProfile.unlockedAchievements) playerProfile.unlockedAchievements = [];
                    if(playerProfile.soundEnabled === undefined) playerProfile.soundEnabled = true;
                    
                    toggleSound.checked = playerProfile.soundEnabled;
                    applySettings(); updateHomeUI(); showScreen(screenHome);
                } else {
                    showScreen(screenGender);
                }
            } catch(e) {
                console.error("Error fetching profile", e);
                alert("Could not load profile. Check console.");
            }
        } else {
            loginLoading.style.display = 'none';
            btnLoginGoogle.style.display = 'flex';
            showScreen(screenStart);
        }
    });
}

function showScreen(screenElement) { screens.forEach(s => s.classList.remove('active')); screenElement.classList.add('active'); }
function formatNumber(num) { return Number(num).toLocaleString('en-IN'); }
function populateCountries() { worldCountries.forEach(c => { let opt = document.createElement('option'); opt.value = c; opt.innerText = c; selectCountry.appendChild(opt); }); }

// CHANGED TO POPUP LOGIN FOR CODESPACES COMPATIBILITY
btnLoginGoogle.addEventListener('click', async () => {
    loginLoading.style.display = 'block';
    btnLoginGoogle.style.display = 'none';
    
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Auth Error", error);
        alert("Google Login Failed. Try again or check popup blocker.");
        loginLoading.style.display = 'none';
        btnLoginGoogle.style.display = 'flex';
    }
});

btnLogout.addEventListener('click', async () => {
    await signOut(auth);
});

// --- FIREBASE SYNC ---
async function syncToFirebase() {
    if (!playerProfile.id) return;
    try {
        await setDoc(doc(db, "players", playerProfile.id), {
            name: playerProfile.name,
            gender: playerProfile.gender,
            country: playerProfile.country,
            age: playerProfile.age,
            bestScore: playerProfile.bestScore,
            totalScore: playerProfile.totalScore,
            gamesPlayed: playerProfile.gamesPlayed,
            coins: playerProfile.coins,
            unlockedLevel: playerProfile.unlockedLevel,
            targetColor: playerProfile.targetColor,
            targetShape: playerProfile.targetShape,
            unlockedColors: playerProfile.unlockedColors,
            unlockedShapes: playerProfile.unlockedShapes,
            unlockedAchievements: playerProfile.unlockedAchievements,
            soundEnabled: playerProfile.soundEnabled,
            lastUpdated: Date.now()
        }, { merge: true });
    } catch (e) {
        console.error("Firebase sync error:", e);
    }
}

function applySettings() {
    const colorObj = SHOP_COLORS.find(c => c.name === playerProfile.targetColor) || SHOP_COLORS[0];
    const shapeObj = SHOP_SHAPES.find(s => s.name === playerProfile.targetShape) || SHOP_SHAPES[0];
    document.documentElement.style.setProperty('--target-color', colorObj.hex);
    document.documentElement.style.setProperty('--target-shape', shapeObj.css);
    document.documentElement.style.setProperty('--target-clip-path', shapeObj.clipPath || 'none');
    
    if(shapeObj.transform) {
        target.style.transform = shapeObj.transform;
        target.onmousedown = () => target.style.transform = `${shapeObj.transform} scale(0.9)`;
        target.onmouseup = () => target.style.transform = shapeObj.transform;
    } else {
        target.style.transform = 'none'; target.onmousedown = null; target.onmouseup = null;
    }
}

function loadProfile() { const saved = localStorage.getItem('beatMyScoreProfile'); if (saved) playerProfile = { ...playerProfile, ...JSON.parse(saved) }; }
function saveProfile() { localStorage.setItem('beatMyScoreProfile', JSON.stringify(playerProfile)); }

// --- ONBOARDING CONTINUED ---
btnGenders.forEach(btn => { btn.addEventListener('click', () => { btnGenders.forEach(b => b.classList.remove('selected')); btn.classList.add('selected'); playerProfile.gender = btn.getAttribute('data-gender'); btnNextGender.disabled = false; btnNextGender.classList.remove('btn-disabled'); }); });
btnNextGender.addEventListener('click', () => { showScreen(screenCountry); });
selectCountry.addEventListener('change', () => { btnNextCountry.disabled = selectCountry.value === ""; btnNextCountry.classList.toggle('btn-disabled', btnNextCountry.disabled); });
btnNextCountry.addEventListener('click', () => { playerProfile.country = selectCountry.value; showScreen(screenAge); });
btnAges.forEach(btn => { btn.addEventListener('click', () => { btnAges.forEach(b => b.classList.remove('selected')); btn.classList.add('selected'); playerProfile.age = btn.getAttribute('data-age'); btnFinishOnboarding.disabled = false; btnFinishOnboarding.classList.remove('btn-disabled'); }); });
btnFinishOnboarding.addEventListener('click', async () => {
    playerProfile.unlockedLevel = 1; playerProfile.targetColor = 'Red'; playerProfile.targetShape = 'Circle'; playerProfile.coins = 0; playerProfile.unlockedAchievements = [];
    playerProfile.unlockedColors = ['Red', 'Blue', 'Green']; playerProfile.unlockedShapes = ['Circle', 'Square']; playerProfile.soundEnabled = true;
    
    applySettings(); updateHomeUI(); showScreen(screenHome);
    await syncToFirebase(); 
});

// --- HOME LOGIC ---
function updateHomeUI() {
    displayName.innerText = playerProfile.name;
    displayAvatar.innerText = playerProfile.gender === 'Male' ? '👨' : (playerProfile.gender === 'Female' ? '👩' : '👤');
    displayCountry.innerText = playerProfile.country.split(' ')[0];
    displayLevelBadge.innerText = `LEVEL ${playerProfile.unlockedLevel}`;
    homeBestScore.innerText = formatNumber(playerProfile.bestScore);
    homeTotalScore.innerText = formatNumber(playerProfile.totalScore);
    homeGamesPlayed.innerText = formatNumber(playerProfile.gamesPlayed);
    homeCoins.innerText = formatNumber(playerProfile.coins);
}

btnGoLevelSelect.addEventListener('click', () => { buildLevelList(); showScreen(screenLevelSelect); });
btnGoSettings.addEventListener('click', () => { showScreen(screenSettings); });
btnBackSettings.addEventListener('click', () => { showScreen(screenHome); });
toggleSound.addEventListener('change', () => { playerProfile.soundEnabled = toggleSound.checked; syncToFirebase(); });

// --- SCOREBOARD LOGIC (REAL FIREBASE) ---
btnGoScoreboard.addEventListener('click', () => { renderScoreboard('world'); showScreen(screenScoreboard); });
btnBackScoreboard.addEventListener('click', () => { showScreen(screenHome); });

tabWorld.addEventListener('click', () => { tabWorld.classList.add('active'); tabLocal.classList.remove('active'); renderScoreboard('world'); });
tabLocal.addEventListener('click', () => { tabLocal.classList.add('active'); tabWorld.classList.remove('active'); renderScoreboard('local'); });

async function renderScoreboard(type) {
    scoreboardList.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-muted);">Loading global data... 🌍</div>';
    
    try {
        const playersRef = collection(db, "players");
        const q = query(playersRef, orderBy("bestScore", "desc"), limit(100));
        const querySnapshot = await getDocs(q);
        
        let allData = [];
        querySnapshot.forEach((doc) => {
            allData.push(doc.data());
        });

        if(type === 'local') {
            allData = allData.filter(p => p.country === playerProfile.country);
        }

        let playerInList = allData.find(p => p.name === playerProfile.name && p.bestScore === playerProfile.bestScore);
        if (!playerInList && playerProfile.bestScore > 0) {
            allData.push({
                name: playerProfile.name + ' (You)',
                country: playerProfile.country,
                bestScore: playerProfile.bestScore,
                isPlayer: true
            });
        } else if (playerInList) {
            playerInList.isPlayer = true;
            playerInList.name += ' (You)';
        }

        allData.sort((a,b) => b.bestScore - a.bestScore);
        allData.forEach((item, idx) => item.rank = idx + 1);

        scoreboardList.innerHTML = '';
        allData.forEach(p => {
            const card = document.createElement('div');
            card.className = `sb-card ${p.isPlayer ? 'highlight' : ''}`;
            
            let rankHtml = `<div class="sb-rank">${p.rank}</div>`;
            if(p.rank === 1) rankHtml = `<div class="sb-rank gold">🥇</div>`;
            if(p.rank === 2) rankHtml = `<div class="sb-rank silver">🥈</div>`;
            if(p.rank === 3) rankHtml = `<div class="sb-rank bronze">🥉</div>`;

            card.innerHTML = `
                ${rankHtml}
                <div class="sb-info">
                    <div class="sb-name">${p.name}</div>
                    <div class="sb-country">${p.country}</div>
                </div>
                <div class="sb-score">${p.bestScore}</div>
            `;
            scoreboardList.appendChild(card);
        });

        if(allData.length === 0) {
            scoreboardList.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-muted);">No players found.</div>';
        }
    } catch(e) {
        scoreboardList.innerHTML = '<div style="text-align:center; padding:20px; color:#EF4444;">Database connection failed. Check console.</div>';
        console.error("Firestore Error:", e);
    }
}

// --- ACHIEVEMENTS LOGIC ---
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

// --- SHOP LOGIC ---
btnGoShop.addEventListener('click', () => { shopCoins.innerText = formatNumber(playerProfile.coins); renderShop(); showScreen(screenShop); });
btnBackShop.addEventListener('click', () => { updateHomeUI(); showScreen(screenHome); });
tabColors.addEventListener('click', () => { tabColors.classList.add('active'); tabShapes.classList.remove('active'); containerColors.style.display = 'grid'; containerShapes.style.display = 'none'; });
tabShapes.addEventListener('click', () => { tabShapes.classList.add('active'); tabColors.classList.remove('active'); containerShapes.style.display = 'grid'; containerColors.style.display = 'none'; });

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
window.buyItem = function(type, itemName, cost) { if(playerProfile.coins >= cost) { playerProfile.coins -= cost; if(type === 'Color') playerProfile.unlockedColors.push(itemName); if(type === 'Shape') playerProfile.unlockedShapes.push(itemName); shopCoins.innerText = formatNumber(playerProfile.coins); syncToFirebase(); renderShop(); checkAchievements(); } }
window.equipItem = function(type, itemName) { if(type === 'Color') playerProfile.targetColor = itemName; if(type === 'Shape') playerProfile.targetShape = itemName; syncToFirebase(); applySettings(); renderShop(); }

// --- LEVEL SELECTION LOGIC ---
btnBackHome.addEventListener('click', () => { showScreen(screenHome); });
function buildLevelList() {
    levelListContainer.innerHTML = ''; btnStartGame.disabled = true; btnStartGame.classList.add('btn-disabled');
    LEVELS.forEach(lvl => {
        const isUnlocked = playerProfile.bestScore >= lvl.unlockReq;
        const card = document.createElement('div'); card.className = `level-card ${isUnlocked ? '' : 'locked'}`;
        if (isUnlocked && lvl.id === selectedLevelId) card.classList.add('selected');
        
        card.innerHTML = `
            <div class="level-info">
                <span class="level-name">Level ${lvl.id}</span>
                <span class="level-time">⏳ ${lvl.time}s | 🎯 Target: ${lvl.size}px</span>
                ${!isUnlocked ? `<span style="color:#EF4444; font-weight:800; font-size:12px; margin-top:4px;">🔒 NEED ${lvl.unlockReq} BEST SCORE</span>` : ''}
            </div>
            <div class="level-status">${isUnlocked ? '🔓' : '🔒'}</div>
        `;
        if (isUnlocked) { card.addEventListener('click', () => { document.querySelectorAll('.level-card').forEach(c => c.classList.remove('selected')); card.classList.add('selected'); selectedLevelId = lvl.id; btnStartGame.disabled = false; btnStartGame.classList.remove('btn-disabled'); }); if(lvl.id === selectedLevelId) { btnStartGame.disabled = false; btnStartGame.classList.remove('btn-disabled'); } }
        levelListContainer.appendChild(card);
    });
}
btnStartGame.addEventListener('click', () => { currentLevelConfig = LEVELS.find(l => l.id === selectedLevelId); startGetReadyPhase(); });

function startGetReadyPhase() {
    readyLevelText.innerText = `LEVEL ${currentLevelConfig.id}`; readyTimeText.innerText = `${currentLevelConfig.time} SECONDS`; readyCountdown.innerText = '3'; showScreen(screenReady);
    let count = 3; clearInterval(countdownInterval);
    countdownInterval = setInterval(() => { 
        count--; 
        if (count > 0) { readyCountdown.innerText = count; } 
        else if (count === 0) { readyCountdown.innerText = 'GO!'; playSound('combo'); } 
        else { clearInterval(countdownInterval); startGame(); } 
    }, 1000);
}

btnRestart.addEventListener('click', startGetReadyPhase);
target.addEventListener('pointerdown', handleTargetHit);

function startGame() {
    score = 0; combo = 0; maxCombo = 0; timeLeft = currentLevelConfig.time; isPlaying = true;
    target.style.width = `${currentLevelConfig.size}px`; target.style.height = `${currentLevelConfig.size}px`;
    uiScore.innerText = score; uiCombo.innerText = `${combo}🔥`; uiTime.innerText = timeLeft; showScreen(screenGame);
    clearInterval(gameInterval); gameInterval = setInterval(updateTimer, 1000);
    target.style.display = 'block'; moveTarget();
}
function updateTimer() { if (!isPlaying) return; timeLeft--; uiTime.innerText = timeLeft; if (timeLeft <= 0) endGame(); }
function handleTargetHit(e) { 
    if (!isPlaying) return; 
    e.preventDefault(); 
    score++; combo++; if (combo > maxCombo) maxCombo = combo; 
    uiScore.innerText = score; uiCombo.innerText = `${combo}🔥`; 
    playSound('tap'); if(combo === 10 || combo === 20 || combo === 30) playSound('combo');
    moveTarget(); 
}

function moveTarget() {
    const areaRect = playArea.getBoundingClientRect(); const maxX = areaRect.width - currentLevelConfig.size - 20; const maxY = areaRect.height - currentLevelConfig.size - 20;
    const randomX = Math.floor(Math.random() * maxX) + 10; const randomY = Math.floor(Math.random() * maxY) + 10;
    target.style.left = `${randomX}px`; target.style.top = `${randomY}px`;
    target.classList.remove('pop-anim'); void target.offsetWidth; target.classList.add('pop-anim');
}

function endGame() {
    isPlaying = false; clearInterval(gameInterval); target.style.display = 'none';

    let oldBest = playerProfile.bestScore; let oldLast = playerProfile.lastScore;
    let coinsEarned = score * 2; playerProfile.coins += coinsEarned;

    if (score > oldBest && oldBest > 0) { feedbackMessage.innerText = '🏆 NEW PERSONAL BEST!'; feedbackMessage.style.color = '#10B981'; } 
    else if (score > oldLast && oldLast > 0) { feedbackMessage.innerText = `🎉 +${score - oldLast} IMPROVEMENT!`; feedbackMessage.style.color = '#4F46E5'; } 
    else if (score === oldLast && oldLast > 0) { feedbackMessage.innerText = '😎 SO CLOSE! TIE!'; feedbackMessage.style.color = '#F59E0B'; } 
    else if (oldLast > 0) { feedbackMessage.innerText = '💪 KEEP GOING! TRY AGAIN'; feedbackMessage.style.color = '#EF4444'; } 
    else { feedbackMessage.innerText = '🎮 GREAT FIRST GAME!'; feedbackMessage.style.color = '#4F46E5'; }

    playerProfile.gamesPlayed++; playerProfile.totalScore += score; playerProfile.lastScore = score;
    if (score > playerProfile.bestScore) playerProfile.bestScore = score;

    let newlyUnlocked = false; let maxQualify = 1;
    for(let i=0; i<LEVELS.length; i++){ if(playerProfile.bestScore >= LEVELS[i].unlockReq) maxQualify = LEVELS[i].id; }
    if (maxQualify > playerProfile.unlockedLevel) { playerProfile.unlockedLevel = maxQualify; newlyUnlocked = true; }

    const newAchievements = checkAchievements();
    
    syncToFirebase(); 
    playSound('over');

    resultLevel.innerText = `${currentLevelConfig.id} (${currentLevelConfig.time}s)`;
    resultScore.innerText = score;
    resultCoins.innerText = formatNumber(coinsEarned);
    resultBest.innerText = formatNumber(playerProfile.bestScore);

    if (newlyUnlocked) { unlockMessage.innerText = `🎉 LEVEL ${playerProfile.unlockedLevel} UNLOCKED!`; unlockMessage.style.display = 'block'; } 
    else { unlockMessage.style.display = 'none'; }

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