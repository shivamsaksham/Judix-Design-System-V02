"use client";

import React, { useState } from "react";
import { PricingCard, PricingCardProps, PricingFeature } from "./pricing-card";
import { Button } from "../ui/button";
import { formatBytes } from "@/lib/format-bytes";

/** Feature flags carried on a backend plan. */
export interface BackendPlanFeature {
    canSearchSc?: boolean;
    canSearchHC?: boolean;
    canCentralActs?: boolean;
    canStateLegislationActs?: boolean;
    canInLineCictaion?: boolean;
    canJudgementSummaries?: boolean;
    canDownloadJudgementPdf?: boolean;
    canFullJudgementView?: boolean;
    researchHistoryRange?: number;
    exportUsageDataRange?: number;
    maxCourts?: number;
}

/** Subset of the backend plan record this component reads. */
export interface BackendPlan {
    _id?: string;
    name: string;
    price: number;
    interval?: 'monthly' | 'yearly';
    isPopular?: boolean;
    discountPercentage?: number;
    credits?: number;
    creditsPerCycle?: number;
    storage?: number;
    projects?: number;
    queriesPerMonth?: number;
    pagesPerMonth?: number;
    feature?: BackendPlanFeature;
    isActive?: boolean;
}

export type PlanQuota = Pick<BackendPlan, "queriesPerMonth" | "pagesPerMonth" | "storage" | "projects">;

const UNLIMITED = "Unlimited";

const formatCount = (value: number) => (value === -1 ? UNLIMITED : value.toLocaleString("en-IN"));

export function buildPlanUsage(plan: PlanQuota, billingCycle: "monthly" | "yearly"): PricingFeature[] {
  const cycleMultiplier = billingCycle === "yearly" ? 12 : 1;
  const perCycle = (value = 0) => (value === -1 ? UNLIMITED : formatCount(value * cycleMultiplier));
  const storage = plan.storage ?? 0;

  return [
    { label: "AI queries", value: perCycle(plan.queriesPerMonth) },
    { label: "Document pages", value: perCycle(plan.pagesPerMonth) },
    { label: "Storage", value: storage === -1 ? UNLIMITED : storage > 0 ? formatBytes(storage) : false },
    { label: "Projects", value: formatCount(plan.projects ?? 0) },
  ];
}

const GIGABYTE = 1024 ** 3;

const fallbackQuotas: Record<string, PlanQuota> = {
  Lite: { queriesPerMonth: 50, pagesPerMonth: 100, storage: GIGABYTE, projects: 3 },
  Basic: { queriesPerMonth: 500, pagesPerMonth: 1000, storage: 100 * GIGABYTE, projects: 100 },
  Pro: { queriesPerMonth: 1500, pagesPerMonth: 5000, storage: 250 * GIGABYTE, projects: -1 },
};

export const monthlyPlans: PricingCardProps[] = [
  {
    tier: "Lite",
    description: "For lawyers just getting started with AI research",
    price: 0,
    usage: buildPlanUsage(fallbackQuotas.Lite, "monthly"),
    features: [
      { label: "Supreme Court judgments", value: true },
      // { label: "High Courts judgments", value: false },
      { label: "Central acts", value: true },
      // { label: "State legislation acts", value: false },
      { label: "In-line citations", value: true },
      { label: "Judgment summaries", value: true },
      { label: "Download judgment pdf", value: false },
      { label: "Full judgment view", value: true },
      { label: "Research history", value: "30 days" },
      { label: "Export usage data", value: "Last 60 days" },
    ],
    support: [
      { label: "Email and Whatsapp support", value: true },
      { label: "Priority support", value: false },
      { label: "Dedicated account manager", value: false },
    ],
  },
  {
    tier: "Basic",
    description: "Best for individual lawyers and solo practitioners",
    price: 1499,
    isPopular: true,
    usage: buildPlanUsage(fallbackQuotas.Basic, "monthly"),
    features: [
      { label: "Supreme Court judgments", value: true },
      // { label: "High Courts judgments", value: true },
      { label: "Central acts", value: true },
      // { label: "State legislation acts", value: true },
      { label: "In-line citations", value: true },
      { label: "Judgment summaries", value: true },
      { label: "Download judgment pdf", value: true },
      { label: "Full judgment view", value: true },
      { label: "Research history", value: "180 days" },
      { label: "Export usage data", value: "Last 180 days" },
    ],
    support: [
      { label: "Email and Whatsapp support", value: true },
      { label: "Priority support", value: true },
      { label: "Dedicated account manager", value: false },
    ],
  },
  {
    tier: "Pro",
    description: "Collaborative research for serious practices.",
    price: 3299,
    usage: buildPlanUsage(fallbackQuotas.Pro, "monthly"),
    features: [
      { label: "Supreme Court judgments", value: true },
      // { label: "High Courts judgments", value: true },
      { label: "Central acts", value: true },
      // { label: "State legislation acts", value: true },
      { label: "In-line citations", value: true },
      { label: "Judgment summaries", value: true },
      { label: "Download judgment pdf", value: true },
      { label: "Full judgment view", value: true },
      { label: "Research history", value: "Lifetime" },
      { label: "Export usage data", value: "Lifetime" },
    ],
    support: [
      { label: "Email and Whatsapp support", value: true },
      { label: "Priority support", value: true },
      { label: "Dedicated account manager", value: true },
    ],
  },
];

