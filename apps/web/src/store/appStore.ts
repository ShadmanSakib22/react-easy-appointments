import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type StoredSlot = {
  id: string
  date: string
  startTime: string
  endTime: string
  isBooked: boolean
  bookedByUserId?: string
  bookedByLabel?: string
}

export type StoredAppointment = {
  id: string
  slotId: string
  userId: string
  userLabel: string
  subject: string
  notes: string
  durationMinutes: number
  status: 'confirmed' | 'cancelled'
}

type AppStore = {
  slots: StoredSlot[]
  appointments: StoredAppointment[]
  createSlot: (date: string, startTime: string, endTime: string) => void
  removeSlot: (id: string) => void
  bookSlot: (
    slotId: string,
    userId: string,
    userLabel: string,
    subject: string,
    notes: string,
    durationMinutes: number,
  ) => void
  cancelAppointment: (id: string) => void
}

function seedSlots(): StoredSlot[] {
  const slots: StoredSlot[] = []
  const times = [
    { startTime: '09:00', endTime: '10:00' },
    { startTime: '11:00', endTime: '12:00' },
    { startTime: '14:00', endTime: '15:00' },
  ]
  let dayOffset = 1
  while (slots.length < 12 && dayOffset <= 30) {
    const d = new Date()
    d.setDate(d.getDate() + dayOffset)
    const dow = d.getDay()
    if (dow !== 0 && dow !== 6) {
      const dateStr = d.toISOString().split('T')[0]
      for (const t of times) {
        slots.push({ id: crypto.randomUUID(), date: dateStr, ...t, isBooked: false })
        if (slots.length >= 12) break
      }
    }
    dayOffset++
  }
  return slots
}

export const useAppStore = create<AppStore>()(
  persist(
    set => ({
      slots: seedSlots(),
      appointments: [],

      createSlot: (date, startTime, endTime) =>
        set(s => ({
          slots: [
            ...s.slots,
            { id: crypto.randomUUID(), date, startTime, endTime, isBooked: false },
          ],
        })),

      removeSlot: (id) =>
        set(s => ({
          slots: s.slots.filter(sl => sl.id !== id || sl.isBooked),
        })),

      bookSlot: (slotId, userId, userLabel, subject, notes, durationMinutes) =>
        set(s => ({
          slots: s.slots.map(sl =>
            sl.id === slotId
              ? { ...sl, isBooked: true, bookedByUserId: userId, bookedByLabel: userLabel }
              : sl,
          ),
          appointments: [
            ...s.appointments,
            {
              id: crypto.randomUUID(),
              slotId,
              userId,
              userLabel,
              subject,
              notes,
              durationMinutes,
              status: 'confirmed',
            },
          ],
        })),

      cancelAppointment: (id) =>
        set(s => {
          const appt = s.appointments.find(a => a.id === id)
          return {
            appointments: s.appointments.map(a =>
              a.id === id ? { ...a, status: 'cancelled' } : a,
            ),
            slots: s.slots.map(sl =>
              sl.id === appt?.slotId
                ? { ...sl, isBooked: false, bookedByUserId: undefined, bookedByLabel: undefined }
                : sl,
            ),
          }
        }),
    }),
    { name: 'rea-demo' },
  ),
)
