import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx'
})

export default withNextra({
  reactStrictMode: true,
  basePath: '',
  transpilePackages: ['@kroescontrol/brand', '@kroescontrol/ui'],
  images: {
    unoptimized: true
  },

  async rewrites() {
    return [
      {
        source: '/en/legal/:path*',
        destination: '/en/legal/:path*'
      }
    ]
  },

  async redirects() {
    return [
      {
        source: '/over-kroescontrol/team',
        destination: '/over-kroescontrol/management-team',
        permanent: true // 301 redirect for SEO
      },
      {
        source: '/over-kroescontrol/visie',
        destination: '/over-kroescontrol/wat-we-doen',
        permanent: true // 301: visie samengevoegd in wat-we-doen (snoei 2026-06)
      },
      {
        source: '/cultuur/werkmethode',
        destination: '/cultuur/informatieorganisatie',
        permanent: true // 301: werkmethode samengevoegd in informatieorganisatie (snoei 2026-06)
      },
      {
        source: '/klanten',
        destination: '/kennismaking/projecten',
        permanent: true // 301: klanten samengevoegd in projecten (snoei 2026-06)
      },
      {
        source: '/kennismaking/voorwaarden',
        destination: '/werken-bij/voordelen',
        permanent: true // 301: voorwaarden samengevoegd in voordelen (snoei 2026-06)
      },
      {
        source: '/over-kroescontrol/bedrijfsgegevens',
        destination: '/juridisch/bedrijfsgegevens',
        permanent: true // 301 redirect for SEO
      },
      {
        source: '/kennismaking/engineer-hub',
        destination: '/kennismaking/budgetten',
        permanent: true // 308: beschreef de budgetspreadsheet van mei 2025 (opschoonronde prd541, 2026-09)
      },
      {
        source: '/branding/lucide-icons',
        destination: '/branding/icon-guidelines',
        permanent: true // 308: samengevoegd in icon-guidelines (opschoonronde prd541, 2026-09)
      },
      {
        source: '/branding/visualisatie',
        destination: 'https://internal.docs.kroescontrol.nl/tools/visualisatie',
        permanent: true // 308: agent-tooling, verhuisd naar internal; de template zelf blijft hier staan (opschoonronde prd541, 2026-09)
      },
      {
        source: '/sna-keurmerk',
        destination: '/juridisch/sna-keurmerk',
        permanent: true // 301 redirect for SEO
      }
    ]
  },

  async headers() {
    return [
      {
        // HTML pages - kort voor nu
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=600, stale-while-revalidate=1800'
          }
        ]
      },
      {
        // Next.js static assets - immutable
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        // Logo & favicon assets - immutable (versioned via git)
        source: '/(KC-beeldmerk-gradientKLEUR|favicon|logo-icon-)(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        // Public assets - medium cache
        source: '/:path*.(jpg|jpeg|png|gif|svg|webp|avif|ico|pdf|doc|docx|xls|xlsx|ppt|pptx|zip|rar|tar|gz|tgz|bz2|xz|7z|woff|woff2|ttf|otf|eot|mp4|webm|ogg|mp3|wav|flac|aac)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400'
          }
        ]
      }
    ]
  }
})