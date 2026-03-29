'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Option } from './option';
import { TextInput } from './text-input';
import { Button, ButtonProps } from './button';
const cn = (...inputs: (string | boolean | undefined)[]) =>
  inputs.filter(Boolean).join(' ');


export interface DropdownOption {
  value: string;
  title: string;
  subtext?: React.ReactNode;
  leadingIcon?: React.ReactNode;
  trailingAccessory?: React.ReactNode;
  className?: string;
}

// Define the props for the main Dropdown
export interface DropdownProps {
  options: DropdownOption[];
  value: string | null;
  onChange: (value: string) => void;
  searchbar?: "attached" | "integrated" | "off";
  placeholder?: string;
  className?: string;
  activeIndex?: number | null;
  /** Ref forwarded to the search <input> inside the attached searchbar */
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
  /** If true, the search input auto-focuses when the Dropdown mounts */
  autoFocusSearch?: boolean;
}

export const Dropdown = ({
  options,
  value,
  onChange,
  searchbar = "off",
  placeholder = "Search...",
  className,
  activeIndex,
  searchInputRef,
  autoFocusSearch = false,
}: DropdownProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const optionsContainerRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const filteredOptions = options.filter(option =>
    option.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Scroll active option into view
  useEffect(() => {
    if (activeIndex !== null && activeIndex !== undefined && optionRefs.current[activeIndex]) {
      optionRefs.current[activeIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [activeIndex]);

  const renderSearchBar = () => {
    if (searchbar === "attached") {
      return (
        <div className="flex items-center justify-between gap-2 border-b border-textinput-color-stroke-default p-2">
          <TextInput
            inputSize="medium"
            label=""
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="default"
            className="flex-1 w-full border-none bg-transparent shadow-none focus-visible:ring-0"
            ref={searchInputRef}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={autoFocusSearch}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (activeIndex !== undefined && activeIndex !== null && filteredOptions[activeIndex]) {
                  onChange(filteredOptions[activeIndex].value);
                  setSearchTerm("");
                } else if (filteredOptions.length > 0) {
                  onChange(filteredOptions[0].value);
                  setSearchTerm("");
                }
              }
            }}
          />
        </div>
      );
    }
    if (searchbar === "integrated") {
      // Variant 3: Integrated Search Bar
      return (
        <TextInput
          inputSize="medium"
          label=""
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-72 bg-textinput-bg"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (activeIndex !== undefined && activeIndex !== null && filteredOptions[activeIndex]) {
                onChange(filteredOptions[activeIndex].value);
                setSearchTerm("");
              } else if (filteredOptions.length > 0) {
                onChange(filteredOptions[0].value);
                setSearchTerm("");
              }
            }
          }}
        />
      );
    }
    return null;
  };

  const renderOptions = () => (
    <div
      ref={optionsContainerRef}
      className="space-y-1 max-h-60 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
    >
      {filteredOptions.length > 0 ? (
        filteredOptions.map((option, index) => (
          <div
            key={option.value}
            ref={(el) => { optionRefs.current[index] = el; }}
          >
            <Option
              title={option.title}
              subtext={option.subtext}
              prefixSlot={option.leadingIcon}
              suffixSlot={option.trailingAccessory}
              selected={value === option.value}
              highlighted={activeIndex === index}
              onPointerDown={(e) => {
                // Use pointerDown so selection fires immediately for both
                // mouse clicks and touchpad tap-to-click (avoids focus/blur race)
                e.preventDefault();
                onChange(option.value);
                setSearchTerm("");
              }}
              className={option.className}
            />
          </div>
        ))
      ) : (
        <div className="p-2 option-font-title text-center textinput-color-text-active">
          No results found.
        </div>
      )}
    </div>
  );

  // Base container styles
  const containerClasses = cn(
    "bg-dropdown-color-bg rounded-dropdown-border-radius-default border border-dropdown-color-stroke dropdown-border-weight-default",
    className
  );

  if (searchbar === "off") {
    return (
      <div className={cn("w-[216px] ", containerClasses)}>
        <div className="p-2">
          {renderOptions()}
        </div>
      </div>
    );
  }
  if (searchbar === "integrated") {
    return (
      <div className="w-72">
        {renderSearchBar()}
        <div className="mt-[3px]" />
        <div className={containerClasses}>
          <div className="p-2">
            {renderOptions()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-72", containerClasses)}>
      {renderSearchBar()}
      <div className="p-2">
        {renderOptions()}
      </div>
    </div>
  );
};
