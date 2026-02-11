import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const meta = {
    title: 'UI/Select',
    component: Select,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} as Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
    render: () => (
        <Select>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
            </SelectContent>
        </Select>
    ),
};

export const WithDefaultValue: Story = {
    render: () => (
        <Select defaultValue="option2">
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
            </SelectContent>
        </Select>
    ),
};

export const ManyOptions: Story = {
    render: () => (
        <Select>
            <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
                <SelectItem value="grape">Grape</SelectItem>
                <SelectItem value="mango">Mango</SelectItem>
                <SelectItem value="strawberry">Strawberry</SelectItem>
            </SelectContent>
        </Select>
    ),
};