export const yearlyPlans: PricingCardProps[] = monthlyPlans.map(plan => ({
  ...plan,
  price: typeof plan.price === "number" && plan.price > 0 ? Math.floor(plan.price * 0.8) : plan.price,
  usage: fallbackQuotas[plan.tier] ? buildPlanUsage(fallbackQuotas[plan.tier], "yearly") : plan.usage,
}));

export interface PricingTableProps {
  onSelectPlan?: (planName: string, billingCycle: "monthly" | "yearly") => void;
  backendPlans?: BackendPlan[]; // Array of plans from the backend
  currentPlan?: string; // Add currentPlan prop
  currentPlanInterval?: "monthly" | "yearly"; // Billing cycle of the active subscription
  loadingTier?: string | null;
}

export function PricingTable({ onSelectPlan, backendPlans = [], currentPlan, currentPlanInterval, loadingTier }: PricingTableProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const hasYearlyPlan = backendPlans.some((p) => p.interval === "yearly");
  const yearlyDiscountPercentage = backendPlans.find((p) => p.interval === "yearly" && p.discountPercentage)?.discountPercentage;

  // "Most popular" is decided by the backend, which excludes Free from the running and
  // falls back to Basic when no paid plan has a live subscriber. Subscriber counts are
  // never sent to the client, so the flag is the only signal available here.
  //
  // The backend tags every interval of the winning tier, so the badge stays put when the
  // billing cycle is toggled instead of disappearing on Yearly.
  const hasPopularFromBackend = backendPlans.some((p) => p.isPopular);

  const formatDays = (days: number) => {
    if (days === -1) return "Lifetime";
    return `${days} days`;
  };

  const effectiveBillingCycle = hasYearlyPlan ? billingCycle : "monthly";

  let mergedPlans = (effectiveBillingCycle === "monthly" ? monthlyPlans : yearlyPlans).map(plan => ({...plan}));

  if (backendPlans && backendPlans.length > 0) {
    const plansForCycle = backendPlans.filter(p => p.interval === effectiveBillingCycle);
    if (plansForCycle.length > 0) {
      // Deduplicate by name to prevent duplicate keys if the backend sends multiple free plans
      const uniquePlans = plansForCycle.filter((plan, index, self) =>
        index === self.findIndex((t) => t.name.toLowerCase() === plan.name.toLowerCase())
      );

      mergedPlans = uniquePlans.map(bp => {
          const isFree = bp.price === 0;
          const isPro = bp.name.toLowerCase() === 'pro';
          // The card headline is always a monthly figure — for yearly plans that's the
          // effective per-month rate (annual total / 12); the actual amount billed today
          // shows up as a caption here and as the real total on the checkout page.
          const isYearly = effectiveBillingCycle === "yearly";
          const displayPrice = isYearly && !isFree ? Math.round(bp.price / 12) : bp.price;
          return {
              tier: bp.name,
              description: isFree
                  ? "For lawyers just getting started with AI research"
                  : isPro ? "Collaborative research for serious practices." : "Best for individual lawyers and solo practitioners",
              price: displayPrice,
              billingNote: isYearly && !isFree ? `Billed INR ${bp.price.toLocaleString('en-IN')} yearly` : undefined,
              isPopular: hasPopularFromBackend
                  ? !!bp.isPopular
                  : (effectiveBillingCycle === "monthly" && bp.name.toLowerCase() === 'basic'),
              usage: buildPlanUsage(bp, bp.interval ?? effectiveBillingCycle),
              features: [
                  { label: "Supreme Court judgments", value: !!bp.feature?.canSearchSc },
                  // { label: "High Courts judgments", value: !!bp.feature?.canSearchHC },
                  { label: "Central acts", value: !!bp.feature?.canCentralActs },
                  // { label: "State legislation acts", value: !!bp.feature?.canStateLegislationActs },
                  { label: "In-line citations", value: !!bp.feature?.canInLineCictaion },
                  { label: "Judgment summaries", value: !!bp.feature?.canJudgementSummaries },
                  { label: "Download judgment pdf", value: !!bp.feature?.canDownloadJudgementPdf },
                  { label: "Full judgment view", value: !!bp.feature?.canFullJudgementView },
                  { label: "Research history", value: formatDays(bp.feature?.researchHistoryRange || 30) },
                  { label: "Export usage data", value: isFree ? "Last 60 days" : (bp.feature?.exportUsageDataRange === -1 ? "Lifetime" : `Last ${bp.feature?.exportUsageDataRange || 30} days`) },
              ],
              support: [
                  { label: "Email and Whatsapp support", value: true },
                  { label: "Priority support", value: !isFree },
                  { label: "Dedicated account manager", value: isPro },
              ]
          };
      });

      mergedPlans.sort((a, b) => Number(a.price) - Number(b.price));
    }
  }

  return (
    <div className="w-full max-w-[1264px] lg:max-w-[1280px] xl:max-w-[1312px] mx-auto flex flex-col items-center">
      {/* Toggle — only shown when a yearly plan actually exists in the backend data */}
      {hasYearlyPlan && (
        <div className="flex items-center lg:mb-8 mb-6 mt-4 gap-2 overflow-hidden">
          <button
            className={`px-4 py-2 text-style-secondary-regular-b1 border transition-colors ${effectiveBillingCycle === "monthly"
                ? "bg-color-surface-neutral-default text-color-text-neutral-default border-color-border-neutral-strong button-border-weight-large"
                : "bg-color-surface-neutral-default text-color-text-neutral-secondary hover:text-color-text-neutral-default border-color-border-neutral-default button-border-weight-default"
              }`}
            onClick={() => setBillingCycle("monthly")}
          >
            Monthly
          </button>
          <button
            className={`px-4 py-2 text-style-secondary-regular-b1 transition-colors border ${effectiveBillingCycle === "yearly"
                ? "bg-color-surface-neutral-default text-color-text-neutral-default border-color-border-neutral-strong button-border-weight-large"
                : "bg-color-surface-neutral-default text-color-text-neutral-secondary hover:text-color-text-neutral-default border-color-border-neutral-default button-border-weight-default"
              }`}
            onClick={() => setBillingCycle("yearly")}
          >
            Yearly{yearlyDiscountPercentage ? ` (save ${yearlyDiscountPercentage}%)` : ""}
          </button>
        </div>
      )}

      {/* Pricing Cards Grid — column count tracks how many plans are actually being shown */}
      <div className={`grid grid-cols-1 ${mergedPlans.length >= 3 ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2"} gap-6 lg:gap-8 xl:gap-10 gap-y-24 mb-9 pt-20 justify-items-center`}>
        {mergedPlans.map((plan) => {
          const isSameTier = currentPlan?.toLowerCase() === plan.tier.toLowerCase();
          const isFreeTier = Number(plan.price) === 0;
          const isCurrentPlan = isSameTier && (isFreeTier || !currentPlanInterval || currentPlanInterval === effectiveBillingCycle);
          // Extending the Free plan isn't a real operation (no billing cycle to renew) and
          // the backend rejects it outright, so only paid current plans get the Extend action.
          const isExtendable = isCurrentPlan && !isFreeTier;
          return (
            <PricingCard
              key={plan.tier}
              {...plan}
              billingText="per month"
              buttonLabel={isExtendable ? "Extend" : isCurrentPlan ? "Current Plan" : "Select plan"}
              buttonDisabled={isCurrentPlan && !isExtendable}
              isLoading={loadingTier === plan.tier}
              onSelect={() => (isExtendable || !isCurrentPlan) && onSelectPlan?.(plan.tier, effectiveBillingCycle)}
            />
          );
        })}
      </div>
    </div>
  );
}
