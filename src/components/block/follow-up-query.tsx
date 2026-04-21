import * as React from "react"
import { cn } from "@/lib/utils"

export interface FollowUpQueryProps extends React.HTMLAttributes<HTMLButtonElement> {
    query: string
    onClick?: () => void
    className?: string
}

const FollowUpQuery = React.forwardRef<HTMLButtonElement, FollowUpQueryProps>(
    ({ query, onClick, className, ...props }, ref) => {
        return (
            <button
                ref={ref}
                onClick={onClick}
                className={`text-style-textblock-primary-subtext-regular ${cn(
                    "text-color-text-primary-default",
                    "bg-color-surface-neutral-default",
                    "hover:bg-color-surface-primary-hover_default",
                    "border-b border-color-border-neutral-default",
                    "rounded-radius-button-border-radius-default",
                    "px-4 py-3",
                    "cursor-pointer",
                    "transition-colors duration-200 ease-in-out",
                    "whitespace-normal break-words text-left",
                    "w-full",
                    className
                )}`}
                {...props}
            >
                <div className="p-1">
                    {query}
                </div>
            </button>
        )
    }
)

FollowUpQuery.displayName = "FollowUpQuery"

export { FollowUpQuery }
