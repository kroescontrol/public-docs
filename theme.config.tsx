import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
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
    link: 'https://github.com/kroescontrol/public-docs'
  },
  docsRepositoryBase: 'https://github.com/kroescontrol/public-docs/tree/main',
  footer: {
    content: (
      <span>
        Kroescontrol Public Documentation •{' '}
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

        {/* Basic Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Publieke documentatie van Kroescontrol - informatie over werken bij ons, bedrijfscultuur, kantoor en alles wat je moet weten." />
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
        <meta property="og:title" content="Kroescontrol - Publieke Documentatie" />
        <meta property="og:description" content="Ontdek alles over werken bij Kroescontrol, onze bedrijfscultuur en wat we te bieden hebben." />
        <meta property="og:image" content="https://docs.kroescontrol.nl/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Kroescontrol logo" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Kroescontrol - Publieke Documentatie" />
        <meta name="twitter:description" content="Ontdek alles over werken bij Kroescontrol, onze bedrijfscultuur en wat we te bieden hebben." />
        <meta name="twitter:image" content="https://docs.kroescontrol.nl/logo-icon-512.png" />

        {/* Open Graph - PNG for chat app compatibility */}
        <meta property="og:image" content="https://docs.kroescontrol.nl/logo-icon-512.png" />

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