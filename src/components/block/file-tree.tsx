"use client";

import * as React from "react";
import { Icon } from "judix-icon";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

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
    onSelect?: (node: FileItem) => void;
    onToggle?: (node: FolderItem) => void;
}

const FileTreeNode = ({
    node,
    level = 0,
    activeId,
    onSelect,
    onToggle,
}: FileTreeNodeProps) => {
    const [isOpen, setIsOpen] = React.useState<boolean>(
        node.type === "folder" ? !!node.isOpen : false
    );

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (node.type === "folder") {
            setIsOpen(!isOpen);
            onToggle?.(node);
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
            return "Folder" as any;
        }
        switch (node.fileType) {
            case "chat":
                return "Message";
            case "note":
                return "Note";
            case "archive":
                return "Save2";
            default:
                return "Document";
        }
    };

    const isActive = activeId === node.id;

    return (
        <div className="select-none">
            <div
                className={cn(
                    "group flex items-center gap-2 py-1.5 px-2 rounded-lg cursor-pointer transition-colors duration-200",
                    isActive
                        ? "bg-color-surface-primary-subtle_bg text-color-text-neutral-default"
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
                        <Icon name={(isOpen ? "DocumentText" : "DocumentCopy")} className="w-4 h-4" />
                    ) : (
                        <Icon name={getIcon()} className="w-4 h-4" />
                    )}
                </div>

                <span
                    className={cn(
                        "truncate text-style-body-default-regular flex-1 min-w-0"
                    )}
                    title={node.name}
                >
                    {node.name}
                </span>
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
                                    onSelect={onSelect}
                                    onToggle={onToggle}
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
    onSelect?: (node: FileItem) => void;
    className?: string;
}

export function FileTree({ data, activeId, onSelect, className }: FileTreeProps) {
    return (
        <div className={cn("flex flex-col w-full h-full overflow-y-auto custom-scrollbar min-w-0 overflow-x-hidden", className)}>
            {data.map((node) => (
                <FileTreeNode
                    key={node.id}
                    node={node}
                    activeId={activeId}
                    onSelect={onSelect}
                />
            ))}
        </div>
    );
}
