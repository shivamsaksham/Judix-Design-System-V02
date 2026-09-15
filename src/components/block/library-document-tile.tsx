"use client";

import React from "react";
import { Icon } from "@judix/icon";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { IconButton } from "@/components/ui/icon-button";
import { formatBytes } from "@/lib/format-bytes";

export type LibraryDocumentStatus = "pending" | "processing" | "done";

export interface LibraryDocumentTileProps {
  title: string;
  sizeBytes: number;
  pageCount?: number | null;
  createdAt?: string | null;
  usedInChats?: number;
  status: LibraryDocumentStatus;
  hasPdf: boolean;
  hint?: string;
  selectable?: boolean;
  selected?: boolean;
  selectionDisabled?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  onOpen?: () => void;
  onDelete?: () => void;
  deleting?: boolean;
  className?: string;
}

const dateFormatter = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });

const buildMeta = (sizeBytes: number, pageCount?: number | null, createdAt?: string | null, usedInChats?: number): string => {
  const parts = sizeBytes > 0 ? [formatBytes(sizeBytes)] : [];
  if (pageCount) parts.push(`${pageCount} ${pageCount === 1 ? "page" : "pages"}`);
  if (createdAt) {
    const date = new Date(createdAt);
    if (!Number.isNaN(date.getTime())) parts.push(dateFormatter.format(date));
  }
  if (usedInChats) parts.push(`Used in ${usedInChats} ${usedInChats === 1 ? "chat" : "chats"}`);
  return parts.join(" · ");
};

export function LibraryDocumentTile({
  title,
  sizeBytes,
  pageCount,
  createdAt,
  usedInChats,
  status,
  hasPdf,
  hint,
  selectable = false,
  selected = false,
  selectionDisabled = false,
  onSelectedChange,
  onOpen,
  onDelete,
  deleting = false,
  className,
}: LibraryDocumentTileProps) {
  const isReady = status === "done";
  const canOpen = Boolean(onOpen) && isReady && hasPdf;
  const canSelect = selectable && isReady && !selectionDisabled;
  const interactive = selectable ? canSelect : canOpen;
  const meta = buildMeta(sizeBytes, pageCount, createdAt, usedInChats);
  const statusLabels = [
    isReady ? null : "Processing",
    isReady && !hasPdf ? "PDF not saved" : null,
    hint ?? null,
  ].filter((label): label is string => Boolean(label));

  const activate = () => {
    if (selectable) {
      if (canSelect) onSelectedChange?.(!selected);
      return;
    }
    if (canOpen) onOpen?.();
  };

  return (
    <div
      tabIndex={interactive ? 0 : -1}
      aria-disabled={!interactive}
      onClick={activate}
      onKeyDown={(event) => {
        if (!interactive) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          activate();
        }
      }}
      className={cn(
        "flex w-full min-w-0 items-center gap-3 rounded-lg border border-color-border-neutral-default bg-color-surface-neutral-default px-4 py-3.5 transition-colors",
        interactive
          ? "cursor-pointer hover:bg-option-color-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-color-border-primary-default"
          : "cursor-default",
        selectable && selected && "border-color-border-primary-default",
        className
      )}
    >
      {selectable && (
        <Checkbox
          checked={selected}
          disabled={!canSelect}
          aria-label={`Select ${title}`}
          onClick={(event) => event.stopPropagation()}
          onCheckedChange={(checked) => onSelectedChange?.(checked === true)}
        />
      )}

      <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-color-surface-neutral-subtle text-color-text-neutral-secondary">
        <Icon name="document-text-a" className="size-5" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="truncate text-style-body-default-regular text-color-text-neutral-default" title={title}>
          {title}
        </span>
        <span className="truncate text-style-label-default-regular text-color-text-neutral-tertiary" title={meta}>
          {meta}
        </span>
        {statusLabels.length > 0 && (
          <span className="truncate text-style-label-default-regular text-color-text-neutral-secondary">
            {statusLabels.join(" · ")}
          </span>
        )}
      </div>

      {(onOpen || (!selectable && onDelete)) && (
        <div className="flex shrink-0 items-center gap-1">
          {onOpen && (
            <IconButton
              icon="eye"
              variant="neutral"
              size="medium"
              disabled={!canOpen}
              aria-label={`Open ${title}`}
              title={canOpen ? "Open PDF" : isReady ? "The original PDF wasn't saved for this document" : "Available once processing finishes"}
              onClick={(event) => {
                event.stopPropagation();
                onOpen();
              }}
            />
          )}
          {onDelete && !selectable && (
            <IconButton
              icon="trash"
              variant="neutral"
              size="medium"
              disabled={deleting}
              aria-label={`Delete ${title}`}
              title="Delete from library"
              onClick={(event) => {
                event.stopPropagation();
                onDelete();
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
