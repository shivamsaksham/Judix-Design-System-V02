"use client";

import * as React from "react";
import { Icon } from "judix-icon";
import { Editor } from '@tiptap/react';
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
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
import { FileTree, FileTreeNodeType } from "./file-tree";

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
    onAddFile?: () => void;
    onEditFile?: () => void;
    onDeleteFile?: () => void;
    onImageUpload?: (file: File, editor: Editor | null) => void;
    fileTree?: FileTreeNodeType[];
    onFileSelect?: (node: FileTreeNodeType) => void;
    activeFileId?: string | null;
    content?: string;
    variant?: 'floating' | 'embedded';
    showSidebar?: boolean;
}

export function NotesCard({
    className,
    defaultExpanded = false,
    defaultEnlarged = false,
    title = "Notes",
    children,
    onExpandChange,
    onMaximize,
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
    ...props
}: NotesCardProps) {
    const isEmbedded = variant === 'embedded';
    const [isExpanded, setIsExpanded] = React.useState(isEmbedded ? true : defaultExpanded);
    const [isMaximized, setIsMaximized] = React.useState(false);
    const [isEnlargeOpen, setIsEnlargeOpen] = React.useState(isEmbedded ? false : defaultEnlarged);
    const [activeFileId, setActiveFileId] = React.useState<string | undefined>(propActiveFileId || undefined);
    const [editor, setEditor] = React.useState<Editor | null>(null);
    const [noteContent, setNoteContent] = React.useState(propContent || "");
    const [fileTreeData, setFileTreeData] = React.useState<FileTreeNodeType[]>(fileTree);

    React.useEffect(() => {
        setFileTreeData(fileTree);
    }, [fileTree]);

    React.useEffect(() => {
        if (propActiveFileId !== undefined) {
            setActiveFileId(propActiveFileId || undefined);
        }
    }, [propActiveFileId]);

    React.useEffect(() => {
        if (propContent !== undefined) {
            setNoteContent(propContent);
            if (editor && editor.getHTML() !== propContent) {
                editor.commands.setContent(propContent);
            }
        }
    }, [propContent, editor]);

    const handleFileTreeToggle = (toggledNode: any) => {
        const isRoot = fileTreeData.some(f => f.id === toggledNode.id);

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
            <div
                className={cn(
                    "transition-all duration-300 ease-in-out relative",
                    isEnlargeOpen && "z-50",
                    isEmbedded ? "w-full h-full" : cn(isExpanded ? "w-140" : "w-80", isExpanded ? "h-100" : "h-14")
                )}
            >
                <motion.div
                    layout
                    className={cn(
                        "bg-white overflow-hidden flex flex-col",
                        !isEmbedded && "border border-color-border-neutral-default shadow-xl",
                        isEnlargeOpen && !isEmbedded
                            ? "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[1050px] h-[680px] rounded-lg p-6 gap-2"
                            : cn(
                                "absolute inset-0 w-full h-full",
                                !isEmbedded && (isExpanded ? "rounded-xl" : "rounded-t-xl border-b-0")
                            ),
                        className
                    )}
                    transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
                >
                    {isEnlargeOpen || isEmbedded ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col h-full w-full gap-2"
                        >
                            {!isEmbedded && (
                                <div className="flex items-center justify-between shrink-0 mb-2">
                                    <div className="flex items-center gap-3">
                                        <IconButton icon="note-a" size="medium" variant="neutral" boundary="none" />
                                        <CardTitle className="text-style-body-title-regular text-color-text-neutral-default">{title}</CardTitle>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Button variant="neutral" size="small" className="gap-2" onClick={onOpenInNewTab}>
                                            Open in new tab
                                        </Button>
                                        <IconButton
                                            icon="received"
                                            size="medium"
                                            variant="neutral"
                                            boundary="none"
                                            className="rotate-180"
                                            onClick={() => {
                                                setIsEnlargeOpen(false);
                                                onSend?.(false);
                                            }}
                                        />
                                        <IconButton
                                            icon="cross"
                                            size="medium"
                                            variant="neutral"
                                            boundary="none"
                                            onClick={() => {
                                                setIsEnlargeOpen(false);
                                                onCancel?.();
                                            }}
                                            className="rotate-180"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-1 min-h-0 gap-4">
                                {showSidebar && (
                                    <>
                                        <div className="w-[240px] flex flex-col shrink-0">
                                            <div className="flex items-center justify-between py-2">
                                                <span className="text-style-body-default-regular text-color-text-neutral-default">My Files</span>
                                                <div className="flex items-center gap-0.5">
                                                    <IconButton icon="add" size="medium" variant="neutral" boundary="none" onClick={onAddFile} disabled={!activeFileId} />
                                                    <IconButton icon="edit-a" size="medium" variant="neutral" boundary="none" onClick={onEditFile} disabled={!activeFileId} />
                                                    <IconButton icon="trash" size="medium" variant="neutral" boundary="none" onClick={onDeleteFile} disabled={!activeFileId} />
                                                </div>
                                            </div>
                                            <Separator className="shrink-0 h-px w-full bg-color-border-neutral-default mb-2" />
                                            <div className="flex-1 overflow-hidden -ml-2">
                                                <FileTree
                                                    data={fileTreeData}
                                                    activeId={activeFileId}
                                                    onSelect={(node: any) => {
                                                        setActiveFileId(node.id);
                                                        onFileSelect?.(node);
                                                    }}
                                                    onToggle={handleFileTreeToggle}
                                                    className="[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                                                />
                                            </div>
                                        </div>

                                        <Separator orientation="vertical" className="w-px h-full bg-color-border-neutral-default" />
                                    </>
                                )}

                                <div className="flex-1 flex flex-col min-w-0 gap-1">
                                    <div className={cn(
                                        "flex items-center h-auto min-h-[34px] shrink-0 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] justify-between",
                                        isEmbedded ? "w-full px-6" : "w-[720px] px-0"
                                    )}>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <Popover open={headingOpen} onOpenChange={setHeadingOpen}>
                                                <PopoverTrigger asChild>
                                                    <div
                                                        className={cn(
                                                            "flex items-center justify-between gap-2 px-2 py-1 rounded-md cursor-pointer select-none min-w-[100px]",
                                                            "text-size-body-main text-color-text-neutral-default hover:bg-color-surface-neutral-hover_default",
                                                            headingOpen && "bg-color-surface-neutral-hover_default"
                                                        )}
                                                    >
                                                        <span className="truncate">{currentHeadingLabel}</span>
                                                        <IconButton icon="arrow-down-c" size="medium" variant="neutral" boundary="none" />
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

                                        <Separator orientation="vertical" className="!h-6 bg-color-border-neutral-default" />

                                        <div className="flex items-center gap-1 shrink-0">
                                            <IconButton
                                                icon="text-bold"
                                                size="medium"
                                                variant="neutral"
                                                className={editor?.isActive('bold') ? "bg-icon_button-color-neutral-hover" : ""}
                                                boundary="none"
                                                onClick={() => editor?.chain().focus().toggleBold().run()}
                                            />
                                            <IconButton
                                                icon="text-italic"
                                                size="medium"
                                                variant="neutral"
                                                className={editor?.isActive('italic') ? "bg-icon_button-color-neutral-hover" : ""}
                                                boundary="none"
                                                onClick={() => editor?.chain().focus().toggleItalic().run()}
                                            />
                                            <IconButton
                                                icon="text-underline"
                                                size="medium"
                                                variant="neutral"
                                                className={editor?.isActive('underline') ? "bg-icon_button-color-neutral-hover" : ""}
                                                boundary="none"
                                                onClick={() => editor?.chain().focus().toggleUnderline?.().run()}
                                            />
                                        </div>

                                        <Separator orientation="vertical" className="!h-6 bg-color-border-neutral-default" />

                                        <div className="flex items-center gap-1 shrink-0">
                                            <IconButton
                                                icon="textalign-left"
                                                size="medium"
                                                variant="neutral"
                                                className={(editor?.isActive({ textAlign: 'left' }) || (!editor?.isActive({ textAlign: 'center' }) && !editor?.isActive({ textAlign: 'right' }) && !editor?.isActive({ textAlign: 'justify' }))) ? "bg-icon_button-color-neutral-hover" : ""}
                                                boundary="none"
                                                onClick={() => handleTextAlign('left')}
                                            />
                                            <IconButton
                                                icon="textalign-center"
                                                size="medium"
                                                variant="neutral"
                                                className={editor?.isActive({ textAlign: 'center' }) ? "bg-icon_button-color-neutral-hover" : ""}
                                                boundary="none"
                                                onClick={() => handleTextAlign('center')}
                                            />
                                            <IconButton
                                                icon="textalign-right"
                                                size="medium"
                                                variant="neutral"
                                                className={editor?.isActive({ textAlign: 'right' }) ? "bg-icon_button-color-neutral-hover" : ""}
                                                boundary="none"
                                                onClick={() => handleTextAlign('right')}
                                            />
                                            <IconButton
                                                icon="textalign-justifycenter"
                                                size="medium"
                                                variant="neutral"
                                                className={editor?.isActive({ textAlign: 'justify' }) ? "bg-icon_button-color-neutral-hover" : ""}
                                                boundary="none"
                                                onClick={() => handleTextAlign('justify')}
                                            />
                                        </div>

                                        <Separator orientation="vertical" className="!h-6 bg-color-border-neutral-default" />

                                        <div className="flex items-center gap-1 shrink-0">
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
                                            <IconButton
                                                icon="image"
                                                size="medium"
                                                variant="neutral"
                                                boundary="none"
                                                onClick={() => fileInputRef.current?.click()}
                                            />
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                            />
                                        </div>

                                        <Separator orientation="vertical" className="!h-6 bg-color-border-neutral-default" />

                                        <div className="flex items-center gap-1 shrink-0">
                                            <IconButton icon="at" size="medium" variant="neutral" boundary="none" onClick={() => console.log('At clicked')} />
                                            <IconButton icon="share-a" size="medium" variant="neutral" boundary="none" onClick={handleShare} />
                                        </div>
                                    </div>



                                    <div className={cn(
                                        "flex-1 bg-white relative overflow-hidden",
                                        isEmbedded ? "w-full border border-color-border-neutral-default" : "w-[720px] border border-color-border-neutral-default"
                                    )}>
                                        <TextEditor
                                            className="w-full h-full p-6 text-color-text-neutral-default"
                                            placeholder="Type your notes here"
                                            onEditorReady={setEditor}
                                            content={noteContent}
                                            onChange={setNoteContent}
                                        />
                                    </div>

                                    <div className={cn(
                                        "flex items-center justify-end py-3 gap-3 shrink-0",
                                        isEmbedded ? "w-full px-6" : "w-[720px] px-0"
                                    )}>
                                        <Button variant="neutral" onClick={() => { setIsEnlargeOpen(false); onCancel?.(); }} size="small">Cancel</Button>
                                        <Button variant="primary" onClick={() => { setIsEnlargeOpen(false); onSave?.(noteContent); }} size="small">Save</Button>
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
                                <div className="flex items-center gap-2">
                                    <Icon name="Note" className="h-4 w-4 text-color-text-neutral-default" />
                                    <CardTitle className="text-style-body-title-regular text-color-text-neutral-default">{title}</CardTitle>
                                </div>
                                <div className="flex items-center gap-1">
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
                                    <IconButton
                                        icon="export-b"
                                        className="bg-transparent"
                                        size="medium"
                                        variant="neutral"
                                        boundary="none"
                                        aria-label="Share as PDF"
                                        onClick={handleShare}
                                    />
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
            </div>
            <LinkDialog
                open={isLinkDialogOpen}
                onOpenChange={setIsLinkDialogOpen}
                initialUrl={currentLinkUrl}
                onSave={handleLinkSave}
            />
        </>
    );
}
