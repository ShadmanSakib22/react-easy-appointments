import { useState } from 'react'
import { useCalendarContext } from '../Calendar/CalendarContext'

type Props = {
  open: boolean
  onClose: () => void
  onGenerate: (slots: { date: string; startTime: string; endTime: string }[]) => void
  defaultDuration?: number
  defaultStartTime?: string
  defaultEndTime?: string
}

export function QuickGenerateModal({
  open,
  onClose,
  onGenerate,
  defaultDuration = 30,
  defaultStartTime = '08:00',
  defaultEndTime = '18:00',
}: Props) {
  const { headless } = useCalendarContext()

  const [startDate, setStartDate] = useState(getFutureDateString(1))
  const [endDate, setEndDate] = useState(getFutureDateString(7))
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]) // Mon-Fri
  const [startTime, setStartTime] = useState(defaultStartTime)
  const [endTime, setEndTime] = useState(defaultEndTime)
  const [duration, setDuration] = useState(defaultDuration)

  if (!open) return null

  function toggleDay(dayIdx: number) {
    setSelectedDays(prev =>
      prev.includes(dayIdx) ? prev.filter(d => d !== dayIdx) : [...prev, dayIdx]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!startDate || !endDate || !startTime || !endTime || selectedDays.length === 0) {
      return
    }

    const generated = generateSlotsList(
      startDate,
      endDate,
      selectedDays,
      startTime,
      endTime,
      duration
    )

    onGenerate(generated)
    onClose()
  }

  return (
    <div
      className={headless ? undefined : 'rea-modal-backdrop'}
      role="dialog"
      aria-modal="true"
      aria-label="Quick generate slots"
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
        <h2 className={headless ? undefined : 'rea-modal__title'}>⚡ Quick Generate Slots</h2>
        <form onSubmit={handleSubmit} className={headless ? undefined : 'rea-modal__form'}>
          <div className={headless ? undefined : 'rea-modal__grid-2'}>
            <label className={headless ? undefined : 'rea-modal__label'}>
              Start Date
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                required
                className={headless ? undefined : 'rea-modal__input'}
              />
            </label>
            <label className={headless ? undefined : 'rea-modal__label'}>
              End Date
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                required
                className={headless ? undefined : 'rea-modal__input'}
              />
            </label>
          </div>

          <div className={headless ? undefined : 'rea-modal__label'}>
            Repeat Days
            <div className={headless ? undefined : 'rea-modal__days-grid'}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => {
                const active = selectedDays.includes(idx)
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(idx)}
                    className={
                      headless
                        ? undefined
                        : `rea-modal__day-btn${active ? ' rea-modal__day-btn--active' : ''}`
                    }
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </div>

          <div className={headless ? undefined : 'rea-modal__grid-2'}>
            <label className={headless ? undefined : 'rea-modal__label'}>
              Start Time
              <input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                required
                className={headless ? undefined : 'rea-modal__input'}
              />
            </label>
            <label className={headless ? undefined : 'rea-modal__label'}>
              End Time
              <input
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                required
                className={headless ? undefined : 'rea-modal__input'}
              />
            </label>
          </div>

          <label className={headless ? undefined : 'rea-modal__label'}>
            Slot Duration
            <select
              value={duration}
              onChange={e => setDuration(Number(e.target.value))}
              className={headless ? undefined : 'rea-modal__select'}
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes (1 hour)</option>
              <option value={90}>90 minutes (1.5 hours)</option>
              <option value={120}>120 minutes (2 hours)</option>
            </select>
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
              Generate
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function getFutureDateString(daysOffset: number) {
  const d = new Date()
  d.setDate(d.getDate() + daysOffset)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function generateSlotsList(
  startDateStr: string,
  endDateStr: string,
  selectedDays: number[],
  startDayTime: string,
  endDayTime: string,
  slotDuration: number
) {
  const generated: { date: string; startTime: string; endTime: string }[] = []

  const start = new Date(startDateStr + 'T00:00:00')
  const end = new Date(endDateStr + 'T00:00:00')

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) return []

  const current = new Date(start)
  while (current <= end) {
    const dayOfWeek = current.getDay()
    if (selectedDays.includes(dayOfWeek)) {
      const year = current.getFullYear()
      const month = String(current.getMonth() + 1).padStart(2, '0')
      const day = String(current.getDate()).padStart(2, '0')
      const dateStr = `${year}-${month}-${day}`

      const [sh, sm] = startDayTime.split(':').map(Number)
      const [eh, em] = endDayTime.split(':').map(Number)

      let currentMinutes = sh * 60 + sm
      const endMinutes = eh * 60 + em

      while (currentMinutes + slotDuration <= endMinutes) {
        const chunkStartMin = currentMinutes
        const chunkEndMin = currentMinutes + slotDuration

        const shStr = String(Math.floor(chunkStartMin / 60)).padStart(2, '0')
        const smStr = String(chunkStartMin % 60).padStart(2, '0')
        const ehStr = String(Math.floor(chunkEndMin / 60)).padStart(2, '0')
        const emStr = String(chunkEndMin % 60).padStart(2, '0')

        generated.push({
          date: dateStr,
          startTime: `${shStr}:${smStr}`,
          endTime: `${ehStr}:${emStr}`,
        })

        currentMinutes += slotDuration
      }
    }
    current.setDate(current.getDate() + 1)
  }

  return generated
}
