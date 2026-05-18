import { CalendarRoot } from './Calendar'
import { Toolbar } from '../Toolbar/Toolbar'
import { MonthView } from '../MonthView/MonthView'
import { WeekView } from '../WeekView/WeekView'
import { BookingModal } from '../BookingModal/BookingModal'

export const Calendar = Object.assign(CalendarRoot, {
  Toolbar,
  MonthView,
  WeekView,
  BookingModal,
})
