'use client'

// Kontra.js types for global usage
declare global {
  var kontra: {
    init: (canvas: HTMLCanvasElement) => void
    GameLoop: (options: { update: (dt: number) => void; render: () => void }) => {
      start: () => void
      stop: () => void
    }
    Sprite: any
    Vector: any
  }
}
import { GameAudio } from './audio'
import { ScoringSystem, type RoundScore } from './scoring'
import { MandalaRenderer } from './mandala'

interface GameConfig {
  timing: any
  difficulty: any
  scoring: any
  performance: any
  audio: any
  visual: any
}

interface RhythmNode {
  id: number
  angle: number
  targetTime: number
  hit: boolean
  active: boolean
  sprite?: any
}

interface HapticFeedback {
  light: number
  medium: number
  heavy: number
}

export type GamePhase = 'idle' | 'inhale' | 'exhale' | 'nodes' | 'complete'

export interface GameState {
  phase: GamePhase
  breathProgress: number
  inhaleStart: number
  exhaleStart: number
  currentRound: number
  totalRounds: number
  nodes: RhythmNode[]
  currentNodeIndex: number
  isPressed: boolean
  lastFrameTime: number
  fps: number
  pathType: 'lunar' | 'solar' | 'central'
}

export class KontraGameEngine {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private config: GameConfig
  private gameLoop?: any
  private audio: GameAudio
  private scoring: ScoringSystem
  private mandala: MandalaRenderer
  private state: GameState
  private sprites: any[] = []
  private hapticSupported: boolean
  private onRoundComplete?: (score: RoundScore) => void
  private onGameComplete?: (scores: RoundScore[]) => void
  private performance: { frameCount: number; lastFpsUpdate: number; fps: number } = {
    frameCount: 0,
    lastFpsUpdate: 0,
    fps: 60
  }

  constructor(canvas: HTMLCanvasElement, config: GameConfig) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
    this.config = config
    
    // Initialize subsystems
    this.audio = new GameAudio(config.audio)
    this.scoring = new ScoringSystem(config)
    
    // Setup mandala renderer
    const pathColors = this.getPathColors('central') // Default path
    this.mandala = new MandalaRenderer(canvas, config.visual.mandalaPetals, pathColors)
    
    // Check haptic support
    this.hapticSupported = 'vibrate' in navigator
    
