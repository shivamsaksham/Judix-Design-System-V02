import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Icon } from "@judix/icon"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer disabled:cursor-not-allowed select-none transition-all",
  {
    variants: {
      variant: {
        primary: "bg-button-color-primary-default-bg text-button-color-primary-default-text disabled:bg-button-color-primary-disabled-bg disabled:text-button-color-primary-disabled-text hover:bg-button-color-primary-hover-bg hover:text-button-color-primary-hover-text",
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
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "large",
    },
  }
)

const iconVariants = cva(
  "transition-colors",
  {
    variants: {
      variant: {
        primary: "text-button-color-primary-default-icon group-hover:text-button-color-primary-hover-icon group-disabled:text-button-color-primary-disabled-icon",
        neutral: "text-button-color-neutral-default-icon group-hover:text-button-color-neutral-hover-icon group-disabled:text-button-color-neutral-disabled-icon",
        destructive: "text-button-color-error-default-icon group-hover:text-button-color-error-hover-icon group-disabled:text-button-color-error-disabled-icon",
      },
      size: {
        large: "w-4 h-4",
        medium: "w-4 h-4",
        small: "w-[14px] h-[14px]",
        extraSmall: "w-[14px] h-[14px]",
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
  iconClassName?: string
  asChild?: boolean
  prefixIcon?: React.ComponentProps<typeof Icon>['name']
  suffixIcon?: React.ComponentProps<typeof Icon>['name']
  iconStrokeWidth?: number
  loading?: boolean
}

function Button({
  className,
  iconClassName,
  variant,
  size,
  asChild = false,
  prefixIcon,
  suffixIcon,
  iconStrokeWidth = 1.5,
  loading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"

  const isDisabled = disabled || loading

  // When asChild is true, we can't wrap with icons as Slot expects a single child
  if (asChild) {
    return (
      <Comp
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={isDisabled}
        {...props}
      >
        {children}
      </Comp>
    )
  }

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }), "group")}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {prefixIcon && (
            <Icon
              name={prefixIcon}
              strokeWidth={iconStrokeWidth}
              className={cn(iconVariants({ variant, size }), iconClassName)}
            />
          )}
        </>
      )}
      {children}
      {!loading && suffixIcon && (
        <Icon
          name={suffixIcon}
          strokeWidth={iconStrokeWidth}
          className={cn(iconVariants({ variant, size }), iconClassName)}
        />
      )}
    </Comp>
  )
}

export { Button, buttonVariants }
