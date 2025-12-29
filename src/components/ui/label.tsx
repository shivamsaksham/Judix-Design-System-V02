import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { NumberBadge } from "./numberBadges"
import { Icon } from "judix-icon"

const labelVariants = cva(
  "inline-flex items-center justify-center gap-2 border rounded-label-border-radius-default label-border-weight-default",
  {
    variants: {
      colorScheme: {
        primary:
          "bg-color-label-color-primary-bg border-label-color-primary-stroke text-label-color-primary-text hover:bg-label-color-primary-hover",
        neutral:
          "bg-color-label-color-neutral-bg border-label-color-neutral-stroke text-label-color-neutral-text hover:bg-label-color-neutral-hover",
      },
      size: {
        large: "h-8 px-3 py-2 label-font-large",
        medium: "h-7 px-2.5 py-2 label-font-medium",
        small: "h-6 px-2 py-2 label-font-small",
      },
      selected: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        colorScheme: "primary",
        selected: true,
        class:
          "bg-label-color-primary-selected text-label-color-primary-selectedtext hover:bg-label-color-primary-selected",
      },
      {
        colorScheme: "neutral",
        selected: true,
        class:
          "bg-label-color-neutral-selected text-label-color-neutral-selectedtext hover:bg-label-color-neutral-selected",
      },
    ],
    defaultVariants: {
      colorScheme: "neutral",
      size: "medium",
      selected: false,
    },
  }
)

const iconVariants = cva("", {
  variants: {
    colorScheme: {
      primary: "text-label-color-primary-text",
      neutral: "text-label-color-neutral-text",
    },
    size: {
      large: "h-3 w-3",
      medium: "h-3 w-3",
      small: "h-2.5 w-2.5",
    },
    selected: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    {
      colorScheme: "primary",
      selected: true,
      class: "text-label-color-primary-selectedtext",
    },
    {
      colorScheme: "neutral",
      selected: true,
      class: "text-label-color-neutral-selectedtext",
    },
  ],
  defaultVariants: {
    selected: false,
  },
})

export interface LabelProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof labelVariants> {
  showDot?: boolean
  badgeContent?: string | number
  onRemove?: () => void
  onSelect?: () => void
}

const Label = React.forwardRef<HTMLDivElement, LabelProps>(
  (
    {
      className,
      colorScheme,
      size,
      selected = false,
      children,
      showDot = false,
      badgeContent,
      onRemove,
      onSelect,
      onClick,
      ...rest
    },
    ref
  ) => {
    const handleClick = React.useCallback<React.MouseEventHandler<HTMLDivElement>>(
      (event) => {
        onSelect?.()
        onClick?.(event)
      },
      [onSelect, onClick]
    )

    return (
      <div
        className={cn(labelVariants({ colorScheme, size, selected, className }))}
        ref={ref}
        onClick={handleClick}
        {...rest}
      >
        {showDot && (
          <span className={cn("h-1.5 w-1.5 rounded-full", {
            "bg-label-color-primary-text": colorScheme === "primary" && !selected,
            "bg-label-color-neutral-text": colorScheme === "neutral" && !selected,
            "bg-label-color-primary-selectedtext": colorScheme === "primary" && selected,
            "bg-label-color-neutral-selectedtext": colorScheme === "neutral" && selected,
          })} />
        )}
        <span>{children}</span>
        {badgeContent && (
          <NumberBadge
            variant={colorScheme === 'primary' ? 'primary' : 'neutral'}
            size={size === 'large' ? 'md' : size === 'medium' ? 's' : 'xs'}
            shape="rounded"
          >
            {badgeContent}
          </NumberBadge>
        )}
        {onRemove && (
          <Icon
            name="Cross"
            onClick={onRemove}
            className={cn(iconVariants({ colorScheme, size, selected }), "cursor-pointer")}
          />
        )}
      </div>
    )
  }
)
Label.displayName = "Label"

export { Label, labelVariants }