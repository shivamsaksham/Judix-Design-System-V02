"use client";

import * as React from "react";
import { IconButton } from "../ui/icon-button";
import { SearchSection, SearchSectionProps } from "./search-section";

import { DropdownOption } from "../ui/dropdown";

// Omit props that are preset by this component
type PresetProps = "title" | "dropdownLabel" | "actions";
export interface JudgmentResultHeaderProps extends Omit<SearchSectionProps, PresetProps> {
    onPrint?: () => void;
    onFilter?: () => void;
    dropdownOptions?: DropdownOption[];
    dropdownValue?: string | null;
    onDropdownChange?: (value: string) => void;
}

export function JudgmentResultHeader({
    onPrint,
    onFilter,
    dropdownOptions,
    dropdownValue,
    onDropdownChange,
    ...props
}: JudgmentResultHeaderProps) {
    return (
        <SearchSection
            title="Relevant Judgments"
            dropdownLabel={
                (dropdownOptions && dropdownValue)
                    ? (dropdownOptions.find(o => o.value === dropdownValue)?.title || "Supreme Court")
                    : "Supreme Court"
            }
            dropdownOptions={dropdownOptions}
            dropdownValue={dropdownValue}
            onDropdownChange={onDropdownChange}
            actions={
                <>
                    <IconButton
                        icon="printer"
                        variant="neutral"
                        boundary="stroked"
                        corner="rounded"
                        size="medium"
                        aria-label="Print"
                        className="rounded-lg h-[32px] w-[32px]"
                        onClick={onPrint}
                    />
                    <IconButton
                        icon="filter"
                        variant="neutral"
                        boundary="stroked"
                        corner="rounded"
                        size="medium"
                        aria-label="Filter"
                        className="rounded-lg h-[32px] w-[32px]"
                        onClick={onFilter}
                    />
                </>
            }
            {...props}
        />
    );
}
