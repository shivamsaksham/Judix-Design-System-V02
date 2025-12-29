# Label

```tsx
import { Label } from "@/components/ui/labels";

<Label colorScheme="primary" size="medium" showDot badgeContent={3}>
  Pending Approval
</Label>
```

### Notes
- Color schemes: `primary`, `neutral`; sizes: `large`, `medium`, `small`.
- Optional status dot via `showDot`; numeric chips via `badgeContent` (uses `NumberBadge`).
- Provide `onRemove` to render a clickable cross icon for dismissible labels.
