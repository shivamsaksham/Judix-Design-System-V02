import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Option, OptionProps } from '../components/ui/option';
import { Label } from '@/components/ui/labels';
import { Checkbox } from '../components/ui/checkbox';
import { NumberBadge } from '@/components/ui/number_badges';
import { Icon } from 'judix-icon';

const meta: Meta<typeof Option> = {
  title: 'UI/Option',
  component: Option,
  argTypes: {
    state: {
      control: 'select',
      options: ['default', 'hover', 'selected'],
    },
    title: { control: 'text' },
    subtext: { control: 'text' },
    shape: {
      control: 'select',
      options: ['rounded', 'sharp'],
    }
  },
  args: {
    title: 'Option Title',
    state: 'default',
    shape: 'rounded',
  },
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-[200px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Option>;

// --- Base States ---
export const Default: Story = {
  name: "State: Default",
  args: {
    title: 'Option',
  },
};

export const Hover: Story = {
  name: "State: Hover",
  args: {
    title: 'Option',
    state: 'hover',
  },
};

export const Selected: Story = {
  name: "State: Selected",
  args: {
    title: 'Option',
    state: 'selected',
  },
};

export const Sharp: Story = {
  name: "Shape: Sharp",
  args: {
    title: 'Option',
    shape: 'sharp',
  },
};

// --- With Subtext ---
export const WithSubtext: Story = {
  name: "Content: With Subtext",
  args: {
    title: 'Option title',
    subtext: 'Subtext',
  },
};

export const WithSubtextHover: Story = {
  name: "Content: With Subtext (Hover)",
  args: {
    ...WithSubtext.args,
    state: 'hover',
  },
};

export const WithSubtextSelected: Story = {
  name: "Content: With Subtext (Selected)",
  args: {
    ...WithSubtext.args,
    state: 'selected',
  },
};


// --- Simple Option + Accessories ---
export const WithLeadingIcon: Story = {
  name: "Accessory: Leading Icon",
  args: {
    title: 'Option',
    leadingIcon: <Icon name="ClipboardText" />,
  },
};

export const WithTrailingLabel: Story = {
  name: "Accessory: Trailing Label",
  args: {
    title: 'Option',
    trailingAccessory: <Label size="small">Label</Label>,
  },
};

export const WithTrailingNumberBadge: Story = {
  name: "Accessory: Trailing NumberBadge",
  args: {
    title: 'Option',
    trailingAccessory: <NumberBadge variant="neutral" size="s">5</NumberBadge>,
  },
};

export const WithTrailingCheckbox: Story = {
  name: "Accessory: Trailing Checkbox",
  args: {
    title: 'Option',
    trailingAccessory: <Checkbox id="option-checkbox" />,
  },
};

export const WithLeadingIconAndTrailingNumber: Story = {
  name: "Accessory: Leading Icon + Trailing Number",
  args: {
    title: 'Option',
    leadingIcon: <Icon name="ClipboardText" />,
    trailingAccessory: <NumberBadge variant="neutral" size="s">5</NumberBadge>,
  },
};

// --- Option with Subtext + Accessories ---

export const WithSubtextAndLeadingIcon: Story = {
  name: "Accessory: Subtext + Leading Icon",
  args: {
    ...WithSubtext.args,
    leadingIcon: <Icon name="ClipboardText" />,
  },
};

export const WithSubtextAndTrailingLabel: Story = {
  name: "Accessory: Subtext + Trailing Label",
  args: {
    ...WithSubtext.args,
    trailingAccessory: <Label size="small">Label</Label>,
  },
};

export const WithSubtextAndTrailingNumber: Story = {
  name: "Accessory: Subtext + Trailing Number",
  args: {
    ...WithSubtext.args,
    trailingAccessory: <NumberBadge variant="neutral" size="s">5</NumberBadge>,
  },
};

export const WithSubtextAndTrailingCheckbox: Story = {
  name: "Accessory: Subtext + Trailing Checkbox",
  args: {
    ...WithSubtext.args,
    trailingAccessory: <Checkbox id="option-checkbox-subtext" />,
  },
};

// --- Full Option ---

export const FullOption: Story = {
  name: "Full Variant: Default",
  args: {
    title: 'Option title',
    subtext: 'Subtext',
    leadingIcon: <Icon name="ClipboardText" />,
    trailingAccessory: <NumberBadge variant="neutral" size="s">5</NumberBadge>,
  },
};

export const FullOptionHover: Story = {
  name: "Full Variant: Hover",
  args: {
    ...FullOption.args,
    state: 'hover',
  },
};

export const FullOptionSelected: Story = {
  name: "Full Variant: Selected",
  args: {
    ...FullOption.args,
    state: 'selected',
  },
};