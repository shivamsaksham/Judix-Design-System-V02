"use client"

import * as React from "react"
import { Icon } from "@judix/icon"
import { cn } from "@/lib/utils"
import { Option } from "@/components/ui/option"
import { Separator } from "@/components/ui/separator"

export interface SidebarItem {
  id: string
  label: string
  icon: string
  section: "general" | "subscriptions" | "support" | "danger"
}

export interface SecondarySidebarProps {
  activeItem?: string
  onSelect?: (id: string) => void
  onLogout?: () => void
  className?: string
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  // General settings
  { id: "account", label: "My Account", icon: "profile-circle", section: "general" },
  { id: "activity", label: "My Activity", icon: "chart-e", section: "general" },
  { id: "notifications", label: "Notifications", icon: "notification-b", section: "general" },
  
  // My subscriptions
  { id: "billing", label: "Billing Information", icon: "wallet-a", section: "subscriptions" },
  { id: "subscription", label: "Subscriptions", icon: "refresh-a", section: "subscriptions" },
  
  // Help & Support
  { id: "helpdesk", label: "Helpdesk", icon: "call", section: "support" },
  { id: "how-to-use", label: "How to use Judix?", icon: "video-square", section: "support" },
  { id: "refer", label: "Refer and earn", icon: "user", section: "support" },
]

export function SecondarySidebar({
  activeItem,
  onSelect,
  onLogout,
  className,
}: SecondarySidebarProps) {
  const renderSection = (section: SidebarItem["section"], title?: string) => {
    const items = SIDEBAR_ITEMS.filter((item) => item.section === section)
    
    return (
      <div className="flex flex-col gap-1">
        {title && (
          <h3 className="p-1 text-style-label-default-regular text-color-text-neutral-placeholder">
            {title}
          </h3>
        )}
        <div className="flex flex-col">
          {items.map((item) => (
            <Option
              key={item.id}
              title={item.label}
              selected={activeItem === item.id}
              onClick={() => onSelect?.(item.id)}
              prefixSlot={
                <Icon 
                  name={item.icon as any} 
                  size={18} 
                  className="text-color-icon-neutral-default"
                />
              }
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "w-60 p-4 bg-color-surface-neutral-default border border-color-border-neutral-default rounded-radius-interactiveelement flex flex-col gap-6",
      className
    )}>
      {renderSection("general", "General settings")}
      {renderSection("subscriptions", "My subscriptions")}
      {renderSection("support", "Help & Support")}
      
      <div className="flex flex-col gap-2">
        <Separator className="bg-color-border-neutral-default" />
        <Option
          title={<span className="text-color-text-feedback-error-default font-medium">Logout</span>}
          onClick={onLogout}
          prefixSlot={
            <Icon 
              name="logout-b" 
              size={20} 
              className="text-color-text-feedback-error-default" 
            />
          }
          className="h-10"
        />
      </div>
    </div>
  )
}
