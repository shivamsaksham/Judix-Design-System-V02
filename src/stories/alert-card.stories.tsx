import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import AlertCard from '@/components/block/alert-card';

const meta: Meta<typeof AlertCard> = {
  title: 'Block/AlertCard',
  component: AlertCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    hideAble: true,
    onButtonClick: fn(),
    children: (
      <p className="alert_card-font-content">
        You do not currently have access to this report.
      </p>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof AlertCard>;

export const Default: Story = {};

export const Persistent: Story = {
  args: {
    hideAble: false,
  },
};
