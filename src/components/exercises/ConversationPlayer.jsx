import { useState, useMemo, useRef, useEffect } from 'react'
import { shuffle } from '../../utils/shuffle'
import { useAudio } from '../../hooks/useAudio'
import SpeakButton from '../SpeakButton'

export default function ConversationPlayer({ exercise, onAnswer, audioEnabled = true }) {
  const [currentLine, setCurrentLine] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [lineAnswered, setLineAnswered] = useState(false)
  const scrollRef = useRef(null)
  const { speak } = useAudio()

  const shuffledOptionsMap = useMemo(() => {
    const map = {}
    exercise.lines.forEach((line, i) => {
      if (line.isBlanked && line.options) {
        map[i] = shuffle(line.options)
      }
    })
    return map
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [currentLine, lineAnswered])

  // Auto-speak non-blanked lines and revealed answers
  useEffect(() => {
    if (!audioEnabled) return
    const line = exercise.lines[currentLine]
    if (!line.isBlanked) {
      const t = setTimeout(() => speak(line.hindi), 400)
      return () => clearTimeout(t)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLine, audioEnabled])

  useEffect(() => {
    if (!audioEnabled || !lineAnswered) return
    const line = exercise.lines[currentLine]
    if (line.isBlanked) {
      const t = setTimeout(() => speak(line.hindi), 300)
      return () => clearTimeout(t)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineAnswered, audioEnabled])

  const line = exercise.lines[currentLine]
  const currentOptions = shuffledOptionsMap[currentLine] || []

  function handleContinue() {
    const next = currentLine + 1
    if (next >= exercise.lines.length) {
      onAnswer(true)
    } else {
      setCurrentLine(next)
      setSelectedAnswer(null)
      setLineAnswered(false)
    }
  }

  function handleOptionSelect(option) {
    if (lineAnswered) return
    setSelectedAnswer(option)
    setLineAnswered(true)
  }

  function optionClass(option) {
    if (!lineAnswered) return 'bg-white border-gray-200 text-ink hover:border-primary/50 active:scale-95'
    if (option === line.hindi) return 'bg-success/10 border-success text-success font-black'
    if (option === selectedAnswer) return 'bg-error/10 border-error text-error'
    return 'bg-white border-gray-100 text-gray-400 opacity-60'
  }

  const isUser = (l) => l.speaker === exercise.blankedSpeaker

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      {exercise.context && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-sm text-amber-900 font-semibold">
          📍 {exercise.context}
        </div>
      )}

      <div
        ref={scrollRef}
        className="space-y-3 bg-gray-50 rounded-2xl p-4 min-h-44 max-h-64 overflow-y-auto"
      >
        {exercise.lines.slice(0, currentLine + 1).map((l, i) => {
          const user = isUser(l)
          const isPending = i === currentLine && l.isBlanked && !lineAnswered

          if (isPending) {
            return (
              <div key={i} className="flex justify-end">
                <div className="bg-primary/15 border-2 border-dashed border-primary/30 rounded-2xl rounded-br-sm px-4 py-3 text-primary/50 text-sm italic">
                  Your response...
                </div>
              </div>
            )
          }

          const displayHindi =
            i === currentLine && l.isBlanked && lineAnswered ? selectedAnswer || l.hindi : l.hindi
          const wasWrong = i === currentLine && l.isBlanked && lineAnswered && selectedAnswer !== l.hindi

          return (
            <div key={i} className={`flex ${user ? 'justify-end' : 'justify-start'} items-end gap-1.5 animate-pop-in`}>
              {!user && audioEnabled && (
                <SpeakButton text={l.hindi} size="sm" className="mb-1" />
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                  user
                    ? 'bg-primary text-white rounded-br-sm'
                    : 'bg-white border border-gray-200 text-ink rounded-bl-sm'
                }`}
              >
                <p className="font-bold">{displayHindi}</p>
                {wasWrong && (
                  <p className="text-white/70 text-xs mt-0.5 line-through">{selectedAnswer}</p>
                )}
                <p className={`text-xs mt-1 ${user ? 'text-white/65' : 'text-muted'}`}>
                  {l.english}
                </p>
              </div>
              {user && audioEnabled && (
                <SpeakButton text={l.hindi} size="sm" className="mb-1" />
              )}
            </div>
          )
        })}
      </div>

      {line.isBlanked && !lineAnswered ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted text-center font-bold">Your turn — what do you say?</p>
          {currentOptions.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleOptionSelect(opt)}
              className={`w-full py-3 px-4 rounded-2xl border-2 text-left font-semibold text-sm transition-all duration-150 ${optionClass(opt)}`}
            >
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <button
          onClick={handleContinue}
          className="w-full py-4 rounded-2xl bg-primary text-white font-black hover:bg-primary-dark transition-colors active:scale-95"
        >
          {currentLine >= exercise.lines.length - 1 ? '✓ Complete' : '→ Continue'}
        </button>
      )}
    </div>
  )
}
