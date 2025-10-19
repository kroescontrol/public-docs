'use client'

import { useEffect } from 'react'

// Emoji regex voor detectie (inclusief diverse Unicode emoji ranges)
const EMOJI_REGEX = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u

// Simplified: Only most common keywords
const ICON_KEYWORDS = [
  'contact',      // Phone icon
  'tips',         // Zap icon
  'vragen',       // HelpCircle icon
]

export function HeadingIcons() {
  useEffect(() => {
    const timeout = setTimeout(() => {
      const headings = document.querySelectorAll('article h2, article h3, article h4')

      headings.forEach(heading => {
        const anchor = heading.querySelector('.subheading-anchor') as HTMLAnchorElement
        if (!anchor) return

        // Get heading text
        const headingText = Array.from(heading.childNodes)
          .filter(node => !node.isSameNode(anchor))
          .map(node => node.textContent)
          .join('')
          .trim()

        // Priority 1: Emoji in heading
        const emojiMatch = headingText.match(EMOJI_REGEX)
        if (emojiMatch) {
          anchor.textContent = ''
          const iconSpan = document.createElement('span')
          iconSpan.className = 'anchor-icon'
          iconSpan.textContent = emojiMatch[0]
          anchor.appendChild(iconSpan)
          return
        }

        // Priority 2: Keyword match
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

        // Priority 3: Fallback link icon
        anchor.textContent = ''
        const iconSpan = document.createElement('span')
        iconSpan.className = 'anchor-icon'
        iconSpan.innerHTML = getLinkIconSVG()
        anchor.appendChild(iconSpan)
      })
    }, 100)

    return () => clearTimeout(timeout)
  }, [])

  return null
}

// Simplified: Only 3 icons
function getIconSVG(keyword: string): string {
  const iconPaths: Record<string, string> = {
    'contact': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    'tips': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    'vragen': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>',
  }

  return iconPaths[keyword] || getLinkIconSVG()
}

// Fallback link icon
function getLinkIconSVG(): string {
  return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>'
}
