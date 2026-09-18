import { drawNeonShape } from './shapes.js';
import { COLORS } from './config.js';
import { drawSprite, SPRITES } from './assets.js';

export class Enemy {
    constructor(playerX, playerY, shape, type = 'normal') {
        this.shape = shape;
        this.color = COLORS[shape];
        this.baseColor = this.color;
        this.type = type;
        this.isBoss = false;
        this.sprite = SPRITES.enemies[shape];

        // Efeitos de Swarm / Física Temporária
        this.rotation = 0;
        this.rotSpeed = 0;
        this.specialTimer = 0; // Timer para voltar ao normal
        this.generation = 1; // Para bolhas
        this.willSplit = false;
        this.lastAttackTime = 0;

        if (type === 'fast') {
            this.size = 15;
            this.speed = 3.5 + Math.random() * 2;
            this.hp = 10;
            this.baseSpeed = this.speed;
        } else if (type === 'tank') {
            this.size = 60;
            this.speed = 0.6 + Math.random() * 0.4;
            this.hp = 150;
            this.baseSpeed = this.speed;
        } else if (type === 'ranged') {
            this.size = 25;
            this.speed = 1.15;
            this.hp = 42;
            this.baseSpeed = this.speed;
        } else if (type === 'elite') {
            this.size = 46;
            this.speed = 1.35;
            this.hp = 260;
            this.baseSpeed = this.speed;
        } else {
            this.size = 28;
            this.speed = 1.5 + Math.random() * 1.5;
            this.hp = 30;
            this.baseSpeed = this.speed;
        }

        this.maxHp = this.hp;

        const angle = Math.random() * Math.PI * 2;
        const spawnRadius = 800;
        this.x = playerX + Math.cos(angle) * spawnRadius;
        this.y = playerY + Math.sin(angle) * spawnRadius;
    }

    update(playerX, playerY, deltaFrames = 1) {
        const dx = playerX - this.x;
        const dy = playerY - this.y;
        const distance = Math.hypot(dx, dy);

        if (distance > 0) {
            let direction = 1;
            if (this.type === 'ranged') {
                if (distance < 220) direction = -0.65;
                else if (distance < 330) direction = 0;
            }
            this.x += (dx / distance) * this.speed * direction * deltaFrames;
            this.y += (dy / distance) * this.speed * direction * deltaFrames;
            if (this.rotSpeed <= 0) this.rotation = Math.atan2(dy, dx) + Math.PI / 2;
        }

        // Rotação dinâmica
        if (this.rotSpeed > 0) {
            this.rotation += this.rotSpeed * deltaFrames;
        }

        // Lógica de tempo para os efeitos físicos voltarem ao normal
        if (this.specialTimer > 0) {
            this.specialTimer -= deltaFrames;
            if (this.specialTimer <= 0) {
                this.color = this.baseColor;
                this.speed = this.baseSpeed;
                this.rotSpeed = 0;
            }
        }

        return distance;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        if (this.type === 'tank' || this.type === 'elite') ctx.lineWidth = 6;

        if (this.isBoss) {
            drawSprite(ctx, SPRITES.effects.bossAura, this.size * 1.55, -this.rotation);
        }

        const activeSprite = this.isBoss ? SPRITES.bosses[this.shape] : this.sprite;
        if (!drawSprite(ctx, activeSprite, this.size * (this.isBoss ? 1.15 : 1))) {
            drawNeonShape(ctx, 0, 0, this.size, this.shape, this.color);
        }

        ctx.restore();
    }
}
