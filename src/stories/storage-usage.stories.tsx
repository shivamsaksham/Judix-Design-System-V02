import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { StorageUsage } from '@/components/block/storage-usage';

const meta: Meta<typeof StorageUsage> = {
  title: 'Block/StorageUsage',
  component: StorageUsage,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    usedBytes: 312 * 1024 * 1024,
    totalBytes: 1024 * 1024 * 1024,
  },
};

export default meta;
type Story = StoryObj<typeof StorageUsage>;

export const Default: Story = {};

export const NearlyFull: Story = {
  args: {
    usedBytes: 950 * 1024 * 1024,
  },
};

export const Full: Story = {
  args: {
    usedBytes: 1024 * 1024 * 1024,
  },
};

export const NoStorage: Story = {
  args: {
    usedBytes: 0,
    totalBytes: 0,
  },
};
