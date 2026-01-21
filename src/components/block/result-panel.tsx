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
    onViewModeChange
}: ResultPanelProps) {
    const [search, setSearch] = React.useState("");
    const [debouncedSearch, setDebouncedSearch] = React.useState("");
    const [version, setVersion] = React.useState("v4");


    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);


    const filteredJudgments = React.useMemo(() => {
        if (!debouncedSearch) return judgments;
        const lowercaseSearch = debouncedSearch.toLowerCase();
        return judgments.filter(j =>
            j.title.toLowerCase().includes(lowercaseSearch) ||
            j.description.toLowerCase().includes(lowercaseSearch)
        );
    }, [judgments, debouncedSearch]);

    const filteredActs = React.useMemo(() => {
        if (!debouncedSearch) return acts;
        const lowercaseSearch = debouncedSearch.toLowerCase();
        return acts.filter(a =>
            a.title.toLowerCase().includes(lowercaseSearch) ||
            (a.description && a.description.toLowerCase().includes(lowercaseSearch)) ||
            (a.section && a.section.toLowerCase().includes(lowercaseSearch))
        );
    }, [acts, debouncedSearch]);


    const viewOptions: DropdownOption[] = [
        { value: "judgments", title: "Supreme Court" },
        { value: "acts", title: "Central Acts" },
    ];

    const versionOptions: DropdownOption[] = [
        { value: "v4", title: "v4 • Latest" },
        { value: "v3", title: "v3" },
        { value: "v2", title: "v2" },
        { value: "v1", title: "v1" },
    ];

    const handleDropdownChange = (value: string) => {
        if (value === "judgments" || value === "acts") {
            onViewModeChange?.(value);
        }
    };

    const isJudgments = viewMode === "judgments";
    const currentTitle = isJudgments ? "Relevant Judgments" : "Acts & Sections";
    const currentDropdownLabel = viewOptions.find(o => o.value === viewMode)?.title || "Supreme Court";


    const actions = isJudgments ? (
        <>
            <IconButton
                icon="Printer"
                variant="neutral"
                boundary="stroked"
                corner="rounded"
                size="medium"
                aria-label="Print"
                className="rounded-lg h-[32px] w-[32px]"
                onClick={onJudgmentPrint}
            />
            <IconButton
                icon="Filter"
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
            icon="Printer"
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
                                    setSearch(judgment.title);
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
                                    setSearch(act.title);
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
