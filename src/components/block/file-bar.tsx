"use client";

import React, { useState } from "react";
import { FileTree, FileTreeNodeType, FileItem } from "@/components/block/file-tree";
import { IconButton } from "@/components/ui/icon-button";
import { Button } from "@/components/ui/button";
import { Dropdown } from "@/components/ui/dropdown";
import { useFloating, offset, flip, shift, autoUpdate, useDismiss, useInteractions } from "@floating-ui/react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export interface FileBarProps {
    data: FileTreeNodeType[];
    activeId?: string;
    onSelect?: (node: FileItem) => void;
    className?: string;
    onCreateNew?: (type: "chat" | "note") => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

export function FileBar({
    data,
    activeId,
    onSelect,
    className,
    onCreateNew,
    onEdit,
    onDelete,
}: FileBarProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const { refs, floatingStyles, context } = useFloating({
        placement: "bottom-start",
        open: isDropdownOpen,
        onOpenChange: setIsDropdownOpen,
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(4),
            flip({ padding: 8 }),
            shift({ padding: 8 }),
        ],
    });

    const dismiss = useDismiss(context);
    const { getReferenceProps, getFloatingProps } = useInteractions([dismiss]);

    const handleCreateOption = (val: string) => {
        if (val === "chat" || val === "note") {
            onCreateNew?.(val);
            setIsDropdownOpen(false);
        }
    };

    const createOptions = [
        { value: "chat", title: "Chat" },
        { value: "note", title: "Note file" },
    ];

    return (
        <div className={cn("flex flex-col w-full h-full bg-color-surface-neutral-default", className)}>
            <div className="flex items-center justify-between px-3 py-2 border-b border-color-border-neutral-default shrink-0">
                <span className="text-style-body-title-regular text-color-text-neutral-default">
                    My Files
                </span>
                <div className="flex items-center gap-1">
                    <Button
                        ref={refs.setReference}
                        {...getReferenceProps()}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        variant="neutral"
                        size="extraSmall"
                        suffixIcon="ArrowDown"
                        className="h-8"
                    >
                        Create new
                    </Button>

                    <IconButton
                        icon="Edit2"
                        size="medium"
                        variant="neutral"
                        onClick={onEdit}
                        className="hover:bg-color-surface-neutral-subtle_bg"
                    />
                    <IconButton
                        icon="Trash"
                        size="medium"
                        variant="neutral"
                        onClick={onDelete}
                        className="hover:bg-color-surface-neutral-subtle_bg"
                    />
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <FileTree
                    data={data}
                    activeId={activeId}
                    onSelect={onSelect}
                    className="p-2"
                />
            </div>

            {isDropdownOpen && createPortal(
                <div
                    ref={refs.setFloating}
                    style={floatingStyles}
                    {...getFloatingProps()}
                    className="z-50"
                >
                    <Dropdown
                        options={createOptions}
                        value={null}
                        onChange={handleCreateOption}
                        searchbar="off"
                        className="w-[153px]"
                    />
                </div>,
                document.body
            )}
        </div>
    );
}
