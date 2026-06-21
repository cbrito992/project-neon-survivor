export const keys = {};
export const joystick = { x: 0, y: 0, active: false };

let touchStartX = 0;
let touchStartY = 0;

// Captura de Teclado (PC)
window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

// Captura de Toque e Arraste (Mobile)
window.addEventListener('touchstart', e => {
    if (e.target.tagName === 'BUTTON' || e.target.closest('.neon-panel') || e.target.closest('.glass-panel')) return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    joystick.active = true;
}, { passive: false });

window.addEventListener('touchmove', e => {
    if (!joystick.active) return;
    let dx = e.touches[0].clientX - touchStartX;
    let dy = e.touches[0].clientY - touchStartY;

    let dist = Math.hypot(dx, dy);
    let maxDist = 50;
    if (dist > maxDist) {
        dx = (dx / dist) * maxDist;
        dy = (dy / dist) * maxDist;
    }

    joystick.x = dx / maxDist;
    joystick.y = dy / maxDist;
}, { passive: false });

window.addEventListener('touchend', () => {
    joystick.active = false;
    joystick.x = 0;
    joystick.y = 0;
});

export function isPressed(key) {
    return !!keys[key.toLowerCase()];
}