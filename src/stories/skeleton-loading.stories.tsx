import type { Meta, StoryObj } from '@storybook/react';
import { SkeletonLoading } from '../components/ui/skeleton-loading';

const meta = {
  title: 'UI/SkeletonLoading',
  component: SkeletonLoading,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SkeletonLoading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: 'w-[200px] h-[40px]',
  },
};

export const Circular: Story = {
  args: {
    variant: 'circular',
    className: 'w-12 h-12',
  },
};

export const ChatTileStructure: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-[280px]">
      <div className="flex items-center space-x-4 p-2 bg-color-surface-neutral-default rounded-lg border border-color-border-neutral-default">
        <SkeletonLoading variant="circular" className="h-8 w-8 shrink-0" />
        <div className="space-y-2 flex-1">
          <SkeletonLoading className="h-4 w-[80%]" />
          <SkeletonLoading className="h-4 w-[60%]" />
        </div>
      </div>
      
      {/* Mimicking History Tile exactly */}
      <div className="flex items-center justify-between p-2 py-[6px] w-full rounded-lg">
         <SkeletonLoading className="h-4 w-3/4" />
         <SkeletonLoading variant="circular" className="h-5 w-5 shrink-0" />
      </div>
    </div>
  ),
};
