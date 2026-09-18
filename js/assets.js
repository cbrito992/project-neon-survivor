const imageCache = new Map();

export const SPRITES = {
    players: {
        triangle: 'image/characters/player-triangle.png',
        circle: 'image/characters/player-circle.png',
        square: 'image/characters/player-square.png'
    },
    enemies: {
        triangle: 'image/characters/enemy-triangle.png',
        circle: 'image/characters/enemy-circle.png',
        square: 'image/characters/enemy-square.png',
        hexagon: 'image/characters/enemy-hexagon.png'
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
    ctx.drawImage(entry.image, -size / 2, -size / 2, size, size);
    ctx.restore();
    return true;
}
