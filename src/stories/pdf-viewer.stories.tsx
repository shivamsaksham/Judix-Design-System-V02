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
                        <h1>Page {currentPage}</h1>
                        <p className="mb-8">
                            This simulates changing the PDF document pages.
                            When you click next or previous, the content and header react accordingly.
                        </p>
                    </div>
                </PdfViewer>
            </div>
        );
    }
};

// Complete text with multiple pages variant
export const CompleteTextMultiplePages: Story = {
    args: {
        title: 'Supreme Court Judgment',
        currentPage: 1,
        totalPages: 3,
    },
    render: (args) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [currentPage, setCurrentPage] = useState(1);
        const totalPages = 3;

        const pagesContent = [
            `IN THE SUPREME COURT OF INDIA\n\nCIVIL APPELLATE JURISDICTION\n\nCIVIL APPEAL NO. 1234 OF 2024\n\n\nAppellant: Union of India\n\nRespondent: XYZ Corporation\n\n\nJUDGMENT\n\n1. This appeal challenges the decision of the High Court regarding the classification of digital assets under the taxation framework. The High Court had ruled in favor of the respondent, concluding that such assets are exempt from the standard capital gains bracket.\n\n2. The appellant contends that the legislative intent clearly points towards a mandatory application of the standard tax codes as defined in Section 45(a) of the Finance Act. The respondent argues that the evolving nature of digital commodities warrants a nuanced, separate classification.\n\n3. Precedents established in the associated rulings suggest a bifurcated approach to the matters at hand. In the landmark case of State vs. Alpha Tech, it was held that immaterial assets with fluctuating speculative value cannot be rigidly pegged to legacy asset brackets.`,
            
            `4. However, the Attorney General emphasizes that the sheer volume of transactions necessitates a standardized regulatory overview. The core issue pertains strictly to whether the statutory language from 1999 can be reinterpreted without a fresh legislative mandate.\n\n5. The High Court, in its impugned judgment, held that the provisions are directory and not mandatory. It invoked the doctrine of prospective overruling. \n\n6. We have heard the learned counsel for both sides. The submissions put forth focus heavily on the 'intent' rather than the 'letter' of the law. As outlined in our previous judgments, the judiciary must tread carefully when expanding definitions drafted explicitly for older asset classes. It is our opinion that the High Court overstepped its bounds in reading exemptions into the text that were not ratified by Parliament.`,
            
            `7. Having considered all the materials placed on record, the affidavits, and the extensive arguments advanced by both sides, it is established that the High Court erred in its statutory interpretation. \n\n8. The appeal is hereby allowed. The judgment of the High Court is set aside. The digital assets in question shall be assessed strictly under the existing framework until Parliament enacts targeted legislation regarding the matter.\n\n9. There shall be no order as to costs.\n\n\n\n[End of Document]`
        ];

        return (
            <div className="w-full h-screen bg-gray-100 p-8 flex justify-center">
                <PdfViewer
                    {...args}
                    title="Supreme Court Judgment"
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => {
                        setCurrentPage(page);
                        args.onPageChange?.(page);
                    }}
                >
                    <div>
                        {pagesContent[currentPage - 1]}
                    </div>
                </PdfViewer>
            </div>
        );
    }
};
