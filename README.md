# Neon Survivor: Shapewalker

Roguelite de sobrevivência feito com Canvas e JavaScript, inspirado no ritmo de jogos como *Vampire Survivors*.

## Executar localmente

Como o projeto usa módulos JavaScript, abra-o por um servidor local:

```bash
python -m http.server 8080
```

Depois acesse `http://localhost:8080`.

## Assets pixel art

Os sprites ficam em `assets/` e são ligados ao jogo pelo manifesto `js/assets.js`.

- Players: `triangle_player.png`, `circle_player.png`, `square_player.png`.
- Inimigos: `triangle_enemy.png`, `circle_enemy.png`, `square_enemy.png`.
- Bosses: `triangle_boss.png`, `circle_boss.png`, `square_boss.png`, `hexagon_boss.png`.
- Projéteis: arquivos `boss_shot_*.png`.
- Efeitos: aura, explosões e aviso de boss.

O Canvas usa `imageSmoothingEnabled = false` para preservar os pixels. Se algum asset falhar, as formas neon continuam funcionando como fallback.

## Caminho para Steam e ranking

- Empacotamento desktop: Electron ou Tauri; Tauri tende a gerar builds menores.
- Integração Steam: Steamworks SDK por uma camada compatível.
- Ranking global: Steam Leaderboards na Steam ou backend próprio para compartilhar ranking com a web.
- A pontuação deve ser validada para dificultar adulterações enviadas pelo navegador.
