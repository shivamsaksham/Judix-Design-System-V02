'use client'
import React, { useState } from 'react';
import { Dropdown, DropdownOption } from '../ui';
// 1. Import your component and its types


// This is your main App component
export default function DropdownDemo() {
  
  // 2. Define state for EACH dropdown you want to use.
  //    The parent (App) holds the state.
  const [selectedState1, setSelectedState1] = useState<string | null>("assam");
  const [selectedState2, setSelectedState2] = useState<string | null>(null);
  const [selectedState3, setSelectedState3] = useState<string | null>(null);

  // 3. Define your list of options
  const DUMMY_OPTIONS: DropdownOption[] = [
    { value: "assam", title: "Assam" },
    { value: "bihar", title: "Bihar" },
    { value: "maharashtra", title: "Maharashtra" },
    { value: "kerala", title: "Kerala" },
    { value: "tamil_nadu", title: "Tamil Nadu" },
  ];

  return (
    <div className="p-10 bg-gray-50 min-h-screen w-full flex flex-wrap items-start justify-center gap-8">
      
      {/* Variant 1: "attached" */}
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-gray-700">Attached Search</h3>
        <Dropdown
          options={DUMMY_OPTIONS}
          value={selectedState1}      // Pass the state value
          onChange={setSelectedState1}    // Pass the state *setter function*
          searchbar="attached"
          placeholder="Search in here"
        />
      </div>

      {/* Variant 2: "off" */}
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-gray-700">No Search</h3>
        <Dropdown
          options={DUMMY_OPTIONS}
          value={selectedState2}
          onChange={setSelectedState2}
          searchbar="off"
        />
      </div>

      {/* Variant 3: "integrated" */}
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-gray-700">Integrated Search</h3>
        <Dropdown
          options={DUMMY_OPTIONS}
          value={selectedState3}
          onChange={setSelectedState3}
          searchbar="integrated"
          placeholder="Placeholder text"
        />
      </div>
      
    </div>
  );
}
