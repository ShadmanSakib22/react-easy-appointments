type Props = {
  durations: number[]
  value: number
  onChange: (v: number) => void
  headless: boolean
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h}hr` : `${h}h ${m}m`
}

export function DurationPicker({ durations, value, onChange, headless }: Props) {
  return (
    <div className={headless ? undefined : 'rea-duration-picker'}>
      <span className={headless ? undefined : 'rea-modal__label'}>Duration</span>
      <div className={headless ? undefined : 'rea-duration-picker__options'}>
        {durations.map(d => (
          <button
            key={d}
            type="button"
            onClick={() => onChange(d)}
            aria-pressed={value === d}
            className={
              headless
                ? undefined
                : `rea-duration-btn${value === d ? ' rea-duration-btn--active' : ''}`
            }
          >
            {formatDuration(d)}
          </button>
        ))}
      </div>
    </div>
  )
}
