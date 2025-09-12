'use client'

import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react'

interface Track {
  id: string
  title: string
  src: string
  artist?: string
}

interface MusicState {
  tracks: Track[]
  currentTrackIndex: number
  isPlaying: boolean
  volume: number
  showPlayer: boolean
}

type MusicAction = 
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'NEXT_TRACK' }
  | { type: 'PREVIOUS_TRACK' }
  | { type: 'SET_TRACK'; index: number }
  | { type: 'SET_VOLUME'; volume: number }
  | { type: 'TOGGLE_PLAYER' }

const initialTracks: Track[] = [
  { id: 'may-it-be', title: 'May It Be', src: '/audio/May It Be.mp3', artist: 'Enya' },
  { id: 'first-town', title: 'The First Town', src: '/audio/The First Town.mp3', artist: 'Medieval' },
  { id: 'misty-mountains', title: 'The Misty Mountains Cold', src: '/audio/The Misty Mountains Cold.mp3', artist: 'The Hobbit' }
]

const initialState: MusicState = {
  tracks: initialTracks,
  currentTrackIndex: 0,
  isPlaying: false,
  volume: 0.6,
  showPlayer: true
}

function musicReducer(state: MusicState, action: MusicAction): MusicState {
  switch (action.type) {
    case 'PLAY':
      return { ...state, isPlaying: true }
    case 'PAUSE':
      return { ...state, isPlaying: false }
    case 'NEXT_TRACK':
      return { 
        ...state, 
        currentTrackIndex: (state.currentTrackIndex + 1) % state.tracks.length 
      }
    case 'PREVIOUS_TRACK':
      return { 
        ...state, 
        currentTrackIndex: state.currentTrackIndex === 0 
          ? state.tracks.length - 1 
          : state.currentTrackIndex - 1 
      }
    case 'SET_TRACK':
      return { ...state, currentTrackIndex: action.index }
    case 'SET_VOLUME':
      return { ...state, volume: Math.max(0, Math.min(1, action.volume)) }
    case 'TOGGLE_PLAYER':
      return { ...state, showPlayer: !state.showPlayer }
    default:
      return state
  }
}

interface MusicContextType {
  state: MusicState
  dispatch: React.Dispatch<MusicAction>
  currentTrack: Track
}

const MusicContext = createContext<MusicContextType | undefined>(undefined)

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(musicReducer, initialState)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const currentTrack = state.tracks[state.currentTrackIndex]

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.loop = false
      
      audioRef.current.addEventListener('ended', () => {
        dispatch({ type: 'NEXT_TRACK' })
      })
    }

    const audio = audioRef.current
    audio.src = currentTrack.src
    audio.volume = state.volume

    if (state.isPlaying) {
      const playAudio = async () => {
        try {
          await audio.play()
        } catch (error) {
          console.log('Autoplay bloqueado:', error)
        }
      }
      playAudio()
    } else {
      audio.pause()
    }

    return () => {
      if (audio && !state.isPlaying) {
        audio.pause()
      }
    }
  }, [currentTrack, state.isPlaying, state.volume])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.volume
    }
  }, [state.volume])

  return (
    <MusicContext.Provider value={{ state, dispatch, currentTrack }}>
      {children}
    </MusicContext.Provider>
  )
}

export function useMusic() {
  const context = useContext(MusicContext)
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider')
  }
  return context
}
