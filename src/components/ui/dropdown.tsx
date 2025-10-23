'use client';
import React, { useState } from 'react';
import { Option } from './option'; 

const cn = (...inputs: (string | boolean | undefined)[]) =>
  inputs.filter(Boolean).join(' ');

// --- 3. Dropdown Component ---

export interface DropdownOption {
  value: string;
  title: string;
  subtext?: string;
  leadingIcon?: React.ReactNode;
  trailingAccessory?: React.ReactNode;
}

// Define the props for the main Dropdown
export interface DropdownProps {
  options: DropdownOption[];
  value: string | null;
  onChange: (value: string) => void;
  searchbar?: "attached" | "integrated" | "off";
  placeholder?: string;
  className?: string;
}

export const Dropdown = ({
  options,
  value,
  onChange,
  searchbar = "off",
  placeholder = "Search...",
  className
}: DropdownProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = options.filter(option =>
    option.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderSearchBar = () => {
    if (searchbar === "attached") {
      // Variant 1: "Search in here"
      return (
        <div className="relative border-b border-textinput-color-stroke-default border-textinput-border-weight-default">
          <div className="ml-6 mr-4 my-[15px] p-1">
            <input
              type="text"
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-0 py-0 border-none outline-none focus:outline-none focus:ring-0 placeholder:textinput-font-placeholder-medium placeholder:text-textinput-color-text-active"
              style={{ boxShadow: 'none' }}
            />
          </div>
        </div>
      );
    }
 if (searchbar === "integrated") {
      // Variant 3: "Placeholder text"
      return (
        <div className={cn(
          "relative bg-textinput-bg rounded-dropdown-border-radius-default border border-dropdown-color-stroke dropdown-border-weight-default",
          "w-72"
        )}>
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full mx-3 my-2 p-1 border-none outline-none focus:outline-none focus:ring-0 placeholder:textinput-font-placeholder-medium placeholder:text-textinput-color-text-active"
            style={{ boxShadow: 'none' }}
          />
        </div>
      );
    }
    return null;
  };

  const renderOptions = () => (
    <div className="space-y-1 max-h-60 overflow-y-auto ">
      {filteredOptions.length > 0 ? (
        filteredOptions.map(option => (
          <Option
            key={option.value}
            title={option.title}
            subtext={option.subtext}
            leadingIcon={option.leadingIcon}
            trailingAccessory={option.trailingAccessory}
            selected={value === option.value}
            onClick={() => {
              onChange(option.value);
              setSearchTerm("");
            }}
          />
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
              <div className="p-3">
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
          <div className="p-3">
            {renderOptions()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-72", containerClasses)}>
      {renderSearchBar()}
      <div className="p-3">
        {renderOptions()}
      </div>
    </div>
  );
};
