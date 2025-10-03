'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { ArrowLeft } from 'lucide-react'
import GameControls from '@/components/GameControls'
import RulesPopover from '@/components/RulesPopover'
import SummaryModal from '@/components/SummaryModal'
import { useGameStore } from '@/lib/store'
import { KontraGameEngine } from '@/lib/kontraGame'
import type { RoundResult } from '@/lib/types'
import type { RoundScore } from '@/lib/scoring'

export default function PlayPage() {
  const [showRules, setShowRules] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [sessionResults, setSessionResults] = useState<RoundResult[]>([])
  const [mandalaDataUrl, setMandalaDataUrl] = useState<string>()
  const [gameEngine, setGameEngine] = useState<KontraGameEngine | null>(null)
  const [gameConfig, setGameConfig] = useState<any>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const { path, isPlaying, reset } = useGameStore()

  // Load game configuration
  useEffect(() => {
    fetch('/config.json')
      .then(res => res.json())
      .then(config => setGameConfig(config))
      .catch(err => console.error('Failed to load config:', err))
  }, [])

  // Initialize game engine
  useEffect(() => {
    if (!canvasRef.current || !gameConfig) return

    const engine = new KontraGameEngine(canvasRef.current, gameConfig)
    
    engine.setCallbacks(
      (score: RoundScore) => {
        // Convert RoundScore to RoundResult for compatibility
        const result: RoundResult = {
          timingScore: score.timing,
          sequenceScore: score.sequence,
          consistencyScore: score.consistency,
          harmony: score.harmony,
          inhaleActual: 0, // These would come from the engine state
          exhaleActual: 0,
          nodeHits: 0,
          totalNodes: 0
        }
        handleRoundComplete(result)
      },
      (scores: RoundScore[]) => {
        // Convert scores and export mandala
        const results: RoundResult[] = scores.map(score => ({
          timingScore: score.timing,
          sequenceScore: score.sequence,
          consistencyScore: score.consistency,
          harmony: score.harmony,
          inhaleActual: 0,
          exhaleActual: 0,
          nodeHits: 0,
          totalNodes: 0
        }))
        
        // Export mandala PNG
        const mandalaUrl = engine.exportMandala()
        setMandalaDataUrl(mandalaUrl)
        
        handleSessionComplete(results)
      }
    )

    engine.init().then(() => {
      setGameEngine(engine)
    })

    return () => {
      engine.destroy()
    }
  }, [gameConfig])

  // Update engine path when store path changes
  useEffect(() => {
    if (gameEngine && path) {
      gameEngine.setPath(path)
    }
  }, [gameEngine, path])

  // Start/stop engine based on playing state
  useEffect(() => {
    if (!gameEngine) return
    
    if (isPlaying) {
      gameEngine.start()
    } else {
      gameEngine.stop()
    }
  }, [gameEngine, isPlaying])

  const handleRoundComplete = (result: RoundResult) => {
    console.log('Round completed:', result)
    // Visual feedback for round completion could go here
  }

  const handleSessionComplete = (results: RoundResult[]) => {
    console.log('Session completed:', results)
    setSessionResults(results)
    setShowSummary(true)
  }

  const handlePlayAgain = () => {
    setShowSummary(false)
    setSessionResults([])
    setMandalaDataUrl(undefined)
    reset()
  }

  const handleCloseSummary = () => {
    setShowSummary(false)
    reset()
  }
  return (
    <>
      {/* Load Kontra.js from CDN */}
      <Script 
        src="https://unpkg.com/kontra@9/kontra.min.js"
        strategy="beforeInteractive"
      />
      
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
          Swarasync
        </h1>
        
        <div className="w-[44px]"></div> {/* Spacer for balance */}
      </header>



      {/* Game Area */}
      <section className="px-4 py-8">
        <div className="max-w-md mx-auto space-y-6">


          {/* Game Canvas */}
          <div className="relative aspect-square bg-gradient-to-br from-central-50 to-central-100 rounded-3xl border-2 border-central-200 overflow-hidden">
            <canvas
              ref={canvasRef}
              className="w-full h-full"
              style={{ display: 'block' }}
            />
            
            {/* Loading overlay */}
            {!gameEngine && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="text-white font-medium">Loading game...</div>
              </div>
            )}
          </div>

          {/* Game Controls */}
          <GameControls 
            onShowRules={() => setShowRules(true)}
          />
        </div>
      </section>

      {/* Navigation Footer */}
      {!isPlaying && (
        <footer className="safe-area-padding p-4">
          <div className="flex justify-center gap-4">
            <Link 
              href="/advisor"
              className="text-central-600 hover:text-central-700 font-medium transition-colors min-h-[44px] flex items-center"
            >
              Try Swara Advisor
            </Link>
          </div>
        </footer>
      )}

      {/* Modals */}
      <RulesPopover 
        isOpen={showRules}
        onClose={() => setShowRules(false)}
      />
      
      <SummaryModal
        isOpen={showSummary}
        onClose={handleCloseSummary}
        onPlayAgain={handlePlayAgain}
        results={sessionResults}
        path={path}
        mandalaDataUrl={mandalaDataUrl}
        stickersEarned={[]} // TODO: Calculate earned stickers
      />
    </main>
    </>
  )
}