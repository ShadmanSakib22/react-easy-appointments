import { useState } from 'react'
import { useCalendarContext } from '../Calendar/CalendarContext'
import type { Slot, BookingFormData } from '../../types'

type Props = {
  slot: Slot | null
  open: boolean
  onClose: () => void
}

export function BookingModal({ slot, open, onClose }: Props) {
  const { onBook, headless } = useCalendarContext()
  const [subject, setSubject] = useState('')
  const [notes, setNotes] = useState('')

  if (!open || !slot) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const durationMinutes = (
      (Number(slot.endTime.split(':')[0]) * 60 + Number(slot.endTime.split(':')[1])) -
      (Number(slot.startTime.split(':')[0]) * 60 + Number(slot.startTime.split(':')[1]))
    )
    const data: BookingFormData = { subject, notes, durationMinutes }
    onBook(slot, data)
    setSubject('')
    setNotes('')
    onClose()
  }

  return (
    <div
      className={headless ? undefined : 'rea-modal-backdrop'}
      role="dialog"
      aria-modal="true"
      aria-label="Book appointment"
    >
      <div className={headless ? undefined : 'rea-modal'}>
        <button
          type="button"
          onClick={onClose}
          className={headless ? undefined : 'rea-modal__close'}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className={headless ? undefined : 'rea-modal__title'}>Book Appointment</h2>
        <p className={headless ? undefined : 'rea-modal__slot-info'}>
          {slot.date} · {slot.startTime}–{slot.endTime}
        </p>
        <form onSubmit={handleSubmit} className={headless ? undefined : 'rea-modal__form'}>
          <label className={headless ? undefined : 'rea-modal__label'}>
            Subject
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              required
              className={headless ? undefined : 'rea-modal__input'}
              placeholder="Appointment subject"
            />
          </label>
          <label className={headless ? undefined : 'rea-modal__label'}>
            Notes
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className={headless ? undefined : 'rea-modal__textarea'}
              placeholder="Optional notes"
            />
          </label>
          <div className={headless ? undefined : 'rea-modal__actions'}>
            <button
              type="button"
              onClick={onClose}
              className={headless ? undefined : 'rea-modal__btn-cancel'}
            >
              Cancel
            </button>
            <button type="submit" className={headless ? undefined : 'rea-modal__btn-confirm'}>
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
