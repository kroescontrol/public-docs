# Self-hosted fonts

Web fonts voor het visualization-pattern, gehost op `docs.kroescontrol.nl/fonts/` zodat HTML-visualisaties geen Google Fonts CDN nodig hebben.

## Families

| Family | Weights | Charsets | Gebruik |
|--------|---------|----------|---------|
| Poppins | 400, 600, 700 | latin, latin-ext | Headings (`--kc-font-heading`) |
| Noto Sans | 400, 500, 700 | latin, latin-ext | Body (`--kc-font-body`) |
| Fira Code | 400, 500 | latin, latin-ext | Code/paths (`--kc-font-mono`) |

Alleen latin + latin-ext om bestandsgrootte te beperken (Dutch + Western European). Voor andere scripts (cyrillic, greek, vietnamese) opnieuw downloaden uit Google Fonts CSS.

## Gebruik

```html
<link rel="stylesheet" href="https://docs.kroescontrol.nl/visualization-fonts.css">
<style>
  body { font-family: 'Noto Sans', system-ui, sans-serif; }
</style>
```

De `visualization-fonts.css` (root van `public/`) bevat alle `@font-face` declaraties met paden naar `/fonts/*.woff2`.

## Updaten

```bash
# 1. Fetch latest Google Fonts CSS
curl -sL -A "Mozilla/5.0 (modern browser UA)" \
  "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Noto+Sans:wght@400;500;700&family=Fira+Code:wght@400;500&display=swap" \
  -o /tmp/google-fonts.css

# 2. Parse latin + latin-ext blocks, download woff2, rewrite paths
#    (zie initial commit voor het python-script)
```

Pattern-doc: `workspace/baseline/patterns/visualization.md`.
