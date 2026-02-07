"use client"

import * as React from "react"
import { Checkbox } from "../ui/checkbox"
import { Separator } from "../ui/separator"
import { cn } from "@/lib/utils"

export interface CourtSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
    selectedCourts?: string[]
    onCourtSelect?: (court: string) => void
    onCourtDeselect?: (court: string) => void
}

export interface CourtCategory {
    id: string
    label: string
    courts: string[]
}

export interface CourtSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
    selectedCourts?: string[]
    categories?: CourtCategory[]
    onCourtSelect?: (court: string) => void
    onCourtDeselect?: (court: string) => void
}

export function CourtSelector({
    className,
    selectedCourts = [],
    categories = [],
    onCourtSelect,
    onCourtDeselect,
    ...props
}: CourtSelectorProps) {
    const handleCourtToggle = (court: string, isChecked: boolean) => {
        if (isChecked) {
            onCourtSelect?.(court)
        } else {
            onCourtDeselect?.(court)
        }
    }

    return (
        <div
            className={cn(
                "bg-color-surface-neutral-default border border-color-border-neutral-default rounded-dropdown-border-radius-default p-2 w-[333px]",
                className
            )}
            {...props}
        >
            <div className="px-2 py-1">
                <h3 className="text-color-text-primary-default font-medium text-sm mb-4">
                    Find case laws from
                </h3>
                <Separator className="bg-color-border-neutral-default mb-4" />

                {categories.map((category, categoryIndex) => (
                    <div key={category.id} className="mb-4">
                        <h4 className="text-color-text-primary-default font-medium text-sm mb-3">
                            {category.label}
                        </h4>
                        <div className="flex flex-col gap-3">
                            {category.courts.map((court) => {
                                const isChecked = selectedCourts.includes(court)
                                return (
                                    <div key={court} className="flex items-center gap-3">
                                        <Checkbox
                                            variant="neutral"
                                            size="medium"
                                            checked={isChecked}
                                            onCheckedChange={(checked) =>
                                                handleCourtToggle(court, checked as boolean)
                                            }
                                        />
                                        <label
                                            className="text-color-text-neutral-default text-sm cursor-pointer select-none"
                                            onClick={() => handleCourtToggle(court, !isChecked)}
                                        >
                                            {court}
                                        </label>
                                    </div>
                                )
                            })}
                        </div>
                        {categoryIndex < categories.length - 1 && (
                            <Separator className="bg-color-border-neutral-default mt-4" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}