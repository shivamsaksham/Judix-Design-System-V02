import type { Meta, StoryObj } from '@storybook/react';
import { CourtSelector } from '@/components/block/court-selector';
import { useState } from 'react';

const meta = {
    title: 'Block/CourtSelector',
    component: CourtSelector,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        onCourtSelect: { action: 'onCourtSelect' },
        onCourtDeselect: { action: 'onCourtDeselect' },
    },
} satisfies Meta<typeof CourtSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockCourtCategories = [
    {
        id: "supreme_court",
        label: "Apex Courts",
        courts: ["Supreme Court of India"]
    },
    {
        id: "high_courts",
        label: "High Courts",
        courts: [
            "Delhi High Court", 
            "Bombay High Court", 
            "Madras High Court", 
            "Calcutta High Court"
        ]
    },
    {
        id: "tribunals",
        label: "Tribunals",
        courts: [
            "National Company Law Appellate Tribunal (NCLAT)", 
            "Income Tax Appellate Tribunal (ITAT)", 
            "Customs, Excise and Service Tax Appellate Tribunal (CESTAT)"
        ]
    }
];

export const Default: Story = {
    args: {
        categories: mockCourtCategories,
        selectedCourts: [],
    },
};

export const WithSelections: Story = {
    args: {
        categories: mockCourtCategories,
        selectedCourts: ["Supreme Court of India", "Delhi High Court"],
    },
};

export const Empty: Story = {
    args: {
        categories: [],
        selectedCourts: [],
    },
};

const CourtSelectorWithState = () => {
    const [selectedCourts, setSelectedCourts] = useState<string[]>(["Supreme Court of India"]);

    const handleSelect = (court: string) => {
        setSelectedCourts(prev => [...prev, court]);
    };

    const handleDeselect = (court: string) => {
        setSelectedCourts(prev => prev.filter(c => c !== court));
    };

    return (
        <CourtSelector
            categories={mockCourtCategories}
            selectedCourts={selectedCourts}
            onCourtSelect={handleSelect}
            onCourtDeselect={handleDeselect}
        />
    );
};

export const Interactive: Story = {
    render: () => <CourtSelectorWithState />,
};
