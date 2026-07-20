"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { ContextActionMenu } from "./context-action-menu";
import { IconButton } from "../ui";
import { useOutsideInteraction } from "@/hooks/use-outside-interaction";

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
    isHighlighted?: boolean;
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
    isHighlighted,
    id,
    className
}: JudgementTileProps) {
    const [open, setOpen] = React.useState(false);
    const menuRef = React.useRef<HTMLDivElement>(null);
    const triggerRef = React.useRef<HTMLButtonElement>(null);

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
            "group relative flex flex-col gap-1 p-3 w-full cursor-pointer",
            "rounded-lg",
            isHighlighted ? "bg-gray-200" : "bg-color-surface-neutral-default hover:bg-color-surface-neutral-subtle_bg",
            isSelected ? "border-2 border-color-border-neutral-strong" : "border border-color-border-neutral-default",
            "transition-colors duration-1000",
            open && "z-20",
            className
        )}
            onClick={handleTileClick}
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
                <div className={cn(
                    "absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t to-transparent pointer-events-none transition-colors duration-1000",
                    isHighlighted 
                        ? "from-gray-200" 
                        : "from-color-surface-neutral-default group-hover:from-color-surface-neutral-subtle_bg"
                )} />
            </div>

            <div className="flex items-center justify-between mt-2">
                <span className="p-1 text-color-text-neutral-secondary text-style-label-default-regular">
                    Cited {citationCount} {citationCount === 1 ? 'time' : 'times'}
                </span>
                <span className="p-1 text-color-text-neutral-secondary text-style-label-default-regular">
                    {court}
                </span>
            </div>

            {/* These two share one corner and swap on hover (bookmark visible
                by default, fades to reveal "+" on hover). Below md there's
                no hover, and the "+" button now stays visible always (see
                below) — so the bookmark stays hidden there too, instead of
                the two icons stacking on top of each other. */}
            {isBookmarked && (
                <div className={cn("absolute top-3 right-3 flex items-center justify-center w-8 h-8 pointer-events-none transition-opacity duration-200", open ? "opacity-0" : "opacity-0 md:opacity-100 md:group-hover:opacity-0")}>
                    <IconButton size="medium" icon="save-b" variant="neutral" className="border-none bg-transparent shadow-none hover:bg-transparent" iconClassName="fill-color-icon-primary-default text-color-icon-primary-default" />
                </div>
            )}
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