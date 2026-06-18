export const CONFIG = {
    canvasWidth: 1280,
    canvasHeight: 720,
    worldSize: 3000,
    spawnRateMs: 800
};

export const SHAPE_RULES = {
    'triangle': 'square',
    'circle': 'triangle',
    'square': 'circle'
};

export const COLORS = {
    'triangle': '#0ff',
    'circle': '#f0f',
    'square': '#0f0'
};

export const FACTIONS = {
    'triangle': {
        color: '#0ff',
        bonus: { damageMult: 1.15, critChance: 0.05 }
    },
    'square': {
        color: '#0f0',
        bonus: { maxHpMult: 1.20, armor: 2 }
    },
    'circle': {
        color: '#f0f',
        bonus: { speedMult: 1.15, cooldownRed: 0.10 }
    }
};

// Powerups agora usam chaves i18n
export const POWER_UPS = [
    { id: 'quantum_core', nameKey: 'pu_quantum_n', descKey: 'pu_quantum_d', rarity: 'common', effect: (p) => p.stats.damageMult += 0.10 },
    { id: 'digital_thrusters', nameKey: 'pu_thrust_n', descKey: 'pu_thrust_d', rarity: 'common', effect: (p) => p.stats.speedMult += 0.15 },
    { id: 'energy_matrix', nameKey: 'pu_matrix_n', descKey: 'pu_matrix_d', rarity: 'common', effect: (p) => { p.shieldMax *= 1.2; p.shield = p.shieldMax; } },
    { id: 'targeting_ai', nameKey: 'pu_target_n', descKey: 'pu_target_d', rarity: 'rare', effect: (p) => p.stats.critChance += 0.10 },
    { id: 'overclock_chip', nameKey: 'pu_overclock_n', descKey: 'pu_overclock_d', rarity: 'rare', effect: (p) => p.stats.cooldownRed += 0.20 },
    { id: 'nano_repair', nameKey: 'pu_nano_n', descKey: 'pu_nano_d', rarity: 'rare', effect: (p) => p.stats.regen += 2 },
    { id: 'plasma_amplifier', nameKey: 'pu_plasma_n', descKey: 'pu_plasma_d', rarity: 'rare', effect: (p) => p.stats.projSize += 0.25 },
    { id: 'multi_launcher', nameKey: 'pu_multi_n', descKey: 'pu_multi_d', rarity: 'epic', effect: (p) => p.stats.projCount += 1 },
    { id: 'gravity_field', nameKey: 'pu_grav_n', descKey: 'pu_grav_d', rarity: 'epic', effect: (p) => p.stats.magnet += 0.50 },
    { id: 'tachyon_processor', nameKey: 'pu_tachyon_n', descKey: 'pu_tachyon_d', rarity: 'epic', effect: (p) => p.stats.cooldownRed += 0.15 },
    { id: 'stellar_forge', nameKey: 'pu_forge_n', descKey: 'pu_forge_d', rarity: 'legendary', effect: (p) => { p.stats.damageMult += 0.30; p.stats.critDmg += 0.50; } },
    { id: 'omega_protocol', nameKey: 'pu_omega_n', descKey: 'pu_omega_d', rarity: 'legendary', effect: (p) => { p.stats.projCount += 2; p.stats.cooldownRed += 0.25; } }
];

export const AUDIO = {
    introneon: new Audio('audio/introneon.mp3'),
    bgm: new Audio('audio/bgm_loop.mp3'),
    hit: new Audio('audio/hit.mp3'),
    explosion: new Audio('audio/explosion.mp3'),
    powerup: new Audio('audio/powerup.mp3'),
    laser: new Audio('audio/laser.mp3'),
    death: new Audio('audio/death.mp3'),
    colision: new Audio('audio/colision.mp3'),
    clickhud: new Audio('audio/clickhud.mp3'),
    gamestart: new Audio('audio/gamestart.mp3'),
    soundbossatk: new Audio('audio/soundbossatk.mp3'),
    bossdefeat: new Audio('audio/bossdefeat.mp3'),
    bossbgm: new Audio('audio/boss.mp3')
};

AUDIO.introneon.loop = true;
AUDIO.bgm.loop = true;
AUDIO.bossbgm.loop = true;
AUDIO.introneon.volume = 0.5;
AUDIO.bgm.volume = 0.5;
AUDIO.bossbgm.volume = 0.6;