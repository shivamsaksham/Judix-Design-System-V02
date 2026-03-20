import type { Meta, StoryObj } from '@storybook/react';
import { SavedBillingDetails } from '../components/block/saved-billing-details';

const meta: Meta<typeof SavedBillingDetails> = {
    title: 'Block/SavedBillingDetails',
    component: SavedBillingDetails,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        selected: { control: 'boolean' },
        onClick: { action: 'clicked' },
        onEdit: { action: 'edit' },
        onDelete: { action: 'delete' },
    },
};

export default meta;
type Story = StoryObj<typeof SavedBillingDetails>;

export const Default: Story = {
    args: {
        name: 'Aditya Anand',
        company: 'JUDIX TECHNOLOGIES PRIVATE LIMITED',
        address: 'Near sabour college, shital nagar, sabour, bhagalpur 813210',
        email: 'aditya@judix.in',
        selected: false,
        onEdit: () => { },
        onDelete: () => { },
    },
};

export const Selected: Story = {
    args: {
        name: 'Aditya Anand',
        company: 'JUDIX TECHNOLOGIES PRIVATE LIMITED',
        address: 'Near sabour college, shital nagar, sabour, bhagalpur 813210',
        email: 'aditya@judix.in',
        selected: true,
        onEdit: () => { },
        onDelete: () => { },
    },
};

export const LongContent: Story = {
    args: {
        name: 'Aditya Anand Kumar Sharma',
        company: 'JUDIX TECHNOLOGIES PRIVATE LIMITED INCORPORATED INTERNATIONAL',
        address: '123 Multi-line Address Street, Floor 4, Suite 100, Near the Old Landmark Building, New City, State 123456, Country',
        email: 'aditya.anand.kumar.sharma@judix.technologies.in',
        selected: false,
    },
};
