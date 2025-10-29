# Checkbox

```tsx
import { Checkbox } from "@/components/ui/checkbox";

<Checkbox
  checked={checked}
  onCheckedChange={setChecked}
  variant="primary"
  size="medium"
/>
```

### Notes
- Variants: `primary`, `neutral`; sizes: `large`, `medium`, `small`, `extraSmall`.
- Disabled checkboxes render a static tick to match the design language.
- The component forwards remaining Radix props (`id`, `name`, etc.) to the switch root.
