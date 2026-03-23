import { useState, useEffect } from 'react'
import { useAudio } from '../../hooks/useAudio'
import SpeakButton from '../SpeakButton'

export default function FlashCard({ exercise, onAnswer, onAgain, audioEnabled = true }) {
  const [flipped, setFlipped] = useState(false)
  const { speak } = useAudio()

  // Auto-play Hindi word when the card first appears
  useEffect(() => {
    if (audioEnabled) {
      const t = setTimeout(() => speak(exercise.hindi), 300)
      return () => clearTimeout(t)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id, audioEnabled])

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-md mx-auto">
      <div
        className="w-full cursor-pointer select-none"
        onClick={() => !flipped && setFlipped(true)}
      >
        <div
          className={`rounded-3xl border-2 min-h-52 flex flex-col items-center justify-center p-8 text-center transition-all duration-300 ${
            flipped
              ? 'bg-white border-primary/20 shadow-lg'
              : 'bg-primary border-primary shadow-xl active:scale-95'
          }`}
        >
          {!flipped ? (
            <>
              <p className="text-5xl font-black text-white leading-tight">{exercise.hindi}</p>
              <div className="flex items-center gap-2 mt-4">
                <p className="text-white/60 text-sm font-semibold">Tap to reveal meaning</p>
                {audioEnabled && (
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); speak(exercise.hindi) }}
                    className="flex items-center justify-center w-7 h-7 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors active:scale-90"
                    aria-label="Hear pronunciation"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                    </svg>
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-3 animate-pop-in w-full">
              <div className="flex items-center justify-center gap-2">
                <p className="text-4xl font-black text-ink">{exercise.english}</p>
                {audioEnabled && <SpeakButton text={exercise.hindi} size="sm" />}
              </div>
              {exercise.spanish && (
                <p className="text-lg text-muted font-semibold">🇪🇸 {exercise.spanish}</p>
              )}
              {exercise.note && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-sm text-amber-900 text-left mt-3 leading-relaxed">
                  💡 {exercise.note}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {!flipped ? (
        <p className="text-muted text-sm font-semibold">Tap the card to see the meaning</p>
      ) : (
        <div className="flex gap-3 w-full animate-pop-in">
          <button
            onClick={() => onAgain ? onAgain() : onAnswer()}
            className="flex-1 py-3 rounded-2xl border-2 border-gray-200 font-bold text-muted hover:border-gray-300 transition-colors active:scale-95"
          >
            🔁 Again
          </button>
          <button
            onClick={() => onAnswer()}
            className="flex-1 py-3 rounded-2xl bg-success text-white font-bold hover:bg-success/90 transition-colors active:scale-95"
          >
            ✓ Got it!
          </button>
        </div>
      )}
    </div>
  )
}
