import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLesson } from '../hooks/useContent'
import { useProgress } from '../context/ProgressContext'
import ProgressBar from '../components/ProgressBar'
import HeartBar from '../components/HeartBar'
import ResultScreen from '../components/ResultScreen'
import FlashCard from '../components/exercises/FlashCard'
import MultipleChoice from '../components/exercises/MultipleChoice'
import FillInBlank from '../components/exercises/FillInBlank'
import MatchPairs from '../components/exercises/MatchPairs'
import ConversationPlayer from '../components/exercises/ConversationPlayer'

export default function Lesson() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const { lesson, loading, error } = useLesson(lessonId)
  const { completeLesson } = useProgress()

  const [culturalNoteDismissed, setCulturalNoteDismissed] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [furthestIndex, setFurthestIndex] = useState(0)
  const [hearts, setHearts] = useState(3)
  const [feedback, setFeedback] = useState(null)
  const [lessonComplete, setLessonComplete] = useState(false)
  const [lessonFailed, setLessonFailed] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(() => {
    try { return localStorage.getItem('hindi_audio') !== 'false' } catch { return true }
  })
  const [exerciseQueue, setExerciseQueue] = useState([])
  const queueReadyRef = useRef(false)

  useEffect(() => {
    if (lesson && !queueReadyRef.current) {
      queueReadyRef.current = true
      setExerciseQueue([...lesson.exercises])
    }
  }, [lesson])

  function toggleAudio() {
    setAudioEnabled(prev => {
      const next = !prev
      try { localStorage.setItem('hindi_audio', String(next)) } catch {}
      return next
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-5xl animate-pulse">🙏</div>
      </div>
    )
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="text-center space-y-4">
          <p className="text-error font-bold">Couldn't load this lesson.</p>
          <button onClick={() => navigate('/')} className="text-primary underline font-bold">
            ← Go home
          </button>
        </div>
      </div>
    )
  }

  const originalTotal = lesson.exercises.length
  const currentExercise = exerciseQueue[currentIndex]

  function advanceTo(nextIndex) {
    setCurrentIndex(nextIndex)
    setFurthestIndex(prev => Math.max(prev, nextIndex))
  }

  function handleAgain() {
    setExerciseQueue(prev => {
      const q = [...prev]
      const insertAt = Math.min(currentIndex + 2, q.length)
      q.splice(insertAt, 0, q[currentIndex])
      return q
    })
    advanceTo(currentIndex + 1)
  }

  function handleFlashCardAdvance() {
    const nextIndex = currentIndex + 1
    if (nextIndex >= exerciseQueue.length) {
      completeLesson(lessonId, lesson.xpReward || 20)
      setLessonComplete(true)
    } else {
      advanceTo(nextIndex)
    }
  }

  function handleAnswer(isCorrect, note = null, correctAnswer = null) {
    if (isCorrect) {
      setFeedback({ type: 'correct', note, correctAnswer: null })
    } else {
      const newHearts = hearts - 1
      setHearts(newHearts)
      setFeedback({
        type: 'incorrect',
        note,
        correctAnswer,
        willFail: newHearts <= 0,
      })
    }
  }

  function handleFeedbackContinue() {
    const willFail = feedback?.willFail
    setFeedback(null)

    if (willFail) {
      setLessonFailed(true)
      return
    }

    const nextIndex = currentIndex + 1
    if (nextIndex >= exerciseQueue.length) {
      completeLesson(lessonId, lesson.xpReward || 20)
      setLessonComplete(true)
    } else {
      advanceTo(nextIndex)
    }
  }

  function handleRetry() {
    setCurrentIndex(0)
    setFurthestIndex(0)
    setHearts(3)
    setFeedback(null)
    setLessonComplete(false)
    setLessonFailed(false)
    setCulturalNoteDismissed(false)
    queueReadyRef.current = true
    setExerciseQueue([...lesson.exercises])
  }

  // Cultural note gate
  if (lesson.culturalNote && !culturalNoteDismissed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-5">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-6 space-y-5 animate-pop-in">
          <div className="text-center">
            <span className="text-5xl">{lesson.icon || '💡'}</span>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-black text-ink">{lesson.title}</h2>
            <p className="text-muted text-sm mt-1">{lesson.description}</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <p className="text-sm text-amber-900 leading-relaxed font-semibold">
              🌆 {lesson.culturalNote}
            </p>
          </div>
          <button
            onClick={() => setCulturalNoteDismissed(true)}
            className="w-full py-4 rounded-2xl bg-primary text-white font-black text-lg hover:bg-primary-dark transition-colors active:scale-95 shadow-md"
          >
            Let's go! →
          </button>
        </div>
      </div>
    )
  }

  // Lesson failed
  if (lessonFailed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-5">
        <div className="max-w-md w-full text-center space-y-6 animate-pop-in">
          <div className="text-7xl">💔</div>
          <div>
            <h2 className="text-2xl font-black text-ink">You ran out of hearts</h2>
            <p className="text-muted mt-2">No worries — practice makes perfect. Try again!</p>
          </div>
          <button
            onClick={handleRetry}
            className="w-full py-4 rounded-2xl bg-primary text-white font-black text-lg hover:bg-primary-dark transition-colors active:scale-95"
          >
            🔁 Try Again
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 rounded-2xl border-2 border-gray-200 text-muted font-bold hover:border-gray-300 transition-colors active:scale-95"
          >
            ← Back to home
          </button>
        </div>
      </div>
    )
  }

  // Lesson complete
  if (lessonComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-5">
        <div className="max-w-md w-full">
          <ResultScreen
            xpEarned={lesson.xpReward || 20}
            heartsRemaining={hearts}
            lessonTitle={lesson.title}
            onContinue={() => navigate('/')}
          />
        </div>
      </div>
    )
  }

  function renderExercise() {
    if (!currentExercise) return null
    const commonProps = { exercise: currentExercise, key: currentIndex, audioEnabled }
    switch (currentExercise.type) {
      case 'flashcard':
        return <FlashCard {...commonProps} onAgain={handleAgain} onAnswer={handleFlashCardAdvance} />
      case 'multiple_choice':
        return <MultipleChoice {...commonProps} onAnswer={handleAnswer} />
      case 'fill_in_blank':
        return <FillInBlank {...commonProps} onAnswer={handleAnswer} />
      case 'match_pairs':
        return <MatchPairs {...commonProps} onAnswer={handleAnswer} />
      case 'conversation':
        return <ConversationPlayer {...commonProps} onAnswer={handleAnswer} />
      default:
        return (
          <div className="text-center text-muted p-8">
            <p>Unknown exercise type: <code>{currentExercise.type}</code></p>
            <button onClick={() => handleAnswer(true)} className="mt-4 text-primary underline">Skip</button>
          </div>
        )
    }
  }

  const exerciseTypeLabel = {
    flashcard: 'Flashcard',
    multiple_choice: 'Multiple Choice',
    fill_in_blank: 'Fill in the Blank',
    match_pairs: 'Match Pairs',
    conversation: 'Conversation',
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
        <button
          onClick={() => navigate('/')}
          className="text-muted hover:text-ink transition-colors p-1 -ml-1 font-bold text-lg leading-none"
          aria-label="Exit lesson"
        >
          ✕
        </button>
        <button
          onClick={() => setCurrentIndex(i => i - 1)}
          disabled={currentIndex === 0 || !!feedback}
          className="text-muted hover:text-ink transition-colors p-1 disabled:opacity-25 disabled:cursor-not-allowed"
          aria-label="Previous exercise"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>
        <button
          onClick={() => setCurrentIndex(i => i + 1)}
          disabled={currentIndex >= furthestIndex || !!feedback}
          className="text-muted hover:text-ink transition-colors p-1 disabled:opacity-25 disabled:cursor-not-allowed"
          aria-label="Next exercise"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
        </button>
        <div className="flex-1">
          <ProgressBar current={Math.min(currentIndex, originalTotal - 1)} total={originalTotal} />
        </div>
        <button
          onClick={toggleAudio}
          className="text-muted hover:text-ink transition-colors p-1 flex-shrink-0"
          aria-label={audioEnabled ? 'Mute audio' : 'Unmute audio'}
          title={audioEnabled ? 'Mute' : 'Unmute'}
        >
          {audioEnabled ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
            </svg>
          )}
        </button>
        <HeartBar hearts={hearts} />
      </div>

      {/* Exercise area */}
      <div className="flex-1 flex flex-col justify-center px-4 py-6 pb-32">
        <div className="max-w-md mx-auto w-full">
          <p className="text-xs text-muted text-center mb-5 uppercase tracking-widest font-black">
            {exerciseTypeLabel[currentExercise?.type] || ''} · {Math.min(currentIndex + 1, originalTotal)} / {originalTotal}
          </p>
          {renderExercise()}
        </div>
      </div>

      {/* Feedback overlay */}
      {feedback && (
        <div
          className={`fixed bottom-0 left-0 right-0 px-4 pt-4 pb-6 border-t-2 animate-pop-in ${
            feedback.type === 'correct'
              ? 'bg-success/10 border-success'
              : 'bg-error/10 border-error'
          }`}
        >
          <div className="max-w-md mx-auto space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{feedback.type === 'correct' ? '✅' : '❌'}</span>
              <p
                className={`font-black text-xl ${
                  feedback.type === 'correct' ? 'text-success' : 'text-error'
                }`}
              >
                {feedback.type === 'correct' ? 'Correct!' : 'Not quite!'}
              </p>
            </div>
            {feedback.correctAnswer && (
              <p className="text-sm text-ink font-semibold">
                Correct answer:{' '}
                <span className="font-black text-base">{feedback.correctAnswer}</span>
              </p>
            )}
            {feedback.note && (
              <p className="text-sm text-muted bg-white/80 rounded-xl px-3 py-2">
                💡 {feedback.note}
              </p>
            )}
            <button
              onClick={handleFeedbackContinue}
              className={`w-full py-3 rounded-2xl font-black text-white transition-colors active:scale-95 ${
                feedback.type === 'correct'
                  ? 'bg-success hover:bg-success/90'
                  : 'bg-error hover:bg-error/90'
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
