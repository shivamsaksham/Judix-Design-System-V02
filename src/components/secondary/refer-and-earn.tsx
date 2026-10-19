"use client"

import * as React from "react"
import { Icon } from "@judix/icon"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TextInput } from "@/components/ui/text-input"
import { Skeleton } from "@/components/ui/skeleton"

export type ReferralEntryStatus = "signed_up" | "pending" | "rewarded" | "capped" | "not_eligible" | "expired"
export type ReferralShareChannel = "whatsapp" | "email" | "native"
export type ReferralCopyTarget = "link" | "code"

export interface ReferralStats {
  signedUp: number
  pending: number
  rewarded: number
  earnedQueries: number
}

export interface ReferralEntry {
  id: string
  name: string
  joinedOn: string
  status: ReferralEntryStatus
  rewardQueries: number
}

export interface ReferredByInfo {
  firstName: string
  status: ReferralEntryStatus
  rewardQueries: number
}

export interface ReferAndEarnProps {
  loading?: boolean
  code: string | null
  link: string | null
  shareMessage: string
  shareSubject?: string
  referrerReward: number
  refereeReward: number
  holdDays: number
  stats: ReferralStats
  bonusQueries: number
  bonusExpiresOn?: string | null
  monthlyRewardsRemaining?: number | null
  referredBy?: ReferredByInfo | null
  canEnterCode?: boolean
  referrals: ReferralEntry[]
  hasMoreReferrals?: boolean
  loadingMoreReferrals?: boolean
  onLoadMoreReferrals?: () => void
  onCopy?: (target: ReferralCopyTarget) => void
  onCopyFailed?: () => void
  onShare?: (channel: ReferralShareChannel) => void
  onSubmitCode?: (code: string) => Promise<void>
  className?: string
}

const STATUS_STYLES: Record<ReferralEntryStatus, { label: string; className: string }> = {
  signed_up: { label: "Signed up", className: "bg-color-surface-feedback-info-subtle text-color-text-feedback-info-default" },
  pending: { label: "Reward pending", className: "bg-color-surface-feedback-warning-subtle text-color-text-feedback-warning-default" },
  rewarded: { label: "Rewarded", className: "bg-color-surface-feedback-success-subtle text-color-text-feedback-success-default" },
  capped: { label: "Limit reached", className: "bg-color-surface-neutral-subtle_bg text-color-text-neutral-tertiary" },
  not_eligible: { label: "Not eligible", className: "bg-color-surface-neutral-subtle_bg text-color-text-neutral-tertiary" },
  expired: { label: "Expired", className: "bg-color-surface-neutral-subtle_bg text-color-text-neutral-tertiary" },
}

const COPY_RESET_MS = 2000

function StatusPill({ status }: { status: ReferralEntryStatus }) {
  const style = STATUS_STYLES[status]
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 whitespace-nowrap text-style-label-default-regular", style.className)}>
      {style.label}
    </span>
  )
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <Card className="rounded-radius-interactiveelement border-color-border-neutral-default shadow-none">
      <CardContent className="flex flex-col gap-1">
        <span className="p-1 text-style-label-default-regular text-color-text-neutral-tertiary">{label}</span>
        <span className="p-1 text-style-heading-xs-emphasis text-color-text-neutral-default">{value.toLocaleString("en-IN")}</span>
      </CardContent>
    </Card>
  )
}

function Step({ icon, title, description }: { icon: React.ComponentProps<typeof Icon>["name"]; title: string; description: string }) {
  return (
    <div className="flex gap-3">
      <div className="w-9 h-9 shrink-0 rounded-full bg-color-surface-primary-subtle_bg flex items-center justify-center">
        <Icon name={icon} size={18} className="text-color-icon-primary-default" />
      </div>
      <div className="flex flex-col">
        <span className="p-1 text-style-body-default-emphasis text-color-text-neutral-default">{title}</span>
        <span className="p-1 text-style-body-default-regular text-color-text-neutral-tertiary">{description}</span>
      </div>
    </div>
  )
}

