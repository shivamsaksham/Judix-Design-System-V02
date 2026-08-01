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
import { showToast } from "../ui/toast";
import Confirmation from "./confirmation";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "../ui/tooltip";
import { FileTree, FileTreeNodeType, FolderItem } from "./file-tree";
import { useDebounceCallback } from "../../hooks/use-debounce";

const DEFAULT_FILE_TREE: FileTreeNodeType[] = [];

export const DEFAULT_MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const DEFAULT_MAX_IMAGES_PER_NOTE = 3;
export const DEFAULT_ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
] as const;




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
    isEnlarged?: boolean;
    onEnlargeChange?: (enlarged: boolean) => void;
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
    onImageUpload?: (file: File, editor: Editor | null, noteId?: string | null) => void;
    fileTree?: FileTreeNodeType[];
    onFileSelect?: (node: FileTreeNodeType) => void;
    activeFileId?: string | null;
    content?: string;
    variant?: 'floating' | 'embedded' | 'drawer';
    showSidebar?: boolean;
    onFolderToggle?: (node: FileTreeNodeType) => void;
    maxImageSizeBytes?: number;
    maxImagesPerNote?: number;
    allowedImageTypes?: readonly string[];
}

export function NotesCard({
    className,
    defaultExpanded = false,
    defaultEnlarged = false,
    isEnlarged,
    onEnlargeChange,
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
    maxImageSizeBytes = DEFAULT_MAX_IMAGE_SIZE_BYTES,
    maxImagesPerNote = DEFAULT_MAX_IMAGES_PER_NOTE,
    allowedImageTypes = DEFAULT_ALLOWED_IMAGE_TYPES,
}: NotesCardProps) {
    const isEmbedded = variant === 'embedded';
    const isDrawer = variant === 'drawer';
    const isFullView = isEmbedded || isDrawer;
    const [isExpanded, setIsExpanded] = React.useState(isFullView ? true : defaultExpanded);
    const [isEnlargeOpenInternal, setIsEnlargeOpenInternal] = React.useState(isFullView ? false : defaultEnlarged);
    
    const isEnlargeOpen = isFullView ? false : (isEnlarged !== undefined ? isEnlarged : isEnlargeOpenInternal);

    const setEnlargeState = React.useCallback((val: boolean) => {
        if (isEnlarged === undefined) {
            setIsEnlargeOpenInternal(val);
        }
        onEnlargeChange?.(val);
    }, [isEnlarged, onEnlargeChange]);

    const [activeFileId, setActiveFileId] = React.useState<string | undefined>(propActiveFileId || undefined);
    const [editor, setEditor] = React.useState<Editor | null>(null);
    const [floatingEditor, setFloatingEditor] = React.useState<Editor | null>(null);
    const [modalEditor, setModalEditor] = React.useState<Editor | null>(null);
    const [noteContent, setNoteContent] = React.useState(propContent || "");
    
    const isSavedRef = React.useRef(false);
    const triggerSave = React.useCallback((contentToSave: string) => {
        isSavedRef.current = true;
        onSave?.(contentToSave);
    }, [onSave]);

    const debouncedSave = useDebounceCallback((newContent: string) => {
        triggerSave(newContent);
    }, 1500);

    const onSaveRef = React.useRef(onSave);
    React.useEffect(() => {
        onSaveRef.current = onSave;
    }, [onSave]);

    const noteContentRef = React.useRef(noteContent);
    React.useEffect(() => {
        noteContentRef.current = noteContent;
    }, [noteContent]);

    React.useEffect(() => {
        return () => {
            if (!isSavedRef.current && noteContentRef.current) {
                const rawText = noteContentRef.current
                    .replace(/<(p|div|h[1-6]|li|br)[^>]*>/gi, '\n')
                    .replace(/<[^>]+>/g, '')
                    .trim();
                if (rawText) {
                    onSaveRef.current?.(noteContentRef.current);
                }
            }
        };
    }, []);

    const [fileTreeData, setFileTreeData] = React.useState<FileTreeNodeType[]>(fileTree);

    const isExistingNoteFile = React.useCallback((fileId: string | null | undefined): boolean => {
        if (!fileId || fileId === "temp-new-note") return false;
        const checkNodes = (nodes: FileTreeNodeType[]): boolean => {
            for (const node of nodes) {
                if (node.id === fileId && node.type !== 'folder') return true;
                if (node.type === 'folder' && node.children && checkNodes(node.children)) return true;
            }
            return false;
        };
        return checkNodes(fileTreeData) || checkNodes(fileTree);
    }, [fileTreeData, fileTree]);

    const handleContentChange = (newContent: string) => {
        isSavedRef.current = false;
        setNoteContent(newContent);
        if (isExistingNoteFile(activeFileId)) {
            debouncedSave(newContent);
        }
    };
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

    // Controlled prop syncs are not needed since we derive isEnlargeOpen on the fly.

    const getProjectFolderOfActiveFile = React.useCallback((fileId: string | null | undefined): string | null => {
        if (fileId) {
            for (const root of fileTreeData) {
                if (root.id === fileId) {
                    return root.id;
                }
                if (root.type === "folder" && root.children && root.children.some((child: FileTreeNodeType) => child.id === fileId)) {
                    return root.id;
                }
            }
        }
        const openFolder = fileTreeData.find(root => root.type === "folder" && root.isOpen);
        return openFolder ? openFolder.id : (fileTreeData.length > 0 ? fileTreeData[0].id : null);
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
                    let isOpen = expandedFolderIds.has(n.id);
                    
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

    const lastLoadedFileIdRef = React.useRef<string | null | undefined>(undefined);

    React.useEffect(() => {
        if (propActiveFileId !== lastLoadedFileIdRef.current) {
            lastLoadedFileIdRef.current = propActiveFileId;
            if (propContent !== undefined) {
                setNoteContent(propContent);
                if (editor && editor.getHTML() !== propContent) {
                    editor.commands.setContent(propContent, { emitUpdate: false });
                }
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
        const findNode = (nodes: FileTreeNodeType[]): FileTreeNodeType | null => {
            for (const node of nodes) {
                if (node.id === activeFileId) return node;
                if (node.type === 'folder' && node.children) {
                    const found = findNode(node.children);
                    if (found) return found;
                }
            }
            return null;
        };
        return findNode(fileTreeData);
    }, [activeFileId, fileTreeData]);

    const isNoteActive = React.useMemo(() => {
        return activeFileNode?.type === 'file' && activeFileNode?.fileType === 'note';
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
    const floatingFileInputRef = React.useRef<HTMLInputElement>(null);

    // Returns the currently active editor: prefer modal editor when enlarged is open, otherwise floating
    const getActiveEditor = React.useCallback((): Editor | null => {
        if (isEnlargeOpen && modalEditor) return modalEditor;
        if (floatingEditor) return floatingEditor;
        return editor;
    }, [isEnlargeOpen, modalEditor, floatingEditor, editor]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        const activeEditor = getActiveEditor();
        if (file && activeEditor) {
            // Validate image type
            if (!allowedImageTypes.includes(file.type)) {
                showToast.alert("Unsupported file type. Allowed: JPEG, PNG, GIF, WebP");
                if (event.target) event.target.value = '';
                return;
            }

            // Validate image size
            if (file.size > maxImageSizeBytes) {
                const maxMb = Math.round(maxImageSizeBytes / (1024 * 1024));
                showToast.alert(`Image too large. Maximum size is ${maxMb} MB.`);
                if (event.target) event.target.value = '';
                return;
            }

            // Validate image count
            const currentHtml = activeEditor.getHTML();
            const imgCount = (currentHtml.match(/<img /g) || []).length;
            if (imgCount >= maxImagesPerNote) {
                showToast.alert(`Maximum ${maxImagesPerNote} images per note allowed.`);
                if (event.target) event.target.value = '';
                return;
            }

            if (onImageUpload) {
                onImageUpload(file, activeEditor, propActiveFileId || null);
            } else {
                // Fallback: embed as base64 data URL directly
                const reader = new FileReader();
                reader.onload = (e) => {
                    const result = e.target?.result as string;
                    if (result) {
                        activeEditor.chain().focus().setImage({ src: result, alt: file.name, title: file.name }).run();
                    }
                };
                reader.readAsDataURL(file);
            }
        }
        if (event.target) {
            event.target.value = '';
        }
    };

    const handleShare = () => {
        onShare?.(editor, title);
    };

    // Extract image info (src + name) from HTML content for compact preview chips
    const extractImagesFromHtml = React.useCallback((html: string): Array<{ src: string; name: string }> => {
        if (typeof window === 'undefined') return [];
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const imgs = Array.from(doc.querySelectorAll('img'));
            return imgs.map((img, i) => ({
                src: img.src || img.getAttribute('src') || '',
                name: img.title || img.alt || `Image ${i + 1}`,
            }));
        } catch {
            return [];
        }
    }, []);

    const compactImages = React.useMemo(() => extractImagesFromHtml(noteContent), [noteContent, extractImagesFromHtml]);

    const ImageChip = ({ name, src }: { name: string; src: string }) => (
        <div
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-color-surface-neutral-subtle_bg border border-color-border-neutral-default text-color-text-neutral-default max-w-[160px] cursor-pointer hover:bg-color-surface-neutral-hover_default transition-colors"
            title={src ? 'Click to preview' : name}
            onClick={() => {
                if (src) {
                    window.open(src, '_blank');
                }
            }}
        >
            <Icon name="image" className="w-3 h-3 shrink-0 text-color-text-neutral-secondary" />
            <span className="text-xs truncate">{name}</span>
        </div>
    );

    const enlargedToolbar = (
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

                {/* Image upload feature commented out per user request
                <Tooltip>
                    <TooltipTrigger asChild>
                        <IconButton
                            icon="image"
                            size="medium"
                            variant="neutral"
                            boundary="none"
                            onClick={() => {
                                if (isEnlargeOpen) {
                                    fileInputRef.current?.click();
                                } else {
                                    floatingFileInputRef.current?.click();
                                }
                            }}
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
                <input
                    type="file"
                    ref={floatingFileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                />
                */}
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
    );

    return (
        <>
            <AnimatePresence>
                {isEnlargeOpen && (
                    <motion.div
                        key="notes-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0 } }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/50 z-40"
                    />
                )}
            </AnimatePresence>
            <div
                className={cn(
                    "relative",
                    !isEnlargeOpen && isEnlargeOpen !== undefined && "z-0",
                    isFullView ? "w-full h-full" : cn(
                        isExpanded ? "w-[calc(100vw-32px)] sm:w-[560px]" : "w-[calc(100vw-32px)] sm:w-80",
                        isExpanded ? "h-[80vh] sm:h-[400px]" : "h-14",
                        "transition-[width,height] duration-300 ease-in-out"
                    )
                )}
            >
                {/* Enlarged (fixed/modal) state */}
                <AnimatePresence>
                    {(isEnlargeOpen && !isFullView) && (
                        <motion.div
                            key="notes-enlarged"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, transition: { duration: 0 } }}
                            transition={{ duration: 0.2 }}
                            className={cn(
                                "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50",
                                "bg-white overflow-hidden flex flex-col",
                                "border border-color-border-neutral-default shadow-xl",
                                "w-[calc(100vw-32px)] lg:w-[1050px] h-[calc(100vh-32px)] lg:h-[680px]",
                                "max-h-[calc(100vh-32px)] lg:max-h-[calc(100vh-48px)] rounded-lg p-4 md:p-6 gap-2",
                                className
                            )}
                        >
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={cn("flex flex-col h-full w-full", "gap-4")}
                            >
                                {!isFullView && (
                                    <div className="flex items-center justify-between shrink-0">
                                        <div className="flex items-center gap-3">
                                            <CardTitle className="p-1 text-style-body-title-regular text-color-text-neutral-default">{title}</CardTitle>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-2">
                                                <IconButton
                                                    icon="received"
                                                    size="medium"
                                                    variant="neutral"
                                                    boundary="none"
                                                    onClick={() => {
                                                        setEnlargeState(false);
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
                                                        setEnlargeState(false);
                                                        setIsExpanded(false);
                                                        onCancel?.();
                                                    }}
                                                    className="rotate-180"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className={cn("flex flex-1 min-h-0", "gap-4")}>
                                    {showSidebar && (
                                        <>
                                            <div className={cn(
                                                "w-[240px] flex-col shrink-0",
                                                "hidden md:flex"
                                            )}>
                                                <div className="flex items-center justify-between">
                                                    <span className="p-1 text-style-body-default-regular text-color-text-neutral-default">My Files</span>
                                                    <div className="flex items-center gap-0.5">
                                                        <IconButton icon="add" size="medium" variant="neutral" boundary="none" onClick={handleAddNoteClick} disabled={editingId === "temp-new-note"} />
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

                                            <Separator orientation="vertical" className={cn("w-px h-full bg-color-border-neutral-default", "hidden md:block")} />
                                        </>
                                    )}

                                    <div className={cn("flex-1 flex flex-col min-h-0 min-w-0")}>
                                        {enlargedToolbar}

                                        <div className={cn(
                                            "flex-1 bg-white relative overflow-hidden",
                                            "w-full max-w-[720px] border border-color-border-neutral-default"
                                        )}>
                                            <TextEditor
                                                className="w-full h-full text-color-text-neutral-default"
                                                placeholder="Type your notes here"
                                                onEditorReady={(ed) => { setEditor(ed); setModalEditor(ed); }}
                                                content={noteContent}
                                                onChange={handleContentChange}
                                            />
                                        </div>

                                        <div className={cn(
                                            "flex items-center justify-end py-3 shrink-0",
                                            "w-full max-w-[720px] px-0 gap-3"
                                        )}>
                                            <Button variant="neutral" onClick={() => {
                                                setEnlargeState(false);
                                                setIsExpanded(false);
                                            }} size="extraSmall">Cancel</Button>
                                            <Button variant="primary" onClick={() => {
                                                triggerSave(noteContent);
                                                if (isExistingNoteFile(activeFileId)) {
                                                    showToast.success("Notes saved successfully", undefined, 1000);
                                                }
                                            }} size="extraSmall">Save</Button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Normal (absolute/relative) state — embedded, drawer, or floating card */}
                <div
                    className={cn(
                        "bg-white overflow-hidden flex flex-col",
                        !isFullView && "border border-color-border-neutral-default shadow-xl",
                        isEnlargeOpen && !isFullView ? "invisible" : "",
                        isFullView
                            ? "absolute inset-0 w-full h-full"
                            : cn(
                                "absolute inset-0 w-full h-full",
                                isExpanded ? "rounded-xl" : "rounded-t-xl border-b-0"
                            ),
                        isFullView ? "" : className
                    )}
                >
                    {isFullView ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
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
                                                    setActiveFileId(undefined);
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
                                                    <IconButton icon="add" size="medium" variant="neutral" boundary="none" onClick={handleAddNoteClick} disabled={editingId === "temp-new-note"} />
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
                                    {enlargedToolbar}

                                    <div className={cn(
                                        "flex-1 bg-white relative overflow-hidden",
                                        isFullView ? "w-full border border-color-border-neutral-default" : "w-full max-w-[720px] border border-color-border-neutral-default"
                                    )}>
                                        <TextEditor
                                            className="w-full h-full text-color-text-neutral-default"
                                            placeholder="Type your notes here"
                                            onEditorReady={(ed) => { setEditor(ed); setFloatingEditor(ed); }}
                                            content={noteContent}
                                            onChange={handleContentChange}
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
                                                setEnlargeState(false);
                                                setIsExpanded(false);
                                            }
                                        }} size="extraSmall">Cancel</Button>
                                        <Button variant="primary" onClick={() => {
                                            triggerSave(noteContent);
                                            if (isExistingNoteFile(activeFileId)) {
                                                showToast.success("Notes saved successfully", undefined, 1000);
                                            }
                                        }} size="extraSmall">Save</Button>
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
                            transition={{ duration: 0.15 }}
                        >
                            <CardHeader
                                className={cn(
                                    "flex flex-row items-center justify-between px-4 py-3 h-14 border-b space-y-0 bg-color-surface-neutral-subtle_bg z-10 relative transition-colors duration-300 shrink-0",
                                    isExpanded ? "border-color-border-neutral-default" : "border-transparent",
                                    !isExpanded && "cursor-pointer"
                                )}
                                onClick={!isExpanded ? handleExpandToggle : undefined}
                            >
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
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEnlargeState(true);
                                            onSend?.(true);
                                        }}
                                    />
                                    <IconButton
                                        icon="arrow-down-c"
                                        className="bg-transparent"
                                        iconClassName={cn("transition-transform duration-300 rotate-180", isExpanded && "rotate-0")}
                                        size="medium"
                                        variant="neutral"
                                        boundary="none"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleExpandToggle();
                                        }}
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
                                                onEditorReady={(ed) => { setEditor(ed); setFloatingEditor(ed); }}
                                                content={noteContent}
                                                onChange={handleContentChange}
                                                hideImages={!isExpanded}
                                            />
                                        )}
                                        {/* Show image chips in minimised state so full images are not visible */}
                                        {!isExpanded && !children && compactImages.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 px-4 py-2">
                                                {compactImages.map((img, i) => (
                                                    <ImageChip key={i} name={img.name} src={img.src} />
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
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
