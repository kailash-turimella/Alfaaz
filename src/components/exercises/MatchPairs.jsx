import { useState, useMemo } from 'react'
import { shuffle } from '../../utils/shuffle'
import { useAudio } from '../../hooks/useAudio'

export default function MatchPairs({ exercise, onAnswer, audioEnabled = true }) {
  const { speak } = useAudio()
  const hindiWords = useMemo(
    () => shuffle(exercise.pairs.map(p => p.hindi)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [exercise.id]
  )
  const englishWords = useMemo(
    () => shuffle(exercise.pairs.map(p => p.english)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [exercise.id]
  )

  const [selectedHindi, setSelectedHindi] = useState(null)
  const [matchedHindi, setMatchedHindi] = useState(new Set())
  const [shaking, setShaking] = useState(null) // { hindi, english }

  function getEnglishForHindi(hindi) {
    return exercise.pairs.find(p => p.hindi === hindi)?.english
  }

  function isEnglishMatched(word) {
    return [...matchedHindi].some(h => getEnglishForHindi(h) === word)
  }

  function handleHindiTap(word) {
    if (matchedHindi.has(word) || shaking) return
    if (audioEnabled) speak(word)
    setSelectedHindi(prev => (prev === word ? null : word))
  }

  function handleEnglishTap(word) {
    if (isEnglishMatched(word) || shaking || !selectedHindi) return

    const correct = getEnglishForHindi(selectedHindi)
    if (correct === word) {
      const next = new Set(matchedHindi)
      next.add(selectedHindi)
      setMatchedHindi(next)
      setSelectedHindi(null)
      if (next.size === exercise.pairs.length) {
        setTimeout(() => onAnswer(true), 500)
      }
    } else {
      setShaking({ hindi: selectedHindi, english: word })
      setTimeout(() => {
        setShaking(null)
        setSelectedHindi(null)
      }, 500)
    }
  }

  function hindiClass(word) {
    if (matchedHindi.has(word)) return 'bg-success/10 border-success text-success font-black'
    if (shaking?.hindi === word) return 'bg-error/10 border-error text-error animate-shake'
    if (selectedHindi === word) return 'bg-primary border-primary text-white shadow-md'
    return 'bg-white border-gray-200 text-ink hover:border-primary/50 active:scale-95'
  }

  function englishClass(word) {
    if (isEnglishMatched(word)) return 'bg-success/10 border-success text-success font-black'
    if (shaking?.english === word) return 'bg-error/10 border-error text-error animate-shake'
    return 'bg-white border-gray-200 text-ink hover:border-primary/50 active:scale-95'
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      <p className="text-center font-bold text-ink text-base">
        {exercise.instruction || 'Match each Hindi word to its meaning'}
      </p>
      <p className="text-center text-muted text-sm">Tap a Hindi word, then its English meaning</p>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-black text-muted text-center uppercase tracking-widest mb-1">Hindi</p>
          {hindiWords.map(word => (
            <button
              key={word}
              onClick={() => handleHindiTap(word)}
              className={`py-3 px-3 rounded-2xl border-2 font-bold text-base transition-all duration-150 text-center ${hindiClass(word)}`}
            >
              {word}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs font-black text-muted text-center uppercase tracking-widest mb-1">Meaning</p>
          {englishWords.map(word => (
            <button
              key={word}
              onClick={() => handleEnglishTap(word)}
              className={`py-3 px-3 rounded-2xl border-2 font-semibold text-sm transition-all duration-150 text-center ${englishClass(word)}`}
            >
              {word}
            </button>
          ))}
        </div>
      </div>

      {selectedHindi && (
        <p className="text-center text-sm text-primary font-bold animate-pulse">
          "{selectedHindi}" selected — now tap the English meaning
        </p>
      )}

      <p className="text-center text-xs text-muted">
        {matchedHindi.size}/{exercise.pairs.length} matched
      </p>
    </div>
  )
}
