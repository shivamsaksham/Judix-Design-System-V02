"use client";
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import { Icon } from "judix-icon";
import { IconButton } from "@/components/ui/icon-button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog";

export interface ContextItem {
    id: string;
    title: string;
    subtitle: string;
    type: "session" | "case" | "query" | "act";
}

export interface ContextWindowProps {
    items: ContextItem[];
    selectedItems?: string[];
    onSelectionChange?: (selectedIds: string[]) => void;
    mode?: "auto" | "self-managed";
    onModeChange?: (mode: "auto" | "self-managed") => void;
    className?: string;
}

export function ContextWindow({
    items = [],
    selectedItems = [],
    onSelectionChange,
    mode = "self-managed",
    onModeChange,
    className,
}: ContextWindowProps) {
    const [internalMode, setInternalMode] = useState<"auto" | "self-managed">(mode);
    const [internalSelected, setInternalSelected] = useState<string[]>(selectedItems);

    const currentMode = onModeChange ? mode : internalMode;

    const autoSelectedIds = items.slice(0, 10).map((item) => item.id);

    const currentSelected = currentMode === "auto"
        ? autoSelectedIds
        : (onSelectionChange ? selectedItems : internalSelected);

    const handleModeToggle = (checked: boolean) => {
        const newMode = checked ? "self-managed" : "auto";
        if (onModeChange) {
            onModeChange(newMode);
        } else {
            setInternalMode(newMode);
        }

        if (newMode === "self-managed" && !onSelectionChange) {
            setInternalSelected([]);
        }
    };

    const handleItemSelect = (itemId: string, checked: boolean) => {
        if (currentMode === "auto") return;

        let newSelected: string[];
        if (checked) {
            if (currentSelected.length >= 10) return;
            newSelected = [...currentSelected, itemId];
        } else {
            newSelected = currentSelected.filter((id) => id !== itemId);
        }

        if (onSelectionChange) {
            onSelectionChange(newSelected);
        } else {
            setInternalSelected(newSelected);
        }
    };

    const isItemDisabled = (itemId: string) => {
        if (currentMode === "auto") return true;
        if (currentSelected.length >= 10 && !currentSelected.includes(itemId)) return true;
        return false;
    };

    return (

        <div
            className={cn(
                "bg-color-surface-neutral-default rounded-lg shadow-sm border border-color-border-neutral-default w-[400px] max-h-[500px] flex flex-col overflow-hidden",
                className
            )}
        >
            <div className="flex items-center justify-between px-4 py-3 border-b border-color-border-neutral-default">
                <span className="text-color-text-neutral-default">
                    Context Window
                </span>
                <Dialog>
                    <DialogTrigger asChild>
                        <IconButton
                            variant="neutral"
                            boundary="none"
                            size="medium"
                            icon="info-circle"
                            className="bg-transparent hover:bg-color-surface-neutral-subtle_bg text-color-text-neutral-subtle"
                        />
                    </DialogTrigger>
                    <DialogContent className="max-w-[500px] gap-6 bg-color-surface-neutral-default border-color-border-neutral-default">
                        <DialogHeader>
                            <DialogTitle>Context Window</DialogTitle>
                            <DialogDescription className="sr-only">
                                Information about how context window works
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex flex-col gap-6 text-sm text-color-text-neutral-default">
                            <p>
                                The context window shows the documents, judgments, and summaries the AI will use while answering your queries.
                            </p>

                            <div className="space-y-2">
                                <h4 className="font-medium text-color-text-primary-default">Auto Context</h4>
                                <p className="text-color-text-neutral-subtle">
                                    Judix automatically includes the most recent 10 items in your session. No manual selection required.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-medium text-color-text-primary-default">Self-Managed</h4>
                                <p className="text-color-text-neutral-subtle">
                                    You choose which items to include — up to 10 selections. The AI will only use the items you tick.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-medium text-color-text-primary-default">Best Use</h4>
                                <div className="text-color-text-neutral-subtle">
                                    <p>Keep only the items relevant to your current query for accurate responses.</p>
                                    <p>Update or clear the selection when switching matters.</p>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center gap-2 px-4 py-3 border-b border-color-border-neutral-default">
                <span
                    className={cn(
                        "text-sm transition-all duration-300 ease-out",
                        currentMode === "auto"
                            ? "font-medium text-color-text-primary-default"
                            : "text-color-text-neutral-subtle"
                    )}
                >
                    Auto context
                </span>
                <Toggle
                    checked={currentMode === "self-managed"}
                    onCheckedChange={handleModeToggle}
                    size="small"
                />
                <span
                    className={cn(
                        "text-sm transition-all duration-300 ease-out",
                        currentMode === "self-managed"
                            ? "font-medium text-color-text-primary-default"
                            : "text-color-text-neutral-subtle"
                    )}
                >
                    Self-managed
                </span>
            </div>

            <div className="flex flex-col flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-color-border-neutral-default scrollbar-track-transparent">
                {items.map((item) => {
                    const disabled = isItemDisabled(item.id);
                    return (
                        <div
                            key={item.id}
                            className={cn(
                                "flex items-start gap-3 px-4 py-3 border-b border-color-border-neutral-default last:border-b-0 transition-colors",
                                disabled
                                    ? "cursor-not-allowed opacity-60"
                                    : "cursor-pointer hover:bg-color-surface-neutral-subtle_bg"
                            )}
                            onClick={() => {
                                if (!disabled) {
                                    handleItemSelect(item.id, !currentSelected.includes(item.id));
                                }
                            }}
                        >
                            <Checkbox
                                checked={currentSelected.includes(item.id)}
                                onCheckedChange={(checked) =>
                                    handleItemSelect(item.id, checked as boolean)
                                }
                                size="medium"
                                className="mt-1"
                                disabled={disabled}
                                onClick={(e) => e.stopPropagation()}
                            />
                            <div className="flex flex-col gap-0.5 min-w-0">
                                <span className="text-sm font-medium text-color-text-neutral-default truncate">
                                    {item.title}
                                </span>
                                <span className="text-xs text-color-text-neutral-subtle line-clamp-2">
                                    {item.subtitle}
                                </span>
                            </div>
                        </div>
                    );
                })}

                {items.length === 0 && (
                    <div className="flex items-center justify-center py-8 text-sm text-color-text-neutral-subtle">
                        No context items available
                    </div>
                )}
            </div>
        </div>
    );
}

export default ContextWindow;
