import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { 
  GameState, 
  UserPreferences, 
  UserProgress, 
  RoundResult, 
  PathType, 
  SessionSize,
  Achievement,
  FeatureFlags 
} from './types'

// Game store for current session state
interface GameStore extends GameState {
  // Actions
  setPath: (path: PathType) => void
  setSessionSize: (size: SessionSize) => void
  startGame: () => void
  pauseGame: () => void
  resumeGame: () => void
  endGame: () => void
  nextRound: () => void
  updateTiming: (inhale: number, exhale: number) => void
  updateDifficulty: (tolerance: number, nodeCount: number, tickRate: number) => void
  reset: () => void
}

// User preferences and progress store (persisted)
interface UserStore {
  preferences: UserPreferences
  progress: UserProgress
  featureFlags: FeatureFlags
  // Actions
  updatePreferences: (prefs: Partial<UserPreferences>) => void
  addRoundResult: (result: RoundResult) => void
  completeSession: (results: RoundResult[]) => void
  unlockAchievement: (achievementId: string) => void
  setCalibration: (inhale: number, exhale: number) => void
  updateFeatureFlags: (flags: Partial<FeatureFlags>) => void
}

// Audio store for managing audio context and settings
interface AudioStore {
  isInitialized: boolean
  isPlaying: boolean
  masterVolume: number
  layers: {
    drone: { enabled: boolean; volume: number }
    layer1: { enabled: boolean; volume: number }
    layer2: { enabled: boolean; volume: number }
    ticks: { enabled: boolean; volume: number }
  }
  // Actions
  initialize: () => void
  setMasterVolume: (volume: number) => void
  toggleLayer: (layer: keyof AudioStore['layers']) => void
  setLayerVolume: (layer: keyof AudioStore['layers'], volume: number) => void
  start: () => void
  stop: () => void
}

// Game store (not persisted - session state)
export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  path: 'central',
  sessionSize: 'classic',
  currentRound: 0,
  totalRounds: 8,
  isPlaying: false,
  isPaused: false,
  calibrationComplete: false,
  inhaleTarget: 5,
  exhaleTarget: 7,
  tolerance: 450,
  nodeCount: 4,
  tickRate: 1.0,

  // Actions
  setPath: (path) => set({ path }),
  setSessionSize: (sessionSize) => {
    const totalRounds = sessionSize === 'quick' ? 6 : sessionSize === 'classic' ? 8 : 10
    set({ sessionSize, totalRounds })
  },
  startGame: () => set({ isPlaying: true, isPaused: false, currentRound: 1 }),
  pauseGame: () => set({ isPaused: true }),
  resumeGame: () => set({ isPaused: false }),
  endGame: () => set({ isPlaying: false, isPaused: false }),
  nextRound: () => {
    const { currentRound, totalRounds } = get()
    if (currentRound < totalRounds) {
      set({ currentRound: currentRound + 1 })
    } else {
      set({ isPlaying: false })
    }
  },
  updateTiming: (inhaleTarget, exhaleTarget) => set({ inhaleTarget, exhaleTarget }),
  updateDifficulty: (tolerance, nodeCount, tickRate) => set({ tolerance, nodeCount, tickRate }),
  reset: () => set({
    currentRound: 0,
    isPlaying: false,
    isPaused: false
  })
}))

// User store (persisted to localStorage)
export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      // Initial preferences
      preferences: {
        haptics: true,
        sound: true,
        reducedMotion: false,
        darkMode: false,
        language: 'en'
      },
      
      // Initial progress
      progress: {
        sessionsCompleted: 0,
        totalRounds: 0,
        averageHarmony: 0,
        streakCurrent: 0,
        streakBest: 0,
        achievements: [],
        lastPlayedPath: 'central',
        calibrationData: null
      },

      // Feature flags
      featureFlags: {
        useLLM: false,
        useLicense: false
      },

      // Actions
      updatePreferences: (prefs) => set((state) => ({
        preferences: { ...state.preferences, ...prefs }
      })),

      addRoundResult: (result) => set((state) => {
        const newTotalRounds = state.progress.totalRounds + 1
        const newAverageHarmony = (
          (state.progress.averageHarmony * state.progress.totalRounds) + result.harmony
        ) / newTotalRounds

        return {
          progress: {
            ...state.progress,
            totalRounds: newTotalRounds,
            averageHarmony: newAverageHarmony
          }
        }
      }),

      completeSession: (results) => set((state) => {
        const sessionAverage = results.reduce((sum, r) => sum + r.harmony, 0) / results.length
        const newStreakCurrent = sessionAverage >= 70 ? state.progress.streakCurrent + 1 : 0
        const newStreakBest = Math.max(newStreakCurrent, state.progress.streakBest)

        return {
          progress: {
            ...state.progress,
            sessionsCompleted: state.progress.sessionsCompleted + 1,
            streakCurrent: newStreakCurrent,
            streakBest: newStreakBest
          }
        }
      }),

      unlockAchievement: (achievementId) => set((state) => {
        const existingAchievement = state.progress.achievements.find(a => a.id === achievementId)
        if (existingAchievement && !existingAchievement.unlocked) {
          const updatedAchievements = state.progress.achievements.map(a =>
            a.id === achievementId 
              ? { ...a, unlocked: true, unlockedAt: new Date() }
              : a
          )
          return {
            progress: {
              ...state.progress,
              achievements: updatedAchievements
            }
          }
        }
        return state
      }),

      setCalibration: (inhale, exhale) => set((state) => ({
        progress: {
          ...state.progress,
          calibrationData: {
            inhaleBase: inhale,
            exhaleBase: exhale,
            calibratedAt: new Date()
          }
        }
      })),

      updateFeatureFlags: (flags) => set((state) => ({
        featureFlags: { ...state.featureFlags, ...flags }
      }))
    }),
    {
      name: 'swarasync-user-store',
      partialize: (state) => ({ 
        preferences: state.preferences, 
        progress: state.progress,
        featureFlags: state.featureFlags
      })
    }
  )
)

// Audio store (not persisted)
export const useAudioStore = create<AudioStore>((set, get) => ({
  isInitialized: false,
  isPlaying: false,
  masterVolume: 0.7,
  layers: {
    drone: { enabled: true, volume: 0.6 },
    layer1: { enabled: false, volume: 0.4 },
    layer2: { enabled: false, volume: 0.3 },
    ticks: { enabled: true, volume: 0.8 }
  },

  initialize: () => set({ isInitialized: true }),
  setMasterVolume: (masterVolume) => set({ masterVolume }),
  toggleLayer: (layer) => set((state) => ({
    layers: {
      ...state.layers,
      [layer]: { ...state.layers[layer], enabled: !state.layers[layer].enabled }
    }
  })),
  setLayerVolume: (layer, volume) => set((state) => ({
    layers: {
      ...state.layers,
      [layer]: { ...state.layers[layer], volume }
    }
  })),
  start: () => set({ isPlaying: true }),
  stop: () => set({ isPlaying: false })
}))