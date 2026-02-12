import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

const meta = {
    title: 'UI/Resizable',
    component: ResizablePanelGroup,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} as Meta<typeof ResizablePanelGroup>;

export default meta;
type Story = StoryObj<typeof ResizablePanelGroup>;

export const Horizontal: Story = {
    render: () => (
        <ResizablePanelGroup direction="horizontal" className="w-[600px] h-[200px] rounded-lg border">
            <ResizablePanel defaultSize={50}>
                <div className="flex h-full items-center justify-center p-6">
                    <span className="font-semibold">Panel 1</span>
                </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
                <div className="flex h-full items-center justify-center p-6">
                    <span className="font-semibold">Panel 2</span>
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    ),
};

export const Vertical: Story = {
    render: () => (
        <ResizablePanelGroup direction="vertical" className="w-[400px] h-[400px] rounded-lg border">
            <ResizablePanel defaultSize={50}>
                <div className="flex h-full items-center justify-center p-6">
                    <span className="font-semibold">Top Panel</span>
                </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
                <div className="flex h-full items-center justify-center p-6">
                    <span className="font-semibold">Bottom Panel</span>
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    ),
};

export const ThreePanels: Story = {
    render: () => (
        <ResizablePanelGroup direction="horizontal" className="w-[800px] h-[200px] rounded-lg border">
            <ResizablePanel defaultSize={25}>
                <div className="flex h-full items-center justify-center p-6">
                    <span className="font-semibold">Sidebar</span>
                </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
                <div className="flex h-full items-center justify-center p-6">
                    <span className="font-semibold">Main Content</span>
                </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={25}>
                <div className="flex h-full items-center justify-center p-6">
                    <span className="font-semibold">Details</span>
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    ),
};
