import { CONFIG, SHAPE_RULES, AUDIO, POWER_UPS } from './config.js';
import { Player } from './player.js';
import { Enemy } from './enemy.js';
import { ParticleSystem } from './particles.js';
import { Projectile } from './projectile.js';
import { XPGem, Orb } from './xp.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas?.getContext('2d');
const minimapCanvas = document.getElementById('minimapCanvas');
const mmCtx = minimapCanvas?.getContext('2d');

const menu = document.getElementById('startMenu');
const hud = document.getElementById('hud');
const levelUpMenu = document.getElementById('levelUpMenu');
const upgradeChoicesDiv = document.getElementById('upgradeChoices');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('gameTimer');

const xpBar = document.getElementById('xpBar');
const shieldBar = document.getElementById('shieldBar');
const hpBar = document.getElementById('hpBar');
const bossHpContainer = document.getElementById('bossHpContainer');
const bossHpBar = document.getElementById('bossHpBar');

const playBtn = document.getElementById('playBtn');
const nickInput = document.getElementById('playerName');
const displayNick = document.getElementById('displayNick');
const warningMessage = document.getElementById('warningMessage');
const factionTooltip = document.getElementById('factionTooltip');

const topRightControls = document.getElementById('topRightControls');
const pauseBtn = document.getElementById('pauseBtn');
const gameOverMenu = document.getElementById('gameOverMenu');
const finalScoreElement = document.getElementById('finalScore');
const finalTimeElement = document.getElementById('finalTime');
const retryBtn = document.getElementById('retryBtn');
const quitBtn = document.getElementById('quitBtn');

let animationFrameId;

// --- VARIÁVEIS DE TEMPO ---
let gameStartTime = 0;
let totalPausedTime = 0;
let pauseStartTime = 0;
let elapsedSeconds = 0;

function playSound(audioElement) {
    if(!audioElement) return;
    try {
        audioElement.currentTime = 0;
        audioElement.play();
    } catch(e) {}
}

// Controle de Volume Seguro
if(document.getElementById('bgmVolume')) {
    document.getElementById('bgmVolume').addEventListener('input', (e) => {
        try {
            const vol = parseFloat(e.target.value);
            if (!isNaN(vol) && AUDIO.bgm && AUDIO.bossbgm) {
                AUDIO.bgm.volume = vol;
                AUDIO.bossbgm.volume = vol;
            }
        } catch(e) {}
    });
}

if(document.getElementById('sfxVolume')) {
    document.getElementById('sfxVolume').addEventListener('input', (e) => {
        try {
            const vol = parseFloat(e.target.value);
            if (!isNaN(vol)) {
                if(AUDIO.hit) AUDIO.hit.volume = vol;
                if(AUDIO.explosion) AUDIO.explosion.volume = vol;
                if(AUDIO.powerup) AUDIO.powerup.volume = vol;
                if(AUDIO.laser) AUDIO.laser.volume = vol * 0.4;
                if(AUDIO.death) AUDIO.death.volume = vol;
                if(AUDIO.colision) AUDIO.colision.volume = vol;
                if(AUDIO.clickhud) AUDIO.clickhud.volume = vol;
                if(AUDIO.gamestart) AUDIO.gamestart.volume = vol;
                if(AUDIO.soundbossatk) AUDIO.soundbossatk.volume = 0;
                if(AUDIO.bossdefeat) AUDIO.bossdefeat.volume = vol;
            }
        } catch(e) {}
    });
}

let player;
let enemies = [];
let projectiles = [];
let xpGems = [];
let orbs = [];
let debris = [];
const particles = new ParticleSystem();

let activeEffects = { saw: 0, machinegun: 0 };
let score = 0;
let gameActive = false;
let isPaused = false;
let shakeTime = 0;
let enemyShape = '';
let selectedShape = '';

let bossPhase = false;
let bossEntity = null;
let warningTimer = 0;
let currentBossScoreTarget = 200;
let bossLevel = 1;

let currentXP = 0;
let xpToNextLevel = 10;
let lastAttackTime = 0;

