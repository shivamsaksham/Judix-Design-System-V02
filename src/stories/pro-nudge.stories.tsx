import type { Meta, StoryObj } from '@storybook/react';
import { ProNudge } from '@/components/block/pro-nudge';

const meta = {
    title: 'Block/ProNudge',
    component: ProNudge,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        onYesClick: { action: 'onYesClick' },
        onNoClick: { action: 'onNoClick' },
        className: { control: 'text' },
    },
} satisfies Meta<typeof ProNudge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultResponsive: Story = {
    args: {},
    render: (args) => (
        <div className="w-[1000px] max-w-full p-8 flex flex-col gap-8 bg-color-surface-neutral-default">
            {/* Wide container (desktop view) */}
            <div className="w-full">
                <p className="text-sm text-color-text-neutral-secondary mb-2">Desktop View (Wide)</p>
                <ProNudge {...args} />
            </div>

            {/* Narrow container (mobile view) */}
            <div className="w-[350px]">
                <p className="text-sm text-color-text-neutral-secondary mb-2">Mobile View (Narrow)</p>
                <ProNudge {...args} />
            </div>
        </div>
    )
};
