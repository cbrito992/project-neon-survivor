import { drawNeonShape } from './shapes.js';

export class XPGem {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 8;
        this.color = '#ffaa00';
        this.active = true;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(Date.now() / 200);
        drawNeonShape(ctx, 0, 0, this.size, 'square', this.color);
        ctx.restore();
    }
}

export class Orb {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.size = 20;
        this.type = type;
        this.pulse = 0;

        if (type === 'saw') this.color = '#00ffcc';
        else if (type === 'machinegun') this.color = '#ffff00';
        else this.color = '#ff3300';
    }

    draw(ctx) {
        this.pulse += 0.05;
        ctx.save();
        ctx.translate(this.x, this.y);

        // Gira continuamente
        ctx.rotate(this.pulse);

        const scale = 1 + Math.sin(this.pulse * 2) * 0.1;
        ctx.scale(scale, scale);

        // Diamante externo (outline)
        drawNeonShape(ctx, 0, 0, this.size, 'square', this.color, true);

        // Triângulo interno brilhante (gira ao contrário)
        ctx.rotate(-this.pulse * 2);
        drawNeonShape(ctx, 0, 0, this.size * 0.5, 'triangle', '#fff', false);

        ctx.restore();
    }
}