import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SourceLookupCard } from '@/components/block/source-lookup-card';

const meta: Meta<typeof SourceLookupCard> = {
    title: 'Block/SourceLookupCard',
    component: SourceLookupCard,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        onClose: { action: 'closed' },
        onWhyThisClick: { action: 'whyThisClicked' },
        onViewSourceClick: { action: 'viewSourceClicked' },
    },
};

export default meta;
type Story = StoryObj<typeof SourceLookupCard>;

export const Default: Story = {
    args: {
        title: 'Malwa Strips vs The State of Maharashtra',
        content: (
            <p>
                The appellant was the holder of an inter-regional permit in respect of a motor vehicle plying on the town service route No.IA from Erode Railway Station to Tiruchengode. The major portion of the route mentioned in the permit of the appellant was lying within the jurisdiction of the Regional Transport Authority of Periyar and the smaller portion lay within the District of Salem.
            </p>
        ),
    },
};
