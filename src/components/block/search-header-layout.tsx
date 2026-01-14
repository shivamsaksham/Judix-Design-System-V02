"use client";

import * as React from "react";
import { DropdownOption } from "../ui/dropdown";
import { JudgmentResultHeader } from "./judgment-result-header";
import { ActResultHeader } from "./act-result-header";

const JUDGMENT_OPTIONS: DropdownOption[] = [
    { value: "supreme-court", title: "Supreme Court" }
];

const ACT_OPTIONS: DropdownOption[] = [
    { value: "central-acts", title: "Central Acts" }
];

const ALL_OPTIONS = [...JUDGMENT_OPTIONS, ...ACT_OPTIONS];

export interface SearchHeaderLayoutProps {
    version?: string | null;
    onVersionChange?: (value: string) => void;
    versionOptions: DropdownOption[];
    searchValue?: string;
    onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    initialDropdownValue?: string;
    onPrint?: () => void;
    onFilter?: () => void;
    className?: string;
}

export function SearchHeaderLayout({
    version,
    onVersionChange,
    versionOptions,
    searchValue,
    onSearchChange,
    initialDropdownValue = "supreme-court",
    onPrint,
    onFilter,
    className
}: SearchHeaderLayoutProps) {
    const [dropdownValue, setDropdownValue] = React.useState<string | null>(initialDropdownValue);

    // Determine if the selected value corresponds to a Judgment or an Act
    const isJudgment = JUDGMENT_OPTIONS.some(opt => opt.value === dropdownValue);

    const commonProps = {
        version: version ?? null,
        onVersionChange: onVersionChange || (() => { }),
        versionOptions,
        searchValue,
        onSearchChange,
        dropdownOptions: ALL_OPTIONS,
        dropdownValue,
        onDropdownChange: setDropdownValue,
        onPrint,
        className
    };

    if (isJudgment) {
        return (
            <JudgmentResultHeader
                {...commonProps}
                onFilter={onFilter}
            />
        );
    }

    return (
        <ActResultHeader
            {...commonProps}
        />
    );
}
