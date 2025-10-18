#!/bin/bash
# Validate build configuration for SSG compatibility with auth-protected routes
# Detects MDX pages that will fail during static generation

set -euo pipefail

# Kleuren
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🔍 Validating build configuration for SSG compatibility..."
echo ""

# Config: Routes that require authentication
PROTECTED_ROUTES=(
  "pages/services"
  "pages/employee-journey"
  "pages/tools"
  "pages/hr"
)

ISSUES_FOUND=0
WARNINGS_FOUND=0

# Check 1: Find MDX files in protected routes without SSR config
echo "1️⃣  Checking for SSG-unsafe MDX pages in protected routes..."

for route in "${PROTECTED_ROUTES[@]}"; do
  if [ ! -d "$route" ]; then
    continue
  fi

  while IFS= read -r file; do
    # Skip .bak files
    if [[ "$file" == *.bak ]]; then
      continue
    fi

    # Check if file has getServerSideProps or getStaticProps export
    if ! grep -q "export.*getServerSideProps\|export.*getStaticProps\|export const getServerSideProps\|export const getStaticProps" "$file"; then
      echo -e "   ${YELLOW}⚠️  $file${NC}"
      echo "      MDX in protected route without SSR/SSG config"
      echo "      This will fail if page uses auth context during build"
      WARNINGS_FOUND=$((WARNINGS_FOUND + 1))
    fi
  done < <(find "$route" -name "*.mdx" -type f 2>/dev/null || true)
done

if [ $WARNINGS_FOUND -eq 0 ]; then
  echo -e "   ${GREEN}✓ No SSG-unsafe MDX files found${NC}"
fi

# Check 2: Verify theme config has SSG-safe auth handling
echo ""
echo "2️⃣  Checking theme configuration..."

if [ -f "theme.config.tsx" ]; then
  # Check for SessionProvider without SSG fallback
  if grep -q "SessionProvider" theme.config.tsx && ! grep -q "typeof window\|getServerSideProps\|suppressHydrationWarning" theme.config.tsx; then
    echo -e "   ${YELLOW}⚠️  theme.config.tsx uses SessionProvider${NC}"
    echo "      Consider adding SSG fallback for auth context"
    WARNINGS_FOUND=$((WARNINGS_FOUND + 1))
  else
    echo -e "   ${GREEN}✓ Theme config appears SSG-safe${NC}"
  fi
else
  echo "   ⊘ theme.config.tsx not found (skipping)"
fi

# Check 3: Run quick build test (optional, can be slow)
# Skip if SKIP_BUILD_TEST=1
if [ "${SKIP_BUILD_TEST:-0}" = "1" ]; then
  echo ""
  echo "3️⃣  Skipping build test (SKIP_BUILD_TEST=1)"
else
  echo ""
  echo "3️⃣  Running build test (detecting SSG auth errors)..."

  BUILD_LOG=$(mktemp)
  if ! pnpm exec next build 2>&1 | tee "$BUILD_LOG"; then
    # Check for specific SSG auth errors
    if grep -q "Cannot destructure.*auth\|auth.*undefined\|SessionProvider.*SSG" "$BUILD_LOG"; then
      echo -e "   ${RED}❌ Build failed with SSG auth context error${NC}"
      echo "      See build log for details"
      grep -A 3 "Error occurred prerendering" "$BUILD_LOG" | head -10
      ISSUES_FOUND=$((ISSUES_FOUND + 1))
    else
      echo -e "   ${RED}❌ Build failed (non-auth error)${NC}"
      echo "      Check pnpm build output for details"
      ISSUES_FOUND=$((ISSUES_FOUND + 1))
    fi
  else
    echo -e "   ${GREEN}✓ Build succeeded${NC}"
  fi
  rm -f "$BUILD_LOG"
fi

# Report
echo ""
echo "─────────────────────────────────────────────"

if [ $ISSUES_FOUND -gt 0 ]; then
  echo -e "${RED}❌ Found $ISSUES_FOUND build configuration error(s)${NC}"
  echo "   Fix these before pushing to avoid Vercel deployment failures"
  echo ""
  echo "   Common fixes:"
  echo "   - Convert MDX to TSX with getServerSideProps"
  echo "   - Add 'use client' directive to components using auth"
  echo "   - Add SSG fallback to SessionProvider in theme config"
  exit 1
fi

if [ $WARNINGS_FOUND -gt 0 ]; then
  echo -e "${YELLOW}⚠️  Found $WARNINGS_FOUND warning(s)${NC}"
  echo "   These may cause build failures if pages use auth context"
  echo "   Consider addressing before deployment"
  echo ""
  exit 0
fi

echo -e "${GREEN}✅ Build configuration is SSG-safe${NC}"
exit 0
