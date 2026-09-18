import { drawNeonShape } from './shapes.js';
import { drawSprite, SPRITES } from './assets.js';

export class Projectile {
    // Adicionado parâmetro 'isCrit' no final
    constructor(startX, startY, targetX, targetY, color, damage, isEnemy = false, shape = 'circle', isCrit = false) {
        this.x = startX;
        this.y = startY;
        this.shape = shape;
        this.isCrit = isCrit;

        this.size = isEnemy ? 15 : 10;
        // Se for crítico, o tiro fica 50% maior
        if (this.isCrit) this.size *= 1.5;

        this.speed = isEnemy ? 6 : 10;
        this.damage = damage;
        this.color = color;
        this.active = true;
        this.life = 150;
        this.isEnemy = isEnemy;
        this.sprite = isEnemy ? SPRITES.bossShots[shape] : null;

        const dx = targetX - startX;
        const dy = targetY - startY;
        const distance = Math.hypot(dx, dy);

        const safeDistance = distance || 1;

        this.vx = (dx / safeDistance) * this.speed;
        this.vy = (dy / safeDistance) * this.speed;
    }

    update(deltaFrames = 1) {
        this.x += this.vx * deltaFrames;
        this.y += this.vy * deltaFrames;
        this.life -= deltaFrames;
        if (this.life <= 0) this.active = false;
    }

    draw(ctx) {
        if (this.sprite) {
            ctx.save();
            ctx.translate(this.x, this.y);
            const rotation = Math.atan2(this.vy, this.vx) + Math.PI / 2;
            const drawn = drawSprite(ctx, this.sprite, this.size * 2.4, rotation);
            ctx.restore();
            if (drawn) return;
        }

        // Se for crítico, a borda do tiro fica branca para dar impacto
        const strokeColor = this.isCrit ? '#fff' : this.color;
        drawNeonShape(ctx, this.x, this.y, this.size, this.shape, strokeColor);

        // Adiciona um núcleo dourado brilhante por dentro do tiro crítico
        if (this.isCrit) {
            drawNeonShape(ctx, this.x, this.y, this.size * 0.4, this.shape, '#ffea00', false);
        }
    }
}