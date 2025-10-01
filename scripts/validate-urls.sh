#!/bin/bash
# Enhanced URL Validator voor docs instances
# - Scant alle URLs
# - Valideert interne links (bestaan pages?)
# - Valideert public assets (bestaan files?)
# - Optioneel: check externe URLs (HTTP status)
# - AI-friendly JSON output met validatie status

set -euo pipefail

# Kleuren
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Config
PAGES_DIR="pages"
PUBLIC_DIR="public"
CHECK_EXTERNAL="${CHECK_EXTERNAL:-false}"  # Set to 'true' to check external URLs
OUTPUT_FILE="${1:-/tmp/docs-url-validation.json}"
BASE_URL="${BASE_URL:-http://localhost:3010}"

echo -e "${BLUE}🔍 Validating URLs in documentation...${NC}" >&2

# Tijdelijke bestanden
SCAN_RESULTS=$(mktemp)
VALIDATION_RESULTS=$(mktemp)

cleanup() {
    rm -f "$SCAN_RESULTS" "$VALIDATION_RESULTS"
}
trap cleanup EXIT

# Stap 1: Scan alle URLs
echo -e "${YELLOW}📊 Step 1: Scanning URLs...${NC}" >&2

EXTERNAL_URLS=$(mktemp)
INTERNAL_URLS=$(mktemp)
PUBLIC_URLS=$(mktemp)

# Scan markdown externe URLs
grep -rh '\[.*\](http' "$PAGES_DIR" --include="*.mdx" --include="*.tsx" 2>/dev/null | \
    grep -oE 'https?://[^)]+' | sort | uniq > "$EXTERNAL_URLS" || true

# Scan static assets FIRST (PDFs, images, etc. from public/ dir served at root)
# After flatten: public/file.pdf is served at /file.pdf
grep -rh '\[.*\](/' "$PAGES_DIR" --include="*.mdx" --include="*.tsx" 2>/dev/null | \
    grep -oE '\(/[^)]+\.(pdf|png|jpg|jpeg|svg|json|txt)\)' | tr -d '()' | sort | uniq > "$PUBLIC_URLS" || true

# Scan markdown interne page links (exclude file extensions and /public/)
grep -rh '\[.*\](/' "$PAGES_DIR" --include="*.mdx" 2>/dev/null | \
    grep -oE '\(/[^)]+\)' | tr -d '()' | \
    grep -v '^/public/' | \
    grep -vE '\.(pdf|png|jpg|jpeg|svg|json|txt)$' | \
    sort | uniq > "$INTERNAL_URLS" || true

# Tel counts
EXTERNAL_COUNT=$(wc -l < "$EXTERNAL_URLS" | tr -d ' ')
INTERNAL_COUNT=$(wc -l < "$INTERNAL_URLS" | tr -d ' ')
PUBLIC_COUNT=$(wc -l < "$PUBLIC_URLS" | tr -d ' ')

echo -e "${YELLOW}  Found: $EXTERNAL_COUNT external, $INTERNAL_COUNT internal, $PUBLIC_COUNT public assets${NC}" >&2

# Stap 2: Valideer interne page links
echo -e "${YELLOW}📝 Step 2: Validating internal page links...${NC}" >&2

INTERNAL_VALID=0
INTERNAL_INVALID=0
INTERNAL_VALIDATION="["

