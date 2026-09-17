import * as React from "react"
import { cn } from "@/lib/utils"

const SPINNER_SIZES = {
  small: "size-4 border-2",
  medium: "size-6 border-[3px]",
  large: "size-8 border-[3px]",
} as const

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: keyof typeof SPINNER_SIZES
  label?: string
}

function Spinner({ size = "medium", label = "Loading", className, ...props }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        "inline-block shrink-0 animate-spin rounded-full border-color-border-primary-subtle border-t-color-text-primary-default",
        SPINNER_SIZES[size],
        className
      )}
      {...props}
    />
  )
}

export { Spinner }
