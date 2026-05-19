import { useEffect, useState } from 'react'
import { Calendar } from 'react-easy-appointments'
import 'react-easy-appointments/styles'
import type { Slot, BookingFormData } from 'react-easy-appointments'
import { useAppStore } from './store/appStore'
import { useUserStore } from './store/userStore'
import { useThemeStore } from './store/themeStore'
import { UserSwitcher } from './components/UserSwitcher'
import { AdminPanel } from './components/AdminPanel'
import { DarkModeToggle } from './components/DarkModeToggle'

export default function App() {
  const { activeUser } = useUserStore()
  const { slots: storedSlots, appointments, bookSlot, cancelAppointment, createSlots } = useAppStore()
  const { isDark } = useThemeStore()
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [quickCreateOpen, setQuickCreateOpen] = useState(false)

  // Sync isDark to <html> class for Tailwind dark: utilities
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">

      {/* ── Header — always dark ──────────────────────────────── */}
      <header className="bg-[#0c1322] border-b border-white/[0.06] px-6 py-0 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* Favicon logo mark */}
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="21" fill="none" viewBox="0 0 48 46" aria-hidden="true">
            <path fill="#863bff" d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z" />
          </svg>
          <span className="text-white text-[13px] font-medium" style={{ fontFamily: "ui-monospace, 'Cascadia Code', monospace" }}>
            react-easy-appointments
          </span>
        </div>
        <DarkModeToggle />
      </header>

      <UserSwitcher />

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {activeUser.role === 'admin' && (
          <AdminPanel onOpenQuickCreate={() => setQuickCreateOpen(true)} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Calendar
              slots={slots}
              onSlotClick={handleSlotClick}
              onBook={handleBook}
              defaultView="month"
              theme={isDark ? 'dark' : 'light'}
            >
              <Calendar.Toolbar />
              <Calendar.MonthView />
              <Calendar.WeekView />
              <Calendar.BookingModal
                slot={selectedSlot}
                open={modalOpen}
                onClose={() => { setModalOpen(false); setSelectedSlot(null) }}
              />
              <Calendar.QuickGenerateModal
                open={quickCreateOpen}
                onClose={() => setQuickCreateOpen(false)}
                onGenerate={createSlots}
              />
            </Calendar>
          </div>

          {/* My Appointments sidebar */}
          <div className="space-y-3">
            <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1">
              My Appointments
            </h2>

            {myAppointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3 text-gray-400 dark:text-gray-600">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <p className="text-sm">No appointments yet</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {myAppointments.map(appt => {
                  const slot = storedSlots.find(s => s.id === appt.slotId)
                  return (
                    <li
                      key={appt.id}
                      className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 border-l-[3px] border-l-green-500 p-[14px_16px] space-y-1"
                    >
                      {/* Cancel on hover */}
                      <button
                        onClick={() => cancelAppointment(appt.id)}
                        aria-label="Cancel appointment"
                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 text-lg leading-none"
                      >
                        ×
                      </button>
                      <p className="font-semibold text-sm text-gray-900 dark:text-white pr-5">{appt.subject}</p>
                      {slot && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {slot.date} · {slot.startTime}–{slot.endTime}
                        </p>
                      )}
                      <span className="inline-block text-[10px] font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5">
                        {appt.durationMinutes}min
                      </span>
                      {appt.notes && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 italic">{appt.notes}</p>
                      )}
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
