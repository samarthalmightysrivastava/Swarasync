'use client'

import { useState } from 'react'
import { X, Download, RotateCcw, Compass, Trophy } from 'lucide-react'
import Link from 'next/link'
import { getRandomMessage, getPathName } from '@/lib/utils'
import type { RoundResult, PathType } from '@/lib/types'
import copy from '@/data/copy.json'

interface SummaryModalProps {
  isOpen: boolean
  onClose: () => void
  onPlayAgain: () => void
  results: RoundResult[]
  path: PathType
  mandalaDataUrl?: string
  stickersEarned?: string[]
}

export default function SummaryModal({
  isOpen,
  onClose,
  onPlayAgain,
  results,
  path,
  mandalaDataUrl,
  stickersEarned = []
}: SummaryModalProps) {
  const [isSavingMandala, setIsSavingMandala] = useState(false)

  if (!isOpen || results.length === 0) return null

  // Calculate session statistics
  const averageHarmony = Math.round(
    results.reduce((sum, r) => sum + r.harmony, 0) / results.length
  )
  
  const totalNodeHits = results.reduce((sum, r) => sum + r.nodeHits, 0)
  const totalNodes = results.reduce((sum, r) => sum + r.totalNodes, 0)
  const sequenceAccuracy = Math.round((totalNodeHits / totalNodes) * 100)
  
  const bestRound = Math.max(...results.map(r => r.harmony))
  const consistentRounds = results.filter(r => r.harmony >= 75).length

  // Get encouraging message
  const encouragingMessage = getRandomMessage(copy.summaryMessages)

  // Determine performance level for styling
  const getPerformanceLevel = (harmony: number) => {
    if (harmony >= 85) return { level: 'excellent', color: 'text-green-700', bg: 'bg-green-50' }
    if (harmony >= 70) return { level: 'good', color: 'text-blue-700', bg: 'bg-blue-50' }
    if (harmony >= 55) return { level: 'developing', color: 'text-yellow-700', bg: 'bg-yellow-50' }
    return { level: 'gentle', color: 'text-central-700', bg: 'bg-central-50' }
  }

  const performance = getPerformanceLevel(averageHarmony)

  // Save mandala image
  const handleSaveMandala = async () => {
    if (!mandalaDataUrl) return

    setIsSavingMandala(true)
    try {
      const link = document.createElement('a')
      link.download = `swarasync-mandala-${Date.now()}.png`
      link.href = mandalaDataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Failed to save mandala:', error)
    }
    setIsSavingMandala(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-central-200">
          <h2 className="font-heading text-xl font-semibold text-central-900">
            Session Complete
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
          {/* Main Harmony Score */}
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${performance.bg} mb-4`}>
              <span className={`text-3xl font-bold ${performance.color}`}>
                {averageHarmony}
              </span>
            </div>
            <h3 className="font-heading text-2xl font-semibold text-central-900 mb-2">
              Harmony Score
            </h3>
            <p className="text-central-700 leading-relaxed">
              {encouragingMessage}
            </p>
          </div>

          {/* Path Info */}
          <div className="bg-central-50 rounded-xl p-4 text-center">
            <div className="text-sm text-central-600 mb-1">Path Practiced</div>
            <div className="font-medium text-central-900">{getPathName(path)}</div>
          </div>

          {/* Session Statistics */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-semibold text-central-900">
              Session Details
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-central-200 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-central-900">{results.length}</div>
                <div className="text-sm text-central-600">Rounds</div>
              </div>
              
              <div className="bg-white border border-central-200 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-central-900">{bestRound}</div>
                <div className="text-sm text-central-600">Best Round</div>
              </div>
              
              <div className="bg-white border border-central-200 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-central-900">{sequenceAccuracy}%</div>
                <div className="text-sm text-central-600">Rhythm Accuracy</div>
              </div>
              
              <div className="bg-white border border-central-200 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-central-900">{consistentRounds}</div>
                <div className="text-sm text-central-600">Consistent Rounds</div>
              </div>
            </div>
          </div>

          {/* Stickers Earned */}
          {stickersEarned.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Trophy size={20} className="text-yellow-600" />
                <h4 className="font-heading text-lg font-semibold text-central-900">
                  Achievements Unlocked
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {stickersEarned.map((sticker, index) => (
                  <div
                    key={index}
                    className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2"
                  >
                    <div className="text-sm font-medium text-yellow-900">
                      {sticker.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mandala */}
          {mandalaDataUrl && (
            <div className="space-y-3">
              <h4 className="font-heading text-lg font-semibold text-central-900">
                Your Unique Mandala
              </h4>
              <div className="bg-central-50 rounded-xl p-4 text-center">
                <img
                  src={mandalaDataUrl}
                  alt="Generated mandala from your breath session"
                  className="w-32 h-32 mx-auto rounded-full shadow-lg mb-3"
                />
                <p className="text-sm text-central-700 mb-4">
                  Created from your unique breath rhythm and attention
                </p>
                <button
                  onClick={handleSaveMandala}
                  disabled={isSavingMandala}
                  className="flex items-center gap-2 mx-auto bg-central-500 hover:bg-central-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Download size={16} />
                  {isSavingMandala ? 'Saving...' : 'Save Mandala'}
                </button>
              </div>
            </div>
          )}

          {/* Progress Insights */}
          <div className="bg-gradient-to-br from-central-50 to-moon-50 rounded-xl p-4">
            <h4 className="font-heading text-lg font-semibold text-central-900 mb-3">
              Gentle Insights
            </h4>
            <div className="space-y-2 text-sm text-central-700">
              {averageHarmony >= 85 && (
                <p>✨ Excellent harmony! Your attention is beautifully steady.</p>
              )}
              {averageHarmony >= 70 && averageHarmony < 85 && (
                <p>🌱 Good rhythm developing. Notice the natural flow emerging.</p>
              )}
              {averageHarmony < 70 && (
                <p>🕯️ Gentle beginning. Each practice deepens the awareness.</p>
              )}
              
              {consistentRounds >= results.length * 0.8 && (
                <p>🎯 Beautiful consistency throughout your session.</p>
              )}
              
              {sequenceAccuracy >= 90 && (
                <p>🎵 Wonderful rhythm awareness in the tap sequences.</p>
              )}
              
              <p className="italic">
                Remember: this is about gentle attention, not perfect performance.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-central-200 space-y-3">
          <div className="flex gap-3">
            <button
              onClick={onPlayAgain}
              className="flex-1 flex items-center justify-center gap-2 bg-central-500 hover:bg-central-600 text-white py-3 rounded-xl font-medium transition-colors"
            >
              <RotateCcw size={20} />
              Play Again
            </button>
            
            <Link
              href="/advisor"
              className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-central-700 border border-central-300 py-3 rounded-xl font-medium transition-colors"
            >
              <Compass size={20} />
              Get Guidance
            </Link>
          </div>
          
          <button
            onClick={onClose}
            className="w-full text-central-600 hover:text-central-700 py-2 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}