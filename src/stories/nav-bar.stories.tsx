import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NavBar } from '@/components/block/nav-bar';

const MOCK_CONTEXT_ITEMS = [
    { id: '1', title: 'Article 12', checked: true },
    { id: '2', title: 'Case Law 2023', checked: false },
    { id: '3', title: 'Judgement Summary', checked: true },
];

const meta: Meta<typeof NavBar> = {
    title: 'Block/NavBar',
    component: NavBar,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    },
    args: {
        userName: 'Hardik Singh',
        projectName: 'Criminal Law Project',
        contextItems: MOCK_CONTEXT_ITEMS,
        onIndependentClick: () => console.log('Independent clicked'),
        onConnectorClick: () => console.log('Connector clicked'),
        onContextClick: () => console.log('Context clicked'),
        onMenuClick: () => console.log('Menu clicked'),
        onBackToResearch: () => console.log('Back to research clicked'),
        onRename: () => console.log('Rename clicked'),
        onDelete: () => console.log('Delete clicked'),
    }
};

export default meta;
type Story = StoryObj<typeof NavBar>;

/* Desktop Variants */

export const DefaultDesktop: Story = {
    name: 'Default (Desktop)',
    args: {
        variant: 'default',
        isMobile: false,
    },
};

export const ProjectDesktop: Story = {
    name: 'Project (Desktop)',
    args: {
        variant: 'project',
        isMobile: false,
    },
};

export const SecondaryDesktop: Story = {
    name: 'Secondary (Desktop)',
    args: {
        variant: 'secondary',
        isMobile: false,
    },
};

/* Mobile Variants */

export const DefaultMobile: Story = {
    name: 'Default (Mobile)',
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
    },
    args: {
        variant: 'default',
        isMobile: true,
    },
};

export const ProjectMobile: Story = {
    name: 'Project (Mobile)',
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
    },
    args: {
        variant: 'project',
        isMobile: true,
    },
};

export const SecondaryMobile: Story = {
    name: 'Secondary (Mobile)',
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
    },
    args: {
        variant: 'secondary',
        isMobile: true,
    },
};

/* Special States */

export const DefaultMobileWithResultPanel: Story = {
    name: 'Default Mobile + Result Panel',
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
    },
    args: {
        variant: 'default',
        isMobile: true,
        isResultPanelOpen: true,
    },
};

export const DefaultDesktopWithResultPanel: Story = {
    name: 'Default Desktop + Result Panel',
    args: {
        variant: 'default',
        isMobile: false,
        isResultPanelOpen: true,
    },
};

export const NewChatState: Story = {
    name: 'New Chat State',
    args: {
        variant: 'default',
        isNewChat: true,
    },
};

export const LoadedChatState: Story = {
    name: 'Loaded Chat (with Menu)',
    args: {
        variant: 'default',
        isNewChat: false,
    },
};
