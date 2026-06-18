import { isPressed } from './input.js';
import { drawNeonShape } from './shapes.js';
import { FACTIONS } from './config.js';

export class Player {
    constructor(shape) {
        this.shape = shape;
        this.faction = FACTIONS[shape];
        this.color = this.faction.color;

        this.x = 0;
        this.y = 0;
        this.size = 30;

        this.vx = 0;
        this.vy = 0;
        this.accel = 1.2;
        this.friction = 0.85;

        this.stats = {
            damageMult: 1.0,
            critChance: 0.0,
            critDmg: 1.5,
            speedMult: 1.0,
            maxHpMult: 1.0,
            armor: 0,
            regen: 0,
            cooldownRed: 0,
            projCount: 1,
            projSize: 1.0,
            magnet: 1.0
        };

        if (this.faction.bonus.damageMult) this.stats.damageMult = this.faction.bonus.damageMult;
        if (this.faction.bonus.critChance) this.stats.critChance = this.faction.bonus.critChance;
        if (this.faction.bonus.maxHpMult) this.stats.maxHpMult = this.faction.bonus.maxHpMult;
        if (this.faction.bonus.armor) this.stats.armor = this.faction.bonus.armor;
        if (this.faction.bonus.speedMult) this.stats.speedMult = this.faction.bonus.speedMult;
        if (this.faction.bonus.cooldownRed) this.stats.cooldownRed = this.faction.bonus.cooldownRed;

        this.hpMax = 100 * this.stats.maxHpMult;
        this.hp = this.hpMax;
        this.shieldMax = 100 * this.stats.maxHpMult;
        this.shield = this.shieldMax;

        this.shieldScaleBase = 2.5;
        this.rotation = 0;
        this.scale = 1;

        this.trail = [];
        this.momentum = 0;
    }

    // NOVO: Recalcula os atributos sem explodir a vida atual do player
    recalculateStats() {
        const oldHpMax = this.hpMax;
        const oldShieldMax = this.shieldMax;

        this.hpMax = 100 * this.stats.maxHpMult;
        this.shieldMax = 100 * this.stats.maxHpMult;

        // Mantém a proporção da vida que ele tinha
        this.hp = (this.hp / oldHpMax) * this.hpMax;
        this.shield = (this.shield / oldShieldMax) * this.shieldMax;
    }

    update() {
        let ax = 0;
        let dy = 0;
        let isMoving = false;

        if (isPressed('w') || isPressed('arrowup')) { dy -= this.accel; isMoving = true; }
        if (isPressed('s') || isPressed('arrowdown')) { dy += this.accel; isMoving = true; }
        if (isPressed('a') || isPressed('arrowleft')) { ax -= this.accel; isMoving = true; }
        if (isPressed('d') || isPressed('arrowright')) { ax += this.accel; isMoving = true; }

        if (this.shape === 'circle') {
            if (isMoving) this.momentum = Math.min(this.momentum + 0.005, 0.4);
            else this.momentum = 0;
        }

        let finalSpeedMult = this.stats.speedMult + this.momentum;

        this.vx += ax * finalSpeedMult;
        this.vy += dy * finalSpeedMult;
        this.vx *= this.friction;
        this.vy *= this.friction;

        this.x += this.vx;
        this.y += this.vy;

        if (Math.abs(this.vx) > 0.1 || Math.abs(this.vy) > 0.1) {
            this.rotation = Math.atan2(this.vy, this.vx) + Math.PI / 2;
        }

        if (this.scale > 1) this.scale -= 0.05;

        // Guarda o status do escudo no rastro
        this.trail.unshift({
            x: this.x, y: this.y, rot: this.rotation,
            hasShield: this.shield > 0, shieldRatio: this.shield / this.shieldMax
        });
        if (this.trail.length > 8) this.trail.pop();
    }

    takeDamage(baseDamage) {
        let finalDamage = baseDamage;
        if (this.shape === 'square' && Math.abs(this.vx) < 1 && Math.abs(this.vy) < 1) {
            finalDamage *= 0.85;
        }

        finalDamage = Math.max(0.1, finalDamage - this.stats.armor);

        if (this.shield > 0) {
            this.shield -= finalDamage;
            if (this.shield < 0) this.shield = 0;
        } else {
            this.hp -= (finalDamage * 2);
            if (this.hp < 0) this.hp = 0;
        }
    }

    draw(ctx) {
        // Rastro Dinâmico (Segue o escudo se existir, senão segue o núcleo)
        this.trail.forEach((t, index) => {
            let alpha = 1 - (index / this.trail.length);
            ctx.save();
            ctx.translate(t.x, t.y);
            ctx.rotate(t.rot);
            ctx.globalAlpha = alpha * 0.3;

            if (t.hasShield) {
                const dynamicScale = this.shieldScaleBase * (0.7 + t.shieldRatio * 0.3);
                drawNeonShape(ctx, 0, 0, this.size * dynamicScale, this.shape, this.color, true);
            } else {
                drawNeonShape(ctx, 0, 0, this.size * (0.6 + alpha * 0.4), this.shape, this.color);
            }

            ctx.restore();
        });

        // Escudo Atual
        if (this.shield > 0) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = 0.2 + (this.shield / this.shieldMax) * 0.5;
            const dynamicScale = this.shieldScaleBase * (0.7 + (this.shield / this.shieldMax) * 0.3);
            drawNeonShape(ctx, 0, 0, this.size * dynamicScale, this.shape, this.color, true);
            ctx.restore();
        }

        // Corpo Principal
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale, this.scale);
        drawNeonShape(ctx, 0, 0, this.size, this.shape, '#fff');
        ctx.restore();
    }
}