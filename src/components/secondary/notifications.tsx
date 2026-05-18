"use client"

import * as React from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { NotificationTile } from "@/components/block/notification-tile"
import { cn } from "@/lib/utils"

export interface NotificationItem {
  id: string
  title: string
  description: string
  createdAt: Date | string
  state: 'read' | 'unread'
  iconName?: string
}

export interface NotificationsProps {
  notifications: NotificationItem[]
  onMarkAsRead?: (id: string) => void
  onMarkAllAsRead?: () => void
  onClickNotification?: (id: string) => void
  className?: string
}

const getNotificationGroup = (date: Date): string => {
  const now = new Date()
  const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  
  const diffTime = todayDate.getTime() - compareDate.getTime()
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays <= 0) {
    return "Today"
  }
  if (diffDays === 1) {
    return "Yesterday"
  }
  if (diffDays <= 3) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return daysOfWeek[date.getDay()]
  }
  
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  })
}

const formatTileTime = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }).toLowerCase()
}

export function Notifications({
  notifications: initialNotifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onClickNotification,
  className,
}: NotificationsProps) {
  const [filter, setFilter] = React.useState<"all" | "unread">("all")
  
  const normalizedNotifications = React.useMemo(() => {
    return initialNotifications.map(n => ({
      ...n,
      parsedDate: typeof n.createdAt === "string" ? new Date(n.createdAt) : n.createdAt
    })).sort((a, b) => b.parsedDate.getTime() - a.parsedDate.getTime())
  }, [initialNotifications])

  const filteredNotifications = React.useMemo(() => {
    if (filter === "unread") {
      return normalizedNotifications.filter(n => n.state === "unread")
    }
    return normalizedNotifications
  }, [normalizedNotifications, filter])

  const totalCount = normalizedNotifications.length
  const unreadCount = normalizedNotifications.filter(n => n.state === "unread").length

  const groupedNotifications = React.useMemo(() => {
    const groups: { [key: string]: typeof normalizedNotifications } = {}
    
    filteredNotifications.forEach(n => {
      const groupName = getNotificationGroup(n.parsedDate)
      if (!groups[groupName]) {
        groups[groupName] = []
      }
      groups[groupName].push(n)
    })
    
    return groups
  }, [filteredNotifications])

  const handleMarkAllAsRead = () => {
    onMarkAllAsRead?.()
  }

  return (
    <div className={cn("w-full flex flex-col gap-6 pb-20 bg-color-surface-neutral-default", className)}>
      <div className="flex flex-col gap-2">
        <h2 className="p-1 text-style-heading-xs-emphasis text-color-text-neutral-default">
          Notifications
        </h2>
        <div className="border-b border-color-border-neutral-default h-px" />
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-2 items-center">
          <Label
            colorScheme={filter === "all" ? "primary" : "neutral"}
            selected={filter === "all"}
            onClick={() => setFilter("all")}
            size="small"
            className="cursor-pointer font-medium"
          >
            All ({totalCount})
          </Label>
          <Label
            colorScheme={filter === "unread" ? "primary" : "neutral"}
            selected={filter === "unread"}
            onClick={() => setFilter("unread")}
            size="small"
            className="cursor-pointer font-medium"
          >
            Unread ({unreadCount})
          </Label>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="neutral"
            size="extraSmall"
            onClick={handleMarkAllAsRead}
            className="text-style-body-default-emphasis text-color-text-feedback-info-default border-none bg-transparent hover:bg-color-surface-neutral-hover_mild shadow-none cursor-pointer"
          >
            Mark all as read
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 border border-dashed border-color-border-neutral-default rounded-radius-interactiveelement bg-color-surface-neutral-default">
            <p className="text-style-body-default-regular text-color-text-neutral-tertiary">
              No notifications to display.
            </p>
          </div>
        ) : (
          Object.keys(groupedNotifications).map((groupName) => (
            <div key={groupName} className="flex flex-col gap-2">
              <h3 className="p-1 text-xs font-semibold tracking-wider uppercase text-color-text-neutral-tertiary text-style-label-default-emphasis">
                {groupName}
              </h3>
              
              <div className="flex flex-col border border-color-border-neutral-default rounded-lg overflow-hidden shadow-xs">
                {groupedNotifications[groupName].map((n, idx) => (
                  <NotificationTile
                    key={n.id}
                    title={n.title}
                    description={n.description}
                    timestamp={`${groupName === "Today" || groupName === "Yesterday" ? groupName : getNotificationGroup(n.parsedDate)}, ${formatTileTime(n.parsedDate)}`}
                    state={n.state}
                    onMarkAsRead={() => onMarkAsRead?.(n.id)}
                    onClick={() => onClickNotification?.(n.id)}
                    iconName={n.iconName}
                    className={cn(
                      "border-b-0 border-color-border-neutral-default",
                      idx < groupedNotifications[groupName].length - 1 && "border-b"
                    )}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
