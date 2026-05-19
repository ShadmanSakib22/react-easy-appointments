import { useState } from 'react'
import { useAppStore } from '../store/appStore'

type Props = {
  onOpenQuickCreate: () => void
}

export function AdminPanel({ onOpenQuickCreate }: Props) {
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')

  const { slots, appointments, createSlot, removeSlot, cancelAppointment } = useAppStore()

  function handleCreateSlot(e: React.FormEvent) {
    e.preventDefault()
    if (!date || !startTime || !endTime) return
    const success = createSlot(date, startTime, endTime)
    if (!success) {
      alert('Error: This slot overlaps with an existing slot on the same date.')
      return
    }
    setDate('')
    setStartTime('')
    setEndTime('')
  }

  const confirmedAppts = appointments.filter(a => a.status === 'confirmed')

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
          Admin Panel
        </h2>
      </div>

      {/* Quick Generate — promoted, full-width */}
      <button
        type="button"
        onClick={onOpenQuickCreate}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors shadow-md shadow-indigo-900/20"
      >
        ⚡ Quick Generate Slots
      </button>

      {/* Create single slot — collapsible */}
      <details className="group">
        <summary className="flex items-center justify-between cursor-pointer list-none text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider select-none hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
          <span>Create Single Slot</span>
          <svg
            className="w-3.5 h-3.5 transition-transform group-open:rotate-180"
            viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M4 6l4 4 4-4" />
          </svg>
        </summary>
        <form onSubmit={handleCreateSlot} className="mt-4 flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 dark:text-gray-400">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 dark:text-gray-400">Start time</label>
            <input
              type="time"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              required
              className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 dark:text-gray-400">End time</label>
            <input
              type="time"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
              required
              className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm font-medium transition-colors"
          >
            Add slot
          </button>
        </form>
      </details>

      {/* All slots — collapsible */}
      <details className="group" open>
        <summary className="flex items-center justify-between cursor-pointer list-none text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider select-none hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
          <span>All Slots ({slots.length})</span>
          <svg
            className="w-3.5 h-3.5 transition-transform group-open:rotate-180"
            viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M4 6l4 4 4-4" />
          </svg>
        </summary>
        <div className="mt-3">
          {slots.length === 0 ? (
            <p className="text-gray-400 dark:text-gray-500 text-sm">No slots yet.</p>
          ) : (
            <div className="overflow-x-auto max-h-[260px] overflow-y-auto border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30">
              <table className="w-full text-sm text-left">
                <thead className="sticky top-0 bg-gray-100 dark:bg-gray-800">
                  <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                    <th className="py-2 px-3 font-medium">Date</th>
                    <th className="py-2 px-3 font-medium">Start</th>
                    <th className="py-2 px-3 font-medium">End</th>
                    <th className="py-2 px-3 font-medium">Status</th>
                    <th className="py-2 px-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[...slots]
                    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
                    .map(slot => (
                      <tr key={slot.id} className="border-b border-gray-100 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-white/[0.03] transition-colors">
                        <td className="py-2 px-3">{slot.date}</td>
                        <td className="py-2 px-3">{slot.startTime}</td>
                        <td className="py-2 px-3">{slot.endTime}</td>
                        <td className="py-2 px-3">
                          {slot.isBooked ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5">
                              Booked{slot.bookedByLabel ? ` · ${slot.bookedByLabel}` : ''}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5">
                              Available
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3">
                          {!slot.isBooked && (
                            <button
                              onClick={() => removeSlot(slot.id)}
                              className="text-red-500 dark:text-red-400 hover:text-red-400 dark:hover:text-red-300 text-xs transition-colors"
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </details>

      {/* Active appointments — collapsible */}
      <details className="group" open>
        <summary className="flex items-center justify-between cursor-pointer list-none text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider select-none hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
          <span>Active Appointments ({confirmedAppts.length})</span>
          <svg
            className="w-3.5 h-3.5 transition-transform group-open:rotate-180"
            viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M4 6l4 4 4-4" />
          </svg>
        </summary>
        <div className="mt-3">
          {confirmedAppts.length === 0 ? (
            <p className="text-gray-400 dark:text-gray-500 text-sm">No active appointments.</p>
          ) : (
            <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30">
              <table className="w-full text-sm text-left">
                <thead className="sticky top-0 bg-gray-100 dark:bg-gray-800">
                  <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                    <th className="py-2 px-3 font-medium">User</th>
                    <th className="py-2 px-3 font-medium">Subject</th>
                    <th className="py-2 px-3 font-medium">Notes</th>
                    <th className="py-2 px-3 font-medium">Duration</th>
                    <th className="py-2 px-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {confirmedAppts.map(appt => (
                    <tr key={appt.id} className="border-b border-gray-100 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-white/[0.03] transition-colors">
                      <td className="py-2 px-3">{appt.userLabel}</td>
                      <td className="py-2 px-3">{appt.subject}</td>
                      <td className="py-2 px-3 max-w-[160px] truncate text-gray-500 dark:text-gray-400">{appt.notes || '—'}</td>
                      <td className="py-2 px-3">{appt.durationMinutes}min</td>
                      <td className="py-2 px-3">
                        <button
                          onClick={() => cancelAppointment(appt.id)}
                          className="text-red-500 dark:text-red-400 hover:text-red-400 dark:hover:text-red-300 text-xs transition-colors"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </details>
    </div>
  )
}
