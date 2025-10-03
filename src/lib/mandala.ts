'use client'

export interface MandalaPoint {
  x: number
  y: number
  thickness: number
  alpha: number
  hue: number
  timestamp: number
}

export class MandalaRenderer {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private points: MandalaPoint[] = []
  private petals: number
  private centerX: number
  private centerY: number
  private maxRadius: number
  private pathColors: { primary: string; secondary: string; accent: string }

  constructor(
    canvas: HTMLCanvasElement,
    petals: number = 12,
    pathColors = { primary: '#6366f1', secondary: '#8b5cf6', accent: '#f59e0b' }
  ) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
    this.petals = petals
    this.pathColors = pathColors
    this.centerX = canvas.width / 2
    this.centerY = canvas.height / 2
    this.maxRadius = Math.min(canvas.width, canvas.height) * 0.4
  }

  addPoint(
    radius: number,
    angle: number,
    timingDelta: number,
    intensity: number = 1.0
  ): void {
    // Map timing delta to visual properties
    const normalizedDelta = Math.min(1, Math.abs(timingDelta) / 300) // 300ms max
    const thickness = Math.max(1, 8 - normalizedDelta * 6) // Thicker for better timing
    const alpha = Math.max(0.3, 1 - normalizedDelta * 0.7) // More opaque for better timing
    const hue = this.getHueFromTiming(timingDelta)

    // Calculate position
    const x = this.centerX + radius * Math.cos(angle)
    const y = this.centerY + radius * Math.sin(angle)

    const point: MandalaPoint = {
      x,
      y,
      thickness: thickness * intensity,
      alpha: alpha * intensity,
      hue,
      timestamp: Date.now()
    }

    this.points.push(point)

    // Create 12-fold symmetry
    for (let i = 1; i < this.petals; i++) {
      const symmetryAngle = angle + (i * 2 * Math.PI) / this.petals
      const symX = this.centerX + radius * Math.cos(symmetryAngle)
      const symY = this.centerY + radius * Math.sin(symmetryAngle)

      this.points.push({
        x: symX,
        y: symY,
        thickness: thickness * intensity,
        alpha: alpha * intensity * 0.8, // Slightly dimmer for symmetry
        hue,
        timestamp: Date.now()
      })
    }

    // Limit points to prevent memory issues
    if (this.points.length > 2000) {
      this.points = this.points.slice(-1500)
    }
  }

  private getHueFromTiming(timingDelta: number): number {
    // Perfect timing = gold (45°), early = blue (240°), late = red (0°)
    if (Math.abs(timingDelta) <= 50) {
      return 45 // Gold for perfect timing
    } else if (timingDelta < 0) {
      return 240 // Blue for early
    } else {
      return 0 // Red for late
    }
  }

  drawMandala(breathPhase: 'idle' | 'inhale' | 'exhale' | 'nodes' | 'complete' = 'idle'): void {
    // Clear with subtle radial gradient background
    this.ctx.save()
    
    // Background gradient
    const gradient = this.ctx.createRadialGradient(
      this.centerX, this.centerY, 0,
      this.centerX, this.centerY, this.maxRadius * 1.2
    )
    gradient.addColorStop(0, 'rgba(15, 23, 42, 0.95)') // Dark center
    gradient.addColorStop(1, 'rgba(30, 41, 59, 0.85)') // Lighter edges
    
    this.ctx.fillStyle = gradient
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // Draw mandala points with connecting paths
    this.drawMandalaPoints()

    // Draw central sacred geometry
    this.drawCentralGeometry(breathPhase)

    // Draw outer ring guides
    this.drawGuideRings()

    this.ctx.restore()
  }

  private drawMandalaPoints(): void {
    if (this.points.length < 2) return

    this.ctx.save()
    this.ctx.lineCap = 'round'
    this.ctx.lineJoin = 'round'

    // Group points by petal for smooth paths
    const petalGroups: MandalaPoint[][] = Array(this.petals).fill(null).map(() => [])
    
    this.points.forEach((point, index) => {
      const petalIndex = index % this.petals
      petalGroups[petalIndex].push(point)
    })

    // Draw each petal path
    petalGroups.forEach((petal, petalIndex) => {
      if (petal.length < 2) return

      this.ctx.beginPath()
      this.ctx.moveTo(petal[0].x, petal[0].y)

      // Create smooth curves between points
      for (let i = 1; i < petal.length; i++) {
        const prev = petal[i - 1]
        const curr = petal[i]
        const next = petal[i + 1]

        if (next) {
          // Smooth curve through points
          const cpX = curr.x + (next.x - prev.x) * 0.1
          const cpY = curr.y + (next.y - prev.y) * 0.1
          this.ctx.quadraticCurveTo(curr.x, curr.y, cpX, cpY)
        } else {
          this.ctx.lineTo(curr.x, curr.y)
        }
      }

      // Apply visual properties from most recent point
      const lastPoint = petal[petal.length - 1]
      this.ctx.strokeStyle = `hsla(${lastPoint.hue}, 70%, 60%, ${lastPoint.alpha})`
      this.ctx.lineWidth = lastPoint.thickness
      this.ctx.stroke()

      // Add glow effect for recent points
      const now = Date.now()
      petal.forEach(point => {
        const age = now - point.timestamp
        if (age < 1000) { // Glow for 1 second
          const glowAlpha = point.alpha * (1 - age / 1000)
          this.ctx.save()
          this.ctx.shadowColor = `hsla(${point.hue}, 70%, 60%, ${glowAlpha})`
          this.ctx.shadowBlur = point.thickness * 2
          this.ctx.beginPath()
          this.ctx.arc(point.x, point.y, point.thickness / 2, 0, Math.PI * 2)
          this.ctx.fillStyle = `hsla(${point.hue}, 70%, 60%, ${glowAlpha})`
          this.ctx.fill()
          this.ctx.restore()
        }
      })
    })

    this.ctx.restore()
  }

  private drawCentralGeometry(breathPhase: string): void {
    this.ctx.save()

    // Central bindu (sacred dot)
    const binduSize = breathPhase === 'inhale' ? 8 : breathPhase === 'exhale' ? 12 : 6
    const binduAlpha = breathPhase === 'idle' ? 0.6 : 1.0

    this.ctx.beginPath()
    this.ctx.arc(this.centerX, this.centerY, binduSize, 0, Math.PI * 2)
    this.ctx.fillStyle = `hsla(45, 100%, 70%, ${binduAlpha})` // Golden bindu
    this.ctx.fill()

    // Sacred geometry rings
    for (let ring = 1; ring <= 3; ring++) {
      const radius = (this.maxRadius / 4) * ring
      const alpha = breathPhase === 'nodes' ? 0.3 : 0.1
      
      this.ctx.beginPath()
      this.ctx.arc(this.centerX, this.centerY, radius, 0, Math.PI * 2)
      this.ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`
      this.ctx.lineWidth = 1
      this.ctx.stroke()

      // Draw petal guides
      if (ring === 2) { // Middle ring
        for (let i = 0; i < this.petals; i++) {
          const angle = (i * 2 * Math.PI) / this.petals
          const x1 = this.centerX + radius * 0.9 * Math.cos(angle)
          const y1 = this.centerY + radius * 0.9 * Math.sin(angle)
          const x2 = this.centerX + radius * 1.1 * Math.cos(angle)
          const y2 = this.centerY + radius * 1.1 * Math.sin(angle)

          this.ctx.beginPath()
          this.ctx.moveTo(x1, y1)
          this.ctx.lineTo(x2, y2)
          this.ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 2})`
          this.ctx.lineWidth = 2
          this.ctx.stroke()
        }
      }
    }

    this.ctx.restore()
  }

  private drawGuideRings(): void {
    this.ctx.save()
    
    // Outer guidance rings
    const rings = [0.7, 0.85, 1.0]
    rings.forEach((scale, index) => {
      const radius = this.maxRadius * scale
      const alpha = 0.1 - index * 0.02
      
      this.ctx.beginPath()
      this.ctx.arc(this.centerX, this.centerY, radius, 0, Math.PI * 2)
      this.ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`
      this.ctx.lineWidth = 1
      this.ctx.setLineDash([5, 10])
      this.ctx.stroke()
      this.ctx.setLineDash([])
    })

    this.ctx.restore()
  }

  exportToPNG(size: number = 1024): string {
    // Create temporary high-res canvas
    const tempCanvas = document.createElement('canvas')
    const tempCtx = tempCanvas.getContext('2d')!
    tempCanvas.width = size
    tempCanvas.height = size

    // Scale and redraw
    const scale = size / Math.min(this.canvas.width, this.canvas.height)
    tempCtx.scale(scale, scale)
    tempCtx.translate(
      (this.canvas.width - size / scale) / 2,
      (this.canvas.height - size / scale) / 2
    )

    // Redraw on temp canvas
    const originalCanvas = this.canvas
    const originalCtx = this.ctx
    this.canvas = tempCanvas
    this.ctx = tempCtx
    this.centerX = tempCanvas.width / (2 * scale)
    this.centerY = tempCanvas.height / (2 * scale)
    this.maxRadius = Math.min(tempCanvas.width, tempCanvas.height) * 0.4 / scale

    this.drawMandala()

    // Restore original canvas
    this.canvas = originalCanvas
    this.ctx = originalCtx
    this.centerX = originalCanvas.width / 2
    this.centerY = originalCanvas.height / 2
    this.maxRadius = Math.min(originalCanvas.width, originalCanvas.height) * 0.4

    return tempCanvas.toDataURL('image/png')
  }

  clear(): void {
    this.points = []
  }

  getPointCount(): number {
    return this.points.length
  }
}