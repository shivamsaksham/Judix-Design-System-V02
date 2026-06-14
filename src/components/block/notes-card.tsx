"use client";

import * as React from "react";
import { Icon } from "@judix/icon";
import { Editor } from '@tiptap/react';
import { cn } from "@/lib/utils";
import { CardHeader, CardTitle, CardContent } from "../ui/card";
import { IconButton } from "../ui/icon-button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Dropdown, DropdownOption } from "@/components/ui/dropdown";
import { LinkDialog } from "./link-dialog";
import { TextEditor } from "../ui/text-editor";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import Confirmation from "./confirmation";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "../ui/tooltip";
import { FileTree, FileTreeNodeType, FolderItem } from "./file-tree";

const DEFAULT_FILE_TREE: FileTreeNodeType[] = [];



function toggleNodeRecursive(nodes: FileTreeNodeType[], targetId: string): FileTreeNodeType[] {
    return nodes.map((node) => {
        if (node.id === targetId && node.type === "folder") {
            return { ...node, isOpen: !node.isOpen } as FileTreeNodeType;
        }
        if (node.type === "folder" && node.children) {
            return { ...node, children: toggleNodeRecursive(node.children, targetId) } as FileTreeNodeType;
        }
        return node;
    });
}


export interface NotesCardProps extends React.HTMLAttributes<HTMLDivElement> {
    defaultExpanded?: boolean;
    defaultEnlarged?: boolean;
    title?: string;
    children?: React.ReactNode;
    onExpandChange?: (expanded: boolean) => void;
    onMaximize?: () => void;
    onOpenInNewTab?: () => void;
    onSend?: (isOpen: boolean) => void;
    onShare?: (editor: Editor | null, title: string) => void;
    onSave?: (content: string) => void;
    onCancel?: () => void;
    onAddFile?: (projectId: string, noteName: string) => void;
    onEditFile?: () => void;
    onDeleteFile?: () => void;
    onImageUpload?: (file: File, editor: Editor | null) => void;
    fileTree?: FileTreeNodeType[];
    onFileSelect?: (node: FileTreeNodeType) => void;
    activeFileId?: string | null;
    content?: string;
    variant?: 'floating' | 'embedded' | 'drawer';
    showSidebar?: boolean;
    onFolderToggle?: (node: FileTreeNodeType) => void;
}

