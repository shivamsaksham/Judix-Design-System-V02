import type { Meta, StoryObj } from "@storybook/react"
import { SecondaryBreadcrumb } from "../components/secondary/secondary-breadcrumb"

const meta: Meta<typeof SecondaryBreadcrumb> = {
  title: "Block/SecondaryBreadcrumb",
  component: SecondaryBreadcrumb,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["desktop", "mobile"],
    },
  },
}

export default meta
type Story = StoryObj<typeof SecondaryBreadcrumb>

const mockItems = [
  { label: "Home", href: "/" },
  { label: "Settings", href: "/settings" },
  { label: "My account", active: true },
]

export const Desktop: Story = {
  args: {
    items: mockItems,
    variant: "desktop",
  },
}

export const Mobile: Story = {
  args: {
    items: mockItems,
    variant: "mobile",
    onMenuClick: () => alert("Menu clicked"),
  },
}
