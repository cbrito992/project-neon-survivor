export function drawNeonShape(ctx, x, y, size, shape, color, isOutlineOnly = false) {
    if (!isOutlineOnly) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = color;
    } else {
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = isOutlineOnly ? 3 : 4;
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

    ctx.stroke();
    ctx.shadowBlur = 0;
}