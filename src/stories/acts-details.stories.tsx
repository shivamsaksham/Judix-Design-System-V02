import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ActsDetails from "@/components/block/acts-details";
import { ActsContentTreeSection } from "@/components/block/acts-content-tree";
import { ActsDetailsData } from "@/components/block/acts-details-content";
import actsTableMeta from "./acts-table.stories";

/* ---------- Sidebar Mock ---------- */
const CONTENT_SECTIONS: ActsContentTreeSection[] = [
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
  overview: `
Every resident shall be entitled to obtain an Aadhaar number by submitting
demographic and biometric information in accordance with the provisions of this Act.
`,

  applicability: `
This Act applies to all persons liable to pay income tax under the provisions
of the Income-tax Act, 1961.
`,

  definitions: `
"Assessee" means a person by whom any tax or any other sum of money is payable.
`,

  provisions: `
• Filing of returns  
• Assessment procedures  
• Appeals and revisions  
• Penalties and prosecutions
`,

  penalties: `
Failure to comply with the provisions of this Act may result in monetary
penalties or prosecution.
`,

  actsTable: {
    data: actsTableMeta.args!.data!,
    headers: actsTableMeta.args!.headers!,
  },
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
