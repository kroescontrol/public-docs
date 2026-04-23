# AGENTS.md — docs/public

> Review-regels voor Codex (lokale T2 + GitHub cloud PR-reviews).
> Werkinstructies voor AI-agents staan in [CLAUDE.md](CLAUDE.md).

## Scope / wanneer actief

**Actief op:** `content/`, `pages/`, SEO-meta, OG-images, public-facing claims.

**PASS zonder inhoudelijke check:** alleen deploy-config of generated assets gewijzigd.

## Harde regels (FAIL)

1. **Onwaarheden of niet-onderbouwde claims** — "we zijn de beste", "100% veilig", specifieke percentages of rankings zonder bron.
2. **Klantnamen / logo's zonder toestemming** — referenties naar specifieke klanten vereisen goedkeuring; niet zomaar toevoegen.
3. **Harde financiële of prestatie-garanties** — "gegarandeerd X% korting", "100% uptime", "altijd binnen Y uur". Zachte formulering ("we garanderen bereikbaarheid tijdens kantooruren") is OK.
4. **Interne terminologie lekt** — codenamen, sprint-nummers, interne projectnamen. Detecteer met `rg -i 'prd[0-9]{3}|task[0-9]{3}|sprint[0-9]|\bP[0-9]\b|hub-p[0-9]'` in nieuwe content.

## Aandacht (MAJOR / MINOR)

- **Tone-of-voice-afwijking** van kroescontrol-stijl (bv. te stoer, te zakelijk, of juist te plat) — MAJOR
- **Cultuur-/waarden-claims** zonder concreet voorbeeld — MINOR
- **SEO: ontbrekende meta-description / H1-dupes** — MINOR
- **OG-image ontbreekt** op nieuwe pagina — MINOR

## Known tradeoffs — SKIP

- Korte/scherpe formulering (past bij kroescontrol-toon) — OK
- Nederlandse spelling-keuzes (compromis-vormen) — OK
- Markdown-stijl variaties — OK

## Niet flaggen

- "Twee kantoren" / "X medewerkers" / "sinds YYYY" — feitelijke statements zolang accuraat
- Hoofdletter-stijl bij productnamen (tenzij echt fout)
- Brand-voice kleuren/emoji-gebruik (past bij doelgroep)
