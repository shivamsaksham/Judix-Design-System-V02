import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { Button } from '@/components/ui/button';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
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
      options: ['primary', 'destructive', 'base'],
    },
    size: {
      control: { type: 'select' },
      options: ['large', 'medium', 'small', 'extraSmall', 'icon', 'icon-sm', 'icon-lg'],
    },
    asChild: {
      control: { type: 'boolean' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
};

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary_Large: Story = {
  args: {
    children: 'Primary Large',
    variant: 'primary',
    size: 'large',
  },
};

export const Primary_Medium: Story = {
  args: {
    children: 'Primary Medium',
    variant: 'primary',
    size: 'medium',
  },
};

export const PrimarySmall: Story = {
  args: {
    children: "Primary Small",
    variant: "primary",
    size: "small"
  }
};

export const PrimaryExtraSmall: Story = {
  args: {
    children: "Primary ExtraSmall",
    variant: "primary",
    size: "extraSmall"
  }
};

export const Primary_Large_Icon: Story = {
  args: {
    prefixIcon: "Document",
    children: 'Primary Large Icon',
    variant: 'primary',
    size: 'large',
  },
};

export const Neutral_Large: Story = {
  args: {
    children: 'Neutral Large',
    variant: 'neutral',
    size: 'large',
  },
};




export const NeutralMedium: Story = {
  args: {
    children: "Neutral Medium",
    variant: "neutral",
    size: "medium"
  }
};







export const NeutralSmall: Story = {
  args: {
    children: "Neutral Small",
    variant: "neutral",
    size: "small"
  }
};







export const NeutralExtraSmall: Story = {
  args: {
    children: "Neutral Extra Small",
    variant: "neutral",
    size: "extraSmall"
  }
};


export const Destructive_Large: Story = {
  args: {
    variant: 'destructive',
    size: 'large',
    children: "Destructive Large",
  },
};



export const DestructiveMedium: Story = {
  args: {
    variant: "destructive",
    size: "medium",
    children: "Destructive Medium"
  }
};











export const DestrcutiveSmall: Story = {
  args: {
    variant: "destructive",
    size: "small",
    children: "Destructive Small"
  }
};











export const DestructiveExtraSmall: Story = {
  args: {
    variant: "destructive",
    size: "extraSmall",
    children: "Destructive Extra Small"
  }
};


export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
};


export const AsChild: Story = {
  args: {
    asChild: true,
    children: <a href="#" tabIndex={-1}>Link as Button</a>,
  },
};

// New Stories demonstrating prefix and suffix icons
export const WithPrefixIcon: Story = {
  args: {
    prefixIcon: "Document",
    children: "Download File",
    variant: "primary",
    size: "large",
  },
};

export const WithSuffixIcon: Story = {
  args: {
    suffixIcon: "ArrowRight",
    children: "Continue",
    variant: "primary",
    size: "large",
  },
};

export const WithBothIcons: Story = {
  args: {
    prefixIcon: "SearchNormal",
    suffixIcon: "ArrowRight",
    children: "Search and Navigate",
    variant: "primary",
    size: "large",
  },
};

export const PrefixIconMedium: Story = {
  args: {
    prefixIcon: "Add",
    children: "Add Item",
    variant: "primary",
    size: "medium",
  },
};

export const SuffixIconSmall: Story = {
  args: {
    suffixIcon: "Check",
    children: "Complete",
    variant: "neutral",
    size: "small",
  },
};

export const DestructiveWithIcon: Story = {
  args: {
    prefixIcon: "Trash",
    children: "Delete",
    variant: "destructive",
    size: "large",
  },
};

export const CustomIconSize: Story = {
  args: {
    prefixIcon: "Heart",
    suffixIcon: "Star",
    children: "Custom Size Icons",
    iconStrokeWidth: 3,
    variant: "primary",
    size: "large",
    iconClassName: "size-6" // Custom class to adjust icon size
  },
};





















