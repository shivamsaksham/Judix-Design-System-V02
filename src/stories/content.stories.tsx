import type { Meta, StoryObj } from '@storybook/react';
import { Content } from '@/components/block/content';

const meta = {
    title: 'Block/Content',
    component: Content,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Content>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleContent = (
    <div className="space-y-6">
        <p>
            In cases involving domestic violence — especially when strong evidence exists against the accused —
            the question of whether anticipatory bail can be granted is highly fact-dependent and varies by jurisdiction.
        </p>

        <p>
            I'll break this down into legal principles, practical realities, and strategy (assuming Indian law under the
            Code of Criminal Procedure, 1973 and the Protection of Women from Domestic Violence Act, 2005, since
            "anticipatory bail" is most commonly discussed in that context). If you're asking about another jurisdiction,
            I can adapt.
        </p>

        <div className="space-y-4">
            <h3 className="text-style-label-title-emphasis text-color-text-neutral-default">1. Legal Background</h3>

            <div className="ml-4 space-y-2">
                <div>
                    <strong>Anticipatory bail:</strong> Section 438 of the CrPC allows a person to seek bail before arrest if they believe
                    they might be falsely implicated or arrested.
                </div>

                <div>
                    <strong>Domestic violence cases:</strong>
                    <ul className="list-disc ml-6 space-y-1">
                        <li>Protection of Women from Domestic Violence Act, 2005 (PWDVA) primarily provides for civil reliefs
                            (protection orders, residence orders, monetary relief, etc.) — not an arrestable criminal offense in itself.</li>
                        <li>However, associated criminal charges often arise under the Indian Penal Code — especially:
                            <ul className="list-disc ml-6">
                                <li>Section 498A IPC (cruelty by husband/relatives) — non-bailable offense.</li>
                                <li>Section 406 IPC (criminal breach of trust).</li>
                                <li>Other IPC provisions (hurt, assault, intimidation, etc.).</li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div className="space-y-4">
            <h3 className="text-style-label-title-emphasis text-color-text-neutral-default">2. When Strong Evidence Exists</h3>

            <p>If the prosecution has compelling evidence — such as:</p>
            <ul className="list-disc ml-6 space-y-1">
                <li>Medical records of injuries</li>
                <li>Witness testimony</li>
                <li>Recorded threats or abusive messages</li>
                <li>Prior police complaints</li>
            </ul>

            <p className="mt-2">
                then anticipatory bail becomes much harder to secure because:
            </p>
            <ul className="list-disc ml-6 space-y-1">
                <li>Courts consider the gravity of the accusation.</li>
                <li>Risk of tampering with evidence or influencing witnesses is weighed heavily.</li>
                <li>Credible, corroborated evidence often leads courts to deny anticipatory bail, especially in offenses
                    affecting women's safety.</li>
            </ul>
        </div>

        <div className="space-y-4">
            <h3 className="text-style-label-title-emphasis text-color-text-neutral-default">3. Key Supreme Court & High Court Guidance</h3>

            <ul className="list-disc ml-6 space-y-2">
                <li><strong>Siddharam Satlingappa Mhetre v. State of Maharashtra (2010)</strong> — SC held that anticipatory bail should
                    be granted liberally when accusations appear doubtful, but not when serious allegations are supported
                    by material evidence.</li>
                <li><strong>Arnesh Kumar v. State of Bihar (2014)</strong> — SC directed police not to make automatic arrests in 498A
                    cases if the offense does not attract a sentence of 7+ years. But this does not mean anticipatory bail is automatic if strong
                    evidence exists.</li>
                <li><strong>Recent trend:</strong> Courts are cautious in granting anticipatory bail in domestic violence-related offenses if
                    the victim's statements and other evidence appear credible and show sustained abuse.</li>
            </ul>
        </div>
    </div>
);

export const Default: Story = {
    args: {
        query: 'Anticipatory bail in domestic violence cases with strong evidence. Get me relevant acts, sections and supreme court judgments.',
        caseLawsCount: 23,
        actsCount: 4,
        content: sampleContent,
    },
};

export const WithCallbacks: Story = {
    args: {
        query: 'Anticipatory bail in domestic violence cases with strong evidence. Get me relevant acts, sections and supreme court judgments.',
        caseLawsCount: 23,
        actsCount: 4,
        content: sampleContent,
        onCaseLawsClick: () => console.log('Case Laws clicked'),
        onActsClick: () => console.log('Acts & Sections clicked'),
        onQueryEdit: (newQuery) => console.log('Query edited:', newQuery),
    },
};

export const SingleResult: Story = {
    args: {
        query: 'What is Section 498A IPC?',
        caseLawsCount: 1,
        actsCount: 1,
        content: (
            <div className="space-y-4">
                <p>
                    Section 498A of the Indian Penal Code deals with cruelty by husband or his relatives towards a married woman.
                </p>
                <p>
                    This is a cognizable, non-bailable offense punishable with imprisonment up to three years and fine.
                </p>
            </div>
        ),
    },
};

export const ManyResults: Story = {
    args: {
        query: 'Comprehensive analysis of domestic violence laws in India',
        caseLawsCount: 156,
        actsCount: 12,
        content: sampleContent,
    },
};
