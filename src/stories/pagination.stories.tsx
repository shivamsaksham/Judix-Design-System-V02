import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import PaginationView from '@/components/ui/pagination';

const meta: Meta<typeof PaginationView> = {
  title: 'UI/Pagination',
  component: PaginationView,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof PaginationView>;

export const Basic: Story = {};
