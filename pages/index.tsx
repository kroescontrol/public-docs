import { NextPage } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import { Briefcase, Building2, BookOpen, Users, Palette, Sparkles, Mail } from 'lucide-react'

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Kroescontrol - Publieke Documentatie</title>
        <meta name="description" content="Ontdek alles over werken bij Kroescontrol, onze bedrijfscultuur, kantoorlocaties en wat we te bieden hebben. Publieke documentatie voor iedereen." />

        {/* Open Graph / Social Media Preview (PNG for compatibility) */}
        <meta property="og:title" content="Kroescontrol - Publieke Documentatie" />
        <meta property="og:description" content="Ontdek alles over werken bij Kroescontrol, onze bedrijfscultuur en wat we te bieden hebben" />
        <meta property="og:image" content="https://docs.kroescontrol.nl/logo-icon-512.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:image" content="https://docs.kroescontrol.nl/logo-icon-512.png" />

        {/* Favicon - Magenta accent (public docs) */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="192x192" href="/logo-icon-192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/logo-icon-512.png" />
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
          {/* Hero met Logo Badge */}
          <div className="text-center mb-20">
            {/* Logo Badge */}
            <div className="flex justify-center mb-8">
              <div className="bg-white p-8 rounded-2xl shadow-2xl">
                <Image
                  src="/branding/logo/svg/kc-logo-gradientkleur.svg"
                  alt="Kroescontrol"
                  width={320}
                  height={80}
                  className="w-64 md:w-80 h-auto"
                  priority
                />
              </div>
            </div>
            <p className="text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Jouw kennismaking met Kroescontrol begint hier
            </p>
          </div>

          {/* Main Categories - Desktop only (grote cards) */}
          <div className="hidden md:grid md:grid-cols-3 gap-8 mb-16">
            {/* Over Kroescontrol */}
            <Link href="/over-kroescontrol" className="group block p-10 bg-white/95 backdrop-blur rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 border-2 border-white/50">
              <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                <Building2 className="w-16 h-16 text-[#c22757]" strokeWidth={1.5} />
              </div>
              <h3 className="text-3xl font-bold mb-4 text-gray-900 group-hover:text-[#c22757] transition">
                Over Ons
              </h3>
              <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                Wie we zijn, wat we doen en waarom we het doen
              </p>
              <span className="inline-flex items-center gap-2 text-[#c22757] font-semibold group-hover:gap-4 transition-all">
                Lees meer
                <span className="text-2xl">→</span>
              </span>
            </Link>

            {/* Cultuur */}
            <Link href="/cultuur" className="group block p-10 bg-white/95 backdrop-blur rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 border-2 border-white/50">
              <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-16 h-16 text-[#c22757]" strokeWidth={1.5} />
              </div>
              <h3 className="text-3xl font-bold mb-4 text-gray-900 group-hover:text-[#c22757] transition">
                Cultuur
              </h3>
              <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                Onze waarden, werksfeer en hoe we samenwerken
              </p>
              <span className="inline-flex items-center gap-2 text-[#c22757] font-semibold group-hover:gap-4 transition-all">
                Ontdek meer
                <span className="text-2xl">→</span>
              </span>
            </Link>

            {/* Werken bij */}
            <Link href="/werken-bij" className="group block p-10 bg-white/95 backdrop-blur rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 border-2 border-white/50">
              <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                <Briefcase className="w-16 h-16 text-[#c22757]" strokeWidth={1.5} />
              </div>
              <h3 className="text-3xl font-bold mb-4 text-gray-900 group-hover:text-[#c22757] transition">
                Werken bij
              </h3>
              <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                Ontdek wat Kroescontrol jou als werkgever biedt
              </p>
              <span className="inline-flex items-center gap-2 text-[#c22757] font-semibold group-hover:gap-4 transition-all">
                Word collega
                <span className="text-2xl">→</span>
              </span>
            </Link>
          </div>

          {/* All Links - Badges only */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {/* Mobile: toon deze 3, Desktop: verberg ze (want in grote cards) */}
            <Link href="/over-kroescontrol" className="md:hidden group p-5 bg-white/90 backdrop-blur rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-center border-2 border-white/50">
              <div className="flex justify-center mb-2 group-hover:scale-110 transition-transform">
                <Building2 className="w-8 h-8 text-[#c22757]" strokeWidth={1.5} />
              </div>
              <div className="font-bold text-gray-900">Over Ons</div>
            </Link>
            <Link href="/cultuur" className="md:hidden group p-5 bg-white/90 backdrop-blur rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-center border-2 border-white/50">
              <div className="flex justify-center mb-2 group-hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8 text-[#c22757]" strokeWidth={1.5} />
              </div>
              <div className="font-bold text-gray-900">Cultuur</div>
            </Link>
            <Link href="/werken-bij" className="md:hidden group p-5 bg-white/90 backdrop-blur rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-center border-2 border-white/50">
              <div className="flex justify-center mb-2 group-hover:scale-110 transition-transform">
                <Briefcase className="w-8 h-8 text-[#c22757]" strokeWidth={1.5} />
              </div>
              <div className="font-bold text-gray-900">Werken bij</div>
            </Link>

            {/* Deze 4 altijd zichtbaar */}
            <Link href="/bezoekers" className="group p-5 bg-white/90 backdrop-blur rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-center border-2 border-white/50">
              <div className="flex justify-center mb-2 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-[#c22757]" strokeWidth={1.5} />
              </div>
              <div className="font-bold text-gray-900">Bezoeker</div>
            </Link>
            <Link href="/home" className="group p-5 bg-white/90 backdrop-blur rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-center border-2 border-white/50">
              <div className="flex justify-center mb-2 group-hover:scale-110 transition-transform">
                <BookOpen className="w-8 h-8 text-[#c22757]" strokeWidth={1.5} />
              </div>
              <div className="font-bold text-gray-900">Documentatie</div>
            </Link>
            <Link href="/branding" className="group p-5 bg-white/90 backdrop-blur rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-center border-2 border-white/50">
              <div className="flex justify-center mb-2 group-hover:scale-110 transition-transform">
                <Palette className="w-8 h-8 text-[#c22757]" strokeWidth={1.5} />
              </div>
              <div className="font-bold text-gray-900">Branding</div>
            </Link>
            <Link href="/contact" className="group p-5 bg-white/90 backdrop-blur rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-center border-2 border-white/50">
              <div className="flex justify-center mb-2 group-hover:scale-110 transition-transform">
                <Mail className="w-8 h-8 text-[#c22757]" strokeWidth={1.5} />
              </div>
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