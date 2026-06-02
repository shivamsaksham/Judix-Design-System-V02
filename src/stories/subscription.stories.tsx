import type { Meta, StoryObj } from '@storybook/react'
import { Subscription } from '../components/secondary/subscription'
import { Sparkles, FileText, Folder, HardDrive } from 'lucide-react'

const meta: Meta<typeof Subscription> = {
  title: 'Block/Subscription',
  component: Subscription,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onChangePlan: { action: 'change plan clicked' },
    onViewInvoice: { action: 'view invoice clicked' },
    onCancelSubscription: { action: 'cancel subscription clicked' },
  },
}

export default meta
type Story = StoryObj<typeof Subscription>

export const Default: Story = {
  args: {
    planName: 'Judix Basic',
    price: '1499/mo',
    renewalDate: 'April 16, 2026',
    lastPaymentDate: 'March 16, 2026',
    usageLimits: [
      {
        label: 'AI queries',
        current: 40,
        total: 500,
        icon: Sparkles,
        tooltipText: 'Credits consumed per query. Every response uses queries from your monthly quota.',
      },
      {
        label: 'Pages',
        current: 138,
        total: 100,
        icon: FileText,
        tooltipText: 'Total number of pages processed across your document uploads.',
      },
    ],
    fixedQuotas: [
      {
        label: 'Projects',
        current: 14,
        total: 100,
        icon: Folder,
        tooltipText: 'Maximum number of projects that can be active simultaneously.',
      },
      {
        label: 'Storage',
        current: 32,
        total: 100,
        unit: 'GB',
        icon: HardDrive,
        tooltipText: 'Total cloud storage capacity for files and generated assets.',
      },
    ],
  },
}

export const NearLimit: Story = {
  args: {
    ...Default.args,
    usageLimits: [
      {
        label: 'AI queries',
        current: 480,
        total: 500,
        icon: Sparkles,
        tooltipText: 'Credits consumed per query. Every response uses queries from your monthly quota.',
      },
      {
        label: 'Pages',
        current: 95,
        total: 100,
        icon: FileText,
        tooltipText: 'Total number of pages processed across your document uploads.',
      },
    ],
  },
}
