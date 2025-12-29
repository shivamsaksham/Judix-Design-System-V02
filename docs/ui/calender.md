# Calender

```tsx
import Calender from "@/components/ui/calender";

<Calender
  onDateSelected={selectedDate}
  onDateChange={setSelectedDate}
  initialDisplayDate={new Date("2025-01-01")}
/>
```

### Notes
- Keeps its own view state; pass `onDateSelected` so the selector can highlight the current value.
- `onDateChange` receives the newly picked `Date` and should update your state.
- Clicking the month label switches to the year grid; animations rely on `framer-motion`, so ensure it is installed.
