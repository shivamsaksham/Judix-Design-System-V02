import type { Meta, StoryObj } from "@storybook/react";
import { NotesCard } from "@/components/block/notes-card";
import { downloadNotesAsPDF } from "@/components/block/notes-pdf-generator";

const meta = {
    title: "Block/NotesCard",
    component: NotesCard,
    parameters: {
        layout: "fullscreen",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof NotesCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Centered: Story = {
    args: {
        defaultExpanded: true,
        title: "Notes",
        onExpandChange: (expanded) => console.log("Expanded state changed:", expanded),
        onMaximize: () => console.log("Maximize clicked"),
        onOpenInNewTab: () => console.log("Open in new tab clicked"),
        onSend: (isOpen) => console.log("Send (Enlarge) clicked, new state:", isOpen),
        onShare: async (editor, title) => {
            if (editor) {
                await downloadNotesAsPDF(editor, title);
            }
        },
        onSave: (content) => console.log("Save clicked with content:", content),
        onCancel: () => console.log("Cancel clicked"),
        onAddFile: () => console.log("Add file clicked"),
        onEditFile: () => console.log("Edit file clicked"),
        onDeleteFile: () => console.log("Delete file clicked"),
        onImageUpload: (file, editor) => {
            console.log("Image upload clicked with file:", file.name);
            if (editor) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const result = e.target?.result as string;
                    if (result) {
                        editor.chain().focus().setImage({ src: result }).run();
                    }
                };
                reader.readAsDataURL(file);
            }
        },
    },
    render: (args) => (
        <div className="flex h-screen w-full items-start justify-start bg-white p-10">
            <NotesCard {...args} />
        </div>
    ),
};

export const Dynamic: Story = {
    args: {
        defaultExpanded: true,
        title: "Tasks",
        onExpandChange: (expanded) => console.log("Expanded state changed:", expanded),
        onMaximize: () => console.log("Maximize clicked"),
        onOpenInNewTab: () => console.log("Open in new tab clicked"),
        onSend: (isOpen) => console.log("Send (Enlarge) clicked, new state:", isOpen),
        onShare: () => console.log("Share clicked"),
        onSave: (content) => console.log("Save clicked with content:", content),
        onCancel: () => console.log("Cancel clicked"),
        onAddFile: () => console.log("Add file clicked"),
        onEditFile: () => console.log("Edit file clicked"),
        onDeleteFile: () => console.log("Delete file clicked"),
        onImageUpload: (file, editor) => {
            console.log("Image upload clicked with file:", file.name);
            if (editor) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const result = e.target?.result as string;
                    if (result) {
                        editor.chain().focus().setImage({ src: result }).run();
                    }
                };
                reader.readAsDataURL(file);
            }
        },
    },
    render: (args) => (
        <div className="flex items-start justify-center w-full h-[600px] pt-20">
            <NotesCard {...args} className="static translate-x-0 translate-y-0">
                <div className="p-4">
                    <ul className="list-disc pl-4 space-y-2 text-color-text-neutral-default">
                        <li>Buy groceries</li>
                        <li>Walk the dog</li>
                        <li>Finish project</li>
                    </ul>
                </div>
            </NotesCard>
        </div>
    ),
};
