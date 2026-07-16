"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ResearchHeader, ResearchTab } from "./research-header";
import { JudgementTile, JudgementTileProps } from "./judgement-tile";
import { ActResultTile, ActResultTileProps } from "./act-result-tile";
import { DropdownOption } from "../ui/dropdown";

import { ScrollArea } from "../ui/scroll-area";

export interface ResultPanelProps {
    judgments: JudgementTileProps[];
    acts: ActResultTileProps[];
    onClose?: () => void;
    onShare?: () => void;
    onExport?: () => void;
    onJudgmentClick?: (judgment: JudgementTileProps) => void;
    onActClick?: (act: ActResultTileProps) => void;
    activeJudgmentId?: string | null;
    activeActId?: string | null;
    highlightedResultId?: string | null;
    className?: string;
    activeTab?: ResearchTab;
    onTabChange?: (tab: ResearchTab) => void;
    selectedCourts?: string[];
    isLoading?: boolean;
}

export function ResultPanel({
    judgments,
    acts,
    onClose,
    onShare,
    onExport,
    onJudgmentClick,
    onActClick,
    activeJudgmentId,
    activeActId,
    highlightedResultId,
    className,
    activeTab = "judgments",
    onTabChange,
    selectedCourts = [],
    isLoading = false
}: ResultPanelProps) {

    const [search, setSearch] = React.useState("");
    const [debouncedSearch, setDebouncedSearch] = React.useState("");

    const [internalTab, setInternalTab] = React.useState<ResearchTab>(activeTab);
    const currentTab = onTabChange ? activeTab : internalTab;

    const handleTabChange = (tab: ResearchTab) => {
        setInternalTab(tab);
        onTabChange?.(tab);
    };

    // Court dropdown for judgments tab
    const [selectedCourt, setSelectedCourt] = React.useState(selectedCourts[0] || "Supreme Court of India");

    React.useEffect(() => {
        if (currentTab === 'judgments' && selectedCourts.length > 0 && !selectedCourts.includes(selectedCourt)) {
            setSelectedCourt(selectedCourts[0]);
        }
    }, [selectedCourts, currentTab, selectedCourt]);

    // Act dropdown
    const [selectedActCategory, setSelectedActCategory] = React.useState("central-acts");

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const filteredJudgments = React.useMemo(() => {
        let filtered = judgments;
        if (currentTab === 'judgments' && selectedCourts.length > 0) {
            filtered = judgments.filter(j => j.court === selectedCourt);
        }
        if (!debouncedSearch) return filtered;
        const lowercaseSearch = debouncedSearch.toLowerCase();
        return filtered.filter(j =>
            j.title.toLowerCase().includes(lowercaseSearch) ||
            j.description.toLowerCase().includes(lowercaseSearch)
        );
    }, [judgments, debouncedSearch, selectedCourt, currentTab, selectedCourts]);

    const filteredActs = React.useMemo(() => {
        if (!debouncedSearch) return acts;
        const lowercaseSearch = debouncedSearch.toLowerCase();
        return acts.filter(a =>
            a.title.toLowerCase().includes(lowercaseSearch) ||
            (a.description && a.description.toLowerCase().includes(lowercaseSearch)) ||
            (a.section && a.section.toLowerCase().includes(lowercaseSearch))
        );
    }, [acts, debouncedSearch]);

    // Build dropdown options based on active tab
    const dropdownOptions: DropdownOption[] = React.useMemo(() => {
        if (currentTab === "judgments") {
            if (selectedCourts.length > 0) {
                return selectedCourts.map(court => ({ value: court, title: court }));
            }
            return [{ value: "Supreme Court of India", title: "Supreme Court of India" }];
        }
        if (currentTab === "acts") {
            return [
                { value: "central-acts", title: "Central Acts" },
                { value: "state-acts", title: "State Acts" },
            ];
        }
        return [];
    }, [currentTab, selectedCourts]);

    const dropdownLabel = currentTab === "judgments"
        ? (selectedCourts.find(c => c === selectedCourt) || selectedCourt)
        : (currentTab === "acts"
            ? (dropdownOptions.find(o => o.value === selectedActCategory)?.title || "Central Acts")
            : "Web");

    const dropdownValue = currentTab === "judgments" ? selectedCourt : selectedActCategory;

    const handleDropdownChange = (value: string) => {
        if (currentTab === "judgments") {
            setSelectedCourt(value);
        } else if (currentTab === "acts") {
            setSelectedActCategory(value);
        }
    };

    const isJudgments = currentTab === "judgments";
    const isActs = currentTab === "acts";

    const [highlightedId, setHighlightedId] = React.useState<string | null>(null);

    // Auto-scroll selected element into view
    React.useEffect(() => {
        const activeId = currentTab === 'judgments' ? activeJudgmentId : activeActId;
        const scrollId = highlightedResultId || activeId;
        const prefix = currentTab === 'judgments' ? 'result-judgment-' : 'result-act-';
        
        if (scrollId) {
            const timer = setTimeout(() => {
                const element = document.getElementById(`${prefix}${scrollId}`);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                    
                    if (highlightedResultId) {
                        setHighlightedId(highlightedResultId);
                        setTimeout(() => setHighlightedId(null), 2000);
                    }
                }
            }, 150);
            return () => clearTimeout(timer);
        }
    }, [activeJudgmentId, activeActId, highlightedResultId, currentTab, filteredJudgments, filteredActs]);

    return (
        <div className={cn("flex flex-col h-full bg-white", className)}>
            <ResearchHeader
                activeTab={currentTab}
                onTabChange={handleTabChange}
                onClose={onClose}
                dropdownLabel={dropdownLabel}
                dropdownOptions={dropdownOptions.length > 0 ? dropdownOptions : undefined}
                dropdownValue={dropdownValue}
                onDropdownChange={handleDropdownChange}
                onShare={onShare}
                onExport={onExport}
                className="shrink-0"
            />

            <ScrollArea className="flex-1 min-h-0 bg-color-surface-neutral-subtle_bg">
                <div className="flex flex-col gap-2 p-2">
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                                <div className="h-3 bg-gray-100 rounded w-1/3" />
                            </div>
                        ))
                    ) : (
                        <>
                    {isJudgments && filteredJudgments.length === 0 && (
                        <div className="flex items-center justify-center p-8 text-color-text-neutral-tertiary text-style-body-default-regular">
                            No judgements found
                        </div>
                    )}
                    {isJudgments && filteredJudgments.map((judgment, index) => (
                        <JudgementTile
                            key={index}
                            {...judgment}
                            id={`result-judgment-${judgment.id}`}
                            isSelected={activeJudgmentId ? judgment.id === activeJudgmentId : false}
                            isHighlighted={highlightedId ? judgment.id === highlightedId : false}
                            onClick={() => {
                                onJudgmentClick?.(judgment);
                            }}
                        />
                    ))}
                    {isActs && filteredActs.length === 0 && (
                        <div className="flex items-center justify-center p-8 text-color-text-neutral-tertiary text-style-body-default-regular">
                            No acts found
                        </div>
                    )}
                    {isActs && filteredActs.map((act, index) => (
                        <ActResultTile
                            key={index}
                            {...act}
                            id={`result-act-${act.id}`}
                            isSelected={activeActId ? act.id === activeActId : false}
                            isHighlighted={highlightedId ? act.id === highlightedId : false}
                            onClick={() => {
                                onActClick?.(act);
                            }}
                        />
                    ))}
                    {currentTab === "web" && (
                        <div className="flex items-center justify-center p-8 text-color-text-neutral-tertiary text-style-body-default-regular">
                            Web results coming soon
                        </div>
                    )}
                        </>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
