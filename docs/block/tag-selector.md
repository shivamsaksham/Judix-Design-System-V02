# Tag Selector

```tsx
import { TagSelector } from "@/components/block/tag-selector";

<TagSelector
  placeholder="Search tags"
  availableTags={available}
  selectedTags={selected}
  onSelect={(tag) => setSelected([...selected, tag])}
  onDeselect={(tag) => setSelected(selected.filter((item) => item !== tag))}
  onCreateTag={(tag) => createTag(tag)}
  badgeCount={selected.length}
/>
```

### Notes
- The embedded `TextInput` handles new tag creation on Enter via `onCreateTag`.
- Selected tags render as primary `Label` chips with remove icons; available tags stay neutral and clickable.
- The optional `badgeCount` shows a `NumberBadge` inside the input accessory, ideal for highlighting limits.
