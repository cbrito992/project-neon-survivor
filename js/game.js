import { CONFIG, SHAPE_RULES, AUDIO, POWER_UPS } from './config.js';
import { Player } from './player.js';
import { Enemy } from './enemy.js';
import { ParticleSystem } from './particles.js';
import { Projectile } from './projectile.js';
import { XPGem, Orb } from './xp.js';

// ==========================================
// SISTEMA DE LOCALIZAÇÃO (i18n)
// ==========================================
const i18n = {
    en: {
        menu_placeholder: "ENTER CALL SIGN",
        menu_select_protocol: "SELECT PROTOCOL:",
        fac_tri_btn: "Triangle<br><small>Offense</small>",
        fac_cir_btn: "Circle<br><small>Mobility</small>",
        fac_squ_btn: "Square<br><small>Defense</small>",
        menu_play: "ENTER THE GRID",
        menu_lore: "DATA ARCHIVES",
        menu_support: "SUPPORT THE GRID",
        supp_title: "SUPPORT THE GRID",
        supp_thanks: "Thank you for playing Neon Survivor! Your survival helps keep the Grid alive.",
        supp_features_title: "UPCOMING PROTOCOLS [ROADMAP]:",
        supp_f1: "• Save System",
        supp_f2: "• Global Player Rankings",
        supp_f3: "• New Grid Maps & Biomes",
        supp_contact: "Report anomalies and bugs to:",
        fac_tri_desc: "TRIANGLE — THE VANGUARD\nMasters of aggression and overwhelming force.\nThe Vanguard believes survival belongs to those who strike first and strike hardest.\nBonus:\n+15% Damage\n+5% Critical Chance",
        fac_cir_desc: "CIRCLE — THE FLUX\nAdaptable, swift, and unpredictable.\nThe Flux flows through battle like energy through the Grid, avoiding danger and exploiting opportunity.\nBonus:\n+15% Movement Speed\n+10% Cooldown Reduction",
        fac_squ_desc: "SQUARE — THE BASTION\nGuardians of structure and endurance.\nThe Bastion stands firm where others fall, transforming resilience into strength.\nBonus:\n+20% Maximum Integrity\n+2 Armor",
        lore_title: "ARCHIVES",
        lore_p1_title: "PROLOGUE",
        lore_p1_text: "Long before the war, there was only the Grid.<br>An immense cosmic network connecting stars, systems, and consciousnesses across the universe. In the Grid, Primary Shapes — Circles, Squares, and Triangles — coexisted in balance.",
        lore_p2_title: "THE RUPTURE",
        lore_p2_text: "Without warning, strange signals began to emerge in the deepest regions. Fleets attacked anyone outside their faction. Peace was over.",
        lore_p3_title: "THE CORRUPTION",
        lore_p3_text: "But war was just a symptom. Something ancient and dangerous was awakening, corrupting entire systems into anomalies.",
        lore_p4_title: "THE SHAPEWALKER",
        lore_p4_text: "You are a Shapewalker. A lone traveler trapped in the collapsing Grid. Survive, evolve, and uncover the truth.",
        lore_p5_title: "OBJECTIVE",
        lore_p5_text: "Survive. Evolve. Discover the origin of the corruption.",
        lore_quote: '"The war between shapes has begun. The true threat has yet to awaken."',
        lore_return: "RETURN",
        boss_warning: "WARNING: MASSIVE ANOMALY DETECTED",
        lvl_title: "SYSTEM UPGRADE",
        lvl_subtitle: "SELECT A NEW PROTOCOL:",
        boss_hp: "ANOMALY INTEGRITY",
        hud_time: "TIME:",
        hud_score: "SCORE:",
        hud_shield: "SHIELD",
        hud_energy: "ENERGY",
        pause_btn: "[SPACE] PAUSE",
        quit_btn: "[ESC] QUIT",
        go_title: "SIGNAL LOST",
        go_score: "FINAL SCORE:",
        go_time: "TIME ALIVE:",
        go_retry: "REBOOT SYSTEM",
        pu_quantum_n: "Quantum Core", pu_quantum_d: "+10% Damage",
        pu_thrust_n: "Digital Thrusters", pu_thrust_d: "+15% Move Speed",
        pu_matrix_n: "Energy Matrix", pu_matrix_d: "+20% Max Shield",
        pu_target_n: "Targeting AI", pu_target_d: "+10% Crit Chance",
        pu_overclock_n: "Overclock Chip", pu_overclock_d: "+20% Attack Speed",
        pu_nano_n: "Nano Repair", pu_nano_d: "+2 Shield Regen/sec",
        pu_plasma_n: "Plasma Amplifier", pu_plasma_d: "+25% Projectile Size",
        pu_multi_n: "Multi Launcher", pu_multi_d: "+1 Projectile",
        pu_grav_n: "Gravity Field", pu_grav_d: "+50% Magnet Radius",
        pu_tachyon_n: "Tachyon Processor", pu_tachyon_d: "+15% Cooldown Reduction",
        pu_forge_n: "Stellar Forge", pu_forge_d: "+30% Dmg, +50% Crit Dmg",
        pu_omega_n: "Omega Protocol", pu_omega_d: "+2 Projectiles, +25% Atk Speed"
    },
    pt: {
        menu_placeholder: "INSERIR CÓDIGO",
        menu_select_protocol: "SELECIONE O PROTOCOLO:",
        fac_tri_btn: "Triângulo<br><small>Ataque</small>",
        fac_cir_btn: "Círculo<br><small>Mobilidade</small>",
        fac_squ_btn: "Quadrado<br><small>Defesa</small>",
        menu_play: "ENTRAR NA GRADE",
        menu_lore: "ARQUIVOS [LORE]",
        menu_support: "APOIAR A GRADE",
        supp_title: "APOIE A GRADE",
        supp_thanks: "Obrigado por jogar Neon Survivor! Sua sobrevivência ajuda a manter a Grade viva.",
        supp_features_title: "PRÓXIMOS PROTOCOLOS [ROADMAP]:",
        supp_f1: "• Sistema de Save",
        supp_f2: "• Ranking Global de Jogadores",
        supp_f3: "• Novos Mapas e Biomas",
        supp_contact: "Reporte anomalias e bugs para:",
        fac_tri_desc: "TRIÂNGULO — A VANGUARDA\nMestres da agressão e força esmagadora.\nA Vanguarda acredita que a sobrevivência pertence aos que atacam primeiro e mais forte.\nBônus:\n+15% Dano\n+5% Chance Crítica",
        fac_cir_desc: "CÍRCULO — O FLUXO\nAdaptável, veloz e imprevisível.\nO Fluxo flui pela batalha como energia pela Grade, evitando perigos e explorando oportunidades.\nBônus:\n+15% Vel. de Movimento\n+10% Redução de Recarga",
        fac_squ_desc: "QUADRADO — O BASTIÃO\nGuardiões da estrutura e resistência.\nO Bastião se mantém firme onde outros caem, transformando resiliência em força.\nBônus:\n+20% Integridade Máxima\n+2 Armadura",
        lore_title: "ARQUIVOS",
        lore_p1_title: "PRÓLOGO",
        lore_p1_text: "Muito antes da guerra, existia apenas a Grade.<br>Uma imensa rede cósmica que conectava estrelas, sistemas e consciências através do universo. Na Grade, as Formas Primárias coexistiam em equilíbrio.",
        lore_p2_title: "A RUPTURA",
        lore_p2_text: "Sem aviso, sinais estranhos começaram a surgir. Frotas passaram a atacar quem não fosse de sua facção. A paz havia acabado.",
        lore_p3_title: "A CORRUPÇÃO",
        lore_p3_text: "Mas a guerra era um sintoma. Nas regiões esquecidas, uma força começou a corromper sistemas inteiros, gerando anomalias.",
        lore_p4_title: "O SHAPEWALKER",
        lore_p4_text: "Você é um Shapewalker. Preso no colapso da Grade, sobreviva e descubra que a guerra é apenas a ponta do iceberg.",
        lore_p5_title: "OBJETIVO",
        lore_p5_text: "Sobreviva. Evolua. Descubra a origem da corrupção.",
        lore_quote: '"A guerra entre as formas começou. A verdadeira ameaça ainda não despertou."',
        lore_return: "VOLTAR",
        boss_warning: "AVISO: ANOMALIA MASSIVA DETECTADA",
        lvl_title: "ATUALIZAÇÃO DE SISTEMA",
        lvl_subtitle: "SELECIONE UM NOVO PROTOCOLO:",
        boss_hp: "INTEGRIDADE DA ANOMALIA",
        hud_time: "TEMPO:",
        hud_score: "PONTOS:",
        hud_shield: "ESCUDO",
        hud_energy: "ENERGIA",
        pause_btn: "[ESPAÇO] PAUSA",
        quit_btn: "[ESC] SAIR",
        go_title: "SINAL PERDIDO",
        go_score: "PONTUAÇÃO FINAL:",
        go_time: "TEMPO VIVO:",
        go_retry: "REINICIAR SISTEMA",
        pu_quantum_n: "Núcleo Quântico", pu_quantum_d: "+10% Dano",
        pu_thrust_n: "Propulsores Digitais", pu_thrust_d: "+15% Velocidade",
        pu_matrix_n: "Matriz Energética", pu_matrix_d: "+20% Escudo Máximo",
        pu_target_n: "IA de Mira", pu_target_d: "+10% Chance Crítica",
        pu_overclock_n: "Chip Overclock", pu_overclock_d: "+20% Vel. de Ataque",
        pu_nano_n: "Nanorreparo", pu_nano_d: "+2 Regen Escudo/seg",
        pu_plasma_n: "Amplificador de Plasma", pu_plasma_d: "+25% Tam. do Projétil",
        pu_multi_n: "Lançador Múltiplo", pu_multi_d: "+1 Projétil",
        pu_grav_n: "Campo Gravitacional", pu_grav_d: "+50% Raio Magnético",
        pu_tachyon_n: "Processador Táquion", pu_tachyon_d: "+15% Redução de Recarga",
        pu_forge_n: "Forja Estelar", pu_forge_d: "+30% Dano, +50% Dano Crítico",
        pu_omega_n: "Protocolo Ômega", pu_omega_d: "+2 Projéteis, +25% Vel. Ataque"
    },
    es: {
        menu_placeholder: "INGRESAR CÓDIGO",
        menu_select_protocol: "SELECCIONE PROTOCOLO:",
        fac_tri_btn: "Triángulo<br><small>Ataque</small>",
        fac_cir_btn: "Círculo<br><small>Movilidad</small>",
        fac_squ_btn: "Cuadrado<br><small>Defensa</small>",
        menu_play: "ENTRAR A LA RED",
        menu_lore: "ARCHIVOS",
        menu_support: "APOYAR LA RED",
        supp_title: "APOYA LA RED",
        supp_thanks: "¡Gracias por jugar Neon Survivor! Tu supervivencia ayuda a mantener la Red viva.",
        supp_features_title: "PRÓXIMOS PROTOCOLOS [ROADMAP]:",
        supp_f1: "• Sistema de Guardado",
        supp_f2: "• Ranking Global de Jugadores",
        supp_f3: "• Nuevos Mapas y Biomas",
        supp_contact: "Reporta anomalías y errores a:",
        fac_tri_desc: "TRIÁNGULO — LA VANGUARDIA\nMaestros de la agresión.\nBono:\n+15% Daño\n+5% Prob. Crítica",
        fac_cir_desc: "CÍRCULO — EL FLUJO\nAdaptable y veloz.\nBono:\n+15% Velocidad\n+10% Red. Enfriamiento",
        fac_squ_desc: "CUADRADO — EL BASTIÓN\nGuardianes de la resistencia.\nBono:\n+20% Integridad Máxima\n+2 Armadura",
        lore_title: "ARCHIVOS",
        lore_p1_title: "PRÓLOGO", lore_p1_text: "Mucho antes de la guerra...",
        lore_p2_title: "LA RUPTURA", lore_p2_text: "De repente, surgieron extrañas señales...",
        lore_p3_title: "LA CORRUPCIÓN", lore_p3_text: "Una fuerza desconocida corrompió los sistemas...",
        lore_p4_title: "EL SHAPEWALKER", lore_p4_text: "Sobrevive, evoluciona y descubre la verdad.",
        lore_p5_title: "OBJETIVO", lore_p5_text: "Encuentra el origen de la corrupción.",
        lore_quote: '"La verdadera amenaza aún no ha despertado."',
        lore_return: "VOLVER",
        boss_warning: "ADVERTENCIA: ANOMALÍA DETECTADA",
        lvl_title: "ACTUALIZACIÓN",
        lvl_subtitle: "SELECCIONE UN NUEVO PROTOCOLO:",
        boss_hp: "INTEGRIDAD DE ANOMALÍA",
        hud_time: "TIEMPO:", hud_score: "PUNTAJE:", hud_shield: "ESCUDO", hud_energy: "ENERGÍA",
        pause_btn: "[ESPACIO] PAUSA", quit_btn: "[ESC] SALIR",
        go_title: "SEÑAL PERDIDA", go_score: "PUNTAJE FINAL:", go_time: "TIEMPO VIVO:", go_retry: "REINICIAR SISTEMA",
        pu_quantum_n: "Núcleo Cuántico", pu_quantum_d: "+10% Daño",
        pu_thrust_n: "Propulsores Digitales", pu_thrust_d: "+15% Velocidad",
        pu_matrix_n: "Matriz Energética", pu_matrix_d: "+20% Escudo Máximo",
        pu_target_n: "IA de Puntería", pu_target_d: "+10% Prob. Crítica",
        pu_overclock_n: "Chip Overclock", pu_overclock_d: "+20% Vel. Ataque",
        pu_nano_n: "Nanoreparación", pu_nano_d: "+2 Regen Escudo/seg",
        pu_plasma_n: "Amplificador Plasma", pu_plasma_d: "+25% Tam. Proyectil",
        pu_multi_n: "Lanzador Múltiple", pu_multi_d: "+1 Proyectil",
        pu_grav_n: "Campo Gravitacional", pu_grav_d: "+50% Radio Magnético",
        pu_tachyon_n: "Procesador Taquión", pu_tachyon_d: "+15% Red. Enfriamiento",
        pu_forge_n: "Forja Estelar", pu_forge_d: "+30% Daño, +50% Daño Crítico",
        pu_omega_n: "Protocolo Omega", pu_omega_d: "+2 Proyectiles, +25% Vel. Ataque"
    }
};

