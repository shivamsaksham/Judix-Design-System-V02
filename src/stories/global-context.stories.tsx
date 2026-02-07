import type { Meta, StoryObj } from '@storybook/react';
import { GlobalContext } from '@/components/block/global-context';

const meta: Meta<typeof GlobalContext> = {
    title: 'Block/GlobalContext',
    component: GlobalContext,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    decorators: [
        (Story) => (
            <div className="">
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        title: 'Factsheet of the case - signed and verified version',
        lineCount: 101,
        fileType: 'TXT',
        onEdit: () => console.log('Edit clicked'),
    },
};

export const PDFDocument: Story = {
    args: {
        title: 'Legal brief - Supreme Court case',
        lineCount: 245,
        fileType: 'PDF',
        onEdit: () => console.log('Edit clicked'),
    },
};

export const DOCXDocument: Story = {
    args: {
        title: 'Contract agreement draft',
        lineCount: 78,
        fileType: 'DOCX',
        onEdit: () => console.log('Edit clicked'),
    },
};

export const ShortTitle: Story = {
    args: {
        title: 'Evidence file',
        lineCount: 12,
        fileType: 'TXT',
        onEdit: () => console.log('Edit clicked'),
    },
};

export const LongTitle: Story = {
    args: {
        title: 'Comprehensive analysis of the constitutional validity of the amendment to the Indian Penal Code Section 498A',
        lineCount: 532,
        fileType: 'PDF',
        onEdit: () => console.log('Edit clicked'),
    },
};

export const WithoutEditAction: Story = {
    args: {
        title: 'Read-only document',
        lineCount: 156,
        fileType: 'TXT',
    },
};

export const MultipleDocuments: Story = {
    render: () => (
        <div className="flex flex-wrap gap-4">
            <GlobalContext
                title="Factsheet of the case - signed and verified version"
                lineCount={101}
                fileType="TXT"
                onEdit={() => console.log('Edit document 1')}
            />
            <GlobalContext
                title="Legal brief - Supreme Court case"
                lineCount={245}
                fileType="PDF"
                onEdit={() => console.log('Edit document 2')}
            />
            <GlobalContext
                title="Contract agreement draft"
                lineCount={78}
                fileType="DOCX"
                onEdit={() => console.log('Edit document 3')}
            />
        </div>
    ),
};

export const Grid: Story = {
    render: () => (
        <div className="grid grid-cols-2 gap-4 max-w-4xl">
            <GlobalContext
                title="Case summary document"
                lineCount={89}
                fileType="TXT"
                onEdit={() => console.log('Edit 1')}
            />
            <GlobalContext
                title="Evidence list"
                lineCount={45}
                fileType="PDF"
                onEdit={() => console.log('Edit 2')}
            />
            <GlobalContext
                title="Witness statements"
                lineCount={156}
                fileType="DOCX"
                onEdit={() => console.log('Edit 3')}
            />
            <GlobalContext
                title="Court orders"
                lineCount={23}
                fileType="PDF"
                onEdit={() => console.log('Edit 4')}
            />
        </div>
    ),
};
