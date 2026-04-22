import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { ResearchHeader, ResearchTab } from "../components/block/research-header";
import { DropdownOption } from "../components/ui/dropdown";

const meta: Meta<typeof ResearchHeader> = {
    title: "Block/ResearchHeader",
    component: ResearchHeader,
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
    },
};

export default meta;
type Story = StoryObj<typeof ResearchHeader>;

const courtOptions: DropdownOption[] = [
    { value: "Supreme Court of India", title: "Supreme Court of India" },
    { value: "High Court of Delhi", title: "High Court of Delhi" },
    { value: "District Court", title: "District Court" },
];

const actOptions: DropdownOption[] = [
    { value: "central-acts", title: "Central Acts" },
    { value: "state-acts", title: "State Acts" },
];

const InteractiveWrapper = ({ initialTab = "judgments" as ResearchTab }) => {
    const [activeTab, setActiveTab] = React.useState<ResearchTab>(initialTab);
    const [courtValue, setCourtValue] = React.useState("Supreme Court of India");
    const [actValue, setActValue] = React.useState("central-acts");

    const dropdownOptions = activeTab === "judgments" ? courtOptions : activeTab === "acts" ? actOptions : undefined;
    const dropdownValue = activeTab === "judgments" ? courtValue : actValue;
    const dropdownLabel = activeTab === "judgments"
        ? (courtOptions.find(o => o.value === courtValue)?.title || "Supreme Court of India")
        : activeTab === "acts"
            ? (actOptions.find(o => o.value === actValue)?.title || "Central Acts")
            : "Web";

    const handleDropdownChange = (value: string) => {
        if (activeTab === "judgments") setCourtValue(value);
        else if (activeTab === "acts") setActValue(value);
    };

    return (
        <div className="w-[408px] bg-white overflow-hidden">
            <ResearchHeader
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onClose={() => console.log("Close clicked")}
                dropdownLabel={dropdownLabel}
                dropdownOptions={dropdownOptions}
                dropdownValue={dropdownValue}
                onDropdownChange={handleDropdownChange}
                onShare={() => console.log("Share clicked")}
                onExport={() => console.log("Export clicked")}
            />
        </div>
    );
};

export const JudgmentsTab: Story = {
    render: () => <InteractiveWrapper initialTab="judgments" />,
    name: "Judgments Tab Active",
};

export const ActsTab: Story = {
    render: () => <InteractiveWrapper initialTab="acts" />,
    name: "Acts Tab Active",
};

export const WebTab: Story = {
    render: () => <InteractiveWrapper initialTab="web" />,
    name: "Web Tab Active",
};
