import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { JudgmentResultHeader } from "../components/block/judgment-result-header";
import { ActResultHeader } from "../components/block/act-result-header";
import { DropdownOption } from "../components/ui/dropdown";

const meta: Meta = {
    title: "Block/Result Headers",
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
    },
};

export default meta;

const versionOptions: DropdownOption[] = [
    { value: "v4", title: "Version 4 . Latest" },
    { value: "v3", title: "Version 3" },
    { value: "v2", title: "Version 2" },
    { value: "v1", title: "Version 1" },
];

const supremeCourtOptions: DropdownOption[] = [
    { value: "supreme-court", title: "Supreme Court" },
    { value: "high-court", title: "High Court" },
    { value: "district-court", title: "District Court" },
];

const actOptions: DropdownOption[] = [
    { value: "central-acts", title: "Central Acts" },
    { value: "state-acts", title: "State Acts" },
];

const HeaderWrapper = ({
    Component,
    initialDropdownValue,
    dropdownOptions,
    ...props
}: {
    Component: React.ElementType,
    initialDropdownValue: string,
    dropdownOptions: DropdownOption[],
    [key: string]: any
}) => {
    const [version, setVersion] = React.useState<string | null>("v4");
    const [search, setSearch] = React.useState("");
    const [dropdownValue, setDropdownValue] = React.useState<string | null>(initialDropdownValue);

    return (
        <div className="w-[424px] border border-color-border-neutral-default rounded-xl bg-white">
            <Component
                {...props}
                version={version}
                onVersionChange={setVersion}
                versionOptions={versionOptions}
                searchValue={search}
                onSearchChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                dropdownOptions={dropdownOptions}
                dropdownValue={dropdownValue}
                onDropdownChange={setDropdownValue}
                onDropdownClick={() => console.log("Dropdown clicked")}
                onPrint={() => console.log("Print clicked")}
                onFilter={() => console.log("Filter clicked")}
            />
        </div>
    );
};

export const JudgmentResult: StoryObj<typeof JudgmentResultHeader> = {
    render: () => <HeaderWrapper
        Component={JudgmentResultHeader}
        initialDropdownValue="supreme-court"
        dropdownOptions={supremeCourtOptions}
    />,
    name: "Judgment Result Header",
};

export const ActResult: StoryObj<typeof ActResultHeader> = {
    render: () => <HeaderWrapper
        Component={ActResultHeader}
        initialDropdownValue="central-acts"
        dropdownOptions={actOptions}
    />,
    name: "Act Result Header",
};
