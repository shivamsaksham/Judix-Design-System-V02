import type { Meta, StoryObj } from '@storybook/react';
import { JudgmentNudgeTile } from '@/components/block/judgment-nudge-tile';

const sampleTileData = {
    id: 'judgment-1',
    index: '01',
    title: 'Justice K.S. Puttaswamy (Retd.) & Anr. v. Union of India & Ors.',
    citation: '[2010] 1 S.C.R. 212',
    court: 'Supreme Court of India',
    year: '2017',
    bench: '9-judge bench',
    summary: 'Unanimously held that privacy is a fundamental right under Article 21. Landmark ruling that shaped the constitutional framework for data protection, surveillance, and Aadhaar legislation.',
    matchPercentage: '94%',
    description: 'Sample judgment description',
};

const meta = {
    component: JudgmentNudgeTile,    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    argTypes: {
        selectionState: {
            control: 'radio',
            options: ['default', 'selected', 'unselected'],
        },
        onClick: { action: 'clicked' },
    },
} satisfies Meta<typeof JudgmentNudgeTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        ...sampleTileData,
        selectionState: 'default',
    },
};

export const Selected: Story = {
    args: {
        ...sampleTileData,
        index: '03',
        selectionState: 'selected',
    },
};

export const Unselected: Story = {
    args: {
        ...sampleTileData,
        index: '02',
        selectionState: 'unselected',
    },
};
