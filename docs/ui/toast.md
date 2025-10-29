# Toast

```tsx
import { ToastContainer, showToast } from "@/components/ui/toast";

// Mount once near the root of your app
<ToastContainer position="top-center" />

// Trigger toasts anywhere
showToast.success("Saved", "Your changes were published.");
```

### Notes
- Convenience methods: `alert`, `success`, `notice`, `info`, and `promise` (wraps async work).
- Custom toasts render through `toast.custom`, so messages can include JSX.
- Ensure `react-hot-toast` styles are loaded (the component already passes custom colours and spacing).
