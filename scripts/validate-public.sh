#!/bin/bash
# Public Assets Usage Validator
# - Scant alle files in public/ directory
# - Telt hoevaak naar elk bestand wordt verwezen
# - Toont waar referenties vandaan komen
# - Identificeert vergeten/ongebruikte bestanden
# - AI-friendly JSON output

set -euo pipefail

# Kleuren
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Config
PAGES_DIR="pages"
PUBLIC_DIR="public"
OUTPUT_FILE="${1:-/tmp/docs-public-usage.json}"

# Files om te skippen (system/meta files)
SKIP_PATTERNS=(
    "favicon"
    "robots.txt"
    ".DS_Store"
    "manifest.json"
    "sw.js"
    "logo-icon-"
)

echo -e "${BLUE}🔍 Analyzing public assets usage...${NC}" >&2

# Check of directories bestaan
if [ ! -d "$PUBLIC_DIR" ]; then
    echo -e "${RED}Error: $PUBLIC_DIR directory not found${NC}" >&2
    exit 1
fi

if [ ! -d "$PAGES_DIR" ]; then
    echo -e "${RED}Error: $PAGES_DIR directory not found${NC}" >&2
    exit 1
fi

# Tijdelijke bestanden
ALL_FILES=$(mktemp)
SCAN_RESULTS=$(mktemp)

cleanup() {
    rm -f "$ALL_FILES" "$SCAN_RESULTS"
}
trap cleanup EXIT

# Stap 1: Vind alle files in public/
echo -e "${YELLOW}📁 Step 1: Finding all public assets...${NC}" >&2
find "$PUBLIC_DIR" -type f > "$ALL_FILES"

TOTAL_FILES=$(wc -l < "$ALL_FILES" | tr -d ' ')
echo -e "${CYAN}  Found $TOTAL_FILES files in $PUBLIC_DIR/${NC}" >&2

# Stap 2: Scan voor referenties
echo -e "${YELLOW}🔎 Step 2: Scanning for references in pages...${NC}" >&2

JSON_OUTPUT="{"
JSON_OUTPUT+="
  \"scan_date\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\",
  \"public_dir\": \"$PUBLIC_DIR\",
  \"pages_dir\": \"$PAGES_DIR\",
  \"summary\": {
    \"total_files\": $TOTAL_FILES,
    \"referenced\": 0,
    \"unreferenced\": 0,
    \"skipped\": 0
  },
  \"files\": ["

FIRST=true
REFERENCED_COUNT=0
UNREFERENCED_COUNT=0
SKIPPED_COUNT=0

while IFS= read -r filepath; do
    # Relatieve path vanaf public/
    relpath="${filepath#$PUBLIC_DIR/}"

    # Check of file geskipt moet worden
    should_skip=false
    for pattern in "${SKIP_PATTERNS[@]}"; do
        if [[ "$relpath" == *"$pattern"* ]]; then
            should_skip=true
            ((SKIPPED_COUNT++))
            break
        fi
    done

    if [ "$should_skip" = true ]; then
        continue
    fi

    # Zoek naar referenties (URL is /path zonder /public prefix na flatten)
    url_path="/$relpath"

    # Vind alle MDX files die naar dit bestand verwijzen
    references=()
    reference_count=0

    while IFS= read -r match; do
        # Extract filename from match (format: filepath:line:content)
        ref_file=$(echo "$match" | cut -d: -f1)
        ref_line=$(echo "$match" | cut -d: -f2)
        ref_context=$(echo "$match" | cut -d: -f3- | sed 's/^[[:space:]]*//' | cut -c1-100)

        references+=("{\"file\": \"$ref_file\", \"line\": $ref_line, \"context\": \"${ref_context//\"/\\\"}\"}")
        ((reference_count++))
    done < <(grep -rn "$url_path" "$PAGES_DIR" --include="*.mdx" --include="*.tsx" 2>/dev/null || true)

    # Bepaal status
    if [ $reference_count -eq 0 ]; then
        status="unreferenced"
        ((UNREFERENCED_COUNT++))
    else
        status="referenced"
        ((REFERENCED_COUNT++))
    fi

    # Bereken filesize
    filesize=$(stat -f%z "$filepath" 2>/dev/null || echo "0")
    filesize_human=$(ls -lh "$filepath" | awk '{print $5}')

    # Build JSON entry
    if [ "$FIRST" = true ]; then
        FIRST=false
    else
        JSON_OUTPUT+=","
    fi

    JSON_OUTPUT+="
    {
      \"path\": \"$relpath\",
      \"url\": \"$url_path\",
      \"status\": \"$status\",
      \"reference_count\": $reference_count,
      \"filesize\": $filesize,
      \"filesize_human\": \"$filesize_human\",
      \"references\": ["

    # Add references
    if [ ${#references[@]} -gt 0 ]; then
        ref_first=true
        for ref in "${references[@]}"; do
            if [ "$ref_first" = true ]; then
                ref_first=false
            else
                JSON_OUTPUT+=","
            fi
            JSON_OUTPUT+="
        $ref"
        done
    fi

    JSON_OUTPUT+="
      ]
    }"

done < "$ALL_FILES"

JSON_OUTPUT+="
  ]
}"

# Update summary counts
JSON_OUTPUT=$(echo "$JSON_OUTPUT" | jq \
    --arg ref "$REFERENCED_COUNT" \
    --arg unref "$UNREFERENCED_COUNT" \
    --arg skip "$SKIPPED_COUNT" \
    '.summary.referenced = ($ref | tonumber) |
     .summary.unreferenced = ($unref | tonumber) |
     .summary.skipped = ($skip | tonumber)')

# Write output
echo "$JSON_OUTPUT" > "$OUTPUT_FILE"

# Display summary
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}" >&2
echo -e "${GREEN}✅ Analysis Complete!${NC}" >&2
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}" >&2
echo -e "📊 ${YELLOW}Summary:${NC}" >&2
echo -e "  Total files:        ${CYAN}$TOTAL_FILES${NC}" >&2
echo -e "  Referenced:         ${GREEN}$REFERENCED_COUNT${NC}" >&2
echo -e "  Unreferenced:       ${RED}$UNREFERENCED_COUNT${NC}" >&2
echo -e "  Skipped (system):   ${YELLOW}$SKIPPED_COUNT${NC}" >&2
echo "" >&2
echo -e "📁 ${GREEN}Results saved to:${NC} $OUTPUT_FILE" >&2
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}" >&2

# Return path for scripting
echo "$OUTPUT_FILE"
