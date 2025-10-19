
// import { Toggle } from "@/components/ui/toggle";
"use client";
import { Switch } from "@/components/ui/toggle";

import { Icon } from "judix-icon";
import Image from "next/image";
import { use } from "react";

export default function Home() {
  const switchState = (e)=>{
    console.log(e.target);
  }
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 ">
      <div className="text-style-label-title-emphasis">This is the test for font</div>
      
      <Switch variant="primary" onClick={(e)=>switchState(e)}/>
    </div>
  );
}
