import type { Meta, StoryObj } from "@storybook/react";
import { ContextWindow, ContextItem } from "@/components/block/context-window";

const meta = {
    title: "Block/ContextWindow",
    component: ContextWindow,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        mode: {
            control: "radio",
            options: ["auto", "self-managed"],
        },
    },
} satisfies Meta<typeof ContextWindow>;

export default meta;
type Story = StoryObj<typeof meta>;

const demoItems: ContextItem[] = [
    {
        id: "1",
        title: "Session context",
        subtitle: "Text added by you using add to context feature acting as session context",
        type: "session",
    },
    {
        id: "2",
        title: "Deepak Singh Alias vs Mukesh Kumar & Ors",
        subtitle: "2024 3 SCR 231",
        type: "case",
    },
    {
        id: "3",
        title: "Query #1",
        subtitle: "This is the demo summary of the first query of the session. This is the demo summary of the first query",
        type: "query",
    },
    {
        id: "4",
        title: "Deepak Singh Alias vs Mukesh Kumar & Ors",
        subtitle: "2024 2 SCR 472",
        type: "case",
    },
    {
        id: "5",
        title: "Indian Penal Code, 1961",
        subtitle: "Section 498A, 499",
        type: "act",
    },
    {
        id: "6",
        title: "Query #2",
        subtitle: "This is the demo summary of the first query of the session. This is the demo summary of the first query",
        type: "query",
    },
    {
        id: "7",
        title: "State of Maharashtra vs Suresh Kumar",
        subtitle: "2023 5 SCC 112",
        type: "case",
    },
    {
        id: "8",
        title: "Code of Criminal Procedure, 1973",
        subtitle: "Section 154, 156, 157",
        type: "act",
    },
    {
        id: "9",
        title: "Query #3",
        subtitle: "Analysis of precedent cases related to criminal conspiracy under IPC Section 120B",
        type: "query",
    },
    {
        id: "10",
        title: "Ram Prakash vs Union of India",
        subtitle: "2022 4 SCR 891",
        type: "case",
    },
    {
        id: "11",
        title: "Constitution of India",
        subtitle: "Article 14, 19, 21",
        type: "act",
    },
    {
        id: "12",
        title: "Query #4",
        subtitle: "Research on fundamental rights violations in preventive detention cases",
        type: "query",
    },
    {
        id: "13",
        title: "Smt. Kamla Devi vs State of Punjab",
        subtitle: "2024 1 SCR 156",
        type: "case",
    },
    {
        id: "14",
        title: "Prevention of Money Laundering Act, 2002",
        subtitle: "Section 3, 4, 45",
        type: "act",
    },
    {
        id: "15",
        title: "Query #5",
        subtitle: "Comparative analysis of bail provisions under PMLA and regular criminal procedure",
        type: "query",
    },
    {
        id: "16",
        title: "Ashok Kumar vs State of Rajasthan",
        subtitle: "2023 8 SCC 445",
        type: "case",
    },
    {
        id: "17",
        title: "Negotiable Instruments Act, 1881",
        subtitle: "Section 138, 139, 141",
        type: "act",
    },
    {
        id: "18",
        title: "Query #6",
        subtitle: "Dishonour of cheque cases and compounding provisions analysis",
        type: "query",
    },
    {
        id: "19",
        title: "Vijay Sharma vs State Bank of India",
        subtitle: "2024 2 SCC 234",
        type: "case",
    },
    {
        id: "20",
        title: "Information Technology Act, 2000",
        subtitle: "Section 66A, 67, 69",
        type: "act",
    },
];

export const Default: Story = {
    args: {
        items: demoItems,
        mode: "self-managed",
    },
};

export const WithSelectedItems: Story = {
    args: {
        items: demoItems,
        selectedItems: ["1", "2", "5"],
        mode: "self-managed",
    },
};

export const AutoMode: Story = {
    args: {
        items: demoItems,
        mode: "auto",
    },
};

export const FewItems: Story = {
    args: {
        items: demoItems.slice(0, 5),
        mode: "self-managed",
    },
};

export const Empty: Story = {
    args: {
        items: [],
        mode: "self-managed",
    },
};

export const AllSelected: Story = {
    args: {
        items: demoItems.slice(0, 10),
        selectedItems: demoItems.slice(0, 10).map((item) => item.id),
        mode: "self-managed",
    },
};
