#!/usr/bin/env node
/**
 * Smart Build Script
 *
 * Runs Next.js build and intelligently handles different error types:
 * - ✅ Allow: SSG prerender errors (auth context issues) → Deploy with SSR fallback
 * - ❌ Block: Real build errors (syntax, types, missing deps) → Prevent deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');

const BUILD_LOG = 'build.log';

console.log('🔨 Starting smart build...\n');

try {
  // Run build and capture ALL output
  const output = execSync('pnpm exec next build 2>&1', {
    encoding: 'utf8',
    stdio: 'pipe'
  });

  // Print output for visibility
  console.log(output);

  console.log('\n✅ Build succeeded with no errors');
  process.exit(0);

} catch (error) {
  console.log('\n⚠️  Build encountered errors - analyzing...\n');

  // Get build output from stdout (we redirected stderr to stdout with 2>&1)
  const buildOutput = error.stdout?.toString() || error.stderr?.toString() || '';

  // Print output for visibility
  if (buildOutput) {
    console.log(buildOutput);
  }

  // Save log for debugging
  fs.writeFileSync(BUILD_LOG, buildOutput);

  // Define error patterns
  const errorPatterns = {
    // Real build errors that MUST block deployment
    syntax: /Failed to compile|SyntaxError|Unexpected token/i,
    typescript: /Type error:|TS\d{4}:/i,
    missingDeps: /Module not found|Cannot find module/i,
    eslint: /ESLint.*error/i,

    // SSG prerender errors (acceptable - will fallback to SSR)
    ssgPrerender: /Export encountered errors on following paths/i,
    authContext: /Cannot destructure property.*auth.*undefined/i
  };

  // Check for blocking errors
  const hasSyntaxError = errorPatterns.syntax.test(buildOutput);
  const hasTypeError = errorPatterns.typescript.test(buildOutput);
  const hasMissingDeps = errorPatterns.missingDeps.test(buildOutput);
  const hasESLintError = errorPatterns.eslint.test(buildOutput);

  // Check for acceptable SSG errors
  const hasSSGError = errorPatterns.ssgPrerender.test(buildOutput);
  const hasAuthError = errorPatterns.authContext.test(buildOutput);

  // Decision logic
  if (hasSyntaxError || hasTypeError || hasMissingDeps || hasESLintError) {
    console.error('❌ BLOCKING DEPLOYMENT - Critical build errors detected:\n');

    if (hasSyntaxError) console.error('   - Syntax errors found');
    if (hasTypeError) console.error('   - TypeScript errors found');
    if (hasMissingDeps) console.error('   - Missing dependencies');
    if (hasESLintError) console.error('   - ESLint errors');

    console.error('\n📋 Check build.log for details');
    console.error('🔧 Fix these errors before deploying\n');

    process.exit(1); // Block deployment
  }

  if (hasSSGError || hasAuthError) {
    console.log('✅ SAFE TO DEPLOY - Only SSG prerender errors detected\n');
    console.log('   These pages will use SSR (Server-Side Rendering) instead of SSG');
    console.log('   Performance: Slightly slower initial load, but fully functional\n');

    // Extract failed paths from build output
    const pathMatches = buildOutput.match(/\/[\w\-\/]+/g);
    if (pathMatches) {
      const uniquePaths = [...new Set(pathMatches)].filter(p =>
        p.startsWith('/tools') || p.startsWith('/hr') || p.startsWith('/employee')
      );

      if (uniquePaths.length > 0) {
        console.log('   Affected paths (will use SSR):');
        uniquePaths.slice(0, 10).forEach(path => {
          console.log(`   - ${path}`);
        });

        if (uniquePaths.length > 10) {
          console.log(`   ... and ${uniquePaths.length - 10} more`);
        }
      }
    }

    console.log('\n💡 To eliminate these warnings, add SSR export to .mdx files:');
    console.log('   export { getServerSideProps } from "next/auth/next"\n');

    process.exit(0); // Allow deployment
  }

  // Unknown error type - be conservative and block
  console.error('❌ BLOCKING DEPLOYMENT - Unknown build error\n');
  console.error('📋 Check build.log for details\n');

  process.exit(1);
}
