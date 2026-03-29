import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Progress } from '@/components/ui/progress';
import { useState, useEffect } from 'react';

const meta = {
    title: 'UI/Progress',
    component: Progress,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        value: {
            control: { type: 'range', min: 0, max: 100, step: 1 },
        },
    },
} as Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
    args: {
        value: 50,
        className: 'w-[300px]',
    },
};

export const Zero: Story = {
    args: {
        value: 0,
        className: 'w-[300px]',
    },
};

export const Complete: Story = {
    args: {
        value: 100,
        className: 'w-[300px]',
    },
};

export const Animated: Story = {
    render: () => {
        const [progress, setProgress] = useState(0);

        useEffect(() => {
            const timer = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) return 0;
                    return prev + 10;
                });
            }, 500);

            return () => clearInterval(timer);
        }, []);

        return <Progress value={progress} className="w-[300px]" />;
    },
};

export const DifferentSizes: Story = {
    render: () => (
        <div className="space-y-4">
            <Progress value={60} className="w-[200px]" />
            <Progress value={60} className="w-[300px]" />
            <Progress value={60} className="w-[400px]" />
        </div>
    ),
};
