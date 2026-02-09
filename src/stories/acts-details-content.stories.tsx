import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ActsDetailsContent from "@/components/block/acts-details-content";
import actsTableMeta from "./acts-table.stories";

const meta: Meta<typeof ActsDetailsContent> = {
  title: "Block/ActsDetailsContent",
  component: ActsDetailsContent,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    data: {
      sections: [
        {
          id: "section-1",
          title: "Section 1: section 1 title goes here",
          content: `
(1) Every resident shall be entitled to obtain an Aadhaar number by submitting his demographic information and biometric information by undergoing the process of enrolment:

Provided that the Central Government may, from time to time, notify such other category of individuals who may be entitled to obtain an Aadhaar number.

(2) The enrolling agency shall, at the time of enrolment, inform the individual undergoing enrolment of the following details in such manner as may be specified by regulations, namely:—

(a) the manner in which the information shall be used;
(b) the nature of recipients with whom the information is intended to be shared during authentication; and
(c) the existence of a right to access information, the procedure for making requests for such access, and details of the person or department in-charge to whom such requests can be made.
          `,
        },
        {
          id: "section-2",
          title: "Section 2: section 2 title goes here",
          content: `
(1) Every resident shall be entitled to obtain an Aadhaar number by submitting his demographic information and biometric information by undergoing the process of enrolment.

Provided that the Central Government may, from time to time, notify such other category of individuals who may be entitled to obtain an Aadhaar number.
          `,
        },
        {
          id: "section-3",
          title: "Section 3: section 3 title goes here",
          content: `
(1) Every resident shall be entitled to obtain an Aadhaar number by submitting his demographic information and biometric information by undergoing the process of enrolment.
          `,
        },
      ],
    },
  },

};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
