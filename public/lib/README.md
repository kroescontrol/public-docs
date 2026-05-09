# Self-hosted libraries

Externe libraries die het visualization-pattern gebruikt. Self-hosted op `docs.kroescontrol.nl/lib/` zodat HTML-visualisaties (modus 2/3) onafhankelijk zijn van externe CDN's.

## Bestanden

| File | Versie | Bron | Grootte |
|------|--------|------|---------|
| `mermaid.min.js` | mermaid 11.x (UMD bundle) | `https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js` | ~3MB raw, ~700KB gzipped |

## Updaten

```bash
curl -sL -o public/lib/mermaid.min.js \
  "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"
```

Test daarna één bestaande visualisatie in browser. Major versie-bump (v11 → v12): controleer of `themeVariables` syntax nog klopt.

## Gebruik

```html
<script src="https://docs.kroescontrol.nl/lib/mermaid.min.js"></script>
<script>
  mermaid.initialize({ startOnLoad: true, theme: 'base', themeVariables: { ... } });
</script>
```

Pattern-doc: `workspace/baseline/patterns/visualization.md`.