const factionDescriptions = {
    'triangle': '+15% Base Damage\n+5% Crit Chance\nPassive: Executes low HP enemies.',
    'circle': '+15% Movement Speed\n+10% Cooldown Reduction\nPassive: Momentum grants speed.',
    'square': '+20% Max Shield & Energy\n+2 Armor\nPassive: Takes less damage when standing still.'
};

document.querySelectorAll('.faction-btn').forEach(button => {
    button.addEventListener('mouseenter', (e) => {
        if(!factionTooltip) return;
        const shape = e.target.getAttribute('data-shape');
        factionTooltip.innerText = factionDescriptions[shape];
        factionTooltip.style.display = 'block';
        const rect = e.target.getBoundingClientRect();
        factionTooltip.style.top = (rect.top - 70) + 'px';
        factionTooltip.style.left = rect.left + 'px';
    });
    button.addEventListener('mouseleave', () => {
        if(factionTooltip) factionTooltip.style.display = 'none';
    });

    button.addEventListener('click', (e) => {
        playSound(AUDIO.clickhud);
        document.querySelectorAll('.faction-btn').forEach(b => b.classList.remove('selected'));
        e.target.classList.add('selected');
        selectedShape = e.target.getAttribute('data-shape');
        if(playBtn) playBtn.disabled = false;
    });
});

if(playBtn) {
    playBtn.addEventListener('click', () => {
        playSound(AUDIO.gamestart);
        const nick = nickInput ? nickInput.value.trim() || "Pilot" : "Pilot";
        if(displayNick) displayNick.innerText = nick;
        startGame(selectedShape);
    });
}

function returnToMenu() {
    gameActive = false;
    isPaused = false;
    bossPhase = false;

    cancelAnimationFrame(animationFrameId);

    if(AUDIO.bgm) AUDIO.bgm.pause();
    if(AUDIO.bossbgm) AUDIO.bossbgm.pause();

    if(hud) hud.style.display = 'none';
    if(topRightControls) topRightControls.style.display = 'none';
    if(bossHpContainer) bossHpContainer.style.display = 'none';
    if(gameOverMenu) gameOverMenu.style.display = 'none';
    if(levelUpMenu) levelUpMenu.style.display = 'none';
    if(warningMessage) warningMessage.style.display = 'none';
    if(minimapCanvas) minimapCanvas.style.display = 'none';

    if(ctx) {
        ctx.fillStyle = '#030305';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    if(menu) menu.style.display = 'flex';
}

if(quitBtn) {
    quitBtn.addEventListener('click', () => {
        playSound(AUDIO.clickhud);
        returnToMenu();
    });
}

function togglePause() {
    if (!gameActive) return;
    isPaused = !isPaused;

    if(pauseBtn) pauseBtn.innerHTML = isPaused ? "RESUME" : "PAUSE [SPACE] &nbsp;|&nbsp; MENU [ESC]";

    if (isPaused) {
        pauseStartTime = Date.now();
        if(AUDIO.bgm) AUDIO.bgm.pause();
        if(AUDIO.bossbgm) AUDIO.bossbgm.pause();
    } else {
        totalPausedTime += Date.now() - pauseStartTime;
        try { bossPhase ? AUDIO.bossbgm.play() : AUDIO.bgm.play(); } catch(e) {}
    }
}

if(pauseBtn) {
    pauseBtn.addEventListener('click', () => {
        playSound(AUDIO.clickhud);
        togglePause();
        pauseBtn.blur();
    });
}

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (gameActive && levelUpMenu && levelUpMenu.style.display !== 'flex' && gameOverMenu && gameOverMenu.style.display !== 'flex') {
            e.preventDefault();
            togglePause();
            playSound(AUDIO.clickhud);
        }
    }
    if (e.code === 'Escape') {
        if (menu && menu.style.display === 'none') {
            playSound(AUDIO.clickhud);
            returnToMenu();
        }
    }
});

if(retryBtn) {
    retryBtn.addEventListener('click', () => {
        playSound(AUDIO.clickhud);
        if(gameOverMenu) gameOverMenu.style.display = 'none';
        startGame(selectedShape);
    });
}

function generateDebris() {
    debris = [];
    for (let i = 0; i < 200; i++) {
        debris.push({
            x: (Math.random() - 0.5) * 6000,
            y: (Math.random() - 0.5) * 6000,
            size: Math.random() * 8 + 2,
            rot: Math.random() * Math.PI * 2
        });
    }
}

