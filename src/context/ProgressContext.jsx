import { createContext, useContext, useState, useEffect } from 'react'

const ProgressContext = createContext()

const defaultState = {
  completedLessons: [],
  xpTotal: 0,
  streak: 0,
  lastActiveDate: null,
  lessonProgress: {},
}

export function ProgressProvider({ username, children }) {
  const storageKey = `hindiApp_progress_${username}`

  const [progress, setProgress] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      return stored ? { ...defaultState, ...JSON.parse(stored) } : defaultState
    } catch {
      return defaultState
    }
  })

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(progress))
  }, [progress, storageKey])

  function completeLesson(lessonId, xpReward) {
    setProgress(prev => {
      const today = new Date().toDateString()
      const alreadyCompleted = prev.completedLessons.includes(lessonId)

      let newStreak = prev.streak
      if (prev.lastActiveDate !== today) {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        if (prev.lastActiveDate === yesterday.toDateString()) {
          newStreak = prev.streak + 1
        } else {
          newStreak = 1
        }
      }

      return {
        ...prev,
        completedLessons: alreadyCompleted
          ? prev.completedLessons
          : [...prev.completedLessons, lessonId],
        xpTotal: prev.xpTotal + (alreadyCompleted ? 0 : xpReward),
        streak: newStreak,
        lastActiveDate: today,
        lessonProgress: {
          ...prev.lessonProgress,
          [lessonId]: { completed: true },
        },
      }
    })
  }

  function resetProgress() {
    setProgress(defaultState)
  }

  return (
    <ProgressContext.Provider value={{ progress, completeLesson, resetProgress }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  return useContext(ProgressContext)
}
