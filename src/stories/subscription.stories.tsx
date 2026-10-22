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
    price: '₹1,499 / month',
    cycleNote: 'Renews on 16 April 2026.',
    paymentNote: 'Last payment of ₹1,499 on 16 March 2026.',
    usageNote: 'These usage limits reset on 16 April 2026.',
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
        current: 420433,
        total: 268435456000,
        currentLabel: '411 KB',
        totalLabel: '250 GB',
        icon: HardDrive,
        tooltipText: 'Total cloud storage capacity for files and generated assets.',
      },
    ],
  },
}

export const FreePlan: Story = {
  args: {
    ...Default.args,
    planName: 'Free Plan',
    price: 'Free',
    cycleNote: 'Queries reset on 30 October 2026.',
    paymentNote: undefined,
    usageNote: 'These usage limits reset on 30 October 2026.',
    canCancel: false,
    usageLimits: [
      {
        label: 'AI queries',
        current: 19,
        total: 50,
        icon: Sparkles,
        tooltipText: 'Credits consumed per query. Every response uses queries from your monthly quota.',
      },
      {
        label: 'Pages',
        current: 52,
        total: 100,
        icon: FileText,
        tooltipText: 'Total number of pages processed across your document uploads.',
      },
    ],
  },
}

export const Cancelling: Story = {
  args: {
    ...Default.args,
    cycleNote: 'Access ends on 16 April 2026.',
    canCancel: false,
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
