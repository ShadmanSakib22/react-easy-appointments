import { useCalendarContext } from '../Calendar/CalendarContext'
import type { Slot } from '../../types'

type Props = { slot: Slot }

export function TimeSlotBlock({ slot }: Props) {
  const { onSlotClick, headless } = useCalendarContext()

  return (
    <button
      onClick={() => slot.status === 'available' && onSlotClick(slot)}
      disabled={slot.status !== 'available'}
      className={headless ? undefined : `rea-slot rea-slot--${slot.status}`}
      aria-label={`${slot.startTime}–${slot.endTime} ${slot.status}${slot.bookedByLabel ? ` by ${slot.bookedByLabel}` : ''}`}
    >
      <span>{slot.startTime}</span>
      {slot.bookedByLabel && (
        <span className={headless ? undefined : 'rea-slot__label'}>{slot.bookedByLabel}</span>
      )}
    </button>
  )
}
