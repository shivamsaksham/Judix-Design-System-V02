import type { Meta, StoryObj } from '@storybook/react';
import { Artifacts } from '@/components/block/artifacts';

const meta = {
    title: 'Block/Artifacts',
    component: Artifacts,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        title: {
            control: 'text',
            description: 'Title text to display',
        },
        subtitle: {
            control: 'text',
            description: 'Subtitle text to display',
        },
        isResult: {
            control: 'boolean',
            description: 'Show "Results" label above the card',
        },
        onClick: {
            action: 'clicked',
            description: 'Click handler',
        },
    },
} satisfies Meta<typeof Artifacts>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CaseLaws: Story = {
    args: {
        title: 'CASE LAWS',
        subtitle: 'Found 23 results',
    },
};

export const ActsSections: Story = {
    args: {
        title: 'ACTS & SECTIONS',
        subtitle: '4 Acts identified',
    },
};

export const WithResultsLabel: Story = {
    args: {
        title: 'CASE LAWS',
        subtitle: 'Found 23 results',
        isResult: true,
    },
};

export const DifferentCounts: Story = {
    args: {
        title: 'CASE LAWS',
        subtitle: 'No results found',
    },
    render: () => (
        <div className="flex flex-col gap-4 w-[400px]">
            <Artifacts title="CASE LAWS" subtitle="Found 1 result" />
            <Artifacts title="CASE LAWS" subtitle="Found 5 results" />
            <Artifacts title="CASE LAWS" subtitle="Found 100 results" />
            <Artifacts title="ACTS & SECTIONS" subtitle="1 Act identified" />
            <Artifacts title="ACTS & SECTIONS" subtitle="10 Acts identified" />
        </div>
    ),
};

export const BothVariants: Story = {
    args: {
        title: 'CASE LAWS',
        subtitle: 'No results found',
    },
    render: () => (
        <div className="flex flex-col gap-4 w-[400px]">
            <Artifacts title="CASE LAWS" subtitle="Found 23 results" />
            <Artifacts title="ACTS & SECTIONS" subtitle="4 Acts identified" />
        </div>
    ),
};

export const Interactive: Story = {
    args: {
        title: 'CASE LAWS',
        subtitle: 'Found 15 results',
        onClick: () => alert('Artifact clicked!'),
    },
};

export const WithCustomStyling: Story = {
    args: {
        title: 'ACTS & SECTIONS',
        subtitle: '7 Acts identified',
        className: 'shadow-lg',
    },
};
