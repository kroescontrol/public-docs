import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
import { useRouter } from 'next/router'

const config: DocsThemeConfig = {
  logo: <span>📚 Kroescontrol Public Docs</span>,
  logoLink: '/home',
  project: {
    link: 'https://github.com/kroescontrol/public-docs'
  },
  docsRepositoryBase: 'https://github.com/kroescontrol/public-docs/tree/main',
  footer: {
    content: 'Kroescontrol Public Documentation'
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true
  },
  head: () => {
    const { asPath } = useRouter()
    const url = `https://docs.kroescontrol.nl${asPath}`

    return (
      <>
        {/* Basic Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Publieke documentatie van Kroescontrol - informatie over werken bij ons, bedrijfscultuur, kantoor en alles wat je moet weten." />
        <meta name="keywords" content="Kroescontrol, documentatie, werken bij, software development, Amsterdam, Rotterdam" />
        <meta name="author" content="Kroescontrol" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:site_name" content="Kroescontrol Docs" />
        <meta property="og:title" content="Kroescontrol - Publieke Documentatie" />
        <meta property="og:description" content="Ontdek alles over werken bij Kroescontrol, onze bedrijfscultuur en wat we te bieden hebben." />
        <meta property="og:image" content="https://docs.kroescontrol.nl/og-image.svg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Kroescontrol logo met gradient background" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Kroescontrol - Publieke Documentatie" />
        <meta name="twitter:description" content="Ontdek alles over werken bij Kroescontrol, onze bedrijfscultuur en wat we te bieden hebben." />
        <meta name="twitter:image" content="https://docs.kroescontrol.nl/og-image.svg" />

        {/* Canonical URL */}
        <link rel="canonical" href={url} />

        {/* Favicon */}
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/logo-icon-192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/logo-icon-512.png" />
      </>
    )
  }
}

export default config