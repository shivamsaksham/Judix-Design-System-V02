import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Label } from "../ui/labels"
import { NumberBadge } from "../ui/number_badges"

const tagSelectorVariants = cva(
  "border bg-tag_selector-color-bg border-tag_selector-color-stroke rounded-tag_selector-border-radius-default tag_selector-border-weight-default w-full flex flex-col",
  {
    variants: {},
    defaultVariants: {},
  }
)

export interface TagSelectorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tagSelectorVariants> {
  label: string
  availableTags: string[]
  selectedTags: string[]
  onSelect: (tag: string) => void
  onDeselect: (tag: string) => void
  badgeCount?: string | number
}

const TagSelector = React.forwardRef<HTMLDivElement, TagSelectorProps>(
  (
    {
      className,
      label,
      availableTags = [],
      selectedTags = [],
      onSelect,
      onDeselect,
      badgeCount,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn(tagSelectorVariants({ className }))}
        ref={ref}
        {...props}
      >
        <div className="flex justify-between items-center p-4 flex-shrink-0">
          <span className="tag_selector-font-search text-tag_selector-color-textdefault">
            {label}
          </span>
          {badgeCount !== undefined && (
            <NumberBadge variant="primary" size="s" shape="rounded">
              {badgeCount}
            </NumberBadge>
          )}
        </div>

        <hr className="border-tag_selector-color-stroke flex-shrink-0" />

        <div className="flex flex-wrap items-start content-start gap-2 p-4 flex-grow overflow-auto">
          {selectedTags.map((tag) => (
            <Label
              key={`selected-${tag}`}
              colorScheme="primary"
              size="medium"
              onRemove={() => onDeselect(tag)}
            >
              {tag}
            </Label>
          ))}

          {availableTags.map((tag) => (
            <Label
              key={`available-${tag}`}
              colorScheme="neutral"
              size="medium"
              onClick={() => onSelect(tag)}
              className="cursor-pointer"
            >
              {tag}
            </Label>
          ))}
        </div>
      </div>
    )
  }
)
TagSelector.displayName = "TagSelector"

export { TagSelector, tagSelectorVariants }