"use client";

// import {
//   Card,
//   CardAction,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { Icon } from "judix-icon"
import AlertCard from "@/components/block/alert-card";



export default function Home() {
  const switchState = (checked: boolean) => {
    console.log(checked);
  };
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 ">
      <div className="text-style-label-title-emphasis">This is the test for font</div>

      <AlertCard>
        This project is no longer associated with your profile. Request the admin to share.
      </AlertCard>
      

    </div>
  );
}
