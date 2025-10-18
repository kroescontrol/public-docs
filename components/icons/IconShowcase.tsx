import React from 'react'
import {
  Shield, Cookie, FileText, CheckCircle, XCircle,
  AlertTriangle, Info, Home, Search, Menu,
  BookOpen, Code, Link2, Download, Settings,
  BarChart, Scale, Lock, Unlock
} from 'lucide-react'
import {
  ShieldCheckIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  BookOpenIcon,
  CodeBracketIcon,
  LinkIcon,
  ArrowDownTrayIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  ScaleIcon,
  LockClosedIcon,
  LockOpenIcon
} from '@heroicons/react/24/outline'

const iconSize = 32

export function IconShowcase() {
  const commonIcons = [
    { name: 'Shield', lucide: Shield, hero: ShieldCheckIcon, use: 'Privacy, Security' },
    { name: 'Cookie', lucide: Cookie, hero: null, use: 'Cookie policy (geen Hero equivalent)' },
    { name: 'FileText', lucide: FileText, hero: DocumentTextIcon, use: 'Documenten, Terms' },
    { name: 'Check', lucide: CheckCircle, hero: CheckCircleIcon, use: 'Success, Completed' },
    { name: 'Error', lucide: XCircle, hero: XCircleIcon, use: 'Error, Cancel' },
    { name: 'Warning', lucide: AlertTriangle, hero: ExclamationTriangleIcon, use: 'Warning, Alert' },
    { name: 'Info', lucide: Info, hero: InformationCircleIcon, use: 'Information' },
    { name: 'Home', lucide: Home, hero: HomeIcon, use: 'Homepage' },
    { name: 'Search', lucide: Search, hero: MagnifyingGlassIcon, use: 'Zoeken' },
    { name: 'Menu', lucide: Menu, hero: Bars3Icon, use: 'Navigation' },
    { name: 'Book', lucide: BookOpen, hero: BookOpenIcon, use: 'Documentatie' },
    { name: 'Code', lucide: Code, hero: CodeBracketIcon, use: 'Code blocks' },
    { name: 'Link', lucide: Link2, hero: LinkIcon, use: 'External links' },
    { name: 'Download', lucide: Download, hero: ArrowDownTrayIcon, use: 'Downloads' },
    { name: 'Settings', lucide: Settings, hero: Cog6ToothIcon, use: 'Instellingen' },
    { name: 'Chart', lucide: BarChart, hero: ChartBarIcon, use: 'Analytics' },
    { name: 'Scale', lucide: Scale, hero: ScaleIcon, use: 'Legal, Balance' },
    { name: 'Lock', lucide: Lock, hero: LockClosedIcon, use: 'Locked, Secure' },
    { name: 'Unlock', lucide: Unlock, hero: LockOpenIcon, use: 'Unlocked, Open' },
  ]

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem', fontFamily: 'var(--kc-font-heading)' }}>
        Icon Set Vergelijking
      </h1>

      {/* Comparison Table */}
      <div style={{
        display: 'grid',
        gap: '1rem',
        marginBottom: '3rem'
      }}>
        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '200px 1fr 1fr 1fr 250px',
          gap: '1rem',
          fontWeight: 'bold',
          borderBottom: '2px solid #e5e7eb',
          paddingBottom: '0.5rem'
        }}>
          <div>Icon Naam</div>
          <div style={{ textAlign: 'center' }}>Emoji (Current)</div>
          <div style={{ textAlign: 'center' }}>Lucide</div>
          <div style={{ textAlign: 'center' }}>Heroicons</div>
          <div>Gebruik</div>
        </div>

        {/* Rows */}
        {commonIcons.map((icon) => {
          const LucideIcon = icon.lucide
          const HeroIcon = icon.hero

          return (
            <div
              key={icon.name}
              style={{
                display: 'grid',
                gridTemplateColumns: '200px 1fr 1fr 1fr 250px',
                gap: '1rem',
                alignItems: 'center',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}
            >
              <div style={{ fontWeight: '500' }}>{icon.name}</div>

              {/* Emoji */}
              <div style={{ textAlign: 'center', fontSize: '2rem' }}>
                {icon.name === 'Shield' && '🛡️'}
                {icon.name === 'Cookie' && '🍪'}
                {icon.name === 'FileText' && '📄'}
                {icon.name === 'Check' && '✅'}
                {icon.name === 'Error' && '❌'}
                {icon.name === 'Warning' && '⚠️'}
                {icon.name === 'Info' && 'ℹ️'}
                {icon.name === 'Home' && '🏠'}
                {icon.name === 'Search' && '🔍'}
                {icon.name === 'Menu' && '☰'}
                {icon.name === 'Book' && '📖'}
                {icon.name === 'Code' && '💻'}
                {icon.name === 'Link' && '🔗'}
                {icon.name === 'Download' && '⬇️'}
                {icon.name === 'Settings' && '⚙️'}
                {icon.name === 'Chart' && '📊'}
                {icon.name === 'Scale' && '⚖️'}
                {icon.name === 'Lock' && '🔒'}
                {icon.name === 'Unlock' && '🔓'}
              </div>

              {/* Lucide */}
              <div style={{
                textAlign: 'center',
                display: 'flex',
                gap: '0.5rem',
                justifyContent: 'center'
              }}>
                <LucideIcon size={iconSize} color="#E4007C" />
                <LucideIcon size={iconSize} color="#222b5b" />
              </div>

              {/* Heroicons */}
              <div style={{
                textAlign: 'center',
                display: 'flex',
                gap: '0.5rem',
                justifyContent: 'center'
              }}>
                {HeroIcon ? (
                  <>
                    <HeroIcon style={{ width: iconSize, height: iconSize, color: '#E4007C' }} />
                    <HeroIcon style={{ width: iconSize, height: iconSize, color: '#222b5b' }} />
                  </>
                ) : (
                  <span style={{ fontSize: '0.875rem', color: '#999' }}>N/A</span>
                )}
              </div>

              {/* Use case */}
              <div style={{ fontSize: '0.875rem', color: '#666' }}>
                {icon.use}
              </div>
            </div>
          )
        })}
      </div>

      {/* Pro/Con Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '2rem',
        marginTop: '3rem'
      }}>
        {/* Emoji */}
        <div style={{
          padding: '1.5rem',
          border: '2px solid #e5e7eb',
          borderRadius: '8px'
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#E4007C' }}>
            Emoji (Current)
          </h3>
          <div style={{ marginBottom: '1rem' }}>
            <strong>✅ Voordelen:</strong>
            <ul>
              <li>Geen dependencies</li>
              <li>Universeel ondersteund</li>
              <li>Kleurrijk</li>
              <li>Instant herkenbaar</li>
            </ul>
          </div>
          <div>
            <strong>❌ Nadelen:</strong>
            <ul>
              <li>Niet consistent tussen OS/browsers</li>
              <li>Geen branding kleuren mogelijk</li>
              <li>Beperkte set beschikbaar</li>
              <li>Kan onprofessioneel ogen</li>
              <li>Geen gradient mogelijk</li>
            </ul>
          </div>
        </div>

        {/* Lucide */}
        <div style={{
          padding: '1.5rem',
          border: '2px solid #E4007C',
          borderRadius: '8px',
          background: 'rgba(228, 0, 124, 0.05)'
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#E4007C' }}>
            Lucide Icons ⭐ (Recommended)
          </h3>
          <div style={{ marginBottom: '1rem' }}>
            <strong>✅ Voordelen:</strong>
            <ul>
              <li><strong>1000+ icons</strong> beschikbaar</li>
              <li>Customizable colors (branding!)</li>
              <li>React components (makkelijk)</li>
              <li>Consistente stijl</li>
              <li>Klein bestand (~50KB)</li>
              <li>MIT license (open source)</li>
              <li><strong>Gradient mogelijk</strong></li>
              <li>Modern, professioneel design</li>
            </ul>
          </div>
          <div>
            <strong>❌ Nadelen:</strong>
            <ul>
              <li>Dependency toevoegen (+50KB)</li>
              <li>Iets meer code nodig</li>
            </ul>
          </div>
        </div>

        {/* Heroicons */}
        <div style={{
          padding: '1.5rem',
          border: '2px solid #222b5b',
          borderRadius: '8px',
          background: 'rgba(34, 43, 91, 0.05)'
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#222b5b' }}>
            Heroicons
          </h3>
          <div style={{ marginBottom: '1rem' }}>
            <strong>✅ Voordelen:</strong>
            <ul>
              <li>Van Tailwind makers (bekend)</li>
              <li>Solid + Outline variants</li>
              <li>High quality design</li>
              <li>Customizable colors</li>
              <li>React components</li>
            </ul>
          </div>
          <div>
            <strong>❌ Nadelen:</strong>
            <ul>
              <li><strong>Slechts ~300 icons</strong></li>
              <li>Geen Cookie icon!</li>
              <li>Dependency toevoegen</li>
              <li>Minder uitgebreid dan Lucide</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div style={{
        marginTop: '3rem',
        padding: '2rem',
        background: 'var(--kc-gradient-primary)',
        color: 'white',
        borderRadius: '12px'
      }}>
        <h2 style={{ marginBottom: '1rem' }}>🎯 Aanbeveling</h2>
        <p style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>
          <strong>Lucide Icons</strong> is de beste keuze omdat:
        </p>
        <ul style={{ fontSize: '1rem', lineHeight: '1.8' }}>
          <li><strong>1000+ icons</strong> vs 300 (Heroicons) = meer flexibiliteit</li>
          <li>Heeft <strong>Cookie icon</strong> (essentieel voor jullie docs!)</li>
          <li>Kan <strong>gradient kleuren</strong> gebruiken (op-brand)</li>
          <li><strong>Kleinere bundle size</strong> dan Heroicons</li>
          <li>React components = <strong>makkelijk te gebruiken</strong> in MDX</li>
          <li><strong>Professioneler</strong> dan emoji, maar wel herkenbaar</li>
        </ul>
      </div>
    </div>
  )
}
