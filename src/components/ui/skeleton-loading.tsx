import * as React from "react"
import { cn } from "@/lib/utils"

export interface SkeletonLoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "circular"
}

function SkeletonLoading({ className, variant = "default", ...props }: SkeletonLoadingProps) {
  return (
    <div
      data-slot="skeleton-loading"
      className={cn(
        "bg-option-color-hover animate-pulse",
        variant === "circular" ? "rounded-full" : "rounded-md",
        className
      )}
      {...props}
    />
  )
}

export { SkeletonLoading }
