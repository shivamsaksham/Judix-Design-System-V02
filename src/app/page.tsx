"use client";
import { Toggle } from "@/components/ui/toggle";



export default function Home() {
  const switchState = (checked: boolean) => {
    console.log(checked);
  };
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 ">
      <div className="text-style-label-title-emphasis">This is the test for font</div>
      
      <Toggle  variant="primary" onCheckedChange={switchState}/>

    </div>
  );
}