function startGame(shape) {
    cancelAnimationFrame(animationFrameId);

    player = new Player(shape);
    enemyShape = SHAPE_RULES[shape];

    enemies = [];
    projectiles = [];
    xpGems = [];
    orbs = [];
    activeEffects = { saw: 0, machinegun: 0 };
    score = 0;

    bossPhase = false;
    bossEntity = null;
    warningTimer = 0;
    currentBossScoreTarget = 200;
    bossLevel = 1;

    if(warningMessage) warningMessage.style.display = 'none';
    if(bossHpContainer) bossHpContainer.style.display = 'none';
    if(minimapCanvas) minimapCanvas.style.display = 'block';

    generateDebris();

    currentXP = 0;
    xpToNextLevel = 10;
    lastAttackTime = Date.now();

    gameStartTime = Date.now();
    totalPausedTime = 0;
    elapsedSeconds = 0;

    updateHUD();

    if(menu) menu.style.display = 'none';
    if(hud) hud.style.display = 'flex';
    if(topRightControls) topRightControls.style.display = 'block';

    gameActive = true;
    isPaused = false;
    if(pauseBtn) pauseBtn.innerHTML = "PAUSE [SPACE] &nbsp;|&nbsp; MENU [ESC]";

    if(AUDIO.bossbgm) {
        AUDIO.bossbgm.pause();
        AUDIO.bossbgm.currentTime = 0;
    }
    try { if(AUDIO.bgm){ AUDIO.bgm.currentTime = 0; AUDIO.bgm.play(); } } catch(e) {}

    gameLoop();
}

function spawnBoss() {
    bossPhase = true;
    if(warningMessage) warningMessage.style.display = 'none';
    enemies = [];

    if(AUDIO.bgm) AUDIO.bgm.pause();
    playSound(AUDIO.bossbgm);
    triggerShake();

    for (let i = 0; i < bossLevel; i++) {
        let boss = new Enemy(player.x, player.y, enemyShape, 'tank');
        boss.isBoss = true;
        boss.size = 120 + (bossLevel * 10);
        boss.hp = 3000 * bossLevel;
        boss.maxHp = boss.hp;
        boss.speed = 1.2 + (bossLevel * 0.1);
        boss.color = '#ff0055';
        boss.lastAttackTime = Date.now() + (i * 500);
        boss.attackPhase = 0;
        boss.x += (Math.random() - 0.5) * 400;
        boss.y += (Math.random() - 0.5) * 400;

        enemies.push(boss);
    }

    if(bossHpContainer) bossHpContainer.style.display = 'block';
}

setInterval(() => {
    if (!gameActive || isPaused) return;

    if (bossPhase) {
        if (Math.random() < 0.15) enemies.push(new Enemy(player.x, player.y, enemyShape, 'fast'));
        return;
    }

    let spawnsPerTick = 1 + Math.floor(elapsedSeconds / 30);

    for (let s = 0; s < spawnsPerTick; s++) {
        let type = 'normal';
        let roll = Math.random();

        if (score >= 15 && score < 50) {
            if (roll < 0.3) type = 'fast';
        } else if (score >= 50) {
            if (roll < 0.15) type = 'tank';
            else if (roll < 0.45) type = 'fast';
        }

        enemies.push(new Enemy(player.x, player.y, enemyShape, type));
    }
}, CONFIG.spawnRateMs);

