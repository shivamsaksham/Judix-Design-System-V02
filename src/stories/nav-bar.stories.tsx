import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NavBar } from '@/components/block/nav-bar';

const meta: Meta<typeof NavBar> = {
    title: 'Block/NavBar',
    component: NavBar,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;
type Story = StoryObj<typeof NavBar>;

export const Default: Story = {
    args: {
        onIndependentClick: () => console.log('Independent clicked'),
        onContextClick: () => console.log('Context clicked'),
        onShareClick: () => console.log('Share clicked'),
        onMenuClick: () => console.log('Menu clicked'),
    },
};

export const NewChat: Story = {
    args: {
        isNewChat: true,
        onIndependentClick: () => console.log('Independent clicked'),
        onContextClick: () => console.log('Context clicked'),
        onShareClick: () => console.log('Share clicked'),
        onRename: () => console.log('Rename clicked'),
        onDelete: () => console.log('Delete clicked'),
    },
};

export const LoadedChat: Story = {
    args: {
        isNewChat: false,
        onIndependentClick: () => console.log('Independent clicked'),
        onContextClick: () => console.log('Context clicked'),
        onShareClick: () => console.log('Share clicked'),
    },
};

export const WithCustomClass: Story = {
    args: {
        className: 'shadow-lg',
        onIndependentClick: () => console.log('Independent clicked'),
        onContextClick: () => console.log('Context clicked'),
        onShareClick: () => console.log('Share clicked'),
        onMenuClick: () => console.log('Menu clicked'),
    },
};
