import { drawNeonShape } from './shapes.js';

export class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    createExplosion(x, y, color, shape) {
        for (let i = 0; i < 15; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                size: Math.random() * 8 + 2,
                color: color,
                shape: shape,
                life: 1.0
            });
        }
    }

    updateAndDraw(ctx) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.03;

            if (p.life <= 0) {
                this.particles.splice(i, 1);
            } else {
                ctx.globalAlpha = p.life;
                drawNeonShape(ctx, p.x, p.y, p.size, p.shape, p.color);
                ctx.globalAlpha = 1.0;
            }
        }
    }
}