# react-easy-appointments

React compound-component calendar for appointment scheduling. Month + week views, headless/styled dual mode, fully typed.

## Install

```bash
npm install react-easy-appointments date-fns
```

## Basic Usage

```tsx
import { Calendar } from 'react-easy-appointments'
import 'react-easy-appointments/styles'
import { useState } from 'react'
import type { Slot } from 'react-easy-appointments'

const slots = [
  { id: '1', date: '2026-05-19', startTime: '09:00', endTime: '10:00', status: 'available' }
]

function App() {
  const [selected, setSelected] = useState<Slot | null>(null)
  const [open, setOpen] = useState(false)

  return (
    <Calendar
      slots={slots}
      onSlotClick={(slot) => { setSelected(slot); setOpen(true) }}
      onBook={(slot, data) => console.log('booked', slot, data)}
    >
      <Calendar.Toolbar />
      <Calendar.MonthView />
      <Calendar.WeekView />
      <Calendar.BookingModal
        slot={selected}
        open={open}
        onClose={() => setOpen(false)}
        durations={[30, 60, 90]}
      />
    </Calendar>
  )
}
```

## Headless Mode

```tsx
import { Calendar } from 'react-easy-appointments'
// No style import needed — headless={true} disables all class names

<Calendar slots={slots} headless>
  <Calendar.Toolbar />
  <Calendar.MonthView />
  <Calendar.WeekView />
</Calendar>
```

## Custom Modal (escape hatch)

```tsx
<Calendar slots={slots} onSlotClick={(slot) => openMyModal(slot)}>
  <Calendar.Toolbar />
  <Calendar.MonthView />
  {/* Omit Calendar.BookingModal and render your own */}
</Calendar>
```

## Calendar Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `slots` | `Slot[]` | required | All slots to display |
| `onSlotClick` | `(slot: Slot) => void` | — | Called when any slot is clicked |
| `onBook` | `(slot: Slot, data: BookingFormData) => void` | — | Called on built-in modal submit |
| `defaultView` | `'month' \| 'week'` | `'month'` | Initial view |
| `headless` | `boolean` | `false` | Disable all class names |
| `weekStartsOn` | `0 \| 1` | `0` | 0 = Sunday, 1 = Monday |
| `locale` | `string` | `'en-US'` | Date formatting locale |

## BookingModal Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `slot` | `Slot \| null` | required | Slot being booked |
| `open` | `boolean` | required | Visibility |
| `onClose` | `() => void` | required | Called on dismiss |
| `durations` | `number[]` | `[30, 60, 90]` | Duration options in minutes |

## Slot Type

```ts
type Slot = {
  id: string
  date: string           // "2026-05-19"
  startTime: string      // "09:00"
  endTime: string        // "10:00"
  status: 'available' | 'booked' | 'unavailable'
  bookedByLabel?: string
}
```

## Theming (CSS Variables)

Override any variable on `.rea-calendar`:

```css
.rea-calendar {
  --rea-color-available: hotpink;
  --rea-color-booked: #7c3aed;
  --rea-radius-lg: 20px;
}
```

See [variables.css](./src/styles/variables.css) for the full reference list.
