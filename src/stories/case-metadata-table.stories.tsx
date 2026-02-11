import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CaseMetadataTable from '@/components/block/case-metadata-table';

const meta: Meta<typeof CaseMetadataTable> = {
  title: 'Block/CaseMetadataTable',
  component: CaseMetadataTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    data: {
      domain: 'Civil',
      caseType: 'Civil Appeal',
      caseNo: '007/2024',
      dateOfJudgment: '21/07/2025',
      court: 'Supreme Court of India',
      disposalNature: 'Appeals allowed',
      judges: 'R.K. Subramanium, Sandeep Mehta, C.J. Chandrashekhar',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CaseMetadataTable>;

export const Default: Story = {};

export const CustomData: Story = {
  args: {
    data: {
      domain: 'Criminal',
      caseType: 'Criminal Appeal',
      caseNo: '123/2025',
      dateOfJudgment: '01/01/2025',
      court: 'High Court of Delhi',
      disposalNature: 'Dismissed',
      judges: 'A.B. Singh, X.Y. Zed',
    },
  },
};
