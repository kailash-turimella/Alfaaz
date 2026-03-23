import { useState, useRef, useEffect } from 'react'
import SpeakButton from '../SpeakButton'

export default function FillInBlank({ exercise, onAnswer, audioEnabled = true }) {
  const [value, setValue] = useState('')
  const [answered, setAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 100)
    return () => clearTimeout(timer)
  }, [])

  function checkAnswer() {
    if (!value.trim() || answered) return
    const normalized = value.trim().toLowerCase()
    const correct = exercise.answer.toLowerCase()
    const alternatives = (exercise.acceptedAlternatives || []).map(a => a.toLowerCase())
    const ok = normalized === correct || alternatives.includes(normalized)
    setIsCorrect(ok)
    setAnswered(true)
    setTimeout(() => {
      onAnswer(ok, null, exercise.answer)
    }, 1100)
  }

  const parts = exercise.sentence.split('_____')
  const before = parts[0] || ''
  const after = parts[1] || ''

  return (
    <div className="flex flex-col gap-5 w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        {audioEnabled && (
          <div className="flex justify-end mb-2">
            <SpeakButton text={exercise.sentence.replace('_____', exercise.answer)} size="sm" />
          </div>
        )}
        <p className="text-lg font-bold text-ink text-center leading-relaxed">
          {before}
          <span
            className={`inline-block min-w-24 border-b-2 mx-1 px-2 text-center transition-colors ${
              answered
                ? isCorrect
                  ? 'border-success text-success'
                  : 'border-error text-error line-through'
                : 'border-primary text-primary'
            }`}
          >
            {answered ? (isCorrect ? value : value || '?') : value || '\u00A0\u00A0\u00A0'}
          </span>
          {after}
        </p>
        {answered && !isCorrect && (
          <p className="text-center mt-3 font-bold text-success animate-pop-in">
            ✓ {exercise.answer}
          </p>
        )}
        {exercise.sentenceEnglish && (
          <p className="text-muted text-sm text-center mt-3 italic">{exercise.sentenceEnglish}</p>
        )}
      </div>

      {exercise.hint && !answered && (
        <p className="text-center text-sm text-muted">💡 {exercise.hint}</p>
      )}

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && checkAnswer()}
        disabled={answered}
        placeholder="Type your answer..."
        className="w-full py-4 px-5 rounded-2xl border-2 border-gray-200 focus:border-primary focus:outline-none text-base font-bold text-center transition-colors disabled:opacity-60 bg-white"
      />

      <button
        onClick={checkAnswer}
        disabled={!value.trim() || answered}
        className="w-full py-4 rounded-2xl bg-primary text-white font-black text-base disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-dark transition-colors active:scale-95"
      >
        Check
      </button>
    </div>
  )
}
