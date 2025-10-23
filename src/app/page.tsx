'use client'
import AlertCard from "@/components/block/alert-card";
import RadioButtonDemo from "@/components/examples/RadioButtonDemo";
import ToastDemo from "@/components/examples/ToastDemo";
import Calender from "@/components/ui/calender";
import PaginationView from "@/components/ui/pagination";
import OptionDemo from "@/components/examples/OptionDemo";
import { useState } from "react";
export default function App() {
  const [date, setDate] = useState(new Date());
  return (
    // <RadioButtonDemo/>
    // <div className="flex min-h-screen justify-center items-center">
    // <div className="bg-white p-6 rounded-lg shadow-md">
    //     <h1 className="text-2xl font-bold mb-4">Pagination Demo</h1>
    //     <PaginationView />
    //   </div>
    // {/* <RadioButtonDemo/> */}
    //  <ToastDemo/> 
    //   <Calender 
    //   onDateSelected={date} 
    //   onDateChange={setDate}
    // />
      // </div>

    <OptionDemo/>
  );
}
