"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Icon } from "@judix/icon"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import Confirmation from "@/components/block/confirmation"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export interface UsageMetric {
  label: string
  current: number
  total: number
  unit?: string
  icon: React.ElementType
  tooltipText?: string
}

export interface SubscriptionProps {
  planName: string
  price: string
  renewalDate: string
  lastPaymentDate: string
  usageLimits: UsageMetric[]
  fixedQuotas: UsageMetric[]
  onChangePlan?: () => void
  onViewInvoice?: () => void
  invoiceUrl?: string
  onCancelSubscription?: () => void
  whatsappUrl?: string
  supportEmail?: string
  className?: string
}

function UsageCard({ metric, className }: { metric: UsageMetric, className?: string }) {
  const isUnlimited = metric.total === -1
  const isOverflow = !isUnlimited && metric.current > metric.total
  const percentage = isUnlimited
    ? 0
    : (metric.total && metric.total > 0) ? Math.min((metric.current / metric.total) * 100, 100) : 0;

  return (
    <Card className={cn("rounded-radius-interactiveelement border-color-border-neutral-default shadow-none", className)}>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-color-text-neutral-default opacity-80">
              <Icon name="message-text-a" size={18} />
            </div>
            <span className="p-1 text-style-body-default-emphasis text-color-text-neutral-default">
              {metric.label}
            </span>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-color-text-neutral-disabled hover:text-color-text-neutral-default transition-colors">
                <Icon name="info-circle" size={16} />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-[280px] wrap-break whitespace-normal">
              {metric.tooltipText || `Tooltip content for ${metric.label} goes here.`}
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-baseline gap-1">
            <span className={`text-style-heading-xs-emphasis ${cn(
              "",
              isOverflow ? "text-color-text-feedback-error-default" : "text-color-text-neutral-default"
            )}`}>
              {metric.current}
            </span>
            <span className="text-style-body-default-emphasis text-color-text-neutral-tertiary">
              {isUnlimited ? "/ Unlimited" : `/ ${metric.total} ${metric.unit || ""}`}
            </span>
          </div>

          {!isUnlimited && (
            <Progress
              value={percentage}
              className="h-1 bg-color-border-neutral-default"
              indicatorClassName="bg-color-border-primary-strong"
            />
          )}
        </div>

      </CardContent>
    </Card>
  )
}

export function Subscription({
  planName,
  price,
  renewalDate,
  lastPaymentDate,
  usageLimits,
  fixedQuotas,
  onChangePlan,
  onViewInvoice,
  invoiceUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  onCancelSubscription,
  whatsappUrl = "https://wa.me/918076045610",
  supportEmail = "support@judix.in",
  className,
}: SubscriptionProps) {
  const [showCancelConfirm, setShowCancelConfirm] = React.useState(false)
  const router = useRouter()
  return (
    <div className={cn("w-full pb-33 flex flex-col gap-6 bg-color-surface-neutral-default", className)}>
      {/* Header */}
      <div className="flex flex-col gap-2 pb-2 border-b border-color-border-neutral-default">
        <h1 className="p-1 text-style-heading-xs-emphasis text-color-text-neutral-default">Subscriptions</h1>
        <p className="p-1  text-style-body-default-regular text-color-text-neutral-tertiary">
          Manage your plans and payments
        </p>
      </div>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <Card className="overflow-hidden border rounded-radius-interactiveelement border-color-border-neutral-default">
            <CardContent className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="p-1 inline-block text-style-body-title-emphasis text-color-text-neutral-default">{planName}</span>
                <Button variant="neutral" size="extraSmall" onClick={() => router.push('/checkout')}>
                  Upgrade plan
                </Button>
              </div>
              <div className="flex flex-col">
                <span className="p-1 inline-block text-style-heading-md-emphasis text-color-text-neutral-default">
                  {price}
                </span>
                <p className="p-1 text-style-body-default-regular text-color-text-neutral-tertiary">
                  Renews at {renewalDate}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end pr-1">
            <p className="p-1 text-style-label-default-regular text-color-text-neutral-tertiary">
              Last payment on {lastPaymentDate}. {" "}
              <button
                onClick={() => {
                  // Comment: Opens the PDF invoice of the last payment made in a new tab
                  if (onViewInvoice) {
                    onViewInvoice();
                  } else if (invoiceUrl) {
                    window.open(invoiceUrl, "_blank", "noopener,noreferrer");
                  }
                }}
                className="italic text-color-text-feedback-info-default hover:underline cursor-pointer"
              >
                View Invoice
              </button>
            </p>
          </div>
        </div>

        {/* Usage limits */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <h2 className="p-1 text-style-body-title-emphasis text-color-text-neutral-default">Usage limits</h2>
            <p className="p-1 text-style-body-default-regular text-color-text-neutral-tertiary">
              These usage limits are renewed every month.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-4">
            {usageLimits.map((metric) => (
              <UsageCard key={metric.label} metric={metric} className="w-full lg:w-[240px]" />
            ))}
          </div>
        </div>

        {/* Fixed Quota */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <h2 className="p-1 text-style-body-title-emphasis text-color-text-neutral-default">Fixed Quota</h2>
            <p className="p-1 text-style-body-default-regular text-color-text-neutral-tertiary">
              These are one-time quota and is bound to the plan subscribed.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fixedQuotas.map((metric) => (
              <UsageCard key={metric.label} metric={metric} className="w-full" />
            ))}
          </div>
        </div>
      </div>
      {/* Cancel Subscription */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-4 border-color-border-neutral-default gap-4 md:gap-12">
        <div className="flex flex-col w-full py-2">
          <h3 className="p-1 text-style-body-default-emphasis text-color-text-neutral-default">Cancel Subscription</h3>
          <p className="p-1 text-style-textblock-primary-subtext text-color-text-neutral-tertiary">
            This will cancel your current subscription and move to the free plan in the next billing cycle.
          </p>
        </div>
        <Confirmation
          open={showCancelConfirm}
          onOpenChange={setShowCancelConfirm}
          mainText="Cancel Subscription"
          subText="Are you sure you want to cancel your subscription? This will move you to the free plan in the next billing cycle."
          confirmVariant="destructive"
          confirmText="Cancel Subscription"
          onConfirmClick={() => {
            onCancelSubscription?.()
            setShowCancelConfirm(false)
          }}
          onCancelClick={() => setShowCancelConfirm(false)}
        >
          <Button variant="destructive" size="extraSmall">
            Cancel
          </Button>
        </Confirmation>
      </div>

      {/* Footer Support */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center flex-wrap text-style-body-default-regular text-color-text-neutral-secondary">
          <span className="p-1">For any issue, contact us directly on</span>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="p-1 flex items-center gap-1 text-color-text-feedback-info-default hover:underline cursor-pointer">
            WhatsApp
          </a>
          <span className="p-1">or email us at</span>
          <a href={`mailto:${supportEmail}`} className="p-1 text-color-text-feedback-info-default hover:underline cursor-pointer">
            {supportEmail}
          </a>
        </div>
        <p className="p-1 text-style-body-default-regular italic text-color-text-neutral-secondary">
          We usually reply within 2 hours.
        </p>
      </div>
    </div>
  )
}
