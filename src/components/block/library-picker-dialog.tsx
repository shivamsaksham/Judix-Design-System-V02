"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { Icon } from "@judix/icon";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/text-input";
import { Spinner } from "@/components/ui/spinner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LibraryDocumentTile, type LibraryDocumentStatus } from "./library-document-tile";
import { StorageUsage } from "./storage-usage";

export interface LibraryPickerDocument {
  id: string;
  title: string;
  sizeBytes: number;
  pageCount: number | null;
  createdAt: string | null;
  usedInChats: number;
  status: LibraryDocumentStatus;
  hasPdf: boolean;
}

export interface LibraryPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documents: LibraryPickerDocument[];
  attachedIds: string[];
  maxSelectable: number;
  search: string;
  onSearchChange: (value: string) => void;
  loading: boolean;
  loadingMore?: boolean;
  error?: string | null;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onRetry?: () => void;
  usage?: { usedBytes: number; totalBytes: number } | null;
  confirming?: boolean;
  selectedIds: string[];
  onSelectedIdsChange: (documentIds: string[]) => void;
  onPreview?: (document: LibraryPickerDocument) => void;
  onConfirm: (documentIds: string[]) => void;
  onManageLibrary?: () => void;
}

const pluralizeDocuments = (count: number) => `${count} ${count === 1 ? "document" : "documents"}`;

