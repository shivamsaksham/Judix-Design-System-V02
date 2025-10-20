import * as React from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { TagSelector } from "@/components/block/tag-selector"

const meta: Meta<typeof TagSelector> = {
  title: "Components/TagSelector",
  component: TagSelector,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      // Removed the wrapper div to let the component use its own fixed size
      <div className="w-[384px] flex flex-wrap">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    onSelect: { action: "selected" },
    onDeselect: { action: "deselected" },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const allTagsList = [
  "Civil",
  "Documents",
  "Tax",
  "Criminal",
  "Audits",
  "Bail",
  "Land case",
  "Property",
  "Dispute",
  "Contracts",
]

export const Default: Story = {
  args: {
    label: "Select or create tags",
    availableTags: allTagsList,
    selectedTags: [],
    badgeCount: undefined,
  },
}

export const WithSelectedTags: Story = {
  args: {
    label: "Select or create tags",
    availableTags: [
      "Tax",
      "Criminal",
      "Audits",
      "Bail",
      "Land case",
      "Property",
      "Dispute",
      "Contracts",
    ],
    selectedTags: ["Civil", "Documents"],
    badgeCount: 8,
  },
}

export const Interactive: Story = {
  args: {
    label: "Select or create tags",
  },
  render: (args) => {
    const [selected, setSelected] = React.useState<string[]>([
      "Civil",
      "Documents",
    ])

    const available = allTagsList.filter((tag) => !selected.includes(tag))

    const handleSelect = (tag: string) => {
      if (!selected.includes(tag)) {
        setSelected([...selected, tag])
      }
    }

    const handleDeselect = (tag: string) => {
      setSelected(selected.filter((t) => t !== tag))
    }

    return (
      <TagSelector
        {...args}
        selectedTags={selected}
        availableTags={available}
        onSelect={handleSelect}
        onDeselect={handleDeselect}
        badgeCount={available.length}
      />
    )
  },
}

export const Overflow: Story = {
  args: {
    label: "Select or create tags",
    availableTags: [
      ...allTagsList,
      "Family Law",
      "Arbitration",
      "Litigation",
      "Supreme Court",
      "High Court",
      "Drafting",
      "Review",
      "Compliance",
    ],
    selectedTags: ["Intellectual Property", "Startups"],
    badgeCount: 18,
  },
}