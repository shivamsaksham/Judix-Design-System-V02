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
    className?: string;
}

export function ResultPanel({
    judgments,
    acts,
    onJudgmentFilter,
    onJudgmentPrint,
    onActPrint,
    className
}: ResultPanelProps) {
    const [viewMode, setViewMode] = React.useState<"judgments" | "acts">("judgments");
    const [search, setSearch] = React.useState("");
    const [version, setVersion] = React.useState("v4");

    // Combined dropdown options
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
            setViewMode(value);
        }
    };

    const isJudgments = viewMode === "judgments";
    const currentTitle = isJudgments ? "Relevant Judgments" : "Acts & Sections";
    const currentDropdownLabel = viewOptions.find(o => o.value === viewMode)?.title || "Supreme Court";

    // Determine which actions to show
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
        <div className={cn("flex justify-center p-4 bg-color-surface-base-default h-full", className)}>
            <div className="flex flex-col w-[400px] h-[769px] bg-white rounded-xl border border-color-border-neutral-default overflow-hidden">
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
                            judgments.map((judgment, index) => (
                                <JudgmentTile key={index} {...judgment} />
                            ))
                        ) : (
                            acts.map((act, index) => (
                                <ActResultTile key={index} {...act} />
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}
