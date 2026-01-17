import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ContentTree, { type ContentTreeSection } from "@/components/block/content-tree";

const DEFAULT_SECTIONS: ContentTreeSection[] = [
  {
    title: "Summaries",
    items: [
      "Summary",
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
        title: "Summaries",
        items: ["Overview", "Decision"],
      },
    ],
  },
};

export const LongContent: Story = {
  args: {
    sections: [
      {
        title: "Summaries",
        items: Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`),
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
    activeItem: "Summary",
  },
};

export const Clickable: Story = {
  args: {
    sections: DEFAULT_SECTIONS,
    onItemClick: (section, item) => {
      console.log("Clicked:", section, item);
    },
  },
};