function triggerShake() {
    shakeTime = 15;
    playSound(AUDIO.hit);
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function updateHUD() {
    if(scoreElement) scoreElement.innerText = score;
    if(timerElement) timerElement.innerText = formatTime(elapsedSeconds);

    const xpPercent = (currentXP / xpToNextLevel) * 100;
    if(xpBar) xpBar.style.width = `${Math.max(0, Math.min(xpPercent, 100))}%`;

    const shieldPercent = (player.shield / player.shieldMax) * 100;
    if(shieldBar) shieldBar.style.width = `${Math.max(0, Math.min(shieldPercent, 100))}%`;

    const hpPercent = (player.hp / player.hpMax) * 100;
    if(hpBar) hpBar.style.width = `${Math.max(0, Math.min(hpPercent, 100))}%`;

    if (bossPhase) {
        let totalBossHp = 0;
        let totalBossMaxHp = 0;
        enemies.forEach(e => {
            if (e.isBoss) {
                totalBossHp += e.hp;
                totalBossMaxHp += e.maxHp;
            }
        });
        if (totalBossMaxHp > 0 && bossHpBar) {
            const bossHpPercent = (totalBossHp / totalBossMaxHp) * 100;
            bossHpBar.style.width = `${Math.max(0, Math.min(bossHpPercent, 100))}%`;
        }
    }
}

function triggerLevelUp() {
    isPaused = true;
    playSound(AUDIO.powerup);
    if(levelUpMenu) levelUpMenu.style.display = 'flex';
    if(upgradeChoicesDiv) upgradeChoicesDiv.innerHTML = '';

    if(document.activeElement) document.activeElement.blur();

    let shuffled = [...POWER_UPS].sort(() => 0.5 - Math.random());
    let choices = shuffled.slice(0, 3);

    choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = `neon-btn upgrade-btn rarity-${choice.rarity}`;
        btn.innerHTML = `<span class="upgrade-title">${choice.name}</span><span class="upgrade-desc">${choice.desc}</span>`;
        btn.onclick = () => {
            choice.effect(player);
            if(player.recalculateStats) player.recalculateStats();
            resumeGame();
        };
        if(upgradeChoicesDiv) upgradeChoicesDiv.appendChild(btn);
    });
}

function resumeGame() {
    currentXP = 0;
    xpToNextLevel = Math.floor(xpToNextLevel * 1.5);
    updateHUD();
    if(levelUpMenu) levelUpMenu.style.display = 'none';
    isPaused = false;
    if(document.activeElement) document.activeElement.blur();
}

function shootNearestEnemy() {
    if (enemies.length === 0) return;
    let nearestEnemy = null;
    let minDistance = Infinity;

    for (const enemy of enemies) {
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        if (dist < minDistance) {
            minDistance = dist;
            nearestEnemy = enemy;
        }
    }

    if (nearestEnemy) {
        player.scale = 1.3;
        playSound(AUDIO.laser);

        let finalDmg = 15 * player.stats.damageMult;
        if (Math.random() < player.stats.critChance) finalDmg *= player.stats.critDmg;

        for (let i = 0; i < player.stats.projCount; i++) {
            let spreadDist = 0;
            if (i > 0) spreadDist = ((i % 2 === 0) ? 1 : -1) * (Math.ceil(i / 2) * 35);

            let proj = new Projectile(player.x, player.y, nearestEnemy.x + spreadDist, nearestEnemy.y + spreadDist, player.color, finalDmg, false, player.shape);
            proj.size *= player.stats.projSize;
            projectiles.push(proj);
        }
    }
}

