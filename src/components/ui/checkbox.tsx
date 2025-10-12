"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

type Size = "large" | "medium" | "small" | "extraSmall"

export const checkboxVariants = cva(
  "peer shrink-0 border outline-none transition-all disabled:cursor-not-allowed flex items-center justify-center rounded-checkbox-border-radius-default checkbox-border-weight-default text-checkbox-color-primary-tick",
  {
    variants: {
      variant: {
        primary:
          "border-checkbox-color-primary-default hover:border-checkbox-color-primary-hover focus-visible:border-checkbox-color-primary-hover data-[state=checked]:bg-checkbox-color-primary-selected data-[state=checked]:border-none data-[state=checked]:text-checkbox-color-primary-tick disabled:border-checkbox-color-neutral-disabled disabled:bg-checkbox-color-neutral-disabled disabled:text-checkbox-color-primary-tick",
        neutral:
          "border-checkbox-color-neutral-default hover:border-checkbox-color-neutral-hover focus-visible:border-checkbox-color-neutral-hover data-[state=checked]:bg-checkbox-color-neutral-selected data-[state=checked]:border-none data-[state=checked]:text-checkbox-color-neutral-tick disabled:border-checkbox-color-neutral-disabled disabled:bg-checkbox-color-neutral-disabled disabled:text-checkbox-color-neutral-tick",

      },
      size: {
        large: "w-5 h-5",
        medium: "w-[18px] h-[18px]",
        small: "w-4 h-4",
        extraSmall: "w-[14px] h-[14px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "large",
    },
  }
)

export interface CheckboxProps
  extends React.ComponentProps<typeof CheckboxPrimitive.Root>,
  VariantProps<typeof checkboxVariants> { }

const iconSizeMap: Record<Size, string> = {
  large: "size-4",
  medium: "size-3.5",
  small: "size-3",
  extraSmall: "size-2.5",
}

export function Checkbox({ className, variant, size = "large", disabled, ...props }: CheckboxProps) {
  const iconSize = iconSizeMap[size as Size] || iconSizeMap.large

  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(checkboxVariants({ variant, size, className }))}
      disabled={disabled}
      {...props}
    >
      {disabled && <CheckIcon strokeWidth={2.5} className={iconSize} />}
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        {/* <Icon name="SingleTick" className={iconSize} /> */}
        <CheckIcon strokeWidth={2.5} className={iconSize} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

// `Checkbox` is exported via its declaration above, and `checkboxVariants` is exported at declaration.