const langSelect = document.getElementById('langSelect');
let currentLang = langSelect ? langSelect.value : 'en';

function t(key) {
    return i18n[currentLang][key] || key;
}

function updateTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
            el.placeholder = t(key);
        } else {
            el.innerHTML = t(key);
        }
    });
}

if(langSelect) {
    langSelect.addEventListener('change', (e) => {
        currentLang = e.target.value;
        updateTranslations();
        if(factionTooltip && factionTooltip.style.display === 'block' && selectedShape) {
            factionTooltip.innerText = t(`fac_${selectedShape.substring(0,3)}_desc`);
        }
    });
}
updateTranslations();


// ==========================================
// SETUP DO CANVAS E VARIÁVEIS PRINCIPAIS
// ==========================================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas?.getContext('2d');

const menu = document.getElementById('startMenu');
const loreMenu = document.getElementById('loreMenu');
const supportMenu = document.getElementById('supportMenu');
const hud = document.getElementById('hud');
const levelUpMenu = document.getElementById('levelUpMenu');
const upgradeChoicesDiv = document.getElementById('upgradeChoices');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('gameTimer');

const playerLevelEl = document.getElementById('playerLevel');
const statDmg = document.getElementById('statDmg');
const statSpd = document.getElementById('statSpd');
const statCrit = document.getElementById('statCrit');
const statArm = document.getElementById('statArm');