function update() {
    if (!gameActive || isPaused) return;

    let elapsedMs = Date.now() - gameStartTime - totalPausedTime;
    elapsedSeconds = elapsedMs / 1000;

    if (score >= currentBossScoreTarget - 10 && warningTimer === 0 && !bossPhase) {
        if(warningMessage) warningMessage.style.display = 'block';
        warningTimer = 180;
    }
    if (warningTimer > 0) {
        warningTimer--;
        if (warningTimer <= 0 && warningMessage) warningMessage.style.display = 'none';
    }

    if (score >= currentBossScoreTarget && !bossPhase) spawnBoss();

    player.update();
    if (shakeTime > 0) shakeTime--;

    if (player.stats.regen > 0 && player.shield < player.shieldMax) {
        player.shield += (player.stats.regen / 60);
    }

    updateHUD();

    const now = Date.now();
    let currentCooldown = 800 * (1 - player.stats.cooldownRed);
    if (activeEffects.machinegun > 0) {
        activeEffects.machinegun--;
        currentCooldown *= 0.2;
    }

    if (now - lastAttackTime > currentCooldown) {
        shootNearestEnemy();
        lastAttackTime = now;
    }

    let magnetRange = (player.size * 2) * player.stats.magnet;
    for (let i = xpGems.length - 1; i >= 0; i--) {
        const gem = xpGems[i];
        if (Math.hypot(player.x - gem.x, player.y - gem.y) < magnetRange + gem.size) {
            xpGems.splice(i, 1);
            currentXP++;
            if (currentXP >= xpToNextLevel) triggerLevelUp();
        }
    }

    for (let i = orbs.length - 1; i >= 0; i--) {
        const orb = orbs[i];
        if (Math.hypot(player.x - orb.x, player.y - orb.y) < player.size + orb.size) {
            if (orb.type === 'saw') activeEffects.saw = 600;
            if (orb.type === 'machinegun') activeEffects.machinegun = 300;
            if (orb.type === 'bomb') {
                triggerShake();
                playSound(AUDIO.explosion);
                enemies.forEach(e => { if (Math.hypot(player.x - e.x, player.y - e.y) < 600) e.hp -= 200; });
            }
            orbs.splice(i, 1);
        }
    }

    if (activeEffects.saw > 0) {
        activeEffects.saw--;
        let sawAngle = now / 100;
        let sawX = player.x + Math.cos(sawAngle) * 90;
        let sawY = player.y + Math.sin(sawAngle) * 90;
        enemies.forEach(e => {
            if (Math.hypot(sawX - e.x, sawY - e.y) < e.size/2 + 25) e.hp -= 1.5;
        });
    }

    let newEnemies = [];
    for (let i = 0; i < enemies.length; i++) {
        for (let j = i + 1; j < enemies.length; j++) {
            let e1 = enemies[i];
            let e2 = enemies[j];
            if (e1.isBoss || e2.isBoss) continue;

            let dx = e1.x - e2.x;
            let dy = e1.y - e2.y;
            let dist = Math.hypot(dx, dy);
            let minDist = e1.size/2 + e2.size/2;

            if (dist < minDist && dist > 0) {
                if (e1.shape === 'triangle' && e2.shape === 'triangle') {
                    e1.specialTimer = 120; e2.specialTimer = 120;
                    e1.rotSpeed = 0.6; e1.speed = 6; e1.color = '#fff';
                    e2.rotSpeed = 0.6; e2.speed = 6; e2.color = '#fff';
                }
                else if (e1.shape === 'circle' && e2.shape === 'circle') {
                    if (!e1.isDivided && !e2.isDivided) {
                        for(let k=0; k<2; k++) {
                            let sub1 = new Enemy(e1.x + (Math.random()-0.5)*30, e1.y + (Math.random()-0.5)*30, 'circle', 'fast');
                            sub1.size = e1.size * 0.6; sub1.isDivided = true; newEnemies.push(sub1);

                            let sub2 = new Enemy(e2.x + (Math.random()-0.5)*30, e2.y + (Math.random()-0.5)*30, 'circle', 'fast');
                            sub2.size = e2.size * 0.6; sub2.isDivided = true; newEnemies.push(sub2);
                        }
                        e1.hp = -999; e2.hp = -999;
                        e1.isDeadBySplit = true; e2.isDeadBySplit = true;
                    }
                }
                else if (e1.shape === 'square' && e2.shape === 'square') {
                    e1.specialTimer = 60; e2.specialTimer = 60;
                    e1.speed = 5; e2.speed = 5;
                    if (Math.random() < 0.1) debris.push({x: e1.x, y: e1.y, size: 4, rot: Math.random()});
                }

                let overlap = (minDist - dist) / 2;
                let pushX = (dx / dist) * overlap * 0.8;
                let pushY = (dy / dist) * overlap * 0.8;
                e1.x += pushX; e1.y += pushY;
                e2.x -= pushX; e2.y -= pushY;
            }
        }
    }

    for (let i = projectiles.length - 1; i >= 0; i--) {
        const proj = projectiles[i];
        proj.update();
        if (!proj.active) { projectiles.splice(i, 1); continue; }

        if (proj.isEnemy) {
            if (Math.hypot(proj.x - player.x, proj.y - player.y) < proj.size + player.size / 2) {
                player.takeDamage(proj.damage);
                triggerShake();
                playSound(AUDIO.colision);
                proj.active = false;
            }
        } else {
            for (let j = enemies.length - 1; j >= 0; j--) {
                const enemy = enemies[j];
                if (Math.hypot(proj.x - enemy.x, proj.y - enemy.y) < proj.size + enemy.size / 2) {
                    let damageDealt = proj.damage;
                    let enemyMaxHp = enemy.maxHp;
                    if (player.shape === 'triangle' && (enemy.hp / enemyMaxHp) < 0.20) damageDealt *= 2;

                    enemy.hp -= damageDealt;
                    proj.active = false;
                    break;
                }
            }
        }
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        const distance = enemy.update(player.x, player.y);

        if (enemy.isBoss && now - enemy.lastAttackTime > 2000 - (bossLevel * 100)) {
            if (enemy.attackPhase === 0) {
                let amt = 3 + bossLevel;
                for(let b=0; b<amt; b++) {
                    let spread = (b - Math.floor(amt/2)) * 50;
                    projectiles.push(new Projectile(enemy.x, enemy.y, player.x + spread, player.y + spread, '#ff0055', 20, true, enemy.shape));
                }
                enemy.attackPhase = 1;
            }
            else if (enemy.attackPhase === 1) {
                let spikes = 8 + (bossLevel * 2);
                for(let a=0; a<spikes; a++) {
                    let ang = a * (Math.PI / (spikes/2));
                    projectiles.push(new Projectile(enemy.x, enemy.y, enemy.x + Math.cos(ang)*100, enemy.y + Math.sin(ang)*100, '#ff0055', 15, true, enemy.shape));
                }
                enemy.attackPhase = 2;
            }
            else {
                for(let a=-2; a<=2; a++) {
                    projectiles.push(new Projectile(enemy.x, enemy.y, player.x + a*40, player.y + a*40, '#ffaa00', 10, true, enemy.shape));
                }
                enemy.attackPhase = 0;
            }
            enemy.lastAttackTime = now;
        }

        if (distance < player.shieldRadius && player.shield > 0) {
            player.takeDamage(enemy.isBoss ? 2 : 0.5);
            if (!enemy.isBoss) enemy.hp -= 0.5;
            playSound(AUDIO.colision);
        }
        else if (distance < player.size / 2 + enemy.size / 2) {
            player.takeDamage(enemy.isBoss ? 5 : 0.5);
            triggerShake();
            playSound(AUDIO.colision);
        }

        if (player.hp <= 0) {
            gameActive = false;
            if(finalScoreElement) finalScoreElement.innerText = score;
            if(finalTimeElement) finalTimeElement.innerText = formatTime(elapsedSeconds);

            if(hud) hud.style.display = 'none';
            if(minimapCanvas) minimapCanvas.style.display = 'none';
            if(bossHpContainer) bossHpContainer.style.display = 'none';
            if(topRightControls) topRightControls.style.display = 'none';
            if(gameOverMenu) gameOverMenu.style.display = 'flex';

            if(AUDIO.bgm) AUDIO.bgm.pause();
            if(AUDIO.bossbgm) AUDIO.bossbgm.pause();
            playSound(AUDIO.death);
        }

        if (enemy.hp <= 0) {
            if (enemy.isDeadBySplit) {
                enemies.splice(i, 1);
                continue;
            }

            if (enemy.isBoss) {
                playSound(AUDIO.bossdefeat);
                score += 50;
            }

            particles.createExplosion(enemy.x, enemy.y, enemy.color, enemy.shape);
            for(let drop=0; drop < (enemy.isBoss ? 30 : 1); drop++) {
                xpGems.push(new XPGem(enemy.x + (Math.random()*40-20), enemy.y + (Math.random()*40-20)));
            }
            if (Math.random() < 0.03 && !enemy.isBoss) {
                const types = ['saw', 'machinegun', 'bomb'];
                orbs.push(new Orb(enemy.x, enemy.y, types[Math.floor(Math.random() * types.length)]));
            }

            score++;
            enemies.splice(i, 1);
        }
    }

    let hasBoss = enemies.some(e => e.isBoss);
    if (bossPhase && !hasBoss) {
        bossPhase = false;
        if(bossHpContainer) bossHpContainer.style.display = 'none';
        if(AUDIO.bossbgm) AUDIO.bossbgm.pause();
        try { if(AUDIO.bgm) AUDIO.bgm.play(); } catch(e) {}
        currentBossScoreTarget += 300 + (bossLevel * 100);
        bossLevel++;
    }

    if (newEnemies.length > 0) enemies.push(...newEnemies);
}

