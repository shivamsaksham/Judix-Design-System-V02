import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer select-none",
  {
    variants: {
      variant: {
        primary: "bg-button-color-primary-default-bg text-button-color-primary-default-text ",
        destructive:
          "bg-button-color-error-default-bg",
        base:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      },
      size: {
        large: "h-11 rounded-button-border-radius-default py-2 px-4 button-font-large",
        medium: "h-10 rounded-button-border-radius-default px-6 has-[>svg]:px-4",
        small: "h-8 rounded-button-border-radius-default gap-1.5 px-3 has-[>svg]:px-2.5",
        extraSmall: "h-6 rounded-button-border-radius-default px-2 has-[>svg]:px-1",
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

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
