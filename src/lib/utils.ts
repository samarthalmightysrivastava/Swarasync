import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { PathType } from './types'

// Utility for combining Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Timing utilities for the game
export function calculateHarmony(
  timingScore: number, 
  sequenceScore: number, 
  consistencyScore: number
): number {
  return Math.round(0.5 * timingScore + 0.3 * sequenceScore + 0.2 * consistencyScore)
}

export function calculateTimingScore(
  target: number, 
  actual: number, 
  tolerance: number
): number {
  const diff = Math.abs(target - actual)
  if (diff <= tolerance) {
    const normalizedDiff = diff / tolerance
    return Math.round(100 * (1 - normalizedDiff * normalizedDiff))
  }
  return 0
}

export function calculateSequenceScore(hits: number, total: number): number {
  return Math.round(100 * (hits / total))
}

export function calculateConsistencyScore(recentHarmonies: number[]): number {
  if (recentHarmonies.length < 2) return 100
  
  const mean = recentHarmonies.reduce((sum, h) => sum + h, 0) / recentHarmonies.length
  const variance = recentHarmonies.reduce((sum, h) => sum + Math.pow(h - mean, 2), 0) / recentHarmonies.length
  const stdDev = Math.sqrt(variance)
  
  // Lower standard deviation = higher consistency
  // Normalize to 0-100 scale (assuming max reasonable stdDev of 30)
  return Math.round(100 - Math.min(stdDev / 30 * 100, 100))
}

// Adaptive difficulty adjustment
export function adjustDifficulty(
  recentHarmonies: number[],
  currentTolerance: number,
  currentNodeCount: number,
  currentTickRate: number,
  config: any
): { tolerance: number; nodeCount: number; tickRate: number } {
  if (recentHarmonies.length < 3) {
    return { tolerance: currentTolerance, nodeCount: currentNodeCount, tickRate: currentTickRate }
  }
  
  const last3 = recentHarmonies.slice(-3)
  const average = last3.reduce((sum, h) => sum + h, 0) / 3
  
  let newTolerance = currentTolerance
  let newNodeCount = currentNodeCount
  let newTickRate = currentTickRate
  
  // Increase difficulty if performing well
  if (average >= 90) {
    newTolerance = Math.max(currentTolerance - config.tolStepMs, config.tolMinMs)
    newNodeCount = Math.min(currentNodeCount + 1, config.nodes.max)
    newTickRate = Math.min(currentTickRate * 1.06, 1.3)
  }
  // Decrease difficulty if struggling
  else if (average <= 70) {
    newTolerance = Math.min(currentTolerance + config.tolStepMs, config.tolMaxMs)
    newNodeCount = Math.max(currentNodeCount - 1, config.nodes.min)
    newTickRate = Math.max(currentTickRate * 0.94, 0.7)
  }
  
  return { 
    tolerance: newTolerance, 
    nodeCount: newNodeCount, 
    tickRate: newTickRate 
  }
}

// Path-based color utilities
export function getPathColors(path: PathType) {
  switch (path) {
    case 'lunar':
      return {
        primary: '#3BB5AD',
        secondary: '#CFE6E2',
        light: '#E9F5F3',
        dark: '#0F5962',
        darkest: '#0E2A36'
      }
    case 'solar':
      return {
        primary: '#F6A43A',
        secondary: '#FFD79A',
        light: '#FFF3E1',
        dark: '#8B4B00',
        darkest: '#2C1A00'
      }
    case 'central':
      return {
        primary: '#A78BFA',
        secondary: '#EDE9FE',
        light: '#FFFFFF',
        dark: '#5E46A6',
        darkest: '#201532'
      }
    default:
      return {
        primary: '#A78BFA',
        secondary: '#EDE9FE',
        light: '#FFFFFF',
        dark: '#5E46A6',
        darkest: '#201532'
      }
  }
}

export function getPathName(path: PathType): string {
  switch (path) {
    case 'lunar': return 'Idā (Moon)'
    case 'solar': return 'Piṅgalā (Sun)'
    case 'central': return 'Suṣumnā (Central)'
    default: return 'Unknown'
  }
}

// Time formatting utilities
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

// Haptic feedback utility
export function triggerHaptic(type: 'light' | 'medium' | 'heavy' = 'light') {
  if ('vibrate' in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30]
    }
    navigator.vibrate(patterns[type])
  }
}

// Audio context utilities
export function createAudioContext(): AudioContext | null {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext
    return new AudioContext()
  } catch (error) {
    console.warn('AudioContext not supported:', error)
    return null
  }
}

// Local storage utilities with error handling
export function safeGetItem(key: string, defaultValue: any = null) {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.warn(`Error reading from localStorage (${key}):`, error)
    return defaultValue
  }
}

export function safeSetItem(key: string, value: any): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.warn(`Error writing to localStorage (${key}):`, error)
    return false
  }
}

// Random message selector
export function getRandomMessage(messages: string[]): string {
  return messages[Math.floor(Math.random() * messages.length)]
}

// Achievement checking utilities
export function checkAchievements(
  roundResult: any, 
  sessionResults: any[], 
  userProgress: any
): string[] {
  const newAchievements: string[] = []
  
  // First session
  if (userProgress.sessionsCompleted === 0) {
    newAchievements.push('gentle-start')
  }
  
  // Perfect round (harmony >= 95)
  if (roundResult.harmony >= 95) {
    newAchievements.push('perfect-round')
  }
  
  // Seven rounds in a session with good harmony
  if (sessionResults.length >= 7 && sessionResults.every(r => r.harmony >= 75)) {
    newAchievements.push('seven-petals')
  }
  
  // Path-specific achievements
  if (sessionResults.length >= 6) {
    const avgHarmony = sessionResults.reduce((sum, r) => sum + r.harmony, 0) / sessionResults.length
    if (avgHarmony >= 80) {
      // These would be set based on current path
      // Implementation depends on current path context
    }
  }
  
  return newAchievements
}

// Canvas utilities for mandala drawing
export function polarToCartesian(
  centerX: number, 
  centerY: number, 
  radius: number, 
  angleInDegrees: number
) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  }
}

export function cartesianToPolar(
  centerX: number, 
  centerY: number, 
  x: number, 
  y: number
) {
  const dx = x - centerX
  const dy = y - centerY
  const radius = Math.sqrt(dx * dx + dy * dy)
  const angle = Math.atan2(dy, dx) * 180 / Math.PI + 90
  return { radius, angle: angle < 0 ? angle + 360 : angle }
}

// Performance monitoring
export function measurePerformance<T>(fn: () => T, label: string): T {
  const start = performance.now()
  const result = fn()
  const end = performance.now()
  console.log(`${label}: ${(end - start).toFixed(2)}ms`)
  return result
}

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}