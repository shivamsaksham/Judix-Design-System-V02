import React from 'react'
import { Icon } from '@judix/icon'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,

} from '@/components/ui/dialog'

export interface ConfirmationProps {
  mainText: string;
  subText: string;
  onConfirmClick: () => void;
  onCancelClick: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactElement;
  confirmVariant?: 'primary' | 'neutral' | 'destructive';
  confirmText?: string;
  cancelText?: string;
}

function Confirmation({ onConfirmClick, onCancelClick, mainText, subText, children, open, onOpenChange, confirmVariant = "primary", confirmText = "Confirm", cancelText = "Cancel" }: ConfirmationProps) {
  return (

    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && (
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      )}
      <DialogContent showCloseButton={false} className=" bg-confirmation-color-bg border-confirmation-color-stroke w-[366px]">
        <DialogHeader className='flex-row justify-between'>
          <DialogTitle className='confirmation-font-title p-1'>{mainText}</DialogTitle>
          <DialogClose className='cursor-pointer'>
            <Icon name="cross"></Icon>
          </DialogClose>
        </DialogHeader>

        <DialogDescription className='confirmation-font-content text-confirmation-color-bodytext flex flex-col gap-1'>
          <span className='p-1 text-confirmation-color-subtext confirmation-font-subtext leading-normal'>
            {subText}
          </span>
        </DialogDescription>
        <DialogFooter className=' '>
          <Button variant="neutral" size="extraSmall" onClick={onCancelClick}>{cancelText}</Button>
          <Button size="extraSmall" variant={confirmVariant} onClick={onConfirmClick}>{confirmText}</Button>
        </DialogFooter>
        
      </DialogContent>
    </Dialog>
  )
}

export default Confirmation
