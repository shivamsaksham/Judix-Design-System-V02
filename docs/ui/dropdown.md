# Dropdown

```tsx
import { Dropdown } from "@/components/ui/dropdown";

const options = [
  { value: "email", title: "Email", subtext: "Send via mail" },
  { value: "sms", title: "SMS" },
];

<Dropdown
  options={options}
  value={value}
  onChange={setValue}
  searchbar="integrated"
/>
```

### Notes
- `searchbar` toggles search UI: `off`, `attached`, or `integrated`.
- `DropdownOption` items support `leadingIcon` and `trailingAccessory` React nodes.
- Selecting an option clears the search text and calls `onChange` with the option `value`.
