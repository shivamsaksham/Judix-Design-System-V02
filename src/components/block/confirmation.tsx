import React from 'react'
import { Icon } from '@judix/icon'
import { cn } from '@/lib/utils'
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
  /** Shows a spinner on the confirm button and blocks closing (X, Escape, outside click, Cancel) while true. */
  confirmLoading?: boolean;
}

function Confirmation({ onConfirmClick, onCancelClick, mainText, subText, children, open, onOpenChange, confirmVariant = "primary", confirmText = "Confirm", cancelText = "Cancel", confirmLoading = false }: ConfirmationProps) {
  return (

    <Dialog open={open} onOpenChange={(next) => { if (confirmLoading && !next) return; onOpenChange?.(next); }}>
      {children && (
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      )}
      <DialogContent showCloseButton={false} className=" bg-confirmation-color-bg border-confirmation-color-stroke w-[366px]">
        <DialogHeader className='flex-row justify-between'>
          <DialogTitle className='confirmation-font-title p-1'>{mainText}</DialogTitle>
          <DialogClose className={cn('border-none', confirmLoading ? 'pointer-events-none opacity-50' : 'cursor-pointer')}>
            <Icon name="cross"></Icon>
          </DialogClose>
        </DialogHeader>

        <DialogDescription className='confirmation-font-content text-confirmation-color-bodytext flex flex-col gap-1'>
          <span className='p-1 text-confirmation-color-subtext confirmation-font-subtext leading-normal'>
            {subText}
          </span>
        </DialogDescription>
        <DialogFooter className=' '>
          <Button variant="neutral" size="extraSmall" onClick={onCancelClick} disabled={confirmLoading}>{cancelText}</Button>
          <Button size="extraSmall" variant={confirmVariant} onClick={onConfirmClick} loading={confirmLoading}>{confirmText}</Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}

export default Confirmation
