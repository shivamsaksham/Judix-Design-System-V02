import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { SearchSection } from "../components/block/search-section";
import { IconButton } from "../components/ui/icon-button";
import { DropdownOption } from "../components/ui/dropdown";

const meta: Meta<typeof SearchSection> = {
    title: "Block/SearchSection",
    component: SearchSection,
    tags: ["autodocs"],
    argTypes: {
        onVersionChange: { action: "version changed" },
        onDropdownClick: { action: "dropdown clicked" },
        onSearchChange: { action: "search changed" },
    },
};

export default meta;
type Story = StoryObj<typeof SearchSection>;

const versionOptions: DropdownOption[] = [
    { value: "v4", title: "Version 4 . Latest" },
    { value: "v3", title: "Version 3" },
    { value: "v2", title: "Version 2" },
    { value: "v1", title: "Version 1" },
];

const actionOptions: DropdownOption[] = [
    { value: "supreme-court", title: "Supreme Court" },
    { value: "high-court", title: "High Court" },
];

const SearchSectionWithState = (args: React.ComponentProps<typeof SearchSection>) => {
    const [version, setVersion] = React.useState<string | null>(args.version || "v4");
    const [search, setSearch] = React.useState(args.searchValue || "");
    const [dropdownValue, setDropdownValue] = React.useState<string | null>(args.dropdownValue || "supreme-court");

    return (
        <div className="w-[424px] border border-color-border-neutral-default rounded-xl bg-white">
            <SearchSection
                {...args}
                version={version}
                onVersionChange={(v) => {
                    setVersion(v);
                    args.onVersionChange(v);
                }}
                searchValue={search}
                onSearchChange={(e) => {
                    setSearch(e.target.value);
                    args.onSearchChange?.(e);
                }}
                dropdownValue={dropdownValue}
                onDropdownChange={(v) => {
                    setDropdownValue(v);
                    args.onDropdownChange?.(v);
                }}
            />
        </div>
    );
};

export const RelevantJudgments: Story = {
    render: (args) => <SearchSectionWithState {...args} />,
    args: {
        title: "Relevant Judgments",
        version: "v4",
        versionOptions: versionOptions,
        dropdownLabel: "Supreme Court",
        dropdownOptions: actionOptions,
        dropdownValue: "supreme-court",
        actions: (
            <>
                <IconButton
                    icon="Printer"
                    variant="neutral"
                    boundary="stroked"
                    corner="rounded"
                    size="medium"
                    aria-label="Print"
                    className="rounded-lg"
                />
                <IconButton
                    icon="Filter"
                    variant="neutral"
                    boundary="stroked"
                    corner="rounded"
                    size="medium"
                    aria-label="Filter"
                    className="rounded-lg"
                />
            </>
        ),
    },
};

export const ActsAndSections: Story = {
    render: (args) => <SearchSectionWithState {...args} />,
    args: {
        title: "Acts & Sections",
        version: "v4",
        versionOptions: versionOptions,
        dropdownLabel: "Central acts",
        actions: (
            <IconButton
                icon="Printer"
                variant="neutral"
                boundary="stroked"
                corner="rounded"
                size="medium"
                aria-label="Print"
                className="rounded-lg"
            />
        ),
    },
};
