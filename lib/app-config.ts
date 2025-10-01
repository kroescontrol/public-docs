// Environment-aware app configuration
export interface AppConfig {
  name: string
  path: string
  description: string
  icon: string
  requiresAuth?: boolean
}

export const apps: AppConfig[] = [
  {
    name: '📚 Public',
    path: 'docs',
    description: 'Publieke documentatie',
    icon: '📚',
  },
  {
    name: '🔒 Internal', 
    path: 'internal.docs',
    description: 'Interne documentatie',
    icon: '🔒',
    requiresAuth: true,
  },
  {
    name: '⚙️ Operations',
    path: 'operations.docs', 
    description: 'Operations documentatie',
    icon: '⚙️',
    requiresAuth: true,
  },
  {
    name: '🏢 Hub',
    path: 'hub',
    description: 'Management platform',
    icon: '🏢',
    requiresAuth: true,
  },
]

export function getCurrentDomain(): string {
  if (typeof window === 'undefined') return 'kroescontrol.nl'
  
  const hostname = window.location.hostname
  
  // Development environment
  if (hostname.includes('polderland.local')) {
    return 'polderland.local'
  }
  
  // Production environment
  return 'kroescontrol.nl'
}

export function getCurrentApp(): string {
  if (typeof window === 'undefined') return 'docs'
  
  const hostname = window.location.hostname
  
  // Match current hostname to app
  for (const app of apps) {
    const expectedHostname = `${app.path}.${getCurrentDomain()}`
    if (hostname === expectedHostname || 
        (app.path === 'docs' && (hostname === getCurrentDomain() || hostname === `docs.${getCurrentDomain()}`))) {
      return app.name
    }
  }
  
  return apps[0].name // fallback to public
}

export function buildAppUrl(appPath: string): string {
  const domain = getCurrentDomain()
  const protocol = domain.includes('local') ? 'https' : 'https'
  
  if (appPath === 'docs') {
    return `${protocol}://docs.${domain}/home`
  }
  
  return `${protocol}://${appPath}.${domain}/home`
}