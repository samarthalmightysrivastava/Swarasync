'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useGameStore } from '@/lib/store'
import { getPathColors, triggerHaptic, calculateHarmony, calculateTimingScore, calculateSequenceScore } from '@/lib/utils'
import type { PathType, RoundResult } from '@/lib/types'

interface SimpleGameEngineProps {
  onRoundComplete?: (result: RoundResult) => void
  onSessionComplete?: (results: RoundResult[]) => void
}

export default function SimpleGameEngine({ onRoundComplete, onSessionComplete }: SimpleGameEngineProps) {
  const gameStateRef = useRef({
    isBreathing: false,
    breathStartTime: 0,
    breathPhase: 'idle' as 'idle' | 'inhale' | 'exhale' | 'nodes',
    nodes: [] as Array<{ id: number; hit: boolean; targetTime: number; angle: number }>,
    nodeHits: 0,
    roundResults: [] as RoundResult[],
    inhaleActual: 0,
    exhaleActual: 0
  })

  const {
    path,
    currentRound,
    totalRounds,
    isPlaying,
    isPaused,
    inhaleTarget,
    exhaleTarget,
    tolerance,
    nodeCount,
    tickRate,
    nextRound,
    endGame
  } = useGameStore()

  const [breathPhase, setBreathPhase] = useState<'idle' | 'inhale' | 'exhale' | 'nodes'>('idle')
  const [breathProgress, setBreathProgress] = useState(0)
  const [nodes, setNodes] = useState<Array<{ id: number; hit: boolean; active: boolean; angle: number }>>([])
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0)

  const colors = getPathColors(path)

  // Reset when game starts
  useEffect(() => {
    if (isPlaying) {
      // Always reset to idle when game starts
      gameStateRef.current.breathPhase = 'idle'
      setBreathPhase('idle')
      setBreathProgress(0)
      setNodes([])
      setCurrentNodeIndex(0)
    }
  }, [isPlaying])

  // Main game loop
  useEffect(() => {
    if (!isPlaying || isPaused) return

    const interval = setInterval(() => {
      const state = gameStateRef.current
      const now = performance.now()

      switch (state.breathPhase) {
        case 'inhale':
          if (state.breathStartTime > 0) {
            const elapsed = (now - state.breathStartTime) / 1000
            
            if (state.isBreathing) {
              // Still breathing in
              const progress = Math.min(elapsed / inhaleTarget, 1)
              setBreathProgress(progress)
              
              // Auto-complete if target reached
              if (progress >= 1) {
                state.isBreathing = false
              }
            } else {
              // Inhale ended, move to exhale
              state.inhaleActual = elapsed
              state.breathPhase = 'exhale'
              state.breathStartTime = now
              setBreathPhase('exhale')
            }
          }
          break

        case 'exhale':
          if (!state.isBreathing && state.breathStartTime > 0) {
            const elapsed = (now - state.breathStartTime) / 1000
            const progress = Math.min(elapsed / exhaleTarget, 1)
            setBreathProgress(1 - progress) // Reverse for exhale

            if (elapsed >= exhaleTarget) {
              // Exhale complete, spawn nodes
              state.exhaleActual = elapsed
              spawnNodes()
            }
          }
          break

        case 'nodes':
          // Handle node timing
          updateNodeTiming()
          break
      }
    }, 16) // ~60fps

    return () => clearInterval(interval)
  }, [isPlaying, isPaused, inhaleTarget, exhaleTarget, nodeCount, tickRate])

  // Spawn rhythm nodes
  const spawnNodes = () => {
    const state = gameStateRef.current
    state.nodes = []
    state.nodeHits = 0

    const newNodes = Array.from({ length: nodeCount }, (_, i) => ({
      id: i,
      hit: false,
      active: false,
      angle: (i / nodeCount) * 360,
      targetTime: performance.now() + (i + 1) * (1000 / tickRate)
    }))

    state.nodes = newNodes.map(n => ({
      id: n.id,
      hit: false,
      targetTime: n.targetTime,
      angle: n.angle
    }))

    setNodes(newNodes)
    setCurrentNodeIndex(0)
    state.breathPhase = 'nodes'
    setBreathPhase('nodes')
  }

  // Update node timing and highlights
  const updateNodeTiming = () => {
    const state = gameStateRef.current
    const now = performance.now()

    setNodes(prevNodes => 
      prevNodes.map(node => {
        const targetNode = state.nodes.find(n => n.id === node.id)
        const timeDiff = targetNode ? Math.abs(now - targetNode.targetTime) : 999999
        return {
          ...node,
          active: timeDiff <= 300 && !node.hit // 300ms window for visual cue
        }
      })
    )

    // Auto-complete round after timeout
    const allTargetsPassed = state.nodes.every(node => 
      now > node.targetTime + 500 // 500ms grace period
    )

    if (allTargetsPassed) {
      completeRound()
    }
  }

  // Handle node tap
  const handleNodeTap = (nodeId: number) => {
    const state = gameStateRef.current
    const node = state.nodes.find(n => n.id === nodeId)
    if (!node || node.hit) return

    const now = performance.now()
    const timeDiff = Math.abs(now - node.targetTime)

    // Check if within timing window (±120ms by default)
    if (timeDiff <= 120) {
      node.hit = true
      state.nodeHits++

      // Update UI
      setNodes(prevNodes =>
        prevNodes.map(n =>
          n.id === nodeId ? { ...n, hit: true } : n
        )
      )

      // Haptic feedback
      triggerHaptic('light')

      // Check if all nodes hit
      if (state.nodeHits === nodeCount) {
        setTimeout(() => completeRound(), 300) // Small delay for visual feedback
      }
    }
  }

  // Complete current round
  const completeRound = () => {
    const state = gameStateRef.current

    // Calculate scores
    const timingScore = calculateTimingScore(inhaleTarget, state.inhaleActual, tolerance)
    const sequenceScore = calculateSequenceScore(state.nodeHits, nodeCount)
    const recentScores = state.roundResults.slice(-4).map(r => r.harmony)
    const consistencyScore = recentScores.length >= 2 ? 
      100 - Math.min(30, Math.abs(timingScore - (recentScores.reduce((sum, s) => sum + s, 0) / recentScores.length))) : 100

    const harmony = calculateHarmony(timingScore, sequenceScore, consistencyScore)

    const result: RoundResult = {
      timingScore,
      sequenceScore,
      consistencyScore,
      harmony,
      inhaleActual: state.inhaleActual,
      exhaleActual: state.exhaleActual,
      nodeHits: state.nodeHits,
      totalNodes: nodeCount
    }

    state.roundResults.push(result)

    // Reset for next round
    state.breathPhase = 'idle'
    state.nodes = []
    setBreathPhase('idle')
    setBreathProgress(0)
    setNodes([])

    onRoundComplete?.(result)

    // Check if session complete
    if (currentRound >= totalRounds) {
      endGame()
      onSessionComplete?.(state.roundResults)
    } else {
      nextRound()
    }
  }

  // Touch handlers
  const handleTouchStart = useCallback(() => {
    if (!isPlaying || isPaused || breathPhase !== 'idle') return

    const state = gameStateRef.current
    state.isBreathing = true
    state.breathStartTime = performance.now()
    state.breathPhase = 'inhale'
    setBreathPhase('inhale')

    triggerHaptic('medium')
  }, [isPlaying, isPaused, breathPhase])

  const handleTouchEnd = useCallback(() => {
    if (!isPlaying || isPaused || breathPhase !== 'inhale') return

    const state = gameStateRef.current
    state.isBreathing = false
    // Phase transition handled in game loop
  }, [isPlaying, isPaused, breathPhase])

  return (
    <div className="relative w-80 h-80 mx-auto">
      {/* Main breath circle */}
      <div 
        className="absolute top-4 left-4 w-72 h-72 rounded-full border-4 transition-all duration-300 cursor-pointer select-none"
        style={{
          borderColor: colors.primary,
          backgroundColor: breathPhase === 'inhale' ? `${colors.primary}40` : `${colors.primary}20`,
          transform: `scale(${1 + (breathProgress * 0.3)})`,
          opacity: breathPhase === 'inhale' ? 0.8 + (breathProgress * 0.2) : 0.6 + (breathProgress * 0.4),
          borderWidth: breathPhase === 'inhale' ? '6px' : '4px'
        }}
        onMouseDown={(e) => {
          e.preventDefault()
          handleTouchStart()
        }}
        onMouseUp={(e) => {
          e.preventDefault()
          handleTouchEnd()
        }}
        onTouchStart={(e) => {
          e.preventDefault()
          handleTouchStart()
        }}
        onTouchEnd={(e) => {
          e.preventDefault()
          handleTouchEnd()
        }}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* Progress ring */}
        {breathProgress > 0 && (
          <div 
            className="absolute inset-0 rounded-full border-4"
            style={{
              borderColor: colors.darkest,
              background: `conic-gradient(${colors.darkest} ${breathProgress * 360}deg, transparent ${breathProgress * 360}deg)`
            }}
          />
        )}

        {/* Center bindu */}
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
          style={{ backgroundColor: colors.darkest }}
        />

        {/* Rhythm nodes */}
        {nodes.map((node) => {
          const radius = 45 // percentage from center
          const radian = (node.angle - 90) * (Math.PI / 180) // Start from top
          const x = 50 + radius * Math.cos(radian) // 50% = center
          const y = 50 + radius * Math.sin(radian)

          return (
            <button
              key={node.id}
              className={`absolute w-6 h-6 rounded-full border-2 transition-all duration-200 transform -translate-x-1/2 -translate-y-1/2 ${
                node.hit 
                  ? 'scale-125' 
                  : node.active 
                    ? 'scale-110 animate-pulse' 
                    : 'scale-100'
              }`}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                backgroundColor: node.hit ? colors.primary : node.active ? colors.secondary : `${colors.secondary}80`,
                borderColor: node.hit ? colors.darkest : node.active ? colors.primary : colors.primary,
                zIndex: 10
              }}
              onClick={() => handleNodeTap(node.id)}
              disabled={node.hit}
            />
          )
        })}
      </div>

      {/* Game HUD */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-2 pointer-events-none text-sm">
        <span className="text-central-700">
          Round {currentRound}/{totalRounds}
        </span>
        <span className="text-central-600">
          {getPathName(path)}
        </span>
      </div>

      {/* Phase indicator */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center pointer-events-none">
        <div className="bg-white/90 rounded-xl px-4 py-2 shadow-lg">
          <div className="font-medium text-central-900 text-lg">
            {breathPhase === 'idle' ? 'Press to Begin' : 
             breathPhase === 'inhale' ? 'Breathe In' :
             breathPhase === 'exhale' ? 'Breathe Out' :
             'Tap the Lights'}
          </div>
          {breathPhase !== 'idle' && breathPhase !== 'nodes' && (
            <div className="text-sm text-central-600">
              {Math.round(breathProgress * 100)}%
            </div>
          )}
          {breathPhase === 'nodes' && (
            <div className="text-sm text-central-600">
              {nodes.filter(n => n.hit).length}/{nodes.length} tapped
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Helper function for path names
function getPathName(path: PathType): string {
  switch (path) {
    case 'lunar': return 'Moon'
    case 'solar': return 'Sun'
    case 'central': return 'Central'
    default: return 'Path'
  }
}