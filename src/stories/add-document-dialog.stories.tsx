import type { Meta, StoryObj } from '@storybook/react';
import { AddDocumentDialog } from '@/components/block/add-document-dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const meta: Meta<typeof AddDocumentDialog> = {
    title: 'Block/AddDocumentDialog',
    component: AddDocumentDialog,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        open: { control: 'boolean' }
    }
};

export default meta;
type Story = StoryObj<typeof AddDocumentDialog>;

// Helper component to test the dialog opening and closing in Storybook easily
const DialogDemo = (args: any) => {
    const [isOpen, setIsOpen] = useState(true); // Open by default for Storybook previews
    return (
        <div>
            <Button onClick={() => setIsOpen(true)}>Open Add Document Dialog</Button>
            <AddDocumentDialog {...args} open={isOpen} onOpenChange={setIsOpen} onCancelClick={() => setIsOpen(false)} />
        </div>
    );
};

export const Default: Story = {
    render: (args) => <DialogDemo {...args} />,
    args: {
        files: [],
        onDropzoneClick: () => alert('Opening file browser...'),
        onUploadClick: () => alert('Starting upload for 0 files?'),
    },
};

export const AddedState: Story = {
    render: (args) => <DialogDemo {...args} />,
    args: {
        files: [
            {
                fileName: 'Company Article of association.docx',
                fileSize: '5.6 MB',
                state: 'processing',
                progress: 30, // Approximately matches the teal bar width in the mockup
                onRemove: () => alert('Removed article of association'),
            },
            {
                fileName: 'Work Agreement.pdf',
                fileSize: '8.2 MB',
                state: 'processed',
                subtitle: 'Freelance Contract Agreement of Judix Technologies Private Limited',
                onRemove: () => alert('Removed work agreement'),
            }
        ],
        onAddMoreFilesClick: () => alert('Adding more files...'),
        onUploadClick: () => alert('Uploading 2 files!'),
    },
};

export const MixedStates: Story = {
    render: (args) => <DialogDemo {...args} />,
    args: {
        files: [
            {
                fileName: 'Company Article of association.docx',
                fileSize: '5.6 MB',
                state: 'processing',
                progress: 60,
                onRemove: () => {},
            },
            {
                fileName: 'Work Agreement.pdf',
                fileSize: '8.2 MB',
                state: 'processed',
                subtitle: 'Freelance Contract Agreement of Judix Technologies Private Limited',
                onRemove: () => {},
            },
            {
                fileName: 'Corrupt_File.pdf',
                fileSize: '1.2 MB',
                state: 'failed',
                onRemove: () => {},
                onRetry: () => alert('Retrying upload...'),
            }
        ],
        onAddMoreFilesClick: () => alert('Adding more files...'),
        onUploadClick: () => alert('Uploading valid files!'),
    },
};
