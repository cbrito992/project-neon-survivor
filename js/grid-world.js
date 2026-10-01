const COLORS = { shrine:'#d8b45a', relic:'#9d7cff', crystal:'#ff6b57', corruption:'#8b2f73' };

export class GridWorld {
    constructor() {
        this.features = [];
        this.stars = Array.from({length: 90}, () => ({
            x: Math.random() * 1280, y: Math.random() * 720,
            size: Math.random() < 0.12 ? 2 : 1, depth: 0.15 + Math.random() * 0.25
        }));
        const types = ['shrine', 'relic', 'crystal', 'corruption'];
        for (let i = 0; i < 34; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 350 + Math.random() * 2800;
            this.features.push({ x: Math.cos(angle)*distance, y: Math.sin(angle)*distance,
                type: types[i % types.length], active: true, charge: 0, pulse: Math.random()*6.28 });
        }
    }

    update(player, enemies, dt=1) {
        const result = { xp:0, message:null, color:'#d8b45a' };
        for (const f of this.features) {
            if (!f.active) continue;
            const distance = Math.hypot(player.x-f.x, player.y-f.y);
            if (f.type === 'corruption' && distance < 145) player.shield = Math.max(0, player.shield-0.025*dt);
            if (distance > 62) { if (f.type === 'shrine') f.charge = Math.max(0, f.charge-dt*.25); continue; }
            if (f.type === 'shrine') {
                f.charge += dt;
                if (f.charge >= 90) { player.shield=Math.min(player.shieldMax,player.shield+player.shieldMax*.45); player.hp=Math.min(player.hpMax,player.hp+player.hpMax*.15); f.active=false; result.message='WARD RESTORED'; }
            } else if (f.type === 'relic') { f.active=false; result.xp=5; result.message='ANCIENT SHARD'; result.color='#bda7ff'; }
            else if (f.type === 'crystal') {
                f.active=false;
                for (const enemy of enemies) { const d=Math.hypot(enemy.x-f.x,enemy.y-f.y); if(d<340) enemy.hp-=180*(1-d/500); }
                result.message='RUNIC BURST'; result.color='#ff806f';
            }
        }
        return result;
    }

    drawSky(ctx, player, canvas, boss) {
        ctx.save(); ctx.fillStyle=boss?'#160812':'#090714'; ctx.fillRect(0,0,canvas.width,canvas.height);
        for(const s of this.stars){ const x=((s.x-player.x*s.depth)%canvas.width+canvas.width)%canvas.width; const y=((s.y-player.y*s.depth)%canvas.height+canvas.height)%canvas.height; ctx.globalAlpha=.22+s.depth; ctx.fillStyle=boss?'#d57686':'#c9b7ff'; ctx.fillRect(Math.floor(x),Math.floor(y),s.size,s.size); }
        ctx.restore();
    }

    draw(ctx) {
        const time=performance.now()/700;
        for(const f of this.features){ if(!f.active) continue; const color=COLORS[f.type]; const radius=f.type==='corruption'?145:34; const pulse=1+Math.sin(time+f.pulse)*.08;
            ctx.save(); ctx.translate(f.x,f.y); ctx.scale(pulse,pulse); ctx.strokeStyle=color; ctx.fillStyle=`${color}18`; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(0,0,radius,0,Math.PI*2); ctx.fill(); ctx.stroke();
            if(f.type!=='corruption'){ ctx.rotate(Math.PI/4); ctx.strokeRect(-14,-14,28,28); ctx.rotate(-Math.PI/4); ctx.beginPath(); ctx.arc(0,0,6,0,Math.PI*2); ctx.fillStyle=color; ctx.fill(); }
            else for(let i=0;i<6;i++){ const a=i*Math.PI/3+time*.1; ctx.beginPath(); ctx.arc(Math.cos(a)*105,Math.sin(a)*105,4,0,Math.PI*2); ctx.fillStyle=color; ctx.fill(); }
            ctx.restore();
        }
    }
}
