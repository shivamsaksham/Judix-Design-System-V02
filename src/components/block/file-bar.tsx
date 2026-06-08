"use client";

import React, { useState } from "react";
import { FileTree, FileTreeNodeType} from "@/components/block/file-tree";
import { IconButton } from "@/components/ui/icon-button";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Icon } from "@judix/icon";
import { Dropdown } from "@/components/ui/dropdown";
import { useFloating, offset, flip, shift, autoUpdate, useDismiss, useInteractions } from "@floating-ui/react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { TextInput } from "@/components/ui/text-input";

export interface FileBarProps {
    data: FileTreeNodeType[];
    activeId?: string;
    activeIds?: string[];
    editingId?: string | null;
    editDisabled?: boolean;
    onSelect?: (node: FileTreeNodeType) => void;
    className?: string;
    onCreateNew?: (type: "project" | "chat" | "note") => void;
    onEdit?: () => void;
    onDelete?: () => void;
    onToggle?: (node: FileTreeNodeType) => void;
    onRename?: (nodeId: string, newName: string) => void;
    onCancelEdit?: () => void;
    onCreateNewDirect?: () => void;
    onLongSelect?: (node: FileTreeNodeType) => void;
}

export function FileBar({
    data,
    activeId,
    activeIds,
    editingId,
    editDisabled,
    onSelect,
    className,
    onCreateNew,
    onEdit,
    onDelete,
    onToggle,
    onRename,
    onCancelEdit,
    onCreateNewDirect,
    onLongSelect,
}: FileBarProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

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
        if (val === "project" || val === "chat" || val === "note") {
            onCreateNew?.(val as "project" | "chat" | "note");
            setIsDropdownOpen(false);
        }
    };

    const createOptions = [
        { value: "project", title: "Project" },
        { value: "chat", title: "Chat" },
        { value: "note", title: "Note file" },
    ];

    return (
        <div className={cn("flex flex-col w-full h-full bg-color-surface-neutral-default", className)}>
            <div className="flex items-center justify-between py-3 shrink-0">
                <span className="p-1 text-style-body-title-regular text-color-text-neutral-default">
                    My Files
                </span>
                <div className="flex items-center gap-1">
                    <Label
                        ref={refs.setReference}
                        {...getReferenceProps()}
                        onClick={() => {
                            if (onCreateNewDirect) {
                                onCreateNewDirect();
                            } else if (activeId) {
                                setIsDropdownOpen(!isDropdownOpen);
                            }
                        }}
                        colorScheme="neutral"
                        size="medium"
                        className={cn("cursor-pointer select-none", !activeId && !onCreateNewDirect && "opacity-50 pointer-events-none")}
                    >
                        <span className="flex items-center gap-[6px] whitespace-nowrap">
                            Create new
                            {!onCreateNewDirect && <Icon name="arrow-down-c" className="w-3 h-3 text-color-icon-neutral-secondary shrink-0" />}
                        </span>
                    </Label>

                    <IconButton
                        icon="edit-a"
                        size="medium"
                        variant="neutral"
                        onClick={onEdit}
                        className="hover:bg-color-surface-neutral-subtle_bg"
                        disabled={!activeId || editDisabled}
                    />
                    <IconButton
                        icon="trash"
                        size="medium"
                        variant="neutral"
                        onClick={onDelete}
                        className="hover:bg-color-surface-neutral-subtle_bg"
                        disabled={!activeId}
                    />
                </div>
            </div>
                <TextInput
                    inputSize="small"
                    placeholder="Search in here"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-color-surface-neutral-default mt-2 h-[42px] mb-3"
                />

            <div className="flex-1 min-h-0">
                <FileTree
                    data={data}
                    activeId={activeId}
                    activeIds={activeIds}
                    editingId={editingId}
                    onSelect={onSelect}
                    onLongSelect={onLongSelect}
                    onToggle={onToggle}
                    onRename={onRename}
                    onCancelEdit={onCancelEdit}
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
