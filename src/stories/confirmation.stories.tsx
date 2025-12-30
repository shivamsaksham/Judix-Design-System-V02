import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import Confirmation from '@/components/block/confirmation';
import { Button } from '@/components/ui/button';

const meta: Meta<typeof Confirmation> = {
  title: 'Block/Confirmation',
  component: Confirmation,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    mainText: 'Delete workspace?',
    subText: 'This action cannot be undone.',
    onConfirmClick: fn(),
    onCancelClick: fn(),
    children: (
      <Button variant="destructive">Delete Workspace</Button>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NeutralTrigger: Story = {
  args: {
    children: <Button variant="neutral">Open Confirmation</Button>,
  },
};
