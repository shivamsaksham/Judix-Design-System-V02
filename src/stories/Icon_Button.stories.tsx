import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { IconButton } from '@/components/ui/icon_button';

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
    colorScheme: {
        control: 'radio',
        options: ['primary', 'neutral'],
    },
    shape: {
      control: 'radio',
      options: ['rounded', 'circle'],
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
    icon: 'Document',
    disabled: false,
    variant: 'subtle',
    colorScheme: 'neutral',
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
        {(['primary', 'subtle', 'outline', 'ghost'] as const).map((variant) => (
          <div key={variant} className="flex items-center gap-4">
            <IconButton {...args} variant={variant} colorScheme="neutral" shape="rounded" />
            <IconButton {...args} variant={variant} colorScheme="primary" shape="rounded" />
            <IconButton {...args} variant={variant} colorScheme="neutral" shape="circle" />
            <IconButton {...args} variant={variant} colorScheme="primary" shape="circle" />
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
      <div className="flex items-center gap-4">
          <IconButton {...args} variant="primary" disabled />
          <IconButton {...args} variant="subtle" disabled />
          <IconButton {...args} variant="outline" disabled />
          <IconButton {...args} variant="ghost" disabled />
      </div>
    ),
    args: {
      size: 'large',
      shape: 'rounded',
      colorScheme: 'primary'
    },
};