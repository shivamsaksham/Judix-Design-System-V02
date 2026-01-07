"use client";

import * as React from "react";
import { Icon } from "judix-icon";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Dropdown } from "../ui/dropdown";

export interface ContextActionMenuProps {
    isAdded?: boolean;
    isBookmarked?: boolean;
    isMentioned?: boolean;
    onAdd?: () => void;
    onBookmark?: () => void;
    onMention?: () => void;
    className?: string;
}

export function ContextActionMenu({
    isAdded = false,
    isBookmarked = false,
    isMentioned = false,
    onAdd,
    onBookmark,
    onMention,
    className
}: ContextActionMenuProps) {
    const handleAdd = () => onAdd?.();
    const handleBookmark = () => onBookmark?.();
    const handleMention = () => onMention?.();

    const options = [
        {
            title: "Add to context",
            value: "add",
            trailingAccessory: isAdded ? (
                <Badge variant="secondary" className="h-5 px-1 text-xs font-normal bg-label-color-primary-selected text-label-color-primary-selectedtext border-label-color-primary-stroke">
                    Added
                </Badge>
            ) : undefined
        },
        {
            title: isBookmarked ? "Bookmarked" : "Bookmark",
            value: "bookmark",
            trailingAccessory: isBookmarked ? (
                <Icon name="Save2" className="w-4 h-4 text-color-icon-primary-default fill-current" />
            ) : undefined
        },
        {
            title: "Mention in query",
            value: "mention",
            trailingAccessory: isMentioned ? (
                <Icon name="TickCircle" className="w-4 h-4 text-color-icon-primary-default" />
            ) : undefined
        }
    ];

    const dropdownValue = isBookmarked ? "bookmark" : null;

    return (
        <div className={cn(
            "flex flex-col w-[200px] bg-dropdown-color-bg rounded-xl border border-dropdown-color-stroke overflow-hidden",
            className
        )}>
            <Dropdown
                options={options}
                value={dropdownValue}
                onChange={(val: string) => {
                    if (val === "add") handleAdd();
                    if (val === "bookmark") handleBookmark();
                    if (val === "mention") handleMention();
                }}
                searchbar="off"
                className="w-full border-none shadow-none items-center"
            />
        </div>
    );
}
