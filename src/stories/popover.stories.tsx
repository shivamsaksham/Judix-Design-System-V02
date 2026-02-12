import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

const meta = {
    title: 'UI/Popover',
    component: Popover,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} as Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
    render: () => (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="neutral">Open Popover</Button>
            </PopoverTrigger>
            <PopoverContent>
                <div className="space-y-2">
                    <h4 className="font-medium">Popover Title</h4>
                    <p className="text-sm text-gray-600">This is the popover content.</p>
                </div>
            </PopoverContent>
        </Popover>
    ),
};

export const WithForm: Story = {
    render: () => (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="neutral">Settings</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="space-y-4">
                    <h4 className="font-medium">Settings</h4>
                    <div className="space-y-2">
                        <label className="text-sm">Name</label>
                        <input type="text" className="w-full px-3 py-2 border rounded" placeholder="Enter name" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm">Email</label>
                        <input type="email" className="w-full px-3 py-2 border rounded" placeholder="Enter email" />
                    </div>
                    <Button size="small" className="w-full">Save</Button>
                </div>
            </PopoverContent>
        </Popover>
    ),
};
