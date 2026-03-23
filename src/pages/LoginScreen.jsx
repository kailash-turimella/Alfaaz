import { useState } from 'react'

export default function LoginScreen({ onLogin }) {
  const [name, setName] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    localStorage.setItem('hindiApp_username', trimmed)
    onLogin(trimmed)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-5">
      <div className="max-w-sm w-full bg-white rounded-3xl shadow-xl p-8 space-y-6 animate-pop-in">
        <div className="text-center space-y-2">
          <div className="text-6xl">🙏</div>
          <h1 className="text-3xl font-black text-ink">Alfaaz</h1>
          <p className="text-muted text-sm font-semibold">Conversational Hindi</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-black text-ink mb-2">What's your name?</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name..."
              autoFocus
              className="w-full py-4 px-5 rounded-2xl border-2 border-gray-200 focus:border-primary focus:outline-none text-base font-bold transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-4 rounded-2xl bg-primary text-white font-black text-lg hover:bg-primary-dark transition-colors active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
          >
            Start learning →
          </button>
        </form>
      </div>
    </div>
  )
}
