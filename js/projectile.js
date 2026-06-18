import { drawNeonShape } from './shapes.js';

export class Projectile {
    // Adicionado parâmetro 'shape'
    constructor(startX, startY, targetX, targetY, color, damage, isEnemy = false, shape = 'circle') {
        this.x = startX;
        this.y = startY;
        this.shape = shape;
        this.size = isEnemy ? 15 : 10;
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
        // Agora desenha a forma repassada no construtor
        drawNeonShape(ctx, this.x, this.y, this.size, this.shape, this.color);
    }
}