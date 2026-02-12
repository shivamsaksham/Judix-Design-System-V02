import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ResultPanel } from "../components/block/result-panel";
import { JudgmentTileProps } from "../components/block/judgment-tile";
import { ActResultTileProps } from "../components/block/act-result-tile";

const meta: Meta<typeof ResultPanel> = {
    title: "Block/ResultPanel",
    component: ResultPanel,
    parameters: {
        layout: "fullscreen",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ResultPanel>;

// Mock Data Generators
const generateJudgments = (count: number): JudgmentTileProps[] => {
    return Array.from({ length: count }, (_, i) => ({
        title: `Judgment Case Title ${i + 1} vs Opposing Party`,
        matchPercentage: `${85 + (i % 15)}%`,
        citationCount: 5 + (i * 2),
        description: `This is a sample description for judgment ${i + 1}. It contains relevant legal principles and case details similar to what was shown in the design. It might be long enough to test the line clamping behavior if needed.`,
        year: `202${i % 5} 3 SCR ${200 + i}`,
        court: i % 3 === 0 ? "Supreme Court of India" : "High Court of Delhi",
        isAdded: false,
        isBookmarked: false,
        isMentioned: false,
    }));
};

const generateActs = (count: number): ActResultTileProps[] => {
    return Array.from({ length: count }, (_, i) => ({
        title: `Indian Penal Code, 1860`,
        section: `Section ${300 + i} ; ${302 + i}`,
        description: `Description for Act ${i + 1}. This section covers specific legal definitions and punishments. The text is generated to simulate real legal content and test the layout. If this text is long enough, the read more button should appear. `.repeat(i % 3 === 0 ? 3 : 1),
        isAdded: false,
        isBookmarked: false,
        isMentioned: false,
    }));
};

export const Default: Story = {
    args: {
        judgments: generateJudgments(15),
        acts: generateActs(15),
    },
    render: (args) => (
        <div className="h-screen w-full">
            <ResultPanel {...args} />
        </div>
    )
};
