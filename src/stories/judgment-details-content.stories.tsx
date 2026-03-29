import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import JudgmentDetailsContent from '@/components/block/judgment-details-content';
import actsTableMeta from './acts-table.stories';
import caseMetadataTableMeta from './case-metadata-table.stories';
import casesCitedMeta from './cases-cited.stories';
import citationDataMeta from './citation-data.stories';

const meta: Meta<typeof JudgmentDetailsContent> = {
  title: 'Block/JudgmentDetailsContent',
  component: JudgmentDetailsContent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    data: {
      overallSummary: `1. Every resident shall be entitled to obtain an Aadhaar number by submitting his demographic information and biometric information by undergoing the process of enrolment:

> Provided that the Central Government may, from time to time, notify such other category of individuals who may be entitled to obtain an Aadhaar number.

2. The enrolling agency shall, at the time of enrolment, inform the individual undergoing enrolment of the following details in such manner as may be specified by regulations, namely:—

* (a) the manner in which the information shall be used;
* (b) the nature of recipients with whom the information is intended to be shared during authentication; and
* (c) the existence of a right to access information, the procedure for making requests for such access, and details of the person or department in-charge to whom such requests can be made.`,
      issue: `1. Every resident shall be entitled to obtain an Aadhaar number by submitting his demographic information and biometric information by undergoing the process of enrolment:

> Provided that the Central Government may, from time to time, notify such other category of individuals who may be entitled to obtain an Aadhaar number.

2. The enrolling agency shall, at the time of enrolment, inform the individual undergoing enrolment of the following details in such manner as may be specified by regulations, namely:—

* (a) the manner in which the information shall be used;
* (b) the nature of recipients with whom the information is intended to be shared during authentication; and
* (c) the existence of a right to access information, the procedure for making requests for such access, and details of the person or department in-charge to whom such requests can be made.`,
      facts: `1. Every resident shall be entitled to obtain an Aadhaar number by submitting his demographic information and biometric information by undergoing the process of enrolment:

> Provided that the Central Government may, from time to time, notify such other category of individuals who may be entitled to obtain an Aadhaar number.

2. The enrolling agency shall, at the time of enrolment, inform the individual undergoing enrolment of the following details in such manner as may be specified by regulations, namely:—

* (a) the manner in which the information shall be used;
* (b) the nature of recipients with whom the information is intended to be shared during authentication; and
* (c) the existence of a right to access information, the procedure for making requests for such access, and details of the person or department in-charge to whom such requests can be made.`,
      arguments: `1. Every resident shall be entitled to obtain an Aadhaar number by submitting his demographic information and biometric information by undergoing the process of enrolment:

> Provided that the Central Government may, from time to time, notify such other category of individuals who may be entitled to obtain an Aadhaar number.

2. The enrolling agency shall, at the time of enrolment, inform the individual undergoing enrolment of the following details in such manner as may be specified by regulations, namely:—

* (a) the manner in which the information shall be used;
* (b) the nature of recipients with whom the information is intended to be shared during authentication; and
* (c) the existence of a right to access information, the procedure for making requests for such access, and details of the person or department in-charge to whom such requests can be made.`,
      reasoning: `1. Every resident shall be entitled to obtain an Aadhaar number by submitting his demographic information and biometric information by undergoing the process of enrolment:

> Provided that the Central Government may, from time to time, notify such other category of individuals who may be entitled to obtain an Aadhaar number.

2. The enrolling agency shall, at the time of enrolment, inform the individual undergoing enrolment of the following details in such manner as may be specified by regulations, namely:—

* (a) the manner in which the information shall be used;
* (b) the nature of recipients with whom the information is intended to be shared during authentication; and
* (c) the existence of a right to access information, the procedure for making requests for such access, and details of the person or department in-charge to whom such requests can be made.`,
      decision: `1. Every resident shall be entitled to obtain an Aadhaar number by submitting his demographic information and biometric information by undergoing the process of enrolment:

> Provided that the Central Government may, from time to time, notify such other category of individuals who may be entitled to obtain an Aadhaar number.

2. The enrolling agency shall, at the time of enrolment, inform the individual undergoing enrolment of the following details in such manner as may be specified by regulations, namely:—

* (a) the manner in which the information shall be used;
* (b) the nature of recipients with whom the information is intended to be shared during authentication; and
* (c) the existence of a right to access information, the procedure for making requests for such access, and details of the person or department in-charge to whom such requests can be made.`,
      caseMetadata: caseMetadataTableMeta.args!.data,
      citationData: citationDataMeta.args!.data,
      actsTable: {
        data: actsTableMeta.args!.data!,
        headers: actsTableMeta.args!.headers!,
      },
      keywords: [
        'Motor Vehicle Act',
        'Anticipatory bail',
        'Accident',
        'Murder',
        'Appellate Jurisdiction',
        'Supreme court of India',
        'Motor Vehicle Act',
        'Anticipatory bail',
        'Accident',
        'Murder',
        'Appellate Jurisdiction',
        'Supreme court of India',
        'Motor Vehicle Act',
        'Motor Vehicle Act',
        'Anticipatory bail',
        'Accident',
        'Murder',
        'Appellate Jurisdiction',
        'Supreme court of India',
        'Murder',
        'Anticipatory bail',
        'Appellate Jurisdiction',
      ],
      casesCited: {
        data: casesCitedMeta.args!.data!,
        headers: casesCitedMeta.args!.headers!,
      },
    }
  },
};

export default meta;
type Story = StoryObj<typeof JudgmentDetailsContent>;

export const Default: Story = {};
