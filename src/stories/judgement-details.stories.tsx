import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import JudgementDetails from "../components/block/judgement-details";
import { ContentTreeSection } from "../components/block/content-tree";

const contentTreeMock: ContentTreeSection[] = [
  {
    id: "summaries",
    title: "Summaries",
    items: [
      { id: "overall-summary", label: "Overall summary" },
      { id: "issue", label: "Issue" },
      { id: "facts", label: "Facts" },
      { id: "arguments", label: "Arguments" },
      { id: "reasoning", label: "Reasoning" },
      { id: "decision", label: "Decision" },
    ],
  },
  {
    id: "case-data",
    title: "Case data",
    items: [
      { id: "metadata", label: "Metadata" },
      { id: "acts-sections", label: "Acts & Sections" },
      { id: "keywords", label: "Keywords" },
    ],
  },
  {
    id: "citation-details",
    title: "Citation details",
    items: [
      { id: "citation-metadata", label: "Metadata" },
      { id: "cases-cited", label: "Cases cited" },
    ],
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

export const LongCaseTitle: Story = {
  args: {
    caseTitle: `
      State of Maharashtra and Another VS Indian Hotel and Restaurants 
      Association (AHAR) and Others, along with various interconnected 
      parties including the Ministry of Consumer Affairs
    `,
    status: "Overruled",
    score: "87.75%",
    scoreSubtitle: "Moderately Similar",
    contentSections: contentTreeMock,
  },
};

export const ShortCaseTitle: Story = {
  args: {
    caseTitle: "State vs. Citizen",
    status: "Upheld",
    score: "99.00%",
    scoreSubtitle: "Highly Similar",
    contentSections: contentTreeMock,
  },
};
