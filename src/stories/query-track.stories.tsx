import type { Meta, StoryObj } from '@storybook/react';
import { QueryTrack } from '@/components/block/query-track';

const meta = {
    title: 'Block/Query Track',
    component: QueryTrack,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof QueryTrack>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleQueries = [
    { id: '1', text: 'Anticipatory bail in domestic viole...' },
    { id: '2', text: 'What types of evidence is accept...' },
    { id: '3', text: 'Get me Bombay high court ruling...' },
    { id: '4', text: 'What is the main issue in Ashok K...' },
    { id: '5', text: 'Compile a report on this matter' },
];

export const Default: Story = {
    args: {
        queries: sampleQueries,
        type: 'Query track',
    },
};