const xpBar = document.getElementById('xpBar');
const shieldBar = document.getElementById('shieldBar');
const hpBar = document.getElementById('hpBar');
const bossHpContainer = document.getElementById('bossHpContainer');
const bossHpBar = document.getElementById('bossHpBar');

const playBtn = document.getElementById('playBtn');
const openLoreBtn = document.getElementById('openLoreBtn');
const closeLoreBtn = document.getElementById('closeLoreBtn');
const openSupportBtn = document.getElementById('openSupportBtn');
const closeSupportBtn = document.getElementById('closeSupportBtn');

const nickInput = document.getElementById('playerName');
const displayNick = document.getElementById('displayNick');
const warningMessage = document.getElementById('warningMessage');
const factionTooltip = document.getElementById('factionTooltip');

const pauseBtn = document.getElementById('pauseBtn');
const quitBtn = document.getElementById('quitBtn');
const gameOverMenu = document.getElementById('gameOverMenu');
const finalScoreElement = document.getElementById('finalScore');
const finalTimeElement = document.getElementById('finalTime');
const retryBtn = document.getElementById('retryBtn');

let animationFrameId;
let gameStartTime = 0;
let totalPausedTime = 0;
let pauseStartTime = 0;
let elapsedSeconds = 0;

let frameCount = 0;