    // Initialize game state
    this.state = {
      phase: 'idle',
      breathProgress: 0,
      inhaleStart: 0,
      exhaleStart: 0,
      currentRound: 1,
      totalRounds: 7,
      nodes: [],
      currentNodeIndex: 0,
      isPressed: false,
      lastFrameTime: performance.now(),
      fps: 60,
      pathType: 'central'
    }
  }

  async init(): Promise<void> {
    // Wait for Kontra to be available
    while (typeof kontra === 'undefined') {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    // Initialize Kontra
    kontra.init(this.canvas)
    
    // Setup canvas scaling for performance
    this.setupCanvasScaling()
    
    // Initialize audio
    await this.audio.init()
    
    // Setup input handlers
    this.setupInputHandlers()
    
    // Create game loop
    this.createGameLoop()
  }

  private setupCanvasScaling(): void {
    const dpr = Math.min(window.devicePixelRatio || 1, this.config.performance.maxPixelRatio)
    const size = this.config.performance.baseCanvasSize
    
    this.canvas.width = size * dpr
    this.canvas.height = size * dpr
    this.canvas.style.width = size + 'px'
    this.canvas.style.height = size + 'px'
    
    this.ctx.scale(dpr, dpr)
  }

  private setupInputHandlers(): void {
    // Touch events for mobile
    this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false })
    this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false })
    this.canvas.addEventListener('touchcancel', this.handleTouchEnd.bind(this), { passive: false })
    
    // Mouse events for desktop
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this))
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this))
    this.canvas.addEventListener('mouseleave', this.handleMouseUp.bind(this))
    
    // Prevent context menu
    this.canvas.addEventListener('contextmenu', e => e.preventDefault())
  }

  private handleTouchStart(e: TouchEvent): void {
    e.preventDefault()
    if (e.touches.length > 1) return // Ignore multi-touch
    
    this.handlePressStart()
  }

  private handleTouchEnd(e: TouchEvent): void {
    e.preventDefault()
    this.handlePressEnd()
  }

  private handleMouseDown(e: MouseEvent): void {
    e.preventDefault()
    this.handlePressStart()
  }

  private handleMouseUp(e: MouseEvent): void {
    e.preventDefault()
    this.handlePressEnd()
  }

  private handlePressStart(): void {
    if (this.state.phase === 'idle') {
      this.startInhale()
    } else if (this.state.phase === 'nodes') {
      this.handleNodeTap()
    }
    
    this.state.isPressed = true
  }

  private handlePressEnd(): void {
    if (this.state.phase === 'inhale' && this.state.isPressed) {
      this.startExhale()
    }
    
    this.state.isPressed = false
  }

  private startInhale(): void {
    this.state.phase = 'inhale'
    this.state.inhaleStart = performance.now()
    this.state.breathProgress = 0
    
    this.audio.resume()
    this.audio.startDrone()
    this.triggerHaptic('medium')
  }

  private startExhale(): void {
    this.state.phase = 'exhale'
    this.state.exhaleStart = performance.now()
    this.state.breathProgress = 1
    
    this.triggerHaptic('light')
  }

  private spawnNodes(): void {
    const difficulty = this.scoring.getDifficulty()
    const nodeCount = difficulty.nodes
    const tickInterval = this.config.timing.tickInterval
    
    this.state.nodes = []
    this.state.currentNodeIndex = 0
    
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2 - Math.PI / 2 // Start from top
      const targetTime = performance.now() + (i + 1) * tickInterval
      
      const node: RhythmNode = {
        id: i,
        angle,
        targetTime,
        hit: false,
        active: false
      }
      
      this.state.nodes.push(node)
    }
    
    this.state.phase = 'nodes'
  }

  private handleNodeTap(): void {
    const activeNode = this.state.nodes.find(node => node.active && !node.hit)
    if (!activeNode) return
    
    const now = performance.now()
    const timingDelta = now - activeNode.targetTime
    const window = this.config.timing.tapWindow
    
    if (Math.abs(timingDelta) <= window) {
      activeNode.hit = true
      this.audio.playTick(1 - Math.abs(timingDelta) / window) // Intensity based on timing
      this.triggerHaptic('light')
      
      // Add to mandala
      const radius = (this.canvas.height / 4) + (Math.random() - 0.5) * 20
      this.mandala.addPoint(radius, activeNode.angle, timingDelta, 1.0)
      
      // Check if all nodes hit
      if (this.state.nodes.every(node => node.hit)) {
        setTimeout(() => this.completeRound(), 300)
      }
    }
  }

  private updateNodes(): void {
    const now = performance.now()
    const activeWindow = 400 // Visual cue window (ms)
    
    this.state.nodes.forEach(node => {
      const timeToTarget = node.targetTime - now
      node.active = Math.abs(timeToTarget) <= activeWindow && !node.hit
      
      // Auto-play tick sound for timing reference
      if (Math.abs(timeToTarget) <= 10 && !node.hit) { // ±10ms window
        this.audio.playTick(0.3) // Soft reference tick
      }
    })
    
    // Auto-complete if all targets passed
    const allPassed = this.state.nodes.every(node => 
      (now > node.targetTime + 500) || node.hit
    )
    
    if (allPassed) {
      this.completeRound()
    }
  }

  private completeRound(): void {
    const inhaleTarget = (this.config.timing.inhaleMin + this.config.timing.inhaleMax) / 2
    const exhaleTarget = (this.config.timing.exhaleMin + this.config.timing.exhaleMax) / 2
    
    const inhaleActual = (this.state.exhaleStart - this.state.inhaleStart) / 1000
    const exhaleActual = (performance.now() - this.state.exhaleStart) / 1000
    
    const hitNodes = this.state.nodes.filter(n => n.hit)
    const hitTimingDeltas = hitNodes.map(n => {
      // Calculate timing delta for hit nodes (approximate)
      return Math.random() * 100 - 50 // Placeholder - should store actual deltas
    })
    
    const score = this.scoring.scoreRound(
      inhaleTarget,
      inhaleActual,
      exhaleTarget,
      exhaleActual,
      hitNodes.length,
      this.state.nodes.length,
      hitTimingDeltas
    )
    
    // Play feedback
    if (score.perfect) {
      this.audio.playPerfectBell()
      this.triggerHaptic('heavy')
    } else if (score.harmony >= 80) {
      this.audio.playBell()
    }
    
    this.onRoundComplete?.(score)
    
    // Check game completion
    if (this.state.currentRound >= this.state.totalRounds) {
      this.completeGame()
    } else {
      this.nextRound()
    }
  }

  private nextRound(): void {
    this.state.currentRound++
    this.state.phase = 'idle'
    this.state.breathProgress = 0
    this.state.nodes = []
  }

  private completeGame(): void {
    this.state.phase = 'complete'
    this.audio.stopDrone()
    
    const allScores = this.scoring.getRecentScores(this.state.totalRounds)
    this.onGameComplete?.(allScores)
  }

  private createGameLoop(): void {
    this.gameLoop = kontra.GameLoop({
      update: this.update.bind(this),
      render: this.render.bind(this)
    })
  }

  private update(dt: number): void {
    const now = performance.now()
    this.updateFPS(now)
    
    // Update breath progress during inhale/exhale
    if (this.state.phase === 'inhale' && this.state.isPressed) {
      const elapsed = (now - this.state.inhaleStart) / 1000
      const target = (this.config.timing.inhaleMin + this.config.timing.inhaleMax) / 2
      this.state.breathProgress = Math.min(elapsed / target, 1)
      
      // Auto-release if target reached
      if (this.state.breathProgress >= 1) {
        this.startExhale()
      }
    } else if (this.state.phase === 'exhale') {
      const elapsed = (now - this.state.exhaleStart) / 1000
      const target = (this.config.timing.exhaleMin + this.config.timing.exhaleMax) / 2
      const progress = elapsed / target
      this.state.breathProgress = Math.max(1 - progress, 0)
      
      // Start nodes when exhale completes
      if (progress >= 1) {
        this.spawnNodes()
      }
    } else if (this.state.phase === 'nodes') {
      this.updateNodes()
    }
    
    // Update sprites
    this.sprites.forEach(sprite => sprite.update(dt))
    
    // Performance optimization
    if (this.performance.fps < this.config.performance.minFps) {
      this.optimizePerformance()
    }
  }

  private updateFPS(now: number): void {
    this.performance.frameCount++
    
    if (now - this.performance.lastFpsUpdate >= 1000) {
      this.performance.fps = this.performance.frameCount
      this.performance.frameCount = 0
      this.performance.lastFpsUpdate = now
    }
  }

  private optimizePerformance(): void {
    // Reduce mandala complexity if needed
    const pointCount = this.mandala.getPointCount()
    if (pointCount > this.config.visual.maxParticles) {
      // Mandala will auto-trim points, but we can be more aggressive
      console.log('Performance optimization: reducing visual complexity')
    }
  }

  private render(): void {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    
    // Draw mandala background
    this.mandala.drawMandala(this.state.phase)
    
    // Draw game elements
    this.drawBreathRing()
    this.drawRhythmNodes()
    this.drawUI()
    
    // Render sprites
    this.sprites.forEach(sprite => sprite.render())
  }

  private drawBreathRing(): void {
    const centerX = this.canvas.width / 2
    const centerY = this.canvas.height / 2
    const baseRadius = Math.min(this.canvas.width, this.canvas.height) * 0.25
    
    this.ctx.save()
    
    // Main breath ring
    const scale = 1 + this.state.breathProgress * 0.3
    const radius = baseRadius * scale
    const colors = this.getPathColors(this.state.pathType)
    
    // Ring with glow effect
    this.ctx.beginPath()
    this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    this.ctx.strokeStyle = colors.primary
    this.ctx.lineWidth = this.config.visual.ringThickness
    this.ctx.stroke()
    
    // Inner glow
    if (this.state.phase === 'inhale') {
      this.ctx.save()
      this.ctx.shadowColor = colors.primary
      this.ctx.shadowBlur = 20
      this.ctx.beginPath()
      this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      this.ctx.strokeStyle = colors.primary
      this.ctx.lineWidth = 2
      this.ctx.stroke()
      this.ctx.restore()
    }
    
    // Progress indicator
    if (this.state.breathProgress > 0) {
      this.ctx.beginPath()
      this.ctx.arc(centerX, centerY, radius + 4, -Math.PI / 2, 
                   -Math.PI / 2 + this.state.breathProgress * Math.PI * 2)
      this.ctx.strokeStyle = colors.accent
      this.ctx.lineWidth = 4
      this.ctx.stroke()
    }
    
    this.ctx.restore()
  }

  private drawRhythmNodes(): void {
    if (this.state.phase !== 'nodes') return
    
    const centerX = this.canvas.width / 2
    const centerY = this.canvas.height / 2
    const radius = Math.min(this.canvas.width, this.canvas.height) * 0.35
    
    this.state.nodes.forEach(node => {
      const x = centerX + radius * Math.cos(node.angle)
      const y = centerY + radius * Math.sin(node.angle)
      const size = this.config.visual.nodeSize
      
      this.ctx.save()
      
      // Node appearance based on state
      if (node.hit) {
        // Hit node - gold with glow
        this.ctx.fillStyle = '#f59e0b'
        this.ctx.shadowColor = '#f59e0b'
        this.ctx.shadowBlur = 15
      } else if (node.active) {
        // Active node - pulsing
        const pulse = 1 + Math.sin(performance.now() * 0.01) * 0.3
        this.ctx.fillStyle = '#06d6a0'
        this.ctx.shadowColor = '#06d6a0'
        this.ctx.shadowBlur = 10 * pulse
      } else {
        // Inactive node
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      }
      
      // Draw node
      this.ctx.beginPath()
      this.ctx.arc(x, y, size / 2, 0, Math.PI * 2)
      this.ctx.fill()
      
      // Draw inner dot for active/hit nodes
      if (node.active || node.hit) {
        this.ctx.fillStyle = 'white'
        this.ctx.beginPath()
        this.ctx.arc(x, y, size / 4, 0, Math.PI * 2)
        this.ctx.fill()
      }
      
      this.ctx.restore()
    })
  }

  private drawUI(): void {
    this.ctx.save()
    this.ctx.fillStyle = 'white'
    this.ctx.font = '16px sans-serif'
    
    // Round counter
    this.ctx.fillText(`Round ${this.state.currentRound}/${this.state.totalRounds}`, 20, 30)
    
    // FPS counter (debug)
    if (process.env.NODE_ENV === 'development') {
      this.ctx.fillText(`FPS: ${this.performance.fps}`, this.canvas.width - 80, 30)
    }
    
    // Phase indicator
    const phaseText = {
      idle: 'Press to Begin',
      inhale: 'Breathe In',
      exhale: 'Breathe Out',
      nodes: 'Tap the Lights',
      complete: 'Complete!'
    }[this.state.phase]
    
    this.ctx.font = '24px sans-serif'
    this.ctx.textAlign = 'center'
    this.ctx.fillText(phaseText, this.canvas.width / 2, this.canvas.height - 40)
    
    this.ctx.restore()
  }

  private getPathColors(pathType: 'lunar' | 'solar' | 'central') {
    const colors = {
      lunar: { primary: '#60a5fa', secondary: '#93c5fd', accent: '#f472b6' },
      solar: { primary: '#fb923c', secondary: '#fdba74', accent: '#fbbf24' },
      central: { primary: '#8b5cf6', secondary: '#a78bfa', accent: '#06d6a0' }
    }
    return colors[pathType]
  }

  private triggerHaptic(intensity: 'light' | 'medium' | 'heavy'): void {
    if (!this.hapticSupported) return
    
    const patterns: Record<string, number[]> = {
      light: [50],
      medium: [100],
      heavy: [200, 50, 200]
    }
    
    navigator.vibrate(patterns[intensity])
  }

  // Public API
  start(): void {
    this.gameLoop?.start()
  }

  stop(): void {
    this.gameLoop?.stop()
    this.audio.stopDrone()
  }

  pause(): void {
    this.gameLoop?.stop()
  }

  resume(): void {
    this.gameLoop?.start()
  }

  setPath(pathType: 'lunar' | 'solar' | 'central'): void {
    this.state.pathType = pathType
    const colors = this.getPathColors(pathType)
    this.mandala = new MandalaRenderer(this.canvas, this.config.visual.mandalaPetals, colors)
  }

  setCallbacks(
    onRoundComplete?: (score: RoundScore) => void,
    onGameComplete?: (scores: RoundScore[]) => void
  ): void {
    this.onRoundComplete = onRoundComplete
    this.onGameComplete = onGameComplete
  }

  exportMandala(): string {
    return this.mandala.exportToPNG(1024)
  }

  getCurrentState(): GameState {
    return { ...this.state }
  }

  getScoring(): ScoringSystem {
    return this.scoring
  }

  destroy(): void {
    this.stop()
    this.audio.destroy()
    this.sprites.forEach(sprite => sprite.destroy?.())
    this.sprites = []
  }
}