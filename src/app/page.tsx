import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NumberBadge } from "@/components/ui/number_badges";
import { Icon } from "judix-icon";
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <div className="text-style-label-title-emphasis">This is the test for font</div>
      <NumberBadge variant={"primary"} size={"md"} >
        5
      </NumberBadge>
    </div>
  );
}
