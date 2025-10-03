'use client'

import { useState } from 'react'
import { Play, Pause, RotateCcw, Settings, Info } from 'lucide-react'
import { useGameStore, useUserStore } from '@/lib/store'
import type { PathType, SessionSize } from '@/lib/types'

interface GameControlsProps {
  onStartGame?: () => void
  onPauseGame?: () => void
  onResetGame?: () => void
  onShowRules?: () => void
}

export default function GameControls({
  onStartGame,
  onPauseGame, 
  onResetGame,
  onShowRules
}: GameControlsProps) {
  const {
    path,
    sessionSize,
    isPlaying,
    isPaused,
    setPath,
    setSessionSize,
    startGame,
    pauseGame,
    resumeGame,
    reset
  } = useGameStore()

  const { preferences } = useUserStore()
  const [showSettings, setShowSettings] = useState(false)

  const pathOptions: Array<{ key: PathType; name: string; description: string; color: string }> = [
    { 
      key: 'lunar', 
      name: 'Moon', 
      description: 'Idā (Left) - Cooling, reflective',
      color: 'bg-moon-500'
    },
    { 
      key: 'solar', 
      name: 'Sun', 
      description: 'Piṅgalā (Right) - Warming, active',
      color: 'bg-sun-500'
    },
    { 
      key: 'central', 
      name: 'Central', 
      description: 'Suṣumnā (Both) - Balanced, centered',
      color: 'bg-central-500'
    }
  ]

  const sessionOptions: Array<{ key: SessionSize; name: string; rounds: number; duration: string }> = [
    { key: 'quick', name: 'Quick', rounds: 6, duration: '~3 min' },
    { key: 'classic', name: 'Classic', rounds: 8, duration: '~4 min' },
    { key: 'deep', name: 'Deep', rounds: 10, duration: '~5 min' }
  ]

  const handlePathChange = (newPath: PathType) => {
    if (!isPlaying) {
      setPath(newPath)
    }
  }

  const handleSessionSizeChange = (newSize: SessionSize) => {
    if (!isPlaying) {
      setSessionSize(newSize)
    }
  }

  const handlePlayPause = () => {
    if (!isPlaying) {
      startGame()
      onStartGame?.()
    } else if (isPaused) {
      resumeGame()
    } else {
      pauseGame()
      onPauseGame?.()
    }
  }

  const handleReset = () => {
    reset()
    onResetGame?.()
  }

  return (
    <div className="game-controls space-y-6">
      {/* Path Selection */}
      {!isPlaying && (
        <div className="space-y-4">
          <h3 className="font-heading text-lg font-semibold text-central-900 text-center">
            Choose Your Path
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {pathOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => handlePathChange(option.key)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  path === option.key
                    ? 'border-central-500 bg-central-50'
                    : 'border-central-200 bg-white/50 hover:border-central-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${option.color}`}></div>
                  <div className="flex-1">
                    <div className="font-medium text-central-900">{option.name}</div>
                    <div className="text-sm text-central-600">{option.description}</div>
                  </div>
                  {path === option.key && (
                    <div className="w-2 h-2 rounded-full bg-central-500"></div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Session Size Selection */}
      {!isPlaying && (
        <div className="space-y-4">
          <h3 className="font-heading text-lg font-semibold text-central-900 text-center">
            Session Length
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {sessionOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => handleSessionSizeChange(option.key)}
                className={`p-3 rounded-xl border-2 transition-all text-center ${
                  sessionSize === option.key
                    ? 'border-central-500 bg-central-50'
                    : 'border-central-200 bg-white/50 hover:border-central-300'
                }`}
              >
                <div className="font-medium text-central-900">{option.name}</div>
                <div className="text-sm text-central-700">{option.rounds} rounds</div>
                <div className="text-xs text-central-600">{option.duration}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Controls */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handlePlayPause}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors min-h-[44px] ${
            isPlaying && !isPaused
              ? 'bg-central-200 hover:bg-central-300 text-central-700'
              : 'bg-central-500 hover:bg-central-600 text-white'
          }`}
        >
          {!isPlaying ? (
            <>
              <Play size={20} />
              Start
            </>
          ) : isPaused ? (
            <>
              <Play size={20} />
              Resume
            </>
          ) : (
            <>
              <Pause size={20} />
              Pause
            </>
          )}
        </button>
        
        {isPlaying && (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 bg-central-100 hover:bg-central-200 text-central-700 px-4 py-3 rounded-xl transition-colors min-h-[44px]"
          >
            <RotateCcw size={20} />
            Reset
          </button>
        )}
      </div>

      {/* Secondary Controls */}
      <div className="flex justify-center gap-6">
        <button
          onClick={onShowRules}
          className="flex items-center gap-2 text-central-600 hover:text-central-700 transition-colors text-sm"
        >
          <Info size={16} />
          Rules
        </button>
        
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-2 text-central-600 hover:text-central-700 transition-colors text-sm"
        >
          <Settings size={16} />
          Settings
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white/70 rounded-xl p-4 border border-central-200 space-y-3">
          <h4 className="font-medium text-central-900 mb-3">Game Settings</h4>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-central-700">Haptic Feedback</span>
            <button
              className={`w-12 h-6 rounded-full transition-colors ${
                preferences.haptics ? 'bg-central-500' : 'bg-central-200'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  preferences.haptics ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-central-700">Sound Effects</span>
            <button
              className={`w-12 h-6 rounded-full transition-colors ${
                preferences.sound ? 'bg-central-500' : 'bg-central-200'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  preferences.sound ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-central-700">Reduced Motion</span>
            <button
              className={`w-12 h-6 rounded-full transition-colors ${
                preferences.reducedMotion ? 'bg-central-500' : 'bg-central-200'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  preferences.reducedMotion ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}