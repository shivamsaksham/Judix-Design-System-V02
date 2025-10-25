import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const optionVariants = cva(
  "flex flex-col p-2 cursor-pointer transition-colors duration-200 bg-option-color-bg text-option-color-text hover:bg-option-color-hover hover:text-option-color-text w-[200px] justify-between",
  {
    variants: {
      selected: {
        true: "bg-option-color-selected text-option-color-text",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed pointer-events-none",
      },
      shape: {
        rounded: "rounded-option-border-radius-default",
        sharp: "rounded-none",
      }
    },
    defaultVariants: {
      shape: "rounded",
    },
  }
)

export interface OptionProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof optionVariants> {
  title: string
  subtext?: string
  icon?: React.ReactNode
  label?: React.ReactNode
  checkbox?: React.ReactNode
  numberbadge?: React.ReactNode
  selected?: boolean
  disabled?: boolean
  prefixSlot?:React.ReactNode
  suffixSlot?:React.ReactNode
} 

const Option = React.forwardRef<HTMLDivElement, OptionProps>(
  ({ className, selected, disabled, shape, title, subtext, icon, label, checkbox, numberbadge, prefixSlot, suffixSlot, ...props }, ref) => {
    return (
      <div
        className={cn(optionVariants({ selected, disabled, shape, className }))}
        ref={ref}
        {...props}
      >
        
        {/* {checkbox && icon == null && <div className="text-option-color-checkbox">{checkbox}</div>} */}
        {/* {checkbox && icon && <div className="mr-3 text-option-color-checkbox-icon">{checkbox}</div>} */}
        <div className="flex-grow flex flex-row justify-between gap-1 p-1">
          <div className="flex gap-1">
            <div className="text-option-color-icon">
              {prefixSlot}
            </div>
            <div className="option-font-title">{title}</div>
          </div>
          <div className="border-checkbox-color-neutral-default option-font-title">{suffixSlot}</div>
        </div>
        {subtext && <div className="text-option-color-subtext option-font-subtext pl-2">{subtext}</div>}
        {/* {label && <div className="text-option-color-label">{label}</div>}
        {numberbadge && <div className="text-option-color-numberbadge">{numberbadge}</div>}
        {checkbox && icon && <div className="ml-3 text-option-color-checkbox-icon">{icon}</div>} */}
      </div>
    )
  }
)
Option.displayName = "Option"

export { Option, optionVariants }