# Radio Button

```tsx
import { RadioButton } from "@/components/ui/radiobuttons";

<RadioButton
  name="contact-method"
  value="email"
  checked={value === "email"}
  onChange={() => setValue("email")}
  color="primary"
  size="medium"
/>
```

### Notes
- Sizes: `small`, `medium`, `large`; colours: `primary`, `neutral`.
- Handles hover, active, and disabled visuals internally; only call `onChange` to update parent state.
- If you need a native radio input for forms, provide `name` and `value`; the component injects a hidden input synced with `checked`.
