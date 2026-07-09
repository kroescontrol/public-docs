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
5. **Niet-geautoriseerde persoonsgegevens (PII)** — telefoonnummers, e-mailadressen, namen of privé-data die NIET op de allowlist hieronder staan. De review checkt nieuwe/gewijzigde PII tegen de allowlist, niet of er PII is (bestaande geautoriseerde PII mag).
   Detecteer: `rg -oE '(\+31|06)[-0-9 ]{7,}|[a-z0-9._%+-]+@kroescontrol\.nl'` → elk treffer dat niet op de allowlist staat = FAIL.
6. **Feitelijkheid & oorsprong** — concrete claims (tools, productnamen, bedragen, beleid) die niet kloppen met de bron, het reglement of de actuele stack. Voorbeeld-fout: "Fumadocs"/"git-crypt" noemen terwijl de stack Nextra + Supabase is. Verouderde feiten zijn erger dan geen pagina.

### Allowlist — geautoriseerde publieke PII (Serge, 2026-06-10)

Deze mogen publiek, NIET flaggen:
- **Telefoon:** `06 3411 6494` (Serge, bewust als contactnummer)
- **Persoonlijke werkmail:** `s.kroes@kroescontrol.nl`, `patriek@kroescontrol.nl`
- **Functionele adressen:** `info@`, `abuse@`, `compliance@`, `sec@`, `secretariaat@`, `jobs@` (`@kroescontrol.nl`)
- **Bedrijfsgegevens** (`juridisch/bedrijfsgegevens.mdx`): IBAN's KC, KvK, BTW, RSIN, vestigingsadressen — wettelijk
- **Management-namen in bedrijfscontext:** Serge Kroes, Patriek Radewalt

**Wél flaggen (FAIL):** privé-telefoonnummers van ándere medewerkers, klant-contactpersonen, privé-(woon)adressen van personen, BSN/geboortedatum/salaris van individuen, of nieuwe persoonsnamen + contactdata buiten deze set zonder expliciete toestemming.

## Design-canon (KC, prd398)

De KC-design-canon (`workspace/baseline/patterns/kroescontrol-design.md` in de
workspace-meta-repo, skroes) is leidend voor tokens, kleuren, fonts en iconen.
`styles/kroescontrol-design-tokens.css` is hier een **lokale kopie** totdat het
`@kroescontrol/brand`-pakket bestaat (prd398 blok 9).

- **FAIL**: nieuwe kleuren, fonts of icon-sets die afwijken van de canon, of wijzigingen aan
  `kroescontrol-design-tokens.css` die niet uit de canon zijn overgenomen.
- **FAIL**: purple/violet/indigo als UI-kleur (canon DR1).

## Aandacht (MAJOR / MINOR)

- **Tone-of-voice-afwijking** van kroescontrol-stijl, getoetst aan `TONE-OF-VOICE-PUBLIC.md` (in `internal-docs`) — MAJOR. Specifiek:
  - **De LLM-pitch** — tekst die sfeert maar geen informatie draagt (enthousiaste afsluiters, knipoog-emoji, "who knows"/"vibe", grapjes die overal hadden kunnen staan). Pas de **schrap-test** toe: streep de energie weg — blijft er een feit over → OK; blijft er niets → MAJOR.
  - **Bestaansrecht/overlap** — pagina die > ~50% overlapt met een andere, of geen unieke lezersvraag beantwoordt (snoei-rubriek poort 1-2): MAJOR, voorstel samenvoegen→redirect.
- **Cultuur-/waarden-claims** zonder concreet voorbeeld — MINOR
- **SEO: ontbrekende meta-description / H1-dupes** — MINOR
- **OG-image ontbreekt** op nieuwe pagina — MINOR

## Opvolging van findings

Een review is pas af als de findings ergens landen:
- **FAIL** → blokkeert merge/publicatie; eerst fixen.
- **MAJOR** die niet direct gefixt wordt → noteren als opvolg-item (task in `docs-content-audit`, of `parkeerplaats.md` van het project) — niet stilzwijgend laten lopen.
- **MINOR** → fix-on-sight of verzamelen; geen blocker.
Vermeld in de review-output expliciet wáár elke niet-gefixte MAJOR naartoe gaat.

## Known tradeoffs — SKIP

- Korte/scherpe formulering (past bij kroescontrol-toon) — OK
- Nederlandse spelling-keuzes (compromis-vormen) — OK
- Markdown-stijl variaties — OK

## Niet flaggen

- "Twee kantoren" / "X medewerkers" / "sinds YYYY" — feitelijke statements zolang accuraat
- Hoofdletter-stijl bij productnamen (tenzij echt fout)
- Brand-voice kleuren/emoji-gebruik (past bij doelgroep)
