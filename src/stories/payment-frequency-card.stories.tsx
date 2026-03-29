import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PaymentFrequencyCard } from '../components/block/payment-frequency-card';

const meta: Meta<typeof PaymentFrequencyCard> = {
    title: 'Block/PaymentFrequencyCard',
    component: PaymentFrequencyCard,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        type: {
            control: 'select',
            options: ['monthly', 'yearly'],
        },
        selected: { control: 'boolean' },
        onClick: { action: 'clicked' },
    },
};

export default meta;
type Story = StoryObj<typeof PaymentFrequencyCard>;

export const MonthlyDefault: Story = {
    args: {
        type: 'monthly',
        price: 'INR 1249/month + gst',
        selected: false,
    },
};

export const MonthlySelected: Story = {
    args: {
        type: 'monthly',
        price: 'INR 1249/month + gst',
        selected: true,
    },
};

export const YearlyDefault: Story = {
    args: {
        type: 'yearly',
        price: 'INR 11990/year + gst',
        selected: false,
        discountLabel: 'Save 20%',
    },
};

export const YearlySelected: Story = {
    args: {
        type: 'yearly',
        price: 'INR 11990/year + gst',
        selected: true,
        discountLabel: 'Save 20%',
    },
};

export const Interactive: Story = {
    render: (args) => {
        const [selected, setSelected] = React.useState<'monthly' | 'yearly'>('monthly');
        return (
            <div className="flex gap-4">
                <PaymentFrequencyCard
                    {...args}
                    type="monthly"
                    price="INR 1249/month + gst"
                    selected={selected === 'monthly'}
                    onClick={() => setSelected('monthly')}
                />
                <PaymentFrequencyCard
                    {...args}
                    type="yearly"
                    price="INR 11990/year + gst"
                    selected={selected === 'yearly'}
                    discountLabel="Save 20%"
                    onClick={() => setSelected('yearly')}
                />
            </div>
        );
    },
    args: {
        selected: 'monthly' as any,
    },
};
