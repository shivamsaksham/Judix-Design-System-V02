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

export interface ConfirmationProps {
        onConfirmClick: () => void;
        onCancelClick: () => void;
}   

function Confirmation({onConfirmClick, onCancelClick ,children}: ConfirmationProps & {children: React.ReactNode}) {

    const [hidden, setHidden] = React.useState(false);
  return (
    <Card className={`${hidden ? 'hidden' : ''} w-[366px] min-w-0 rounded-confirmation-border-radius-default bg-confirmation-color-bg border-confirmation-color-stroke `} >
        <CardHeader >
          <CardTitle className='confirmation-font-title'>
            Confirmation
          </CardTitle>
          <CardAction className='hover:cursor-pointer'onClick={()=>{setHidden((e)=>!e)}} ><Icon name="Cross"></Icon></CardAction>
        </CardHeader>

        <CardContent className='confirmation-font-content'>
          {children} 
        </CardContent>

        <CardFooter className='justify-end gap-2' >
            <Button variant="neutral" size={'extraSmall'} onClick={onCancelClick}>Cancel</Button>
            <Button variant="primary" size={'extraSmall'} onClick={onConfirmClick}>Confirm</Button>
        </CardFooter>
    </Card>
  )
}

export default Confirmation
