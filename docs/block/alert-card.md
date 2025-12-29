# Alert Card

```tsx
import AlertCard from "@/components/block/alert-card";

<AlertCard hideAble onButtonClick={() => console.log("request access") }>
  <p className="alert_card-font-content">
    You do not currently have access to this report.
  </p>
</AlertCard>
```

### Notes
- Pass `hideAble={false}` to keep the alert visible even if the close icon is clicked.
- Children render inside the card body; keep them short to match the layout.
- The footer action uses the `Label` component—`onButtonClick` runs when the "Request access" pill is pressed.
