import type { Meta, StoryObj } from '@storybook/react';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';

const meta = {
    title: 'UI/Drawer',
    component: Drawer,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Drawer>
            <DrawerTrigger asChild>
                <Button>Open Drawer</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Drawer Title</DrawerTitle>
                    <DrawerDescription>This is a drawer description.</DrawerDescription>
                </DrawerHeader>
                <div className="p-4">
                    <p className="text-sm">Drawer content goes here.</p>
                </div>
                <DrawerFooter>
                    <Button>Submit</Button>
                    <DrawerClose asChild>
                        <Button variant="neutral">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    ),
};

export const WithForm: Story = {
    render: () => (
        <Drawer>
            <DrawerTrigger asChild>
                <Button>Open Form</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Edit Profile</DrawerTitle>
                    <DrawerDescription>Make changes to your profile here.</DrawerDescription>
                </DrawerHeader>
                <div className="p-4 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <input type="text" className="w-full px-3 py-2 border rounded" placeholder="Your name" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <input type="email" className="w-full px-3 py-2 border rounded" placeholder="Your email" />
                    </div>
                </div>
                <DrawerFooter>
                    <Button>Save changes</Button>
                    <DrawerClose asChild>
                        <Button variant="neutral">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    ),
};
