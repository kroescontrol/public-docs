#!/bin/bash
# URL Scanner voor docs-public
# Scant alle URLs in MDX/TSX files en output als JSON

set -euo pipefail

# Kleuren voor output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PAGES_DIR="pages"
OUTPUT_FILE="${1:-/tmp/docs-public-urls.json}"

echo -e "${GREEN}🔍 Scanning URLs in docs-public...${NC}" >&2

# Tijdelijke bestanden
EXTERNAL_URLS=$(mktemp)
INTERNAL_URLS=$(mktemp)
PUBLIC_URLS=$(mktemp)
EMAIL_URLS=$(mktemp)
HREF_ATTRS=$(mktemp)
MD_EXTERNAL=$(mktemp)
MD_INTERNAL=$(mktemp)
MD_PUBLIC=$(mktemp)

# Cleanup functie
cleanup() {
    rm -f "$EXTERNAL_URLS" "$INTERNAL_URLS" "$PUBLIC_URLS" "$EMAIL_URLS" "$HREF_ATTRS" \
          "$MD_EXTERNAL" "$MD_INTERNAL" "$MD_PUBLIC"
}
trap cleanup EXIT

# Scan markdown-style externe URLs [text](http...)
grep -rh '\[.*\](http' "$PAGES_DIR" --include="*.mdx" --include="*.tsx" 2>/dev/null | \
    grep -oE '\[([^\]]+)\]\((https?://[^)]+)\)' | sort | uniq > "$MD_EXTERNAL" || true

# Extract alleen URLs uit markdown externe links
grep -oE 'https?://[^)]+' "$MD_EXTERNAL" | sort | uniq > "$EXTERNAL_URLS" || true

# Scan markdown-style interne links [text](/path)
grep -rh '\[.*\](/[^p]' "$PAGES_DIR" --include="*.mdx" 2>/dev/null | \
    grep -oE '\[([^\]]+)\]\((/[^)]+)\)' | sort | uniq > "$MD_INTERNAL" || true

# Extract alleen URLs uit markdown interne links
grep -oE '\(/[^)]+\)' "$MD_INTERNAL" | tr -d '()' | sort | uniq > "$INTERNAL_URLS" || true

# Scan markdown-style /public/ links
grep -rh '\[.*\](/public/' "$PAGES_DIR" --include="*.mdx" --include="*.tsx" 2>/dev/null | \
    grep -oE '\[([^\]]+)\]\((/public/[^)]+)\)' | sort | uniq > "$MD_PUBLIC" || true

# Extract alleen URLs uit markdown public links
grep -oE '\(/public/[^)]+\)' "$MD_PUBLIC" | tr -d '()' | sort | uniq > "$PUBLIC_URLS" || true

# Scan email links
grep -rh '\[.*\](mailto:' "$PAGES_DIR" --include="*.mdx" 2>/dev/null | \
    grep -oE 'mailto:[^)]+' | sort | uniq > "$EMAIL_URLS" || true

# Scan href attributen (HTML-style)
grep -rh 'href=' "$PAGES_DIR" --include="*.mdx" --include="*.tsx" 2>/dev/null | \
    grep -oE "href=['\"]([^'\"]+)['\"]" | sed -E "s/href=['\"]([^'\"]+)['\"]/\1/" | \
    sort | uniq > "$HREF_ATTRS" || true

# Tel aantallen
EXTERNAL_COUNT=$(wc -l < "$EXTERNAL_URLS" | tr -d ' ')
INTERNAL_COUNT=$(wc -l < "$INTERNAL_URLS" | tr -d ' ')
PUBLIC_COUNT=$(wc -l < "$PUBLIC_URLS" | tr -d ' ')
EMAIL_COUNT=$(wc -l < "$EMAIL_URLS" | tr -d ' ')
HREF_COUNT=$(wc -l < "$HREF_ATTRS" | tr -d ' ')
MD_EXTERNAL_COUNT=$(wc -l < "$MD_EXTERNAL" | tr -d ' ')
MD_INTERNAL_COUNT=$(wc -l < "$MD_INTERNAL" | tr -d ' ')
MD_PUBLIC_COUNT=$(wc -l < "$MD_PUBLIC" | tr -d ' ')
TOTAL_COUNT=$((EXTERNAL_COUNT + INTERNAL_COUNT + PUBLIC_COUNT + EMAIL_COUNT + HREF_COUNT))

echo -e "${YELLOW}📊 Found $TOTAL_COUNT URLs${NC}" >&2

