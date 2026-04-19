import type { Meta, StoryObj } from '@storybook/react';
import { JudgmentNudge } from '@/components/block/judgment-nudge';
import { useState } from 'react';

const sampleJudgment = {
    title: 'Justice K.S. Puttaswamy (Retd.) & Anr. v. Union of India & Ors.',
    citation: '[2010] 1 S.C.R. 212',
    court: 'Supreme Court of India',
    date: '24 August 2017',
    bench: '9-judge bench',
    summary: 'Unanimously held that privacy is a fundamental right under Article 21. Landmark ruling that shaped the constitutional framework for data protection, surveillance, and Aadhaar legislation.',
    description: 'Sample description for judgment nudge snippet.',
};

const meta = {
    title: 'Block/JudgmentNudge',
    component: JudgmentNudge,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    argTypes: {
        onToggleExpand: { action: 'onToggleExpand' },
        onConfirm: { action: 'onConfirm' },
        onReject: { action: 'onReject' },
    },
} satisfies Meta<typeof JudgmentNudge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ExpandedUnconfirmed: Story = {
    args: {
        ...sampleJudgment,
        isConfirmed: false,
        isExpanded: true,
    },
};

export const CollapsedUnconfirmed: Story = {
    args: {
        ...sampleJudgment,
        isConfirmed: false,
        isExpanded: false,
    },
};

export const ExpandedConfirmed: Story = {
    args: {
        ...sampleJudgment,
        isConfirmed: true,
        isExpanded: true,
    },
};

export const CollapsedConfirmed: Story = {
    args: {
        ...sampleJudgment,
        isConfirmed: true,
        isExpanded: false,
    },
};

export const Interactive: Story = {
    args: { ...sampleJudgment },
    render: (args) => {
        const [isConfirmed, setIsConfirmed] = useState(false);
        const [isExpanded, setIsExpanded] = useState(true);

        return (
            <div className="flex flex-col gap-8 max-w-[800px]">
                <JudgmentNudge
                    {...sampleJudgment}
                    isConfirmed={isConfirmed}
                    isExpanded={isExpanded}
                    onToggleExpand={setIsExpanded}
                    onConfirm={() => {
                        console.log('Confirmed!');
                        setIsConfirmed(true);
                        // Optional UX pattern: auto collapse after confirm
                        // setIsExpanded(false); 
                    }}
                    onReject={() => {
                        console.log('Rejected!');
                    }}
                />

                <div className="flex gap-4 items-center bg-color-surface-neutral-subtle p-4 rounded border border-color-border-neutral-default mt-10">
                    <span className="text-sm font-semibold text-color-text-neutral-default">Story Controls:</span>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 text-color-text-neutral-default"
                    >
                        Toggle Expand State
                    </button>
                    <button
                        onClick={() => setIsConfirmed(!isConfirmed)}
                        className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 text-color-text-neutral-default"
                    >
                        Toggle Confirmed State
                    </button>
                </div>
            </div>
        );
    },
};
