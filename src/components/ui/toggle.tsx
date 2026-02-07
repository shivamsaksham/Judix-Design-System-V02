"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"


const toggleVariants = cva(
  "inline-flex items-center cursor-pointer",
  {
    variants: {
      variant: {
        primary: "data-[state=unchecked]:bg-toggle-color-primary-default data-[state=checked]:bg-toggle-color-primary-selected",
        neutral: "data-[state=unchecked]:bg-toggle-color-neutral-default bg-toggle-color-neutral-selected",
      },
      size: {
        large: "data-[state=unchecked]:pl-[1px] data-[state=checked]:justify-end data-[state=checked]:pr-[1px] py-[1px] rounded-full h-6 w-12 ",
        medium: "data-[state=unchecked]:pl-[1px] data-[state=checked]:justify-end data-[state=checked]:pr-[1px] py-[1px] rounded-full h-5 w-10",
        small: "data-[state=unchecked]:pl-[1px] data-[state=checked]:justify-end data-[state=checked]:pr-[1px] py-[1px] rounded-full h-4 w-8",
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "large",
    },
  }
)

const frameVariants = cva(
  "transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-white",
        neutral: "bg-white",
        destructive: "bg-white",
      },
      size: {
        large: "rounded-full w-5.5 h-5.5",
        medium: "rounded-full w-4.5 h-4.5",
        small: "rounded-full w-3.5 h-3.5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "large",
    },
  }
)

export interface SwitchProps
  extends React.ComponentProps<typeof SwitchPrimitive.Root>,
  VariantProps<typeof toggleVariants> {
  varient?: "primary" | "neutral"
  size?: "large" | "medium" | "small"
}


function Toggle({
  variant,
  size,
  className,
  ...props
}: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        toggleVariants({ variant, size }),
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(frameVariants({ variant, size }))}
      />
    </SwitchPrimitive.Root>
  )
}

export { Toggle }

