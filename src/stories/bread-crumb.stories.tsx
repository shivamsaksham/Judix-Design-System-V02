import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Breadcrumb from '@/components/block/bread-crumb';

const meta: Meta<typeof Breadcrumb> = {
    title: 'Block/Breadcrumb',
    component: Breadcrumb,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        onDropdownClick: { action: 'dropdown clicked' },
    },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

const defaultItems = [
    { id: '1', label: 'Home', onClick: () => console.log('Home clicked') },
    { id: '2', label: 'Projects', onClick: () => console.log('Projects clicked') },
    { id: '3', label: 'Legal Case Analysis', onClick: () => console.log('Case clicked') },
];

export const Default: Story = {
    args: {
        items: defaultItems,
    },
};

export const WithDropdown: Story = {
    args: {
        items: defaultItems,
        showDropdown: true,
    },
};

export const SingleItem: Story = {
    args: {
        items: [{ id: '1', label: 'Home', onClick: () => console.log('Home clicked') }],
    },
};

export const WithLongLabels: Story = {
    args: {
        items: [
            { id: '1', label: 'Home', onClick: () => console.log('Home clicked') },
            { id: '2', label: 'Very Long Project Name That Might Truncate', onClick: () => console.log('Project clicked') },
            { id: '3', label: 'Specific Judgment File', onClick: () => console.log('File clicked') },
        ],
        className: 'max-w-lg',
    },
};

export const NonClickableItems: Story = {
    args: {
        items: [
            { id: '1', label: 'Home', onClick: () => console.log('Home clicked') },
            { id: '2', label: 'Middle Step (Static)', onClick: undefined },
            { id: '3', label: 'Current Page', onClick: () => console.log('Current clicked') },
        ],
    },
};

export const WithUseProjectButton: Story = {
    args: {
        items: [
            { id: '1', label: 'Shridhar Apartment Case', onClick: () => console.log('Case clicked') },
            { id: '2', label: 'Chats', onClick: () => console.log('Chats clicked') },
            { id: '3', label: 'Anticipatory bail in domestic violence cases', onClick: () => console.log('Chat clicked') },
        ],
        onUseProject: () => console.log('Use project clicked'),
        showDropdown: true,
        className: 'w-[800px]',
    },
};
