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
      boundary: {
        stroked: "border icon_button-border-weight-default",
        none: "border-0",
      },
      variant: {
        primary: "bg-icon_button-color-primary-bg text-icon_button-color-primary-icon border-icon_button-color-primary-stroke disabled:bg-icon_button-color-primary-bg disabled:text-icon_button-color-primary-disabled hover:bg-icon_button-color-neutral-hover hover:icon_button-color-primary-icon",
        neutral: "bg-icon_button-color-neutral-bg text-icon_button-color-neutral-icon border-icon_button-color-neutral-stroke disabled:bg-icon_button-color-neutral-bg disabled:text-icon_button-color-neutral-disabled hover:bg-icon_button-color-neutral-hover hover:icon_button-color-neutral-icon",
        primary_2_tone: "bg-icon_button-color-primary-bg text-icon_button-color-primary-icon border-icon_button-color-primary-stroke disabled:bg-icon_button-color-primary-hover disabled:text-icon_button-color-primary-disabled hover:bg-icon_button-color-primary-hover hover:text-icon_button-color-primary-icon",
      },
      corner: {
        rounded: "rounded-icon_button-border-radius-round",
        sharp: "rounded-icon_button-border-radius-sharp",
      },
      size: {
        large: "h-10 w-10 p-2",
        medium: "h-[34px] w-[34px] p-2",
        small: "h-7 w-7 p-1.5",
        extraSmall: "h-6 w-6 p-1",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "medium",
      corner: "rounded",
      boundary: "none",
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
  ({ className, variant, size, corner, boundary, asChild = false, icon, iconClassName, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(iconButtonVariants({ variant, size, corner, boundary, className }))}
        ref={ref}
        {...props}
      >
        <Icon name={icon} className={cn(iconVariants({ size }), iconClassName)} />
      </Comp>
    )
  }
)
IconButton.displayName = "IconButton"

export { IconButton, iconButtonVariants }