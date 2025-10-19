import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import Head from 'next/head'
import 'nextra-theme-docs/style.css'
import '../styles/globals.css'
import '../styles/kroescontrol-design-tokens.css'
import { useSharedTheme } from '../hooks/useSharedTheme'
import { HeadingIcons } from '../components/HeadingIcons'

// Organization structured data (JSON-LD) for SEO
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Kroescontrol B.V.",
  "legalName": "Kroescontrol B.V.",
  "url": "https://kroescontrol.nl",
  "logo": "https://docs.kroescontrol.nl/branding/logo/png/kc-logo-gradientkleur.png",
  "description": "Automatiseringsconsultancy - Het (doen) leveren van producten en diensten op het gebied van consultancy en automatisering",
  "foundingDate": "2021",
  "vatID": "NL863664295B01",
  "taxID": "863664295",

  // Primary address: Amsterdam (hoofdvestiging)
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Stationsplein 9",
    "addressLocality": "Amsterdam",
    "addressRegion": "NH",
    "postalCode": "1012 AB",
    "addressCountry": "NL"
  },

  // Multiple locations
  "location": [
    {
      "@type": "Place",
      "name": "Kroescontrol Amsterdam",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Stationsplein 9",
        "addressLocality": "Amsterdam",
        "addressRegion": "NH",
        "postalCode": "1012 AB",
        "addressCountry": "NL"
      }
    },
    {
      "@type": "Place",
      "name": "Kroescontrol Rotterdam",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Plaatweg 15",
        "addressLocality": "Rotterdam",
        "addressRegion": "ZH",
        "postalCode": "3202 LB",
        "addressCountry": "NL"
      }
    }
  ],

  // Contact info
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+31-6-34116494",
    "contactType": "customer service",
    "email": "secretariaat@kroescontrol.nl",
    "availableLanguage": ["nl", "en"]
  },

  // Social profiles
  "sameAs": [
    "https://github.com/kroescontrol",
    "https://www.linkedin.com/company/kroescontrol"
  ],

  // KvK number
  "identifier": {
    "@type": "PropertyValue",
    "name": "KvK nummer",
    "value": "85552836"
  }
}

export default function App({ Component, pageProps }: AppProps) {
  // Cross-domain theme sync via cookie
  useSharedTheme()

  // Register Service Worker voor offline functionaliteit
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration.scope)
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error)
        })
    }
  }, [])

  // HubSpot tracking script (conditional loading with idle-time optimization)
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Check localStorage for opt-out preference
    const hasOptedOut = localStorage.getItem('analytics-opt-out') === 'true'
    if (hasOptedOut || (window as any)._hsq) return

    // Load HubSpot script during browser idle time for optimal performance
    const loadHubSpot = () => {
      const script = document.createElement('script')
      script.id = 'hs-script-loader'
      script.type = 'text/javascript'
      script.async = true
      script.defer = true
      script.src = '//js-na1.hs-scripts.com/48140960.js'
      document.body.appendChild(script)
    }

    // Wait for browser to be idle (better pageload performance)
    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadHubSpot, { timeout: 2000 })
    } else {
      // Fallback for browsers without requestIdleCallback (Safari)
      setTimeout(loadHubSpot, 2000)
    }
  }, [])

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </Head>
      <HeadingIcons />
      <Component {...pageProps} />
    </>
  )
}