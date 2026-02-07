import type { Meta, StoryObj } from "@storybook/react";
import JudgementDetails from "../components/block/judgement-details";
import { ContentTreeSection } from "../components/block/content-tree";
import { JudgmentData } from "../components/block/judgment-details-content";
import actsTableMeta from "./acts-table.stories";
import caseMetadataTableMeta from "./case-metadata-table.stories";
import citationDataMeta from "./citation-data.stories";
import casesCitedMeta from "./cases-cited.stories";

const judgmentDataMock: JudgmentData = {
  overallSummary: `1. Every resident shall be entitled to obtain an Aadhaar number by submitting his demographic information and biometric information by undergoing the process of enrolment:

> Provided that the Central Government may, from time to time, notify such other category of individuals who may be entitled to obtain an Aadhaar number.

2. The enrolling agency shall, at the time of enrolment, inform the individual undergoing enrolment of the following details in such manner as may be specified by regulations, namely:—

* (a) the manner in which the information shall be used;
* (b) the nature of recipients with whom the information is intended to be shared during authentication; and
* (c) the existence of a right to access information, the procedure for making requests for such access, and details of the person or department in-charge to whom such requests can be made.`,

  issue: `Every resident shall be entitled to obtain an Aadhaar number by submitting his demographic information and biometric information by undergoing the process of enrolment:
Provided that the Central Government may, from time to time, notify such other category of individuals who may be entitled to obtain an Aadhaar number.

The enrolling agency shall, at the time of enrolment, inform the individual undergoing enrolment of the following details in such manner as may be specified by regulations, namely:—\n\n


(a) the manner in which the information shall be used;\n
(b) the nature of recipients with whom the information is intended to be shared during authentication; and\n
(c) the existence of a right to access information, the procedure for making requests for such access, and details of the person or department in-charge to whom such requests can be made.`,


  facts: `Every resident shall be entitled to obtain an Aadhaar number by submitting his demographic information and biometric information by undergoing the process of enrolment:
Provided that the Central Government may, from time to time, notify such other category of individuals who may be entitled to obtain an Aadhaar number.

The enrolling agency shall, at the time of enrolment, inform the individual undergoing enrolment of the following details in such manner as may be specified by regulations, namely:—\n\n
(a) the manner in which the information shall be used;\n
(b) the nature of recipients with whom the information is intended to be shared during authentication; and\n
(c) the existence of a right to access information, the procedure for making requests for such access, and details of the person or department in-charge to whom such requests can be made.`,

  arguments: `Every resident shall be entitled to obtain an Aadhaar number by submitting his demographic information and biometric information by undergoing the process of enrolment:
Provided that the Central Government may, from time to time, notify such other category of individuals who may be entitled to obtain an Aadhaar number.

The enrolling agency shall, at the time of enrolment, inform the individual undergoing enrolment of the following details in such manner as may be specified by regulations, namely:—\n\n
(a) the manner in which the information shall be used;\n
(b) the nature of recipients with whom the information is intended to be shared during authentication; and\n
(c) the existence of a right to access information, the procedure for making requests for such access, and details of the person or department in-charge to whom such requests can be made.\n`,

  reasoning: `Every resident shall be entitled to obtain an Aadhaar number by submitting his demographic information and biometric information by undergoing the process of enrolment:
Provided that the Central Government may, from time to time, notify such other category of individuals who may be entitled to obtain an Aadhaar number.\n\n

The enrolling agency shall, at the time of enrolment, inform the individual undergoing enrolment of the following details in such manner as may be specified by regulations, namely:—\n
(a) the manner in which the information shall be used;\n
(b) the nature of recipients with whom the information is intended to be shared during authentication; and\n
(c) the existence of a right to access information, the procedure for making requests for such access, and details of the person or department in-charge to whom such requests can be made.\n`,

  decision: `Every resident shall be entitled to obtain an Aadhaar number by submitting his demographic information and biometric information by undergoing the process of enrolment:
Provided that the Central Government may, from time to time, notify such other category of individuals who may be entitled to obtain an Aadhaar number.\n\n

The enrolling agency shall, at the time of enrolment, inform the individual undergoing enrolment of the following details in such manner as may be specified by regulations, namely:—\n
(a) the manner in which the information shall be used;\n
(b) the nature of recipients with whom the information is intended to be shared during authentication; and\n
(c) the existence of a right to access information, the procedure for making requests for such access, and details of the person or department in-charge to whom such requests can be made.\n`,

  caseMetadata: caseMetadataTableMeta.args!.data,
  citationData: citationDataMeta.args!.data,

  actsTable: {
    data: actsTableMeta.args!.data!,
    headers: actsTableMeta.args!.headers!,
  },

  keywords: [
    "Motor Vehicle Act",
    "Anticipatory bail",
    "Accident",
    "Murder",
    "Appellate Jurisdiction",
    "Supreme court of India",
  ],

  casesCited: {
    data: casesCitedMeta.args!.data!,
    headers: casesCitedMeta.args!.headers!,
  },
};


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
      { id: "keywords", label: "Keywords" },],
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
    judgmentData: judgmentDataMock,
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
    judgmentData: judgmentDataMock,
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
    judgmentData: judgmentDataMock,
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
    judgmentData: judgmentDataMock,
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
    judgmentData: judgmentDataMock,
  },
};

export const ShortCaseTitle: Story = {
  args: {
    caseTitle: "State vs. Citizen",
    status: "Upheld",
    score: "99.00%",
    scoreSubtitle: "Highly Similar",
    contentSections: contentTreeMock,
    judgmentData: judgmentDataMock,
  },
};
