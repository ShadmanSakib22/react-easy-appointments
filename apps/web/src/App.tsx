import { useState } from 'react'
import { Calendar } from 'react-easy-appointments'
import 'react-easy-appointments/styles'
import type { Slot, BookingFormData } from 'react-easy-appointments'
import { useAppStore } from './store/appStore'
import { useUserStore } from './store/userStore'
import { UserSwitcher } from './components/UserSwitcher'
import { AdminPanel } from './components/AdminPanel'

export default function App() {
  const { activeUser } = useUserStore()
  const { slots: storedSlots, appointments, bookSlot, cancelAppointment } = useAppStore()
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const slots: Slot[] = storedSlots.map(s => ({
    id: s.id,
    date: s.date,
    startTime: s.startTime,
    endTime: s.endTime,
    status: s.isBooked ? 'booked' : 'available',
    bookedByLabel: s.bookedByLabel,
  }))

  const myAppointments = appointments.filter(
    a => a.userId === activeUser.id && a.status === 'confirmed',
  )

  function handleSlotClick(slot: Slot) {
    if (slot.status !== 'available') return
    setSelectedSlot(slot)
    setModalOpen(true)
  }

  function handleBook(slot: Slot, data: BookingFormData) {
    bookSlot(slot.id, activeUser.id, activeUser.label, data.subject, data.notes, data.durationMinutes)
    setModalOpen(false)
    setSelectedSlot(null)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <h1 className="text-xl font-bold tracking-tight">Appointment Scheduler</h1>
      </header>

      <UserSwitcher />

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {activeUser.role === 'admin' && <AdminPanel />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Calendar
              slots={slots}
              onSlotClick={handleSlotClick}
              onBook={handleBook}
              defaultView="month"
            >
              <Calendar.Toolbar />
              <Calendar.MonthView />
              <Calendar.WeekView />
              <Calendar.BookingModal
                slot={selectedSlot}
                open={modalOpen}
                onClose={() => { setModalOpen(false); setSelectedSlot(null) }}
              />
            </Calendar>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              My appointments
            </h2>
            {myAppointments.length === 0 ? (
              <p className="text-gray-500 text-sm">No upcoming appointments.</p>
            ) : (
              <ul className="space-y-3">
                {myAppointments.map(appt => {
                  const slot = storedSlots.find(s => s.id === appt.slotId)
                  return (
                    <li
                      key={appt.id}
                      className="bg-gray-800 border border-gray-700 rounded-xl p-4 space-y-1"
                    >
                      <p className="font-medium text-sm">{appt.subject}</p>
                      {slot && (
                        <p className="text-xs text-gray-400">
                          {slot.date} · {slot.startTime}–{slot.endTime}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">{appt.durationMinutes}min</p>
                      {appt.notes && (
                        <p className="text-xs text-gray-500 italic">{appt.notes}</p>
                      )}
                      <button
                        onClick={() => cancelAppointment(appt.id)}
                        className="mt-2 text-xs text-red-400 hover:text-red-300"
                      >
                        Cancel
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
