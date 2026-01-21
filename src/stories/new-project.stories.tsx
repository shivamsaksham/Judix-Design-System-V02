import type { Meta, StoryObj } from '@storybook/react';
import { NewProject } from '@/components/block/new-project';

const meta = {
    title: 'Block/NewProject',
    component: NewProject,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof NewProject>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmptyState: Story = {
    args: {
        titlePlaceholder: 'New Project',
        descriptionPlaceholder: 'Description of what this Space is for and how to use it',
        sectionTitle: 'Global context files',
        emptyStateText: 'Click to add project-wide global context information like case facts, client discussions etc.',
        initialContextFiles: [],
        onContextChange: (files) => console.log('Context changed:', files),
        onTitleChange: (title) => console.log('Title changed:', title),
        onDescriptionChange: (description) => console.log('Description changed:', description),
    },
};

export const WithContextFiles: Story = {
    args: {
        titlePlaceholder: 'Legal Research Project',
        descriptionPlaceholder: 'Organize your legal research, case files, and documentation in one place',
        sectionTitle: 'Case Documents',
        initialContextFiles: [
            {
                id: 'context-1',
                title: 'Factsheet of the case - signed and verified version',
                content: 'This is the factsheet content with case details...',
                lineCount: 101,
                fileType: 'TXT',
            },
            {
                id: 'context-2',
                title: 'Client discussions and analysis',
                content: 'Notes from client meetings and analysis...',
                lineCount: 42,
                fileType: 'TXT',
            },
            {
                id: 'context-3',
                title: 'Earlier court details and data',
                content: 'Historical court case information and precedents...',
                lineCount: 76,
                fileType: 'TXT',
            },
        ],
        onContextChange: (files) => console.log('Context changed:', files),
        onTitleChange: (title) => console.log('Title changed:', title),
        onDescriptionChange: (description) => console.log('Description changed:', description),
    },
};
