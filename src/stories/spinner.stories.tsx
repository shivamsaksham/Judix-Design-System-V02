import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Spinner } from '@/components/ui/spinner';

const meta: Meta<typeof Spinner> = {
  title: 'UI/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    size: 'medium',
    label: 'Loading',
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Medium: Story = {};

export const Small: Story = {
  args: {
    size: 'small',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
  },
};
