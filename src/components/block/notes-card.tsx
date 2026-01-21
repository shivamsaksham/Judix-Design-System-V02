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

const mockFileTreeData: FileTreeNodeType[] = [
    {
        id: "independent",
        name: "Independent",
        type: "folder",
        isOpen: true,
        children: [
            {
                id: "ind-chats",
                name: "Chats",
                type: "folder",
                isOpen: true,
                children: [
                    { id: "ind-chat-1", name: "Income tax evasion discussion", type: "file", fileType: "chat" },
                    { id: "ind-chat-2", name: "Anticipatory bail examination", type: "file", fileType: "chat" },
                    { id: "ind-chat-3", name: "Automatic stay in money decree situation", type: "file", fileType: "chat" },
                ]
            },
            {
                id: "ind-notes",
                name: "Notes",
                type: "folder",
                isOpen: true,
                children: [
                    { id: "ind-note-1", name: "Case facts", type: "file", fileType: "note" },
                    { id: "ind-note-2", name: "Argument strategy", type: "file", fileType: "note" },
                    { id: "ind-note-3", name: "Personal analysis", type: "file", fileType: "note" },
                ]
            },
            {
                id: "ind-archive",
                name: "Archive",
                type: "folder",
                isOpen: false,
                children: [
                    { id: "ind-archive-1", name: "Malwa Strips vs Commissioner of Income Tax", type: "file", fileType: "archive" },
                    { id: "ind-archive-2", name: "The state of Bihar vs Srikumar Rao", type: "file", fileType: "archive" },
                    { id: "ind-archive-3", name: "Income Tax Act, 1961 : sec 12,32", type: "file", fileType: "archive" },
                ]
            }
        ]
    },
    {
        id: "project-1",
        name: "Shridhar apartment case",
        type: "folder",
        isOpen: false,
        children: [
            {
                id: "proj1-chats",
                name: "Chats",
                type: "folder",
                isOpen: false,
                children: [
                    { id: "proj1-chat-1", name: "Income tax evasion discussion", type: "file", fileType: "chat" },
                    { id: "proj1-chat-2", name: "Anticipatory bail examination", type: "file", fileType: "chat" },
                    { id: "proj1-chat-3", name: "Automatic stay in money decree situation", type: "file", fileType: "chat" },
                ]
            },
            {
                id: "proj1-notes",
                name: "Notes",
                type: "folder",
                isOpen: false,
                children: [
                    { id: "proj1-note-1", name: "Case facts", type: "file", fileType: "note" },
                    { id: "proj1-note-2", name: "Argument strategy", type: "file", fileType: "note" },
                    { id: "proj1-note-3", name: "Personal analysis", type: "file", fileType: "note" },
                ]
            },
            {
                id: "proj1-archive",
                name: "Archive",
                type: "folder",
                isOpen: false,
                children: [
                    { id: "proj1-archive-1", name: "Malwa Strips vs Commissioner of Income Tax", type: "file", fileType: "archive" },
                    { id: "proj1-archive-2", name: "The state of Bihar vs Srikumar Rao", type: "file", fileType: "archive" },
                    { id: "proj1-archive-3", name: "Income Tax Act, 1961 : sec 12,32", type: "file", fileType: "archive" },
                ]
            }
        ]
    },
    {
        id: "project-2",
        name: "Corporate Merger 2024 with a very long name",
        type: "folder",
        isOpen: false,
        children: [
            {
                id: "proj2-chats",
                name: "Chats",
                type: "folder",
                isOpen: false,
                children: [
                    { id: "proj2-chat-1", name: "Income tax evasion discussion", type: "file", fileType: "chat" },
                    { id: "proj2-chat-2", name: "Anticipatory bail examination", type: "file", fileType: "chat" },
                    { id: "proj2-chat-3", name: "Automatic stay in money decree situation", type: "file", fileType: "chat" },
                ]
            },
            {
                id: "proj2-notes",
                name: "Notes",
                type: "folder",
                isOpen: false,
                children: [
                    { id: "proj2-note-1", name: "Case facts", type: "file", fileType: "note" },
                    { id: "proj2-note-2", name: "Argument strategy", type: "file", fileType: "note" },
                    { id: "proj2-note-3", name: "Personal analysis", type: "file", fileType: "note" },
                ]
            },
            {
                id: "proj2-archive",
                name: "Archive",
                type: "folder",
                isOpen: false,
                children: [
                    { id: "proj2-archive-1", name: "Malwa Strips vs Commissioner of Income Tax", type: "file", fileType: "archive" },
                    { id: "proj2-archive-2", name: "The state of Bihar vs Srikumar Rao", type: "file", fileType: "archive" },
                    { id: "proj2-archive-3", name: "Income Tax Act, 1961 : sec 12,32", type: "file", fileType: "archive" },
                ]
            }
        ]
    }
];


