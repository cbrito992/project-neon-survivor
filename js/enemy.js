import { drawNeonShape } from './shapes.js';
import { COLORS } from './config.js';

export class Enemy {
    constructor(playerX, playerY, shape, type = 'normal') {
        this.shape = shape;
        this.color = COLORS[shape];
        this.baseColor = this.color;
        this.type = type;
        this.isBoss = false;

        // Efeitos de Swarm / Física Temporária
        this.rotation = 0;
        this.rotSpeed = 0;
        this.specialTimer = 0; // Timer para voltar ao normal
        this.generation = 1; // Para bolhas
        this.willSplit = false;

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

    update(playerX, playerY) {
        const dx = playerX - this.x;
        const dy = playerY - this.y;
        const distance = Math.hypot(dx, dy);

        if (distance > 0) {
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        }

        // Rotação dinâmica
        if (this.rotSpeed > 0) {
            this.rotation += this.rotSpeed;
        }

        // Lógica de tempo para os efeitos físicos voltarem ao normal
        if (this.specialTimer > 0) {
            this.specialTimer--;
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

        if (this.type === 'tank') ctx.lineWidth = 6;
        drawNeonShape(ctx, 0, 0, this.size, this.shape, this.color);

        ctx.restore();
    }
}