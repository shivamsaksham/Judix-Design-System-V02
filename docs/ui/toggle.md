# Toggle

```tsx
import { Toggle } from "@/components/ui/toggle";

<Toggle
  checked={enabled}
  onCheckedChange={setEnabled}
  variant="primary"
  size="medium"
/>
```

### Notes
- Variants: `primary`, `neutral`; sizes: `large`, `medium`, `small`.
- Built on `@radix-ui/react-switch`; forwards native switch props like `disabled` or `name`.
- Thumb snapping and padding are handled by variants—avoid overriding `className` unless necessary.
