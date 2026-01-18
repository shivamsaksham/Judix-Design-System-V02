import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ContentTree, {
  type ContentTreeSection,
} from "@/components/block/content-tree";

const DEFAULT_SECTIONS: ContentTreeSection[] = [
  {
    id: "summaries",
    title: "Summaries",
    items: [
      { id: "summary", label: "Summary" },
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

const meta: Meta<typeof ContentTree> = {
  title: "Block/ContentTree",
  component: ContentTree,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="bg-color-color-surface-neutral-default p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    sections: DEFAULT_SECTIONS,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    sections: [],
  },
};

export const SingleSection: Story = {
  args: {
    sections: [
      {
        id: "summaries",
        title: "Summaries",
        items: [
          { id: "overview", label: "Overview" },
          { id: "decision", label: "Decision" },
        ],
      },
    ],
  },
};

export const LongContent: Story = {
  args: {
    sections: [
      {
        id: "summaries",
        title: "Summaries",
        items: Array.from({ length: 20 }, (_, i) => ({
          id: `item-${i + 1}`,
          label: `Item ${i + 1}`,
        })),
      },
    ],
  },
};

export const NarrowContainer: Story = {
  decorators: [
    (Story) => (
      <div className="w-[180px] bg-color-color-surface-neutral-default p-2">
        <Story />
      </div>
    ),
  ],
};

export const WithActiveItem: Story = {
  args: {
    sections: DEFAULT_SECTIONS,
    activeItemId: "summary",
  },
};

export const Clickable: Story = {
  args: {
    sections: DEFAULT_SECTIONS,
    onItemClick: (sectionId, itemId) => {
      console.log("Clicked:", sectionId, itemId);
    },
  },
};