FIRST=true
while IFS= read -r url; do
    [ -z "$url" ] && continue

    # Strip hash anchors
    page_path="${url%%#*}"

    # Check of page bestaat
    # Nextra patterns: /path → pages/path.mdx of pages/path/index.mdx
    page_file=""
    status="unknown"
    message=""

    if [ "$page_path" = "/" ]; then
        # Root index
        if [ -f "$PAGES_DIR/index.mdx" ] || [ -f "$PAGES_DIR/index.tsx" ]; then
            status="valid"
            ((INTERNAL_VALID++))
        else
            status="invalid"
            message="Root index not found"
            ((INTERNAL_INVALID++))
        fi
    else
        # Remove leading slash
        clean_path="${page_path#/}"

        # Check verschillende mogelijkheden
        if [ -f "$PAGES_DIR/${clean_path}.mdx" ]; then
            status="valid"
            page_file="${clean_path}.mdx"
            ((INTERNAL_VALID++))
        elif [ -f "$PAGES_DIR/${clean_path}.tsx" ]; then
            status="valid"
            page_file="${clean_path}.tsx"
            ((INTERNAL_VALID++))
        elif [ -f "$PAGES_DIR/${clean_path}/index.mdx" ]; then
            status="valid"
            page_file="${clean_path}/index.mdx"
            ((INTERNAL_VALID++))
        elif [ -f "$PAGES_DIR/${clean_path}/index.tsx" ]; then
            status="valid"
            page_file="${clean_path}/index.tsx"
            ((INTERNAL_VALID++))
        else
            status="invalid"
            message="Page file not found (tried: ${clean_path}.mdx, ${clean_path}/index.mdx, etc.)"
            ((INTERNAL_INVALID++))
        fi
    fi

    # Build JSON entry
    if [ "$FIRST" = true ]; then
        FIRST=false
    else
        INTERNAL_VALIDATION+=","
    fi

    INTERNAL_VALIDATION+="
    {
      \"url\": \"$url\",
      \"status\": \"$status\",
      \"page_file\": \"$page_file\",
      \"message\": \"$message\"
    }"

done < "$INTERNAL_URLS"

INTERNAL_VALIDATION+="
  ]"

echo -e "${GREEN}  ✓ Valid: $INTERNAL_VALID${NC} ${RED}✗ Invalid: $INTERNAL_INVALID${NC}" >&2

# Stap 3: Valideer public assets
echo -e "${YELLOW}📁 Step 3: Validating public assets...${NC}" >&2

PUBLIC_VALID=0
PUBLIC_INVALID=0
PUBLIC_VALIDATION="["

FIRST=true
while IFS= read -r url; do
    [ -z "$url" ] && continue

    # Convert URL to file path
    # Note: Nextra serves public/ dir as static root
    # After flatten: URL /file.pdf -> filesystem public/file.pdf
    file_path="${url#/}"
    full_path="$PUBLIC_DIR/$file_path"

    status="unknown"
    message=""

    if [ -f "$full_path" ]; then
        status="valid"
        file_size=$(stat -f%z "$full_path" 2>/dev/null || echo "0")
        ((PUBLIC_VALID++))
    else
        status="invalid"
        message="File not found: $full_path"
        file_size="0"
        ((PUBLIC_INVALID++))
    fi

    if [ "$FIRST" = true ]; then
        FIRST=false
    else
        PUBLIC_VALIDATION+=","
    fi

    PUBLIC_VALIDATION+="
    {
      \"url\": \"$url\",
      \"status\": \"$status\",
      \"file_path\": \"$full_path\",
      \"file_size\": \"$file_size\",
      \"message\": \"$message\"
    }"

done < "$PUBLIC_URLS"

PUBLIC_VALIDATION+="
  ]"

echo -e "${GREEN}  ✓ Valid: $PUBLIC_VALID${NC} ${RED}✗ Invalid: $PUBLIC_INVALID${NC}" >&2

# Stap 4: Optioneel - Check externe URLs
echo -e "${YELLOW}🌐 Step 4: Checking external URLs...${NC}" >&2

EXTERNAL_VALIDATION="["
EXTERNAL_VALID=0
EXTERNAL_INVALID=0
EXTERNAL_SKIPPED=0

