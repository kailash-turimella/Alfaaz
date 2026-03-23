export default function LessonCard({ lesson, status, onPress }) {
  const isLocked = status === 'locked'
  const isCompleted = status === 'completed'
  const isCurrent = status === 'current'

  const cardClass = [
    'w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 active:scale-98',
    isLocked
      ? 'bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed'
      : isCompleted
      ? 'bg-white border-success/40 shadow-sm hover:border-success/60'
      : isCurrent
      ? 'bg-white border-primary shadow-lg ring-2 ring-primary/20'
      : 'bg-white border-gray-200 shadow-sm hover:border-primary/40 hover:shadow-md',
  ].join(' ')

  const iconBg = isLocked
    ? 'bg-gray-200'
    : isCompleted
    ? 'bg-success/10'
    : isCurrent
    ? 'bg-primary/10'
    : 'bg-orange-50'

  return (
    <button onClick={!isLocked ? onPress : undefined} disabled={isLocked} className={cardClass}>
      <div className="flex items-center gap-4">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 ${iconBg}`}
        >
          {isLocked ? '🔒' : lesson.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={`font-bold text-base leading-tight ${isLocked ? 'text-muted' : 'text-ink'}`}>
              {lesson.title}
            </h3>
            {isCompleted && <span className="text-success text-base">✓</span>}
          </div>
          <p className={`text-sm truncate mt-0.5 ${isLocked ? 'text-gray-400' : 'text-muted'}`}>
            {lesson.subtitle}
          </p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-xs font-bold text-amber-600">⚡ {lesson.xpReward} XP</span>
            <span className="text-xs text-muted capitalize">{lesson.category}</span>
            {isCurrent && (
              <span className="text-xs font-black text-primary animate-pulse tracking-wide">START</span>
            )}
          </div>
        </div>
      </div>
    </button>
  )
}
