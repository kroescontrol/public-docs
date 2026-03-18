# Kroescontrol Public Docs

Publieke documentatie van Kroescontrol — te vinden op **[docs.kroescontrol.nl](https://docs.kroescontrol.nl)**.

## Wat staat hier?

Bedrijfsinformatie, juridische documenten, branding richtlijnen, cultuur en alles wat we openbaar delen met engineers, klanten en partners.

## Waarom op GitHub?

Publiek, transparant en verifieerbaar.

## Tech stack

- [Next.js](https://nextjs.org) + [Nextra 3](https://nextra.site) (MDX docs framework)
- [Tailwind CSS](https://tailwindcss.com) voor styling
- Gehost op [Vercel](https://vercel.com) (regio: Frankfurt)

## Lokaal draaien

```bash
pnpm install
pnpm dev        # → http://localhost:3013
```

## Structuur

```
pages/
├── juridisch/        # Voorwaarden, privacy, beleid
├── over-kroescontrol/# Bedrijfsinfo, team, visie
├── kennismaking/     # Info voor engineers
├── werken-bij/       # Vacatures, voordelen
├── branding/         # Logo, kleuren, richtlijnen
├── cultuur/          # Werkmethode, community
├── kantoor/          # Locaties en faciliteiten
└── en/legal/         # English legal pages
```