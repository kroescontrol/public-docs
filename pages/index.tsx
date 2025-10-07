import { NextPage } from 'next'
import Link from 'next/link'

const HomePage: NextPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            📚 Kroescontrol
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Publieke documentatie, bedrijfsinformatie en alles over werken bij Kroescontrol
          </p>
        </div>

        {/* Main Categories */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Werken bij */}
          <Link href="/werken-bij" className="group block p-8 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-blue-200">
            <div className="text-4xl mb-4">💼</div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-900 group-hover:text-blue-600 transition">
              Werken bij
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Ontdek carrièremogelijkheden, onze cultuur en hoe je onderdeel wordt van ons team
            </p>
            <span className="text-blue-600 font-medium group-hover:translate-x-1 inline-block transition-transform">
              Meer info →
            </span>
          </Link>

          {/* Over Kroescontrol */}
          <Link href="/over-kroescontrol" className="group block p-8 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-blue-200">
            <div className="text-4xl mb-4">🏢</div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-900 group-hover:text-blue-600 transition">
              Over Ons
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Wie we zijn, wat we doen en waarom we het doen. Onze geschiedenis en visie
            </p>
            <span className="text-blue-600 font-medium group-hover:translate-x-1 inline-block transition-transform">
              Lees meer →
            </span>
          </Link>

          {/* Documentatie */}
          <Link href="/home" className="group block p-8 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-blue-200">
            <div className="text-4xl mb-4">📖</div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-900 group-hover:text-blue-600 transition">
              Documentatie
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Volledige documentatie, procedures en informatie over onze werkwijze
            </p>
            <span className="text-blue-600 font-medium group-hover:translate-x-1 inline-block transition-transform">
              Naar docs →
            </span>
          </Link>
        </div>

        {/* Secondary Links */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          <Link href="/kantoor" className="p-4 bg-white rounded-lg shadow-sm hover:shadow transition text-center border border-gray-100 hover:border-blue-200">
            <div className="text-2xl mb-2">🏛️</div>
            <div className="font-medium text-gray-900">Kantoor</div>
          </Link>
          <Link href="/branding" className="p-4 bg-white rounded-lg shadow-sm hover:shadow transition text-center border border-gray-100 hover:border-blue-200">
            <div className="text-2xl mb-2">🎨</div>
            <div className="font-medium text-gray-900">Branding</div>
          </Link>
          <Link href="/cultuur" className="p-4 bg-white rounded-lg shadow-sm hover:shadow transition text-center border border-gray-100 hover:border-blue-200">
            <div className="text-2xl mb-2">✨</div>
            <div className="font-medium text-gray-900">Cultuur</div>
          </Link>
          <Link href="/contact" className="p-4 bg-white rounded-lg shadow-sm hover:shadow transition text-center border border-gray-100 hover:border-blue-200">
            <div className="text-2xl mb-2">📧</div>
            <div className="font-medium text-gray-900">Contact</div>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p className="mb-2">Kroescontrol - Publieke Documentatie</p>
          <p>Voor interne documentatie, zie <a href="https://internal.docs.kroescontrol.nl" className="text-blue-600 hover:underline">internal.docs.kroescontrol.nl</a></p>
        </div>
      </div>
    </div>
  )
}

export default HomePage