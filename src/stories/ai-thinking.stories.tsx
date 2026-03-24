import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AiThinking } from '@/components/block/ai-thinking';

const meta: Meta<typeof AiThinking> = {
    title: 'Block/AiThinking',
    component: AiThinking,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
    },
};

export default meta;
type Story = StoryObj<typeof AiThinking>;

const sampleSteps = [
    {
        title: 'Understanding your legal query and managing context',
        description:
            'Application of anticipatory bail in hit and run case where the victim has died on spot in respect of motor vehicle acts. [year range - 2010 to 2024] [bench - 4] [keywords identified - anticipatory bail, hit and run, on spot death, bail application]',
        duration: '2.3 sec',
        completed: true,
    },
    {
        title: 'Scanning Supreme Court precedents and cross referencing High Court judgments',
        description: '16 case laws found from SCR. 26 judgments found from Delhi High Court',
        duration: '3.1 sec',
        completed: true,
    },
    {
        title: 'Interpreting acts and sections',
        description: 'IPC, Motor vehicle act',
        duration: '1.8 sec',
        completed: true,
    },
    {
        title: 'Ranking by relevancy and recency',
        description: 'Ranking the results and calculating the relevance score',
        duration: '1.3 sec',
        completed: false,
    },
    {
        title: 'Compiling citation backed AI reasoning',
        description: 'Generating the reasoning and analysis of your legal query backed by official sources',
        duration: '3.4 sec',
        completed: false,
    },
];

//  Collapsed 

export const Collapsed: Story = {
    args: {
        variant: 'collapsed',
        label: 'Judix is thinking...',
        badge: '4 of 6 steps',
        description: 'Understanding your legal query and managing context',
    },
};

//  Expanded 

export const Expanded: Story = {
    args: {
        variant: 'expanded',
        label: 'Judix is thinking...',
        badge: '4 of 6 steps',
        steps: sampleSteps,
        isExpanded: true,
    },
};

//  Completed 

export const Completed: Story = {
    args: {
        variant: 'completed',
        sourcesCount: 16,
        timeTaken: '115.64 sec',
    },
};

//  Interactive 

import { useState } from 'react';

export const InteractiveToggle: Story = {
    render: () => {
        const [variant, setVariant] = useState<'collapsed' | 'expanded' | 'completed'>('collapsed');

        return (
            <div className="flex flex-col gap-8 w-[780px]">
                <AiThinking
                    variant={variant}
                    label="Judix is thinking..."
                    badge="4 of 6 steps"
                    description="Understanding your legal query and managing context"
                    steps={sampleSteps}
                    isExpanded={variant === 'expanded'}
                    onToggle={(isExpanded) => {
                        if (isExpanded) {
                            setVariant('expanded');
                        } else {
                            setVariant('collapsed');
                        }
                    }}
                    onProNudgeYesClick={() => console.log('Judix-pro v1.6 chosen!')}
                    onProNudgeNoClick={() => console.log('Continuing without pro...')}
                />

                <div className="flex gap-4">
                    <button
                        onClick={() => setVariant('collapsed')}
                        className="px-4 py-2 bg-gray-100 rounded text-sm hover:bg-gray-200"
                    >
                        Set Collapsed
                    </button>
                    <button
                        onClick={() => setVariant('expanded')}
                        className="px-4 py-2 bg-gray-100 rounded text-sm hover:bg-gray-200"
                    >
                        Set Expanded
                    </button>
                    <button
                        onClick={() => setVariant('completed')}
                        className="px-4 py-2 bg-gray-100 rounded text-sm hover:bg-gray-200"
                    >
                        Set Completed
                    </button>
                </div>
            </div>
        );
    },
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-4 w-[780px]">
            <AiThinking
                variant="collapsed"
                label="Judix is thinking..."
                badge="4 of 6 steps"
                description="Understanding your legal query and managing context"
            />
            <AiThinking
                variant="expanded"
                label="Judix is thinking..."
                badge="4 of 6 steps"
                steps={sampleSteps}
                isExpanded={true}
            />
            <AiThinking variant="completed" sourcesCount={16} timeTaken="115.64 sec"/>
        </div>
    ),
};
