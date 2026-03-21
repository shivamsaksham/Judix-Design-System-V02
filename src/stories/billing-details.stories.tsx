import type { Meta, StoryObj } from '@storybook/react';
import { BillingDetails } from '../components/block/billing-details';

const meta: Meta<typeof BillingDetails> = {
    title: 'Block/BillingDetails',
    component: BillingDetails,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        savedBilling: {
            selectedId: undefined,
            billingDetails: [
                {
                    name: 'Aditya Anand',
                    company: 'JUDIX TECHNOLOGIES PRIVATE LIMITED',
                    address: 'Near sabour college, shital nagar, sabour, bhagalpur 813210',
                    email: 'aditya@judix.in',
                }
            ],
            onAdd: () => console.log('Add new address'),
            onEdit: (id) => console.log('Edit', id),
            onDelete: (id) => console.log('Delete', id),
            onSelect: (id) => console.log('Select', id),
        },
        form: {
            onSave: (data) => console.log('Save', data),
            onDiscard: () => console.log('Discard'),
        }
    },
};
