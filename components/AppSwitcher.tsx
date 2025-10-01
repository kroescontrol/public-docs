'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { clsx } from 'clsx'

export interface AppSwitcherApp {
  name: string
  url: string
  description?: string
  icon?: React.ReactNode | string
  requiresAuth?: boolean
  requiresRole?: string
}

export interface AppSwitcherProps {
  currentApp: string
  apps?: AppSwitcherApp[]
  user?: {
    name: string
    email: string
    image?: string
    roles?: string[]
  } | undefined
  className?: string
}

// Simple theme detection for Nextra compatibility
function useNextraTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    // Detect Nextra's dark mode class on document
    const detectTheme = () => {
      const isDark = document.documentElement.classList.contains('dark')
      setTheme(isDark ? 'dark' : 'light')
    }

    // Initial detection
    detectTheme()

    // Watch for theme changes
    const observer = new MutationObserver(detectTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [])

  return { theme }
}

export const AppSwitcher = ({
  currentApp,
  apps = [],
  user,
  className,
}: AppSwitcherProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { theme } = useNextraTheme()

  // Filter apps based on auth and role requirements
  const visibleApps = apps.filter(app => {
    // If app requires auth and user is not authenticated, hide it
    if (app.requiresAuth && !user) return false
    
    // If app requires specific role and user doesn't have it, hide it
    if (app.requiresRole && (!user?.roles || !user.roles.includes(app.requiresRole))) {
      return false
    }
    
    return true
  })

  const currentAppData = visibleApps.find(app => app.name === currentApp)

  return (
    <div className={clsx('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium',
          'bg-black/[.05] dark:bg-gray-50/10 hover:bg-black/[.08] dark:hover:bg-gray-50/15',
          'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100',
          'border-0 ring-0 focus:ring-2 focus:ring-primary-500/20 focus:bg-black/[.08] dark:focus:bg-gray-50/15',
          isOpen && 'bg-black/[.08] dark:bg-gray-50/15'
        )}
        aria-label="Switch application"
      >
        <span className="text-sm font-medium">{currentAppData?.name || currentApp}</span>
        <div className="flex flex-col">
          <ChevronUp className='h-2.5 w-2.5 text-gray-400 dark:text-gray-400 -mb-0.5' />
          <ChevronDown className='h-2.5 w-2.5 text-gray-400 dark:text-gray-400' />
        </div>
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className='fixed inset-0 z-10'
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown - positioned directly below button */}
          <div 
            className='absolute right-0 z-20 w-64 max-w-[calc(100vw-1rem)] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl mt-2 ring-1 ring-black/5 dark:ring-white/10'
          >
            <div className='p-2'>
              <div className='mb-2 px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                Wissel van Applicatie
              </div>
              {(() => {
                // Sort visible apps: current app first, then others
                const currentAppData = visibleApps.find(app => app.name === currentApp)
                const otherApps = visibleApps.filter(app => app.name !== currentApp)
                const sortedApps = currentAppData ? [currentAppData, ...otherApps] : visibleApps
                
                return sortedApps.map(app => (
                <a
                  key={app.name}
                  href={(() => {
                    const url = new URL(app.url)
                    // Pass current theme to other apps
                    url.searchParams.set('theme', theme)
                    return url.toString()
                  })()}
                  className={clsx(
                    'flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors',
                    app.name === currentApp
                      ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:ring-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {app.icon && (
                    <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                      {typeof app.icon === 'string' ? app.icon : app.icon}
                    </span>
                  )}
                  <div>
                    <div className='font-medium text-sm'>{app.name}</div>
                    {app.description && (
                      <div className='text-xs text-gray-500 dark:text-gray-400'>
                        {app.description}
                      </div>
                    )}
                  </div>
                </a>
                ))
              })()}
            </div>
          </div>
        </>
      )}
    </div>
  )
}