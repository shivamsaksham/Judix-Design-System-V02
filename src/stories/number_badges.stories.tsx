import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React from 'react';
import { NumberBadge } from '@/components/ui/number_badges';

const meta: Meta<typeof NumberBadge> = {
  title: 'UI/NumberBadge',
  component: NumberBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['solid', 'subtle'],
    },
    shape: {
      control: 'radio',
      options: ['rounded', 'circle'],
    },
    size: {
      control: 'select',
      options: ['large', 'medium', 'small'],
    },
    children: {
      control: 'text',
    },
  },
  args: {
    children: '5',
    variant: 'subtle',
    shape: 'rounded',
    size: 'large',
  },
};

export default meta;
type Story = StoryObj<typeof NumberBadge>;

export const Default: Story = {
  args: {
    children: '5',
  },
};

export const DesignGallery: Story = {
  name: "Full Design Gallery",
  render: (args) => (
    <div className="grid grid-cols-4 grid-rows-3 gap-4 p-4 bg-gray-50 rounded-lg">
      {(['large', 'medium', 'small'] as const).flatMap((size) =>
        (['subtle', 'solid'] as const).flatMap((variant) =>
          (['rounded', 'circle'] as const).map((shape) => (
            <NumberBadge
              key={`${size}-${variant}-${shape}`}
              {...args}
              size={size}
              variant={variant}
              shape={shape}
            />
          ))
        )
      )}
    </div>
  ),
};