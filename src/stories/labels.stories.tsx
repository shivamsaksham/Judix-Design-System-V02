import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React from 'react';
import { fn } from 'storybook/test';
import { Label } from '@/components/ui/labels';

const meta: Meta<typeof Label> = {
  title: 'UI/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text' },
    colorScheme: {
      control: 'radio',
      options: ['primary', 'neutral'],
    },
    size: {
      control: 'select',
      options: ['large', 'medium', 'small'],
    },
    showDot: { control: 'boolean' },
    badgeContent: { control: 'text' },
  },
  args: {
    children: 'Label',
    colorScheme: 'neutral',
    size: 'medium',
    showDot: false,
    badgeContent: '',
    onRemove: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {};

export const DesignGallery: Story = {
  name: "Full Design Gallery",
  render: (args) => (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg">
      {(['neutral', 'primary'] as const).map(colorScheme => (
        <div key={colorScheme} className="flex flex-col gap-2">
          {(['large', 'medium', 'small'] as const).map(size => (
            <div key={size} className="flex items-center gap-3">
              <Label {...args} colorScheme={colorScheme} size={size} badgeContent={undefined} onRemove={undefined} showDot={false} />
              <Label {...args} colorScheme={colorScheme} size={size} badgeContent="5" onRemove={undefined} showDot={false}/>
              <Label {...args} colorScheme={colorScheme} size={size} onRemove={() => {}} badgeContent={undefined} showDot={false} />
              <Label {...args} colorScheme={colorScheme} size={size} showDot badgeContent={undefined} onRemove={undefined} />
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};