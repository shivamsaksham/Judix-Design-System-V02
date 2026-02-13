"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { IconButton } from "../ui";

export type FileType = "chat" | "note" | "archive";

export interface FileItem {
    id: string;
    name: string;
    type: "file";
    fileType: FileType;
}

export interface FolderItem {
    id: string;
    name: string;
    type: "folder";
    children: (FolderItem | FileItem)[];
    isOpen?: boolean;
}

export type FileTreeNodeType = FolderItem | FileItem;

interface FileTreeNodeProps {
    node: FileTreeNodeType;
    level?: number;
    activeId?: string;
    activeIds?: string[];
    editingId?: string | null;
    onSelect?: (node: FileTreeNodeType) => void;
    onToggle?: (node: FolderItem) => void;
    onRename?: (nodeId: string, newName: string) => void;
    onCancelEdit?: () => void;
}

const hasActiveDescendant = (
    node: FileTreeNodeType,
    activeId?: string,
    activeIds?: string[]
): boolean => {
    if (node.type !== "folder") return false;

    return node.children.some(child => {
        const isChildActive = child.id === activeId || activeIds?.includes(child.id);
        if (isChildActive) return true;
        if (child.type === "folder") {
            return hasActiveDescendant(child, activeId, activeIds);
        }
        return false;
    });
};

const FileTreeNode = ({
    node,
    level = 0,
    activeId,
    activeIds,
    editingId,
    onSelect,
    onToggle,
    onRename,
    onCancelEdit,
}: FileTreeNodeProps) => {
    const [isOpen, setIsOpen] = React.useState<boolean>(
        node.type === "folder" ? !!node.isOpen : false
    );
    const [editValue, setEditValue] = React.useState(node.name);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const isEditing = editingId === node.id;

    const nodeIsOpen = node.type === "folder" ? node.isOpen : undefined;
    const nodeType = node.type;

    React.useEffect(() => {
        if (nodeType === "folder" && nodeIsOpen !== undefined) {
            setIsOpen(nodeIsOpen);
        }
    }, [nodeIsOpen, nodeType]);

    React.useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    React.useEffect(() => {
        setEditValue(node.name);
    }, [node.name]);

    const handleRenameSubmit = () => {
        if (editValue.trim() && editValue !== node.name) {
            onRename?.(node.id, editValue.trim());
        } else {
            onCancelEdit?.();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleRenameSubmit();
        } else if (e.key === 'Escape') {
            setEditValue(node.name);
            onCancelEdit?.();
        }
    };

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (node.type === "folder") {
            setIsOpen(!isOpen);
            onToggle?.(node as FolderItem);
            // Only select top-level folders (Project roots)
            if (level === 0) {
                onSelect?.(node);
            }
        }
    };

    const handleSelect = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (node.type === "file") {
            onSelect?.(node);
        }
    };

    const getIcon = () => {
        if (node.type === "folder") {
            return "folder-a";
        }
        switch (node.fileType) {
            case "chat":
                return "message-a";
            case "note":
                return "note-a";
            case "archive":
                return "save-b";
            default:
                return "document-a";
        }
    };

    const isActive = React.useMemo(() => {
        const isSelfActive = activeId === node.id || activeIds?.includes(node.id);
        if (isSelfActive) return true;

        // For folders at any level, check if they have an active descendant
        if (node.type === "folder") {
            // Only Level 0 folders (Roots) should highlight for active descendants
            if (level > 0) return false;
            return hasActiveDescendant(node, activeId, activeIds);
        }
        return false;
    }, [activeId, activeIds, node, level]);

    return (
        <div className="select-none">
            <div
                className={cn(
                    "group flex items-center gap-2 py-1.5 px-2 rounded-lg cursor-pointer transition-colors duration-200",
                    isActive
                        ? node.type === "folder"
                            ? "bg-color-surface-neutral-subtle_bg text-color-text-neutral-default"
                            : "bg-color-surface-primary-subtle_bg text-color-text-neutral-default"
                        : "text-color-text-neutral-default hover:bg-color-surface-neutral-subtle_bg",
                    "w-full"
                )}
                onClick={node.type === "folder" ? handleToggle : handleSelect}
            >
                <div className={cn(
                    "flex items-center justify-center w-5 h-5 shrink-0 transition-transform duration-200",
                    isActive
                        ? "text-color-icon-neutral-default"
                        : node.type === "folder"
                            ? "text-color-icon-neutral-tertiary"
                            : "text-color-icon-neutral-default"
                )}>
                    {node.type === "folder" ? (
                        <IconButton icon={(isOpen ? "folder-open" : "folder-a")} variant={'neutral'} size={'medium'} boundary={'none'} className="bg-transparent" />
                    ) : (
                        <IconButton icon={getIcon()} variant={'neutral'} size={'medium'} boundary={'none'} className="bg-transparent" />
                    )}
                </div>

                {isEditing ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleRenameSubmit}
                        onKeyDown={handleKeyDown}
                        className="truncate text-style-body-default-regular flex-1 min-w-0 bg-color-surface-neutral-default border border-color-border-primary-default rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-color-border-primary-default"
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <span
                        className={cn(
                            "truncate text-style-body-default-regular flex-1 min-w-0"
                        )}
                        title={node.name}
                    >
                        {node.name}
                    </span>
                )}
            </div>

            <AnimatePresence initial={false}>
                {node.type === "folder" && isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="flex flex-col ml-[11px] pl-2 border-l border-color-border-neutral-default">
                            {node.children.map((child) => (
                                <FileTreeNode
                                    key={child.id}
                                    node={child}
                                    level={level + 1}
                                    activeId={activeId}
                                    activeIds={activeIds}
                                    editingId={editingId}
                                    onSelect={onSelect}
                                    onToggle={onToggle}
                                    onRename={onRename}
                                    onCancelEdit={onCancelEdit}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export interface FileTreeProps {
    data: FileTreeNodeType[];
    activeId?: string;
    activeIds?: string[];
    editingId?: string | null;
    onSelect?: (node: FileTreeNodeType) => void;
    onToggle?: (node: FolderItem) => void;
    onRename?: (nodeId: string, newName: string) => void;
    onCancelEdit?: () => void;
    className?: string;
}

export function FileTree({ data, activeId, activeIds, editingId, onSelect, onToggle, onRename, onCancelEdit, className }: FileTreeProps) {
    return (
        <div className={cn("flex flex-col w-full h-full overflow-y-auto custom-scrollbar min-w-0 overflow-x-hidden", className)}>
            {data.map((node) => (
                <FileTreeNode
                    key={node.id}
                    node={node}
                    activeId={activeId}
                    activeIds={activeIds}
                    editingId={editingId}
                    onSelect={onSelect}
                    onToggle={onToggle}
                    onRename={onRename}
                    onCancelEdit={onCancelEdit}
                />
            ))}
        </div>
    );
}
