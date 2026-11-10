import React from 'react'
import { DocsThemeConfig, useConfig } from 'nextra-theme-docs'
import { useRouter } from 'next/router'
import { LanguageToggle } from './components/LanguageToggle'
import { HeadingIcons } from '@/components/HeadingIcons'

const config: DocsThemeConfig = {
  main: ({ children }) => (
    <>
      <HeadingIcons />
      {children}
    </>
  ),
  logo: (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <img src="/KC-beeldmerk-gradientKLEUR.svg" alt="KC" width="40" height="32" />
      <span className="max-md:hidden" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '18px' }}>
        kroescontrol
      </span>
    </div>
  ),
  logoLink: '/home',
  project: {
    link: 'https://github.com/kroescontrol/public-docs',
    // Eigen icoon zonder <title>: het standaardicoon van Nextra zet <title>GitHub</title> in de body,
    // naast de echte paginatitel. aria-label houdt de naam voor schermlezers.
    icon: (
      <svg width={24} height={24} fill="currentColor" viewBox="3 3 18 18" role="img" aria-label="GitHub">
        <path d="M12 3C7.0275 3 3 7.12937 3 12.2276C3 16.3109 5.57625 19.7597 9.15374 20.9824C9.60374 21.0631 9.77249 20.7863 9.77249 20.5441C9.77249 20.3249 9.76125 19.5982 9.76125 18.8254C7.5 19.2522 6.915 18.2602 6.735 17.7412C6.63375 17.4759 6.19499 16.6569 5.8125 16.4378C5.4975 16.2647 5.0475 15.838 5.80124 15.8264C6.51 15.8149 7.01625 16.4954 7.18499 16.7723C7.99499 18.1679 9.28875 17.7758 9.80625 17.5335C9.885 16.9337 10.1212 16.53 10.38 16.2993C8.3775 16.0687 6.285 15.2728 6.285 11.7432C6.285 10.7397 6.63375 9.9092 7.20749 9.26326C7.1175 9.03257 6.8025 8.08674 7.2975 6.81794C7.2975 6.81794 8.05125 6.57571 9.77249 7.76377C10.4925 7.55615 11.2575 7.45234 12.0225 7.45234C12.7875 7.45234 13.5525 7.55615 14.2725 7.76377C15.9937 6.56418 16.7475 6.81794 16.7475 6.81794C17.2424 8.08674 16.9275 9.03257 16.8375 9.26326C17.4113 9.9092 17.76 10.7281 17.76 11.7432C17.76 15.2843 15.6563 16.0687 13.6537 16.2993C13.98 16.5877 14.2613 17.1414 14.2613 18.0065C14.2613 19.2407 14.25 20.2326 14.25 20.5441C14.25 20.7863 14.4188 21.0746 14.8688 20.9824C16.6554 20.364 18.2079 19.1866 19.3078 17.6162C20.4077 16.0457 20.9995 14.1611 21 12.2276C21 7.12937 16.9725 3 12 3Z" />
      </svg>
    )
  },
  docsRepositoryBase: 'https://github.com/kroescontrol/public-docs/tree/main',
  footer: {
    content: (
      <span>
        Kroescontrol Public Documentation •{' '}
        <a href="/docs-mcp" style={{ textDecoration: 'underline' }}>
          Gebruik met je AI-assistent
        </a>
        {' '}•{' '}
        <a href="/opt-out" style={{ textDecoration: 'underline' }}>
          Analytics opt-out
        </a>
      </span>
    )
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true
  },
  navbar: {
    extraContent: () => <LanguageToggle />
  },
  head: () => {
    const { asPath } = useRouter()
    const baseUrl = 'https://docs.kroescontrol.nl'
    const url = `${baseUrl}${asPath}`

    // Titel en beschrijving per pagina: frontmatter title/description, anders de paginatitel van
    // Nextra. De startpagina (pages/index.tsx) zet haar eigen kop; daar blijven de site-teksten staan.
    const { frontMatter, title: paginaTitel } = useConfig()
    const siteTitel = 'Kroescontrol - Publieke Documentatie'
    const siteOmschrijving = 'Publieke documentatie van Kroescontrol - informatie over werken bij ons, bedrijfscultuur, kantoor en alles wat je moet weten.'
    const siteOgOmschrijving = 'Ontdek alles over werken bij Kroescontrol, onze bedrijfscultuur en wat we te bieden hebben.'
    const isStart = asPath === '/' || asPath.startsWith('/?') || asPath.startsWith('/#')
    const eigenTitel = (frontMatter?.title as string | undefined) || paginaTitel
    const titel = !isStart && eigenTitel ? `${eigenTitel} - Kroescontrol` : siteTitel
    const eigenOmschrijving = !isStart ? (frontMatter?.description as string | undefined) : undefined
    const omschrijving = eigenOmschrijving || siteOmschrijving
    const ogOmschrijving = eigenOmschrijving || siteOgOmschrijving

    // Hreflang map: NL ↔ EN paths (ONLY juridisch pages with translations)
    const hreflangMap: Record<string, string> = {
      '/juridisch/algemene-voorwaarden': '/en/legal/terms-and-conditions',
      '/juridisch/privacy': '/en/legal/privacy',
      '/juridisch/spam': '/en/legal/spam',
      '/juridisch/notice-and-takedown': '/en/legal/notice-and-takedown',
      '/en/legal/terms-and-conditions': '/juridisch/algemene-voorwaarden',
      '/en/legal/privacy': '/juridisch/privacy',
      '/en/legal/spam': '/juridisch/spam',
      '/en/legal/notice-and-takedown': '/juridisch/notice-and-takedown'
    }

    const altPath = hreflangMap[asPath]
    const isNL = asPath.startsWith('/juridisch')
    const isEN = asPath.startsWith('/en/legal')
    const hasTranslation = Boolean(altPath)

    return (
      <>
        {/* Performance: DNS prefetch for HubSpot */}
        <link rel="dns-prefetch" href="//js-na1.hs-scripts.com" />
        <link rel="preconnect" href="https://js-na1.hs-scripts.com" crossOrigin="anonymous" />

        {/* AI-indexbestand: verwijst naar publieke info en de docs-MCP */}
        <link rel="alternate" type="text/plain" href="/llm.txt" title="llm.txt" />

        {/* Basic Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {!isStart && <title>{titel}</title>}
        <meta name="description" content={omschrijving} />
        <meta name="keywords" content="Kroescontrol, documentatie, werken bij, software development, Amsterdam, Rotterdam" />
        <meta name="author" content="Kroescontrol" />

        {/* Hreflang ONLY for pages with translations */}
        {hasTranslation && (
          <>
            <link
              rel="alternate"
              hrefLang="nl"
              href={`${baseUrl}${isNL ? asPath : altPath}`}
            />
            <link
              rel="alternate"
              hrefLang="en"
              href={`${baseUrl}${isEN ? asPath : altPath}`}
            />
            <link
              rel="alternate"
              hrefLang="x-default"
              href={`${baseUrl}${isNL ? asPath : altPath}`}
            />
          </>
        )}

        {/* Canonical URL */}
        <link rel="canonical" href={url} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:site_name" content="Kroescontrol Docs" />
        <meta property="og:title" content={titel} />
        <meta property="og:description" content={ogOmschrijving} />
        <meta property="og:image" content="https://docs.kroescontrol.nl/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Kroescontrol logo" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={titel} />
        <meta name="twitter:description" content={ogOmschrijving} />
        <meta name="twitter:image" content="https://docs.kroescontrol.nl/og-image.png" />

        {/* Favicon - Magenta accent (public docs) */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="192x192" href="/logo-icon-192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/logo-icon-512.png" />
      </>
    )
  }
}

export default config