"use client";
import { Toggle } from "@/components/ui/toggle";
import {Option} from '@/components/ui/option'
import { Check, User } from "lucide-react"
import { Icon } from 'judix-icon'
import {Label} from '@/components/ui/labels'
import Confirmation from "@/components/block/confirmation";
import { Checkbox } from "@/components/ui/checkbox";



export default function Home() {
  const switchState = (checked: boolean) => {
    console.log(checked);
  };
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 ">
      <div className="text-style-label-title-emphasis">This is the test for font</div>
      
      {/* <Toggle  variant="primary" onCheckedChange={switchState}/> */}
        <Option title="Profile Settings" />

      <Option
        title="Profile Settings"
        subtext="your personal "
      />

      <Option
        prefixSlot={<Icon name="DocumentText" size={18}></Icon>}
        title="User"
        subtext="Manage your"
        label={<Label>Admin</Label>}
      />

      <Option
        prefixSlot={<Icon name='Box'></Icon>}
        title="Selected Option"
        suffixSlot ={<Checkbox variant='primary' size={'medium'}></Checkbox>}
        selected
        subtext="Subtext"
        shape="rounded"
      />
      <Option
        // suffixSlot={<Icon name='Box' ></Icon>}
        suffixSlot = {<Label size="small">Admin</Label>}
        title="Option Title"
        prefixSlot ={<Checkbox variant='primary' size={'small'}></Checkbox>}
        
        selected
        subtext="Subtext"
        shape="rounded"
      />

      <Option
        title="Disabled Option"
        subtext="You can’t click this"
        
      /> 

      <Option
        title="Click me"
        onClick={() => alert("Option clicked!")}
      />

        {/* <Confirmation >
          <Button>Click me</Button>
        </Confirmation> */}


    </div>
  );
}
