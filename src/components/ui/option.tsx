import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const optionVariants = cva(
  "flex flex-col p-1.5 px-3 cursor-pointer transition-colors duration-200 bg-option-color-bg text-option-color-text hover:bg-option-color-hover hover:text-option-color-text w-full justify-between",
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
  selected?: boolean
  disabled?: boolean
  prefixSlot?: React.ReactNode
  suffixSlot?: React.ReactNode
}

const Option = React.forwardRef<HTMLDivElement, OptionProps>(
  ({ className, selected, disabled, shape, title, subtext, prefixSlot, suffixSlot, ...props }, ref) => {
    return (
      <div
        className={cn(optionVariants({ selected, disabled, shape, className }))}
        ref={ref}
        {...props}
      >


        <div className="flex-grow flex flex-row justify-between">
          <div className="flex justify-center items-center gap-1">
            {prefixSlot &&
              <div className="text-option-color-icon">
                {prefixSlot}
              </div>
            }
            <div className="option-font-title p-1">
              {title}
            </div>
          </div>
          {suffixSlot &&
            <div className="border-checkbox-color-neutral-default">
              {suffixSlot}
            </div>
          }
        </div>
        {subtext && <div className="text-option-color-subtext option-font-subtext p-1">{subtext}</div>}

      </div>
    )
  }
)
Option.displayName = "Option"

export { Option, optionVariants }