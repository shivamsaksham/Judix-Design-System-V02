"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ContextActionMenu } from "./context-action-menu";
import { IconButton } from "../ui";
import { Icon } from "@judix/icon";

export interface ActResultTileProps {
    title: string;
    section: string;
    description: string;
    isAdded?: boolean;
    isBookmarked?: boolean;
    isMentioned?: boolean;
    onViewDetails?: () => void;
    onAdd?: () => void;
    onBookmark?: () => void;
    onMention?: () => void;
    onClick?: () => void;
    isSelected?: boolean;
    isHighlighted?: boolean;
    id: string;
    className?: string;
}

export function ActResultTile({
    title,
    section,
    description,
    isAdded,
    isBookmarked,
    isMentioned,
    onViewDetails,
    onAdd,
    onBookmark,
    onMention,
    onClick,
    isSelected,
    isHighlighted,
    id,
    className
}: ActResultTileProps) {
    const [open, setOpen] = React.useState(false);
    const [expanded, setExpanded] = React.useState(false);
    const [showReadMore, setShowReadMore] = React.useState(false);
    const descriptionRef = React.useRef<HTMLParagraphElement>(null);

    React.useLayoutEffect(() => {
        if (descriptionRef.current) {
            const { scrollHeight, clientHeight } = descriptionRef.current;
            if (scrollHeight > clientHeight || expanded) {
                setShowReadMore(true);
            }
        }
    }, [description, expanded]);

    return (
        <div id={id} className={cn(
            "group relative flex flex-col gap-3 p-3 w-full cursor-pointer",
            "rounded-lg",
            isHighlighted ? "bg-gray-200" : "bg-color-surface-neutral-default hover:bg-color-surface-neutral-subtle_bg",
            isSelected ? "border-2 border-color-border-neutral-strong" : "border border-color-border-neutral-default",
            "transition-colors duration-1000",
            className
        )}
            onClick={onClick}
        >
            <div className="flex flex-col gap-1">
                {/* Title and section */}
                <div className="flex flex-col gap-[6px] pr-8">
                    <h3 className="p-1 text-color-text-neutral-default text-style-body-default-regular line-clamp-1">
                        {title}
                    </h3>
                    <span className="p-1 text-color-text-neutral-tertiary text-style-label-default-regular">
                        {section}
                    </span>
                </div>

                {/* Description */}
                <p
                    ref={descriptionRef}
                    className={`p-1 text-style-textblock-secondary-subtext-regular text-color-color-text-neutral-default ${!expanded && "line-clamp-3"}`}>
                    {description}
                </p>
            </div>

            {/* Read more */}
            <div className="flex items-center gap-2">
                {showReadMore && (
                    <Label
                        colorScheme="neutral"
                        size="small"
                        className="cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            setExpanded(!expanded);
                        }}

                    >
                        <span className="flex items-center gap-[6px]">
                            {expanded ? "Show less" : "Read more"}
                            <Icon name="arrow-down-c" className={cn("h-[13px] w-[13px] transition-transform duration-200 bg-transparent text-label-color-neutral-text", expanded && "rotate-180")} />
                        </span>
                    </Label>
                )}
                <Label
                    colorScheme="primary"
                    size="small"
                    className="cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails?.();
                    }}
                >
                    View Details
                </Label>
            </div>


            <div className={cn("absolute top-3 right-3 transition-opacity duration-200", open ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <IconButton size="medium" icon="add" className="flex items-center justify-center w-8 h-8 bg-color-surface-neutral-default border border-color-border-neutral-default rounded-lg hover:bg-color-surface-neutral-subtle_bg shadow-sm transition-colors" variant={'neutral'} />
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
