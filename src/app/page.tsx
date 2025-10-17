import { Toggle } from "@/components/ui/toggle";
import { Icon } from "judix-icon";
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <div className="text-style-label-title-emphasis">This is the test for font</div>
      {/* <Icon name="Document" /> */}
      <Toggle state="off" color="primary" size="small"/>
    </div>
  );
}
