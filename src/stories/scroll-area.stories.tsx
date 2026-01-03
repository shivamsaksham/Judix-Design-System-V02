import type { Meta, StoryObj } from '@storybook/react';
import { ScrollArea } from '@/components/ui/scroll-area';

const meta = {
    title: 'UI/Scroll Area',
    component: ScrollArea,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
            <div className="space-y-4">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="text-sm">
                        Item {i + 1}: This is scrollable content
                    </div>
                ))}
            </div>
        </ScrollArea>
    ),
};

export const LongContent: Story = {
    render: () => (
        <ScrollArea className="h-[300px] w-[400px] rounded-md border p-4">
            <div className="space-y-2">
                <h4 className="font-medium">Long Content</h4>
                {Array.from({ length: 50 }).map((_, i) => (
                    <p key={i} className="text-sm">
                        Line {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                ))}
            </div>
        </ScrollArea>
    ),
};

export const HorizontalScroll: Story = {
    render: () => (
        <ScrollArea className="w-[400px] whitespace-nowrap rounded-md border">
            <div className="flex p-4 space-x-4">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="shrink-0 w-[150px] h-[100px] rounded-md bg-gray-100 flex items-center justify-center">
                        Card {i + 1}
                    </div>
                ))}
            </div>
        </ScrollArea>
    ),
};
