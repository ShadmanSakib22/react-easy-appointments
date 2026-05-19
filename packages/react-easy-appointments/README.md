# react-easy-appointments

A flexible, high-contrast, fully typed React compound-component calendar for appointment scheduling. It features month and week views, a built-in admin generator, and a dual-mode engine (Headless & Styled).

[![npm version](https://img.shields.io/npm/v/react-easy-appointments.svg)](https://www.npmjs.com/package/react-easy-appointments)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Installation

```bash
npm install react-easy-appointments date-fns
# or
pnpm add react-easy-appointments date-fns
# or
yarn add react-easy-appointments date-fns
```

Make sure `react` and `react-dom` (v18 or v19) are installed in your project.

---

## 🎨 Dual Mode: Styled vs Headless

`react-easy-appointments` offers two different integration styles:

### 1. Styled Mode (Default)
In styled mode, you import the ready-to-use stylesheet. The component applies high-contrast, modern styles using a Slate color palette that dynamically adapts to light and dark modes.

```tsx
import { Calendar } from 'react-easy-appointments'
import 'react-easy-appointments/styles' // Import default stylesheet
import { useState } from 'react'
import type { Slot } from 'react-easy-appointments'

function App() {
  const [slots, setSlots] = useState<Slot[]>([])
  const [selected, setSelected] = useState<Slot | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <Calendar
        slots={slots}
        onSlotClick={(slot) => {
          setSelected(slot)
          setModalOpen(true)
        }}
        onBook={(slot, data) => {
          // Book slot handler
          setModalOpen(false)
        }}
      >
        <Calendar.Toolbar />
        <Calendar.MonthView />
        <Calendar.WeekView />
        
        <Calendar.BookingModal
          slot={selected}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </Calendar>
    </div>
  )
}
```

### 2. Headless Mode
If you want to style the entire calendar using your own CSS classes or frameworks like **TailwindCSS**, set the `headless` prop to `true`. This strips away all default class names, rendering only raw semantic HTML tags.

```tsx
import { Calendar } from 'react-easy-appointments'
// Do NOT import 'react-easy-appointments/styles'

function HeadlessApp() {
  return (
    <Calendar slots={slots} headless={true}>
      <Calendar.Toolbar />
      <Calendar.MonthView />
      <Calendar.WeekView />
    </Calendar>
  )
}
```

---

## ⚡ Admin Control Panel
You can add `Calendar.AdminPanel` to manage appointment availability, generate slots sequentially, view current bookings, and configure weekly calendar hours.

```tsx
<Calendar.AdminPanel
  slots={slots}
  appointments={appointments}
  theme="light" // or "dark"
  weekHourStart={7}
  weekHourEnd={20}
  onCreateSlot={(date, start, end) => { /* handle single creation */ }}
  onCreateSlots={(newSlots) => { /* handle array generation */ }}
  onRemoveSlot={(slotId) => { /* handle deletion */ }}
  onCancelAppointment={(apptId) => { /* handle cancelation */ }}
/>
```

---

## 🔧 Component API

### `<Calendar>` Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `slots` | `Slot[]` | **Required** | Array of available, booked, and unavailable slots |
| `onSlotClick` | `(slot: Slot) => void` | — | Callback when a slot element is clicked |
| `onBook` | `(slot: Slot, data: BookingFormData) => void` | — | Callback when BookingModal form submits |
| `defaultView` | `'month' \| 'week'` | `'month'` | Initial view layout |
| `headless` | `boolean` | `false` | Disable all default stylesheets & BEM classes |
| `weekStartsOn` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | `0` (Sunday) | Set start day of the week |
| `locale` | `string` | `'en-US'` | Language code for formatting titles/days |
| `theme` | `'light' \| 'dark'` | `'light'` | Toggle theme variant styles |
| `weekHourStart` | `number` | `7` (7am) | First hour shown on week view |
| `weekHourEnd` | `number` | `20` (8pm) | Last hour shown on week view (inclusive) |

### `<Calendar.BookingModal>` Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `slot` | `Slot \| null` | **Required** | The target slot to book |
| `open` | `boolean` | **Required** | Shows/hides the modal dialog |
| `onClose` | `() => void` | **Required** | Callback when clicking the close button or backdrop |

---

## 🎨 Theme Customization (CSS Variables)

If you are using **Styled Mode**, you can customize colors, spacing, borders, and typography by overriding the following CSS variables on your calendar container:

```css
.rea-calendar {
  /* Color Accents */
  --rea-btn-primary-bg: #1d4ed8;       /* Primary buttons & active tabs */
  --rea-slot-available-bg: #15803d;    /* Available slots green */
  --rea-slot-booked-bg: #1d4ed8;       /* Booked slots blue */

  /* Borders & Backgrounds */
  --rea-border-default: #cbd5e1;       /* Segment borders */
  --rea-bg-base: #ffffff;              /* Calendar main panels */
  --rea-bg-subtle: #f1f5f9;            /* Headers, outside month days */

  /* Radii */
  --rea-radius-btn: 6px;
  --rea-radius-lg: 10px;
}
```

For the complete design system token list, reference [variables.css](./src/styles/variables.css).

---

## Types

```typescript
export interface Slot {
  id: string
  date: string             // ISO date: "YYYY-MM-DD"
  startTime: string        // 24h format: "HH:MM"
  endTime: string          // 24h format: "HH:MM"
  status: 'available' | 'booked' | 'unavailable'
  bookedByLabel?: string
}

export interface BookingFormData {
  subject: string
  notes?: string
  durationMinutes: number
}
```

---

## License

MIT License.
