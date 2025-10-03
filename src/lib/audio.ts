'use client'

interface AudioConfig {
  masterVolume: number
  droneFreq: number
  droneDetune: number
  lfoRate: number
  tickDuration: number
  bellDuration: number
}

export class GameAudio {
  private context?: AudioContext
  private masterGain?: GainNode
  private droneOsc1?: OscillatorNode
  private droneOsc2?: OscillatorNode
  private droneLfo?: OscillatorNode
  private droneGain?: GainNode
  private lfoGain?: GainNode
  private isInitialized = false
  private config: AudioConfig

  constructor(config: AudioConfig) {
    this.config = config
  }

  async init(): Promise<void> {
    if (this.isInitialized) return

    try {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // Master gain
      this.masterGain = this.context.createGain()
      this.masterGain.gain.value = this.config.masterVolume
      this.masterGain.connect(this.context.destination)

      // Setup base drone (2 detuned sines)
      this.setupDrone()

      this.isInitialized = true

      // Handle visibility change
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && this.context?.state === 'suspended') {
          this.context.resume()
        }
      })

    } catch (error) {
      console.warn('WebAudio initialization failed:', error)
    }
  }

  private setupDrone(): void {
    if (!this.context || !this.masterGain) return

    // Main drone oscillators
    this.droneOsc1 = this.context.createOscillator()
    this.droneOsc2 = this.context.createOscillator()
    this.droneLfo = this.context.createOscillator()

    // Drone gain control
    this.droneGain = this.context.createGain()
    this.droneGain.gain.value = 0.1

    // LFO for subtle modulation
    this.lfoGain = this.context.createGain()
    this.lfoGain.gain.value = 2 // LFO depth

    // Configure oscillators
    this.droneOsc1.type = 'sine'
    this.droneOsc1.frequency.value = this.config.droneFreq

    this.droneOsc2.type = 'sine' 
    this.droneOsc2.frequency.value = this.config.droneFreq + this.config.droneDetune

    this.droneLfo.type = 'sine'
    this.droneLfo.frequency.value = this.config.lfoRate

    // Connect LFO to drone pitch
    this.droneLfo.connect(this.lfoGain)
    this.lfoGain.connect(this.droneOsc1.frequency)
    this.lfoGain.connect(this.droneOsc2.frequency)

    // Connect drones to output
    this.droneOsc1.connect(this.droneGain)
    this.droneOsc2.connect(this.droneGain)
    this.droneGain.connect(this.masterGain)

    // Start oscillators
    this.droneOsc1.start()
    this.droneOsc2.start()
    this.droneLfo.start()
  }

  async resume(): Promise<void> {
    if (this.context?.state === 'suspended') {
      await this.context.resume()
    }
  }

  startDrone(): void {
    if (!this.droneGain) return
    this.droneGain.gain.linearRampToValueAtTime(0.05, this.context!.currentTime + 0.5)
  }

  stopDrone(): void {
    if (!this.droneGain) return
    this.droneGain.gain.linearRampToValueAtTime(0, this.context!.currentTime + 0.5)
  }

  playTick(intensity: number = 1.0): void {
    if (!this.context || !this.masterGain) return

    // Create noise buffer for soft tick
    const bufferSize = this.context.sampleRate * this.config.tickDuration
    const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate)
    const data = buffer.getChannelData(0)

    // Generate filtered noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * intensity * 0.1
    }

    // Apply envelope
    const attack = bufferSize * 0.1
    const decay = bufferSize * 0.9
    
    for (let i = 0; i < attack; i++) {
      data[i] *= i / attack
    }
    for (let i = attack; i < bufferSize; i++) {
      data[i] *= 1 - ((i - attack) / decay)
    }

    // Play the tick
    const source = this.context.createBufferSource()
    const gain = this.context.createGain()
    
    source.buffer = buffer
    gain.gain.value = 0.3 * intensity
    
    source.connect(gain)
    gain.connect(this.masterGain)
    
    source.start()
  }

  playBell(frequency: number = 440, duration: number = this.config.bellDuration): void {
    if (!this.context || !this.masterGain) return

    const osc = this.context.createOscillator()
    const gain = this.context.createGain()
    const filter = this.context.createBiquadFilter()

    // Bell-like tone with harmonics
    osc.type = 'sine'
    osc.frequency.value = frequency

    // Soft low-pass filter
    filter.type = 'lowpass'
    filter.frequency.value = frequency * 2
    filter.Q.value = 1

    // Exponential decay envelope
    const now = this.context.currentTime
    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration)

    // Connect and play
    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.masterGain)

    osc.start(now)
    osc.stop(now + duration)
  }

  playPerfectBell(): void {
    // Harmonic bell for perfect rounds
    this.playBell(523.25, 0.8) // C5
    setTimeout(() => this.playBell(659.25, 0.6), 100) // E5  
    setTimeout(() => this.playBell(783.99, 0.4), 200) // G5
  }

  setMasterVolume(volume: number): void {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, volume))
    }
  }

  destroy(): void {
    this.stopDrone()
    
    if (this.droneOsc1) this.droneOsc1.stop()
    if (this.droneOsc2) this.droneOsc2.stop()
    if (this.droneLfo) this.droneLfo.stop()
    
    if (this.context) {
      this.context.close()
    }
    
    this.isInitialized = false
  }
}