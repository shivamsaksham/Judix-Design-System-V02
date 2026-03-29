import type { Meta, StoryObj } from '@storybook/react';
import { BillInfoForm } from '../components/block/bill-info-form';

const meta: Meta<typeof BillInfoForm> = {
    title: 'Block/BillInfoForm',
    component: BillInfoForm,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        onSave: { action: 'saved' },
        onDiscard: { action: 'discarded' },
    },
};

export default meta;
type Story = StoryObj<typeof BillInfoForm>;

export const EmptyForm: Story = {
    args: {},
};

export const PreFilledForm: Story = {
    args: {
        initialData: {
            firstName: 'Aditya',
            lastName: 'Anand',
            phone: '9876543210',
            email: 'aditya@judix.in',
            address: 'Near sabour college, shital nagar, sabour, bhagalpur 813210',
            city: 'Bhagalpur',
            state: 'Bihar',
            pincode: '813210',
            needGst: true,
            gstNumber: '10AGGD23556ND20',
        },
    },
};
