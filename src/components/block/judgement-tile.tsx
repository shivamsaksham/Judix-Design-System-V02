"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ContextActionMenu } from "./context-action-menu";
import { IconButton } from "../ui";

export interface JudgementTileProps {
    title: string;
    matchPercentage: string;
    citationCount: number;
    description: string;
    year: string;
    court: string;
    isAdded?: boolean;
    isBookmarked?: boolean;
    isMentioned?: boolean;
    onAdd?: () => void;
    onBookmark?: () => void;
    onMention?: () => void;
    onClick?: () => void;
    isSelected?: boolean;
    id?: string;
    className?: string;
}

export function JudgementTile({
    title,
    matchPercentage,
    citationCount,
    description,
    year,
    court,
    isAdded,
    isBookmarked,
    isMentioned,
    onAdd,
    onBookmark,
    onMention,
    onClick,
    isSelected,
    className
}: JudgementTileProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <div className={cn(
            "group relative flex flex-col gap-1 p-3 w-full cursor-pointer",
            "rounded-lg",
            "bg-color-surface-neutral-default hover:bg-color-surface-neutral-subtle_bg",
            isSelected ? "border-2 border-color-border-neutral-strong" : "border border-color-border-neutral-default",
            "transition-colors duration-200",
            className
        )}
            onClick={onClick}
        >
            <div className="flex flex-col gap-[6px]">
                <h3 className="p-1 text-color-text-neutral-default text-style-body-default-regular line-clamp-2 whitespace-normal pr-8">
                    {title}
                </h3>
                <div className="flex flex-wrap justify-between gap-1">
                    <Label colorScheme="neutral" className="h-6 px-2 rounded-md bg-white border border-color-border-neutral-default text-color-label-color-neutral-text">
                        {year}
                    </Label>
                    <Label colorScheme="primary" className="h-6 px-2 rounded-lg">
                        {matchPercentage}
                    </Label>
                </div>
            </div>

            <div className="relative">
                <p className="p-1 text-color-text-neutral-default text-style-textblock-secondary-subtext-regular line-clamp-5">
                    {description}
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-color-surface-neutral-default to-transparent pointer-events-none" />
            </div>

            <div className="flex items-center justify-between mt-2">
                <span className="p-1 text-color-text-neutral-secondary text-style-label-default-regular">
                    Cited {citationCount} {citationCount === 1 ? 'time' : 'times'}
                </span>
                <span className="p-1 text-color-text-neutral-secondary text-style-label-default-regular">
                    {court}
                </span>
            </div>

            <div className={cn("absolute top-3 right-3 transition-opacity duration-200", open ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <div onClick={(e) => e.stopPropagation()}>
                            <IconButton size="medium" icon="add" className="flex items-center justify-center w-8 h-8 bg-color-surface-neutral-default border border-color-border-neutral-default rounded-lg hover:bg-color-surface-neutral-subtle_bg shadow-sm transition-colors" variant={'neutral'} />
                        </div>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="p-0 border-none shadow-none bg-transparent w-auto" onClick={(e) => e.stopPropagation()}>
                        <ContextActionMenu
                            isAdded={isAdded}
                            isBookmarked={isBookmarked}
                            isMentioned={isMentioned}
                            onAdd={() => { onAdd?.(); }}
                            onBookmark={() => { onBookmark?.(); }}
                            onMention={() => { onMention?.(); }}
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}