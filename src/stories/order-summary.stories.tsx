import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { OrderSummary } from '../components/block/order-summary';

const meta: Meta<typeof OrderSummary> = {
    title: 'Block/OrderSummary',
    component: OrderSummary,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof OrderSummary>;

const defaultData = {
    planName: 'Basic Plan',
    credits: '500',
    currentFrequency: 'yearly' as const,
    subtotal: 11990,
    gst: 2158.2,
    promoCode: 'NEWUSER20',
    promoDiscount: 1000,
    isPromoApplied: true,
    autoRenewDate: '09/03/2027',
    yearlyPrice: 'INR 11990/year + gst',
};

export const Default: Story = {
    args: {
        data: defaultData,
    },
};

export const MonthlySelected: Story = {
    args: {
        data: {
            ...defaultData,
            currentFrequency: 'monthly',
            subtotal: 1249,
            gst: 224.82,
            isPromoApplied: false,
        },
    },
};

export const NoPromoApplied: Story = {
    args: {
        data: {
            ...defaultData,
            isPromoApplied: false,
        },
    },
};

export const Interactive: Story = {
    render: (args) => {
        const [data, setData] = React.useState(args.data);

        const handleFrequencyChange = (freq: 'monthly' | 'yearly') => {
            setData(prev => ({
                ...prev,
                currentFrequency: freq,
                subtotal: freq === 'monthly' ? 1249 : 11990,
                gst: freq === 'monthly' ? 224.82 : 2158.2,
            }));
        };

        const handleApplyPromo = (code: string) => {
            if (code.toUpperCase() === 'NEWUSER20') {
                setData(prev => ({
                    ...prev,
                    isPromoApplied: true,
                    promoCode: code.toUpperCase(),
                    promoDiscount: 1000,
                }));
            }
        };

        return (
            <OrderSummary
                {...args}
                data={data}
                onFrequencyChange={handleFrequencyChange}
                onApplyPromo={handleApplyPromo}
            />
        );
    },
    args: {
        data: {
            ...defaultData,
            isPromoApplied: false,
        },
    },
};
