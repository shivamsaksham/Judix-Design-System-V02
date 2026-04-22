import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { ResultPanel } from "../components/block/result-panel";
import { JudgementTileProps } from "../components/block/judgement-tile";
import { ActResultTileProps } from "../components/block/act-result-tile";
import { ResearchTab } from "../components/block/research-header";

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
const generateJudgments = (count: number): JudgementTileProps[] => {
    return Array.from({ length: count }, (_, i) => ({
        id: `judgment-${i + 1}`,
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
        id: `act-${i + 1}`,
        title: `Indian Penal Code, 1860`,
        section: `Section ${300 + i} ; ${302 + i}`,
        description: `Description for Act ${i + 1}. This section covers specific legal definitions and punishments. The text is generated to simulate real legal content and test the layout. If this text is long enough, the read more button should appear. `.repeat(i % 3 === 0 ? 3 : 1),
        isAdded: false,
        isBookmarked: false,
        isMentioned: false,
    }));
};

const InteractiveResultPanel = ({ initialTab = "judgments" as ResearchTab }) => {
    const [activeTab, setActiveTab] = React.useState<ResearchTab>(initialTab);

    return (
        <div className="h-screen w-full">
            <ResultPanel
                judgments={generateJudgments(15)}
                acts={generateActs(15)}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onClose={() => console.log("Close clicked")}
                onShare={() => console.log("Share clicked")}
                onExport={() => console.log("Export clicked")}
            />
        </div>
    );
};

export const Default: Story = {
    render: () => <InteractiveResultPanel />,
};

export const ActsTabActive: Story = {
    render: () => <InteractiveResultPanel initialTab="acts" />,
    name: "Acts Tab Active",
};

export const WebTabActive: Story = {
    render: () => <InteractiveResultPanel initialTab="web" />,
    name: "Web Tab Active",
};
