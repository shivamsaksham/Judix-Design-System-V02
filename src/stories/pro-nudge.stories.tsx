import type { Meta, StoryObj } from '@storybook/react';
import { ProNudge } from '@/components/block/pro-nudge';

const meta = {
  title: 'Block/ProNudge',
  component: ProNudge,
  parameters: {
    layout: 'fullscreen', // important: gives full width
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

export const Default: Story = {
  args: {},
  render: (args) => (
    <div className="w-full max-w-screen-lg mx-auto p-4 bg-color-surface-neutral-default">
      
      <p className="text-xs text-color-text-neutral-secondary mb-3">
        Note: Resize the viewport (or use Storybook’s device toolbar) to view the mobile layout.
      </p>

      <ProNudge {...args} />
    </div>
  ),
};