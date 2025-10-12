import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Icon } from "judix-icon"
import type { IconProps } from "judix-icon/dist/Icon"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer disabled:cursor-not-allowed select-none transition-all",
  {
    variants: {
      variant: {
        primary: "bg-button-color-primary-default-bg text-button-color-primary-default-text disabled:to-button-color-primary-disabled-bg disabled:text-button-color-primary-disabled-text hover:bg-button-color-primary-hover-bg hover:text-button-color-primary-hover-text",
        neutral:
          "bg-button-color-neutral-default-bg text-button-color-neutral-default-text button-border-weight-default border-button-color-neutral-default-stroke hover:bg-button-color-neutral-hover-bg hover:text-button-color-neutral-hover-text hover:border-button-color-neutral-hover-stroke disabled:bg-button-color-neutral-disabled-bg disabled:text-button-color-neutral-disabled-text disabled:border-button-color-neutral-disabled-stroke",
        destructive:
          "bg-button-color-error-default-bg text-button-color-error-default-text hover:bg-button-color-error-hover-bg hover:text-button-color-error-hover-text disabled:bg-button-color-error-disabled-bg disabled:text-button-color-error-disabled-text",
      },
      size: {
        large: "rounded-button-border-radius-default button-font-large h-11 py-2 px-4 ",
        medium: "rounded-button-border-radius-default button-font-medium h-10 py-2 px-4",
        small: "rounded-button-border-radius-default button-font-small h-9 py-2 px-4",
        extraSmall: "rounded-button-border-radius-default button-font-extra-small h-8 py-1.5 px-3",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "large",
    },
  }
)

export interface ButtonProps extends React.ComponentProps<"button">,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
  prefixIcon?: IconProps['name']
  suffixIcon?: IconProps['name']
  iconSize?: number
  iconStrokeWidth?: number
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  prefixIcon,
  suffixIcon,
  iconSize = 16,
  iconStrokeWidth = 2,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"

  // When asChild is true, we can't wrap with icons as Slot expects a single child
  if (asChild) {
    return (
      <Comp
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </Comp>
    )
  }

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {prefixIcon && (
        <Icon 
          name={prefixIcon} 
          size={iconSize} 
          strokeWidth={iconStrokeWidth}
        />
      )}
      {children}
      {suffixIcon && (
        <Icon 
          name={suffixIcon} 
          size={iconSize} 
          strokeWidth={iconStrokeWidth}
        />
      )}
    </Comp>
  )
}

export { Button, buttonVariants }
