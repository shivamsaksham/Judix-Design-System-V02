"use client";

import * as React from "react";
import { Icon } from "judix-icon";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ContextActionMenu } from "./context-action-menu";
import { IconButton } from "../ui";

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
        <div className={cn(
            "group relative flex flex-col gap-3 p-3 w-full",
            "border border-color-border-neutral-default rounded-lg",
            "bg-color-surface-neutral-default hover:bg-color-surface-neutral-subtle_bg",
            "transition-colors duration-200",
            className
        )}>

            <div className="flex flex-col gap-1 pr-8">
                <h3 className="text-color-text-neutral-default text-style-body-default-regular line-clamp-1">
                    {title}
                </h3>
                <span className="text-color-text-neutral-tertiary text-style-label-default-regular">
                    {section}
                </span>
            </div>


            <p
                ref={descriptionRef}
                className={cn(
                    "text-style-textblock-primary-subtext-regular text-color-color-text-neutral-default",
                    !expanded && "line-clamp-3"
                )}>
                {description}
            </p>


            <div className="flex items-center gap-2">
                {showReadMore && (
                    <Label
                        colorScheme="neutral"
                        size="small"
                        className="cursor-pointer"
                        onClick={() => setExpanded(!expanded)}
                    >
                        <span className="flex items-center gap-1">
                            {expanded ? "Show less" : "Read more"}
                            <Icon name="ArrowDown" className={cn("w-3 h-3 transition-transform duration-200 bg-transparent", expanded && "rotate-180")} />
                        </span>
                    </Label>
                )}
                <Label
                    colorScheme="primary"
                    size="small"
                    className="cursor-pointer"
                    onClick={onViewDetails}
                >
                    View Details
                </Label>
            </div>


            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <button className="flex items-center justify-center w-8 h-8 bg-color-surface-neutral-default border border-color-border-neutral-default rounded-lg hover:bg-color-surface-neutral-subtle_bg shadow-sm transition-colors text-color-icon-neutral-default">
                            <IconButton size="medium" icon="Add" className="bg-transparent" variant={'neutral'} />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="p-0 border-none shadow-none bg-transparent w-auto">
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