if [ "$CHECK_EXTERNAL" = "true" ]; then
    echo -e "${BLUE}  Checking external URLs (this may take a while)...${NC}" >&2

    FIRST=true
    while IFS= read -r url; do
        [ -z "$url" ] && continue

        # Check HTTP status met curl
        http_status=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 --max-time 10 "$url" 2>/dev/null || echo "000")

        status="unknown"
        message=""

        if [ "$http_status" = "200" ] || [ "$http_status" = "301" ] || [ "$http_status" = "302" ]; then
            status="valid"
            ((EXTERNAL_VALID++))
        elif [ "$http_status" = "000" ]; then
            status="error"
            message="Connection failed or timeout"
            ((EXTERNAL_INVALID++))
        else
            status="invalid"
            message="HTTP $http_status"
            ((EXTERNAL_INVALID++))
        fi

        if [ "$FIRST" = true ]; then
            FIRST=false
        else
            EXTERNAL_VALIDATION+=","
        fi

        EXTERNAL_VALIDATION+="
    {
      \"url\": \"$url\",
      \"status\": \"$status\",
      \"http_status\": \"$http_status\",
      \"message\": \"$message\"
    }"

    done < "$EXTERNAL_URLS"

    echo -e "${GREEN}  ✓ Valid: $EXTERNAL_VALID${NC} ${RED}✗ Invalid: $EXTERNAL_INVALID${NC}" >&2
else
    echo -e "${YELLOW}  Skipped (set CHECK_EXTERNAL=true to enable)${NC}" >&2
    EXTERNAL_SKIPPED=$EXTERNAL_COUNT

    # Voeg alleen URLs toe zonder validatie
    FIRST=true
    while IFS= read -r url; do
        [ -z "$url" ] && continue

        if [ "$FIRST" = true ]; then
            FIRST=false
        else
            EXTERNAL_VALIDATION+=","
        fi

        EXTERNAL_VALIDATION+="
    {
      \"url\": \"$url\",
      \"status\": \"skipped\",
      \"message\": \"External URL checking disabled\"
    }"

    done < "$EXTERNAL_URLS"
fi

EXTERNAL_VALIDATION+="
  ]"

# Genereer finale JSON output
cat > "$OUTPUT_FILE" << EOF
{
  "scan_date": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "base_url": "$BASE_URL",
  "external_check_enabled": $CHECK_EXTERNAL,
  "summary": {
    "total_urls": $((EXTERNAL_COUNT + INTERNAL_COUNT + PUBLIC_COUNT)),
    "external": {
      "total": $EXTERNAL_COUNT,
      "valid": $EXTERNAL_VALID,
      "invalid": $EXTERNAL_INVALID,
      "skipped": $EXTERNAL_SKIPPED
    },
    "internal": {
      "total": $INTERNAL_COUNT,
      "valid": $INTERNAL_VALID,
      "invalid": $INTERNAL_INVALID
    },
    "public_assets": {
      "total": $PUBLIC_COUNT,
      "valid": $PUBLIC_VALID,
      "invalid": $PUBLIC_INVALID
    }
  },
  "validation": {
    "internal_pages": $INTERNAL_VALIDATION,
    "public_assets": $PUBLIC_VALIDATION,
    "external_urls": $EXTERNAL_VALIDATION
  }
}
EOF

# Summary output
echo "" >&2
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}" >&2
echo -e "${GREEN}✅ Validation Complete!${NC}" >&2
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}" >&2
echo -e "📊 ${YELLOW}Summary:${NC}" >&2
echo -e "  Internal Pages: ${GREEN}$INTERNAL_VALID valid${NC} / ${RED}$INTERNAL_INVALID invalid${NC} / $INTERNAL_COUNT total" >&2
echo -e "  Public Assets:  ${GREEN}$PUBLIC_VALID valid${NC} / ${RED}$PUBLIC_INVALID invalid${NC} / $PUBLIC_COUNT total" >&2
echo -e "  External URLs:  ${GREEN}$EXTERNAL_VALID valid${NC} / ${RED}$EXTERNAL_INVALID invalid${NC} / ${YELLOW}$EXTERNAL_SKIPPED skipped${NC} / $EXTERNAL_COUNT total" >&2
echo -e "" >&2
echo -e "📁 ${GREEN}Results saved to:${NC} $OUTPUT_FILE" >&2
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}" >&2

# Output JSON path voor verder processing
echo "$OUTPUT_FILE"
