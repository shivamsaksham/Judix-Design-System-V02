"use client"

import * as React from "react"
import Link from "next/link"
import {Icon} from "@judix/icon"
import { ChevronRight, Menu } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BreadcrumbItem {
  label: string
  href?: string
  active?: boolean
}

export interface SecondaryBreadcrumbProps extends React.ComponentPropsWithoutRef<"nav"> {
  items: BreadcrumbItem[]
  variant?: "desktop" | "mobile"
  onMenuClick?: () => void
}

export function SecondaryBreadcrumb({
  items,
  variant = "desktop",
  onMenuClick,
  className,
  ...props
}: SecondaryBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center",
        variant === "desktop" ? "py-2" : "px-4 py-2 gap-2",
        className)}
      {...props}
    >
      {variant === "mobile" && (
        <button
          onClick={onMenuClick}
          className="p-1 -ml-1 text-color-text-neutral-default hover:bg-color-surface-neutral-hover_default rounded-md transition-colors cursor-pointer"
          aria-label="Open menu"
        >
          <Icon name="menu-b" className="w-5 h-5" />
        </button>
      )}

      <ol className="flex items-center  m-0 p-0 list-none">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const isActive = item.active || isLast

          return (
            <React.Fragment key={item.label}>
              <li className="flex items-center ">
                {item.href && !isActive ? (
                  <Link
                    href={item.href}
                    className="p-1 text-style-label-default-regular text-color-text-neutral-tertiary hover:text-color-text-neutral-default transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={cn(
                      "p-1 text-style-label-default-regular",
                      isActive
                        ? "text-color-text-neutral-default"
                        : "text-color-text-neutral-tertiary"
                    )}
                  >
                    {item.label}
                  </span>
                )}
              </li>
              {!isLast && (
                <li aria-hidden="true" className="text-color-text-neutral-tertiary">
                  <Icon name="arrow-right-a" className="w-3 h-3" />
                </li>
              )}
            </React.Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
