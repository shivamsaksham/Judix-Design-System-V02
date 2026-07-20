"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { ContextActionMenu } from "./context-action-menu";
import { IconButton } from "../ui";
import { Icon } from "@judix/icon";
import { useOutsideInteraction } from "@/hooks/use-outside-interaction";

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
    /** Central vs state jurisdiction — absent when the act didn't resolve against central-acts. */
    category?: 'central' | 'state';
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
    const menuRef = React.useRef<HTMLDivElement>(null);
    const triggerRef = React.useRef<HTMLButtonElement>(null);
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

    // Stamped on every open->closed transition of this tile's own menu
    // (item selection, outside interaction, or the trigger button) — used
    // to suppress a stray root-click retargeted here after the popover
    // unmounts mid-tap on real touch devices (see handleTileClick below).
    const lastMenuCloseAtRef = React.useRef(0);
    const closeMenu = React.useCallback(() => {
        lastMenuCloseAtRef.current = Date.now();
        setOpen(false);
    }, []);

    useOutsideInteraction([menuRef, triggerRef], closeMenu, open);

    // On real touch devices, preventDefault() on the menu item's own
    // pointerdown doesn't reliably suppress the browser's trailing
    // compatibility click — that later, separate click gets retargeted by
    // screen coordinates to whatever's now under the (already-unmounted)
    // popover, i.e. this div. A timing-tolerant guard is the only fix that
    // works regardless of which exact compat-event cascade a given mobile
    // engine produces.
    const SUPPRESS_ROOT_CLICK_MS = 400;
    const handleTileClick = React.useCallback(() => {
        if (Date.now() - lastMenuCloseAtRef.current < SUPPRESS_ROOT_CLICK_MS) return;
        onClick?.();
    }, [onClick]);

    return (
        <div id={id} className={cn(
            "group relative flex flex-col gap-3 p-3 w-full cursor-pointer",
            "rounded-lg",
            isHighlighted ? "bg-gray-200" : "bg-color-surface-neutral-default hover:bg-color-surface-neutral-subtle_bg",
            isSelected ? "border-2 border-color-border-neutral-strong" : "border border-color-border-neutral-default",
            "transition-colors duration-1000",
            open && "z-20",
            className
        )}
            onClick={handleTileClick}
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


            {/* Hover-to-reveal only makes sense with a mouse — on touch
                devices (below md) the button just stays visible instead of
                requiring a hover state that doesn't really exist there. */}
            <div className={cn("absolute top-3 right-3 transition-opacity duration-200", open ? "opacity-100" : "opacity-100 md:opacity-0 md:group-hover:opacity-100")}>
                <IconButton
                    ref={triggerRef}
                    size="medium"
                    icon="add"
                    className="flex items-center justify-center w-8 h-8 bg-color-surface-neutral-default border border-color-border-neutral-default rounded-lg hover:bg-color-surface-neutral-subtle_bg shadow-sm transition-colors"
                    variant={'neutral'}
                    onClick={(e) => { e.stopPropagation(); setOpen((o) => { if (o) lastMenuCloseAtRef.current = Date.now(); return !o; }); }}
                />
                {open && (
                    <div ref={menuRef} className="absolute right-0 top-full mt-2" onClick={(e) => e.stopPropagation()}>
                        <ContextActionMenu
                            isAdded={isAdded}
                            isBookmarked={isBookmarked}
                            isMentioned={isMentioned}
                            onAdd={() => { onAdd?.(); closeMenu(); }}
                            onBookmark={() => { onBookmark?.(); closeMenu(); }}
                            onMention={() => { onMention?.(); closeMenu(); }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
