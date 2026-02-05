const letters = [
    "I KNOW WE ARE HAVING TOUGH TIMES BUT IT WILL BE OKAY 🤗",
    "I'LL FOREVER BE YOUR BOY WITH A SENSE of HUMOR 🤌🏾✨",
    "I CAN'T UNLOVE YOU AND I DON'T EVEN WANNA TRY IT🧘🏾",
    "YOU ARE ALWAYS MY FAVORITE PERSON! LET'S MEET AND FIX THIS DISTANCE  🙏🏾😭",
    "WILL YOU GO ON A DATE WITH ME, MANURAA?<br>PLEASE👉🏾👈🏾🥺"
];

let currentLevel = 0;
let tapsInLevel = 0;
let gameActive = false;

// --- UI Logic ---
function showWrong() {
    document.getElementById('wrong-overlay').classList.remove('hidden');
    document.getElementById('phone').classList.add('shake');
}

function hideWrong() {
    document.getElementById('wrong-overlay').classList.add('hidden');
    document.getElementById('phone').classList.remove('shake');
}

function toggleMusic() {
    const music = document.getElementById('game-music');
    const icon = document.getElementById('mute-icon');
    if (music.paused) {
        music.play();
        icon.innerText = "🔊";
    } else {
        music.pause();
        icon.innerText = "🔈";
    }
}

function showWow() {
    const music = document.getElementById('game-music');
    music.play().catch(() => console.log("Music blocked"));
    document.getElementById('p1').classList.remove('active');
    document.getElementById('p2').classList.add('active');
}

function showTutorial() {
    document.getElementById('tutorial-overlay').classList.remove('hidden');
}

function startGame() {
    document.getElementById('tutorial-overlay').classList.add('hidden');
    document.getElementById('p2').classList.remove('active');
    document.getElementById('p3').classList.add('active');
    gameActive = true;
    spawnHeart();
}

// --- Game Engine ---
function spawnHeart() {
    if (!gameActive) return;
    const canvas = document.getElementById('game-canvas');
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerText = ['❤️', '💖', '💝', '💗'][Math.floor(Math.random() * 4)];
    heart.style.left = (Math.random() * 260 + 20) + 'px';
    heart.style.bottom = "-60px";
    canvas.appendChild(heart);

    let vY = 14 + Math.random() * 6;
    let posY = -60;
    let grav = 0.35;

    const move = setInterval(() => {
        if (!gameActive) { clearInterval(move); heart.remove(); return; }
        vY -= grav;
        posY += vY;
        heart.style.bottom = posY + 'px';

        heart.onpointerdown = (e) => {
            e.preventDefault();
            heart.innerText = '💥';
            setTimeout(() => heart.remove(), 100);
            updateProgress();
            clearInterval(move);
        };
        if (posY < -120) { clearInterval(move); heart.remove(); }
    }, 20);
    setTimeout(spawnHeart, 800 + Math.random() * 400);
}

function updateProgress() {
    tapsInLevel++;
    const currentNode = document.getElementById(`node-${currentLevel}`);
    const liquid = currentNode.querySelector('.p-liquid');
    liquid.style.height = (tapsInLevel * 25) + '%';

    if (tapsInLevel >= 4) {
        gameActive = false;
        setTimeout(() => {
            document.getElementById('overlay').classList.remove('hidden');
            document.getElementById('pixel-env').classList.remove('hidden');
            document.getElementById('letter-content').classList.add('hidden');
        }, 400);
    }
}

// --- Letter System ---
function openLetter() {
    document.getElementById('pixel-env').classList.add('hidden');
    document.getElementById('letter-content').classList.remove('hidden');
    
    // innerHTML used to support <br> tags
    document.getElementById('msg-text').innerHTML = letters[currentLevel];

    const btn = document.querySelector('#letter-content .menu-item.main');
    if (currentLevel === letters.length - 1) {
        btn.innerText = "[ YES! ]";
    } else {
        btn.innerText = "[ CONTINUE ]";
    }
}

function closeLetter(e) {
    if (e) e.stopPropagation();
    currentLevel++;
    tapsInLevel = 0;
    document.getElementById('overlay').classList.add('hidden');
    
    if (currentLevel >= 5) {
        showFinalScreen();
    } else {
        gameActive = true;
        spawnHeart();
    }
}

// --- Final Screen Animation ---
function showFinalScreen() {
    const gameScreen = document.getElementById('p3');
    gameScreen.innerHTML = `
        <div class="pixel-avatar" style="
            margin-top: 50px; 
            filter: drop-shadow(4px 4px 0px #000); 
            animation: bounce 0.8s infinite steps(2);
            font-size: 80px;
            text-shadow: 4px 4px 0px #ff4d94;
        ">🎀✨</div>
        <h1 class="pixel-header" style="margin-top: 20px; animation: bounce 1s infinite;">I LOVE YOU BABE!</h1>
        <div class="pixel-letter-bg" style="margin-top: 30px; width: 85%; margin-left: auto; margin-right: auto; position: relative; z-index: 10;">
            <p style="font-size: 28px; color: #ff4d94; line-height: 1.2; text-transform: uppercase;">
                So... when are we going on a date babe? Just text me, okay !
            </p>
        </div>
        <button class="menu-item main pulse" style="margin-top: 25px; position: relative; z-index: 10;" onclick="location.reload()">
            [ REPLAY ]
        </button>
        <div id="final-hearts-container" style="position: absolute; inset: 0; pointer-events: none;"></div>
    `;
    document.getElementById('overlay').classList.add('hidden');
    
    setInterval(createFinalHearts, 300);
}

function createFinalHearts() {
    const container = document.getElementById('final-hearts-container');
    if (!container) return;

    const heart = document.createElement('div');
    heart.innerText = ['❤️', '💖', '✨', '🌸', '💗'][Math.floor(Math.random() * 5)];
    heart.style.position = 'absolute';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.bottom = '-20px';
    heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
    heart.style.transition = `transform ${Math.random() * 2 + 3}s linear, opacity 3s`;
    heart.style.opacity = '1';
    
    container.appendChild(heart);

    setTimeout(() => {
        heart.style.transform = `translateY(-600px) rotate(${Math.random() * 360}deg)`;
        heart.style.opacity = '0';
    }, 100);

    setTimeout(() => heart.remove(), 5000);
}