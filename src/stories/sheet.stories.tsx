import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const meta = {
    title: 'UI/Sheet',
    component: Sheet,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} as Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof Sheet>;

export const Default: Story = {
    render: () => (
        <Sheet>
            <SheetTrigger asChild>
                <Button>Open Sheet</Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Sheet Title</SheetTitle>
                    <SheetDescription>This is a sheet description.</SheetDescription>
                </SheetHeader>
                <div className="py-4">
                    <p className="text-sm">Sheet content goes here.</p>
                </div>
            </SheetContent>
        </Sheet>
    ),
};

export const WithFooter: Story = {
    render: () => (
        <Sheet>
            <SheetTrigger asChild>
                <Button>Open Sheet</Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Edit Settings</SheetTitle>
                    <SheetDescription>Make changes to your settings here.</SheetDescription>
                </SheetHeader>
                <div className="py-4 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Username</label>
                        <input type="text" className="w-full px-3 py-2 border rounded" placeholder="Username" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Bio</label>
                        <textarea className="w-full px-3 py-2 border rounded" rows={3} placeholder="Tell us about yourself" />
                    </div>
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button variant="neutral">Cancel</Button>
                    </SheetClose>
                    <Button>Save</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    ),
};

export const LeftSide: Story = {
    render: () => (
        <Sheet>
            <SheetTrigger asChild>
                <Button>Open Left Sheet</Button>
            </SheetTrigger>
            <SheetContent side="left">
                <SheetHeader>
                    <SheetTitle>Left Sheet</SheetTitle>
                    <SheetDescription>This sheet opens from the left.</SheetDescription>
                </SheetHeader>
                <div className="py-4">
                    <p className="text-sm">Content here.</p>
                </div>
            </SheetContent>
        </Sheet>
    ),
};