export interface NotesCardProps extends React.HTMLAttributes<HTMLDivElement> {
    defaultExpanded?: boolean;
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
}

export function NotesCard({
    className,
    defaultExpanded = false,
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
    ...props
}: NotesCardProps) {
    const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);
    const [isMaximized, setIsMaximized] = React.useState(false);
    const [isEnlargeOpen, setIsEnlargeOpen] = React.useState(false);
    const [activeFileId, setActiveFileId] = React.useState<string | undefined>("note-2");
    const [editor, setEditor] = React.useState<Editor | null>(null);
    const [noteContent, setNoteContent] = React.useState("");

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
                    isExpanded ? "w-140" : "w-80",
                    isExpanded ? "h-100" : "h-14"
                )}
            >
                <motion.div
                    layout
                    className={cn(
                        "bg-white border border-color-border-neutral-default overflow-hidden shadow-xl flex flex-col",
                        isEnlargeOpen
                            ? "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[1050px] h-[680px] rounded-lg p-6 gap-2"
                            : cn(
                                "absolute inset-0 w-full h-full",
                                isExpanded ? "rounded-xl" : "rounded-t-xl border-b-0"
                            ),
                        className
                    )}
                    transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
                >
                    {isEnlargeOpen ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col h-full w-full gap-2"
                        >
                            <div className="flex items-center justify-between shrink-0 mb-2">
                                <div className="flex items-center gap-3">
                                    <Icon name="Note" className="w-5 h-5 text-color-icon-neutral-default" />
                                    <CardTitle className="text-style-body-title-regular text-color-text-neutral-default">{title}</CardTitle>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button variant="neutral" size="small" className="gap-2" onClick={onOpenInNewTab}>
                                        Open in new tab
                                    </Button>
                                    <IconButton
                                        icon="Send"
                                        size="small"
                                        variant="neutral"
                                        boundary="none"
                                        className="rotate-180"
                                        onClick={() => {
                                            setIsEnlargeOpen(false);
                                            onSend?.(false);
                                        }}
                                    />
                                    <IconButton
                                        icon="Cross"
                                        size="small"
                                        variant="neutral"
                                        boundary="none"
                                        onClick={() => {
                                            setIsEnlargeOpen(false);
                                            onSend?.(false);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-1 min-h-0 gap-4">
                                <div className="w-[240px] flex flex-col shrink-0">
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-style-body-default-regular text-color-text-neutral-default">My Files</span>
                                        <div className="flex items-center gap-0.5">
                                            <IconButton icon="Add" size="small" variant="neutral" boundary="none" onClick={onAddFile} />
                                            <IconButton icon="Edit" size="small" variant="neutral" boundary="none" onClick={onEditFile} />
                                            <IconButton icon="Trash" size="small" variant="neutral" boundary="none" onClick={onDeleteFile} />
                                        </div>
                                    </div>
                                    <Separator className="shrink-0 h-px w-full bg-color-border-neutral-default mb-2" />
                                    <div className="flex-1 overflow-hidden -ml-2">
                                        <FileTree
                                            data={mockFileTreeData}
                                            activeId={activeFileId}
                                            onSelect={(node: any) => setActiveFileId(node.id)}
                                            className="[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                                        />
                                    </div>
                                </div>

                                <Separator orientation="vertical" className="w-px h-full bg-color-border-neutral-default" />

                                <div className="flex-1 flex flex-col min-w-0 gap-1">
                                    <div className="flex items-center px-0 w-[720px] h-auto min-h-[34px] shrink-0 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] justify-between">
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
                                                        <Icon name="ArrowDown" className="w-4 h-4 text-color-icon-neutral-tertiary" />
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
                                                icon="TextBold"
                                                size="small"
                                                variant="neutral"
                                                className={editor?.isActive('bold') ? "bg-icon_button-color-neutral-hover" : ""}
                                                boundary="none"
                                                onClick={() => editor?.chain().focus().toggleBold().run()}
                                            />
                                            <IconButton
                                                icon="TextItalic"
                                                size="small"
                                                variant="neutral"
                                                className={editor?.isActive('italic') ? "bg-icon_button-color-neutral-hover" : ""}
                                                boundary="none"
                                                onClick={() => editor?.chain().focus().toggleItalic().run()}
                                            />
                                            <IconButton
                                                icon="TextUnderline"
                                                size="small"
                                                variant="neutral"
                                                className={editor?.isActive('underline') ? "bg-icon_button-color-neutral-hover" : ""}
                                                boundary="none"
                                                onClick={() => editor?.chain().focus().toggleUnderline?.().run()}
                                            />
                                        </div>

                                        <Separator orientation="vertical" className="!h-6 bg-color-border-neutral-default" />

                                        <div className="flex items-center gap-1 shrink-0">
                                            <IconButton
                                                icon="TextalignLeft"
                                                size="small"
                                                variant="neutral"
                                                className={(editor?.isActive({ textAlign: 'left' }) || (!editor?.isActive({ textAlign: 'center' }) && !editor?.isActive({ textAlign: 'right' }) && !editor?.isActive({ textAlign: 'justify' }))) ? "bg-icon_button-color-neutral-hover" : ""}
                                                boundary="none"
                                                onClick={() => handleTextAlign('left')}
                                            />
                                            <IconButton
                                                icon="TextalignCenter"
                                                size="small"
                                                variant="neutral"
                                                className={editor?.isActive({ textAlign: 'center' }) ? "bg-icon_button-color-neutral-hover" : ""}
                                                boundary="none"
                                                onClick={() => handleTextAlign('center')}
                                            />
                                            <IconButton
                                                icon="TextalignRight"
                                                size="small"
                                                variant="neutral"
                                                className={editor?.isActive({ textAlign: 'right' }) ? "bg-icon_button-color-neutral-hover" : ""}
                                                boundary="none"
                                                onClick={() => handleTextAlign('right')}
                                            />
                                            <IconButton
                                                icon="TextalignJustifycenter"
                                                size="small"
                                                variant="neutral"
                                                className={editor?.isActive({ textAlign: 'justify' }) ? "bg-icon_button-color-neutral-hover" : ""}
                                                boundary="none"
                                                onClick={() => handleTextAlign('justify')}
                                            />
                                        </div>

                                        <Separator orientation="vertical" className="!h-6 bg-color-border-neutral-default" />

                                        <div className="flex items-center gap-1 shrink-0">
                                            <IconButton
                                                icon="Link2"
                                                size="small"
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
                                                icon="Image"
                                                size="small"
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
                                            <IconButton icon="Edit" size="small" variant="neutral" boundary="none" onClick={() => console.log('At clicked')} />
                                            <IconButton icon="Share" size="small" variant="neutral" boundary="none" onClick={handleShare} />
                                        </div>
                                    </div>

                                    <div className="flex-1 bg-white relative border border-color-border-neutral-default overflow-hidden w-[720px]">
                                        <TextEditor
                                            className="w-full h-full p-6 text-color-text-neutral-default"
                                            placeholder="Type your notes here"
                                            onEditorReady={setEditor}
                                            content={noteContent}
                                            onChange={setNoteContent}
                                        />
                                    </div>

                                    <div className="flex items-center justify-end px-0 py-3 gap-3 shrink-0 w-[720px]">
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
                                        icon="Send"
                                        className="bg-transparent"
                                        iconClassName={cn("transition-transform duration-300", isEnlargeOpen && "rotate-180")}
                                        size="small"
                                        variant="neutral"
                                        boundary="none"
                                        aria-label="Open enlarge view"
                                        onClick={() => {
                                            setIsEnlargeOpen(true);
                                            onSend?.(true);
                                        }}
                                    />
                                    <IconButton
                                        icon="Export"
                                        className="bg-transparent"
                                        size="small"
                                        variant="neutral"
                                        boundary="none"
                                        aria-label="Share as PDF"
                                        onClick={handleShare}
                                    />
                                    <IconButton
                                        icon="ArrowDown"
                                        className="bg-transparent"
                                        iconClassName={cn("transition-transform duration-300 rotate-180", isExpanded && "rotate-0")}
                                        size="small"
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
