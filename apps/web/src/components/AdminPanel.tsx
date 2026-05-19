import { useState } from 'react'
import { useAppStore } from '../store/appStore'

export function AdminPanel() {
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')

  const { slots, appointments, createSlot, removeSlot, cancelAppointment } = useAppStore()

  function handleCreateSlot(e: React.FormEvent) {
    e.preventDefault()
    if (!date || !startTime || !endTime) return
    createSlot(date, startTime, endTime)
    setDate('')
    setStartTime('')
    setEndTime('')
  }

  const confirmedAppts = appointments.filter(a => a.status === 'confirmed')

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-8">
      <h2 className="text-lg font-semibold text-white">Admin Panel</h2>

      {/* Slot creation */}
      <section>
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
          Create Slot
        </h3>
        <form onSubmit={handleCreateSlot} className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">Start time</label>
            <input
              type="time"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              required
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">End time</label>
            <input
              type="time"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
              required
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Add slot
          </button>
        </form>
      </section>

      {/* All slots */}
      <section>
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
          All Slots ({slots.length})
        </h3>
        {slots.length === 0 ? (
          <p className="text-gray-500 text-sm">No slots yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="pb-2 pr-4 font-medium">Date</th>
                  <th className="pb-2 pr-4 font-medium">Start</th>
                  <th className="pb-2 pr-4 font-medium">End</th>
                  <th className="pb-2 pr-4 font-medium">Status</th>
                  <th className="pb-2 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {slots.map(slot => (
                  <tr key={slot.id} className="text-gray-300">
                    <td className="py-2 pr-4">{slot.date}</td>
                    <td className="py-2 pr-4">{slot.startTime}</td>
                    <td className="py-2 pr-4">{slot.endTime}</td>
                    <td className="py-2 pr-4">
                      {slot.isBooked ? (
                        <span className="text-blue-400">
                          Booked{slot.bookedByLabel ? ` · ${slot.bookedByLabel}` : ''}
                        </span>
                      ) : (
                        <span className="text-green-400">Available</span>
                      )}
                    </td>
                    <td className="py-2">
                      {!slot.isBooked && (
                        <button
                          onClick={() => removeSlot(slot.id)}
                          className="text-red-400 hover:text-red-300 text-xs"
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
      </section>

      {/* All confirmed appointments */}
      <section>
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
          Active Appointments ({confirmedAppts.length})
        </h3>
        {confirmedAppts.length === 0 ? (
          <p className="text-gray-500 text-sm">No active appointments.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="pb-2 pr-4 font-medium">User</th>
                  <th className="pb-2 pr-4 font-medium">Subject</th>
                  <th className="pb-2 pr-4 font-medium">Notes</th>
                  <th className="pb-2 pr-4 font-medium">Duration</th>
                  <th className="pb-2 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {confirmedAppts.map(appt => (
                  <tr key={appt.id} className="text-gray-300">
                    <td className="py-2 pr-4">{appt.userLabel}</td>
                    <td className="py-2 pr-4">{appt.subject}</td>
                    <td className="py-2 pr-4 max-w-[180px] truncate">{appt.notes || '—'}</td>
                    <td className="py-2 pr-4">{appt.durationMinutes}min</td>
                    <td className="py-2">
                      <button
                        onClick={() => cancelAppointment(appt.id)}
                        className="text-red-400 hover:text-red-300 text-xs"
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
      </section>
    </div>
  )
}
