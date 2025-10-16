import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Icon } from "judix-icon"
import type { IconProps } from "judix-icon/dist/Icon"

import { cn } from "@/lib/utils"

const iconButtonVariants = cva(
  "inline-flex items-center justify-center shrink-0 cursor-pointer font-semibold transition-colors duration-200 ease-in-out disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "text-button-color-primary-default-text",
        subtle: "",
        outline: "border bg-transparent",
        ghost: "bg-transparent",
      },
      colorScheme: {
        primary: "",
        neutral: "",
      },
      shape: {
        rounded: "rounded-lg",
        circle: "rounded-full",
      },
      size: {
        large: "h-12 w-12",
        medium: "h-10 w-10",
        small: "h-8 w-8",
        extraSmall: "h-7 w-7",
      },
    },
    compoundVariants: [
    //   {
    //     variant: "primary",
    //     className: "bg-button-color-primary-default-bg hover:bg-button-color-primary-hover-bg",
    //   },
      {
        variant: "subtle",
        colorScheme: "primary",
        className: "bg-color-surface-primary-subtle_bg text-color-text-primary-default hover:bg-color-surface-primary-hover_mild",
      },
      {
        variant: "subtle",
        colorScheme: "neutral",
        className: "bg-color-surface-neutral-hover_default text-button-color-neutral-default-text hover:bg-color-surface-neutral-hover_mild",
      },
      {
        variant: "outline",
        colorScheme: "primary",
        className: "border-button-color-neutral-default-stroke text-color-text-primary-default hover:bg-color-surface-primary-hover_default",
      },
      {
        variant: "outline",
        colorScheme: "neutral",
        className: "border-button-color-neutral-default-stroke text-button-color-neutral-default-text hover:bg-button-color-neutral-hover-bg",
      },
      {
        variant: "ghost",
        colorScheme: "primary",
        className: "text-color-text-primary-default hover:bg-color-surface-primary-hover_default",
      },
      {
        variant: "ghost",
        colorScheme: "neutral",
        className: "text-button-color-neutral-default-text hover:bg-button-color-neutral-hover-bg",
      },
    ],
    defaultVariants: {
      variant: "primary",
      colorScheme: "primary",
      size: "medium",
      shape: "rounded",
    },
  }
)

const iconVariants = cva("", {
    variants: {
        size: {
            large: "h-6 w-6",
            medium: "h-5 w-5",
            small: "h-4 w-4",
            extraSmall: "h-3.5 w-3.5",
        }
    },
    defaultVariants: {
        size: "medium"
    }
})

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  icon: IconProps["name"]
  asChild?: boolean
  iconClassName?: string
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, shape, colorScheme, asChild = false, icon, iconClassName, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(iconButtonVariants({ variant, size, shape, colorScheme, className }))}
        ref={ref}
        {...props}
      >
        <Icon name={icon} className={cn(iconVariants({size}), iconClassName)} />
      </Comp>
    )
  }
)
IconButton.displayName = "IconButton"

export { IconButton, iconButtonVariants }