"use client";

import * as React from "react";
import { Icon } from "judix-icon";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ContextActionMenu } from "./context-action-menu";

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
                <h3 className="text-color-text-neutral-default text-style-body-default-regular line-clamp-1 text-sm">
                    {title}
                </h3>
                <span className="text-color-text-neutral-tertiary text-style-label-default-regular text-xs">
                    {section}
                </span>
            </div>


            <p
                ref={descriptionRef}
                className={cn(
                    "text-color-text-neutral-default text-sm",
                    !expanded && "line-clamp-3"
                )}>
                {description}
            </p>


            <div className="flex items-center gap-2">
                {showReadMore && (
                    <Button
                        variant="neutral"
                        size="extraSmall"
                        className="h-6 px-2 bg-label-color-neutral-bg hover:bg-color-surface-neutral-hover_default font-medium"
                        onClick={() => setExpanded(!expanded)}
                        suffixIcon="ArrowDown"
                        iconClassName={cn("transition-transform duration-200", expanded && "rotate-180")}
                    >
                        {expanded ? "Show less" : "Read more"}
                    </Button>
                )}

                <Button
                    variant="primary"
                    size="extraSmall"
                    className="h-6 px-2 bg-label-color-primary-bg border text-label-color-primary-text"
                    onClick={onViewDetails}
                >
                    View Details
                </Button>
            </div>


            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <button className="flex items-center justify-center w-8 h-8 bg-color-surface-neutral-default border border-color-border-neutral-default rounded-lg hover:bg-color-surface-neutral-subtle_bg shadow-sm transition-colors text-color-icon-neutral-default">
                            <Icon name="Add" className="w-5 h-5" />
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
