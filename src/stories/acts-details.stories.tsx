import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ActsDetails from "@/components/block/acts-details";
import { ActsContentTreeSection } from "@/components/block/acts-content-tree";
import JudgmentDetailsContent from "@/components/block/judgment-details-content";

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

const judgmentContent = {
  overallSummary: `
Every resident shall be entitled to obtain an Aadhaar number by submitting demographic and biometric information, subject to statutory safeguards.
`,
  issue: `
Whether mandatory Aadhaar enrolment violates the right to privacy under Article 21 of the Constitution.
`,
  facts: `
The petitioners challenged the Aadhaar framework on grounds of privacy infringement and excessive data collection.
`,
  arguments: `
**Petitioners argued**
- Violation of the right to privacy  
- Risk of mass surveillance  

**Respondents argued**
- Aadhaar ensures targeted delivery of welfare schemes  
- Adequate safeguards exist under law
`,
  reasoning: `
The Court applied the proportionality test and held that Aadhaar serves a legitimate state interest with necessary safeguards.
`,
  decision: `
The Aadhaar scheme is constitutionally valid with restrictions on mandatory linkage in non-welfare contexts.
`,
  keywords: [
    "Aadhaar",
    "Right to Privacy",
    "Article 21",
    "Constitution of India",
  ],
};

const meta: Meta<typeof ActsDetails> = {
  title: "Block/ActsDetails",
  component: ActsDetails,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ActsDetails
      actTitle="Indian Income-tax Act, 1961"
      contentSections={CONTENT_SECTIONS}
      content={[
        {
          title: "Judgment Details",
          body: <JudgmentDetailsContent data={judgmentContent} />,
        },
      ]}
    />
  ),
};

export const LongSidebar: Story = {
  render: () => (
    <ActsDetails
      actTitle="Indian Income-tax Act, 1961"
      contentSections={[
        {
          title: "Sections",
          items: Array.from({ length: 40 }, (_, i) => `Section ${i + 1}`),
        },
      ]}
      content={[
        {
          title: "Content",
          body: (
            <p className="text-style-body-default-regular">
              Sidebar scroll stress test
            </p>
          ),
        },
      ]}
    />
  ),
};
