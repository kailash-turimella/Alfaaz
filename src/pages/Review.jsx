import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLesson } from '../hooks/useContent'
import FlashCard from '../components/exercises/FlashCard'
import ProgressBar from '../components/ProgressBar'

export default function Review() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const { lesson, loading } = useLesson(lessonId)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [done, setDone] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(() => {
    try { return localStorage.getItem('hindi_audio') !== 'false' } catch { return true }
  })

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

  if (!lesson) return null

  const reviewItems = lesson.exercises.filter(e => e.type === 'flashcard')

  if (done || reviewItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-5">
        <div className="max-w-md w-full text-center space-y-6 animate-pop-in">
          <div className="text-7xl">🎉</div>
          <div>
            <h2 className="text-2xl font-black text-ink">Review complete!</h2>
            <p className="text-muted mt-2">
              You reviewed all {reviewItems.length} flashcard{reviewItems.length !== 1 ? 's' : ''} in{' '}
              <span className="font-bold text-ink">{lesson.title}</span>.
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-full py-4 rounded-2xl bg-primary text-white font-black text-lg hover:bg-primary-dark transition-colors active:scale-95"
          >
            ← Back to home
          </button>
          <button
            onClick={() => {
              setCurrentIndex(0)
              setDone(false)
            }}
            className="w-full py-3 rounded-2xl border-2 border-gray-200 text-muted font-bold hover:border-gray-300 transition-colors"
          >
            🔁 Review again
          </button>
        </div>
      </div>
    )
  }

  const current = reviewItems[currentIndex]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
        <button
          onClick={() => navigate('/')}
          className="text-muted hover:text-ink transition-colors p-1 -ml-1 font-bold text-lg leading-none"
        >
          ✕
        </button>
        <div className="flex-1">
          <ProgressBar current={currentIndex} total={reviewItems.length} />
        </div>
        <button
          onClick={toggleAudio}
          className="text-muted hover:text-ink transition-colors p-1 flex-shrink-0"
          aria-label={audioEnabled ? 'Mute audio' : 'Unmute audio'}
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
        <span className="text-sm text-muted font-black">
          {currentIndex + 1}/{reviewItems.length}
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-center px-4 py-6">
        <div className="max-w-md mx-auto w-full">
          <p className="text-xs text-muted text-center mb-5 uppercase tracking-widest font-black">
            Review · {lesson.title}
          </p>
          <FlashCard
            key={current.id}
            exercise={current}
            audioEnabled={audioEnabled}
            onAnswer={() => {
              if (currentIndex + 1 >= reviewItems.length) {
                setDone(true)
              } else {
                setCurrentIndex(i => i + 1)
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}
