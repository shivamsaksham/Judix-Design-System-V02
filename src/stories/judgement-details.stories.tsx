import type { Meta, StoryObj } from "@storybook/react";
import JudgementDetails from "../components/block/judgement-details";
import { ContentTreeSection } from "../components/block/content-tree";

const contentTreeMock: ContentTreeSection[] = [
  {
    title: "Summaries",
    items: [
      "Overall summary",
      "Issue",
      "Facts",
      "Arguments",
      "Reasoning",
      "Decision",
    ],
  },
  {
    title: "Case data",
    items: ["Metadata", "Acts & Sections", "Keywords"],
  },
  {
    title: "Citation details",
    items: ["Metadata", "Cases cited"],
  },
];

const meta: Meta<typeof JudgementDetails> = {
  title: "Block/JudgementDetails",
  component: JudgementDetails,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof JudgementDetails>;

/* ---------------- Default ---------------- */

export const Default: Story = {
  args: {
    caseTitle:
      "Dharmendra Kumar Singh & ors. VS The Hon'ble High Court Of Jharkhand & ors.",
    status: "Overruled",
    score: "93.46%",
    scoreSubtitle: "Similar to issues",
    contentSections: contentTreeMock,
  },
};

/* ---------------- High Score ---------------- */

export const HighScore: Story = {
  args: {
    caseTitle:
      "Dharmendra Kumar Singh & ors. VS The Hon'ble High Court Of Jharkhand & ors.",
    status: "Upheld",
    score: "98.10%",
    scoreSubtitle: "Highly Similar",
    contentSections: contentTreeMock,
  },
};

/* ---------------- Low Score ---------------- */

export const LowScore: Story = {
  args: {
    caseTitle:
      "Dharmendra Kumar Singh & ors. VS The Hon'ble High Court Of Jharkhand & ors.",
    status: "Modified",
    score: "41.20%",
    scoreSubtitle: "Low Similarity",
    contentSections: contentTreeMock,
  },
};

/* ---------------- Without Status ---------------- */

export const WithoutStatus: Story = {
  args: {
    caseTitle:
      "Dharmendra Kumar Singh & ors. VS The Hon'ble High Court Of Jharkhand & ors.",
    status: undefined,
    score: "93.46%",
    scoreSubtitle: "Similar to issues",
    contentSections: contentTreeMock,
  },
};

/* ---------------- Long Case Title ---------------- */

export const LongCaseTitle: Story = {
  args: {
    caseTitle:
      `State of Maharashtra and Another VS Indian Hotel and Restaurants 
      Association (AHAR) and Others, along with various interconnected 
      parties including the Ministry of Consumer Affairs`,
    status: "Overruled",
    score: "87.75%",
    scoreSubtitle: "Moderately Similar",
    contentSections: contentTreeMock,
  },
};

/* ---------------- Short Case Title ---------------- */

export const ShortCaseTitle: Story = {
  args: {
    caseTitle: "State vs. Citizen",
    status: "Upheld",
    score: "99.00%",
    scoreSubtitle: "Highly Similar",
    contentSections: contentTreeMock,
  },
};
