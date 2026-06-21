// ==========================================
// MOTOR DE RENDERIZAÇÃO OTIMIZADO (FALSO NEON)
// ==========================================
export function drawNeonShape(ctx, x, y, size, shape, color, isOutlineOnly = false) {
    ctx.beginPath();

    if (shape === 'square') {
        ctx.rect(x - size/2, y - size/2, size, size);
    } else if (shape === 'circle') {
        ctx.arc(x, y, size/2, 0, Math.PI * 2);
    } else if (shape === 'triangle') {
        ctx.moveTo(x, y - size/2);
        ctx.lineTo(x + size/2, y + size/2);
        ctx.lineTo(x - size/2, y + size/2);
        ctx.closePath();
    } else if (shape === 'hexagon') {
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const px = x + (size/2) * Math.cos(angle);
            const py = y + (size/2) * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
    }

    // OTIMIZAÇÃO: Substituição do 'shadowBlur' (muito pesado) por linhas sobrepostas.
    // Isso garante 60FPS em computadores fracos e celulares.
    if (!isOutlineOnly) {
        // Brilho Externo (Glow)
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.4;
        ctx.lineWidth = size * 0.25; // Espessura dinâmica
        ctx.stroke();

        // Núcleo Sólido
        ctx.strokeStyle = '#ffffff';
        ctx.globalAlpha = 1.0;
        ctx.lineWidth = 2;
        ctx.stroke();
    } else {
        // Apenas a linha (Usado para o Escudo)
        ctx.strokeStyle = color;
        ctx.globalAlpha = 1.0;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}