"use client"

import * as React from "react"
import { Checkbox } from "../ui/checkbox"
import { Separator } from "../ui/separator"
import { cn } from "@/lib/utils"
import { Option } from "../ui/option"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../ui/tooltip"

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

    const isSupremeCourt = (courtName: string) => {
        const nameLower = courtName.toLowerCase();
        return nameLower.includes("supreme court") || nameLower === "sc";
    }

    const isSupremeSelected = selectedCourts.some(isSupremeCourt)
    const selectedDistrictHighCount = selectedCourts.filter(
        (court) => !isSupremeCourt(court)
    ).length

    return (
        <TooltipProvider>
            <div
                className={cn(
                    "bg-color-surface-neutral-default border border-color-border-neutral-default rounded-dropdown-border-radius-default px-2 py-1 w-[333px]",
                    className
                )}
                {...props}
            >
                <div>
                    <Option
                        title="Find case laws from"
                        variant="primary"
                        className="pt-1 pb-2" />
                    <Separator className="bg-color-border-neutral-default" />

                    <div className="max-h-[300px] overflow-y-auto overflow-x-hidden custom-scrollbar">
                        {categories.map((category, categoryIndex) => (
                            <div key={category.id}>
                                <Option
                                    title={category.label}
                                    variant="primary"
                                    className="pt-2 pb-1"
                                />
                                <div className="flex flex-col">
                                    {category.courts.map((court) => {
                                        const isChecked = selectedCourts.includes(court)
                                        const isCourtSupreme = isSupremeCourt(court)

                                        let isDisabled = false
                                        if (!isChecked) {
                                            if (isCourtSupreme) {
                                                isDisabled = selectedDistrictHighCount >= 3
                                            } else {
                                                const maxAllowed = isSupremeSelected ? 2 : 3
                                                isDisabled = selectedDistrictHighCount >= maxAllowed
                                            }
                                        }

                                        const optionEl = (
                                            <Option
                                                key={court}
                                                title={court}
                                                onClick={() => {
                                                    if (!isDisabled) {
                                                        handleCourtToggle(court, !isChecked)
                                                    }
                                                }}
                                                className={cn(isDisabled && "opacity-50 cursor-not-allowed")}
                                                prefixSlot={
                                                    <Checkbox
                                                        variant="neutral"
                                                        size="medium"
                                                        checked={isChecked}
                                                        disabled={isDisabled}
                                                        onCheckedChange={(checked) => {
                                                            if (!isDisabled) {
                                                                handleCourtToggle(court, checked as boolean)
                                                            }
                                                        }}
                                                    />
                                                }
                                            />
                                        )

                                        if (isDisabled) {
                                            return (
                                                <Tooltip key={court}>
                                                    <TooltipTrigger asChild>
                                                        <div className="w-full">{optionEl}</div>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top" align="center" className="z-9999">
                                                        three courts can only be selected
                                                    </TooltipContent>
                                                </Tooltip>
                                            )
                                        }

                                        return optionEl
                                    })}
                                </div>
                                {categoryIndex < categories.length - 1 && (
                                    <Separator className="bg-color-border-neutral-default" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </TooltipProvider>
    )
}
