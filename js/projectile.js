import { drawNeonShape } from './shapes.js';

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

        const dx = targetX - startX;
        const dy = targetY - startY;
        const distance = Math.hypot(dx, dy);

        this.vx = (dx / distance) * this.speed;
        this.vy = (dy / distance) * this.speed;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
        if (this.life <= 0) this.active = false;
    }

    draw(ctx) {
        // Se for crítico, a borda do tiro fica branca para dar impacto
        const strokeColor = this.isCrit ? '#fff' : this.color;
        drawNeonShape(ctx, this.x, this.y, this.size, this.shape, strokeColor);

        // Adiciona um núcleo dourado brilhante por dentro do tiro crítico
        if (this.isCrit) {
            drawNeonShape(ctx, this.x, this.y, this.size * 0.4, this.shape, '#ffea00', false);
        }
    }
}