import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CasesCited from '@/components/block/cases-cited';

const meta: Meta<typeof CasesCited> = {
  title: 'Block/CasesCited',
  component: CasesCited,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    data: [
      {
        citationNumber: '[2021] 5 S.C.R. 781',
        judicialConsideration: 'Referred to',
        caseLaw: 'DEEPAK GULATI vs THE STATE OF HARYANA',
      },
      {
        citationNumber: '[2021] 5 S.C.R. 781',
        judicialConsideration: 'Relied on',
        caseLaw: 'RAJNISH SINGH @ SONI vs. STATE OF UP AND ANOTHER',
      },
      {
        citationNumber: '[2021] 5 S.C.R. 781',
        judicialConsideration: 'Distinguished',
        caseLaw: 'SURESH vs. STATE REP. BY INSPECTOR OF POLICE',
      },
      {
        citationNumber: '[2021] 5 S.C.R. 781',
        judicialConsideration: 'Distinguished',
        caseLaw: 'SURESH vs. STATE REP. BY INSPECTOR OF POLICE',
      },
      {
        citationNumber: '[2021] 5 S.C.R. 781',
        judicialConsideration: 'Distinguished',
        caseLaw: 'SURESH vs. STATE REP. BY INSPECTOR OF POLICE',
      },
      {
        citationNumber: '[2021] 5 S.C.R. 781',
        judicialConsideration: 'Distinguished',
        caseLaw: 'SURESH vs. STATE REP. BY INSPECTOR OF POLICE',
      },
    ],
    headers: {
      citationNumber: 'Citation Number',
      judicialConsideration: 'Judicial Consideration',
      caseLaw: 'Case Law',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
