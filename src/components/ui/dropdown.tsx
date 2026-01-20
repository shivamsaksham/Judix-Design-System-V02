'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Option } from './option';
import { TextInput, inputVariants } from './text-input';
const cn = (...inputs: (string | boolean | undefined)[]) =>
  inputs.filter(Boolean).join(' ');

// --- 3. Dropdown Component ---

export interface DropdownOption {
  value: string;
  title: string;
  subtext?: string;
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
}

export const Dropdown = ({
  options,
  value,
  onChange,
  searchbar = "off",
  placeholder = "Search...",
  className,
  activeIndex
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
        <div className="border-b border-textinput-color-stroke-default text-">
          <TextInput
            label="" // Hide the label
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            inputSize="default"
            variant="default"
            className="px-6 py-2 border-t-0 border-x-0 rounded-t-none rounded-b-none border-textinput-bg placeholder:text-red-100"
          />
        </div>
      );
    }
    if (searchbar === "integrated") {
      // Variant 3: Integrated Search Bar
      return (
        <TextInput
          label=""
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-72 bg-textinput-bg"
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
              onClick={() => {
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
