import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Option } from '../components/ui/option';
import { Label } from '@/components/ui/labels';
import { Checkbox } from '../components/ui/checkbox';
import { NumberBadge } from '@/components/ui/number_badges';
import { Icon } from 'judix-icon';
import { title } from 'process';

const meta: Meta<typeof Option> = {
  title: 'UI/Option',
  component: Option,
  argTypes: {
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
    title: { control: 'text' },
    subtext: { control: 'text' },
    shape: {
      control: 'select',
      options: ['rounded', 'sharp'],
    }
  },
  args: {
    title: 'Option Title',
    selected: false,
    disabled: false,
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
  },
  parameters: {
    pseudo: { hover: true },
  },
};

export const Selected: Story = {
  name: "State: Selected",
  args: {
    title: 'Option',
    selected: true,
  },
};

export const Disabled: Story = {
  name: "State: Disabled",
  args: {
    title: 'Option',
    disabled: true,
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
  },
  parameters: {
    pseudo: { hover: true },
  },
};

export const WithSubtextSelected: Story = {
  name: "Content: With Subtext (Selected)",
  args: {
    ...WithSubtext.args,
    selected: true,
  },
};

export const WithSubtextDisabled: Story = {
  name: "Content: With Subtext (Disabled)",
  args: {
    ...WithSubtext.args,
    disabled: true,
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
  },
  parameters: {
    pseudo: { hover: true },
  },
};

export const FullOptionSelected: Story = {
  name: "Full Variant: Selected",
  args: {
    ...FullOption.args,
    selected: true,
  },
};

export const FullOptionDisabled: Story = {
  name: "Full Variant: Disabled",
  args: {
    ...FullOption.args,
    disabled: true,
  },
};


// --- ALL VARIANTS STORY ---

const simpleProps = {
  title: 'Option',
};
const subtextProps = {
  title: 'Option title',
  subtext: 'Subtext',
};
const fullProps = {
  title: 'Option title',
  subtext: 'Subtext',
  icon: <Icon name="ClipboardText" />,
  numberbadge: <NumberBadge variant="neutral" size="s">5</NumberBadge>,
};
const checkboxProps = {
  title: "Option title",
  checkbox: <Checkbox id="option-checkbox" />,
};
const fullCheckboxProps = {
  title: "Option title",
  checkbox: <Checkbox id="option-checkbox" />,
  subtext: 'Subtext',
  leadingIcon: <Icon name="ClipboardText" />,
};
const labelProps = {
  title : "Option title",
  label: <Label size="small">Label</Label>,
  subtext: 'Subtext',
  leadingIcon: <Icon name="ClipboardText" />,
}
const checkboxIconProps = {
  title: "Option title",
  checkbox: <Checkbox id="option-checkbox" />,
  icon: <Icon name="ClipboardText" />,
  subtext: 'Subtext',
}

export const AllVariants: Story = {
  name: "All Variants (Kitchen Sink)",
  parameters: {
    layout: 'padded',
  },
  decorators: [],
  render: () => (
    <div className="w-[1000px] grid grid-cols-4 gap-4 p-4">
      <h3 className="font-bold col-span-4 text-lg">States</h3>
      <h4 className="font-semibold">Default</h4>
      <h4 className="font-semibold">Hover</h4>
      <h4 className="font-semibold">Selected</h4>
      <h4 className="font-semibold">Disabled</h4>

      <Option {...simpleProps} />
      <Option {...simpleProps} data-pseudo-hover />
      <Option {...simpleProps} selected />
      <Option {...simpleProps} disabled />

      <Option {...subtextProps} />
      <Option {...subtextProps} data-pseudo-hover />
      <Option {...subtextProps} selected />
      <Option {...subtextProps} disabled />

      <Option {...fullProps} />
      <Option {...fullProps} data-pseudo-hover />
      <Option {...fullProps} selected />
      <Option {...fullProps} disabled />

      <Option {...fullCheckboxProps} />
      <Option {...fullCheckboxProps} data-pseudo-hover />
      <Option {...fullCheckboxProps} selected />
      <Option {...fullCheckboxProps} disabled />

      <Option {...checkboxProps} />
      <Option {...checkboxProps} data-pseudo-hover />
      <Option {...checkboxProps} selected />
      <Option {...checkboxProps} disabled />

      <Option {...labelProps} />
      <Option {...labelProps} data-pseudo-hover />
      <Option {...labelProps} selected />
      <Option {...labelProps} disabled />

      <Option {...checkboxIconProps} />
      <Option {...checkboxIconProps} data-pseudo-hover />
      <Option {...checkboxIconProps} selected />
      <Option {...checkboxIconProps} disabled />
    </div>
  ),
};