import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@/components/ui/input';

const meta = {
    title: 'UI/Input',
    component: Input,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        type: {
            control: 'select',
            options: ['text', 'email', 'password', 'number', 'tel', 'url'],
        },
        disabled: {
            control: 'boolean',
        },
    },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        placeholder: 'Enter text...',
        className: 'w-[300px]',
    },
};

export const Email: Story = {
    args: {
        type: 'email',
        placeholder: 'Email address',
        className: 'w-[300px]',
    },
};

export const Password: Story = {
    args: {
        type: 'password',
        placeholder: 'Password',
        className: 'w-[300px]',
    },
};

export const Disabled: Story = {
    args: {
        placeholder: 'Disabled input',
        disabled: true,
        className: 'w-[300px]',
    },
};

export const WithValue: Story = {
    args: {
        defaultValue: 'Pre-filled value',
        className: 'w-[300px]',
    },
};
