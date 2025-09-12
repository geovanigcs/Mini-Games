'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, SkipForward, SkipBack, Volume2, ChevronUp, ChevronDown } from 'lucide-react'
import { useMusic } from '@/contexts/MusicContext'

export default function GlobalMusicPlayer() {
  const { state, dispatch, currentTrack } = useMusic()
  const [showVolumeControl, setShowVolumeControl] = useState(false)

  const togglePlay = () => {
    dispatch({ type: state.isPlaying ? 'PAUSE' : 'PLAY' })
  }

  const nextTrack = () => {
    dispatch({ type: 'NEXT_TRACK' })
  }

  const previousTrack = () => {
    dispatch({ type: 'PREVIOUS_TRACK' })
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    dispatch({ type: 'SET_VOLUME', volume: newVolume })
  }

  const togglePlayer = () => {
    dispatch({ type: 'TOGGLE_PLAYER' })
  }

  if (!state.showPlayer) {
    return (
      <motion.button
        onClick={togglePlayer}
        className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-stone-800/90 border border-amber-600/30 text-amber-200 hover:bg-amber-600/20 transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronUp className="w-5 h-5" />
      </motion.button>
    )
  }

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-4 right-4 z-50 bg-stone-900/95 border border-amber-600/30 rounded-xl p-4 backdrop-blur-sm shadow-2xl"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-amber-200 text-sm font-medium truncate max-w-[200px]">
          {currentTrack.title}
        </div>
        <button
          onClick={togglePlayer}
          className="text-amber-400 hover:text-amber-300 transition-colors"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {currentTrack.artist && (
        <div className="text-amber-400/70 text-xs mb-3 truncate max-w-[200px]">
          {currentTrack.artist}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={previousTrack}
          className="p-2 rounded-full bg-stone-800/80 border border-amber-600/30 text-amber-200 hover:bg-amber-600/20 transition-all duration-300"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        <button
          onClick={togglePlay}
          className="p-3 rounded-full bg-amber-600 text-stone-900 hover:bg-amber-500 transition-all duration-300"
        >
          {state.isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>

        <button
          onClick={nextTrack}
          className="p-2 rounded-full bg-stone-800/80 border border-amber-600/30 text-amber-200 hover:bg-amber-600/20 transition-all duration-300"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        <div 
          className="relative"
          onMouseEnter={() => setShowVolumeControl(true)}
          onMouseLeave={() => setShowVolumeControl(false)}
        >
          <button className="p-2 rounded-full bg-stone-800/80 border border-amber-600/30 text-amber-200 hover:bg-amber-600/20 transition-all duration-300">
            <Volume2 className="w-4 h-4" />
          </button>

          <AnimatePresence>
            {showVolumeControl && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full right-0 mb-2 bg-stone-800/90 border border-amber-600/30 rounded-lg p-3 flex items-center gap-2"
              >
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={state.volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-2 bg-stone-600 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-amber-200 text-xs min-w-[3ch]">
                  {Math.round(state.volume * 100)}%
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
