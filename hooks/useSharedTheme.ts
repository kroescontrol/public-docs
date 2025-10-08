import { useEffect } from 'react'
import { useTheme } from 'nextra-theme-docs'

/**
 * Shared theme hook - synceert theme preference via cookie over alle subdomains
 *
 * Mechanisme:
 * 1. Luistert naar theme changes in Nextra (localStorage)
 * 2. Schrijft naar cookie met dynamische domain detectie
 * 3. Bij mount: leest cookie en sync naar localStorage indien nodig
 *
 * Sync gedrag:
 * - Cross-subdomain: internal.docs ↔ operations.docs ↔ docs (prod/dev)
 * - Instant bij nieuwe tab/refresh
 * - Cookie fallback als localStorage leeg is
 * - Environment-aware: .kroescontrol.nl (prod) of .polderland.local (dev)
 *
 * Limitatie: geen real-time sync tussen open tabs (pas bij refresh)
 */
export function useSharedTheme() {
  const { theme, setTheme } = useTheme()

  // Detecteer root domain voor cookie
  const getRootDomain = (): string => {
    const hostname = window.location.hostname

    if (hostname.includes('.kroescontrol.nl')) return '.kroescontrol.nl'
    if (hostname.includes('.polderland.local')) return '.polderland.local'

    // Localhost fallback (geen domain prefix)
    return hostname
  }

  // Cookie helper functions
  const setCookie = (name: string, value: string, days: number = 365) => {
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    const expires = `expires=${date.toUTCString()}`
    const domain = getRootDomain()

    // Dynamic domain maakt cookie beschikbaar voor alle subdomains (prod + dev)
    document.cookie = `${name}=${value}; ${expires}; path=/; domain=${domain}; SameSite=Lax`
  }

  const getCookie = (name: string): string | null => {
    const nameEQ = `${name}=`
    const cookies = document.cookie.split(';')

    for (let cookie of cookies) {
      cookie = cookie.trim()
      if (cookie.indexOf(nameEQ) === 0) {
        return cookie.substring(nameEQ.length)
      }
    }
    return null
  }

  // Mount: sync cookie → localStorage (cookie heeft voorrang bij conflict)
  useEffect(() => {
    const cookieTheme = getCookie('kroescontrol_theme')

    if (cookieTheme && cookieTheme !== theme) {
      // Cookie bevat andere waarde dan huidige theme - sync naar localStorage
      setTheme(cookieTheme)
    } else if (!cookieTheme && theme) {
      // Cookie leeg maar localStorage heeft waarde - sync naar cookie
      setCookie('kroescontrol_theme', theme)
    }
  }, []) // Alleen bij mount

  // Theme change listener: localStorage → cookie
  useEffect(() => {
    if (!theme) return

    const cookieTheme = getCookie('kroescontrol_theme')

    if (cookieTheme !== theme) {
      // Theme changed in localStorage - sync naar cookie
      setCookie('kroescontrol_theme', theme)
    }
  }, [theme])

  return { theme, setTheme }
}
