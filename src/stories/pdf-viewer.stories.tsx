import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PdfViewer } from '@/components/block/pdf-viewer';

const meta = {
    title: 'Block/PdfViewer',
    component: PdfViewer,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    argTypes: {
        onPageChange: { action: 'onPageChange' },
        onAskAI: { action: 'onAskAI' },
        onClose: { action: 'onClose' },
    },
} satisfies Meta<typeof PdfViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic static story
export const Default: Story = {
    args: {
        title: 'This is the doc title',
        currentPage: 1,
        totalPages: 15,
        children: (
            <div>
                <p>This is the simulated page of the pdf content.</p>
            </div>
        )
    },
};

// Interactive story demonstrating state with multiple pages
export const MultiPageInteractive: Story = {
    args: {
        title: 'Annual Report 2024',
        currentPage: 1,
        totalPages: 5,
    },
    render: (args) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [currentPage, setCurrentPage] = useState(1);
        const totalPages = 5;

        return (
            <div className="w-full h-screen bg-gray-100 p-8 flex justify-center">
                <PdfViewer
                    {...args}
                    title={`Annual Report 2024 - Part ${currentPage}`}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => {
                        setCurrentPage(page);
                        args.onPageChange?.(page);
                    }}
                >
                    <div className="flex flex-col items-center justify-center w-full h-full text-center p-8">
                        <h1 className="text-2xl font-bold mb-4">Page {currentPage}</h1>
                        <p className="text-gray-600 mb-8">
                            This simulates changing the PDF document pages.
                            When you click next or previous, the content and header react accordingly.
                        </p>
                    </div>
                </PdfViewer>
            </div>
        );
    }
};
