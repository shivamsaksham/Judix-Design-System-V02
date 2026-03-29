import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { SearchHeaderLayout } from "../components/block/search-header-layout";
import { DropdownOption } from "../components/ui/dropdown";

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

const versionOptions: DropdownOption[] = [
    { value: "v4", title: "Version 4 . Latest" },
    { value: "v3", title: "Version 3" },
    { value: "v2", title: "Version 2" },
    { value: "v1", title: "Version 1" },
];

const LayoutWrapper = (args: React.ComponentProps<typeof SearchHeaderLayout>) => {
    const [version, setVersion] = React.useState<string | null>("v4");
    const [search, setSearch] = React.useState("");

    return (
        <div className="w-[424px] border border-color-border-neutral-default bg-white">
            <SearchHeaderLayout
                {...args}
                version={version}
                onVersionChange={setVersion}
                versionOptions={versionOptions}
                searchValue={search}
                onSearchChange={(e) => setSearch(e.target.value)}
                onPrint={() => console.log("Print clicked")}
                onFilter={() => console.log("Filter clicked")}
            />
        </div>
    );
};

export const Default: Story = {
    render: (args) => <LayoutWrapper {...args} />,
    args: {
        initialDropdownValue: "supreme-court",
    },
};
