import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { Checkbox } from '@/components/ui/checkbox';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'neutral'],
    },
    size: {
      control: { type: 'select' },
      options: ['large', 'medium', 'small', 'extraSmall'],
    },
    checked: {
      control: { type: 'boolean' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
  // Use `fn` to spy on the onCheckedChange arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onCheckedChange: fn() },
};

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary_Large: Story = {
  args: {
    variant: 'primary',
    size: 'large',
  },
};

export const Primary_Medium: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
  },
};

export const Primary_Small: Story = {
  args: {
    variant: 'primary',
    size: 'small',
  },
};

export const Primary_ExtraSmall: Story = {
  args: {
    variant: 'primary',
    size: 'extraSmall',
  },
};

export const Neutral_Large: Story = {
  args: {
    variant: 'neutral',
    size: 'large',
  },
};

export const Neutral_Medium: Story = {
  args: {
    variant: 'neutral',
    size: 'medium',
  },
};

export const Neutral_Small: Story = {
  args: {
    variant: 'neutral',
    size: 'small',
  },
};

export const Neutral_ExtraSmall: Story = {
  args: {
    variant: 'neutral',
    size: 'extraSmall',
  },
};

export const Primary_Large_Checked: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    checked: true,
  },
};

export const Primary_Medium_Checked: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    checked: true,
  },
};

export const Neutral_Large_Checked: Story = {
  args: {
    variant: 'neutral',
    size: 'large',
    checked: true,
  },
};

export const Neutral_Medium_Checked: Story = {
  args: {
    variant: 'neutral',
    size: 'medium',
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    variant: 'primary',
    size: 'medium',
  },
};

