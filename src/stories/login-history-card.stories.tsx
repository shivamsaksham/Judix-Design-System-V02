import type { Meta, StoryObj } from '@storybook/react';
import { LoginHistoryCard } from '@/components/secondary/login-history-card';

const meta = {
  title: 'Block/LoginHistoryCard',
  component: LoginHistoryCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LoginHistoryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    logins: [
      { date: "02 Feb, 2026", time: "09:32 hrs", location: "near Patna, Bihar" },
      { date: "02 Feb, 2026", time: "09:32 hrs", location: "near Patna, Bihar" },
      { date: "02 Feb, 2026", time: "09:32 hrs", location: "near Patna, Bihar" },
      { date: "02 Feb, 2026", time: "09:32 hrs", location: "near Patna, Bihar" },
      { date: "02 Feb, 2026", time: "09:32 hrs", location: "near Patna, Bihar" },
      { date: "02 Feb, 2026", time: "09:32 hrs", location: "near Patna, Bihar" },
      { date: "02 Feb, 2026", time: "09:32 hrs", location: "near Patna, Bihar" },
    ],
  },
};

export const Empty: Story = {
  args: {
    logins: [],
  },
};
