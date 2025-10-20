import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const optionVariants = cva(
  "flex items-center p-2 cursor-pointer transition-colors duration-200",
  {
    variants: {
      state: {
        default: "bg-option-color-bg text-option-color-text",
        hover: "bg-option-color-hover text-option-color-text",
        selected: "bg-option-color-selected text-option-color-text",
      },
      shape: {
          rounded: "rounded-option-border-radius-default",
          sharp: "rounded-none",
      }
    },
    defaultVariants: {
      state: "default",
      shape: "rounded",
    },
  }
)

export interface OptionProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof optionVariants> {
  title: string
  subtext?: string
  leadingIcon?: React.ReactNode
  trailingAccessory?: React.ReactNode
}

const Option = React.forwardRef<HTMLDivElement, OptionProps>(
  ({ className, state, shape, title, subtext, leadingIcon, trailingAccessory, ...props }, ref) => {
    return (
      <div
        className={cn(optionVariants({ state, shape, className }))}
        ref={ref}
        {...props}
      >
        {leadingIcon && <div className="mr-3 text-option-color-icon">{leadingIcon}</div>}
        <div className="flex-grow">
          <div className="option-font-title">{title}</div>
          {subtext && <div className="text-option-color-subtext option-font-subtext">{subtext}</div>}
        </div>
        {trailingAccessory && <div className="ml-3">{trailingAccessory}</div>}
      </div>
    )
  }
)
Option.displayName = "Option"

export { Option, optionVariants }