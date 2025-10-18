import { useState, useEffect } from 'react'
import { optOutAnalytics, optInAnalytics, hasOptedOut } from '../lib/analytics-opt-out'

export function OptOutButton() {
  const [isOptedOut, setIsOptedOut] = useState<boolean | null>(null)

  useEffect(() => {
    setIsOptedOut(hasOptedOut())
  }, [])

  if (isOptedOut === null) {
    return <div className="loading">Laden...</div>
  }

  return (
    <div className="opt-out-container" style={{
      padding: '1.5rem',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      marginTop: '1rem',
      marginBottom: '1rem'
    }}>
      {isOptedOut ? (
        <>
          <p style={{ marginBottom: '1rem', color: '#059669', fontWeight: 'bold' }}>
            ✅ Tracking is uitgeschakeld
          </p>
          <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#6b7280' }}>
            HubSpot tracking is momenteel uitgeschakeld voor deze browser. Je wordt niet meer getracked.
          </p>
          <button
            onClick={optInAnalytics}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Tracking weer inschakelen
          </button>
        </>
      ) : (
        <>
          <p style={{ marginBottom: '1rem', color: '#dc2626', fontWeight: 'bold' }}>
            📊 Tracking is actief
          </p>
          <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#6b7280' }}>
            HubSpot tracking is momenteel actief. We verzamelen anonieme data over pagina bezoeken.
          </p>
          <button
            onClick={optOutAnalytics}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Tracking uitschakelen
          </button>
        </>
      )}
    </div>
  )
}
