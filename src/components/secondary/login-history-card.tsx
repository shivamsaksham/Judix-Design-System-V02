import * as React from "react"
import { Card, CardHeader, CardTitle, CardAction, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Icon } from "@judix/icon"

export interface LoginHistoryEntry {
  date: string
  time: string
  location: string
}

export interface LoginHistoryCardProps extends React.ComponentProps<typeof Card> {
  logins?: LoginHistoryEntry[]
  onClose?: () => void
}


export function LoginHistoryCard({
  logins = [],
  onClose,
  className,
  ...props
}: LoginHistoryCardProps) {
  return (
    <Card className={cn("w-[498px] bg-color-surface-neutral-default p-6 rounded-radius-modal border-none", className)} {...props}>
      <CardHeader className="text-style-body-default-emphasis text-color-text-neutral-default flex flex-row items-center justify-between">
        <CardTitle className="p-1 text-style-body-default-emphasis text-color-text-neutral-default">Previous logins</CardTitle>
        <CardAction className="row-span-1 col-start-2 items-center cursor-pointer" onClick={onClose}>
          <Icon name="cross" className="text-color-icon-neutral-default" />
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className="w-full">
          <table className="w-full text-left border-collapse">
            <thead className="[&>tr]:border-color-border-neutral-default">
              <tr className="border-b">
                <th className="align-top pr-8 w-fit">
                  <div className="my-1 p-1 text-style-body-default-emphasis text-color-text-neutral-default whitespace-nowrap">Date</div>
                </th>
                <th className="align-top pr-8 w-fit">
                  <div className="my-1 p-1 text-style-body-default-emphasis text-color-text-neutral-default whitespace-nowrap">Time</div>
                </th>
                <th className="align-top">
                  <div className="my-1 p-1 text-style-body-default-emphasis text-color-text-neutral-default">Location</div>
                </th>
              </tr>
            </thead>
            <tbody >
              {logins.map((login, idx) => (
                <tr key={idx} className="border-b border-color-border-neutral-default last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="align-top pr-8">
                    <div className="mt-[10px] mb-2 p-1 text-style-label-default-regular text-color-text-neutral-default whitespace-nowrap">{login.date}</div>
                  </td>
                  <td className="align-top pr-8">
                    <div className="mt-[10px] mb-2 p-1 text-style-label-default-regular text-color-text-neutral-default whitespace-nowrap">{login.time}</div>
                  </td>
                  <td className="align-top">
                    <div className="mt-[10px] mb-2 p-1 text-style-label-default-regular text-color-text-neutral-default">{login.location}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
