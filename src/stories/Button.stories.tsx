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
      options: ['large' , 'medium', 'small', 'extraSmall', 'icon', 'icon-sm', 'icon-lg'],
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
export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete',
  },
};


export const Base: Story = {
  args: {
    variant: 'base',
    children: 'Base',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    children: 'Small',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    children: 'Large',
  },
};

export const Icon: Story = {
  args: {
    size: 'icon',
    children: '🔍',
  },
};

export const IconSmall: Story = {
  args: {
    size: 'icon-sm',
    children: '✓',
  },
};

export const IconLarge: Story = {
  args: {
    size: 'icon-lg',
    children: '⚙️',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <svg
          className="size-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add Item
      </>
    ),
  },
};

export const AsChild: Story = {
  args: {
    asChild: true,
    children: <a href="#" tabIndex={-1}>Link as Button</a>,
  },
};

export const Loading: Story = {
  args: {
    disabled: true,
    children: (
      <>
        <svg
          className="size-4 animate-spin"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.49 8.49l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.49-8.49l2.83-2.83"
          />
        </svg>
        Loading...
      </>
    ),
  },
};

export const TailwindTest: Story = {
  args: {
    className: "bg-red-500 text-white border-2 border-blue-500 rounded-lg p-4 m-2",
    children: "Tailwind Test",
  },
};

export const CSSTest: Story = {
  args: {
    className: "storybook-test",
    children: "CSS Test",
  },
};

