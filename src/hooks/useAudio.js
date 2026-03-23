import { useEffect } from 'react'

const API_KEY = import.meta.env.VITE_GOOGLE_TTS_KEY

// Shared across all hook instances — only one thing plays at a time
const audioCache = new Map()
let currentAudio = null
const synth = typeof window !== 'undefined' ? window.speechSynthesis : null

function stopCurrent() {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio = null
  }
  synth?.cancel()
}

async function speakGoogle(text) {
  stopCurrent()
  try {
    let url = audioCache.get(text)
    if (!url) {
      const res = await fetch(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: { text },
            voice: { languageCode: 'hi-IN', name: 'hi-IN-Neural2-A' },
            audioConfig: { audioEncoding: 'MP3', speakingRate: 0.85 },
          }),
        }
      )
      if (!res.ok) throw new Error(`Google TTS ${res.status}`)
      const { audioContent } = await res.json()
      const binary = atob(audioContent)
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
      url = URL.createObjectURL(new Blob([bytes], { type: 'audio/mp3' }))
      audioCache.set(text, url)
    }
    const audio = new Audio(url)
    currentAudio = audio
    audio.play()
  } catch (err) {
    console.error('Google TTS failed, falling back to browser:', err)
    speakBrowser(text)
  }
}

function speakBrowser(text) {
  if (!synth) return
  synth.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'hi-IN'
  utterance.rate = 0.82
  utterance.pitch = 1
  synth.speak(utterance)
}

export function useAudio() {
  function speak(text) {
    if (API_KEY) {
      console.log('[audio] Google TTS →', text)
      speakGoogle(text)
    } else {
      console.log('[audio] Browser TTS (no API key) →', text)
      speakBrowser(text)
    }
  }

  function stop() {
    stopCurrent()
  }

  useEffect(() => () => stop(), [])

  return { speak, stop }
}