export function LibraryPickerDialog({
  open,
  onOpenChange,
  documents,
  attachedIds,
  maxSelectable,
  search,
  onSearchChange,
  loading,
  loadingMore = false,
  error = null,
  hasMore = false,
  onLoadMore,
  onRetry,
  usage,
  confirming = false,
  selectedIds,
  onSelectedIdsChange,
  onPreview,
  onConfirm,
  onManageLibrary,
}: LibraryPickerDialogProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const attachedSet = useMemo(() => new Set(attachedIds), [attachedIds]);
  const remaining = Math.max(0, maxSelectable - selectedIds.length);

  useEffect(() => {
    const root = listRef.current;
    const sentinel = sentinelRef.current;
    if (!open || !root || !sentinel || !hasMore || loading || loadingMore || !onLoadMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) onLoadMore();
      },
      { root, rootMargin: "160px 0px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [open, hasMore, loading, loadingMore, onLoadMore, documents.length]);

  const toggleDocument = (documentId: string, nextSelected: boolean) => {
    if (!nextSelected) {
      onSelectedIdsChange(selectedIds.filter((id) => id !== documentId));
      return;
    }
    if (selectedIds.includes(documentId) || selectedIds.length >= maxSelectable) return;
    onSelectedIdsChange([...selectedIds, documentId]);
  };

  const handleOpenChange = (next: boolean) => {
    if (confirming && !next) return;
    onOpenChange(next);
  };

  const renderList = () => {
    if (documents.length === 0 && loading) {
      return (
        <div className="flex flex-col items-center justify-center gap-3 py-12" aria-busy="true">
          <Spinner size="large" label="Loading your library" />
          <p className="text-style-label-default-regular text-color-text-neutral-secondary">Loading your library…</p>
        </div>
      );
    }

    if (documents.length === 0 && error) {
      return (
        <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
          <p className="text-style-body-default-regular text-color-text-neutral-secondary">{error}</p>
          {onRetry && (
            <Button variant="neutral" size="extraSmall" onClick={onRetry}>
              Try again
            </Button>
          )}
        </div>
      );
    }

    if (documents.length === 0) {
      return (
        <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
          <Icon name="archive-book" className="size-8 text-color-text-neutral-tertiary" />
          <p className="text-style-body-default-regular text-color-text-neutral-secondary">
            {search.trim()
              ? "No documents match your search."
              : "Your library is empty. Upload a document from your device and it will appear here."}
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-3">
        {documents.map((document) => {
          const isAttached = attachedSet.has(document.id);
          const isSelected = isAttached || selectedIds.includes(document.id);
          return (
            <LibraryDocumentTile
              key={document.id}
              title={document.title}
              sizeBytes={document.sizeBytes}
              pageCount={document.pageCount}
              createdAt={document.createdAt}
              status={document.status}
              hasPdf={document.hasPdf}
              hint={isAttached ? "Already in this chat" : undefined}
              selectable
              selected={isSelected}
              selectionDisabled={isAttached || (!isSelected && remaining === 0)}
              onSelectedChange={(next) => toggleDocument(document.id, next)}
              onOpen={onPreview ? () => onPreview(document) : undefined}
            />
          );
        })}
        {error && (
          <div className="flex flex-wrap items-center justify-center gap-2 py-2 text-center">
            <span className="text-style-label-default-regular text-color-text-neutral-secondary">{error}</span>
            {onRetry && (
              <Button variant="neutral" size="extraSmall" onClick={onRetry}>
                Try again
              </Button>
            )}
          </div>
        )}
        {loadingMore && (
          <div className="flex justify-center py-3">
            <Spinner size="small" label="Loading more documents" />
          </div>
        )}
        <div ref={sentinelRef} className="h-px w-full" aria-hidden="true" />
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        onOpenAutoFocus={(event) => {
          if (!window.matchMedia("(pointer: coarse)").matches) return;
          event.preventDefault();
          (event.target as HTMLElement | null)?.focus({ preventScroll: true });
        }}
        className="flex h-[calc(100dvh-1.5rem)] max-h-[calc(100dvh-1.5rem)] w-full max-w-[calc(100%-1.5rem)] flex-col gap-4 overflow-hidden p-4 sm:h-auto sm:max-h-[min(720px,calc(100dvh-4rem))] sm:max-w-xl sm:p-6"
      >
        <DialogHeader className="text-left">
          <DialogTitle>Add from library</DialogTitle>
          <DialogDescription>
            Documents you&apos;ve already uploaded are ready to use right away and don&apos;t use any pages.
          </DialogDescription>
        </DialogHeader>

        <div className="shrink-0">
          <TextInput
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search your library"
            aria-label="Search your library"
            leadingIcon={<Icon name="search-normal-a" className="size-4" />}
            trailingAccessory={loading && documents.length > 0 ? <Spinner size="small" label="Searching" /> : undefined}
          />
        </div>

        {usage && <StorageUsage usedBytes={usage.usedBytes} totalBytes={usage.totalBytes} className="shrink-0" />}

        <p className="shrink-0 text-style-label-default-regular text-color-text-neutral-secondary">
          {maxSelectable > 0
            ? `You can add ${pluralizeDocuments(remaining)} more to this chat.`
            : "This chat already has the maximum number of documents."}
        </p>

        <div ref={listRef} className="no-scrollbar -mx-1 min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-1 py-1 sm:min-h-[240px]">
          {renderList()}
        </div>

        <div className="flex shrink-0 flex-col gap-2 border-t border-color-border-neutral-default pt-4 sm:flex-row sm:items-center sm:justify-between">
          {onManageLibrary && (
            <Button variant="neutral" size="extraSmall" className="w-full sm:w-auto" onClick={onManageLibrary} disabled={confirming}>
              Manage library
            </Button>
          )}
          <div className="grid grid-cols-2 gap-2 sm:ml-auto sm:flex">
            <Button variant="neutral" size="extraSmall" className="w-full sm:w-auto" onClick={() => handleOpenChange(false)} disabled={confirming}>
              Cancel
            </Button>
            <Button
              size="extraSmall"
              className="w-full sm:w-auto"
              onClick={() => onConfirm(selectedIds)}
              disabled={selectedIds.length === 0 || confirming}
              loading={confirming}
            >
              {selectedIds.length > 0 ? `Add ${pluralizeDocuments(selectedIds.length)}` : "Add documents"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
