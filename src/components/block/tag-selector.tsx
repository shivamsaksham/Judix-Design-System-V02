import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Label } from "../ui/label"
import { NumberBadge } from "../ui/number_badges"
import { TextInput } from "../ui/text-input"

const tagSelectorVariants = cva(
  "border bg-tag_selector-color-bg border-tag_selector-color-stroke rounded-tag_selector-border-radius-default tag_selector-border-weight-default w-[384px] flex flex-col",
  {
    variants: {},
    defaultVariants: {},
  }
)

export interface TagSelectorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect">,
    VariantProps<typeof tagSelectorVariants> {
  placeholder: string
  availableTags: string[]
  selectedTags: string[]
  onSelect: (tag: string) => void
  onDeselect: (tag: string) => void
  onCreateTag: (tag: string) => void
  badgeCount?: string | number
}

const TagSelector = React.forwardRef<HTMLDivElement, TagSelectorProps>(
  (
    {
      className,
      placeholder,
      availableTags = [],
      selectedTags = [],
      onSelect,
      onDeselect,
      onCreateTag,
      badgeCount,
      ...props
    },
    ref
  ) => {
    const [inputValue, setInputValue] = React.useState("")

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && inputValue.trim() !== "") {
        event.preventDefault()
        onCreateTag(inputValue.trim())
        setInputValue("")
      }
    }

    return (
      <div
        className={cn(tagSelectorVariants({ className }))}
        ref={ref}
        {...props}
      >
        <TextInput
          label=""
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          trailingAccessory={
            badgeCount !== undefined ? (
              <NumberBadge variant="primary" size="s" shape="rounded">
                {badgeCount}
              </NumberBadge>
            ) : undefined
          }
          className="border-t-0 border-x-0 rounded-t-none rounded-b-none border-b-tag_selector-color-stroke"
        />

        <div className="flex flex-wrap items-start content-start gap-2 p-4 flex-grow overflow-auto h-[125px]">
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