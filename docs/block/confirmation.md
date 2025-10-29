# Confirmation

```tsx
import Confirmation from "@/components/block/confirmation";

<Confirmation
  mainText="Delete workspace?"
  subText="This action cannot be undone."
  onConfirmClick={handleConfirm}
  onCancelClick={handleCancel}
>
  <Button variant="destructive">Delete</Button>
</Confirmation>
```

### Notes
- Wrap the element you want to act as the trigger inside the component; it is rendered via `DialogTrigger`.
- `mainText` and `subText` populate the dialog body, with the footer exposing "Cancel" and "Confirm" buttons.
- `onConfirmClick` and `onCancelClick` fire when the respective buttons are pressed; implement closing logic in those handlers if needed.
