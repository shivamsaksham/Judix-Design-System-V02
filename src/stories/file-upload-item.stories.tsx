import type { Meta, StoryObj } from '@storybook/react';
import { FileUploadItem } from '@/components/block/file-upload-item';

const meta: Meta<typeof FileUploadItem> = {
    title: 'Block/FileUploadItem',
    component: FileUploadItem,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    decorators: [
        (Story) => (
            <div>
                <Story />
            </div>
        ),
    ],
    argTypes: {
        state: {
            control: 'radio',
            options: ['processing', 'processed', 'failed']
        },
        progress: {
            control: { type: 'range', min: 0, max: 100 }
        }
    }
};

export default meta;
type Story = StoryObj<typeof FileUploadItem>;

export const Processing: Story = {
    args: {
        fileName: 'Work Agreement.pdf',
        fileSize: '5.6 MB',
        state: 'processing',
        progress: 45,
        onRemove: () => alert('Removed'),
    },
};

export const Processed: Story = {
    args: {
        fileName: 'Work Agreement.pdf',
        fileSize: '8.2 MB',
        state: 'processed',
        subtitle: 'Freelance Contract Agreement of Judix Technologies Private Limited',
        onRemove: () => alert('Removed'),
    },
};

export const Failed: Story = {
    args: {
        fileName: 'Work Agreement.pdf',
        fileSize: '5.6 MB',
        state: 'failed',
        onRemove: () => alert('Removed'),
        onRetry: () => alert('Retrying Upload...'),
    },
};
