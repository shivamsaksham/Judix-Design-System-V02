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


function AlertCard({children}: React.PropsWithChildren ) {
    const [hidden, setHidden] = React.useState(false);
   
  return (
    <Card className={`${hidden ? 'hidden' : ''}`}>
        <CardHeader >
          <CardTitle className='flex flex-row gap-1 font-family-brandprimary text-style-body-title-bold'>
            <Icon name="Danger" ></Icon>
             Alert
          </CardTitle>
          
          <CardAction className='hover:cursor-pointer'onClick={()=>{setHidden((e)=>!e)}} ><Icon name="Cross"></Icon></CardAction>
        </CardHeader>
        <CardContent>
          {children} 
          
        </CardContent>
        <CardFooter >
          <Button className="tracking-tracking-body-default px-3 py-1 border-2 rounded-label-border-radius-default border-label-color-primary-stroke bg-label-color-primary-bg text-label-color-primary-text" >Request access</Button>
        </CardFooter>
    </Card>
  )
}

export default AlertCard