export function NotesCard({
    className,
    defaultExpanded = false,
    defaultEnlarged = false,
    title = "Notes",
    children,
    onExpandChange,
    // onMaximize,
    onOpenInNewTab,
    onSend,
    onShare,
    onSave,
    onCancel,
    onAddFile,
    onEditFile,
    onDeleteFile,
    onImageUpload,
    fileTree = DEFAULT_FILE_TREE,

    onFileSelect,
    activeFileId: propActiveFileId,
    content: propContent,
    variant = 'floating',
    showSidebar = true,
    onFolderToggle,
}: NotesCardProps) {
    const isEmbedded = variant === 'embedded';
    const isDrawer = variant === 'drawer';
    const isFullView = isEmbedded || isDrawer;
    const [isExpanded, setIsExpanded] = React.useState(isFullView ? true : defaultExpanded);
    const [isEnlargeOpen, setIsEnlargeOpen] = React.useState(isFullView ? false : defaultEnlarged);
    const [activeFileId, setActiveFileId] = React.useState<string | undefined>(propActiveFileId || undefined);
    const [editor, setEditor] = React.useState<Editor | null>(null);
    const [noteContent, setNoteContent] = React.useState(propContent || "");
    const [fileTreeData, setFileTreeData] = React.useState<FileTreeNodeType[]>(fileTree);
    const [expandedFolderIds, setExpandedFolderIds] = React.useState<Set<string>>(() => {
        const initial = new Set<string>();
        const findOpen = (nodes: FileTreeNodeType[]) => {
            nodes.forEach(n => {
                if (n.type === 'folder' && n.isOpen) {
                    initial.add(n.id);
                }
                if (n.type === 'folder' && n.children) {
                    findOpen(n.children);
                }
            });
        };
        findOpen(fileTree);
        return initial;
    });

    React.useEffect(() => {
        const findOpen = (nodes: FileTreeNodeType[]) => {
            nodes.forEach(n => {
                if (n.type === 'folder' && n.isOpen) {
                    setExpandedFolderIds(prev => {
                        if (prev.has(n.id)) return prev;
                        const next = new Set(prev);
                        next.add(n.id);
                        return next;
                    });
                }
                if (n.type === 'folder' && n.children) {
                    findOpen(n.children);
                }
            });
        };
        findOpen(fileTree);
    }, [fileTree]);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [editingId, setEditingId] = React.useState<string | null>(null);

    const getProjectFolderOfActiveFile = React.useCallback((fileId: string | null | undefined): string | null => {
        if (!fileId) return null;
        for (const root of fileTreeData) {
            if (root.id === fileId) {
                return root.id;
            }
            if (root.type === "folder" && root.children && root.children.some((child: FileTreeNodeType) => child.id === fileId)) {
                return root.id;
            }
        }
        return null;
    }, [fileTreeData]);

    const handleAddNoteClick = () => {
        if (editingId === "temp-new-note") return;

        const targetFolderId = getProjectFolderOfActiveFile(activeFileId);
        if (!targetFolderId) return;

        setFileTreeData(prevTree => prevTree.map(root => {
            if (root.id === targetFolderId && root.type === "folder") {
                const children = root.children || [];
                if (children.some((c: FileTreeNodeType) => c.id === "temp-new-note")) return root;
                return {
                    ...root,
                    isOpen: true,
                    children: [...children, {
                        id: "temp-new-note",
                        name: "",
                        type: "file" as const,
                        fileType: "note" as const
                    }]
                };
            }
            return root;
        }));

        setEditingId("temp-new-note");
        setActiveFileId("temp-new-note");
    };

    const handleRenameFile = (nodeId: string, newName: string) => {
        if (nodeId === "temp-new-note") {
            const targetFolderId = getProjectFolderOfActiveFile("temp-new-note") || getProjectFolderOfActiveFile(activeFileId);
            setFileTreeData(prevTree => prevTree.map(root => {
                if (root.id === targetFolderId && root.type === "folder") {
                    return {
                        ...root,
                        children: (root.children || []).filter((c: FileTreeNodeType) => c.id !== "temp-new-note")
                    };
                }
                return root;
            }));
            setEditingId(null);

            if (targetFolderId && newName.trim()) {
                onAddFile?.(targetFolderId, newName.trim());
            }
        }
    };

    const handleCancelEdit = () => {
        if (editingId === "temp-new-note") {
            const targetFolderId = getProjectFolderOfActiveFile("temp-new-note") || getProjectFolderOfActiveFile(activeFileId);
            setFileTreeData(prevTree => prevTree.map(root => {
                if (root.id === targetFolderId && root.type === "folder") {
                    return {
                        ...root,
                        children: (root.children || []).filter((c: FileTreeNodeType) => c.id !== "temp-new-note")
                    };
                }
                return root;
            }));
            setActiveFileId(targetFolderId || undefined);
        }
        setEditingId(null);
    };

    React.useEffect(() => {
        const applyExpansionAndMergeTemp = (nodes: FileTreeNodeType[], targetFolderId: string | null): FileTreeNodeType[] => {
            return nodes.map(n => {
                if (n.type === 'folder') {
                    let children = n.children ? applyExpansionAndMergeTemp(n.children, targetFolderId) : [];
                    let isOpen = expandedFolderIds.has(n.id) || !!n.isOpen;
                    
                    if (editingId === "temp-new-note" && n.id === targetFolderId) {
                        isOpen = true;
                        if (!children.some(c => c.id === "temp-new-note")) {
                            children = [...children, {
                                id: "temp-new-note",
                                name: "",
                                type: "file" as const,
                                fileType: "note" as const
                            }];
                        }
                    }

                    return {
                        ...n,
                        isOpen,
                        children
                    };
                }
                return n;
            });
        };

        let targetFolderId: string | null = null;
        if (editingId === "temp-new-note") {
            for (const root of fileTreeData) {
                if (root.id === "temp-new-note") {
                    targetFolderId = root.id;
                    break;
                }
                if (root.type === "folder" && root.children && root.children.some((child: FileTreeNodeType) => child.id === "temp-new-note")) {
                    targetFolderId = root.id;
                    break;
                }
            }
            if (!targetFolderId) {
                for (const root of fileTreeData) {
                    if (root.id === activeFileId) {
                        targetFolderId = root.id;
                        break;
                    }
                    if (root.type === "folder" && root.children && root.children.some((child: FileTreeNodeType) => child.id === activeFileId)) {
                        targetFolderId = root.id;
                        break;
                    }
                }
            }
        }

        setFileTreeData(applyExpansionAndMergeTemp(fileTree, targetFolderId));
    }, [fileTree, editingId, expandedFolderIds]);

    React.useEffect(() => {
        if (propActiveFileId !== undefined) {
            setActiveFileId(propActiveFileId || undefined);
            if (editingId === "temp-new-note" && propActiveFileId !== "temp-new-note") {
                setEditingId(null);
            }
        }
    }, [propActiveFileId]);

    React.useEffect(() => {
        if (propContent !== undefined) {
            setNoteContent(propContent);
            if (editor && editor.getHTML() !== propContent) {
                editor.commands.setContent(propContent);
            }
        }
    }, [propContent, editor, propActiveFileId]);

    const handleFileTreeToggle = (toggledNode: FolderItem) => {
        onFolderToggle?.(toggledNode);
        const isRoot = fileTreeData.some(f => f.id === toggledNode.id);

        setExpandedFolderIds(prev => {
            const next = new Set(prev);
            const wasOpen = next.has(toggledNode.id);

            if (isRoot) {
                if (wasOpen) {
                    next.delete(toggledNode.id);
                } else {
                    fileTreeData.forEach(f => {
                        if (f.type === 'folder') next.delete(f.id);
                    });
                    next.add(toggledNode.id);
                }
            } else {
                if (wasOpen) {
                    next.delete(toggledNode.id);
                } else {
                    next.add(toggledNode.id);
                }
            }
            return next;
        });

        if (isRoot) {
            setFileTreeData(fileTreeData.map(f => {
                if (f.id === toggledNode.id && f.type === "folder") {
                    return { ...f, isOpen: !f.isOpen } as FileTreeNodeType;
                }
                if (f.type === "folder") {
                    return { ...f, isOpen: false } as FileTreeNodeType;
                }
                return f;
            }));
        } else {
            setFileTreeData(toggleNodeRecursive(fileTreeData, toggledNode.id));
        }
    };

    const activeNodeType = React.useMemo(() => {
        if (!activeFileId) return null;
        let foundType: 'folder' | 'file' | null = null;
        
        const findNode = (nodes: FileTreeNodeType[]) => {
            for (const node of nodes) {
                if (node.id === activeFileId) {
                    foundType = node.type;
                    return;
                }
                if (node.type === 'folder' && node.children) {
                    findNode(node.children);
                }
            }
        };
        
        findNode(fileTreeData);
        return foundType;
    }, [activeFileId, fileTreeData]);

    const activeFileNode = React.useMemo(() => {
        if (!activeFileId) return null;
        let foundNode: FileTreeNodeType | null = null;
        const findNode = (nodes: FileTreeNodeType[]) => {
            for (const node of nodes) {
                if (node.id === activeFileId) {
                    foundNode = node;
                    return;
                }
                if (node.type === 'folder' && node.children) {
                    findNode(node.children);
                }
            }
        };
        findNode(fileTreeData);
        return foundNode;
    }, [activeFileId, fileTreeData]);

    const isNoteActive = React.useMemo(() => {
        const node = activeFileNode as any;
        return node?.type === 'file' && node?.fileType === 'note';
    }, [activeFileNode]);

    const handleExpandToggle = () => {
        const newExpandedState = !isExpanded;
        setIsExpanded(newExpandedState);
        onExpandChange?.(newExpandedState);
    };

    const [, forceUpdate] = React.useState(0);

    React.useEffect(() => {
        if (!editor) return;

        const handleUpdate = () => {
            forceUpdate((prev) => prev + 1);
        };

        editor.on('transaction', handleUpdate);
        editor.on('selectionUpdate', handleUpdate);

        return () => {
            editor.off('transaction', handleUpdate);
            editor.off('selectionUpdate', handleUpdate);
        };
    }, [editor]);

    const handleTextAlign = (align: 'left' | 'center' | 'right' | 'justify') => {
        if (!editor || !editor.chain().focus().setTextAlign) return;

        const isBold = editor.isActive('bold');
        const isItalic = editor.isActive('italic');
        const isUnderline = editor.isActive('underline');

        const chain = editor.chain().focus().setTextAlign(align);

        if (isBold) chain.setBold();
        if (isItalic) chain.setItalic();
        if (isUnderline) chain.setUnderline();

        chain.run();
    };

    const headingOptions: DropdownOption[] = [
        { value: 'paragraph', title: 'Normal' },
        { value: '1', title: 'Heading 1' },
        { value: '2', title: 'Heading 2' },
        { value: '3', title: 'Heading 3' },
        { value: '4', title: 'Heading 4' },
        { value: '5', title: 'Heading 5' },
    ];

    const [headingOpen, setHeadingOpen] = React.useState(false);

    const handleHeadingChange = (value: string) => {
        if (!editor) return;

        if (value === 'paragraph') {
            editor.chain().focus().setParagraph().run();
        } else {
            const level = parseInt(value) as 1 | 2 | 3 | 4 | 5 | 6;
            editor.chain().focus().toggleHeading({ level }).run();
        }
        setHeadingOpen(false);
    };

    const getCurrentHeadingValue = () => {
        if (editor?.isActive('heading', { level: 1 })) return '1';
        if (editor?.isActive('heading', { level: 2 })) return '2';
        if (editor?.isActive('heading', { level: 3 })) return '3';
        if (editor?.isActive('heading', { level: 4 })) return '4';
        if (editor?.isActive('heading', { level: 5 })) return '5';
        return 'paragraph';
    };

    const currentHeadingLabel = headingOptions.find(opt => opt.value === getCurrentHeadingValue())?.title || 'Normal';
    const [isLinkDialogOpen, setIsLinkDialogOpen] = React.useState(false);
    const [currentLinkUrl, setCurrentLinkUrl] = React.useState("");

    const handleLinkSave = (url: string) => {
        if (!editor) return;

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && onImageUpload && editor) {
            onImageUpload(file, editor);
        }
        if (event.target) {
            event.target.value = '';
        }
    };

    const handleShare = () => {
        onShare?.(editor, title);
    };



    return (
        <>
            <AnimatePresence>
                {isEnlargeOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-40"
                    />
                )}
            </AnimatePresence>
            <motion.div
                layout
                className={cn(
                    "relative",
                    isEnlargeOpen && "z-50",
                    isFullView ? "w-full h-full" : cn(
                        isExpanded ? "w-[calc(100vw-32px)] sm:w-[560px]" : "w-[calc(100vw-32px)] sm:w-80",
                        isExpanded ? "h-[80vh] sm:h-[400px]" : "h-14"
                    )
                )}
                transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
            >
                <motion.div
                    layout
                    className={cn(
                        "bg-white overflow-hidden flex flex-col",
                        !isFullView && "border border-color-border-neutral-default shadow-xl",
                        isEnlargeOpen && !isFullView
                            ? "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100vw-32px)] lg:w-[1050px] h-[calc(100vh-32px)] lg:h-[680px] max-h-[calc(100vh-32px)] lg:max-h-[calc(100vh-48px)] rounded-lg p-4 md:p-6 gap-2"
                            : cn(
                                "absolute inset-0 w-full h-full",
                                !isFullView && (isExpanded ? "rounded-xl" : "rounded-t-xl border-b-0")
                            ),
                        className
                    )}
                    transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
                >
                    {isEnlargeOpen || isFullView ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={cn("flex flex-col h-full w-full", isFullView ? "gap-2" : "gap-4")}
                        >
                            {isDrawer && (
                                <div className="flex items-center justify-between shrink-0 px-4 py-3 border-b border-color-border-neutral-default">
                                    <div className="flex items-center gap-3">
                                        {isNoteActive && (
                                            <IconButton
                                                icon="arrow-left-a"
                                                size="medium"
                                                variant="neutral"
                                                boundary="none"
                                                onClick={() => {
                                                    onFileSelect?.({ id: '', name: '', type: 'folder', children: [] });
                                                }}
                                            />
                                        )}
                                        <CardTitle className="p-1 text-style-body-title-regular text-color-text-neutral-default truncate max-w-[200px]">
                                            {isNoteActive ? title : "My Files"}
                                        </CardTitle>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <IconButton
                                            icon="cross"
                                            size="medium"
                                            variant="neutral"
                                            boundary="none"
                                            onClick={onCancel}
                                            className="rotate-180"
                                        />
                                    </div>
                                </div>
                            )}

                            {!isFullView && (
                                <div className="flex items-center justify-between shrink-0">
                                    <div className="flex items-center gap-3">
                                        <CardTitle className="p-1 text-style-body-title-regular text-color-text-neutral-default">{title}</CardTitle>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        {/* <Label
                                            colorScheme="neutral"
                                            size="small"
                                            className="gap-2 hover:bg-color-label-color-neutral-bg cursor-pointer"
                                            onClick={onOpenInNewTab}
                                        >
                                            Open in new tab
                                        </Label> */}
                                        <div className="flex items-center gap-2">
                                            <IconButton
                                                icon="received"
                                                size="medium"
                                                variant="neutral"
                                                boundary="none"
                                                onClick={() => {
                                                    setIsEnlargeOpen(false);
                                                    setIsExpanded(true);
                                                    onSend?.(false);
                                                }}
                                                className="scale-x-[-1]"
                                            />
                                            <IconButton
                                                icon="cross"
                                                size="medium"
                                                variant="neutral"
                                                boundary="none"
                                                onClick={() => {
                                                    if (isFullView) {
                                                        onCancel?.();
                                                    } else {
                                                        setIsEnlargeOpen(false);
                                                        setIsExpanded(false);
                                                    }
                                                }}
                                                className="rotate-180"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className={cn("flex flex-1 min-h-0", isFullView ? "gap-2" : "gap-4")}>
                                {showSidebar && (
                                    <>
                                        <div className={cn(
                                            "w-[240px] flex-col shrink-0",
                                            isDrawer 
                                                ? (isNoteActive ? "hidden" : "flex w-full px-4 pb-4") 
                                                : "hidden md:flex"
                                        )}>
                                            <div className="flex items-center justify-between">
                                                <span className="p-1 text-style-body-default-regular text-color-text-neutral-default">My Files</span>
                                                <div className="flex items-center gap-0.5">
                                                    <IconButton icon="add" size="medium" variant="neutral" boundary="none" onClick={handleAddNoteClick} disabled={!activeFileId || editingId === "temp-new-note"} />
                                                    <IconButton icon="edit-a" size="medium" variant="neutral" boundary="none" onClick={onEditFile} disabled={activeNodeType !== 'file'} />
                                                    <IconButton icon="trash" size="medium" variant="neutral" boundary="none" onClick={() => setIsDeleteDialogOpen(true)} disabled={activeNodeType !== 'file'} />
                                                </div>
                                            </div>
                                            <Separator className="shrink-0 h-px w-full bg-color-border-neutral-default mb-2" />
                                            <div className="flex-1 overflow-hidden -ml-2">
                                                <FileTree
                                                    data={fileTreeData}
                                                    activeId={activeFileId}
                                                    editingId={editingId}
                                                    onSelect={(node: FileTreeNodeType) => {
                                                        if (node.id === "temp-new-note") return;
                                                        setActiveFileId(node.id);
                                                        onFileSelect?.(node);
                                                    }}
                                                    onToggle={handleFileTreeToggle}
                                                    onRename={handleRenameFile}
                                                    onCancelEdit={handleCancelEdit}
                                                    className="[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                                                />
                                            </div>
                                        </div>

                                        <Separator orientation="vertical" className={cn("w-px h-full bg-color-border-neutral-default", isDrawer ? "hidden" : "hidden md:block")} />
                                    </>
                                )}

                                <div className={cn(
                                    "flex-1 flex flex-col min-h-0 min-w-0",
                                    isDrawer && "px-4 pb-4",
                                    isDrawer && !isNoteActive && "hidden"
                                )}>
                                    <div className={cn(
                                        "flex items-center h-auto min-h-[34px] shrink-0 flex-wrap mb-1",
                                        isFullView 
                                            ? "w-full justify-start gap-2" 
                                            : "w-full max-w-[720px] px-0 justify-between gap-y-2"
                                    )}>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <Popover open={headingOpen} onOpenChange={setHeadingOpen}>
                                                <PopoverTrigger asChild>
                                                    <div
                                                        className={`button-font-small ${cn(
                                                            "flex items-center justify-between gap-9 px-4 py-2 cursor-pointer select-none min-w-[100px] bg-color-surface-neutral-subtle_bg rounded-radius-interactiveelement",
                                                            "text-color-text-neutral-default hover:bg-color-surface-neutral-hover_default",
                                                            headingOpen && "bg-color-surface-neutral-subtle_bg"
                                                        )}`}
                                                    >
                                                        <span className="truncate">{currentHeadingLabel}</span>
                                                        <Icon name="arrow-down-c" className="w-[14px] h-[14px]" />
                                                    </div>
                                                </PopoverTrigger>
                                                <PopoverContent className="p-0 w-auto border-none shadow-none bg-transparent" align="start" sideOffset={4}>
                                                    <Dropdown
                                                        options={headingOptions}
                                                        value={getCurrentHeadingValue()}
                                                        onChange={handleHeadingChange}
                                                        searchbar="off"
                                                        className="w-[140px] shadow-lg"
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>

                                        <Separator orientation="vertical" className="h-6! bg-color-border-neutral-default" />

                                        <div className="flex items-center gap-1 shrink-0">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <IconButton
                                                        icon="text-bold"
                                                        size="medium"
                                                        variant="neutral"
                                                        className={editor?.isActive('bold') ? "bg-icon_button-color-neutral-hover" : ""}
                                                        boundary="none"
                                                        onClick={() => editor?.chain().focus().toggleBold().run()}
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent>Bold</TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <IconButton
                                                        icon="text-italic"
                                                        size="medium"
                                                        variant="neutral"
                                                        className={editor?.isActive('italic') ? "bg-icon_button-color-neutral-hover" : ""}
                                                        boundary="none"
                                                        onClick={() => editor?.chain().focus().toggleItalic().run()}
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent>Italic</TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <IconButton
                                                        icon="text-underline"
                                                        size="medium"
                                                        variant="neutral"
                                                        className={editor?.isActive('underline') ? "bg-icon_button-color-neutral-hover" : ""}
                                                        boundary="none"
                                                        onClick={() => editor?.chain().focus().toggleUnderline?.().run()}
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent>Underline</TooltipContent>
                                            </Tooltip>
                                        </div>

                                        <Separator orientation="vertical" className="h-6! bg-color-border-neutral-default" />

                                        <div className="flex items-center gap-1 shrink-0">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <IconButton
                                                        icon="textalign-left"
                                                        size="medium"
                                                        variant="neutral"
                                                        className={(editor?.isActive({ textAlign: 'left' }) || (!editor?.isActive({ textAlign: 'center' }) && !editor?.isActive({ textAlign: 'right' }) && !editor?.isActive({ textAlign: 'justify' }))) ? "bg-icon_button-color-neutral-hover" : ""}
                                                        boundary="none"
                                                        onClick={() => handleTextAlign('left')}
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent>Align Left</TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <IconButton
                                                        icon="textalign-center"
                                                        size="medium"
                                                        variant="neutral"
                                                        className={editor?.isActive({ textAlign: 'center' }) ? "bg-icon_button-color-neutral-hover" : ""}
                                                        boundary="none"
                                                        onClick={() => handleTextAlign('center')}
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent>Align Center</TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <IconButton
                                                        icon="textalign-right"
                                                        size="medium"
                                                        variant="neutral"
                                                        className={editor?.isActive({ textAlign: 'right' }) ? "bg-icon_button-color-neutral-hover" : ""}
                                                        boundary="none"
                                                        onClick={() => handleTextAlign('right')}
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent>Align Right</TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <IconButton
                                                        icon="textalign-justifycenter"
                                                        size="medium"
                                                        variant="neutral"
                                                        className={editor?.isActive({ textAlign: 'justify' }) ? "bg-icon_button-color-neutral-hover" : ""}
                                                        boundary="none"
                                                        onClick={() => handleTextAlign('justify')}
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent>Justify</TooltipContent>
                                            </Tooltip>
                                        </div>

                                        <Separator orientation="vertical" className="h-6! bg-color-border-neutral-default" />

                                        <div className="flex items-center gap-1 shrink-0">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <IconButton
                                                        icon="link-b"
                                                        size="medium"
                                                        variant="neutral"
                                                        className={editor?.isActive('link') ? "bg-icon_button-color-neutral-hover" : ""}
                                                        boundary="none"
                                                        onClick={() => {
                                                            if (!editor || editor.state.selection.empty) return;
                                                            const previousUrl = editor.getAttributes('link').href;
                                                            setCurrentLinkUrl(previousUrl || "");
                                                            setIsLinkDialogOpen(true);
                                                        }}
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent>Insert Link</TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <IconButton
                                                        icon="image"
                                                        size="medium"
                                                        variant="neutral"
                                                        boundary="none"
                                                        onClick={() => fileInputRef.current?.click()}
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent>Upload Image</TooltipContent>
                                            </Tooltip>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                            />
                                        </div>

                                        <Separator orientation="vertical" className="h-6! bg-color-border-neutral-default" />

                                        <div className="flex items-center gap-1 shrink-0">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <IconButton icon="at" size="medium" variant="neutral" boundary="none" onClick={() => console.log('At clicked')} />
                                                </TooltipTrigger>
                                                <TooltipContent>Mentions</TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <IconButton icon="share-a" size="medium" variant="neutral" boundary="none" onClick={handleShare} />
                                                </TooltipTrigger>
                                                <TooltipContent>Share Note</TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </div>



                                    <div className={cn(
                                        "flex-1 bg-white relative overflow-hidden",
                                        isFullView ? "w-full border border-color-border-neutral-default" : "w-full max-w-[720px] border border-color-border-neutral-default"
                                    )}>
                                        <TextEditor
                                            className="w-full h-full text-color-text-neutral-default"
                                            placeholder="Type your notes here"
                                            onEditorReady={setEditor}
                                            content={noteContent}
                                            onChange={setNoteContent}
                                        />
                                    </div>

                                    <div className={cn(
                                        "flex items-center justify-end py-3 shrink-0",
                                        isFullView ? "w-full px-6 gap-2" : "w-full max-w-[720px] px-0 gap-3"
                                    )}>
                                        <Button variant="neutral" onClick={() => {
                                            if (isFullView) {
                                                onCancel?.();
                                            } else {
                                                setIsEnlargeOpen(false);
                                                setIsExpanded(false);
                                            }
                                        }} size="extraSmall">Cancel</Button>
                                        <Button variant="primary" onClick={() => { onSave?.(noteContent); }} size="extraSmall">Save</Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            className="flex flex-col h-full w-full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <CardHeader className={cn(
                                "flex flex-row items-center justify-between px-4 py-3 h-14 border-b space-y-0 bg-color-surface-neutral-subtle_bg z-10 relative transition-colors duration-300 shrink-0",
                                isExpanded ? "border-color-border-neutral-default" : "border-transparent"
                            )}>
                                {/* Minimised variant */}
                                <div className="flex items-center min-w-0 flex-1">
                                    <div className="p-2">
                                        <Icon name="note-a" className="h-4 w-4 text-color-text-neutral-default shrink-0" />
                                    </div>
                                    <CardTitle className="p-1 text-style-body-title-regular text-color-text-neutral-default truncate whitespace-nowrap">{title}</CardTitle>
                                </div>
                                <div className="flex items-center gap-2">
                                    <IconButton
                                        icon="send-c"
                                        className="bg-transparent"
                                        iconClassName={cn("transition-transform duration-300", isEnlargeOpen && "rotate-180")}
                                        size="medium"
                                        variant="neutral"
                                        boundary="none"
                                        aria-label="Open enlarge view"
                                        onClick={() => {
                                            setIsEnlargeOpen(true);
                                            onSend?.(true);
                                        }}
                                    />
                                    {/* <IconButton
                                        icon="export-b"
                                        className="bg-transparent"
                                        size="medium"
                                        variant="neutral"
                                        boundary="none"
                                        aria-label="Share as PDF"
                                        onClick={handleShare}
                                    /> */}
                                    <IconButton
                                        icon="arrow-down-c"
                                        className="bg-transparent"
                                        iconClassName={cn("transition-transform duration-300 rotate-180", isExpanded && "rotate-0")}
                                        size="medium"
                                        variant="neutral"
                                        boundary="none"
                                        onClick={handleExpandToggle}
                                        aria-label={isExpanded ? "Minimize" : "Maximize"}
                                    />
                                </div>
                            </CardHeader>
                            <div
                                className={cn(
                                    "grid transition-[grid-template-rows] duration-300 ease-in-out flex-1",
                                    isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                                )}
                            >
                                <div className="overflow-hidden bg-surface-neutral-default min-h-0 h-full">
                                    <CardContent className={cn("p-0 transition-[height] duration-300 ease-in-out h-full")}>
                                        {children ? (
                                            children
                                        ) : (
                                            <TextEditor
                                                className="w-full h-full"
                                                placeholder="Type your notes here"
                                                onEditorReady={setEditor}
                                                content={noteContent}
                                                onChange={setNoteContent}
                                            />
                                        )}
                                    </CardContent>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </motion.div>
            <LinkDialog
                open={isLinkDialogOpen}
                onOpenChange={setIsLinkDialogOpen}
                initialUrl={currentLinkUrl}
                onSave={handleLinkSave}
            />
            <Confirmation
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                mainText="Delete Note"
                subText="Are you sure you want to delete this note? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                confirmVariant="destructive"
                onConfirmClick={() => {
                    setIsDeleteDialogOpen(false);
                    onDeleteFile?.();
                }}
                onCancelClick={() => setIsDeleteDialogOpen(false)}
            />
        </>
    );
}
