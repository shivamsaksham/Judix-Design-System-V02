import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ActsTable from '@/components/block/acts-table';

const meta: Meta<typeof ActsTable> = {
  title: 'Block/ActsTable',
  component: ActsTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    data: [
      {
        act: 'Income Tax Act, 1961',
        details: 'Sections : 12, 32, 22 ; Orders: 41.1',
      },
      {
        act: 'Constitution of India',
        details: 'Articles: 12, 13, 16',
      },
      {
        act: 'Motor Vehicles Act, 1977',
        details: 'Schedule: III, IV, VII',
      },
      {
        act: 'Code of Civil Procedure, 1951',
        details: 'Orders: 44, 46.2',
      },
    ],
    headers: {
      act: 'Acts',
      details: 'Sections/Schedules/Rules/Orders',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
