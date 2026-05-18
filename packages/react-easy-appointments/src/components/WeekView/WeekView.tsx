import { startOfWeek, addDays, format } from 'date-fns'
import { useCalendarContext } from '../Calendar/CalendarContext'
import { TimeSlotBlock } from './TimeSlotBlock'

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7) // 7am–8pm
const DAY_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function formatHour(h: number) {
  if (h === 12) return '12pm'
  return h < 12 ? `${h}am` : `${h - 12}pm`
}

export function WeekView() {
  const { view, currentDate, slots, weekStartsOn, headless } = useCalendarContext()

  if (view !== 'week') return null

  const weekStart = startOfWeek(currentDate, { weekStartsOn })
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  return (
    <div className={headless ? undefined : 'rea-week-view'}>
      <div className={headless ? undefined : 'rea-week-view__header'}>
        <div className={headless ? undefined : 'rea-week-view__time-gutter'} />
        {days.map(day => (
          <div
            key={day.toISOString()}
            className={headless ? undefined : 'rea-week-view__day-header'}
          >
            <span>{DAY_ABBR[day.getDay()]}</span>
            <span>{format(day, 'd')}</span>
          </div>
        ))}
      </div>
      <div className={headless ? undefined : 'rea-week-view__grid'}>
        {HOURS.map(hour => {
          const hourStr = `${String(hour).padStart(2, '0')}:00`
          return (
            <div key={hour} className={headless ? undefined : 'rea-week-view__row'}>
              <div className={headless ? undefined : 'rea-week-view__time-label'}>
                {formatHour(hour)}
              </div>
              {days.map(day => {
                const dateStr = format(day, 'yyyy-MM-dd')
                const cellSlots = slots.filter(
                  s => s.date === dateStr && s.startTime === hourStr
                )
                return (
                  <div
                    key={day.toISOString()}
                    className={headless ? undefined : 'rea-week-view__cell'}
                  >
                    {cellSlots.map(slot => (
                      <TimeSlotBlock key={slot.id} slot={slot} />
                    ))}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
