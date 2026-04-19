import type { Meta, StoryObj } from '@storybook/react';
import { JudgmentSelectionList } from '@/components/block/judgment-selection-list';
import { useState } from 'react';

const sampleJudgments = [
    {
        index: '01',
        title: 'Justice K.S. Puttaswamy (Retd.) & Anr. v. Union of India & Ors.',
        citation: '[2010] 1 S.C.R. 212',
        court: 'Supreme Court of India',
        date: '24 August 2017',
        bench: '9-judge bench',
        summary: 'Unanimously held that privacy is a fundamental right under Article 21. Landmark ruling that shaped the constitutional framework for data protection, surveillance, and Aadhaar legislation.',
        matchPercentage: '94%',
        id: 'sample-id',
        year: '2017',
        description: 'Sample judgment description',
    },
    {
        index: '02',
        title: 'Justice K.S. Puttaswamy (Retd.) & Anr. v. Union of India & Ors.',
        citation: '[2010] 1 S.C.R. 212',
        court: 'Supreme Court of India',
        date: '24 August 2017',
        bench: '9-judge bench',
        summary: 'Unanimously held that privacy is a fundamental right under Article 21. Landmark ruling that shaped the constitutional framework for data protection, surveillance, and Aadhaar legislation.',
        matchPercentage: '94%',
        id: 'sample-id',
        year: '2017',
        description: 'Sample judgment description',
    },
    {
        index: '03',
        title: 'Justice K.S. Puttaswamy (Retd.) & Anr. v. Union of India & Ors.',
        citation: '[2010] 1 S.C.R. 212',
        court: 'Supreme Court of India',
        date: '24 August 2017',
        bench: '9-judge bench',
        summary: 'Unanimously held that privacy is a fundamental right under Article 21. Landmark ruling that shaped the constitutional framework for data protection, surveillance, and Aadhaar legislation.',
        matchPercentage: '94%',
        id: 'sample-id',
        year: '2017',
        description: 'Sample judgment description',
    }
];

const meta = {
    title: 'Block/JudgmentSelectionList',
    component: JudgmentSelectionList,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    argTypes: {
        onToggleExpand: { action: 'onToggleExpand' },
        onSelect: { action: 'onSelect' },
        onConfirm: { action: 'onConfirm' },
        onReject: { action: 'onReject' },
    },
} satisfies Meta<typeof JudgmentSelectionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultUnselected: Story = {
    args: {
        judgments: sampleJudgments,
        isConfirmed: false,
        isExpanded: true,
        selectedIndex: null,
    },
};

export const OneSelected: Story = {
    args: {
        judgments: sampleJudgments,
        isConfirmed: false,
        isExpanded: true,
        selectedIndex: 0,
    },
};

export const ConfirmedCollapsed: Story = {
    args: {
        ...sampleJudgments,
        judgments: sampleJudgments,
        isConfirmed: true,
        isExpanded: false,
        selectedIndex: 0,
    },
};

export const ManualSearch: Story = {
    args: {
        judgments: sampleJudgments,
        isConfirmed: false,
        isExpanded: false,
        defaultShowManualInput: true,
    },
};

export const Interactive: Story = {
    args: { judgments: sampleJudgments },
    render: (args) => {
        const [isConfirmed, setIsConfirmed] = useState(false);
        const [isExpanded, setIsExpanded] = useState(true);
        const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

        return (
            <div className="flex flex-col gap-8 max-w-[800px]">
                <JudgmentSelectionList
                    {...args}
                    isConfirmed={isConfirmed}
                    isExpanded={isExpanded}
                    selectedIndex={selectedIndex}
                    onToggleExpand={setIsExpanded}
                    onSelect={setSelectedIndex}
                    onConfirm={() => {
                        console.log('Confirmed!');
                        setIsConfirmed(true);
                        setIsExpanded(false);
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
                        onClick={() => {
                            setIsConfirmed(false);
                            setIsExpanded(true);
                            setSelectedIndex(null);
                        }}
                        className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 text-color-text-neutral-default"
                    >
                        Reset State
                    </button>
                </div>
            </div>
        );
    },
};
