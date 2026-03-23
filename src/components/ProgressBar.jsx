export default function ProgressBar({ current, total }) {
  const pct = total === 0 ? 0 : Math.min(100, Math.round((current / total) * 100))
  return (
    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
