import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { ShareSearchDialog } from "@/components/block/share-search-dialog";
import { ToastContainer } from "@/components/ui/toast";

const meta = {
    title: "Block/ShareSearchDialog",
    component: ShareSearchDialog,
    tags: ["autodocs"],
    parameters: {
        layout: "centered"
    },
    decorators: [
        (Story) => (
            <>
                <ToastContainer position="top-center" />
                <Story />
            </>
        )
    ],
    argTypes: {
        open: {
            control: "boolean",
            description: "Controls the visibility of the dialog"
        },
        shareLink: {
            control: "text",
            description: "The shareable link to display"
        }
    },
    args: {
        open: true,
        shareLink: "https://www.figma.com/design/DzVfxOdxbdmJcIuM52Uk8t/...",
        onOpenChange: fn(),
        onShare: fn(),
        onCopyLink: fn(),
        onDownloadPdf: fn()
    }
} as Meta<typeof ShareSearchDialog>;

export default meta;
type Story = StoryObj<typeof ShareSearchDialog>;

export const Default: Story = {};

export const WithLongLink: Story = {
    args: {
        shareLink:
            "https://www.example.com/very/long/path/to/shared/document/12345"
    }
};


