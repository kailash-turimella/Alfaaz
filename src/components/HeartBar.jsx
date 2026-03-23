export default function HeartBar({ hearts, maxHearts = 3 }) {
  return (
    <div className="flex gap-0.5 items-center">
      {Array.from({ length: maxHearts }).map((_, i) => (
        <span
          key={i}
          className={`text-xl leading-none transition-all duration-300 ${
            i < hearts ? 'opacity-100' : 'opacity-25 grayscale'
          }`}
        >
          ❤️
        </span>
      ))}
    </div>
  )
}
