"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@judix/icon";
import { IconButton } from "../ui/icon-button";
import { Button } from "../ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../ui/popover";
import { Dropdown, DropdownOption } from "../ui/dropdown";

export type ResearchTab = "judgments" | "acts" | "web";

export interface ResearchHeaderProps {
    activeTab?: ResearchTab;
    onTabChange?: (tab: ResearchTab) => void;
    onClose?: () => void;

    // Dropdown (e.g. "Central Acts", "Supreme Court")
    dropdownLabel?: string;
    dropdownOptions?: DropdownOption[];
    dropdownValue?: string | null;
    onDropdownChange?: (value: string) => void;

    // Actions
    onShare?: () => void;
    onExport?: () => void;

    className?: string;
}

const TABS: { value: ResearchTab; label: string }[] = [
    { value: "judgments", label: "Judgments" },
    { value: "acts", label: "Acts" },
    { value: "web", label: "Web" },
];

export function ResearchHeader({
    activeTab = "judgments",
    onTabChange,
    onClose,
    dropdownLabel = "Central Acts",
    dropdownOptions,
    dropdownValue,
    onDropdownChange,
    onShare,
    onExport,
    className,
}: ResearchHeaderProps) {
    const [open, setOpen] = React.useState(false);

    const DropdownTriggerButton = (
        <Button
            variant="neutral"
            size="extraSmall"
            className={cn(
                "gap-2 text-color-text-neutral-default border-color-border-neutral-default rounded-lg",
                open && "bg-color-surface-neutral-hover_default"
            )}
        >
            {dropdownLabel}
            <Icon
                name="arrow-down-c"
                className={cn(
                    "h-4 w-4 text-color-icon-neutral-tertiary transition-transform duration-200",
                    open && "rotate-180"
                )}
            />
        </Button>
    );

    return (
        <div className={cn("p-2 flex flex-col bg-color-surface-neutral-subtle_bg gap-2", className)}>
            {/* Title row */}
            <div className="p-1 flex items-center justify-between ">
                <div className="flex items-center gap-1">
                    {onClose && (
                        <IconButton
                            icon="arrow-left-a"
                            onClick={onClose}
                            variant="neutral"
                            boundary="none"
                            corner="rounded"
                            size="medium"
                            aria-label="Back"
                            className="lg:hidden text-color-icon-neutral-tertiary"
                        />
                    )}
                    <h2 className="p-1 text-style-body-default-regular text-color-text-neutral-default">
                        Research results
                    </h2>
                </div>
                {onClose && (
                    <Icon
                        name="cross"
                        onClick={onClose}
                        className="cursor-pointer text-color-icon-neutral-tertiary h-5 w-5 hidden lg:block"
                    />
                )}
            </div>

            {/* Tab bar */}
            <div className="flex border-box border-b border-color-border-neutral-default">
                {TABS.map((tab) => (
                    <button
                        key={tab.value}
                        type="button"
                        onClick={() => onTabChange?.(tab.value)}
                        className={ `p-3 text-style-body-default-regular transition-colors relative ${cn(
                            activeTab === tab.value
                                ? "text-color-text-primary-default"
                                : "text-color-text-neutral-default"
                        )}`}
                    >
                        {tab.label}
                        {activeTab === tab.value && (
                            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-color-border-primary-default" />
                        )}
                    </button>
                ))}
            </div>

            {/* Sub-header: dropdown + actions */}
            <div className="flex items-center justify-between mt-1">
                {/* Dropdown */}
                {dropdownOptions ? (
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            {DropdownTriggerButton}
                        </PopoverTrigger>
                        <PopoverContent
                            className="p-0 w-auto border-none shadow-none bg-transparent"
                            align="start"
                            sideOffset={4}
                        >
                            <Dropdown
                                options={dropdownOptions}
                                value={dropdownValue || null}
                                onChange={(val) => {
                                    onDropdownChange?.(val);
                                    setOpen(false);
                                }}
                                searchbar="off"
                                className="w-[200px] shadow-lg"
                            />
                        </PopoverContent>
                    </Popover>
                ) : (
                    DropdownTriggerButton
                )}

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                    <IconButton
                        icon="share-a"
                        variant="neutral"
                        boundary="stroked"
                        corner="rounded"
                        size="medium"
                        aria-label="Share"
                        className="rounded-lg h-[32px] w-[32px]"
                        onClick={onShare}
                    />
                    <IconButton
                        icon="export-d"
                        variant="neutral"
                        boundary="stroked"
                        corner="rounded"
                        size="medium"
                        aria-label="Export"
                        className="rounded-lg h-[32px] w-[32px]"
                        onClick={onExport}
                    />
                </div>
            </div>

        </div>
    );
}
