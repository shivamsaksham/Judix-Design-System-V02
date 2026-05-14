import type { Meta, StoryObj } from '@storybook/react';
import { LinkDialog } from '@/components/block/link-dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const meta = {
    title: 'Block/LinkDialog',
    component: LinkDialog,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {
        open: false,
        onOpenChange: () => {},
    },
} satisfies Meta<typeof LinkDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

const LinkDialogWithTrigger = (args: any) => {
    const [open, setOpen] = useState(false);
    return (
        <div>
            <Button onClick={() => setOpen(true)}>Open Link Dialog</Button>
            <LinkDialog 
                {...args} 
                open={open} 
                onOpenChange={setOpen} 
            />
        </div>
    );
};

export const Default: Story = {
    render: (args) => <LinkDialogWithTrigger {...args} />,
    args: {
        initialUrl: '',
        onSave: (url: string) => console.log('Saved URL:', url),
    },
};

export const WithInitialUrl: Story = {
    render: (args) => <LinkDialogWithTrigger {...args} />,
    args: {
        initialUrl: 'https://google.com',
        onSave: (url: string) => console.log('Saved URL:', url),
    },
};
