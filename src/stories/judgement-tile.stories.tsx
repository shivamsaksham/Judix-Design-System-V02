import type { Meta, StoryObj } from '@storybook/react';
import { JudgementTile } from '@/components/block/judgement-tile';

const meta = {
    title: 'Block/JudgementTile',
    component: JudgementTile,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    argTypes: {
        onClick: { action: 'clicked' },
        onAdd: { action: 'added' },
        onBookmark: { action: 'bookmarked' },
        onMention: { action: 'mentioned' },
    },
} satisfies Meta<typeof JudgementTile>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleData = {
    title: 'Justice K.S. Puttaswamy (Retd.) & Anr. v. Union of India & Ors.',
    matchPercentage: '94%',
    citationCount: 128,
    description: 'Unanimously held that privacy is a fundamental right under Article 21. Landmark ruling that shaped the constitutional framework for data protection, surveillance, and Aadhaar legislation.',
    year: '2017',
    court: 'Supreme Court of India',
};

export const Default: Story = {
    args: {
        ...sampleData,
    },
};

export const Selected: Story = {
    args: {
        ...sampleData,
        isSelected: true,
    },
};

export const WithActions: Story = {
    args: {
        ...sampleData,
        isAdded: true,
        isBookmarked: false,
        isMentioned: true,
    },
};
