import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { SearchHeaderLayout } from "../components/block/search-header-layout";

const meta: Meta<typeof SearchHeaderLayout> = {
    title: "Block/SearchHeaderLayout",
    component: SearchHeaderLayout,
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
    },
};

export default meta;
type Story = StoryObj<typeof SearchHeaderLayout>;

const LayoutWrapper = (args: React.ComponentProps<typeof SearchHeaderLayout>) => {
    const [search, setSearch] = React.useState("");

    return (
        <div className="w-[424px] border border-color-border-neutral-default rounded-xl bg-white overflow-hidden">
            <SearchHeaderLayout
                {...args}
                searchValue={search}
                onSearchChange={(e) => setSearch(e.target.value)}
                onClose={() => console.log("Close clicked")}
                onShare={() => console.log("Share clicked")}
                onExport={() => console.log("Export clicked")}
            />
        </div>
    );
};

export const Default: Story = {
    render: (args) => <LayoutWrapper {...args} />,
    args: {
        initialTab: "judgments",
    },
};

export const ActsActive: Story = {
    render: (args) => <LayoutWrapper {...args} />,
    args: {
        initialTab: "acts",
    },
    name: "Acts Tab Active",
};
