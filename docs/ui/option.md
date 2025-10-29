# Option

```tsx
import { Option } from "@/components/ui/option";

<Option
  title="India"
  subtext="GMT+5:30"
  prefixSlot={<FlagIcon />}
  suffixSlot={<CheckIcon />}
  selected
/>
```

### Notes
- `selected` toggles the highlighted background; combine with higher-level state.
- `prefixSlot` / `suffixSlot` accept React nodes for icons or actions.
- `shape` may be `rounded` (default) or `sharp`; set `disabled` to block interaction.
