import * as React from "react"
import { cn } from "@/lib/utils"
import { inputVariants } from "./text-input"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  helperText?: string
  errorMessage?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, helperText, errorMessage, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)

    const showError = !!errorMessage
    const showHelperText = helperText && !errorMessage

    return (
      <div className={cn("flex flex-col gap-1 w-full", { "opacity-60": props.disabled })}>
        {label && (
          <label htmlFor={props.id} className="textinput-font-label text-textinput-color-text-label">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            inputVariants({ 
              variant: props.disabled ? "disabled" : showError ? "error" : isFocused ? "focus" : "default" 
            }),
            "min-h-[120px] w-full px-3 py-2 text-style-body-default-regular placeholder:text-color-text-neutral-tertiary focus-visible:outline-none disabled:cursor-not-allowed",
            className
          )}
          {...props}
        />
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
Textarea.displayName = "Textarea"

export { Textarea }
