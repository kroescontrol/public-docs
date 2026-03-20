# Public Docs — Claude Instructies

## Stack

- Next.js 14 (Pages Router) + Nextra 3
- Geen auth (publiek toegankelijk)
- Node 20

## Deploy

- **Hosting:** Vercel
- **URL:** https://docs.kroescontrol.nl
- **Trigger:** Push naar `main` → Vercel Git integration (auto deploy, geen GitHub Actions)
- **Build:** `npm run build` (zie `vercel.json`)
- **Region:** fra1
- **Check deploy status:** `curl -sI https://docs.kroescontrol.nl | grep x-vercel`
- **Check welke commit live is:** `gh api repos/kroescontrol/public-docs/deployments --jq '.[0:3] | .[] | "\(.created_at) \(.environment) \(.sha[0:7])"'`

## Conventies

- `_meta.ts` voor Nextra sidebar navigatie
- Content in `pages/`
