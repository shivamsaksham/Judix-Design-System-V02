import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FileBar } from "@/components/block/file-bar";
import { FolderItem, FileItem } from "@/components/block/file-tree";

const meta: Meta<typeof FileBar> = {
    title: "Block/FileBar",
    component: FileBar,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FileBar>;

const generateMockData = (): (FolderItem | FileItem)[] => {
    const createSubFolders = (idPrefix: string) => [
        {
            id: `${idPrefix}-chats`,
            name: "Chats",
            type: "folder" as const,
            isOpen: false,
            children: [
                { id: `${idPrefix}-chat-1`, name: "Income tax evasion discussion", type: "file" as const, fileType: "chat" as const },
                { id: `${idPrefix}-chat-2`, name: "Anticipatory bail examination", type: "file" as const, fileType: "chat" as const },
                { id: `${idPrefix}-chat-3`, name: "Automatic stay in money decree situation", type: "file" as const, fileType: "chat" as const },
            ],
        },
        {
            id: `${idPrefix}-notes`,
            name: "Notes",
            type: "folder" as const,
            isOpen: false,
            children: [
                { id: `${idPrefix}-note-1`, name: "Case facts", type: "file" as const, fileType: "note" as const },
                { id: `${idPrefix}-note-2`, name: "Argument strategy", type: "file" as const, fileType: "note" as const },
                { id: `${idPrefix}-note-3`, name: "Personal analysis", type: "file" as const, fileType: "note" as const },
            ],
        },
        {
            id: `${idPrefix}-archive`,
            name: "Archive",
            type: "folder" as const,
            isOpen: false,
            children: [
                { id: `${idPrefix}-archive-1`, name: "Malwa Strips vs Commissioner of Income Tax", type: "file" as const, fileType: "archive" as const },
                { id: `${idPrefix}-archive-2`, name: "The state of Bihar vs Srikumar Rao", type: "file" as const, fileType: "archive" as const },
                { id: `${idPrefix}-archive-3`, name: "Income Tax Act, 1961 : sec 12,32", type: "file" as const, fileType: "archive" as const },
            ],
        },
    ];

    return [
        {
            id: "independent",
            name: "Independent",
            type: "folder",
            isOpen: false,
            children: createSubFolders("ind"),
        },
        {
            id: "project-1",
            name: "Shridhar apartment case",
            type: "folder",
            isOpen: false,
            children: createSubFolders("proj1"),
        },
        {
            id: "project-2",
            name: "Corporate Merger 2024 with a very long name to test truncation behavior in the file tree component",
            type: "folder",
            isOpen: false,
            children: createSubFolders("proj2"),
        },
    ];
};

export const Default: Story = {
    render: (args) => {
        const [activeId, setActiveId] = React.useState<string | undefined>(args.activeId);
        return (
            <FileBar
                {...args}
                activeId={activeId}
                onSelect={(node) => {
                    setActiveId(node.id);
                    args.onSelect?.(node);
                }}
            />
        );
    },
    args: {
        data: generateMockData(),
        className: "w-[342px] max-h-[660px] overflow-y-auto",
    },
};

export const SelectedItem: Story = {
    render: (args) => {
        const [activeId, setActiveId] = React.useState<string | undefined>(args.activeId);
        return (
            <FileBar
                {...args}
                activeId={activeId}
                onSelect={(node) => {
                    setActiveId(node.id);
                    args.onSelect?.(node);
                }}
            />
        );
    },
    args: {
        data: generateMockData(),
        activeId: "proj1-chat-1",
        className: "w-[400px] h-[600px]  rounded-xl",
    },
};
