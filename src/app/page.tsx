'use client'
import { Toaster } from "sonner";
import RadioButtonComp from "@/components/ui/radiobuttons";
import React, { use } from "react";

export default function Home() {
  const [selected, setSelected] = React.useState("option1");

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-10 sm:p-20">
      <div className="text-style-label-title-emphasis">Radio Button Variants</div>

      <div className="flex flex-col gap-6">
        {/* Neutral Radios */}
        <div>
          <h3 className="font-semibold mb-2">Neutral</h3>
          <RadioButtonComp
            label="Neutral Checked"
            name="neutralGroup"
            color="neutral"
            checked={selected === "neutral1"}
            onChange={() => setSelected("neutral1")}
          />
          <RadioButtonComp
            label="Neutral Unchecked"
            name="neutralGroup"
            color="neutral"
            checked={selected === "neutral2"}
            onChange={() => setSelected("neutral2")}
          />
          <RadioButtonComp
            label="Neutral Disabled"
            name="neutralGroup"
            color="neutral"
            disabled
          />
        </div>

        {/* Primary Radios */}
        <div>
          <h3 className="font-semibold mb-2">Primary</h3>
          <RadioButtonComp
            label="Primary Checked"
            name="primaryGroup"
            color="primary"
            checked={selected === "primary1"}
            onChange={() => setSelected("primary1")}
          />
          <RadioButtonComp
            label="Primary Unchecked"
            name="primaryGroup"
            color="primary"
            checked={selected === "primary2"}
            onChange={() => setSelected("primary2")}
          />
          <RadioButtonComp
            label="Primary Disabled"
            name="primaryGroup"
            color="primary"
            disabled
          />
        </div>
      </div>

      <Toaster />
    </div>
  );
}
