"use client"

import * as React from "react"
import Image from "next/image"
import { Icon } from "@judix/icon"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export interface InviteLandingProps {
  valid: boolean
  inviterFirstName?: string | null
  refereeReward: number
  signupHref: string
  loginHref: string
  className?: string
}

export function InviteLanding({
  valid,
  inviterFirstName,
  refereeReward,
  signupHref,
  loginHref,
  className,
}: InviteLandingProps) {
  const title = valid
    ? inviterFirstName
      ? `${inviterFirstName} invited you to Judix`
      : "You have been invited to Judix"
    : "Join Judix"

  const description = !valid
    ? "This invite link is no longer valid, but you can still create a free Judix account."
    : refereeReward > 0
      ? `Create your free account and get ${refereeReward} bonus AI queries when you subscribe to any paid plan.`
      : "Create your free account to start your legal research with Judix."

  const highlights = [
    { icon: "document-text-b" as const, text: "Research Supreme Court judgments and central acts with AI" },
    { icon: "tick-circle" as const, text: "Start on the free plan" },
    ...(valid && refereeReward > 0
      ? [{ icon: "gift" as const, text: `${refereeReward} bonus AI queries on your first paid plan` }]
      : []),
  ]

  return (
    <div className={cn("min-h-[100dvh] w-full flex flex-col items-center justify-center gap-6 p-4 bg-color-surface-neutral-subtle_bg", className)}>
      <Image src="/logo.svg" alt="Judix" width={81} height={26} style={{ width: "81px", height: "26px" }} priority />
      <Card className="w-full max-w-[480px] rounded-radius-interactiveelement border-color-border-neutral-default bg-color-surface-neutral-default shadow-none">
        <CardContent className="flex flex-col items-center gap-6 py-4 text-center">
          <div className="w-14 h-14 rounded-full bg-color-surface-primary-subtle_bg flex items-center justify-center">
            <Icon name={valid ? "gift" : "user-add"} size={26} className="text-color-icon-primary-default" />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="p-1 text-style-heading-xs-emphasis text-color-text-neutral-default">{title}</h1>
            <p className="p-1 text-style-body-default-regular text-color-text-neutral-tertiary">{description}</p>
          </div>
          <ul className="w-full flex flex-col gap-2 text-left">
            {highlights.map((item) => (
              <li key={item.text} className="flex items-center gap-2 px-3 py-2 rounded-radius-interactiveelement bg-color-surface-neutral-subtle_bg">
                <Icon name={item.icon} size={16} className="shrink-0 text-color-icon-primary-default" />
                <span className="text-style-body-default-regular text-color-text-neutral-default">{item.text}</span>
              </li>
            ))}
          </ul>
          <Button asChild variant="primary" size="large" className="w-full">
            <a href={signupHref}>Create free account</a>
          </Button>
          <p className="text-style-body-default-regular text-color-text-neutral-tertiary">
            Already have an account?{" "}
            <a href={loginHref} className="text-color-text-feedback-info-default hover:underline">
              Sign in
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
