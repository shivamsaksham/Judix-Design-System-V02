import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ActsContentTree, {
  type ActsContentTreeSection,
} from "@/components/block/acts-content-tree";

const DEFAULT_SECTIONS: ActsContentTreeSection[] = [
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

const meta: Meta<typeof ActsContentTree> = {
  title: "Block/ActsContentTree",
  component: ActsContentTree,
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
        title: "Sections",
        items: ["Section 1", "Section 2"],
      },
    ],
  },
};

export const LongContent: Story = {
  args: {
    sections: [
      {
        title: "Sections",
        items: Array.from({ length: 20 }, (_, i) => `Section ${i + 1}`),
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
    activeItem: "Section 1",
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
