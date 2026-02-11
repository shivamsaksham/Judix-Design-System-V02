"use client";

import * as React from "react";
import { Icon } from "@judix/icon";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { TextInput } from "../ui/text-input";
import { VersionSelector } from "./version-selector";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../ui/popover";
import { Dropdown, DropdownOption } from "../ui/dropdown";

export interface SearchSectionProps {
    title: string;
    version: string | null;
    onVersionChange: (value: string) => void;
    versionOptions: DropdownOption[];
    dropdownLabel: string;
    onDropdownClick?: () => void;
    dropdownOptions?: DropdownOption[];
    dropdownValue?: string | null;
    onDropdownChange?: (value: string) => void;
    searchPlaceholder?: string;
    onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    searchValue?: string;
    actions?: React.ReactNode;
    className?: string;
}

export function SearchSection({
    title,
    version,
    onVersionChange,
    versionOptions,
    dropdownLabel,
    onDropdownClick,
    dropdownOptions,
    dropdownValue,
    onDropdownChange,
    searchPlaceholder = "Search in here",
    onSearchChange,
    searchValue,
    actions,
    className
}: SearchSectionProps) {
    const [open, setOpen] = React.useState(false);

    const DropdownTriggerButton = (
        <Button
            variant="neutral"
            size="small"
            onClick={dropdownOptions ? undefined : onDropdownClick}
            className={cn(
                "gap-2 text-color-text-neutral-default border-color-border-neutral-default rounded-lg",
                open && "bg-color-surface-neutral-hover_default"
            )}
        >
            {dropdownLabel}
            <Icon
                name="arrow-down-a"
                className={cn(
                    "h-4 w-4 text-color-icon-neutral-tertiary transition-transform duration-200",
                    open && "rotate-180"
                )}
            />
        </Button>
    );

    return (
        <div className={cn("flex flex-col gap-3 pt-4 px-2 pb-2 bg-color-surface-neutral-subtle_bg", className)}>

            <div className="flex justify-start">
                <VersionSelector
                    options={versionOptions}
                    value={version}
                    onChange={onVersionChange}
                />
            </div>


            <div className="flex items-center justify-between">
                <h2 className="text-style-body-title-regular text-color-text-neutral-default">
                    {title}
                </h2>

                {dropdownOptions ? (
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            {DropdownTriggerButton}
                        </PopoverTrigger>
                        <PopoverContent
                            className="p-0 w-auto border-none shadow-none bg-transparent"
                            align="end"
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
                                className="w-[160px] shadow-lg"
                            />
                        </PopoverContent>
                    </Popover>
                ) : (
                    DropdownTriggerButton
                )}
            </div>


            <div className="flex gap-3">
                <TextInput
                    label=""
                    inputSize="default"
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onChange={onSearchChange}
                    className="flex-grow h-[42px] w-[300px] py-1 items-center bg-textinput-bg"
                    trailingAccessory={
                        <Icon name="search-normal-a" className="h-5 w-5 text-color-icon-neutral-tertiary" />
                    }
                />


                {actions && (
                    <div className="flex items-end gap-2 flex-none">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
}
