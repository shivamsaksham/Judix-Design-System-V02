import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Separator } from '@/components/ui/separator';

const meta = {
    title: 'UI/Separator',
    component: Separator,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        orientation: {
            control: 'select',
            options: ['horizontal', 'vertical'],
        },
    },
} as Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
    render: () => (
        <div className="w-[300px] space-y-4">
            <div>
                <h4 className="text-sm font-medium">Section 1</h4>
                <p className="text-sm text-gray-600">Content for section 1</p>
            </div>
            <Separator />
            <div>
                <h4 className="text-sm font-medium">Section 2</h4>
                <p className="text-sm text-gray-600">Content for section 2</p>
            </div>
        </div>
    ),
};

export const Vertical: Story = {
    render: () => (
        <div className="flex h-20 items-center space-x-4">
            <div className="text-sm">Item 1</div>
            <Separator orientation="vertical" />
            <div className="text-sm">Item 2</div>
            <Separator orientation="vertical" />
            <div className="text-sm">Item 3</div>
        </div>
    ),
};
