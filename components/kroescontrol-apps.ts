import { AppSwitcherApp } from './AppSwitcher'

// Kroescontrol unified platform apps configuration
export const kroescontrolApps: AppSwitcherApp[] = [
  {
    name: 'docs',
    url: process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3003'
      : 'https://docs.kroescontrol.nl',
    description: 'Documentatie & handleidingen',
    icon: '📚',
  },
  {
    name: 'hub',
    url: process.env.NODE_ENV === 'development'
      ? 'https://hub.polderland.local' 
      : 'https://hub.kroescontrol.nl',
    description: 'Centraal management platform',
    icon: '🏢',
    requiresAuth: true,
  },
  {
    name: 'smoelen',
    url: process.env.NODE_ENV === 'development'
      ? 'https://smoelen.polderland.local'
      : 'https://smoelen.kroescontrol.nl', 
    description: 'Team fotogalerij',
    icon: '👥',
  },
  {
    name: 'website',
    url: process.env.NODE_ENV === 'development'
      ? 'https://website.polderland.local'
      : 'https://www.kroescontrol.nl',
    description: 'Marketing website',
    icon: '🌐',
  },
]

// Get current app based on URL or manual override
export function getCurrentApp(): string {
  if (typeof window === 'undefined') return 'docs'
  
  const hostname = window.location.hostname
  
  // Development URLs
  if (hostname === 'localhost' && window.location.port === '3003') return 'docs'
  if (hostname === 'hub.polderland.local') return 'hub'
  if (hostname === 'smoelen.polderland.local') return 'smoelen'  
  if (hostname === 'website.polderland.local') return 'website'
  
  // Production URLs
  if (hostname === 'docs.kroescontrol.nl') return 'docs'
  if (hostname === 'hub.kroescontrol.nl') return 'hub'
  if (hostname === 'smoelen.kroescontrol.nl') return 'smoelen'
  if (hostname === 'www.kroescontrol.nl' || hostname === 'kroescontrol.nl') return 'website'
  
  // Default fallback
  return 'docs'
}