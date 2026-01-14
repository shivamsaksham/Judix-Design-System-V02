import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { cn } from "@/lib/utils";
import { useEffect, useState } from 'react';

import TextAlign from '@tiptap/extension-text-align';

import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';

export interface RichTextEditorProps {
    content?: string;
    onChange?: (content: string) => void;
    className?: string;
    placeholder?: string;
    onEditorReady?: (editor: Editor) => void;
}

export function TextEditor({ content = "", onChange, className, placeholder, onEditorReady }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: placeholder || "Type something...",
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                autolink: true,
                defaultProtocol: 'https',
            }),
            Image,
        ],
        content: content,
        editorProps: {
            attributes: {
                class: cn(
                    "prose prose-sm sm:prose-base focus:outline-none w-full h-full resize-none bg-transparent p-4 text-size-textblock-bodytext text-color-text-neutral-default",
                    "[&_.is-editor-empty]:relative [&_.is-editor-empty:first-child::before]:absolute [&_.is-editor-empty:first-child::before]:left-0 [&_.is-editor-empty:first-child::before]:w-full [&_.is-editor-empty:first-child::before]:text-color-text-neutral-tertiary [&_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.is-editor-empty:first-child::before]:pointer-events-none",
                    className
                ),
            },
        },
        onCreate: ({ editor }) => {
            onEditorReady?.(editor);
        },
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            if (editor.getText() === "" && content === "") return;
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    const [, forceUpdate] = useState(0);

    useEffect(() => {
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

    if (!editor) {
        return null;
    }

    const isBold = editor.isActive('bold');
    const isItalic = editor.isActive('italic');
    const isUnderline = editor.isActive('underline');

    return (
        <EditorContent
            editor={editor}
            className={cn(
                "w-full h-full custom-scrollbar overflow-auto",
                isBold && "[&_.is-editor-empty:first-child::before]:font-bold",
                isItalic && "[&_.is-editor-empty:first-child::before]:italic",
                isUnderline && "[&_.is-editor-empty:first-child::before]:underline",
                "[&_a]:text-blue-500 [&_a]:underline [&_a]:cursor-pointer",
                "[&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-4",
                "[&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mb-3",
                "[&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mb-2",
                "[&_h4]:text-xl [&_h4]:font-bold [&_h4]:mb-2",
                "[&_h5]:text-lg [&_h5]:font-bold [&_h5]:mb-1",
                "[&_img]:max-w-full [&_img]:rounded-md [&_img]:my-2"
            )}
        />
    );
}
