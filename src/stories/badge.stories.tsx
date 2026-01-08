import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '@/components/ui/badge';
import { Icon } from 'judix-icon';

const meta = {
    title: 'UI/Badge',
    component: Badge,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'secondary', 'destructive', 'outline'],
        },
    },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: 'Badge',
        variant: 'default',
    },
};

export const Secondary: Story = {
    args: {
        children: 'Secondary',
        variant: 'secondary',
    },
};

export const Destructive: Story = {
    args: {
        children: 'Destructive',
        variant: 'destructive',
    },
};

export const Outline: Story = {
    args: {
        children: 'Outline',
        variant: 'outline',
    },
};

export const WithIcon: Story = {
    render: () => (
        <div className="flex gap-3">
            <Badge variant="default">
                <Icon name="Star" className="w-3 h-3" />
                Featured
            </Badge>
            <Badge variant="secondary">
                <Icon name="InfoCircle" className="w-3 h-3" />
                Info
            </Badge>
            <Badge variant="destructive">
                <Icon name="Danger" className="w-3 h-3" />
                Warning
            </Badge>
        </div>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-wrap gap-3">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
        </div>
    ),
};

export const StatusBadges: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            <div className="flex gap-2">
                <Badge variant="outline">Todo</Badge>
                <Badge variant="secondary">In Progress</Badge>
                <Badge variant="default">Completed</Badge>
                <Badge variant="destructive">Cancelled</Badge>
            </div>
            <div className="flex gap-2">
                <Badge variant="default">
                    <Icon name="TickCircle" className="w-3 h-3" />
                    Active
                </Badge>
                <Badge variant="secondary">
                    <Icon name="Clock" className="w-3 h-3" />
                    Away
                </Badge>
                <Badge variant="outline">
                    <Icon name="CloseCircle" className="w-3 h-3" />
                    Offline
                </Badge>
            </div>
        </div>
    ),
};
