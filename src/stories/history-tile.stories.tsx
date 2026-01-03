import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HistoryTile, type HistoryTileProps } from '@/components/block/history-tile';

const meta: Meta<typeof HistoryTile> = {
    title: 'Block/HistoryTile',
    component: HistoryTile,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    args: {
        title: 'Anticipatory bail in domestic violence cases',
        onClick: () => console.log('Tile clicked'),
        onMenuClick: () => console.log('Menu clicked'),
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        title: 'Anticipatory bail in domestic violence cases',
    },
};

export const LongText: Story = {
    args: {
        title: 'This is a very long title that should be truncated with an ellipsis when it exceeds the available width of the container',
    },
};

export const Active: Story = {
    args: {
        title: 'Selected conversation',
        isActive: true,
    },
};

export const ShortText: Story = {
    args: {
        title: 'Hello',
    },
};

export const MultipleTiles: Story = {
    render: () => (
        <div className="w-[300px] space-y-2">
            <HistoryTile
                title="Anticipatory bail in domestic violence cases"
                onClick={() => console.log('Tile 1 clicked')}
                onMenuClick={() => console.log('Menu 1 clicked')}
            />
            <HistoryTile
                title="Property dispute resolution"
                onClick={() => console.log('Tile 2 clicked')}
                onMenuClick={() => console.log('Menu 2 clicked')}
                isActive
            />
            <HistoryTile
                title="Contract law basics"
                onClick={() => console.log('Tile 3 clicked')}
                onMenuClick={() => console.log('Menu 3 clicked')}
            />
            <HistoryTile
                title="This is a very long conversation title that will be truncated"
                onClick={() => console.log('Tile 4 clicked')}
                onMenuClick={() => console.log('Menu 4 clicked')}
            />
        </div>
    ),
};
