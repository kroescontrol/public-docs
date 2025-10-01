import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { NextPage } from 'next'

const HomePage: NextPage = () => {
  const router = useRouter()

  useEffect(() => {
    router.replace('/home')
  }, [router])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center max-w-2xl px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          📚 Kroescontrol Public Docs
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Welkom bij de publieke documentatie van Kroescontrol. 
          Hier vind je alle openbare informatie over ons bedrijf.
        </p>
        <div className="mb-8">
          <a 
            href="/home" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            → Ga naar documentatie
          </a>
        </div>
        <div className="text-sm text-gray-500">
          <p>Redirecting...</p>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mt-2"></div>
        </div>
      </div>
    </div>
  )
}

export default HomePage