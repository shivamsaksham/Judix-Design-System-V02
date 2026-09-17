"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { formatBytes } from "@/lib/format-bytes";

export interface StorageUsageProps {
  usedBytes: number;
  totalBytes: number;
  className?: string;
}

export function StorageUsage({ usedBytes, totalBytes, className }: StorageUsageProps) {
  const hasStorage = totalBytes > 0;
  const ratio = hasStorage ? Math.min(1, Math.max(0, usedBytes) / totalBytes) : 0;
  const percent = Math.round(ratio * 100);
  const isFull = !hasStorage || usedBytes >= totalBytes;
  const isNearlyFull = hasStorage && !isFull && percent >= 90;
  const fillWidth = hasStorage && usedBytes > 0 ? `max(${(ratio * 100).toFixed(2)}%, 4px)` : "0%";

  return (
    <div className={cn("flex w-full min-w-0 flex-col gap-2", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
        <span className="text-style-body-default-regular text-color-text-neutral-default">Storage</span>
        <span
          className={cn(
            "text-style-label-default-regular tabular-nums",
            isFull ? "text-color-text-feedback-negative-default" : "text-color-text-neutral-tertiary"
          )}
        >
          {hasStorage ? `${formatBytes(usedBytes)} of ${formatBytes(totalBytes)} used` : "No storage on your plan"}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label="Storage used"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="h-2 w-full overflow-hidden rounded-full bg-button-color-neutral-disabled-stroke"
      >
        <div
          className={cn(
            "h-full rounded-full transition-all",
            isFull ? "bg-color-text-feedback-negative-default" : isNearlyFull ? "bg-amber-500" : "bg-color-text-primary-default"
          )}
          style={{ width: fillWidth }}
        />
      </div>
    </div>
  );
}
