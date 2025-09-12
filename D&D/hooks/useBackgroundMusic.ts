import { useEffect, useRef, useState } from 'react'
import { audioManager } from '@/lib/audioManager'

interface UseBackgroundMusicOptions {
  src: string
  volume?: number
  loop?: boolean
  autoplay?: boolean
}

export function useBackgroundMusic({ 
  src, 
  volume = 0.6, 
  loop = true, 
  autoplay = true 
}: UseBackgroundMusicOptions) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [currentVolume, setCurrentVolume] = useState(volume)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    audioManager.stopCurrentAudio()
    
    const audio = new Audio(src)
    audio.loop = loop
    audio.volume = currentVolume
    audioRef.current = audio
    audioManager.setCurrentAudio(audio)

    audio.addEventListener('play', () => setIsPlaying(true))
    audio.addEventListener('pause', () => setIsPlaying(false))
    audio.addEventListener('ended', () => setIsPlaying(false))

    if (autoplay) {
      const playAudio = async () => {
        try {
          await audio.play()
        } catch (error) {
          const handleUserInteraction = async () => {
            try {
              await audio.play()
              document.removeEventListener('click', handleUserInteraction)
              document.removeEventListener('keydown', handleUserInteraction)
              document.removeEventListener('touchstart', handleUserInteraction)
            } catch (err) {
              console.log('Não foi possível reproduzir o áudio:', err)
            }
          }
          
          document.addEventListener('click', handleUserInteraction)
          document.addEventListener('keydown', handleUserInteraction)
          document.addEventListener('touchstart', handleUserInteraction)
        }
      }

      playAudio()
    }

    return () => {
      audio.pause()
      audio.currentTime = 0
    }
  }, [src, loop, autoplay])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = currentVolume
    }
  }, [currentVolume])

  const play = async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play()
      } catch (error) {
        console.log('Erro ao reproduzir:', error)
      }
    }
  }

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  const changeVolume = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume))
    setCurrentVolume(clampedVolume)
  }

  return { 
    play, 
    pause, 
    stop, 
    changeVolume, 
    volume: currentVolume, 
    isPlaying 
  }
}
