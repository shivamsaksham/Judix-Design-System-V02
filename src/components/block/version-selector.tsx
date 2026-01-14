"use client";

import * as React from "react";
import { Icon } from "judix-icon";
import { cn } from "@/lib/utils";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../ui/popover";
import { Dropdown, DropdownOption } from "../ui/dropdown";

export interface VersionSelectorProps {
    options: DropdownOption[];
    value: string | null;
    onChange: (value: string) => void;
    className?: string;
    placeholder?: string;
    formatLabel?: (option: DropdownOption) => string;
}

export function VersionSelector({
    options,
    value,
    onChange,
    className,
    placeholder = "Select version",
    formatLabel
}: VersionSelectorProps) {
    const [open, setOpen] = React.useState(false);

    const selectedOption = React.useMemo(() =>
        options.find(opt => opt.value === value),
        [options, value]);

    const displayLabel = selectedOption
        ? (formatLabel
            ? formatLabel(selectedOption)
            : selectedOption.title.replace("Version ", "v").replace(" . ", " • "))
        : placeholder;

    const formattedOptions = React.useMemo(() =>
        options.map(opt => ({
            ...opt,
            title: opt.title.replace(" . ", " • ")
        })),
        [options]
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div
                    className={cn(
                        "group flex items-center justify-between gap-2 p-1 rounded-lg cursor-pointer transition-all duration-200 select-none",
                        "text-style-label-title-regular text-color-text-neutral-default",
                        "hover:bg-color-surface-neutral-hover_default",
                        open ? "bg-color-surface-neutral-hover_default" : "bg-transparent",
                        className
                    )}
                >
                    <span className="truncate">
                        {displayLabel}
                    </span>
                    <Icon
                        name="ArrowDown"
                        className={cn(
                            "h-4 w-4 text-color-icon-neutral-tertiary transition-opacity duration-200",
                            "opacity-0 group-hover:opacity-100",
                            open && "opacity-100"
                        )}
                    />
                </div>
            </PopoverTrigger>
            <PopoverContent
                className="p-0 w-auto border-none shadow-none bg-transparent"
                align="start"
                sideOffset={4}
            >
                <Dropdown
                    options={formattedOptions}
                    value={value}
                    onChange={(val) => {
                        onChange(val);
                        setOpen(false);
                    }}
                    searchbar="off"
                    placeholder="Search versions..."
                    className="w-[240px] shadow-lg"
                />
            </PopoverContent>
        </Popover>
    );
}
