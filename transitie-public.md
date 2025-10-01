# Transitie Public Documentatie

## Status: Voltooid ✅

Migratie van legacy documentatie content naar Nextra 3.0.3 format.

## Source Directory
`backups/docs_backup_20250906_041747/docs/content/docs/public/`

## Content Inventarisatie

### Hoofdsecties
- `bezoekers.mdx` - Bezoekersinfo
- `contact.mdx` - Contactgegevens  
- `diensten.mdx` - Onze diensten
- `klanten.mdx` - Klantinformatie
- `sna-keurmerk.mdx` - SNA Keurmerk info

### Branding (`branding/`)
- `beeldmerk.mdx` - Beeldmerk richtlijnen
- `downloads.mdx` - Download materialen
- `index.mdx` - Branding overzicht
- `kleuren.mdx` - Kleurpalet
- `logo.mdx` - Logo richtlijnen
- `meta.json` - Navigatie metadata

### Cultuur (`cultuur/`)  
- `community-days.mdx` - Community Days info
- `index.mdx` - Cultuur overzicht
- `informatieorganisatie.mdx` - Info organisatie
- `meta.json` - Navigatie metadata
- `werkmethode.mdx` - Werkmethode beschrijving

### Kantoor (`kantoor/`)
- `amsterdam.mdx` - Amsterdam kantoor
- `faciliteiten.mdx` - Kantoor faciliteiten
- `gebruik.mdx` - Kantoorgebruik
- `index.mdx` - Kantoor overzicht
- `klarenbeek.mdx` - Klarenbeek locatie
- `meta.json` - Navigatie metadata
- `productief-werken.mdx` - Productief werken tips
- `vergaderruimtes.mdx` - Vergaderruimte info

### Kennismaking (`kennismaking/`)
- `budgetten.mdx` - Budget informatie
- `engineer-hub.mdx` - Engineer Hub info
- `index.mdx` - Kennismaking overzicht
- `meta.json` - Navigatie metadata
- `projecten.mdx` - Projecten informatie
- `voorwaarden.mdx` - Voorwaarden

### Over Kroescontrol (`over-kroescontrol/`)
- `bedrijfsgegevens.mdx` - Bedrijfsgegevens
- `index.mdx` - Over ons overzicht
- `meta.json` - Navigatie metadata
- `ons-verhaal.mdx` - Ons verhaal
- `team.mdx` - Team informatie
- `visie.mdx` - Bedrijfsvisie
- `wat-we-doen.mdx` - Wat we doen

### Werken Bij (`werken-bij/`)
- `bedrijfscultuur.mdx` - Bedrijfscultuur
- `index.mdx` - Werken bij overzicht
- `meta.json` - Navigatie metadata  
- `pensioenregelingen.mdx` - Pensioeninfo
- `vacatures.mdx` - Vacatures
- `voordelen.mdx` - Arbeidsvoordelen
- `voorzieningen.mdx` - Voorzieningen

## Migratie Plan

1. ✅ Demo content verwijderen uit huidige docs-public
2. ✅ Content kopiëren uit backup directory  
3. ✅ Fumadocs MDX naar Nextra MDX converteren
4. ✅ meta.json bestanden naar _meta.ts converteren
5. ✅ Navigatie structuur aanpassen
6. ⏳ Assets en afbeeldingen overzetten (indien nodig)
7. ⏳ Links en referenties updaten (indien nodig)
8. ⏳ Nextra specifieke features implementeren (indien gewenst)

## Totaal Bestanden
- **47 MDX files** te migreren
- **7 meta.json** files te converteren naar _meta.ts
- **Assets** in public directory te controleren

## Aandachtspunten
- Fumadocs syntax verschilt van Nextra
- Meta.json structuur moet naar TypeScript export
- Component imports kunnen verschillen
- Asset paths moeten aangepast worden