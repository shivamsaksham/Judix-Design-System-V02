import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { Dropdown, type DropdownProps } from '@/components/ui/dropdown';
import { Button } from '@/components/ui/button';
import { Icon } from 'judix-icon';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

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
    onChange: () => { },
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

export const WithButtonTrigger: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<string | null>(args.value ?? null);

    const selectedOption = args.options.find(o => o.value === value);
    const label = selectedOption ? selectedOption.title : 'Select';

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="neutral"
            size="small"
            className={cn(
              "gap-2 text-color-text-neutral-default border-color-border-neutral-default rounded-lg",
              open && "bg-color-surface-neutral-hover_default"
            )}
            onClick={() => setOpen(!open)}
          >
            Sort by: {label}
            <Icon
              name="ArrowDown"
              className={cn(
                "h-4 w-4 text-color-icon-neutral-tertiary transition-transform duration-200",
                open && "rotate-180"
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 w-auto border-none shadow-none bg-transparent"
          align="start"
          sideOffset={4}
        >
          <Dropdown
            {...args}
            value={value}
            onChange={(next) => {
              setValue(next);
              setOpen(false);
              args.onChange?.(next);
            }}
            searchbar="off"
            className="w-[200px] shadow-lg"
          />
        </PopoverContent>
      </Popover>
    );
  }
};

