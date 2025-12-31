import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Label as CustomLabel } from "@/components/ui/label"

const inputVariants = cva(
  "flex w-full rounded-textinput-border-radius-default textinput-border-weight-default border bg-color-textinput-bg transition-colors duration-200 py-2 px-3",
  {
    variants: {
      variant: {
        default: "border-textinput-color-stroke-default",
        focus: "border-textinput-color-stroke-focus",
        error: "border-color-border-feedback-error-strong",
        disabled: "border-textinput-color-stroke-default bg-color-surface-neutral-hover_default"
      },
    },
    compoundVariants: [
      {
        variant: "default",
        className: "focus-within:border-textinput-color-stroke-focus",
      },
    ],
    defaultVariants: {
      variant: "default",
    },
  }
)

const inputFieldVariants = cva(
  "flex-1 min-w-0 bg-transparent border-none appearance-none textinput-font-placeholder-medium text-textinput-color-text-active placeholder:text-textinput-color-text-default focus:outline-none disabled:cursor-not-allowed disabled:text-color-text-neutral-disabled placeholder:disabled:text-color-text-neutral-disabled",
  {
    variants: {
      size: {
        default: "h-10",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface TextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label: string
  helperText?: string
  errorMessage?: string
  leadingIcon?: React.ReactNode
  trailingAccessory?: React.ReactNode
  selectedLabels?: { text: string; onRemove: () => void }[]
  inputSize?: "default";
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      className,
      label,
      helperText,
      errorMessage,
      leadingIcon,
      trailingAccessory,
      selectedLabels,
      variant: propVariant,
      inputSize = "default",
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false)

    let currentVariant: VariantProps<typeof inputVariants>["variant"] = propVariant || "default"
    if (props.disabled) {
      currentVariant = "disabled"
    } else if (errorMessage) {
      currentVariant = "error"
    } else if (isFocused) {
      currentVariant = "focus"
    }
    
    const showHelperText = helperText && !errorMessage;
    const showError = !!errorMessage;
    const hasLabels = selectedLabels && selectedLabels.length > 0;

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      onFocus?.(event)
    }

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      onBlur?.(event)
    }

    return (
      <div className={cn("flex flex-col gap-1 w-full", { "opacity-60": props.disabled })}>
        {label && (
          <label htmlFor={props.id} className="textinput-font-label text-textinput-color-text-label">
            {label}
          </label>
        )}
        <div className={cn(inputVariants({ variant: currentVariant, className }), {
          "border-textinput-color-stroke-focus": isFocused && !showError && !props.disabled,
        })}>
          {leadingIcon && (
            <div className={cn("flex items-center", {
              "text-color-icon-neutral-disabled": props.disabled,
              "text-textinput-color-icon-default": !props.disabled
            })}>
              {leadingIcon}
            </div>
          )}
          
          <input
            ref={ref}
            className={cn(inputFieldVariants({ size: inputSize }),
              "flex-grow appearance-none focus:outline-none focus:ring-0 focus:border-none",
              {
                "pl-3": leadingIcon,
                "pr-3": trailingAccessory,
              }
            )}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          {trailingAccessory && (
            <div className={cn("flex items-center", {
              "text-color-icon-neutral-disabled": props.disabled,
              "text-textinput-color-icon-error": showError && !props.disabled,
              "text-textinput-color-icon-default": !showError && !props.disabled
            })}>
              {trailingAccessory}
            </div>
          )}
        </div>

        {hasLabels && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {selectedLabels.map((item, index) => (
              <CustomLabel
                key={index}
                colorScheme="primary"
                size="small"
                onRemove={item.onRemove}
              >
                {item.text}
              </CustomLabel>
            ))}
          </div>
        )}

        {showHelperText && (
          <p className="textinput-font-helper text-textinput-color-text-helper-default">
            {helperText}
          </p>
        )}
        {showError && (
          <p className="textinput-font-helper text-textinput-color-text-helper-error">
            {errorMessage}
          </p>
        )}
      </div>
    )
  }
)
TextInput.displayName = "TextInput"

export { TextInput, inputVariants }