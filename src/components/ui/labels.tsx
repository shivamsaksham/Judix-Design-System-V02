import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { IconButton } from "@/components/ui/icon_button"
import { NumberBadge } from "./number_badges"

const labelVariants = cva(
  "inline-flex items-center justify-center gap-2 border rounded-[var(--radius-labels-border-radius-default)] labels-border-weight-default",
  {
    variants: {
      colorScheme: {
        primary: "bg-color-labels-color-primary-bg border-[var(--color-labels-color-primary-stroke)] text-color-labels-color-primary-text",
        neutral: "bg-color-labels-color-neutral-bg border-[var(--color-labels-color-neutral-stroke)] text-color-labels-color-neutral-text",
      },
      size: {
        large: "h-8 px-3 labels-font-large",
        medium: "h-7 px-2.5 labels-font-medium",
        small: "h-6 px-2 labels-font-small",
      },
    },
    defaultVariants: {
      colorScheme: "neutral",
      size: "medium",
    },
  }
)

export interface LabelProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof labelVariants> {
  showDot?: boolean;
  badgeContent?: string | number;
  onRemove?: () => void;
}

const Label = React.forwardRef<HTMLDivElement, LabelProps>(
  ({ className, colorScheme, size, children, showDot = false, badgeContent, onRemove, ...props }, ref) => {
    return (
      <div
        className={cn(labelVariants({ colorScheme, size, className }))}
        ref={ref}
        {...props}
      >
        {showDot && (
          <span className={cn("h-1.5 w-1.5 rounded-full", {
            "bg-[var(--color-color-text-primary-default)]": colorScheme === "primary",
            "bg-[var(--color-color-text-neutral-default)]": colorScheme === "neutral",
          })} />
        )}
        <span>{children}</span>
        {badgeContent && (
          <NumberBadge
            variant={colorScheme === 'primary' ? 'primary' : 'neutral'}
            size={size === 'large' ? 'md' : 's'}
            shape="rounded"
          >
            {badgeContent}
          </NumberBadge>
        )}
        {onRemove && (
          <IconButton
            variant="ghost"
            colorScheme={colorScheme}
            size="extraSmall"
            shape="circle"
            icon="Cross"
            onClick={onRemove}
            className="-my-2 -mr-1 h-5 w-5"
          />
        )}
      </div>
    )
  }
)
Label.displayName = "Label"

export { Label, labelVariants }