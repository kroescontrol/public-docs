# Self-hosted libraries

Externe libraries die het visualization-pattern gebruikt. Self-hosted op `docs.kroescontrol.nl/lib/` zodat HTML-visualisaties (modus 2/3) onafhankelijk zijn van externe CDN's.

## Bestanden

| File | Versie | Bron | Grootte |
|------|--------|------|---------|
| `mermaid.min.js` | mermaid 11.x (UMD bundle) | `https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js` | ~3MB raw, ~700KB gzipped |
| `lucide.min.js` | lucide 0.469.0 (UMD bundle) | `https://cdn.jsdelivr.net/npm/lucide@0.469.0/dist/umd/lucide.min.js` | ~350KB raw, ~100KB gzipped |

## Updaten

```bash
# Mermaid (latest 11.x)
curl -sL -o public/lib/mermaid.min.js \
  "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"

# Lucide (gepinde versie — bump bewust)
curl -sL -o public/lib/lucide.min.js \
  "https://cdn.jsdelivr.net/npm/lucide@0.469.0/dist/umd/lucide.min.js"
```

Test daarna één bestaande visualisatie in browser. Major versie-bump: controleer breaking changes in changelog.

## Gebruik

```html
<script src="https://docs.kroescontrol.nl/lib/mermaid.min.js"></script>
<script src="https://docs.kroescontrol.nl/lib/lucide.min.js"></script>
<script>
  if (window.mermaid) mermaid.initialize({ startOnLoad: false, theme: 'base', themeVariables: { /* ... */ } });
  if (window.lucide) lucide.createIcons();
</script>
```

Lucide-iconen via `<i data-lucide="rocket"></i>` markup. Lijst van beschikbare iconen: <https://lucide.dev/icons>.

Pattern-doc: `workspace/baseline/patterns/visualization.md`.
