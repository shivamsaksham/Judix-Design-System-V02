"use client";

import * as React from "react";
import { IconButton } from "../ui/icon-button";
import { SearchSection, SearchSectionProps } from "./search-section";

import { DropdownOption } from "../ui/dropdown";

// Omit props that are preset by this component
type PresetProps = "title" | "dropdownLabel" | "actions";
export interface ActResultHeaderProps extends Omit<SearchSectionProps, PresetProps> {
    onPrint?: () => void;
    dropdownOptions?: DropdownOption[];
    dropdownValue?: string | null;
    onDropdownChange?: (value: string) => void;
}

export function ActResultHeader({
    onPrint,
    dropdownOptions,
    dropdownValue,
    onDropdownChange,
    ...props
}: ActResultHeaderProps) {
    return (
        <SearchSection
            title="Acts & Sections"
            dropdownLabel={
                (dropdownOptions && dropdownValue)
                    ? (dropdownOptions.find(o => o.value === dropdownValue)?.title || "Central Acts")
                    : "Central Acts"
            }
            dropdownOptions={dropdownOptions}
            dropdownValue={dropdownValue}
            onDropdownChange={onDropdownChange}
            actions={
                <IconButton
                    icon="Printer"
                    variant="neutral"
                    boundary="stroked"
                    corner="rounded"
                    size="medium"
                    aria-label="Print"
                    className="rounded-lg h-[32px] w-[32px]"
                    onClick={onPrint}
                />
            }
            {...props}
        />
    );
}
