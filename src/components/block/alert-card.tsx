import React, { useEffect } from 'react'
import { Icon } from 'judix-icon'
import { cn } from '@/lib/utils'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/labels'

export interface AlertCardProps {
  onButtonClick: () => void;
}

function AlertCard( {onButtonClick, children}: AlertCardProps & {children: React.ReactNode}) {
  const [hidden, setHidden] = React.useState(false);
   
  return (
    <Card className={`${hidden ? 'hidden' : ''} rounded-alert_card-border-radius-default border-alert_card-border-weight-default bg-alert_card-color-bg alert_card-border-weight-default border-alert_card-color-stroke `} >
        <CardHeader >
          <CardTitle className='flex flex-row gap-1 alert_card-font-title'>
            <Icon name="Danger" ></Icon>
             Alert
          </CardTitle>
          <CardAction className='hover:cursor-pointer'onClick={()=>{setHidden((e)=>!e)}} ><Icon name="Cross"></Icon></CardAction>
        </CardHeader>

        <CardContent>
          {children} 
          
        </CardContent>

        <CardFooter >
          <Label colorScheme='primary' size="medium" className='cursor-pointer ' onClick={onButtonClick}>Requesr access</Label>
        </CardFooter>
    </Card>
  )
}

export default AlertCard
