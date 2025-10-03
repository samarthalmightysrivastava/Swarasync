import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Info, Clock, Compass } from 'lucide-react'

export default function AdvisorPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-moon-100 via-central-100 to-sun-100">
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
          Swara Advisor
        </h1>
        
        <button className="flex items-center justify-center w-[44px] h-[44px] text-central-600 hover:text-central-800 transition-colors">
          <Info size={20} />
        </button>
      </header>

      {/* Hero Image */}
      <section className="px-4 py-4">
        <div className="max-w-2xl mx-auto relative h-48 rounded-2xl overflow-hidden">
          <Image
            src="/illustrations/advisor.png"
            alt="Three breath pathways"
            fill
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-central-900/20 to-transparent"></div>
        </div>
      </section>

      {/* Current State Check */}
      <section className="px-4 py-6">
        <div className="max-w-lg mx-auto text-center mb-8">
          <h2 className="font-heading text-2xl font-semibold mb-4 text-central-900">
            Check Your Current State
          </h2>
          <div className="bg-central-50 rounded-2xl p-6 border border-central-200">
            <div className="flex items-center gap-2 mb-4 justify-center">
              <Info size={16} className="text-central-600" />
              <span className="text-sm font-medium text-central-700">How to Check</span>
            </div>
            <p className="text-sm text-central-700 leading-relaxed">
              Close your eyes and breathe normally. Place a finger under each nostril or use a tissue. 
              Notice which side has clearer, stronger airflow for 5-10 seconds.
            </p>
          </div>
        </div>

        {/* State Selection */}
        <div className="max-w-md mx-auto grid gap-4">
          <button className="group p-6 rounded-2xl bg-gradient-to-r from-moon-100 to-moon-200 border-2 border-moon-300 hover:border-moon-400 transition-all min-h-[44px]">
            <div className="text-center">
              <h3 className="font-heading text-lg font-semibold text-moon-900 mb-2">
                Left Nostril Clearer
              </h3>
              <p className="text-sm text-moon-800 mb-2">Idā Active</p>
              <p className="text-xs text-moon-700">Cooling, reflective state</p>
            </div>
          </button>

          <button className="group p-6 rounded-2xl bg-gradient-to-r from-sun-100 to-sun-200 border-2 border-sun-300 hover:border-sun-400 transition-all min-h-[44px]">
            <div className="text-center">
              <h3 className="font-heading text-lg font-semibold text-sun-900 mb-2">
                Right Nostril Clearer
              </h3>
              <p className="text-sm text-sun-800 mb-2">Piṅgalā Active</p>
              <p className="text-xs text-sun-700">Warming, active state</p>
            </div>
          </button>

          <button className="group p-6 rounded-2xl bg-gradient-to-r from-central-100 to-central-200 border-2 border-central-300 hover:border-central-400 transition-all min-h-[44px]">
            <div className="text-center">
              <h3 className="font-heading text-lg font-semibold text-central-900 mb-2">
                Both Equal
              </h3>
              <p className="text-sm text-central-800 mb-2">Suṣumnā Active</p>
              <p className="text-xs text-central-700">Balanced, centered state</p>
            </div>
          </button>
        </div>
      </section>

      {/* Task Selection */}
      <section className="px-4 py-6">
        <h3 className="font-heading text-xl font-semibold text-center mb-6 text-central-900">
          What do you want to do?
        </h3>
        
        <div className="max-w-2xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            'Study', 'Create', 'Workout', 'Present', 'Social', 'Travel',
            'Meditate', 'Rest', 'Purchase', 'Negotiate', 'Work', 'Other'
          ].map((task) => (
            <button 
              key={task}
              className="p-3 rounded-xl bg-white/60 hover:bg-white/80 border border-central-200 hover:border-central-300 transition-all text-sm font-medium text-central-800 min-h-[44px]"
            >
              {task}
            </button>
          ))}
        </div>
        
        <div className="mt-4 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Or describe your activity..."
            className="w-full p-4 rounded-xl border border-central-200 focus:border-central-400 focus:outline-none bg-white/60 text-central-900 placeholder-central-600"
          />
        </div>
      </section>

      {/* Guidance Result Placeholder */}
      <section className="px-4 py-6">
        <div className="max-w-lg mx-auto bg-white/70 rounded-2xl p-6 border border-central-200">
          <div className="text-center mb-6">
            <Compass size={32} className="mx-auto mb-3 text-central-600" />
            <h3 className="font-heading text-lg font-semibold text-central-900 mb-2">
              Ready for Guidance
            </h3>
            <p className="text-sm text-central-700">
              Select your current state and activity above to receive personalized Swara guidance.
            </p>
          </div>

          {/* Placeholder Result */}
          <div className="space-y-4 opacity-50">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-central-400"></div>
              <span className="text-sm text-central-700">Guidance will appear here</span>
            </div>
            
            <div className="bg-central-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={16} className="text-central-600" />
                <span className="text-sm font-medium text-central-700">Micro-Breath</span>
              </div>
              <p className="text-sm text-central-600">
                Gentle breathing technique recommendations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Swara */}
      <section className="px-4 py-8">
        <div className="max-w-2xl mx-auto bg-gradient-to-br from-central-50 to-moon-50 rounded-2xl p-6 border border-central-200">
          <h3 className="font-heading text-lg font-semibold mb-4 text-central-900">
            About Swara Guidance
          </h3>
          <div className="space-y-3 text-sm text-central-700 leading-relaxed">
            <p>
              Swara Yoga recognizes that our breath alternates between nostrils throughout the day, 
              creating natural rhythms that influence our energy and attention.
            </p>
            <p>
              This ancient practice suggests optimal timing for different activities based on which 
              nostril is more active, helping you work with your natural flow rather than against it.
            </p>
            <p className="text-xs text-central-600 italic">
              This guidance is based on traditional wisdom and is not medical advice. 
              Use your own judgment for important decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Navigation Footer */}
      <footer className="safe-area-padding p-4">
        <div className="flex justify-center gap-6">
          <Link 
            href="/play"
            className="text-central-600 hover:text-central-700 font-medium transition-colors min-h-[44px] flex items-center"
          >
            Try the Game
          </Link>
          <Link 
            href="/learn"
            className="text-central-600 hover:text-central-700 font-medium transition-colors min-h-[44px] flex items-center"
          >
            Learn More
          </Link>
        </div>
      </footer>
    </main>
  )
}