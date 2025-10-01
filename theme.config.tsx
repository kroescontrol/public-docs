import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
import { apps, buildAppUrl, getCurrentApp } from './lib/app-config'

const AppSwitcher = () => {
  const [currentApp, setCurrentApp] = React.useState<string>('📚 Public')
  
  React.useEffect(() => {
    setCurrentApp(getCurrentApp())
  }, [])
  
  return (
    <select 
      className="text-sm border rounded px-2 py-1 bg-white dark:bg-gray-800 dark:border-gray-600"
      onChange={(e) => {
        if (e.target.value) {
          window.location.href = e.target.value
        }
      }}
      value=""
    >
      <option value="">Switch Site...</option>
      {apps.map(app => (
        <option 
          key={app.path}
          value={app.name === currentApp ? '' : buildAppUrl(app.path)}
        >
          {app.name} {app.name === currentApp ? ' (current)' : ''}
        </option>
      ))}
    </select>
  )
}

const config: DocsThemeConfig = {
  logo: (
    <div className="flex items-center gap-4">
      <span>📚 Kroescontrol Public Docs</span>
      <AppSwitcher />
    </div>
  ),
  project: {
    link: 'https://github.com/kroescontrol'
  },
  docsRepositoryBase: 'https://github.com/kroescontrol/polderland/tree/main/apps/docs-public',
  footer: {
    content: 'Kroescontrol Public Documentation'
  }
}

export default config