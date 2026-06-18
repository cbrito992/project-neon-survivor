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

export const POWER_UPS = [
    { id: 'quantum_core', name: 'Quantum Core', desc: '+10% Damage', rarity: 'common', effect: (p) => p.stats.damageMult += 0.10 },
    { id: 'digital_thrusters', name: 'Digital Thrusters', desc: '+15% Move Speed', rarity: 'common', effect: (p) => p.stats.speedMult += 0.15 },
    { id: 'energy_matrix', name: 'Energy Matrix', desc: '+20% Max Shield', rarity: 'common', effect: (p) => { p.shieldMax *= 1.2; p.shield = p.shieldMax; } },
    { id: 'targeting_ai', name: 'Targeting AI', desc: '+10% Crit Chance', rarity: 'rare', effect: (p) => p.stats.critChance += 0.10 },
    { id: 'overclock_chip', name: 'Overclock Chip', desc: '+20% Attack Speed', rarity: 'rare', effect: (p) => p.stats.cooldownRed += 0.20 },
    { id: 'nano_repair', name: 'Nano Repair', desc: '+2 Shield Regen/sec', rarity: 'rare', effect: (p) => p.stats.regen += 2 },
    { id: 'plasma_amplifier', name: 'Plasma Amplifier', desc: '+25% Projectile Size', rarity: 'rare', effect: (p) => p.stats.projSize += 0.25 },
    { id: 'multi_launcher', name: 'Multi Launcher', desc: '+1 Projectile', rarity: 'epic', effect: (p) => p.stats.projCount += 1 },
    { id: 'gravity_field', name: 'Gravity Field', desc: '+50% Magnet Radius', rarity: 'epic', effect: (p) => p.stats.magnet += 0.50 },
    { id: 'tachyon_processor', name: 'Tachyon Processor', desc: '+15% Cooldown Reduction', rarity: 'epic', effect: (p) => p.stats.cooldownRed += 0.15 },
    { id: 'stellar_forge', name: 'Stellar Forge', desc: '+30% Dmg, +50% Crit Dmg', rarity: 'legendary', effect: (p) => { p.stats.damageMult += 0.30; p.stats.critDmg += 0.50; } },
    { id: 'omega_protocol', name: 'Omega Protocol', desc: '+2 Projectiles, +25% Atk Speed', rarity: 'legendary', effect: (p) => { p.stats.projCount += 2; p.stats.cooldownRed += 0.25; } }
];

export const AUDIO = {
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

AUDIO.bgm.loop = true;
AUDIO.bossbgm.loop = true;
AUDIO.bgm.volume = 0.5;
AUDIO.bossbgm.volume = 0.6;