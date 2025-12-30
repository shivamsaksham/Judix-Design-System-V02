import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { IconButton } from '@/components/ui/icon-button';

const meta: Meta<typeof IconButton> = {
  title: 'UI/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'subtle', 'outline', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['large', 'medium', 'small', 'extraSmall'],
    },
    icon: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    icon: 'ClipboardText',
    disabled: false,
    variant: 'neutral',
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  args: {
    variant: 'primary',
  },
};

export const AllStyles: Story = {
  name: "Gallery of All Styles",
  render: (args) => (
    <div className="flex flex-col gap-8">
      {(["primary", "neutral", "primary_2_tone"] as const).map((variant) => (
        <div key={variant} className="flex items-center gap-4">
          <IconButton {...args} variant={variant} />
          <IconButton {...args} variant={variant} />
          <IconButton {...args} variant={variant} />
        </div>
      ))}
    </div>
  ),
  args: {
    size: 'large',
  },
};

export const Disabled: Story = {
  name: "Disabled States",
  render: (args) => (
    <div className="flex flex-col gap-8">
      {(["primary", "neutral", "primary_2_tone"] as const).map((variant) => (
        <div key={variant} className="flex items-center gap-4">
          <IconButton {...args} variant={variant} disabled />
          <IconButton {...args} variant={variant} disabled />
          <IconButton {...args} variant={variant} disabled />
        </div>
      ))}
    </div>

  ),
  args: {
    size: 'large'
  },
};