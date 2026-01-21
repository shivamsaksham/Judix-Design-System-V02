import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

const meta = {
    title: 'UI/Tooltip',
    component: Tooltip,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="neutral">Hover me</Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Tooltip content</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    ),
};

export const Rename: Story = {
    render: () => (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="neutral" size="small">Hover to see action</Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Rename</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    ),
};

export const AllPositions: Story = {
    render: () => (
        <TooltipProvider>
            <div className="flex gap-8 items-center justify-center p-20">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="neutral" size="small">Top</Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                        <p>Tooltip on top</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="neutral" size="small">Right</Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        <p>Tooltip on right</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="neutral" size="small">Bottom</Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        <p>Tooltip on bottom</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="neutral" size="small">Left</Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                        <p>Tooltip on left</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    ),
};

export const WithIcon: Story = {
    render: () => (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="neutral" prefixIcon="InfoCircle">Info</Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>This is helpful information</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    ),
};

export const LongText: Story = {
    render: () => (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="neutral">Hover for details</Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                    <p>This is a longer tooltip with more detailed information that wraps to multiple lines.</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    ),
};

export const Multiple: Story = {
    render: () => (
        <TooltipProvider>
            <div className="flex gap-4">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button>Button 1</Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Tooltip 1</p>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="neutral">Button 2</Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Tooltip 2</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    ),
};
