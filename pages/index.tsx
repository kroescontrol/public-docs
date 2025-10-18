import { NextPage } from 'next'
import Link from 'next/link'
import Head from 'next/head'

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Kroescontrol - Publieke Documentatie</title>
        <meta name="description" content="Ontdek alles over werken bij Kroescontrol, onze bedrijfscultuur, kantoorlocaties en wat we te bieden hebben. Publieke documentatie voor iedereen." />
      </Head>
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #c22757 0%, #222b5b 100%)'
    }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20 relative z-10">
        {/* Hero */}
        <div className="text-center mb-20">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
            Kroescontrol
          </h1>
          <p className="text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Publieke documentatie, bedrijfsinformatie en alles over werken bij Kroescontrol
          </p>
        </div>

        {/* Main Categories */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Werken bij */}
          <Link href="/werken-bij" className="group block p-10 bg-white/95 backdrop-blur rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 border-2 border-white/50">
            <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">💼</div>
            <h3 className="text-3xl font-bold mb-4 text-gray-900 group-hover:text-purple-600 transition">
              Werken bij
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed text-lg">
              Ontdek onze cultuur en hoe je onderdeel wordt van ons team
            </p>
            <span className="inline-flex items-center gap-2 text-purple-600 font-semibold group-hover:gap-4 transition-all">
              Meer info
              <span className="text-2xl">→</span>
            </span>
          </Link>

          {/* Over Kroescontrol */}
          <Link href="/over-kroescontrol" className="group block p-10 bg-white/95 backdrop-blur rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 border-2 border-white/50">
            <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">🏢</div>
            <h3 className="text-3xl font-bold mb-4 text-gray-900 group-hover:text-blue-600 transition">
              Over Ons
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed text-lg">
              Wie we zijn, wat we doen en waarom we het doen. Onze geschiedenis en visie
            </p>
            <span className="inline-flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-4 transition-all">
              Lees meer
              <span className="text-2xl">→</span>
            </span>
          </Link>

          {/* Documentatie */}
          <Link href="/home" className="group block p-10 bg-white/95 backdrop-blur rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 border-2 border-white/50">
            <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">📖</div>
            <h3 className="text-3xl font-bold mb-4 text-gray-900 group-hover:text-pink-600 transition">
              Documentatie
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed text-lg">
              Volledige documentatie, procedures en informatie over onze werkwijze
            </p>
            <span className="inline-flex items-center gap-2 text-pink-600 font-semibold group-hover:gap-4 transition-all">
              Naar docs
              <span className="text-2xl">→</span>
            </span>
          </Link>
        </div>

        {/* Secondary Links */}
        <div className="grid md:grid-cols-4 gap-6 mb-20">
          <Link href="/kantoor" className="group p-5 bg-white/90 backdrop-blur rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-center border-2 border-white/50">
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🏛️</div>
            <div className="font-bold text-gray-900">Kantoor</div>
          </Link>
          <Link href="/branding" className="group p-5 bg-white/90 backdrop-blur rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-center border-2 border-white/50">
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🎨</div>
            <div className="font-bold text-gray-900">Branding</div>
          </Link>
          <Link href="/cultuur" className="group p-5 bg-white/90 backdrop-blur rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-center border-2 border-white/50">
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">✨</div>
            <div className="font-bold text-gray-900">Cultuur</div>
          </Link>
          <Link href="/contact" className="group p-5 bg-white/90 backdrop-blur rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-center border-2 border-white/50">
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📧</div>
            <div className="font-bold text-gray-900">Contact</div>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center">
          <div className="inline-block bg-white/20 backdrop-blur-lg rounded-2xl px-8 py-6 border-2 border-white/30">
            <p className="text-white font-semibold text-lg">Kroescontrol - Publieke Documentatie</p>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default HomePage