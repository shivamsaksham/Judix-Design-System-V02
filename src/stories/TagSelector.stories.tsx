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
      <Story />
    ),
  ],
  argTypes: {
    onSelect: { action: "selected" },
    onDeselect: { action: "deselected" },
    onCreateTag: { action: "created" },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const initialTagsList = [
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
    placeholder: "Select or create tags",
    availableTags: initialTagsList,
    selectedTags: [],
    badgeCount: undefined,
  },
}

export const WithSelectedTags: Story = {
  args: {
    placeholder: "Select or create tags",
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
    placeholder: "Select or create tags",
  },
  render: (args) => {
    const [allTags, setAllTags] = React.useState(initialTagsList)
    const [selected, setSelected] = React.useState<string[]>([
      "Civil",
      "Documents",
    ])

    const available = allTags.filter((tag) => !selected.includes(tag))

    const handleSelect = (tag: string) => {
      if (!selected.includes(tag)) {
        setSelected([...selected, tag])
      }
    }

    const handleDeselect = (tag: string) => {
      setSelected(selected.filter((t) => t !== tag))
    }
    
    const handleCreateTag = (tag: string) => {
      if (!allTags.includes(tag)) {
        setAllTags([...allTags, tag])
      }
      if (!selected.includes(tag)) {
        setSelected([...selected, tag])
      }
    }

    return (
      <TagSelector
        {...args}
        selectedTags={selected}
        availableTags={available}
        onSelect={handleSelect}
        onDeselect={handleDeselect}
        onCreateTag={handleCreateTag}
        badgeCount={selected.length}
      />
    )
  },
}

export const Overflow: Story = {
  args: {
    placeholder: "Select or create tags",
    availableTags: [
      ...initialTagsList,
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