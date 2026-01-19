
import type { Meta, StoryObj } from "@storybook/react";
import SearchEngineInput, { OptionHelper, TriggerConfig, StaticDataConfig, TokenStructure } from "@/components/block/search-engine-input";
import { Icon } from "judix-icon";

const meta: Meta<typeof SearchEngineInput> = {
    title: "Block/SearchEngineInput",
    component: SearchEngineInput,
    parameters: {
        layout: "fullscreen",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SearchEngineInput>;

// Mock Data
const MOCK_SCOPES = ["Issues", "Facts", "Arguments", "Reasoning", "Court decision", "Overall search"];

const MOCK_COURT_CATEGORIES = [
    {
        id: "apex",
        label: "Apex court",
        courts: ["Supreme Court of India"]
    },
    {
        id: "high",
        label: "High Court",
        courts: [
            "High Court of Bombay",
            "High Court of Patna",
            "High Court of Madras",
            "High Court of Chhattisgarh"
        ]
    }
];

const MOCK_FOLDERS = [
    {
        value: "1",
        title: "Patna land case",
        subtext: "Land acquisition case filed in Patna HC. Respondent side.",
        leadingIcon: <Icon name="DocumentText" className="w-5 h-5 text-gray-700" />,
    },
    {
        value: "2",
        title: "GST tax notice case",
        subtext: "GST notice tax refund case. Issue in filing of GSTR 3B",
        leadingIcon: <Icon name="DocumentText" className="w-5 h-5 text-gray-700" />,
    },
    {
        value: "3",
        title: "Non bailable offence lucknow",
        subtext: "A murder case in Lucknow. Petitioner side.",
        leadingIcon: <Icon name="DocumentText" className="w-5 h-5 text-gray-700" />,
    },
];

const STATIC_OPTIONS: OptionHelper[] = [
    { value: "Case", title: "Case type" },
    { value: "Year", title: "Year range" },
    { value: "Judge", title: "Judge" },
    { value: "Bench", title: "Bench" },
    { value: "Act", title: "Acts and Sections" },
    { value: "SCR", title: "SCR citation" },
    { value: "INSC", title: "INSC citation" },
    { value: "Appellant", title: "Appellant" },
    { value: "Respondent", title: "Respondent" },
];

const QUICK_ADD_OPTIONS: OptionHelper[] = [
    {
        value: "add_context",
        title: "Add Context",
        leadingIcon: <Icon name="Add" />,
    },
    {
        value: "static_data",
        title: "Specify static data",
        leadingIcon: <Icon name="Data" />,
        options: STATIC_OPTIONS,
    },
    {
        value: "connect_project",
        title: "Connect to project",
        leadingIcon: <Icon name="Document" />,
        trailingAccessory: <Icon name="ArrowRight" />,
        className: "border-t border-color-border-neutral-default mt-2 pt-2 items-center",
        options: [
            {
                value: "Patna_land_case",
                title: "Patna land case",
                leadingIcon: <Icon name="Cube" />,
                subtext: "Land acquisition case filed in Patna HC. Respondent side.",
            },
            {
                value: "GST_tax",
                title: "GST tax notice case",
                leadingIcon: <Icon name="Cube" />,
                subtext: "GST notice tax refund case. Issue in filing of GSTR 3B",
            },
        ],
        Searchbar: "attached",
    },
];

const MENTIONS_OPTIONS: OptionHelper[] = [
    {
        value: "Query-1 summary",
        title: "@ Query-1 summary",
        subtext: "This is the summary of the first question that the user has asked.",
    },
    { value: "Siroh Nagar Palika vs Adani gas limited", title: "@ Siroh Nagar Palika vs Adani gas limited" },
];

const COMMAND_OPTIONS: OptionHelper[] = [
    { value: "/Find case laws", title: "/ Find case laws" },
    { value: "/Interpret Laws and rules", title: "/ Interpret Laws and rules" },
];

const MOCK_TRIGGERS: Record<string, TriggerConfig> = {
    "@": { options: MENTIONS_OPTIONS, renderType: "flat" },
    "[": { options: STATIC_OPTIONS, renderType: "flat" },
    "/": { options: COMMAND_OPTIONS, renderType: "flat" },
};

const MOCK_STATIC_DATA: StaticDataConfig = {
    "Case": ["Civil Appeal", "Criminal Appeal", "SLP (Civil)", "SLP (Criminal)"].map(c => ({ value: c, title: c })),
    "Judge": ["D.Y. Chandrachud", "Sanjiv Khanna", "B.R. Gavai", "Surya Kant", "Hima Kohli", "Abhay S. Oka"].map(j => ({ value: j, title: j })),
    "Appellant": ["Union of India", "State of Maharashtra"].map(p => ({ value: p, title: p })),
    "Respondent": ["Union of India", "State of Maharashtra"].map(p => ({ value: p, title: p })),
};

const STORY_TOKEN_CONFIG: Record<string, TokenStructure> = {
    Year: {
        trigger: "Year",
        prefix: "[Year:-",
        suffix: "]",
        inputs: [{ key: "year" }]
    },
    Case: {
        trigger: "Case",
        prefix: "[Case:-",
        suffix: "]",
        inputs: [{ placeholder: "select", key: "case_type" }]
    },
    Judge: {
        trigger: "Judge",
        prefix: "[Judge:-",
        suffix: "]",
        inputs: [{ placeholder: "select", key: "judge" }]
    },
    Bench: {
        trigger: "Bench",
        prefix: "[Bench:-",
        suffix: "]",
        inputs: [{ key: "bench" }]
    },
    Act: {
        trigger: "Act",
        prefix: "[Act:- ",
        suffix: "]",
        inputs: [
            { placeholder: "name", key: "act_name" },
            { prefix: " ; Section:- ", placeholder: "section", key: "section" }
        ]
    },
    SCR: {
        trigger: "SCR",
        prefix: "[SCR:-",
        suffix: "]",
        inputs: [{ placeholder: "year volume SCR page", key: "scr_citation" }]
    },
    INSC: {
        trigger: "INSC",
        prefix: "[INSC:-",
        suffix: "]",
        inputs: [{ placeholder: "year INSC number", key: "insc_citation" }]
    },
    Appellant: {
        trigger: "Appellant",
        prefix: "[Appellant:-",
        suffix: "]",
        inputs: [{ key: "appellant" }]
    },
    Respondent: {
        trigger: "Respondent",
        prefix: "[Respondent:-",
        suffix: "]",
        inputs: [{ key: "respondent" }]
    },
    Court: {
        trigger: "Court",
        prefix: "[Court:-",
        suffix: "]",
        inputs: [{ key: "court" }]
    }
};

export const Default: Story = {
    args: {
        scopes: MOCK_SCOPES,
        courtCategories: MOCK_COURT_CATEGORIES,
        folderOptions: MOCK_FOLDERS,
        quickAddOptions: QUICK_ADD_OPTIONS,
        triggers: MOCK_TRIGGERS,
        staticData: MOCK_STATIC_DATA,
        tokenConfig: STORY_TOKEN_CONFIG,
        onSubmit: (payload) => console.log("Submit Payload:", payload),
    },
};

export const WithHelperText: Story = {
    args: {
        ...Default.args,
        helperText: "You can ask about cases, laws, or specific legal documents.",
    },
};

export const WithCustomTokens: Story = {
    args: {
        ...Default.args,
        helperText: "Try typing '[' to see custom tokens like 'Citation' and 'Statute'.",
        tokenConfig: {
            Citation: {
                trigger: "Citation",
                prefix: "[Citation:-",
                suffix: "]",
                inputs: [{ placeholder: "Volume Source Page", key: "citation" }]
            },
            Statute: {
                trigger: "Statute",
                prefix: "[Statute:-",
                suffix: "]",
                inputs: [
                    { placeholder: "Act Name", key: "act" },
                    { prefix: " | Sec: ", placeholder: "Section", key: "section" }
                ]
            }
        },
        staticData: {
            "Citation": [],
            "Statute": []
        },
        triggers: {
            ...MOCK_TRIGGERS,
            "[": {
                options: [
                    { value: "Citation", title: "Citation" },
                    { value: "Statute", title: "Statute" }
                ],
                renderType: "flat"
            }
        }
    },
};
