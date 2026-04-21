import type { Meta, StoryObj } from "@storybook/react"
import { MyActivity } from "@/components/secondary/my-activity"

const meta = {
  title: "Block/MyActivity",
  component: MyActivity,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MyActivity>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    lastLogin: "09 April, 2026 11:38 pm",
    sessions: [
      {
        id: "1",
        device: "Chrome on MacOS",
        os: "MacOS",
        location: "Patna, Bihar",
        date: "March 21, 2026 at 11:36",
        isCurrent: true,
      },
      {
        id: "2",
        device: "Desktop Windows 11",
        os: "Windows 11",
        location: "Patna, Bihar",
        date: "April 01, 2026 at 14:16",
        isCurrent: false,
      },
      {
        id: "3",
        device: "Android 16",
        os: "Android 16",
        location: "Delhi NCR",
        date: "April 11, 2026 at 09:12",
        isCurrent: false,
      },
    ],
    projects: [
      { id: "p1", name: "Judix Design System" },
      { id: "p2", name: "Secondary Pages" },
      { id: "p3", name: "Judix Platform" },
    ],
    onLogoutSession: (id) => console.log(`Logged out of session ${id}`),
    onLogoutAll: () => console.log("Logged out of all devices"),
    onExportActivity: () => console.log("Exporting activity logs"),
    onSelectProject: (id) => console.log(`Selected project ${id}`),
    onDeleteAccount: () => console.log("Deleting account"),
  },
}

export const Empty: Story = {
    args: {
        lastLogin: "Never",
        sessions: [],
        projects: [],
    }
}
