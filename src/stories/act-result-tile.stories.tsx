import * as React from 'react';
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ActResultTile } from "../components/block/act-result-tile";

const meta: Meta<typeof ActResultTile> = {
    title: "Block/ActResultTile",
    component: ActResultTile,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ActResultTile>;

export const Default: Story = {
    args: {
        title: "Indian Penal Code, 1961",
        section: "Section 498A ; 499",
        description: "I'll break this down into legal principles, practical realities, and strategy (assuming Indian law under the Code of Criminal Procedure, 1973 and the Protection of Women from Domestic Violence Act, 2005, since \"anticipatory bail\" is most commonly discussed in that context). If you're asking about another jurisdiction, I can adapt.",
        isAdded: false,
        isBookmarked: false,
        isMentioned: false,
        className: 'w-[400px]',
        id: "act-1",
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
            <ActResultTile
                title="Indian Penal Code, 1961"
                section="Section 498A ; 499"
                description="I'll break this down into legal principles, practical realities, and strategy (assuming Indian law under the Code of Criminal Procedure, 1973 and the Protection of Women from Domestic Violence Act, 2005, since &quot;anticipatory bail&quot; is most commonly discussed in that context). If you're asking about another jurisdiction, I can adapt."
                {...state}
                onAdd={() => setState(s => ({ ...s, isAdded: !s.isAdded }))}
                onBookmark={() => setState(s => ({ ...s, isBookmarked: !s.isBookmarked }))}
                onMention={() => setState(s => ({ ...s, isMentioned: !s.isMentioned }))}
                className='w-[400px]'
                id="act-2"
            />
        );
    }
};
