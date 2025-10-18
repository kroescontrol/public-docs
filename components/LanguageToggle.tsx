import Link from 'next/link'
import { useRouter } from 'next/router'

export function LanguageToggle() {
  const { pathname } = useRouter()

  // Map NL ↔ EN paths
  const pathMap: Record<string, string> = {
    '/juridisch/algemene-voorwaarden': '/en/legal/terms-and-conditions',
    '/juridisch/privacy': '/en/legal/privacy',
    '/juridisch/spam': '/en/legal/spam',
    '/juridisch/notice-and-takedown': '/en/legal/notice-and-takedown',
    '/en/legal/terms-and-conditions': '/juridisch/algemene-voorwaarden',
    '/en/legal/privacy': '/juridisch/privacy',
    '/en/legal/spam': '/juridisch/spam',
    '/en/legal/notice-and-takedown': '/juridisch/notice-and-takedown'
  }

  const targetPath = pathMap[pathname]

  // Hide toggle if no translation exists
  if (!targetPath) return null

  const isNL = pathname.startsWith('/juridisch')

  return (
    <div style={{
      padding: '0.5rem 1rem',
      fontSize: '0.9rem'
    }}>
      <Link href={targetPath} style={{
        color: 'inherit',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <span>{isNL ? '🇬🇧' : '🇳🇱'}</span>
        <span>{isNL ? 'English' : 'Nederlands'}</span>
      </Link>
    </div>
  )
}
