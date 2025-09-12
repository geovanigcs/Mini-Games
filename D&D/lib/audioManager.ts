class AudioManager {
  private static instance: AudioManager
  private currentAudio: HTMLAudioElement | null = null
  
  private constructor() {}
  
  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager()
    }
    return AudioManager.instance
  }
  
  stopCurrentAudio() {
    if (this.currentAudio) {
      this.currentAudio.pause()
      this.currentAudio.currentTime = 0
    }
  }
  
  setCurrentAudio(audio: HTMLAudioElement) {
    this.stopCurrentAudio()
    this.currentAudio = audio
  }
  
  getCurrentAudio(): HTMLAudioElement | null {
    return this.currentAudio
  }
}

export const audioManager = AudioManager.getInstance()
