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

const sampleMarkdown = `
In cases involving domestic violence — especially when strong evidence exists against the accused — the question of whether anticipatory bail can be granted is highly fact-dependent and varies by jurisdiction.

I'll break this down into legal principles, practical realities, and strategy (assuming Indian law under the Code of Criminal Procedure, 1973 and the Protection of Women from Domestic Violence Act, 2005, since "anticipatory bail" is most commonly discussed in that context). If you're asking about another jurisdiction, I can adapt.

### 1. Legal Background

**Anticipatory bail:** Section 438 of the CrPC allows a person to seek bail before arrest if they believe they might be falsely implicated or arrested.

**Domestic violence cases:**
- Protection of Women from Domestic Violence Act, 2005 (PWDVA) primarily provides for civil reliefs (protection orders, residence orders, monetary relief, etc.) — not an arrestable criminal offense in itself.
- However, associated criminal charges often arise under the Indian Penal Code — especially:
  - Section 498A IPC (cruelty by husband/relatives) — non-bailable offense.
  - Section 406 IPC (criminal breach of trust).
  - Other IPC provisions (hurt, assault, intimidation, etc.).

### 2. When Strong Evidence Exists

If the prosecution has compelling evidence — such as:

- Medical records of injuries
- Witness testimony
- Recorded threats or abusive messages
- Prior police complaints

then anticipatory bail becomes much harder to secure because:

- Courts consider the gravity of the accusation.
- Risk of tampering with evidence or influencing witnesses is weighed heavily.
- Credible, corroborated evidence often leads courts to deny anticipatory bail, especially in offenses affecting women's safety.

### 3. Key Supreme Court & High Court Guidance

- **Siddharam Satlingappa Mhetre v. State of Maharashtra (2010)** — SC held that anticipatory bail should be granted liberally when accusations appear doubtful, but not when serious allegations are supported by material evidence.
- **Arnesh Kumar v. State of Bihar (2014)** — SC directed police not to make automatic arrests in 498A cases if the offense does not attract a sentence of 7+ years. But this does not mean anticipatory bail is automatic if strong evidence exists.
- **Recent trend:** Courts are cautious in granting anticipatory bail in domestic violence-related offenses if the victim's statements and other evidence appear credible and show sustained abuse.
`;

export const Default: Story = {
    args: {
        query: 'Anticipatory bail in domestic violence cases with strong evidence. Get me relevant acts, sections and supreme court judgments.',
        caseLawsCount: 23,
        actsCount: 4,
        markdown: sampleMarkdown,
    },
};

export const WithCallbacks: Story = {
    args: {
        query: 'Anticipatory bail in domestic violence cases with strong evidence. Get me relevant acts, sections and supreme court judgments.',
        caseLawsCount: 23,
        actsCount: 4,
        markdown: sampleMarkdown,
        onCaseLawsClick: () => console.log('Case Laws clicked'),
        onActsClick: () => console.log('Acts & Sections clicked'),
        onQueryEdit: (newQuery) => console.log('Query edited:', newQuery),
        onLike: () => console.log('Liked response'),
        onDislike: () => console.log('Disliked response'),
        onRefresh: () => console.log('Refresh clicked'),
        onCopy: () => console.log('Copy clicked'),
    },
};

export const WithLikedState: Story = {
    args: {
        query: 'Anticipatory bail in domestic violence cases with strong evidence.',
        caseLawsCount: 23,
        actsCount: 4,
        markdown: sampleMarkdown,
        isLiked: true,
        onLike: () => console.log('Liked response'),
        onDislike: () => console.log('Disliked response'),
    },
};

export const WithDislikedState: Story = {
    args: {
        query: 'Anticipatory bail in domestic violence cases with strong evidence.',
        caseLawsCount: 23,
        actsCount: 4,
        markdown: sampleMarkdown,
        isDisliked: true,
        onLike: () => console.log('Liked response'),
        onDislike: () => console.log('Disliked response'),
    },
};

export const SingleResult: Story = {
    args: {
        query: 'What is Section 498A IPC?',
        caseLawsCount: 1,
        actsCount: 1,
        markdown: `
Section 498A of the Indian Penal Code deals with cruelty by husband or his relatives towards a married woman.

This is a cognizable, non-bailable offense punishable with imprisonment up to three years and fine.
`,
    },
};

export const ManyResults: Story = {
    args: {
        query: 'Comprehensive analysis of domestic violence laws in India',
        caseLawsCount: 156,
        actsCount: 12,
        markdown: sampleMarkdown,
    },
};

export const WithCodeBlocks: Story = {
    args: {
        query: 'Legal code examples',
        caseLawsCount: 5,
        actsCount: 2,
        markdown: `
### Code Example

Here's an example of legal citation format:

\`\`\`
Section 498A IPC
Punishment: Up to 3 years imprisonment + fine
Nature: Cognizable, Non-bailable
\`\`\`

Inline code example: \`Section 438 CrPC\`
`,
    },
};

export const WithFollowUpQueries: Story = {
    args: {
        query: 'Anticipatory bail in domestic violence cases with strong evidence. Get me relevant acts, sections and supreme court judgments.',
        caseLawsCount: 23,
        actsCount: 4,
        markdown: sampleMarkdown,
        followUpQueries: [
            'This is a follow up query generated by system?',
            'What are the conditions for granting anticipatory bail in domestic violence cases?',
            'Can anticipatory bail be cancelled after being granted?',
            'What is the difference between regular bail and anticipatory bail in such cases?',
        ],
        onFollowUpQueryClick: (query) => console.log('Follow-up query clicked:', query),
        onLike: () => console.log('Liked response'),
        onDislike: () => console.log('Disliked response'),
    },
};
