import * as React from 'react';
import type { Meta, StoryObj } from "@storybook/react";
import { JudgmentTile } from "../components/block/judgment-tile";

const meta: Meta<typeof JudgmentTile> = {
    title: "Block/JudgmentTile",
    component: JudgmentTile,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof JudgmentTile>;

export const Default: Story = {
    args: {
        title: "Deepak Singh Alias vs Mukesh Kumar & Ors",
        matchPercentage: "96.8%",
        citationCount: 12,
        description: "Appeal arising from SLP (Crl.) No. 354 of 2019 has been preferred against the judgment dated 12.12.2018 passed by the High Court of Gujarat in R/Criminal Misc. Applicat...",
        year: "2024 3 SCR 231",
        court: "Supreme Court of India",
        isAdded: false,
        isBookmarked: false,
        isMentioned: false,
    },
};

export const Interactive: Story = {
    render: () => {
        const [state, setState] = React.useState({
            isAdded: false,
            isBookmarked: false,
            isMentioned: false
        });

        return (
            <JudgmentTile
                title="Deepak Singh Alias vs Mukesh Kumar & Ors"
                matchPercentage="96.8%"
                citationCount={12}
                description="Appeal arising from SLP (Crl.) No. 354 of 2019 has been preferred against the judgment dated 12.12.2018 passed by the High Court of Gujarat in R/Criminal Misc. Applicat..."
                year="2024 3 SCR 231"
                court="Supreme Court of India"
                {...state}
                onAdd={() => setState(s => ({ ...s, isAdded: !s.isAdded }))}
                onBookmark={() => setState(s => ({ ...s, isBookmarked: !s.isBookmarked }))}
                onMention={() => setState(s => ({ ...s, isMentioned: !s.isMentioned }))}
                className='w-[400px]'
            />
        );
    }
};