function playSound(audioElement) {
    if(!audioElement) return;
    try {
        audioElement.currentTime = 0;
        audioElement.play();
    } catch(e) {}
}

document.addEventListener('click', () => {
    if (!gameActive && menu && menu.style.display !== 'none' && AUDIO.introneon && AUDIO.introneon.paused) {
        playSound(AUDIO.introneon);
    }
}, { once: true });

if(document.getElementById('bgmVolume')) {
    document.getElementById('bgmVolume').addEventListener('input', (e) => {
        try {
            const vol = parseFloat(e.target.value);
            if (!isNaN(vol)) {
                if(AUDIO.bgm) AUDIO.bgm.volume = vol;
                if(AUDIO.bossbgm) AUDIO.bossbgm.volume = vol;
                if(AUDIO.introneon) AUDIO.introneon.volume = vol;
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
                if(AUDIO.powerup) AUDIO.powerup.volume = 0;
                if(AUDIO.laser) AUDIO.laser.volume = 0;
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
let floatingTexts = [];
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
let hasWarnedBoss = false;
let currentBossScoreTarget = 200;
let bossLevel = 1;

const bossShapeList = ['square', 'circle', 'triangle', 'hexagon'];

let currentXP = 0;
let xpToNextLevel = 10;
let lastAttackTime = 0;

document.querySelectorAll('.faction-btn').forEach(button => {
    button.addEventListener('mouseenter', (e) => {
        if(!factionTooltip) return;
        const shape = e.target.getAttribute('data-shape');
        factionTooltip.innerText = t(`fac_${shape.substring(0,3)}_desc`);
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

if (openLoreBtn) {
    openLoreBtn.addEventListener('click', () => {
        playSound(AUDIO.clickhud);
        menu.style.display = 'none';
        loreMenu.style.display = 'flex';
    });
}
if (closeLoreBtn) {
    closeLoreBtn.addEventListener('click', () => {
        playSound(AUDIO.clickhud);
        loreMenu.style.display = 'none';
        menu.style.display = 'flex';
    });
}
if (openSupportBtn) {
    openSupportBtn.addEventListener('click', () => {
        playSound(AUDIO.clickhud);
        menu.style.display = 'none';
        supportMenu.style.display = 'flex';
    });
}
if (closeSupportBtn) {
    closeSupportBtn.addEventListener('click', () => {
        playSound(AUDIO.clickhud);
        supportMenu.style.display = 'none';
        menu.style.display = 'flex';
    });
}

if(playBtn) {
    playBtn.addEventListener('click', () => {
        playSound(AUDIO.gamestart);
        const nick = nickInput && nickInput.value.trim() !== "" ? nickInput.value.trim() : "Pilot";
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
    try { if(AUDIO.introneon) { AUDIO.introneon.currentTime = 0; AUDIO.introneon.play(); } } catch(e) {}

    if(hud) hud.style.display = 'none';
    if(bossHpContainer) bossHpContainer.style.display = 'none';
    if(gameOverMenu) gameOverMenu.style.display = 'none';
    if(levelUpMenu) levelUpMenu.style.display = 'none';
    if(warningMessage) warningMessage.style.display = 'none';
    if(loreMenu) loreMenu.style.display = 'none';
    if(supportMenu) supportMenu.style.display = 'none';

    if(ctx) {
        ctx.fillStyle = '#050514';
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

    if(pauseBtn) pauseBtn.innerText = isPaused ? t('go_retry').split(' ')[0] : t('pause_btn');

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
        if (menu && menu.style.display === 'none' && loreMenu.style.display === 'none' && supportMenu.style.display === 'none') {
            playSound(AUDIO.clickhud);
            returnToMenu();
        } else if (loreMenu && loreMenu.style.display === 'flex') {
            playSound(AUDIO.clickhud);
            loreMenu.style.display = 'none';
            menu.style.display = 'flex';
        } else if (supportMenu && supportMenu.style.display === 'flex') {
            playSound(AUDIO.clickhud);
            supportMenu.style.display = 'none';
            menu.style.display = 'flex';
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
    floatingTexts = [];
    activeEffects = { saw: 0, machinegun: 0 };
    score = 0;
    frameCount = 0;

    bossPhase = false;
    hasWarnedBoss = false;
    warningTimer = 0;
    currentBossScoreTarget = 200;
    bossLevel = 1;

    if(warningMessage) warningMessage.style.display = 'none';
    if(bossHpContainer) bossHpContainer.style.display = 'none';

    generateDebris();

    currentXP = 0;
    xpToNextLevel = 10;
    lastAttackTime = Date.now();

    gameStartTime = Date.now();
    totalPausedTime = 0;
    elapsedSeconds = 0;

    updateHUD();

    if(menu) menu.style.display = 'none';
    if(loreMenu) loreMenu.style.display = 'none';
    if(supportMenu) supportMenu.style.display = 'none';
    if(hud) hud.style.display = 'flex';

    gameActive = true;
    isPaused = false;
    if(pauseBtn) pauseBtn.innerText = t('pause_btn');

    if(AUDIO.introneon) AUDIO.introneon.pause();
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

    const currBossShape = bossShapeList[(bossLevel - 1) % bossShapeList.length];

    for (let i = 0; i < bossLevel; i++) {
        let boss = new Enemy(player.x, player.y, currBossShape, 'tank');
        boss.isBoss = true;
        boss.size = 120 + (bossLevel * 20);
        boss.hp = 6000 * Math.pow(1.6, bossLevel - 1);
        boss.maxHp = boss.hp;
        boss.speed = 1.5 + (bossLevel * 0.15);
        boss.color = '#ff0055';
        boss.lastAttackTime = Date.now() + (i * 600);
        boss.attackPhase = 0;
        boss.x += (Math.random() - 0.5) * 500;
        boss.y += (Math.random() - 0.5) * 500;

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

        if (enemies.length < 80) {
            enemies.push(new Enemy(player.x, player.y, enemyShape, type));
        }
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
    if(playerLevelEl) playerLevelEl.innerText = player.level;

    const xpPercent = (currentXP / xpToNextLevel) * 100;
    if(xpBar) xpBar.style.width = `${Math.max(0, Math.min(xpPercent, 100))}%`;

    const shieldPercent = (player.shield / player.shieldMax) * 100;
    if(shieldBar) shieldBar.style.width = `${Math.max(0, Math.min(shieldPercent, 100))}%`;

    const hpPercent = (player.hp / player.hpMax) * 100;
    if(hpBar) hpBar.style.width = `${Math.max(0, Math.min(hpPercent, 100))}%`;

    if(statDmg) statDmg.innerText = `DMG: ${Math.round(player.stats.damageMult * 100)}%`;
    if(statSpd) statSpd.innerText = `ATK SPD: ${Math.round((1 + player.stats.cooldownRed) * 100)}%`;
    if(statCrit) statCrit.innerText = `CRIT: ${Math.round(player.stats.critChance * 100)}%`;
    if(statArm) statArm.innerText = `ARMOR: ${player.stats.armor}`;

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
    player.level++;
    playSound(AUDIO.clickhud);
    if(levelUpMenu) levelUpMenu.style.display = 'flex';
    if(upgradeChoicesDiv) upgradeChoicesDiv.innerHTML = '';

    if(document.activeElement) document.activeElement.blur();

    let shuffled = [...POWER_UPS].sort(() => 0.5 - Math.random());
    let choices = shuffled.slice(0, 3);

    choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = `neon-btn upgrade-btn rarity-${choice.rarity}`;
        btn.innerHTML = `<span class="upgrade-title">${t(choice.nameKey)}</span><span class="upgrade-desc">${t(choice.descKey)}</span>`;
        btn.onclick = () => {
            playSound(AUDIO.clickhud);
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

        let finalDmg = 15 * player.stats.damageMult;
        let isCrit = Math.random() < player.stats.critChance;

        if (isCrit) finalDmg *= player.stats.critDmg;

        for (let i = 0; i < player.stats.projCount; i++) {
            let spreadDist = 0;
            if (i > 0) spreadDist = ((i % 2 === 0) ? 1 : -1) * (Math.ceil(i / 2) * 35);

            let activeColor = player.getCurrentColor();
            let proj = new Projectile(player.x, player.y, nearestEnemy.x + spreadDist, nearestEnemy.y + spreadDist, activeColor, finalDmg, false, player.shape, isCrit);
            proj.size *= player.stats.projSize;
            projectiles.push(proj);
        }
    }
}

function update() {
    if (!gameActive || isPaused) return;

    frameCount++;

    let elapsedMs = Date.now() - gameStartTime - totalPausedTime;
    elapsedSeconds = elapsedMs / 1000;

    if (score >= currentBossScoreTarget - 10 && !hasWarnedBoss && !bossPhase) {
        if(warningMessage) warningMessage.style.display = 'block';
        warningTimer = 180;
        hasWarnedBoss = true;
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

    for (let i = floatingTexts.length - 1; i >= 0; i--) {
        let ft = floatingTexts[i];
        ft.y -= 1.5;
        ft.life -= 0.02;
        if (ft.life <= 0) floatingTexts.splice(i, 1);
    }

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
    if (frameCount % 4 === 0) {
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
                        let gen1 = e1.generation || 1;
                        let gen2 = e2.generation || 1;
                        if (gen1 === 1 && gen2 === 1 && !e1.willSplit && !e2.willSplit) {
                            e1.willSplit = true;
                            e2.willSplit = true;
                            e1.hp = 0;
                            e2.hp = 0;
                        }
                    }
                    else if (e1.shape === 'square' && e2.shape === 'square') {
                        e1.specialTimer = 60; e2.specialTimer = 60;
                        e1.speed = 5; e2.speed = 5;
                        if (Math.random() < 0.1) {
                            debris.push({x: e1.x, y: e1.y, size: 4, rot: Math.random()});
                            if (debris.length > 200) debris.shift();
                        }
                    }

                    let overlap = (minDist - dist) / 2;
                    let pushX = (dx / dist) * overlap * 0.8;
                    let pushY = (dy / dist) * overlap * 0.8;
                    e1.x += pushX; e1.y += pushY;
                    e2.x -= pushX; e2.y -= pushY;
                }
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

                    if (proj.isCrit) {
                        floatingTexts.push({
                            x: enemy.x + (Math.random() * 20 - 10),
                            y: enemy.y - 20,
                            text: `${Math.floor(damageDealt)} CRIT!`,
                            life: 1.5,
                            color: '#ffea00'
                        });
                    }

                    break;
                }
            }
        }
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        const distance = enemy.update(player.x, player.y);

        let bossAttackCooldown = Math.max(500, 1500 - (bossLevel * 150));

        if (enemy.isBoss && now - enemy.lastAttackTime > bossAttackCooldown) {
            let pColor = '#ff0055';

            if (enemy.attackPhase === 0) {
                let amt = 3 + bossLevel;
                for(let b=0; b<amt; b++) {
                    let spread = (b - Math.floor(amt/2)) * 50;
                    projectiles.push(new Projectile(enemy.x, enemy.y, player.x + spread, player.y + spread, pColor, 20, true, enemy.shape));
                }
                enemy.attackPhase = 1;
            }
            else if (enemy.attackPhase === 1) {
                let spikes = 8 + (bossLevel * 2);
                for(let a=0; a<spikes; a++) {
                    let ang = a * (Math.PI / (spikes/2));
                    projectiles.push(new Projectile(enemy.x, enemy.y, enemy.x + Math.cos(ang)*100, enemy.y + Math.sin(ang)*100, pColor, 15, true, enemy.shape));
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
            if(bossHpContainer) bossHpContainer.style.display = 'none';
            if(gameOverMenu) gameOverMenu.style.display = 'flex';

            if(AUDIO.bgm) AUDIO.bgm.pause();
            if(AUDIO.bossbgm) AUDIO.bossbgm.pause();
            playSound(AUDIO.death);
        }

        if (enemy.hp <= 0) {
            if (enemy.willSplit) {
                for(let k=0; k<2; k++) {
                    let subEnemy = new Enemy(enemy.x + (Math.random()-0.5)*40, enemy.y + (Math.random()-0.5)*40, 'circle', 'fast');
                    subEnemy.size = enemy.size * 0.6;
                    subEnemy.generation = 2;
                    subEnemy.hp = enemy.maxHp * 0.5;
                    newEnemies.push(subEnemy);
                }
                enemies.splice(i, 1);
                continue;
            }

            if (enemy.isBoss) {
                playSound(AUDIO.bossdefeat);
                score += 50;
            }

            if (xpGems.length > 300) xpGems.shift();

            particles.createExplosion(enemy.x, enemy.y, enemy.color, enemy.shape);
            for(let drop=0; drop < (enemy.isBoss ? 30 : 1); drop++) {
                xpGems.push(new XPGem(enemy.x + (Math.random()*40-20), enemy.y + (Math.random()*40-20)));
            }

            if (Math.random() < 0.006 && !enemy.isBoss) {
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
        hasWarnedBoss = false;
        if(bossHpContainer) bossHpContainer.style.display = 'none';
        if(AUDIO.bossbgm) AUDIO.bossbgm.pause();
        try { if(AUDIO.bgm) AUDIO.bgm.play(); } catch(e) {}

        currentBossScoreTarget += 300 + (bossLevel * 100);
        bossLevel++;
        player.evolveColor();
    }

    if (newEnemies.length > 0) enemies.push(...newEnemies);
}

function drawMinimap() {
    const mapSize = 150;
    const padding = 20;

    ctx.save();
    ctx.resetTransform();

    ctx.fillStyle = 'rgba(5, 5, 15, 0.6)';
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const startX = canvas.width - mapSize - padding;
    const startY = padding;

    if (ctx.roundRect) {
        ctx.roundRect(startX, startY, mapSize, mapSize, 12);
    } else {
        ctx.rect(startX, startY, mapSize, mapSize);
    }
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
            let size = e.isBoss ? 6 : 3;
            ctx.fillRect(centerX + dx - size/2, centerY + dy - size/2, size, size);
        }
    });

    ctx.restore();
}

function draw() {
    if(!ctx) return;

    ctx.fillStyle = bossPhase ? '#120005' : '#050514';
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

    floatingTexts.forEach(ft => {
        ctx.save();
        ctx.globalAlpha = Math.min(ft.life, 1.0);
        ctx.fillStyle = ft.color;
        ctx.font = "bold 18px Orbitron";
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
    });

    ctx.restore();

    if (gameActive && !isPaused) drawMinimap();
}

function drawGrid(camX, camY) {
    ctx.strokeStyle = bossPhase ? 'rgba(255, 0, 85, 0.15)' : 'rgba(0, 255, 255, 0.1)';
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