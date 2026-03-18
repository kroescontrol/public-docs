# Kroescontrol Public Docs

Publieke documentatie van [Kroescontrol](https://kroescontrol.nl) — te vinden op **[docs.kroescontrol.nl](https://docs.kroescontrol.nl)**.

## Wat staat hier?

Bedrijfsinformatie, juridische documenten, branding richtlijnen, cultuur en alles wat we openbaar delen met engineers, klanten en partners.

## Waarom op GitHub?

Transparantie is een kernwaarde. Door onze documentatie open-source te beheren:

- Is de volledige historie van wijzigingen zichtbaar
- Kunnen engineers die met ons werken direct bijdragen
- Is de bron altijd verifieerbaar

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

## Licentie

Content is eigendom van Kroescontrol B.V. De broncode van deze site valt onder de [MIT-licentie](https://opensource.org/licenses/MIT).
