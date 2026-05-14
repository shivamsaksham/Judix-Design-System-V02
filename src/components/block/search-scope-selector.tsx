import * as React from "react"
import { Label } from "../ui/label"
import { cn } from "@/lib/utils"
import { Separator } from "../ui"

export interface SearchScopeSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
    selectedScopes?: string[]
    availableScopes?: string[]
    onScopeSelect?: (scope: string) => void
    onScopeRemove?: (scope: string) => void
}

export function SearchScopeSelector({
    className,
    selectedScopes = [],
    availableScopes = [],
    onScopeSelect,
    onScopeRemove,
    ...props
}: SearchScopeSelectorProps) {
    return (
        <div
            className={cn(
                "px-3 py-2 bg-color-surface-neutral-default rounded-2xl shadow-sm border border-color-border-neutral-default w-full max-w-[353px] min-h-[130px] flex flex-col gap-3",
                className
            )}
            {...props}
        >
            <h3 className="p-1 text-color-text-primary-default text-style-body-default-emphasis">
                Configure your search :
            </h3>
            <Separator className="bg-color-border-neutral-default" orientation="horizontal" />
            <div className="p-3 flex flex-wrap gap-2">
                {availableScopes.map(scope => {
                    const isSelected = selectedScopes.includes(scope);
                    return (
                        <Label
                            key={scope}
                            size="small"
                            colorScheme={isSelected ? "primary" : "neutral"}
                            className="cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => !isSelected && onScopeSelect?.(scope)}
                            onRemove={isSelected ? () => onScopeRemove?.(scope) : undefined}
                        >
                            {scope}
                        </Label>
                    )
                })}
            </div>
        </div>
    )
}
