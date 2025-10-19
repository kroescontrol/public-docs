'use client'

import { useEffect } from 'react'

// Emoji regex voor detectie (inclusief diverse Unicode emoji ranges)
const EMOJI_REGEX = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u

// Keyword matching voor icons met priority (eerst checken = hogere priority)
const ICON_KEYWORDS = [
  'community',    // Users icon
  'koffie',       // Coffee icon
  'meeting',      // Briefcase icon
  'business',     // Briefcase icon
  'meewerk',      // Laptop icon
  'waar',         // MapPin icon
  'locatie',      // MapPin icon
  'amsterdam',    // Building2 icon
  'klarenbeek',   // Trees icon
  'verwachten',   // Sparkles icon
  'tips',         // Zap icon
  'do\'s',        // CheckCircle icon
  'don\'ts',      // XCircle icon
  'vragen',       // HelpCircle icon
  'praktisch',    // HelpCircle icon
  'contact',      // Phone icon
]

export function HeadingIcons() {
  useEffect(() => {
    // Wait for Nextra to render
    const timeout = setTimeout(() => {
      const headings = document.querySelectorAll('article h2, article h3, article h4')

      headings.forEach(heading => {
        const anchor = heading.querySelector('.subheading-anchor') as HTMLAnchorElement
        if (!anchor) return

        // Get heading text (exclude anchor text)
        const headingText = Array.from(heading.childNodes)
          .filter(node => !node.isSameNode(anchor))
          .map(node => node.textContent)
          .join('')
          .trim()

        // Check for emoji in heading text
        const emojiMatch = headingText.match(EMOJI_REGEX)
        if (emojiMatch) {
          // Use emoji as anchor icon
          anchor.textContent = ''
          const iconSpan = document.createElement('span')
          iconSpan.className = 'anchor-icon'
          iconSpan.textContent = emojiMatch[0]
          anchor.appendChild(iconSpan)
          return
        }

        // Match icon based on keywords
        const lowerText = headingText.toLowerCase()
        for (const keyword of ICON_KEYWORDS) {
          if (lowerText.includes(keyword)) {
            anchor.textContent = ''
            const iconSpan = document.createElement('span')
            iconSpan.className = 'anchor-icon'
            iconSpan.innerHTML = getIconSVG(keyword)
            anchor.appendChild(iconSpan)
            return
          }
        }

        // Fallback: generic link icon
        anchor.textContent = ''
        const iconSpan = document.createElement('span')
        iconSpan.className = 'anchor-icon'
        iconSpan.innerHTML = getLinkIconSVG()
        anchor.appendChild(iconSpan)
      })
    }, 100) // Small delay to ensure Nextra has rendered

    return () => clearTimeout(timeout)
  }, [])

  return null
}

// Helper: Get SVG string for matched icon
function getIconSVG(keyword: string): string {
  const iconPaths: Record<string, string> = {
    'waar': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    'locatie': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    'amsterdam': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>',
    'klarenbeek': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 13v8"/><path d="M12 3v3"/><path d="m9 12-7 3 7 3 7-3-7-3z"/><path d="m9 12 7 3v4l-7-3v-4z"/><path d="m2 15 7 3v4l-7-3v-4z"/><circle cx="12" cy="5" r="2"/></svg>',
    'verwachten': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>',
    'tips': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    'do\'s': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    'don\'ts': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>',
    'vragen': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>',
    'praktisch': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>',
    'contact': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    'koffie': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>',
    'meeting': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    'business': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    'meewerk': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/></svg>',
    'community': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  }

  return iconPaths[keyword] || getLinkIconSVG()
}

// Fallback link icon
function getLinkIconSVG(): string {
  return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>'
}
