import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { BookmarkDialog, Project } from "@/components/block/move-to-project";

const mockProjects: Project[] = [
    {
        id: "1",
        name: "Patna land case",
        description: "Land acquisition case filed in Patna HC. Respondent side."
    },
    {
        id: "2",
        name: "GST tax notice case",
        description: "GST notice tax refund case. Issue in filing of GSTR 3B"
    },
    {
        id: "3",
        name: "Non bailable offence lucknow",
        description:
            "A murder case in Lucknow. Petitioner side. A case of forced road accident."
    },
    {
        id: "4",
        name: "Corporate merger 2024",
        description: "Merger validation and due diligence docs."
    },
    {
        id: "5",
        name: "Family dispute resolution",
        description: "Mediation notes and settlement draft."
    }
];

const mockRecentProjects: Project[] = [
    {
        id: "1",
        name: "Patna HC A2 foundation case",
        description: ""
    },
    {
        id: "2",
        name: "Tax audit",
        description: ""
    }
];

const meta = {
    title: "Block/MoveToProject",
    component: BookmarkDialog,
    tags: ["autodocs"],
    parameters: {
        layout: "centered"
    },
    argTypes: {
        open: {
            control: "boolean",
            description: "Controls the visibility of the dialog"
        }
    },
    args: {
        open: true,
        projects: mockProjects,
        recentProjects: mockRecentProjects,
        onOpenChange: fn(),
        onSave: fn(),
        onCreateNewProject: fn()
    }
} as Meta<typeof BookmarkDialog>;

export default meta;
type Story = StoryObj<typeof BookmarkDialog>;

export const Default: Story = {};

export const Stateful: Story = {
    render: (args) => {
        const [open, setOpen] = React.useState(args.open);
        return (
            <BookmarkDialog 
                {...args} 
                open={open} 
                onOpenChange={(v) => {
                    setOpen(v);
                    args.onOpenChange(v);
                }} 
            />
        );
    }
};

export const WithNoRecentProjects: Story = {
    args: {
        recentProjects: []
    }
};
