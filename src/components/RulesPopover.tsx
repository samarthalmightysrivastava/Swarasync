'use client'

import { X, Play, Square, MousePointer } from 'lucide-react'

interface RulesPopoverProps {
  isOpen: boolean
  onClose: () => void
}

export default function RulesPopover({ isOpen, onClose }: RulesPopoverProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-central-200">
          <h2 className="font-heading text-xl font-semibold text-central-900">
            How to Play
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-central-100 transition-colors"
          >
            <X size={20} className="text-central-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Instructions */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-semibold text-central-900">
              Three Simple Steps
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-central-500 text-white rounded-full flex items-center justify-center font-semibold">
                  1
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Play size={16} className="text-central-600" />
                    <span className="font-medium text-central-900">Press to Inhale</span>
                  </div>
                  <p className="text-sm text-central-700">
                    Hold down on the breath circle and breathe in slowly. 
                    The circle will expand as you fill your lungs naturally.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-central-500 text-white rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Square size={16} className="text-central-600" />
                    <span className="font-medium text-central-900">Release to Exhale</span>
                  </div>
                  <p className="text-sm text-central-700">
                    Let go and breathe out gently. The circle will contract 
                    as you release the breath at your natural pace.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-central-500 text-white rounded-full flex items-center justify-center font-semibold">
                  3
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <MousePointer size={16} className="text-central-600" />
                    <span className="font-medium text-central-900">Tap the Lights</span>
                  </div>
                  <p className="text-sm text-central-700">
                    Rhythm nodes will appear around the circle. 
                    Tap each one when it lights up on the gentle beat.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Scoring */}
          <div className="space-y-3">
            <h3 className="font-heading text-lg font-semibold text-central-900">
              Harmony Score
            </h3>
            <div className="bg-central-50 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-central-700">Timing (50%)</span>
                <span className="text-xs text-central-600">Breath rhythm accuracy</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-central-700">Sequence (30%)</span>
                <span className="text-xs text-central-600">Node tap precision</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-central-700">Consistency (20%)</span>
                <span className="text-xs text-central-600">Steady performance</span>
              </div>
            </div>
            <p className="text-xs text-central-600">
              Higher harmony scores create more beautiful mandala patterns and unlock achievements.
            </p>
          </div>

          {/* Safety Reminders */}
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
            <h4 className="font-medium text-amber-900 mb-2">Safety Reminders</h4>
            <ul className="space-y-1 text-sm text-amber-800">
              <li>• Breathe naturally—never force or hold your breath</li>
              <li>• Stop immediately if you feel dizzy or uncomfortable</li>
              <li>• This is gentle attention practice, not medical treatment</li>
              <li>• Trust your body and go at your own pace</li>
            </ul>
          </div>

          {/* Tips */}
          <div className="space-y-3">
            <h3 className="font-heading text-lg font-semibold text-central-900">
              Gentle Tips
            </h3>
            <div className="space-y-2 text-sm text-central-700">
              <p>
                <strong>Focus on rhythm, not perfection.</strong> The goal is calm, 
                consistent attention rather than perfect scores.
              </p>
              <p>
                <strong>Let your breath lead.</strong> The app adapts to your natural timing, 
                so don't try to match a predetermined pace.
              </p>
              <p>
                <strong>Gentle persistence.</strong> A few mindful rounds are better 
                than forcing a long session.
              </p>
              <p>
                <strong>Enjoy the journey.</strong> Each mandala pattern you create 
                is unique to your breath and attention.
              </p>
            </div>
          </div>

          {/* Path-Specific Notes */}
          <div className="space-y-3">
            <h3 className="font-heading text-lg font-semibold text-central-900">
              About the Paths
            </h3>
            <div className="grid gap-3">
              <div className="flex items-start gap-3 p-3 bg-moon-50 rounded-lg border border-moon-200">
                <div className="w-3 h-3 rounded-full bg-moon-500 flex-shrink-0 mt-1"></div>
                <div>
                  <div className="font-medium text-moon-900">Moon (Idā)</div>
                  <div className="text-sm text-moon-700">
                    Slower, more reflective rhythm. Perfect for evening or quiet moments.
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-sun-50 rounded-lg border border-sun-200">
                <div className="w-3 h-3 rounded-full bg-sun-500 flex-shrink-0 mt-1"></div>
                <div>
                  <div className="font-medium text-sun-900">Sun (Piṅgalā)</div>
                  <div className="text-sm text-sun-700">
                    Slightly more energizing rhythm. Great for morning or active preparation.
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-central-50 rounded-lg border border-central-200">
                <div className="w-3 h-3 rounded-full bg-central-500 flex-shrink-0 mt-1"></div>
                <div>
                  <div className="font-medium text-central-900">Central (Suṣumnā)</div>
                  <div className="text-sm text-central-700">
                    Balanced, harmonious rhythm. Ideal for meditation and centering.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-central-200 text-center">
          <button
            onClick={onClose}
            className="bg-central-500 hover:bg-central-600 text-white px-6 py-2 rounded-xl font-medium transition-colors"
          >
            Got It, Let's Begin
          </button>
        </div>
      </div>
    </div>
  )
}