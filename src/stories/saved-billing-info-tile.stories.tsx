import type { Meta, StoryObj } from '@storybook/react';
import { SavedBillingInfoTile } from '../components/block/saved-billing-info-tile';

const meta: Meta<typeof SavedBillingInfoTile> = {
    title: 'Block/SavedBillingInfoTile',
    component: SavedBillingInfoTile,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        onAdd: { action: 'add' },
        onEdit: { action: 'edit' },
        onDelete: { action: 'delete' },
        onSelect: { action: 'select' },
    },
};

export default meta;
type Story = StoryObj<typeof SavedBillingInfoTile>;

const SAMPLE_DATA = [
    {
        name: 'Aditya Anand',
        company: 'JUDIX TECHNOLOGIES PRIVATE LIMITED',
        address: 'Near sabour college, shital nagar, sabour, bhagalpur 813210',
        email: 'aditya@judix.in',
    },
    {
        name: 'Shivam Saksham',
        company: 'JUDIX TECHNOLOGIES PRIVATE LIMITED',
        address: 'Sector 62, Noida, Uttar Pradesh 201301',
        email: 'shivam@judix.in',
    }
];

export const Empty: Story = {
    args: {
        billingDetails: [],
    },
};

export const WithDetails: Story = {
    args: {
        billingDetails: SAMPLE_DATA,
        selectedId: 0,
    },
};
