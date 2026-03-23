import { useState, useMemo } from 'react'
import { shuffle } from '../../utils/shuffle'

export default function MultipleChoice({ exercise, onAnswer }) {
  const options = useMemo(
    () => shuffle([exercise.correctAnswer, ...exercise.distractors]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [exercise.id]
  )
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)

  function handleSelect(option) {
    if (answered) return
    setSelected(option)
    setAnswered(true)
    const isCorrect = option === exercise.correctAnswer
    setTimeout(() => {
      onAnswer(isCorrect, null, exercise.correctAnswer)
    }, 900)
  }

  function getButtonClass(option) {
    if (!answered) {
      return 'bg-white border-gray-200 text-ink hover:border-primary hover:bg-primary/5 active:scale-95'
    }
    if (option === exercise.correctAnswer) {
      return 'bg-success/10 border-success text-success font-black'
    }
    if (option === selected) {
      return 'bg-error/10 border-error text-error'
    }
    return 'bg-white border-gray-100 text-gray-400 opacity-60'
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <p className="text-xl font-bold text-ink text-center leading-snug">{exercise.prompt}</p>
        {exercise.hint && !answered && (
          <p className="text-muted text-sm text-center mt-3">💡 {exercise.hint}</p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleSelect(option)}
            className={`w-full py-4 px-5 rounded-2xl border-2 text-left font-semibold text-base transition-all duration-150 ${getButtonClass(option)}`}
          >
            {option}
          </button>
        ))}
      </div>

      {answered && exercise.culturalNote && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-sm text-amber-900 animate-pop-in">
          💡 {exercise.culturalNote}
        </div>
      )}
    </div>
  )
}