function drawMinimap() {
    if(!mmCtx) return;
    const mapSize = 180;
    const padding = 20;
    const startX = canvas.width - mapSize - padding;
    const startY = padding;

    ctx.save();
    ctx.resetTransform();

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(startX, startY, mapSize, mapSize, 8);
    ctx.fill();
    ctx.stroke();

    const centerX = startX + mapSize / 2;
    const centerY = startY + mapSize / 2;
    const radarScale = 0.04;

    ctx.fillStyle = '#fff';
    ctx.fillRect(centerX - 2, centerY - 2, 4, 4);

    enemies.forEach(e => {
        let dx = (e.x - player.x) * radarScale;
        let dy = (e.y - player.y) * radarScale;
        if (Math.abs(dx) < mapSize/2 - 5 && Math.abs(dy) < mapSize/2 - 5) {
            ctx.fillStyle = e.isBoss ? '#ff0055' : e.color;
            let size = e.isBoss ? 6 : 2;
            ctx.fillRect(centerX + dx - size/2, centerY + dy - size/2, size, size);
        }
    });

    ctx.restore();
}

function draw() {
    if(!ctx) return;
    ctx.fillStyle = bossPhase ? '#2a0005' : '#030305';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    if (shakeTime > 0) ctx.translate((Math.random() - 0.5) * shakeTime, (Math.random() - 0.5) * shakeTime);

    const camX = (canvas.width / 2) - player.x;
    const camY = (canvas.height / 2) - player.y;
    ctx.translate(camX, camY);

    drawGrid(camX, camY);

    ctx.strokeStyle = bossPhase ? 'rgba(255, 50, 50, 0.2)' : 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    debris.forEach(d => {
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.rotate(d.rot);
        ctx.beginPath();
        ctx.rect(-d.size/2, -d.size/2, d.size, d.size);
        ctx.stroke();
        ctx.restore();
    });

    xpGems.forEach(gem => gem.draw(ctx));
    orbs.forEach(orb => orb.draw(ctx));

    if (activeEffects.saw > 0) {
        let sawAngle = Date.now() / 100;
        let sawX = player.x + Math.cos(sawAngle) * 90;
        let sawY = player.y + Math.sin(sawAngle) * 90;

        ctx.save();
        ctx.translate(sawX, sawY);
        ctx.rotate(sawAngle * 3);
        ctx.strokeStyle = '#00ffcc';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00ffcc';
        ctx.beginPath();
        for(let i=0; i<8; i++) {
            ctx.lineTo(Math.cos(i*Math.PI/4)*15, Math.sin(i*Math.PI/4)*15);
            ctx.lineTo(Math.cos(i*Math.PI/4 + 0.2)*22, Math.sin(i*Math.PI/4 + 0.2)*22);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }

    particles.updateAndDraw(ctx);
    enemies.forEach(enemy => enemy.draw(ctx));
    projectiles.forEach(proj => proj.draw(ctx));
    player.draw(ctx);

    ctx.restore();

    if (gameActive && !isPaused) drawMinimap();
}

function drawGrid(camX, camY) {
    ctx.strokeStyle = bossPhase ? 'rgba(255, 0, 0, 0.3)' : 'rgba(20, 20, 40, 0.6)';
    ctx.lineWidth = 1;
    const gridSize = 100;
    const offsetX = -camX % gridSize;
    const offsetY = -camY % gridSize;

    ctx.beginPath();
    for(let x = -gridSize; x < canvas.width + gridSize; x += gridSize) {
        ctx.moveTo(x + offsetX - camX, -camY);
        ctx.lineTo(x + offsetX - camX, canvas.height - camY);
    }
    for(let y = -gridSize; y < canvas.height + gridSize; y += gridSize) {
        ctx.moveTo(-camX, y + offsetY - camY);
        ctx.lineTo(canvas.width - camX, y + offsetY - camY);
    }
    ctx.stroke();
}

function gameLoop() {
    update();
    draw();
    if (gameActive || isPaused) {
        animationFrameId = requestAnimationFrame(gameLoop);
    }
}