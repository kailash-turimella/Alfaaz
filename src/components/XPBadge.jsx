export default function XPBadge({ xp }) {
  return (
    <div className="flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-bold text-sm">
      <span>⚡</span>
      <span>{xp} XP</span>
    </div>
  )
}
