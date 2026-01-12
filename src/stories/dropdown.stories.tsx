import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { Dropdown, type DropdownProps } from '@/components/ui/dropdown';

const sampleOptions: DropdownProps['options'] = [
  { value: 'email', title: 'Email', subtext: 'Send via email' },
  { value: 'sms', title: 'SMS', subtext: 'Send a text message' },
  { value: 'push', title: 'Push', subtext: 'Notify in the app' },
];

const meta: Meta<typeof Dropdown> = {
  title: 'UI/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    options: sampleOptions,
    value: 'email',
    onChange: () => {},
    searchbar: 'attached',
    placeholder: 'Search delivery methods',
  },
  argTypes: {
    options: { control: false },
    onChange: { control: false },
    searchbar: {
      control: { type: 'radio' },
      options: ['off', 'attached', 'integrated'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const DropdownPreview = (args: DropdownProps) => {
  const [value, setValue] = useState<string | null>(args.value ?? null);

  return (
    <Dropdown
      {...args}
      value={value}
      onChange={(next) => {
        setValue(next);
        args.onChange?.(next);
      }}
    />
  );
};

export const AttachedSearch: Story = {
  render: (args) => <DropdownPreview {...args} />,
};

export const IntegratedSearch: Story = {
  args: {
    searchbar: 'integrated',
  },
  render: (args) => <DropdownPreview {...args} />,
};

export const WithoutSearch: Story = {
  args: {
    searchbar: 'off',
  },
  render: (args) => <DropdownPreview {...args} />,
};
