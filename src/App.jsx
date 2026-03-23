import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Lesson from './pages/Lesson'
import Review from './pages/Review'
import LoginScreen from './pages/LoginScreen'
import { ProgressProvider } from './context/ProgressContext'

export default function App() {
  const [username, setUsername] = useState(() => {
    try { return localStorage.getItem('hindiApp_username') || '' } catch { return '' }
  })

  function handleLogout() {
    localStorage.removeItem('hindiApp_username')
    setUsername('')
  }

  if (!username) {
    return (
      <div className="min-h-screen bg-background font-sans">
        <LoginScreen onLogin={setUsername} />
      </div>
    )
  }

  return (
    <ProgressProvider username={username}>
      <div className="min-h-screen bg-background font-sans">
        <Routes>
          <Route path="/" element={<Home username={username} onLogout={handleLogout} />} />
          <Route path="/lesson/:lessonId" element={<Lesson />} />
          <Route path="/review/:lessonId" element={<Review />} />
        </Routes>
      </div>
    </ProgressProvider>
  )
}
