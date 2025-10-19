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
      options: ['primary', 'neutral'],
    },
    shape: {
      control: 'radio',
      options: ['sharp', 'rounded'],
    },
    size: {
      control: 'select',
      options: ['xs', 's', 'md'],
    },
    children: {
      control: 'text',
    },
  },
  args: {
    children: '5',
    variant: 'primary',
    shape: 'sharp',
    size: 'md',
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
      {(['md', 's', 'xs'] as const).flatMap((size) =>
        (['neutral', 'primary'] as const).flatMap((variant) =>
          (['sharp', 'rounded'] as const).map((shape) => (
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