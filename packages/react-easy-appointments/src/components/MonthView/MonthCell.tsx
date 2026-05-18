import { format } from 'date-fns'
import { useCalendarContext } from '../Calendar/CalendarContext'
import type { Slot } from '../../types'

type Props = {
  date: Date
  slots: Slot[]
  isCurrentMonth: boolean
  isToday: boolean
}

export function MonthCell({ date, slots, isCurrentMonth, isToday }: Props) {
  const { onSlotClick, headless } = useCalendarContext()

  const cellClass = headless
    ? undefined
    : [
        'rea-month-cell',
        !isCurrentMonth && 'rea-month-cell--outside',
        isToday && 'rea-month-cell--today',
      ]
        .filter(Boolean)
        .join(' ')

  return (
    <div className={cellClass}>
      <span className={headless ? undefined : 'rea-month-cell__date'}>
        {format(date, 'd')}
      </span>
      <div className={headless ? undefined : 'rea-month-cell__slots'}>
        {slots.map(slot => (
          <button
            key={slot.id}
            onClick={() => slot.status === 'available' && onSlotClick(slot)}
            disabled={slot.status !== 'available'}
            className={headless ? undefined : `rea-slot rea-slot--${slot.status}`}
            aria-label={`${slot.startTime}–${slot.endTime} ${slot.status}`}
          >
            {slot.startTime}
          </button>
        ))}
      </div>
    </div>
  )
}
