import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <span>📚 Kroescontrol Public Docs</span>,
  logoLink: '/home',
  project: {
    link: 'https://github.com/kroescontrol'
  },
  docsRepositoryBase: 'https://github.com/kroescontrol/polderland/tree/main/apps/docs-public',
  footer: {
    content: 'Kroescontrol Public Documentation'
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true
  }
}

export default config