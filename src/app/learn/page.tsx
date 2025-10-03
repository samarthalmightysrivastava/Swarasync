import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Heart, Compass, Play } from 'lucide-react'

export default function LearnPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-central-100 via-moon-100 to-sun-100">
      {/* Header */}
      <header className="safe-area-padding p-4 flex items-center justify-between">
        <Link 
          href="/"
          className="flex items-center gap-2 text-central-700 hover:text-central-900 transition-colors min-h-[44px] min-w-[44px]"
        >
          <ArrowLeft size={24} />
          <span className="hidden sm:inline">Home</span>
        </Link>
        
        <h1 className="font-heading text-xl font-semibold text-central-900">
          Learn
        </h1>
        
        <div className="w-[44px]"></div> {/* Spacer for balance */}
      </header>

      {/* Hero Image */}
      <section className="px-4 py-4">
        <div className="max-w-4xl mx-auto relative h-64 rounded-2xl overflow-hidden">
          <Image
            src="/illustrations/learn.png"
            alt="Sacred breath patterns and wisdom"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-central-900/30 to-transparent flex items-end">
            <div className="p-8 text-white">
              <h2 className="font-heading text-3xl font-bold mb-2">
                The Wisdom of Swara
              </h2>
              <p className="text-lg opacity-90">
                Ancient breath awareness for modern life
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/70 rounded-2xl p-8 border border-central-200 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="text-central-600" size={24} />
              <h3 className="font-heading text-2xl font-semibold text-central-900">
                A Living Tradition
              </h3>
            </div>
            
            <div className="prose prose-central max-w-none">
              <p className="text-central-700 leading-relaxed mb-4">
                Swara Yoga, rooted in the ancient text <em>Shiva Swarodaya</em>, reveals a profound truth: 
                our breath naturally alternates between nostrils throughout the day, creating rhythms 
                that influence our energy, attention, and optimal timing for activities.
              </p>
              
              <p className="text-central-700 leading-relaxed mb-4">
                This isn't mysticism—it's observable physiology. Your autonomic nervous system shifts 
                dominance every 90-120 minutes, affecting which nostril breathes more freely. 
                Ancient practitioners learned to work with these natural cycles rather than against them.
              </p>
              
              <p className="text-central-700 leading-relaxed">
                Swarasync makes this timeless wisdom accessible through gentle attention, 
                modern design, and practical guidance—no complex techniques required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Three Paths */}
      <section className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h3 className="font-heading text-2xl font-semibold text-center mb-8 text-central-900">
            The Three Pathways
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Idā Path */}
            <div className="bg-gradient-to-br from-moon-50 to-moon-100 rounded-2xl p-6 border border-moon-200">
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-moon-400 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-white/40"></div>
                </div>
                <h4 className="font-heading text-xl font-semibold text-moon-900 mb-2">
                  Idā (Left)
                </h4>
                <p className="text-sm font-medium text-moon-700 mb-4">The Moon Channel</p>
              </div>
              
              <div className="space-y-3 text-sm text-moon-800">
                <p><strong>Quality:</strong> Cooling, reflective, introspective</p>
                <p><strong>Best for:</strong> Study, creative work, planning, analysis, winding down</p>
                <p><strong>Energy:</strong> Calm, receptive, nurturing</p>
                <p><strong>Timing:</strong> Often dominant in evening hours</p>
              </div>
            </div>

            {/* Piṅgalā Path */}
            <div className="bg-gradient-to-br from-sun-50 to-sun-100 rounded-2xl p-6 border border-sun-200">
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sun-400 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-white/40"></div>
                </div>
                <h4 className="font-heading text-xl font-semibold text-sun-900 mb-2">
                  Piṅgalā (Right)
                </h4>
                <p className="text-sm font-medium text-sun-700 mb-4">The Sun Channel</p>
              </div>
              
              <div className="space-y-3 text-sm text-sun-800">
                <p><strong>Quality:</strong> Warming, active, dynamic</p>
                <p><strong>Best for:</strong> Action, speaking, workouts, negotiations, problem-solving</p>
                <p><strong>Energy:</strong> Focused, assertive, energizing</p>
                <p><strong>Timing:</strong> Often dominant in morning hours</p>
              </div>
            </div>

            {/* Suṣumnā Path */}
            <div className="bg-gradient-to-br from-central-50 to-central-100 rounded-2xl p-6 border border-central-200">
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-central-400 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-white/40"></div>
                </div>
                <h4 className="font-heading text-xl font-semibold text-central-900 mb-2">
                  Suṣumnā (Both)
                </h4>
                <p className="text-sm font-medium text-central-700 mb-4">The Central Channel</p>
              </div>
              
              <div className="space-y-3 text-sm text-central-800">
                <p><strong>Quality:</strong> Balanced, centered, unified</p>
                <p><strong>Best for:</strong> Meditation, important decisions, spiritual practice</p>
                <p><strong>Energy:</strong> Harmonious, clear, integrated</p>
                <p><strong>Timing:</strong> Rare moments of perfect balance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Swarasync Works */}
      <section className="px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h3 className="font-heading text-2xl font-semibold text-center mb-8 text-central-900">
            How Swarasync Works
          </h3>
          
          <div className="space-y-6">
            {/* Game Component */}
            <div className="bg-white/60 rounded-2xl p-6 border border-central-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-central-500 text-white rounded-xl flex items-center justify-center">
                  <Play size={20} />
                </div>
                <div>
                  <h4 className="font-heading text-lg font-semibold text-central-900 mb-2">
                    The Rhythm Game
                  </h4>
                  <p className="text-sm text-central-700 leading-relaxed mb-3">
                    Choose your current path and practice gentle breath awareness through our 
                    press-release-tap rhythm. The game adapts to your natural timing and 
                    rewards consistency with beautiful mandala patterns.
                  </p>
                  <ul className="text-sm text-central-600 space-y-1">
                    <li>• Calibrates to your personal breath rhythm</li>
                    <li>• Visual and audio feedback for gentle attention</li>
                    <li>• Creates unique art based on your harmony</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Advisor Component */}
            <div className="bg-white/60 rounded-2xl p-6 border border-central-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-central-500 text-white rounded-xl flex items-center justify-center">
                  <Compass size={20} />
                </div>
                <div>
                  <h4 className="font-heading text-lg font-semibold text-central-900 mb-2">
                    Swara Advisor
                  </h4>
                  <p className="text-sm text-central-700 leading-relaxed mb-3">
                    Get personalized guidance for your current activity based on your breath state. 
                    The advisor provides gentle techniques if timing isn't optimal, 
                    always respecting your natural rhythm.
                  </p>
                  <ul className="text-sm text-central-600 space-y-1">
                    <li>• Quick nostril state assessment</li>
                    <li>• Activity-specific recommendations</li>
                    <li>• Gentle balancing techniques when needed</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Integration */}
            <div className="bg-white/60 rounded-2xl p-6 border border-central-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-central-500 text-white rounded-xl flex items-center justify-center">
                  <Heart size={20} />
                </div>
                <div>
                  <h4 className="font-heading text-lg font-semibold text-central-900 mb-2">
                    Daily Integration
                  </h4>
                  <p className="text-sm text-central-700 leading-relaxed mb-3">
                    Build gentle awareness that flows into daily life. No complex practices—
                    just moments of conscious attention that deepen your connection 
                    to natural rhythms and optimal timing.
                  </p>
                  <ul className="text-sm text-central-600 space-y-1">
                    <li>• Simple techniques for any environment</li>
                    <li>• Gradual awareness building</li>
                    <li>• Practical wisdom for modern life</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Approach */}
      <section className="px-4 py-8">
        <div className="max-w-2xl mx-auto bg-central-50 rounded-2xl p-6 border border-central-200">
          <h3 className="font-heading text-lg font-semibold mb-4 text-central-900 text-center">
            Our Approach
          </h3>
          <div className="space-y-3 text-sm text-central-700 leading-relaxed">
            <p>
              <strong>Safety First:</strong> No breath holds, no forcing. We work with your natural 
              rhythm and always encourage stopping if you feel uncomfortable.
            </p>
            <p>
              <strong>Accessible Wisdom:</strong> Ancient knowledge presented in modern, 
              Western-friendly language without complex terminology or cultural barriers.
            </p>
            <p>
              <strong>Personal Practice:</strong> This is about gentle self-awareness, 
              not medical treatment. Trust your experience and use your judgment.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <h3 className="font-heading text-xl font-semibold mb-4 text-central-900">
            Ready to Begin?
          </h3>
          <p className="text-sm text-central-700 mb-6">
            Start with a gentle session or explore the Swara Advisor for immediate guidance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/play"
              className="inline-flex items-center justify-center gap-2 bg-central-500 hover:bg-central-600 text-white px-6 py-3 rounded-xl font-medium transition-colors min-h-[44px]"
            >
              <Play size={20} />
              Start Game
            </Link>
            
            <Link
              href="/advisor"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-central-700 border border-central-300 px-6 py-3 rounded-xl font-medium transition-colors min-h-[44px]"
            >
              <Compass size={20} />
              Get Guidance
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="safe-area-padding p-4">
        <div className="text-center">
          <Link 
            href="/safety"
            className="text-central-600 hover:text-central-700 font-medium transition-colors min-h-[44px] flex items-center justify-center"
          >
            Safety & Terms
          </Link>
        </div>
      </footer>
    </main>
  )
}