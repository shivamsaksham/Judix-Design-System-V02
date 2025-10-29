import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { NumberBadge } from "./number_badges"
import { Icon } from "judix-icon"

const labelVariants = cva(
  "inline-flex items-center justify-center gap-2 border rounded-label-border-radius-default label-border-weight-default",
  {
    variants: {
      colorScheme: {
        primary: "bg-color-label-color-primary-bg border-label-color-primary-stroke text-label-color-primary-text",
        neutral: "bg-color-label-color-neutral-bg border-label-color-neutral-stroke text-label-color-neutral-text",
      },
      size: {
        large: "h-8 px-3 py-2 label-font-large",
        medium: "h-7 px-2.5 py-2 label-font-medium",
        small: "h-6 px-2 py-2 label-font-small",
      },
    },
    defaultVariants: {
      colorScheme: "neutral",
      size: "medium",
    },
  }
)

const iconVariants = cva("", {
  variants: {
    colorScheme: {
      primary: "text-label-color-primary-text",
      neutral: "text-label-color-neutral-text",
    },
    size: {
      large: "h-3 w-3",
      medium: "h-3 w-3",
      small: "h-2.5 w-2.5",
    }
  }
})

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
            "bg-label-color-primary-text": colorScheme === "primary",
            "bg-label-color-neutral-text": colorScheme === "neutral",
          })} />
        )}
        <span>{children}</span>
        {badgeContent && (
          <NumberBadge
            variant={colorScheme === 'primary' ? 'primary' : 'neutral'}
            size={size === 'large' ? 'md' : size === 'medium' ? 's' : 'xs'}
            shape="rounded"
          >
            {badgeContent}
          </NumberBadge>
        )}
        {onRemove && (
          <Icon
            name="Cross"
            onClick={onRemove}
            className={cn(iconVariants({ colorScheme, size}) , "cursor-pointer")}
          />
        )}
      </div>
    )
  }
)
Label.displayName = "Label"

export { Label, labelVariants }