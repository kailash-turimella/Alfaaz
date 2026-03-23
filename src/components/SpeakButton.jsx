import { useAudio } from '../hooks/useAudio'

export default function SpeakButton({ text, size = 'md', className = '' }) {
  const { speak } = useAudio()

  const dim = size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8'
  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 20 : 16

  return (
    <button
      type="button"
      onClick={e => {
        e.stopPropagation()
        speak(text)
      }}
      className={`flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/25 transition-colors active:scale-90 flex-shrink-0 ${dim} ${className}`}
      aria-label="Hear pronunciation"
      title="Tap to hear"
    >
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
      </svg>
    </button>
  )
}
