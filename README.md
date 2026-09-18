# Neon Survivor: Shapewalker

Roguelite de sobrevivência feito com Canvas e JavaScript, inspirado no ritmo de jogos como *Vampire Survivors*.

## Executar localmente

Como o projeto usa módulos JavaScript, abra-o por um servidor local (não diretamente por `file://`):

```bash
python -m http.server 8080
```

Depois acesse `http://localhost:8080`.

## Como adicionar assets de personagens

Crie `image/characters/` e adicione PNGs quadrados com fundo transparente:

- `player-triangle.png`, `player-circle.png`, `player-square.png`
- `enemy-triangle.png`, `enemy-circle.png`, `enemy-square.png`, `enemy-hexagon.png`

Tamanho recomendado: 256×256 px, personagem centralizado e com margem transparente de aproximadamente 10%. O jogo carrega esses nomes automaticamente. Se um arquivo não existir, a forma neon original continua sendo desenhada como fallback.

Para trocar nomes ou caminhos, edite o manifesto `js/assets.js`.

## Caminho para Steam e ranking

- Empacotamento desktop: Electron ou Tauri; Tauri tende a gerar builds menores.
- Integração Steam: Steamworks SDK por uma camada compatível com o empacotador escolhido.
- Ranking global: prefira Steam Leaderboards na versão Steam. Para ranking também disponível na web, use um backend próprio (por exemplo, Supabase/PostgreSQL) com validação de partidas no servidor.
- Nunca aceite apenas uma pontuação enviada pelo navegador: isso torna o ranking trivial de adulterar.
