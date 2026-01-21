import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CitationData from '@/components/block/citation-data';

const meta: Meta<typeof CitationData> = {
  title: 'Block/CitationData',
  component: CitationData,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    data: {
      scrCitation: '[2024] 7 S.C.R. 244',
      yearVolume: '2024/7',
      neutralCitation: '2024INSC351',
      numberOfCasesCited: '06',
    }
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
