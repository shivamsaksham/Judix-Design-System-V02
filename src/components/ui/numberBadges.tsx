import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const numberBadgeVariants = cva(
  "inline-flex items-center justify-center  whitespace-nowrap shrink-0  p-1",
  {
    variants: {
      variant: {
        primary: "bg-number_badges-color-primary-bg text-number_badges-color-primary-text",
        neutral: "bg-number_badges-color-neutral-bg text-number_badges-color-neutral-text",
      },
      shape: {
        sharp: "rounded-number_badges-border-radius-small",
        rounded: "rounded-number_badges-border-radius-round",
      },
      size: {
        md: "h-[19px] w-[19px] number_badge-font-large",
        s: "h-[18px] w-[17px] number_badge-font-medium",
        xs: "h-[17px] w-[17px] number_badge-font-small",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "md",
      shape: "sharp",
    },
  }
)

export interface NumberBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof numberBadgeVariants> {}

const NumberBadge = React.forwardRef<HTMLDivElement, NumberBadgeProps>(
  ({ className, variant, size, shape, ...props }, ref) => {
    return (
      <span
        className={cn(numberBadgeVariants({ variant, size, shape, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
NumberBadge.displayName = "NumberBadge"

export { NumberBadge, numberBadgeVariants }