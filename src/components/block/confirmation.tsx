import React from 'react'
import { Icon } from 'judix-icon'
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,

} from '@/components/ui/dialog'

export interface ConfirmationProps {
  mainText: string;
  subText: string;
  onConfirmClick: () => void;
  onCancelClick: () => void;
}

function Confirmation({ onConfirmClick, onCancelClick, mainText, subText, children }: ConfirmationProps & { children: React.ReactElement }) {
  return (

    <Dialog >
      {/* asChild is used in order to treat the children prop to be the parent component type */}
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent showCloseButton={false} className=" bg-confirmation-color-bg border-confirmation-color-stroke w-[366px]">
        <DialogHeader className='flex-row justify-between'>
          <DialogTitle className='confirmation-font-title'>Confirmation</DialogTitle>
          <DialogClose className='cursor-pointer'>
            <Icon name="Cross"></Icon>
          </DialogClose>
        </DialogHeader>

        <DialogDescription className='confirmation-font-content text-confirmation-color-bodytext '>
          {/* <div> should not be used inside DialogDescription as it is <p> wrapper */}
          <span className='block'>{mainText}</span>
          <span className='mt-3 font-family-brandprimary text-color-text-neutral-tertiary font-family-brand-primary'>
            {subText}
          </span>
        </DialogDescription>
        <DialogFooter className=' '>
          <Button variant="neutral" size="extraSmall" onClick={onCancelClick}>Cancle</Button>
          <Button size="extraSmall" onClick={onConfirmClick}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default Confirmation
