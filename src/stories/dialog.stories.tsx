import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const meta = {
    title: 'UI/Dialog',
    component: Dialog,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} as Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
    render: () => (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Dialog Title</DialogTitle>
                    <DialogDescription>
                        This is a dialog description. It provides additional context about the dialog.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <p>Dialog content goes here.</p>
                </div>
            </DialogContent>
        </Dialog>
    ),
};

export const WithFooter: Story = {
    render: () => (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Open Dialog with Footer</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Action</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to proceed with this action?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="neutral" size="extraSmall">Cancel</Button>
                    <Button size="extraSmall">Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    ),
};

export const Controlled: Story = {
    render: () => {
        const [open, setOpen] = useState(false);

        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button>Open Controlled Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Controlled Dialog</DialogTitle>
                        <DialogDescription>
                            This dialog is controlled by state.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm">Click the button below to close.</p>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    },
};

export const LongContent: Story = {
    render: () => (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Open Long Dialog</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Long Content Dialog</DialogTitle>
                    <DialogDescription>
                        This dialog has a lot of content.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <p key={i} className="text-sm">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                    ))}
                </div>
                <DialogFooter>
                    <Button>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    ),
};
