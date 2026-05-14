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
      highlighted: {
        true: "bg-option-color-hover text-option-color-text",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed pointer-events-none",
      },
      shape: {
        rounded: "rounded-option-border-radius-default",
        sharp: "rounded-none",
      },
      variant: {
        default: "",
        primary: "text-color-text-primary-default hover:text-color-text-primary-default",
      }
    },
    defaultVariants: {
      shape: "rounded",
      variant: "default",
    },
  }
)

export interface OptionProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
  VariantProps<typeof optionVariants> {
  title: React.ReactNode
  subtext?: React.ReactNode
  selected?: boolean
  highlighted?: boolean
  disabled?: boolean
  prefixSlot?: React.ReactNode
  suffixSlot?: React.ReactNode
}

const Option = React.forwardRef<HTMLDivElement, OptionProps>(
  ({ className, selected, highlighted, disabled, shape, variant, title, subtext, prefixSlot, suffixSlot, ...props }, ref) => {
    return (
      <div
        className={cn(optionVariants({ selected, highlighted, disabled, shape, variant, className }))}
        ref={ref}
        {...props}
      >


        <div className="grow flex flex-row justify-between items-center">
          <div className="flex items-center gap-1">
            {prefixSlot &&
              <div className="w-6 h-6 shrink-0 flex items-center justify-center">
                {prefixSlot}
              </div>
            }
            <div className={cn("p-1", variant === "primary" ? "text-style-body-default-emphasis" : "option-font-title")}>
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
