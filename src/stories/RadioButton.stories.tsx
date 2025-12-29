import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { RadioButton, type RadioButtonProps } from '@/components/ui/radiobuttons';

const meta: Meta<typeof RadioButton> = {
  title: 'UI/RadioButton',
  component: RadioButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    size: 'medium',
    color: 'primary',
    disabled: false,
  },
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: ['small', 'medium', 'large'],
    },
    color: {
      control: { type: 'radio' },
      options: ['primary', 'neutral'],
    },
    disabled: { control: 'boolean' },
    checked: { control: false },
    onChange: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const options = [
  { label: 'Email', value: 'email' },
  { label: 'SMS', value: 'sms' },
  { label: 'Push', value: 'push' },
];

const RadioGroupPreview = (args: RadioButtonProps) => {
  const [value, setValue] = useState('email');

  return (
    <div className="flex items-center gap-4">
      {options.map((option) => (
        <div key={option.value} className="flex items-center gap-2">
          <RadioButton
            {...args}
            name="contact-preference"
            value={option.value}
            checked={value === option.value}
            onChange={() => {
              setValue(option.value);
              args.onChange?.();
            }}
          />
          <span>{option.label}</span>
        </div>
      ))}
    </div>
  );
};

export const PrimaryGroup: Story = {
  render: (args) => <RadioGroupPreview {...args} />,
};

export const NeutralGroup: Story = {
  args: {
    color: 'neutral',
  },
  render: (args) => <RadioGroupPreview {...args} />,
};

export const DisabledOption: Story = {
  render: (args) => {
    const [value, setValue] = useState('email');

    return (
      <div className="flex items-center gap-4">
        <RadioButton
          {...args}
          name="disabled-example"
          value="email"
          checked={value === 'email'}
          onChange={() => setValue('email')}
        />
        <RadioButton
          {...args}
          name="disabled-example"
          value="sms"
          checked={value === 'sms'}
          onChange={() => setValue('sms')}
          disabled
        />
        <RadioButton
          {...args}
          name="disabled-example"
          value="push"
          checked={value === 'push'}
          onChange={() => setValue('push')}
        />
      </div>
    );
  },
};
