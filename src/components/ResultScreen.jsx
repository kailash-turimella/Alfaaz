export default function ResultScreen({ xpEarned, heartsRemaining, lessonTitle, onContinue }) {
  const stars = heartsRemaining === 3 ? 3 : heartsRemaining >= 2 ? 2 : 1

  return (
    <div className="flex flex-col items-center gap-6 text-center py-8 px-4 animate-pop-in">
      <div className="text-7xl">{stars === 3 ? '🏆' : stars === 2 ? '⭐' : '✨'}</div>

      <div>
        <h2 className="text-2xl font-black text-ink">Lesson Complete!</h2>
        <p className="text-muted mt-1 text-sm">{lessonTitle}</p>
      </div>

      <div className="flex gap-3 justify-center">
        {[1, 2, 3].map(i => (
          <span key={i} className={`text-3xl transition-all ${i <= stars ? '' : 'grayscale opacity-25'}`}>
            ⭐
          </span>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 w-full">
        <p className="text-4xl font-black text-amber-600">+{xpEarned}</p>
        <p className="text-muted text-sm font-bold mt-1">XP EARNED</p>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className={`text-xl ${i < heartsRemaining ? '' : 'grayscale opacity-25'}`}>
              ❤️
            </span>
          ))}
        </div>
        <p className="text-muted text-xs">
          {heartsRemaining} heart{heartsRemaining !== 1 ? 's' : ''} remaining
        </p>
      </div>

      <button
        onClick={onContinue}
        className="w-full py-4 rounded-2xl bg-primary text-white font-black text-lg hover:bg-primary-dark transition-colors shadow-md active:scale-95"
      >
        Continue →
      </button>
    </div>
  )
}
