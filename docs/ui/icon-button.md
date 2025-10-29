# Icon Button

```tsx
import { IconButton } from "@/components/ui/icon_button";

<IconButton icon="Edit" variant="neutral" size="large" />
```

### Notes
- `variant`: `primary`, `neutral`, `primary_2_tone`; `boundary`: `stroked` | `none`; `corner`: `rounded` | `sharp`.
- `size` controls both button and icon dimensions (`large`, `medium`).
- Use `asChild` to apply icon-button styling to another element (like a `Link`).
