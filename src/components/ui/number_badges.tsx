import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const numberBadgeVariants = cva(
  "inline-flex items-center justify-center shrink-0",
  {
    variants: {
      variant: {
        solid: "bg-[var(--color-number_badges-color-primary-bg)] text-[var(--color-number_badges-color-primary-text)]",
        subtle: "bg-[var(--color-number_badges-color-neutral-bg)] text-[var(--color-number_badges-color-neutral-text)]",
      },
      shape: {
        rounded: "rounded-[var(--radius-number_badges-border-radius-small)]",
        circle: "rounded-[var(--radius-number_badges-border-radius-round)]",
      },
      size: {
        large: "h-7 w-7 number_badge-font-large",
        medium: "h-6 w-6 number_badge-font-medium",
        small: "h-5 w-5 number_badge-font-small",
      },
    },
    defaultVariants: {
      variant: "subtle",
      size: "medium",
      shape: "rounded",
    },
  }
)

export interface NumberBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof numberBadgeVariants> {}

const NumberBadge = React.forwardRef<HTMLDivElement, NumberBadgeProps>(
  ({ className, variant, size, shape, ...props }, ref) => {
    return (
      <div
        className={cn(numberBadgeVariants({ variant, size, shape, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
NumberBadge.displayName = "NumberBadge"

export { NumberBadge, numberBadgeVariants }