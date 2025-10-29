# Text Input

```tsx
import { TextInput } from "@/components/ui/text-input";

<TextInput
  id="email"
  label="Email"
  placeholder="you@example.com"
  helperText="We will never share your email."
  errorMessage={error}
  leadingIcon={<MailIcon />}
  trailingAccessory={<ClearButton onClick={() => setValue("")} />}
  selectedLabels={[{ text: "Primary", onRemove: () => removeTag("Primary") }]}
  value={value}
  onChange={(event) => setValue(event.target.value)}
/>
```

### Notes
- Variants evolve automatically: disabled, error, and focus states are handled based on `disabled`, `errorMessage`, and focus events.
- Use `selectedLabels` to display removable chips beneath the field; pass `{ text, onRemove }` objects.
- `helperText` shows only when no `errorMessage` is present, keeping feedback concise.
