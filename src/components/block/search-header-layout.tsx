"use client";

import * as React from "react";
import { ResearchHeader, ResearchHeaderProps, ResearchTab } from "./research-header";
import { DropdownOption } from "../ui/dropdown";

const COURT_OPTIONS: DropdownOption[] = [
    { value: "Supreme Court of India", title: "Supreme Court of India" },
];

const ACT_OPTIONS: DropdownOption[] = [
    { value: "central-acts", title: "Central Acts" },
    { value: "state-acts", title: "State Acts" },
];

export interface SearchHeaderLayoutProps {
    initialTab?: ResearchTab;
    onClose?: () => void;
    onShare?: () => void;
    onExport?: () => void;
    searchValue?: string;
    onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

export function SearchHeaderLayout({
    initialTab = "judgments",
    onClose,
    onShare,
    onExport,
    searchValue,
    onSearchChange,
    className,
}: SearchHeaderLayoutProps) {
    const [activeTab, setActiveTab] = React.useState<ResearchTab>(initialTab);
    const [courtValue, setCourtValue] = React.useState("Supreme Court of India");
    const [actValue, setActValue] = React.useState("central-acts");

    const dropdownOptions = activeTab === "judgments" ? COURT_OPTIONS : activeTab === "acts" ? ACT_OPTIONS : undefined;
    const dropdownValue = activeTab === "judgments" ? courtValue : actValue;
    const dropdownLabel = activeTab === "judgments"
        ? (COURT_OPTIONS.find(o => o.value === courtValue)?.title || "Supreme Court of India")
        : activeTab === "acts"
            ? (ACT_OPTIONS.find(o => o.value === actValue)?.title || "Central Acts")
            : "Web";

    const handleDropdownChange = (value: string) => {
        if (activeTab === "judgments") setCourtValue(value);
        else if (activeTab === "acts") setActValue(value);
    };

    return (
        <ResearchHeader
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onClose={onClose}
            dropdownLabel={dropdownLabel}
            dropdownOptions={dropdownOptions}
            dropdownValue={dropdownValue}
            onDropdownChange={handleDropdownChange}
            onShare={onShare}
            onExport={onExport}
            className={className}
        />
    );
}
