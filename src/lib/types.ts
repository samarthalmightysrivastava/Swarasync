// Core game types
export type PathType = 'lunar' | 'solar' | 'central'
export type SessionSize = 'quick' | 'classic' | 'deep'
export type AdvisorState = 'left' | 'right' | 'both'
export type AdvisorDecision = 'yes' | 'neutral' | 'wait'

// Game state interfaces
export interface GameConfig {
  timing: {
    inhaleMin: number
    inhaleMax: number
    exhaleMin: number
    exhaleMax: number
    tolStartMs: number
    tolStepMs: number
    tolMinMs: number
    tolMaxMs: number
  }
  paths: {
    lunar: { exhaleBias: number }
    solar: { tempoBias: number }
    central: { balance: number }
  }
  nodes: {
    min: number
    max: number
    hitWindowMs: number
  }
  session: {
    roundsQuick: number
    roundsClassic: number
    roundsDeep: number
  }
}

export interface GameState {
  path: PathType
  sessionSize: SessionSize
  currentRound: number
  totalRounds: number
  isPlaying: boolean
  isPaused: boolean
  calibrationComplete: boolean
  inhaleTarget: number
  exhaleTarget: number
  tolerance: number
  nodeCount: number
  tickRate: number
}

export interface RoundResult {
  timingScore: number
  sequenceScore: number
  consistencyScore: number
  harmony: number
  inhaleActual: number
  exhaleActual: number
  nodeHits: number
  totalNodes: number
}

export interface SessionResult {
  rounds: RoundResult[]
  averageHarmony: number
  stickersEarned: string[]
  mandalaData: MandalaData
}

// Mandala painter types
export interface MandalaData {
  strokes: MandalaStroke[]
  palette: string[]
  symmetryPoints: number
}

export interface MandalaStroke {
  points: { x: number; y: number }[]
  thickness: number
  color: string
  opacity: number
  timestamp: number
}

// Audio types
export interface AudioPreset {
  name: string
  drone: {
    frequency: number
    detune: number
    filterFreq: number
    gain: number
  }
  layer1: {
    enabled: boolean
    volume: number
    pattern: string
  }
  layer2: {
    enabled: boolean
    volume: number
    pattern: string
  }
  tempo: {
    base: number
    bias: number
  }
}

// Advisor types
export type AdvisorRules = {
  [key in AdvisorState]: {
    [task: string]: AdvisorDecision
  }
}

export interface AdvisorResult {
  state: AdvisorState
  task: string
  decision: AdvisorDecision
  waitMinutes?: number
  techniques: string[]
  explanation?: string
}

// Achievement types
export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: Date
}

// User preferences and state
export interface UserPreferences {
  haptics: boolean
  sound: boolean
  reducedMotion: boolean
  darkMode: boolean
  language: string
}

export interface UserProgress {
  sessionsCompleted: number
  totalRounds: number
  averageHarmony: number
  streakCurrent: number
  streakBest: number
  achievements: Achievement[]
  lastPlayedPath: PathType
  calibrationData: {
    inhaleBase: number
    exhaleBase: number
    calibratedAt: Date
  } | null
}

// Feature flags
export interface FeatureFlags {
  useLLM: boolean
  useLicense: boolean
}

// License types (when enabled)
export interface LicenseInfo {
  isActive: boolean
  tier: 'trial' | 'pro'
  expiresAt?: Date
  features: string[]
  cachedAt: Date
  graceOfflineDays: number
}