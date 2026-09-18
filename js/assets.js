const imageCache = new Map();

export const SPRITES = {
    players: {
        triangle: 'assets/triangle_player.png',
        circle: 'assets/circle_player.png',
        square: 'assets/square_player.png'
    },
    enemies: {
        triangle: 'assets/triangle_enemy.png',
        circle: 'assets/circle_enemy.png',
        square: 'assets/square_enemy.png'
    },
    bosses: {
        triangle: 'assets/triangle_boss.png',
        circle: 'assets/circle_boss.png',
        square: 'assets/square_boss.png',
        hexagon: 'assets/hexagon_boss.png'
    },
    bossShots: {
        triangle: 'assets/boss_shot_triangle.png',
        circle: 'assets/boss_shot_circle.png',
        square: 'assets/boss_shot_square.png',
        hexagon: 'assets/boss_shot_hexagon.png'
    },
    effects: {
        bossAura: 'assets/boss_aura.png',
        bossExplosion: 'assets/boss_explosion.png',
        explosion: 'assets/explosion.png',
        bossWarning: 'assets/boss_warning.png'
    }
};

export function loadImage(path) {
    if (!path) return null;
    if (!imageCache.has(path)) {
        const image = new Image();
        const entry = { image, ready: false, failed: false };
        image.addEventListener('load', () => { entry.ready = true; });
        image.addEventListener('error', () => { entry.failed = true; });
        image.src = path;
        imageCache.set(path, entry);
    }
    return imageCache.get(path);
}

export function drawSprite(ctx, path, size, rotation = 0) {
    const entry = loadImage(path);
    if (!entry?.ready) return false;
    ctx.save();
    ctx.rotate(rotation);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(entry.image, -size / 2, -size / 2, size, size);
    ctx.restore();
    return true;
}
