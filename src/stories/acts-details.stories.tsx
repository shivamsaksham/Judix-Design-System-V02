import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ActsDetails from "@/components/block/acts-details";
import { ActsContentTreeSection } from "@/components/block/acts-content-tree";
import { ActsDetailsData } from "@/components/block/acts-details-content";
import actsTableMeta from "./acts-table.stories";

/* ---------- Sidebar Mock ---------- */
const CONTENT_SECTIONS = [
  {
    title: "Sections",
    items: [
      "Section 1",
      "Section 2",
      "Section 3",
      "Section 4",
      "Section 5",
      "Section 6",
    ],
  },
  {
    title: "Schedules",
    items: ["Schedule I", "Schedule II", "Schedule III"],
  },
  {
    title: "Orders",
    items: ["Order 1", "Order 2"],
  },
  {
    title: "Rules",
    items: ["Rule 1"],
  },
];

/* ---------- Content Mock ---------- */
const actsDetailsDataMock: ActsDetailsData = {
  sections: [
    {
      id: "Section 1",
      title: "Section 1: section 1 title goes here",
      content: `
(1) Every resident shall be entitled to obtain an Aadhaar number by submitting his demographic information and biometric information by undergoing the process of enrolment:

Provided that the Central Government may, from time to time, notify such other category of individuals who may be entitled to obtain an Aadhaar number.

(2) The enrolling agency shall, at the time of enrolment, inform the individual undergoing enrolment of the following details, namely:—

(a) the manner in which the information shall be used;
(b) the nature of recipients with whom the information is intended to be shared during authentication; and
(c) the existence of a right to access information.
      `,
    },
    {
      id: "Section 2",
      title: "Section 2: section 2 title goes here",
      content: `
(1) Every resident shall be entitled to obtain an Aadhaar number by submitting his demographic information and biometric information by undergoing the process of enrolment .

Lorem ipsum dolor sit amet consectetur, adipisicing elit. Modi quas suscipit tempore reprehenderit facilis ratione laborum asperiores non sapiente, nemo accusamus quaerat ducimus, corporis rerum excepturi autem harum veritatis obcaecati voluptas nobis? Eligendi saepe velit inventore libero sed at ipsa tempora. Enim sit optio eos placeat corrupti eveniet ratione magni dignissimos veniam? Expedita saepe ab, error quo voluptatum magni veritatis?
Lorem ipsum dolor sit amet consectetur, adipisicing elit. Modi quas suscipit tempore reprehenderit facilis ratione laborum asperiores non sapiente, nemo accusamus quaerat ducimus, corporis rerum excepturi autem harum veritatis obcaecati voluptas nobis? Eligendi saepe velit inventore libero sed at ipsa tempora. Enim sit optio eos placeat corrupti eveniet ratione magni dignissimos veniam? Expedita saepe ab, error quo voluptatum magni veritatis?
`,
    },
    {
      id: "Section 3",
      title: "Section 3: section 3 title goes here",
      content: `
  (1) Every resident shall be entitled to obtain an Aadhaar number by submitting his demographic information and biometric information by undergoing the process of enrolment.
  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Modi quas suscipit tempore reprehenderit facilis ratione laborum asperiores non sapiente, nemo accusamus quaerat ducimus, corporis rerum excepturi autem harum veritatis obcaecati voluptas nobis? Eligendi saepe velit inventore libero sed at ipsa tempora. Enim sit optio eos placeat corrupti eveniet ratione magni dignissimos veniam? Expedita saepe ab, error quo voluptatum magni veritatis?
  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Modi quas suscipit tempore reprehenderit facilis ratione laborum asperiores non sapiente, nemo accusamus quaerat ducimus, corporis rerum excepturi autem harum veritatis obcaecati voluptas nobis? Eligendi saepe velit inventore libero sed at ipsa tempora. Enim sit optio eos placeat corrupti eveniet ratione magni dignissimos veniam? Expedita saepe ab, error quo voluptatum magni veritatis?
  `,
    },
    {
      id: "Section 4",
      title: "Section 4: section 4 title goes here",
      content: `
  (1) Every resident shall be entitled to obtain an Aadhaar number by submitting his demographic information and biometric information by undergoing the process of enrolment.
  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Modi quas suscipit tempore reprehenderit facilis ratione laborum asperiores non sapiente, nemo accusamus quaerat ducimus, corporis rerum excepturi autem harum veritatis obcaecati voluptas nobis? Eligendi saepe velit inventore libero sed at ipsa tempora. Enim sit optio eos placeat corrupti eveniet ratione magni dignissimos veniam? Expedita saepe ab, error quo voluptatum magni veritatis?
  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Modi quas suscipit tempore reprehenderit facilis ratione laborum asperiores non sapiente, nemo accusamus quaerat ducimus, corporis rerum excepturi autem harum veritatis obcaecati voluptas nobis? Eligendi saepe velit inventore libero sed at ipsa tempora. Enim sit optio eos placeat corrupti eveniet ratione magni dignissimos veniam? Expedita saepe ab, error quo voluptatum magni veritatis?
  `,
    },
    {
      id: "Section 5",
      title: "Section 5: section 5 title goes here",
      content: `
  (1) Every resident shall be entitled to obtain an Aadhaar number by submitting his demographic information and biometric information by undergoing the process of enrolment.
  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Modi quas suscipit tempore reprehenderit facilis ratione laborum asperiores non sapiente, nemo accusamus quaerat ducimus, corporis rerum excepturi autem harum veritatis obcaecati voluptas nobis? Eligendi saepe velit inventore libero sed at ipsa tempora. Enim sit optio eos placeat corrupti eveniet ratione magni dignissimos veniam? Expedita saepe ab, error quo voluptatum magni veritatis?
  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Modi quas suscipit tempore reprehenderit facilis ratione laborum asperiores non sapiente, nemo accusamus quaerat ducimus, corporis rerum excepturi autem harum veritatis obcaecati voluptas nobis? Eligendi saepe velit inventore libero sed at ipsa tempora. Enim sit optio eos placeat corrupti eveniet ratione magni dignissimos veniam? Expedita saepe ab, error quo voluptatum magni veritatis?
  `,
    },
    {
      id: "Section 6",
      title: "Section 6: section 6 title goes here",
      content: `
  (1) Every resident shall be entitled to obtain an Aadhaar number by submitting his demographic information and biometric information by undergoing the process of enrolment.
  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Modi quas suscipit tempore reprehenderit facilis ratione laborum asperiores non sapiente, nemo accusamus quaerat ducimus, corporis rerum excepturi autem harum veritatis obcaecati voluptas nobis? Eligendi saepe velit inventore libero sed at ipsa tempora. Enim sit optio eos placeat corrupti eveniet ratione magni dignissimos veniam? Expedita saepe ab, error quo voluptatum magni veritatis?
  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Modi quas suscipit tempore reprehenderit facilis ratione laborum asperiores non sapiente, nemo accusamus quaerat ducimus, corporis rerum excepturi autem harum veritatis obcaecati voluptas nobis? Eligendi saepe velit inventore libero sed at ipsa tempora. Enim sit optio eos placeat corrupti eveniet ratione magni dignissimos veniam? Expedita saepe ab, error quo voluptatum magni veritatis?
  `,
    },
    {
      id: "Schedule I",
      title: "Schedule I: schedule 1 title goes here",
      content: `
  (1) Every resident shall be entitled to obtain an Aadhaar number by submitting his demographic information and biometric information by undergoing the process of enrolment.
  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Modi quas suscipit tempore reprehenderit facilis ratione laborum asperiores non sapiente, nemo accusamus quaerat ducimus, corporis rerum excepturi autem harum veritatis obcaecati voluptas nobis? Eligendi saepe velit inventore libero sed at ipsa tempora. Enim sit optio eos placeat corrupti eveniet ratione magni dignissimos veniam? Expedita saepe ab, error quo voluptatum magni veritatis?
  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Modi quas suscipit tempore reprehenderit facilis ratione laborum asperiores non sapiente, nemo accusamus quaerat ducimus, corporis rerum excepturi autem harum veritatis obcaecati voluptas nobis? Eligendi saepe velit inventore libero sed at ipsa tempora. Enim sit optio eos placeat corrupti eveniet ratione magni dignissimos veniam? Expedita saepe ab, error quo voluptatum magni veritatis?
      `,
    },
  ],
};

/* ---------- Meta ---------- */
const meta: Meta<typeof ActsDetails> = {
  title: "Block/ActsDetails",
  component: ActsDetails,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/* ---------- Default ---------- */
export const Default: Story = {
  args: {
    actTitle: "Indian Income-tax Act, 1961",
    contentSections: CONTENT_SECTIONS,
    actsDetailsData: actsDetailsDataMock,
  },
};

/* ---------- Long Sidebar Stress Test ---------- */
export const LongSidebar: Story = {
  args: {
    actTitle: "Indian Income-tax Act, 1961",
    contentSections: [
      {
        title: "Sections",
        items: Array.from({ length: 50 }, (_, i) => `Section ${i + 1}`),
      },
    ],
    actsDetailsData: actsDetailsDataMock,
  },
};
