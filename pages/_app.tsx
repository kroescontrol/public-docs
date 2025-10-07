import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import 'nextra-theme-docs/style.css'
import '../styles/kroescontrol-design-tokens.css'
import { useSharedTheme } from '../hooks/useSharedTheme'

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

  return <Component {...pageProps} />
}