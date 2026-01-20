import React, { useState } from "react";
import { Dropdown, Option, Separator } from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  useFloating,
  offset,
  flip,
  shift,
} from "@floating-ui/react";
import type { OptionHelper } from "@/components/block/search-engine-input";

export default function NestedDropdown({
  options,
  value,
  onChange,
  activeIndex = null,
  customComponents,
}: {
  options: OptionHelper[];
  value: string | null;
  onChange: (value: string) => void;
  activeIndex?: number | null;
  customComponents?: Record<string, React.ReactNode>;
}) {
  const [expandedOption, setExpandedOption] = useState<string | null>(null);

  const { refs, floatingStyles } = useFloating({
    placement: "right-start",
    middleware: [offset(6), flip(), shift()],
  });

  return (
    <div className="py-2 bg-color-surface-neutral-default border border-color-border-neutral-default rounded-lg min-w-fit">
      {options.map((option, index) => {
        const hasBorderTop = option.className?.includes("border-t");
        const cleanClassName = option.className?.replace(/border-t\s*/g, "").trim();
        const hasCustomComponent = customComponents && customComponents[option.value];

        return (
          <React.Fragment key={option.value}>
            {hasBorderTop && <Separator className="my-2 bg-color-border-neutral-default" orientation="horizontal" />}
            <div className="px-2">
              <div ref={expandedOption === option.value ? refs.setReference : null}>
                <Option
                  title={option.title}
                  subtext={option?.subtext}
                  prefixSlot={option?.leadingIcon}
                  suffixSlot={option?.trailingAccessory}
                  selected={value === option.value}
                  highlighted={index === activeIndex}
                  onClick={() => {
                    if (option.options || hasCustomComponent) {
                      setExpandedOption((prev) =>
                        prev === option.value ? null : option.value
                      );
                    } else {
                      onChange(option.value);
                    }
                  }}
                  className={cn("cursor-pointer", cleanClassName)}
                />
              </div>
              {expandedOption === option.value && (
                <div
                  ref={refs.setFloating}
                  style={floatingStyles}
                  className="absolute z-[9999] ml-2 animate-in fade-in slide-in-from-left-1 duration-200"
                >
                  {hasCustomComponent ? (
                    customComponents[option.value]
                  ) : option.options ? (
                    <Dropdown
                      options={option.options}
                      value={value}
                      onChange={onChange}
                      searchbar={option.Searchbar || "off"}
                      placeholder="Search options"
                    />
                  ) : null}
                </div>
              )}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}