import type { Meta, StoryObj } from "@storybook/react"
import { CourtSelector } from "../components/block/court-selector"
import { useState } from "react"

const meta: Meta<typeof CourtSelector> = {
    title: "Block/CourtSelector",
    component: CourtSelector,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof CourtSelector>

export const Default: Story = {
    render: () => {
        const [selectedCourts, setSelectedCourts] = useState<string[]>([])

        return (
            <CourtSelector
                selectedCourts={selectedCourts}
                onCourtSelect={(court) => setSelectedCourts([...selectedCourts, court])}
                onCourtDeselect={(court) =>
                    setSelectedCourts(selectedCourts.filter((c) => c !== court))
                }
            />
        )
    },
}

export const WithSelection: Story = {
    render: () => {
        const [selectedCourts, setSelectedCourts] = useState<string[]>([
            "Supreme Court of India",
            "High Court of Bombay",
        ])

        return (
            <CourtSelector
                selectedCourts={selectedCourts}
                onCourtSelect={(court) => setSelectedCourts([...selectedCourts, court])}
                onCourtDeselect={(court) =>
                    setSelectedCourts(selectedCourts.filter((c) => c !== court))
                }
            />
        )
    },
}

export const AllSelected: Story = {
    render: () => {
        const [selectedCourts, setSelectedCourts] = useState<string[]>([
            "Supreme Court of India",
            "High Court of Bombay",
            "High Court of Patna",
            "High Court of Madras",
            "High Court of Chhattisgarh",
        ])

        return (
            <CourtSelector
                selectedCourts={selectedCourts}
                onCourtSelect={(court) => setSelectedCourts([...selectedCourts, court])}
                onCourtDeselect={(court) =>
                    setSelectedCourts(selectedCourts.filter((c) => c !== court))
                }
            />
        )
    },
}
