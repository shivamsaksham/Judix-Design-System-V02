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
      overview: `1. Every resident shall be entitled to obtain an Aadhaar number by submitting his demographic information and biometric information by undergoing the process of enrolment:

> Provided that the Central Government may, from time to time, notify such other category of individuals who may be entitled to obtain an Aadhaar number.

2. The enrolling agency shall, at the time of enrolment, inform the individual undergoing enrolment of the following details in such manner as may be specified by regulations, namely:—

* (a) the manner in which the information shall be used;
* (b) the nature of recipients with whom the information is intended to be shared during authentication; and
* (c) the existence of a right to access information, the procedure for making requests for such access, and details of the person or department in-charge to whom such requests can be made.`,

      applicability: `This Act applies to all residents seeking identification under the Aadhaar framework and to all authorities involved in the enrolment, authentication, and regulation process.`,

      definitions: `In this Act, unless the context otherwise requires:

* “Aadhaar number” means an identification number issued to an individual.
* “Authentication” means the process by which the Aadhaar number is submitted along with demographic or biometric information for verification.`,

      provisions: `1. The Authority shall establish procedures for issuing Aadhaar numbers.
2. No individual shall be denied any service for want of Aadhaar, except as provided by law.`,

      penalties: `Whoever contravenes the provisions of this Act shall be punishable with imprisonment or fine as prescribed under the relevant sections.`,

      actsTable: {
        data: actsTableMeta.args!.data!,
        headers: actsTableMeta.args!.headers!,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