# Genereer JSON output
cat > "$OUTPUT_FILE" << EOF
{
  "scan_date": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "total_urls": $TOTAL_COUNT,
  "categories": {
    "external": {
      "count": $EXTERNAL_COUNT,
      "urls": [
EOF

# External URLs
FIRST=true
while IFS= read -r url; do
    [ -z "$url" ] && continue
    if [ "$FIRST" = true ]; then
        FIRST=false
    else
        echo "," >> "$OUTPUT_FILE"
    fi
    echo -n "        \"$url\"" >> "$OUTPUT_FILE"
done < "$EXTERNAL_URLS"

cat >> "$OUTPUT_FILE" << EOF

      ]
    },
    "internal": {
      "count": $INTERNAL_COUNT,
      "urls": [
EOF

# Internal URLs
FIRST=true
while IFS= read -r url; do
    [ -z "$url" ] && continue
    if [ "$FIRST" = true ]; then
        FIRST=false
    else
        echo "," >> "$OUTPUT_FILE"
    fi
    echo -n "        \"$url\"" >> "$OUTPUT_FILE"
done < "$INTERNAL_URLS"

cat >> "$OUTPUT_FILE" << EOF

      ]
    },
    "public_assets": {
      "count": $PUBLIC_COUNT,
      "urls": [
EOF

# Public URLs
FIRST=true
while IFS= read -r url; do
    [ -z "$url" ] && continue
    if [ "$FIRST" = true ]; then
        FIRST=false
    else
        echo "," >> "$OUTPUT_FILE"
    fi
    echo -n "        \"$url\"" >> "$OUTPUT_FILE"
done < "$PUBLIC_URLS"

cat >> "$OUTPUT_FILE" << EOF

      ]
    },
    "emails": {
      "count": $EMAIL_COUNT,
      "urls": [
EOF

# Email URLs
FIRST=true
while IFS= read -r url; do
    [ -z "$url" ] && continue
    if [ "$FIRST" = true ]; then
        FIRST=false
    else
        echo "," >> "$OUTPUT_FILE"
    fi
    echo -n "        \"$url\"" >> "$OUTPUT_FILE"
done < "$EMAIL_URLS"

cat >> "$OUTPUT_FILE" << EOF

      ]
    },
    "href_attributes": {
      "count": $HREF_COUNT,
      "urls": [
EOF

# Href attributes
FIRST=true
while IFS= read -r url; do
    [ -z "$url" ] && continue
    if [ "$FIRST" = true ]; then
        FIRST=false
    else
        echo "," >> "$OUTPUT_FILE"
    fi
    echo -n "        \"$url\"" >> "$OUTPUT_FILE"
done < "$HREF_ATTRS"

cat >> "$OUTPUT_FILE" << EOF

      ]
    },
    "markdown_links": {
      "external": {
        "count": $MD_EXTERNAL_COUNT,
        "links": [
EOF

# Markdown external links
FIRST=true
while IFS= read -r line; do
    [ -z "$line" ] && continue
    if [ "$FIRST" = true ]; then
        FIRST=false
    else
        echo "," >> "$OUTPUT_FILE"
    fi
    # Extract text and URL from [text](url)
    text=$(echo "$line" | sed -E 's/\[([^\]]+)\].*/\1/')
    url=$(echo "$line" | sed -E 's/.*\(([^)]+)\)/\1/')
    echo -n "          {\"text\": \"$text\", \"url\": \"$url\"}" >> "$OUTPUT_FILE"
done < "$MD_EXTERNAL"

cat >> "$OUTPUT_FILE" << EOF

        ]
      },
      "internal": {
        "count": $MD_INTERNAL_COUNT,
        "links": [
EOF

# Markdown internal links
FIRST=true
while IFS= read -r line; do
    [ -z "$line" ] && continue
    if [ "$FIRST" = true ]; then
        FIRST=false
    else
        echo "," >> "$OUTPUT_FILE"
    fi
    text=$(echo "$line" | sed -E 's/\[([^\]]+)\].*/\1/')
    url=$(echo "$line" | sed -E 's/.*\(([^)]+)\)/\1/')
    echo -n "          {\"text\": \"$text\", \"url\": \"$url\"}" >> "$OUTPUT_FILE"
done < "$MD_INTERNAL"

cat >> "$OUTPUT_FILE" << EOF

        ]
      },
      "public": {
        "count": $MD_PUBLIC_COUNT,
        "links": [
EOF

# Markdown public links
FIRST=true
while IFS= read -r line; do
    [ -z "$line" ] && continue
    if [ "$FIRST" = true ]; then
        FIRST=false
    else
        echo "," >> "$OUTPUT_FILE"
    fi
    text=$(echo "$line" | sed -E 's/\[([^\]]+)\].*/\1/')
    url=$(echo "$line" | sed -E 's/.*\(([^)]+)\)/\1/')
    echo -n "          {\"text\": \"$text\", \"url\": \"$url\"}" >> "$OUTPUT_FILE"
done < "$MD_PUBLIC"

cat >> "$OUTPUT_FILE" << EOF

        ]
      }
    }
  }
}
EOF

echo -e "${GREEN}✅ JSON output saved to: $OUTPUT_FILE${NC}" >&2
echo -e "${YELLOW}📁 Quick stats:${NC}" >&2
echo -e "  External URLs: $EXTERNAL_COUNT (markdown: $MD_EXTERNAL_COUNT)" >&2
echo -e "  Internal URLs: $INTERNAL_COUNT (markdown: $MD_INTERNAL_COUNT)" >&2
echo -e "  Public Assets: $PUBLIC_COUNT (markdown: $MD_PUBLIC_COUNT)" >&2
echo -e "  Email Links: $EMAIL_COUNT" >&2
echo -e "  Href Attrs: $HREF_COUNT" >&2

# Output JSON path voor AI processing
echo "$OUTPUT_FILE"
