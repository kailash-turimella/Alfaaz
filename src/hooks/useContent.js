import { useState, useEffect } from 'react'

export function useLessonIndex() {
  const [index, setIndex] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/content/index.json')
      .then(r => {
        if (!r.ok) throw new Error('Failed to load index')
        return r.json()
      })
      .then(data => {
        setIndex(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err)
        setLoading(false)
      })
  }, [])

  return { index, loading, error }
}

export function useLesson(lessonId) {
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!lessonId) return
    setLoading(true)
    setLesson(null)
    fetch(`/content/${lessonId}.json`)
      .then(r => {
        if (!r.ok) throw new Error('Failed to load lesson')
        return r.json()
      })
      .then(data => {
        setLesson(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err)
        setLoading(false)
      })
  }, [lessonId])

  return { lesson, loading, error }
}
