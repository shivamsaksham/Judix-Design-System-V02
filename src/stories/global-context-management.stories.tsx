import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GlobalContextManagement } from '@/components/block/global-context-management';

const meta: Meta<typeof GlobalContextManagement> = {
    title: 'Block/GlobalContextManagement',
    component: GlobalContextManagement,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
    },
};

export default meta;
type Story = StoryObj<typeof GlobalContextManagement>;

export const EmptyState: Story = {
    args: {
        initialContextFiles: [],
        onContextChange: (files) => console.log('Context changed:', files),
    },
};

export const WithThreeFiles: Story = {
    args: {
        initialContextFiles: [
            {
                id: 'story-1',
                title: 'Factsheet of the case - signed and verified version',
                content: 'This is the factsheet content with case details...',
                lineCount: 101,
                fileType: 'TXT',
            },
            {
                id: 'story-2',
                title: 'Client discussions and analysis',
                content: 'Notes from client meetings and analysis...',
                lineCount: 42,
                fileType: 'TXT',
            },
            {
                id: 'story-3',
                title: 'Earlier court details and data',
                content: 'Historical court case information and precedents...',
                lineCount: 76,
                fileType: 'TXT',
            },
        ],
        onContextChange: (files) => console.log('Context changed:', files),
    },
};

export const WithManyFiles: Story = {
    args: {
        initialContextFiles: [
            {
                id: 'many-1',
                title: 'Factsheet of the case - signed and verified version',
                content: 'This is the factsheet content with case details...',
                lineCount: 101,
                fileType: 'TXT',
            },
            {
                id: 'many-2',
                title: 'Client discussions and analysis',
                content: 'Notes from client meetings and analysis...',
                lineCount: 42,
                fileType: 'TXT',
            },
            {
                id: 'many-3',
                title: 'Earlier court details and data',
                content: 'Historical court case information and precedents...',
                lineCount: 76,
                fileType: 'TXT',
            },
            {
                id: 'many-4',
                title: 'Evidence documents',
                content: 'Evidence and supporting documentation...',
                lineCount: 234,
                fileType: 'PDF',
            },
            {
                id: 'many-5',
                title: 'Witness statements',
                content: 'Statements from witnesses...',
                lineCount: 156,
                fileType: 'DOCX',
            },
            {
                id: 'many-6',
                title: 'Legal precedents',
                content: 'Relevant legal precedents and case law...',
                lineCount: 89,
                fileType: 'PDF',
            },
        ],
        onContextChange: (files) => console.log('Context changed:', files),
    },
};

export const WithSingleFile: Story = {
    args: {
        initialContextFiles: [
            {
                id: 'single-1',
                title: 'Case summary',
                content: 'Summary of the case with key points...',
                lineCount: 45,
                fileType: 'TXT',
            },
        ],
        onContextChange: (files) => console.log('Context changed:', files),
    },
};

export const WithoutAddButton: Story = {
    args: {
        initialContextFiles: [
            {
                id: 'without-1',
                title: 'Factsheet of the case - signed and verified version',
                content: 'This is the factsheet content with case details...',
                lineCount: 101,
                fileType: 'TXT',
            },
            {
                id: 'without-2',
                title: 'Client discussions and analysis',
                content: 'Notes from client meetings and analysis...',
                lineCount: 42,
                fileType: 'TXT',
            },
        ],
        onContextChange: (files) => console.log('Context changed:', files),
    },
};

export const CustomEmptyStateText: Story = {
    args: {
        emptyStateText: 'No global context files added yet. Click here to add your first context file.',
        initialContextFiles: [],
        onContextChange: (files) => console.log('Context changed:', files),
    },
};
