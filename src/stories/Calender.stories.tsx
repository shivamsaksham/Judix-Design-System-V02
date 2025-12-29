import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import type { ComponentProps } from 'react';
import Calender from '@/components/ui/calender';

type CalenderProps = ComponentProps<typeof Calender>;

const meta: Meta<typeof Calender> = {
  title: 'UI/Calender',
  component: Calender,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    onDateSelected: null,
    onDateChange: () => {},
  },
  argTypes: {
    onDateChange: { control: false },
    onDateSelected: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const CalenderPreview = (args: CalenderProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(args.onDateSelected ?? null);

  return (
    <Calender
      {...args}
      onDateSelected={selectedDate}
      onDateChange={(date) => {
        setSelectedDate(date);
        args.onDateChange?.(date);
      }}
    />
  );
};

export const Basic: Story = {
  render: (args) => <CalenderPreview {...args} />,
};

export const WithInitialMonth: Story = {
  args: {
    initialDisplayDate: new Date('2025-01-01'),
  },
  render: (args) => <CalenderPreview {...args} />,
};
