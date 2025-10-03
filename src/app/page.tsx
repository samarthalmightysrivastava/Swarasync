import Image from 'next/image'
import Link from 'next/link'
import { Play, Compass, BookOpen, Shield } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="flex-1 overflow-y-auto">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-16">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/illustrations/home-hero.png"
            alt=""
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <Image
              src="/icons/app-icon-192.png"
              alt="Swarasync"
              width={120}
              height={120}
              className="rounded-3xl shadow-lg"
            />
          </div>

          {/* Hero Title & Subtitle */}
          <h1 className="font-heading text-5xl md:text-7xl font-semibold text-central-900 mb-4">
            Swarasync
          </h1>
          <p className="text-xl md:text-2xl text-central-700 mb-12 font-light">
            You cultivate it—and it quietly cultivates you.
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/play"
              className="inline-flex items-center gap-3 bg-central-500 hover:bg-central-600 text-white px-8 py-4 rounded-xl font-medium transition-colors min-h-[44px] text-lg shadow-lg"
            >
              <Play size={24} />
              Start Game
            </Link>
            
            <Link
              href="/advisor"
              className="inline-flex items-center gap-3 bg-white hover:bg-gray-50 text-central-700 border-2 border-central-300 px-8 py-4 rounded-xl font-medium transition-colors min-h-[44px] text-lg shadow-lg"
            >
              <Compass size={24} />
              Swara Advisor
            </Link>
          </div>

          {/* Secondary CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 text-central-600 hover:text-central-700 font-medium transition-colors min-h-[44px]"
            >
              <BookOpen size={20} />
              Learn
            </Link>
            <Link
              href="/safety"
              className="inline-flex items-center gap-2 text-central-600 hover:text-central-700 font-medium transition-colors min-h-[44px]"
            >
              <Shield size={20} />
              Safety & Terms
            </Link>
          </div>
        </div>
      </section>

      {/* What is Swara Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-4xl font-semibold text-center mb-12 text-central-900">
            What is Swara?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Idā (Left) */}
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-moon-100 to-moon-200 border border-moon-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-moon-500 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-white/30"></div>
              </div>
              <h3 className="font-heading text-xl font-semibold mb-3 text-moon-900">
                Idā (Left)
              </h3>
              <p className="text-moon-800 leading-relaxed">
                Cooling, reflective; good for study, creating, winding down.
              </p>
            </div>

            {/* Piṅgalā (Right) */}
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-sun-100 to-sun-200 border border-sun-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sun-500 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-white/30"></div>
              </div>
              <h3 className="font-heading text-xl font-semibold mb-3 text-sun-900">
                Piṅgalā (Right)
              </h3>
              <p className="text-sun-800 leading-relaxed">
                Bright, active; good for action, speaking, workouts.
              </p>
            </div>

            {/* Suṣumnā (Both) */}
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-central-100 to-central-200 border border-central-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-central-500 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-white/30"></div>
              </div>
              <h3 className="font-heading text-xl font-semibold mb-3 text-central-900">
                Suṣumnā (Both)
              </h3>
              <p className="text-central-800 leading-relaxed">
                Balanced, centered; good for meditation and resets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-4xl font-semibold mb-12 text-central-900">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 mb-4 rounded-full bg-gradient-to-br from-central-400 to-central-600 flex items-center justify-center text-white text-2xl font-semibold">
                1
              </div>
              <h3 className="font-heading text-lg font-semibold mb-2 text-central-900">
                Press to inhale
              </h3>
              <p className="text-central-700 text-sm">
                Hold down to breathe in
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 mb-4 rounded-full bg-gradient-to-br from-central-400 to-central-600 flex items-center justify-center text-white text-2xl font-semibold">
                2
              </div>
              <h3 className="font-heading text-lg font-semibold mb-2 text-central-900">
                Release to exhale
              </h3>
              <p className="text-central-700 text-sm">
                Let go to breathe out
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 mb-4 rounded-full bg-gradient-to-br from-central-400 to-central-600 flex items-center justify-center text-white text-2xl font-semibold">
                3
              </div>
              <h3 className="font-heading text-lg font-semibold mb-2 text-central-900">
                Tap the lights on soft ticks
              </h3>
              <p className="text-central-700 text-sm">
                Follow the rhythm
              </p>
            </div>
          </div>

          <div className="bg-central-50 rounded-2xl p-8 border border-central-200">
            <h3 className="font-heading text-xl font-semibold mb-4 text-central-900">
              Why it helps
            </h3>
            <p className="text-central-700 leading-relaxed">
              Calm cadence, gentle attention, visual reward. Non-medical.
            </p>
          </div>
        </div>
      </section>

      {/* Mini Demo Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-central-50 to-moon-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-3xl font-semibold mb-8 text-central-900">
            Experience the Flow
          </h2>
          
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-central-200">
            <div className="relative w-48 h-48 mx-auto mb-6">
              {/* Subtle animation preview */}
              <div className="absolute inset-0 rounded-full border-4 border-central-200 animate-pulse-slow"></div>
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-central-300 to-central-500 animate-shimmer"></div>
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-white to-central-100"></div>
            </div>
            
            <p className="text-central-600 mb-6">
              A gentle rhythm that guides your breath and attention
            </p>
            
            <Link
              href="/play"
              className="inline-flex items-center gap-2 bg-central-500 hover:bg-central-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              <Play size={20} />
              Try It Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-central-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <Link href="/learn" className="text-central-300 hover:text-white transition-colors">
              Learn
            </Link>
            <Link href="/safety" className="text-central-300 hover:text-white transition-colors">
              Safety & Terms
            </Link>
            <Link href="/privacy" className="text-central-300 hover:text-white transition-colors">
              Privacy
            </Link>
          </div>
          <p className="text-central-400 text-sm">
            © 2024 Swarasync. A gentle practice for gentle attention.
          </p>
        </div>
      </footer>
    </main>
  )
}