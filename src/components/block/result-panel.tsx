"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { SearchSection } from "./search-section";
import { JudgmentTile, JudgmentTileProps } from "./judgment-tile";
import { ActResultTile, ActResultTileProps } from "./act-result-tile";
import { IconButton } from "../ui/icon-button";
import { DropdownOption } from "../ui/dropdown";

import { ScrollArea } from "../ui/scroll-area";

export interface ResultPanelProps {
    judgments: JudgmentTileProps[];
    acts: ActResultTileProps[];
    onJudgmentFilter?: () => void;
    onJudgmentPrint?: () => void;
    onActPrint?: () => void;
    onJudgmentClick?: (judgment: JudgmentTileProps) => void;
    onActClick?: (act: ActResultTileProps) => void;
    activeJudgmentId?: string | null;
    activeActId?: string | null;
    className?: string;
    viewMode?: "judgments" | "acts";
    onViewModeChange?: (mode: "judgments" | "acts") => void;
    selectedCourts?: string[];
}

export function ResultPanel({
    judgments,
    acts,
    onJudgmentFilter,
    onJudgmentPrint,
    onActPrint,
    onJudgmentClick,
    onActClick,
    activeJudgmentId,
    activeActId,
    className,
    viewMode = "judgments",
    onViewModeChange,
    selectedCourts = []
}: ResultPanelProps) {
    const [search, setSearch] = React.useState("");
    const [debouncedSearch, setDebouncedSearch] = React.useState("");
    const [version, setVersion] = React.useState("v4");

    // We need to track which specific court is selected in the dropdown if we are in "judgments" mode
    // preciseViewVal can be "acts" or a specific court name
    // If viewMode is acts, preciseViewVal is "acts"
    // If viewMode is judgments, preciseViewVal is the selected court name.
    // We'll initialize it with the first selected court or "Supreme Court" default
    const [preciseViewVal, setPreciseViewVal] = React.useState(selectedCourts[0] || "Supreme Court of India");

    // Sync preciseViewVal when selectedCourts changes if current val is not in new list? 
    // For now, let's just default if empty.
    React.useEffect(() => {
        if (viewMode === 'judgments' && selectedCourts.length > 0 && !selectedCourts.includes(preciseViewVal)) {
            setPreciseViewVal(selectedCourts[0]);
        }
    }, [selectedCourts, viewMode]);


    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);


    const filteredJudgments = React.useMemo(() => {
        let filtered = judgments;

        // Filter by the selected court from dropdown if we are in judgments mode
        // preciseViewVal holds the court name
        if (viewMode === 'judgments') {
            // If we have selected courts passed, we only show for the one selected in dropdown
            // If preciseViewVal is "Supreme Court" (default) but not in selectedCourts (if selectedCourts provided), we might show nothing or all?
            // As per user request: "drop-down me bhi whi tino courts rhenge" -> filtering selection

            // We filter by court name matching preciseViewVal
            // Note: Mock data needs to match these strings exactly or we need looser matching.
            filtered = judgments.filter(j => j.court === preciseViewVal);
        }

        if (!debouncedSearch) return filtered;
        const lowercaseSearch = debouncedSearch.toLowerCase();
        return filtered.filter(j =>
            j.title.toLowerCase().includes(lowercaseSearch) ||
            j.description.toLowerCase().includes(lowercaseSearch)
        );
    }, [judgments, debouncedSearch, preciseViewVal, viewMode]);

    const filteredActs = React.useMemo(() => {
        if (!debouncedSearch) return acts;
        const lowercaseSearch = debouncedSearch.toLowerCase();
        return acts.filter(a =>
            a.title.toLowerCase().includes(lowercaseSearch) ||
            (a.description && a.description.toLowerCase().includes(lowercaseSearch)) ||
            (a.section && a.section.toLowerCase().includes(lowercaseSearch))
        );
    }, [acts, debouncedSearch]);


    const viewOptions: DropdownOption[] = React.useMemo(() => {
        const opts: DropdownOption[] = [];

        if (selectedCourts.length > 0) {
            selectedCourts.forEach(court => {
                opts.push({ value: court, title: court });
            });
        } else {
            // Fallback if no courts selected
            opts.push({ value: "Supreme Court of India", title: "Supreme Court of India" });
        }

        opts.push({ value: "acts", title: "Central Acts" });
        return opts;
    }, [selectedCourts]);


    const versionOptions: DropdownOption[] = [
        { value: "v4", title: "v4 • Latest" },
        { value: "v3", title: "v3" },
        { value: "v2", title: "v2" },
        { value: "v1", title: "v1" },
    ];

    const handleDropdownChange = (value: string) => {
        if (value === "acts") {
            onViewModeChange?.("acts");
            setPreciseViewVal("acts");
        } else {
            // It's a court name
            onViewModeChange?.("judgments");
            setPreciseViewVal(value);
        }
    };

    const isJudgments = viewMode === "judgments";
    // Title is determined by the specific selected court or "Acts & Sections"
    const currentTitle = isJudgments ? (preciseViewVal || "Relevant Judgments") : "Acts & Sections";

    // The dropdown label should reflect the currently selected item (Court name or "Central Acts")
    const currentDropdownLabel = viewOptions.find(o => o.value === preciseViewVal)?.title || preciseViewVal || "Supreme Court";


    const actions = isJudgments ? (
        <>
            <IconButton
                icon="printer"
                variant="neutral"
                boundary="stroked"
                corner="rounded"
                size="medium"
                aria-label="Print"
                className="rounded-lg h-[32px] w-[32px]"
                onClick={onJudgmentPrint}
            />
            <IconButton
                icon="filter"
                variant="neutral"
                boundary="stroked"
                corner="rounded"
                size="medium"
                aria-label="Filter"
                className="rounded-lg h-[32px] w-[32px]"
                onClick={onJudgmentFilter}
            />
        </>
    ) : (
        <IconButton
            icon="printer"
            variant="neutral"
            boundary="stroked"
            corner="rounded"
            size="medium"
            aria-label="Print"
            className="rounded-lg h-[32px] w-[32px]"
            onClick={onActPrint}
        />
    );

    return (
        <div className={cn("flex flex-col h-full bg-white", className)}>
            <SearchSection
                title={currentTitle}
                version={version}
                onVersionChange={setVersion}
                versionOptions={versionOptions}
                dropdownLabel={currentDropdownLabel}
                dropdownOptions={viewOptions}
                dropdownValue={viewMode}
                onDropdownChange={handleDropdownChange}
                searchValue={search}
                onSearchChange={(e) => setSearch(e.target.value)}
                actions={actions}
                className="shrink-0"
            />

            <ScrollArea className="flex-1 min-h-0 bg-color-surface-neutral-subtle_bg">
                <div className="flex flex-col gap-2 p-2">
                    {isJudgments ? (
                        filteredJudgments.map((judgment, index) => (
                            <JudgmentTile
                                key={index}
                                {...judgment}
                                isSelected={activeJudgmentId ? judgment.id === activeJudgmentId : false}
                                onClick={() => {
                                    onJudgmentClick?.(judgment);
                                }}
                            />
                        ))
                    ) : (
                        filteredActs.map((act, index) => (
                            <ActResultTile
                                key={index}
                                {...act}
                                isSelected={activeActId ? act.id === activeActId : false}
                                onClick={() => {
                                    onActClick?.(act);
                                }}
                            />
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
