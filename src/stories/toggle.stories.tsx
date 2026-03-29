import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { Toggle } from '@/components/ui/toggle';

const meta: Meta<typeof Toggle> = {
  title: 'UI/Toggle',
  component: Toggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'neutral'],
    },
    size: {
      control: { type: 'select' },
      options: ['large', 'medium', 'small'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
    checked: {
      control: { type: 'boolean' },
    },
  },
  args: { onCheckedChange: fn() },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Primary_Large: Story = {
  args: {
    variant: 'primary',
    size: 'large',
  },
};

export const Primary_Large_Checked: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    checked: true,
  },
};

export const Primary_Medium: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
  },
};

export const Primary_Medium_Checked: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    checked: true,
  },
};

export const Primary_Small: Story = {
  args: {
    variant: 'primary',
    size: 'small',
  },
};

export const Primary_Small_Checked: Story = {
  args: {
    variant: 'primary',
    size: 'small',
    checked: true,
  },
};

export const Neutral_Large: Story = {
  args: {
    variant: 'neutral',
    size: 'large',
  },
};

export const Neutral_Large_Checked: Story = {
  args: {
    variant: 'neutral',
    size: 'large',
    checked: true,
  },
};

export const Neutral_Medium: Story = {
  args: {
    variant: 'neutral',
    size: 'medium',
  },
};

export const Neutral_Medium_Checked: Story = {
  args: {
    variant: 'neutral',
    size: 'medium',
    checked: true,
  },
};

export const Neutral_Small: Story = {
  args: {
    variant: 'neutral',
    size: 'small',
  },
};

export const Neutral_Small_Checked: Story = {
  args: {
    variant: 'neutral',
    size: 'small',
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    disabled: true,
  },
};

export const Disabled_Checked: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    disabled: true,
    checked: true,
  },
};
