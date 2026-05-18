import { useCalendarContext } from '../Calendar/CalendarContext'

export function Toolbar() {
  useCalendarContext() // ensures context guard fires
  return <div data-testid="rea-toolbar" />
}
