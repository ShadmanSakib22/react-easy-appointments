import { type ReactNode } from 'react'
import { CalendarContext } from './CalendarContext'
import { useCalendarState } from '../../hooks/useCalendarState'
import type { Slot, BookingFormData, CalendarView } from '../../types'

type CalendarProps = {
  children: ReactNode
  slots: Slot[]
  onSlotClick?: (slot: Slot) => void
  onBook?: (slot: Slot, data: BookingFormData) => void
  defaultView?: CalendarView
  headless?: boolean
  weekStartsOn?: 0 | 1
  locale?: string
}

export function CalendarRoot({
  children,
  slots,
  onSlotClick = () => {},
  onBook = () => {},
  defaultView = 'month',
  headless = false,
  weekStartsOn = 0,
  locale = 'en-US',
}: CalendarProps) {
  const state = useCalendarState(defaultView)

  return (
    <CalendarContext.Provider
      value={{ slots, onSlotClick, onBook, headless, weekStartsOn, locale, ...state }}
    >
      <div className={headless ? undefined : 'rea-calendar'}>{children}</div>
    </CalendarContext.Provider>
  )
}
