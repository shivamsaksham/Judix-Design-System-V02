# Pagination

```tsx
import PaginationView from "@/components/ui/pagination";

<PaginationView />
```

### Notes
- `PaginationView` ships as a demo with local state and arrow controls; duplicate the component when you need bespoke data.
- Each pagination control is defined in the same file (see `Pagination`, `PaginationLink`, etc.); copy the pieces you need into your feature module to customise behaviour.
- Arrow buttons display `/LeftArrow.svg` and `/RightArrow.svg`; adjust the assets if your project hosts icons elsewhere.
