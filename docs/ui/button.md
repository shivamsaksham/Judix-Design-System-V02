# Button

```tsx
import { Button } from "@/components/ui/button";

<Button variant="primary" size="medium" prefixIcon="Plus">Add user</Button>
```

### Notes
- Variants: `primary`, `neutral`, `destructive`; sizes: `large`, `medium`, `small`, `extraSmall`.
- `prefixIcon` / `suffixIcon` expect a `judix-icon` name and inherit sizing automatically.
- Set `asChild` to let the button style a custom element (e.g., `Link`).
