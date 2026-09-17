import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { LibraryDocumentTile } from '@/components/block/library-document-tile';

const meta: Meta<typeof LibraryDocumentTile> = {
  title: 'Block/LibraryDocumentTile',
  component: LibraryDocumentTile,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    title: 'State of Bihar v. Lt. Col. K. S. R. Swami — Supreme Court, 1962',
    sizeBytes: 2.4 * 1024 * 1024,
    pageCount: 13,
    createdAt: '2026-09-13T07:48:01.258Z',
    usedInChats: 2,
    status: 'done',
    hasPdf: true,
    onOpen: fn(),
    onDelete: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof LibraryDocumentTile>;

export const Default: Story = {};

export const Processing: Story = {
  args: {
    status: 'processing',
    usedInChats: 0,
  },
};

export const PdfNotSaved: Story = {
  args: {
    hasPdf: false,
  },
};

export const Selectable: Story = {
  args: {
    selectable: true,
    selected: true,
    onSelectedChange: fn(),
  },
};

export const AlreadyInChat: Story = {
  args: {
    selectable: true,
    selected: true,
    selectionDisabled: true,
    hint: 'Already in this chat',
  },
};
