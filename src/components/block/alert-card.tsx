import React from 'react'
import { Icon } from '@judix/icon'
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from '@/components/ui/label'

export interface AlertCardProps {
  hideAble: boolean,
  onButtonClick: () => void;
}

function AlertCard({ onButtonClick = () => { }, hideAble = true, children }: AlertCardProps & { children: React.ReactNode }) {
  const [hidden, setHidden] = React.useState(false);

  const hideAlert = () => {
    if (hideAble) {
      setHidden((e) => !e)
    } else {
      alert("you can't cross this alert")
    }
  }

  return (
    <Card className={`${hidden ? 'hidden' : ''} rounded-alert_card-border-radius-default border-alert_card-border-weight-default bg-alert_card-color-bg alert_card-border-weight-default border-alert_card-color-stroke sm:max-w-[493px]`} >
      <CardHeader >
        <CardTitle className='flex flex-row gap-1 alert_card-font-title'>
          <Icon name="danger"></Icon>
          Alert
        </CardTitle>
        <CardAction className='hover:cursor-pointer' onClick={hideAlert} ><Icon name="cross" className='w-5 h-5 relative'></Icon></CardAction>
      </CardHeader>

      <CardContent>
        {children}

      </CardContent>

      <CardFooter >
        <Label colorScheme='primary' size="medium" className='cursor-pointer ' onClick={onButtonClick}>Request access</Label>
      </CardFooter>
    </Card>
  )
}

export default AlertCard
