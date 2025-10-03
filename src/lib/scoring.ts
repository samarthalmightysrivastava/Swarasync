'use client'

export interface ScoreWeights {
  timingWeight: number
  sequenceWeight: number
  consistencyWeight: number
}

export interface RoundScore {
  timing: number
  sequence: number 
  consistency: number
  harmony: number
  perfect: boolean
}

export interface DifficultyState {
  tolerance: number
  nodes: number
  consecutiveHigh: number
  consecutiveLow: number
  ewmaScore: number
}

export class ScoringSystem {
  private weights: ScoreWeights
  private roundScores: RoundScore[] = []
  private difficulty: DifficultyState
  private config: any

  constructor(config: any) {
    this.config = config
    this.weights = config.scoring
    this.difficulty = {
      tolerance: config.difficulty.initialTolerance,
      nodes: config.difficulty.initialNodes,
      consecutiveHigh: 0,
      consecutiveLow: 0,
      ewmaScore: 0
    }
  }

  calculateTiming(target: number, actual: number, tolerance: number): number {
    const delta = Math.abs(target - actual)
    if (delta <= tolerance / 1000) {
      // Perfect window (±300ms default)
      return 100
    }
    
    // Linear falloff beyond perfect window
    const maxDelta = target * 0.5 // 50% variance allowed
    const score = Math.max(0, 100 - (delta / maxDelta) * 100)
    return Math.round(score)
  }

  calculateSequence(hits: number, total: number, timingDeltas: number[]): number {
    if (total === 0) return 100
    
    const hitRatio = hits / total
    let baseScore = hitRatio * 100
    
    // Bonus for timing accuracy on hits
    if (hits > 0 && timingDeltas.length > 0) {
      const avgDelta = timingDeltas.reduce((sum, d) => sum + Math.abs(d), 0) / timingDeltas.length
      const timingBonus = Math.max(0, 20 - (avgDelta / 10)) // Up to 20 point bonus
      baseScore += timingBonus
    }
    
    return Math.min(100, Math.round(baseScore))
  }

  calculateConsistency(newScore: number): number {
    if (this.roundScores.length < 2) return 100
    
    // Get last 4 harmony scores for consistency calculation
    const recentScores = this.roundScores
      .slice(-3) // Last 3 scores
      .map(s => s.harmony)
      .concat([newScore]) // Plus current score
    
    if (recentScores.length < 2) return 100
    
    // Calculate standard deviation
    const mean = recentScores.reduce((sum, s) => sum + s, 0) / recentScores.length
    const variance = recentScores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / recentScores.length
    const stdDev = Math.sqrt(variance)
    
    // Convert to consistency score (lower stdDev = higher consistency)
    const consistencyScore = Math.max(0, 100 - (stdDev * 2))
    return Math.round(consistencyScore)
  }

  calculateHarmony(timing: number, sequence: number, consistency: number): number {
    const harmony = (
      timing * this.weights.timingWeight +
      sequence * this.weights.sequenceWeight +
      consistency * this.weights.consistencyWeight
    )
    return Math.round(harmony)
  }

  scoreRound(
    inhaleTarget: number,
    inhaleActual: number,
    exhaleTarget: number,
    exhaleActual: number,
    nodeHits: number,
    totalNodes: number,
    hitTimingDeltas: number[]
  ): RoundScore {
    // Calculate individual scores
    const inhaleTiming = this.calculateTiming(inhaleTarget, inhaleActual, this.difficulty.tolerance)
    const exhaleTiming = this.calculateTiming(exhaleTarget, exhaleActual, this.difficulty.tolerance)
    const timing = Math.round((inhaleTiming + exhaleTiming) / 2)
    
    const sequence = this.calculateSequence(nodeHits, totalNodes, hitTimingDeltas)
    const consistency = this.calculateConsistency(timing)
    const harmony = this.calculateHarmony(timing, sequence, consistency)
    
    // Perfect round detection
    const perfect = harmony >= 95 && nodeHits === totalNodes && 
                   Math.abs(inhaleTarget - inhaleActual) <= 0.2 &&
                   Math.abs(exhaleTarget - exhaleActual) <= 0.2
    
    const score: RoundScore = {
      timing,
      sequence,
      consistency,
      harmony,
      perfect
    }
    
    this.roundScores.push(score)
    this.updateDifficulty(harmony)
    
    return score
  }

  private updateDifficulty(harmony: number): void {
    const config = this.config.difficulty
    
    // Update EWMA score
    if (this.difficulty.ewmaScore === 0) {
      this.difficulty.ewmaScore = harmony
    } else {
      this.difficulty.ewmaScore = config.ewmaAlpha * harmony + (1 - config.ewmaAlpha) * this.difficulty.ewmaScore
    }
    
    // Track consecutive high/low performance
    if (harmony >= config.adaptThreshold.increase) {
      this.difficulty.consecutiveHigh++
      this.difficulty.consecutiveLow = 0
    } else if (harmony <= config.adaptThreshold.decrease) {
      this.difficulty.consecutiveLow++
      this.difficulty.consecutiveHigh = 0
    } else {
      this.difficulty.consecutiveHigh = 0
      this.difficulty.consecutiveLow = 0
    }
    
    // Adapt difficulty
    if (this.difficulty.consecutiveHigh >= config.adaptRounds) {
      // Increase difficulty
      this.difficulty.tolerance = Math.max(
        config.minTolerance,
        this.difficulty.tolerance - config.toleranceStep
      )
      this.difficulty.nodes = Math.min(
        config.maxNodes,
        this.difficulty.nodes + 1
      )
      this.difficulty.consecutiveHigh = 0
      console.log(`Difficulty increased: tolerance=${this.difficulty.tolerance}ms, nodes=${this.difficulty.nodes}`)
    } else if (this.difficulty.consecutiveLow >= config.adaptRounds) {
      // Decrease difficulty  
      this.difficulty.tolerance = Math.min(
        config.maxTolerance,
        this.difficulty.tolerance + config.toleranceStep
      )
      this.difficulty.nodes = Math.max(
        config.minNodes,
        this.difficulty.nodes - 1
      )
      this.difficulty.consecutiveLow = 0
      console.log(`Difficulty decreased: tolerance=${this.difficulty.tolerance}ms, nodes=${this.difficulty.nodes}`)
    }
  }

  getDifficulty(): DifficultyState {
    return { ...this.difficulty }
  }

  getRecentScores(count: number = 5): RoundScore[] {
    return this.roundScores.slice(-count)
  }

  getAverageHarmony(rounds: number = 5): number {
    const recent = this.getRecentScores(rounds)
    if (recent.length === 0) return 0
    
    const sum = recent.reduce((acc, score) => acc + score.harmony, 0)
    return Math.round(sum / recent.length)
  }

  getTotalPerfects(): number {
    return this.roundScores.filter(s => s.perfect).length
  }

  reset(): void {
    this.roundScores = []
    this.difficulty = {
      tolerance: this.config.difficulty.initialTolerance,
      nodes: this.config.difficulty.initialNodes,
      consecutiveHigh: 0,
      consecutiveLow: 0,
      ewmaScore: 0
    }
  }
}