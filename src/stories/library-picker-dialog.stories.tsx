import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { LibraryPickerDialog, type LibraryPickerDocument } from '@/components/block/library-picker-dialog';

const documents: LibraryPickerDocument[] = [
  {
    id: 'doc-1',
    title: 'State of Bihar v. Lt. Col. K. S. R. Swami — Supreme Court, 1962',
    sizeBytes: 2.4 * 1024 * 1024,
    pageCount: 13,
    createdAt: '2026-09-13T07:48:01.258Z',
    usedInChats: 2,
    status: 'done',
    hasPdf: true,
  },
  {
    id: 'doc-2',
    title: 'Samaj Parivartana Samudaya v. State of Karnataka',
    sizeBytes: 5.1 * 1024 * 1024,
    pageCount: 42,
    createdAt: '2026-09-14T16:14:31.528Z',
    usedInChats: 0,
    status: 'done',
    hasPdf: false,
  },
  {
    id: 'doc-3',
    title: 'Lease agreement draft.pdf',
    sizeBytes: 820 * 1024,
    pageCount: null,
    createdAt: '2026-09-15T06:12:55.963Z',
    usedInChats: 0,
    status: 'processing',
    hasPdf: true,
  },
];

const meta: Meta<typeof LibraryPickerDialog> = {
  title: 'Block/LibraryPickerDialog',
  component: LibraryPickerDialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    open: true,
    documents,
    attachedIds: ['doc-1'],
    maxSelectable: 4,
    search: '',
    loading: false,
    usage: { usedBytes: 312 * 1024 * 1024, totalBytes: 1024 * 1024 * 1024 },
    onOpenChange: fn(),
    onSearchChange: fn(),
    onConfirm: fn(),
    onManageLibrary: fn(),
    onLoadMore: fn(),
    onRetry: fn(),
    selectedIds: [],
    onSelectedIdsChange: fn(),
    onPreview: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof LibraryPickerDialog>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    documents: [],
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    documents: [],
    attachedIds: [],
  },
};

export const LoadError: Story = {
  args: {
    documents: [],
    error: 'Could not load your library.',
  },
};

export const ChatFull: Story = {
  args: {
    maxSelectable: 0,
  },
};
