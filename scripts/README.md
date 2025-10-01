# Docs URL Validation Scripts

## validate-urls.sh - Smart URL Validator

Enhanced URL validation script dat **automatisch alle links valideert** in je documentatie.

### Features

✅ **Interne Page Links** - Checkt of pages echt bestaan
✅ **Public Assets** - Verifieert dat PDFs/images aanwezig zijn
✅ **Externe URLs** - Optioneel: HTTP status checks
✅ **AI-Friendly JSON** - Gestructureerde output voor verder processing
✅ **Color-coded Output** - Directe visuele feedback

### Usage

```bash
# Basic validatie (snel)
./scripts/validate-urls.sh

# Met externe URL checking (langzamer)
CHECK_EXTERNAL=true ./scripts/validate-urls.sh

# Custom output locatie
./scripts/validate-urls.sh /tmp/my-validation.json

# Met custom base URL voor dev testing
BASE_URL=http://localhost:3010 ./scripts/validate-urls.sh
```

### Output Format

Het script genereert JSON met:

```json
{
  "scan_date": "2025-10-01T20:30:00Z",
  "summary": {
    "total_urls": 58,
    "external": { "total": 13, "valid": 0, "invalid": 0, "skipped": 13 },
    "internal": { "total": 18, "valid": 16, "invalid": 2 },
    "public_assets": { "total": 27, "valid": 25, "invalid": 2 }
  },
  "validation": {
    "internal_pages": [
      {
        "url": "/over-kroescontrol",
        "status": "valid",
        "page_file": "over-kroescontrol/index.mdx"
      },
      {
        "url": "/fake-page",
        "status": "invalid",
        "message": "Page file not found"
      }
    ],
    "public_assets": [
      {
        "url": "/public/branding/logo.svg",
        "status": "valid",
        "file_path": "public/branding/logo.svg",
        "file_size": "12345"
      }
    ],
    "external_urls": [
      {
        "url": "https://github.com/kroescontrol",
        "status": "skipped",
        "message": "External URL checking disabled"
      }
    ]
  }
}
```

### Validation Logic

**Interne Pages:**
- Checks: `pages/{path}.mdx`, `pages/{path}.tsx`, `pages/{path}/index.mdx`
- Supports hash anchors (bijv. `/page#section`)
- Root index (`/`) special case

**Public Assets:**
- Checks `public/{path}` file existence
- Reports file size
- Validates PDFs, images, etc.

**Externe URLs:**
- Optioneel (set `CHECK_EXTERNAL=true`)
- Curl-based HTTP status check
- 5s connect timeout, 10s max timeout
- Accepts 200, 301, 302 as valid

### AI Integration

Output is **optimaal voor Claude Code** om te parsen:

```bash
# Run validatie
OUTPUT=$(./scripts/validate-urls.sh)

# Parse met jq
jq '.validation.internal_pages[] | select(.status == "invalid")' "$OUTPUT"

# Claude kan direct JSON lezen voor advies
```

### Common Issues

**Problem:** All public assets invalid
**Cause:** Wrong public directory path
**Fix:** Check `PUBLIC_DIR` in script matches your setup

**Problem:** Internal pages not found
**Cause:** Pages may have moved or renamed
**Fix:** Review invalid URLs in JSON output

**Problem:** External checks timeout
**Cause:** Slow network or unavailable sites
**Fix:** Normal - sommige sites blokkeren automated requests

### Workflow

1. **Na link changes:**
   ```bash
   ./scripts/validate-urls.sh
   ```

2. **Check output voor errors:**
   ```bash
   cat /tmp/docs-url-validation.json | jq '.summary'
   ```

3. **Fix invalid links**

4. **Re-validate:**
   ```bash
   ./scripts/validate-urls.sh
   ```

5. **Commit wanneer alles valid**

### Performance

- **Fast mode** (zonder externe checks): ~1-2 seconden
- **Full mode** (met externe checks): ~10-30 seconden afhankelijk van aantal URLs
- JSON output: <100KB voor typische docs site

---

**Tip:** Run dit script in CI/CD om broken links automatisch te detecteren!