function referredByMessage(info: ReferredByInfo, holdDays: number): string {
  switch (info.status) {
    case "signed_up":
      return info.rewardQueries > 0
        ? `Subscribe to any paid plan to get your ${info.rewardQueries} bonus AI queries.`
        : "Thanks for joining through their invite."
    case "pending":
      return holdDays > 0
        ? `Your ${info.rewardQueries} bonus AI queries will be added after the ${holdDays}-day confirmation period.`
        : `Your ${info.rewardQueries} bonus AI queries will be added shortly.`
    case "rewarded":
      return `${info.rewardQueries} bonus AI queries were added to your account.`
    case "expired":
      return "This invite expired before a paid plan was purchased."
    default:
      return "This invite is not eligible for a reward."
  }
}

function LoadingState() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-44 w-full rounded-radius-interactiveelement" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-20 w-full rounded-radius-interactiveelement" />
        ))}
      </div>
      <Skeleton className="h-32 w-full rounded-radius-interactiveelement" />
    </div>
  )
}

export function ReferAndEarn({
  loading = false,
  code,
  link,
  shareMessage,
  shareSubject = "Join me on Judix",
  referrerReward,
  refereeReward,
  holdDays,
  stats,
  bonusQueries,
  bonusExpiresOn,
  monthlyRewardsRemaining,
  referredBy,
  canEnterCode = false,
  referrals,
  hasMoreReferrals = false,
  loadingMoreReferrals = false,
  onLoadMoreReferrals,
  onCopy,
  onCopyFailed,
  onShare,
  onSubmitCode,
  className,
}: ReferAndEarnProps) {
  const [copied, setCopied] = React.useState<ReferralCopyTarget | null>(null)
  const [canNativeShare, setCanNativeShare] = React.useState(false)
  const [codeInput, setCodeInput] = React.useState("")
  const [codeError, setCodeError] = React.useState<string | null>(null)
  const [submittingCode, setSubmittingCode] = React.useState(false)

  React.useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function")
  }, [])

  React.useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(null), COPY_RESET_MS)
    return () => clearTimeout(timer)
  }, [copied])

  const handleCopy = async (target: ReferralCopyTarget) => {
    const value = target === "link" ? link : code
    if (!value) return
    try {
      await navigator.clipboard.writeText(value)
      setCopied(target)
      onCopy?.(target)
    } catch {
      onCopyFailed?.()
    }
  }

  const handleShare = (channel: ReferralShareChannel) => {
    if (channel === "whatsapp") {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, "_blank", "noopener,noreferrer")
    } else if (channel === "email") {
      window.location.href = `mailto:?subject=${encodeURIComponent(shareSubject)}&body=${encodeURIComponent(shareMessage)}`
    } else {
      navigator.share?.({ title: shareSubject, text: shareMessage }).catch(() => undefined)
    }
    onShare?.(channel)
  }

  const handleSubmitCode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = codeInput.trim().toUpperCase()
    if (!value) {
      setCodeError("Enter an invite code")
      return
    }
    setSubmittingCode(true)
    setCodeError(null)
    try {
      await onSubmitCode?.(value)
      setCodeInput("")
    } catch (error) {
      setCodeError(typeof error === "string" ? error : error instanceof Error ? error.message : "Could not apply this code")
    } finally {
      setSubmittingCode(false)
    }
  }

  const offerTitle = refereeReward > 0
    ? `Give ${refereeReward}, get ${referrerReward} bonus AI queries`
    : `Get ${referrerReward} bonus AI queries for every colleague`
  const offerDescription = refereeReward > 0
    ? `Your colleague gets ${refereeReward} bonus AI queries when they subscribe to any paid plan using your link, and you get ${referrerReward}.`
    : `You get ${referrerReward} bonus AI queries when a colleague subscribes to any paid plan using your link.`
  const rewardTiming = holdDays > 0 ? `after a ${holdDays}-day confirmation period` : "once the payment is confirmed"

  return (
    <div className={cn("w-full pb-33 flex flex-col gap-6 bg-color-surface-neutral-default", className)}>
      <div className="flex flex-col gap-2 pb-2 border-b border-color-border-neutral-default">
        <h1 className="p-1 text-style-heading-xs-emphasis text-color-text-neutral-default">Refer and earn</h1>
        <p className="p-1 text-style-body-default-regular text-color-text-neutral-tertiary">
          Invite colleagues to Judix and earn bonus AI queries
        </p>
      </div>

      {loading ? (
        <LoadingState />
      ) : (
        <div className="flex flex-col gap-8">
          <Card className="rounded-radius-interactiveelement border-color-border-neutral-default shadow-none">
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 shrink-0 rounded-full bg-color-surface-primary-subtle_bg flex items-center justify-center">
                  <Icon name="gift" size={20} className="text-color-icon-primary-default" />
                </div>
                <div className="flex flex-col">
                  <span className="p-1 text-style-body-title-emphasis text-color-text-neutral-default">{offerTitle}</span>
                  <span className="p-1 text-style-body-default-regular text-color-text-neutral-tertiary">{offerDescription}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 min-w-0 h-[42px] flex items-center gap-2 px-3 border border-textinput-color-stroke-default rounded-textinput-border-radius-default bg-color-surface-neutral-subtle_bg">
                  <Icon name="link-a" size={16} className="shrink-0 text-color-icon-neutral-secondary" />
                  <span className="truncate text-style-body-default-regular text-color-text-neutral-default" data-private>
                    {link ?? "—"}
                  </span>
                </div>
                <Button
                  variant="primary"
                  size="small"
                  prefixIcon={copied === "link" ? "copy-success" : "copy"}
                  disabled={!link}
                  onClick={() => handleCopy("link")}
                >
                  {copied === "link" ? "Copied" : "Copy link"}
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="p-1 text-style-body-default-regular text-color-text-neutral-tertiary">Your code</span>
                  <span className="px-2 py-1 rounded-radius-interactiveelement bg-color-surface-neutral-subtle_bg text-style-body-default-emphasis text-color-text-neutral-default tracking-wider">
                    {code ?? "—"}
                  </span>
                  <button
                    type="button"
                    aria-label="Copy referral code"
                    disabled={!code}
                    onClick={() => handleCopy("code")}
                    className="p-1 text-color-icon-neutral-secondary hover:text-color-text-neutral-default transition-colors cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Icon name={copied === "code" ? "copy-success" : "copy"} size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="neutral" size="extraSmall" prefixIcon="whatsapp" disabled={!link} onClick={() => handleShare("whatsapp")}>
                    WhatsApp
                  </Button>
                  <Button variant="neutral" size="extraSmall" prefixIcon="sms" disabled={!link} onClick={() => handleShare("email")}>
                    Email
                  </Button>
                  {canNativeShare && (
                    <Button variant="neutral" size="extraSmall" prefixIcon="share-a" disabled={!link} onClick={() => handleShare("native")}>
                      Share
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatTile label="Signed up" value={stats.signedUp} />
            <StatTile label="Reward pending" value={stats.pending} />
            <StatTile label="Rewarded" value={stats.rewarded} />
            <StatTile label="Queries earned" value={stats.earnedQueries} />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-3 rounded-radius-interactiveelement bg-color-surface-neutral-subtle_bg">
            <div className="flex items-center gap-2">
              <Icon name="wallet-a" size={18} className="text-color-icon-neutral-secondary" />
              <span className="p-1 text-style-body-default-emphasis text-color-text-neutral-default">
                {bonusQueries > 0 ? `${bonusQueries.toLocaleString("en-IN")} bonus AI queries available` : "No bonus AI queries yet"}
              </span>
            </div>
            <span className="p-1 text-style-label-default-regular text-color-text-neutral-tertiary">
              {bonusQueries > 0
                ? `Used after your plan queries run out${bonusExpiresOn ? ` · Valid until ${bonusExpiresOn}` : ""}`
                : "Bonus queries are used after your plan queries run out"}
            </span>
          </div>

          {referredBy && (
            <div className="flex items-start gap-3 px-4 py-3 rounded-radius-interactiveelement border border-color-border-neutral-default">
              <Icon name="people" size={18} className="mt-1 shrink-0 text-color-icon-neutral-secondary" />
              <div className="flex flex-col">
                <span className="p-1 text-style-body-default-emphasis text-color-text-neutral-default">
                  You were invited by {referredBy.firstName}
                </span>
                <span className="p-1 text-style-body-default-regular text-color-text-neutral-tertiary">
                  {referredByMessage(referredBy, holdDays)}
                </span>
              </div>
            </div>
          )}

          {canEnterCode && !referredBy && (
            <form onSubmit={handleSubmitCode} className="flex flex-col gap-2">
              <div className="flex flex-col">
                <h2 className="p-1 text-style-body-title-emphasis text-color-text-neutral-default">Have an invite code?</h2>
                <p className="p-1 text-style-body-default-regular text-color-text-neutral-tertiary">
                  {refereeReward > 0
                    ? `Apply a colleague's code before your first paid plan to get ${refereeReward} bonus AI queries.`
                    : "Apply a colleague's code before your first paid plan so they get credit for inviting you."}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:items-start">
                <div className="flex-1">
                  <TextInput
                    value={codeInput}
                    onChange={(event) => {
                      setCodeInput(event.target.value)
                      if (codeError) setCodeError(null)
                    }}
                    placeholder="Enter invite code"
                    maxLength={16}
                    autoCapitalize="characters"
                    variant={codeError ? "error" : "default"}
                    errorMessage={codeError ?? undefined}
                  />
                </div>
                <Button type="submit" variant="neutral" size="small" loading={submittingCode} disabled={submittingCode || !codeInput.trim()}>
                  Apply
                </Button>
              </div>
            </form>
          )}

          <div className="flex flex-col gap-4">
            <h2 className="p-1 text-style-body-title-emphasis text-color-text-neutral-default">How it works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Step icon="share-a" title="Share your link" description="Send your invite link or code to a colleague." />
              <Step icon="profile-add" title="They subscribe" description="Your colleague signs up with your link and buys any paid Judix plan." />
              <Step
                icon="gift"
                title="You both earn"
                description={refereeReward > 0
                  ? `You get ${referrerReward} and they get ${refereeReward} bonus AI queries ${rewardTiming}.`
                  : `You get ${referrerReward} bonus AI queries ${rewardTiming}.`}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <h2 className="p-1 text-style-body-title-emphasis text-color-text-neutral-default">Your referrals</h2>
              {typeof monthlyRewardsRemaining === "number" && (
                <p className="p-1 text-style-body-default-regular text-color-text-neutral-tertiary">
                  You can earn {monthlyRewardsRemaining} more {monthlyRewardsRemaining === 1 ? "reward" : "rewards"} this month.
                </p>
              )}
            </div>

            {referrals.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-10 rounded-radius-interactiveelement border border-dashed border-color-border-neutral-default text-center">
                <Icon name="user-add" size={22} className="text-color-icon-neutral-secondary" />
                <p className="p-1 text-style-body-default-regular text-color-text-neutral-tertiary">
                  No referrals yet. Share your link to get started.
                </p>
              </div>
            ) : (
              <div className="flex flex-col rounded-radius-interactiveelement border border-color-border-neutral-default">
                {referrals.map((entry, index) => (
                  <div
                    key={entry.id}
                    className={cn(
                      "flex items-center justify-between gap-4 px-4 py-3",
                      index > 0 && "border-t border-color-border-neutral-default"
                    )}
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="p-1 truncate text-style-body-default-emphasis text-color-text-neutral-default">{entry.name}</span>
                      <span className="p-1 text-style-label-default-regular text-color-text-neutral-tertiary">Joined {entry.joinedOn}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {entry.status === "rewarded" && entry.rewardQueries > 0 && (
                        <span className="hidden sm:inline text-style-label-default-regular text-color-text-feedback-success-default">
                          +{entry.rewardQueries} queries
                        </span>
                      )}
                      <StatusPill status={entry.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {hasMoreReferrals && (
              <div className="flex justify-center">
                <Button variant="neutral" size="extraSmall" loading={loadingMoreReferrals} onClick={onLoadMoreReferrals}>
                  Load more
                </Button>
              </div>
            )}
          </div>

          <p className="p-1 text-style-label-default-regular text-color-text-neutral-tertiary">
            Rewards apply to a colleague&apos;s first paid plan and are added {rewardTiming}. Self-referrals, refunded payments and duplicate accounts are not eligible. Bonus queries are used after your plan&apos;s queries run out.
          </p>
        </div>
      )}
    </div>
  )
}
