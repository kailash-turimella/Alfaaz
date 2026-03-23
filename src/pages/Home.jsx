import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLessonIndex } from '../hooks/useContent'
import { useProgress } from '../context/ProgressContext'
import LessonCard from '../components/LessonCard'
import XPBadge from '../components/XPBadge'

export default function Home({ username, onLogout }) {
  const navigate = useNavigate()
  const { index, loading, error } = useLessonIndex()
  const { progress, resetProgress } = useProgress()
  const [activeSet, setActiveSet] = useState(1)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-5xl animate-pulse">🙏</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <p className="text-error text-center font-bold">
          Couldn't load lessons. Make sure the app is running via <code>npm run dev</code>.
        </p>
      </div>
    )
  }

  const isAdmin = username === 'k'
  const { completedLessons } = progress

  const set1Lessons = index.lessons.filter(l => l.set === 1)
  const set2Lessons = index.lessons.filter(l => l.set === 2)
  const set1Complete = isAdmin || (set1Lessons.length > 0 && set1Lessons.every(l => completedLessons.includes(l.id)))
  const activeLessons = activeSet === 1 ? set1Lessons : set2Lessons

  const activeCompleted = activeLessons.filter(l => completedLessons.includes(l.id)).length

  function getLessonStatus(lesson, idx) {
    if (completedLessons.includes(lesson.id)) return 'completed'
    if (isAdmin) return idx === 0 && activeCompleted === 0 ? 'current' : 'unlocked'

    if (idx === 0) {
      return activeCompleted === 0 ? 'current' : 'unlocked'
    }

    const isUnlocked = activeLessons.some(
      l => completedLessons.includes(l.id) && (l.unlocks || []).includes(lesson.id)
    )
    if (!isUnlocked) return 'locked'

    const isNext =
      activeLessons.filter(l => !completedLessons.includes(l.id))[0]?.id === lesson.id
    return isNext ? 'current' : 'unlocked'
  }

  const categoryColors = {
    foundations: 'bg-blue-100 text-blue-700',
    social: 'bg-purple-100 text-purple-700',
    expression: 'bg-pink-100 text-pink-700',
    practical: 'bg-green-100 text-green-700',
    advanced: 'bg-orange-100 text-orange-700',
    grammar: 'bg-indigo-100 text-indigo-700',
  }

  let lastCategory = null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-20 shadow-sm">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-black text-xl text-ink leading-tight">Alfaaz</h1>
            <div className="flex items-center gap-1.5">
              <p className="text-muted text-xs font-semibold">{username}</p>
              <span className="text-gray-300">·</span>
              <button
                onClick={onLogout}
                className="text-xs text-muted hover:text-error transition-colors font-semibold underline"
              >
                Not you?
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {progress.streak > 0 && (
              <div className="flex items-center gap-1 bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full text-sm font-black">
                🔥 {progress.streak}
              </div>
            )}
            <XPBadge xp={progress.xpTotal} />
          </div>
        </div>
      </div>

      {/* Set tabs */}
      <div className="max-w-md mx-auto px-4 pt-4">
        <div className="flex gap-2 bg-gray-100 rounded-2xl p-1">
          <button
            onClick={() => setActiveSet(1)}
            className={`flex-1 py-2 rounded-xl text-sm font-black transition-all ${
              activeSet === 1
                ? 'bg-white text-ink shadow-sm'
                : 'text-muted hover:text-ink'
            }`}
          >
            Set 1
          </button>
          <button
            onClick={() => set1Complete && setActiveSet(2)}
            className={`flex-1 py-2 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-1.5 ${
              activeSet === 2
                ? 'bg-white text-ink shadow-sm'
                : set1Complete
                ? 'text-muted hover:text-ink'
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            Set 2
            {!set1Complete && <span className="text-base leading-none">🔒</span>}
          </button>
        </div>
      </div>

      {/* Set 2 locked banner */}
      {activeSet === 2 && !set1Complete && (
        <div className="max-w-md mx-auto px-4 pt-3">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-sm text-amber-900 font-semibold text-center">
            Complete all Set 1 lessons to unlock Set 2
          </div>
        </div>
      )}

      {/* Progress summary */}
      {activeCompleted > 0 && (
        <div className="max-w-md mx-auto px-4 pt-4">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="font-black text-ink">
                {activeCompleted}/{activeLessons.length} lessons done
              </p>
              <p className="text-muted text-xs font-semibold mt-0.5">
                {activeSet === 1 ? 'Keep it up!' : 'Grammar master!'}
              </p>
            </div>
            <div className="w-16 h-16">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15" fill="none"
                  stroke="#E8740C" strokeWidth="3"
                  strokeDasharray={`${(activeCompleted / activeLessons.length) * 94.2} 94.2`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Lesson path */}
      <div className="max-w-md mx-auto px-4 py-4 space-y-3 pb-20">
        {activeLessons.map((lesson, idx) => {
          const status = getLessonStatus(lesson, idx)
          const showSectionHeader = lesson.category !== lastCategory
          lastCategory = lesson.category

          return (
            <div key={lesson.id}>
              {showSectionHeader && (
                <div className="flex items-center gap-2 pt-2 pb-1">
                  <span
                    className={`text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      categoryColors[lesson.category] || 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {lesson.category}
                  </span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
              )}
              <LessonCard
                lesson={lesson}
                status={status}
                onPress={() => {
                  if (status === 'locked') return
                  if (status === 'completed') {
                    navigate(`/review/${lesson.id}`)
                  } else {
                    navigate(`/lesson/${lesson.id}`)
                  }
                }}
              />
            </div>
          )
        })}

        <div className="pt-8 text-center space-y-3">
          {activeSet === 2 && set2Lessons.length === 0 ? (
            <p className="text-muted text-sm font-semibold">🙏 Set 2 lessons coming soon</p>
          ) : (
            <p className="text-muted text-sm font-semibold">🙏 More lessons coming soon</p>
          )}
          {completedLessons.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Reset all progress? This cannot be undone.')) resetProgress()
              }}
              className="text-xs text-gray-400 underline hover:text-error transition-colors"
            >
              Reset progress
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
