import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

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
  }
}

export default config