import { format } from 'date-fns'
import { useCalendarContext } from '../Calendar/CalendarContext'

export function Toolbar() {
  const { view, setView, currentDate, goToPrev, goToNext, goToToday, headless } =
    useCalendarContext()

  const title =
    view === 'month'
      ? format(currentDate, 'MMMM yyyy')
      : `Week of ${format(currentDate, 'MMM d, yyyy')}`

  const cls = (base: string, active?: boolean) =>
    headless ? undefined : active ? `${base} ${base}--active` : base

  return (
    <div className={headless ? undefined : 'rea-toolbar'}>
      <div className={headless ? undefined : 'rea-toolbar__nav'}>
        <button onClick={goToPrev} aria-label="Previous">‹</button>
        <button onClick={goToToday} className={headless ? undefined : 'rea-toolbar__today'}>
          Today
        </button>
        <button onClick={goToNext} aria-label="Next">›</button>
      </div>
      <span className={headless ? undefined : 'rea-toolbar__title'}>{title}</span>
      <div className={headless ? undefined : 'rea-toolbar__views'}>
        <button
          onClick={() => setView('month')}
          aria-pressed={view === 'month'}
          className={cls('rea-toolbar__view-btn', view === 'month')}
          aria-label="Month view"
        >
          Month
        </button>
        <button
          onClick={() => setView('week')}
          aria-pressed={view === 'week'}
          className={cls('rea-toolbar__view-btn', view === 'week')}
          aria-label="Week view"
        >
          Week
        </button>
      </div>
    </div>
  )
}
