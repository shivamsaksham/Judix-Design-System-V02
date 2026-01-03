import * as React from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { TextInput } from "@/components/ui/text-input"
import { Icon } from "judix-icon"

const meta: Meta<typeof TextInput> = {
  title: "Components/TextInput",
  component: TextInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    variant: {
      control: false,
    },
    label: {
      control: "text",
    },
    placeholder: {
      control: "text",
    },
    helperText: {
      control: "text",
    },
    errorMessage: {
      control: "text",
    },
    leadingIcon: {
      control: false,
    },
    trailingAccessory: {
      control: false,
    },
    selectedLabels: {
      control: false,
    },
    disabled: {
      control: "boolean",
    },
  },
  args: {
    label: "Label",
    placeholder: "Placeholder text",
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const DefaultWithHelperText: Story = {
  name: "Row 1: Default w/ Helper Text",
  args: {
    helperText: "Helper text goes here",
  },
}

export const DefaultWithInfoIcon: Story = {
  name: "Row 1: Default w/ Info Icon",
  args: {
    helperText: "Helper text goes here",
    trailingAccessory: <Icon name="InfoCircle" />,
  },
}

export const Error: Story = {
  name: "Row 2: Error",
  args: {
    errorMessage: "Error message",
    trailingAccessory: <Icon name="InfoCircle" />,
  },
}

export const WithSelectedLabels: Story = {
  name: "Row 3: With Selected Labels (Below)",
  args: {
    placeholder: "Placeholder text",
  },
  render: (args) => {
    const [currentLabels, setCurrentLabels] = React.useState([
      "Apples",
      "Bananas",
      "Cherries",
    ]);

    const handleRemoveLabel = (labelToRemove: string) => {
      setCurrentLabels(prevLabels =>
        prevLabels.filter(label => label !== labelToRemove)
      );
    };

    const selectedLabelsProp = currentLabels.map((label) => ({
      text: label,
      onRemove: () => handleRemoveLabel(label),
    }));

    return <TextInput {...args} selectedLabels={selectedLabelsProp} />;
  },
}

export const WithInlineLabels: Story = {
  name: "Row 3.5: With Inline Labels (Inside Input)",
  args: {
    placeholder: "Placeholder text",
  },
  render: (args) => {
    const [currentLabels, setCurrentLabels] = React.useState([
      "Selected info",
      "Another tag",
    ]);

    const handleRemoveLabel = (labelToRemove: string) => {
      setCurrentLabels(prevLabels =>
        prevLabels.filter(label => label !== labelToRemove)
      );
    };

    const selectedLabelsProp = currentLabels.map((label) => ({
      text: label,
      onRemove: () => handleRemoveLabel(label),
    }));

    return <TextInput {...args} selectedLabels={selectedLabelsProp} showLabelsInline={true} />;
  },
}

export const Disabled: Story = {
  name: "Row 4: Disabled w/ Info Icon",
  args: {
    helperText: "Helper text goes here",
    trailingAccessory: <Icon name="InfoCircle" />,
    disabled: true,
  },
}

export const Focus: Story = {
  name: "Row 5: Focus",
  args: {
    helperText: "Helper text goes here",
  },
  parameters: {
    pseudo: { focusWithin: true },
  },
}